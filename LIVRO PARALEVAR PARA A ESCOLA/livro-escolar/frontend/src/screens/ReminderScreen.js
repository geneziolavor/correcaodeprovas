import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert, Switch, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { getReminders, addReminder, deleteReminder, deleteAllReminders, getStudents, getSchedulesByDayAndSerie } from '../api/api';

const ReminderScreen = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    checkNotificationPermissions();
    loadData();
  }, []);

  const checkNotificationPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setNotificationsEnabled(status === 'granted');
  };

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setNotificationsEnabled(status === 'granted');
    
    if (status !== 'granted') {
      Alert.alert(
        'Permissão negada',
        'Você precisa conceder permissão para receber notificações dos lembretes de livros didáticos.'
      );
    } else {
      Alert.alert(
        'Permissão concedida',
        'Você receberá notificações 30 minutos antes de cada aula para lembrar dos livros necessários.'
      );
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [remindersData, studentsData] = await Promise.all([
        getReminders(),
        getStudents()
      ]);
      
      setReminders(remindersData);
      setStudents(studentsData);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados dos lembretes.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReminders = async () => {
    try {
      setLoading(true);
      // Primeiro, excluir todos os lembretes existentes
      await deleteAllReminders();
      
      // Para cada aluno, criar lembretes para cada dia da semana
      const weekDays = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];
      let newReminders = [];
      
      for (const student of students) {
        for (const day of weekDays) {
          // Obter os horários para a série do aluno neste dia
          const schedules = await getSchedulesByDayAndSerie(day, student.serie);
          
          for (const schedule of schedules) {
            // Criar um lembrete para cada aula
            const reminder = {
              studentId: student._id,
              day: day,
              scheduleId: schedule._id
            };
            
            const newReminder = await addReminder(reminder);
            newReminders.push(newReminder);
          }
        }
      }
      
      setReminders(newReminders);
      scheduleNotifications(newReminders);
      
      Alert.alert(
        'Sucesso',
        'Lembretes configurados com sucesso para todos os alunos!'
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível configurar os lembretes.');
    } finally {
      setLoading(false);
    }
  };

  const scheduleNotifications = async (remindersToSchedule) => {
    if (!notificationsEnabled) {
      return;
    }
    
    // Cancelar todas as notificações existentes
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    for (const reminder of remindersToSchedule) {
      if (reminder.studentId && reminder.scheduleId) {
        const student = students.find(s => s._id === reminder.studentId._id);
        const schedule = reminder.scheduleId;
        
        if (student && schedule) {
          // Calcular o próximo dia da semana para este lembrete
          const dayIndex = getDayIndex(reminder.day);
          if (dayIndex >= 0) {
            const nextDate = getNextDayOfWeek(dayIndex);
            
            // Extrair hora e minuto do formato "HH:MM - HH:MM"
            const timeMatch = schedule.time.match(/(\d+):(\d+)/);
            if (timeMatch) {
              const hour = parseInt(timeMatch[1], 10);
              const minute = parseInt(timeMatch[2], 10);
              
              // Definir o horário para 30 minutos antes da aula
              nextDate.setHours(hour);
              nextDate.setMinutes(minute - 30);
              
              // Se esse horário já passou hoje, o getNextDayOfWeek já terá ajustado para a próxima semana
              
              // Agendar 3 notificações com intervalos de 10 minutos
              for (let i = 0; i < 3; i++) {
                const notificationDate = new Date(nextDate);
                notificationDate.setMinutes(notificationDate.getMinutes() + (i * 10));
                
                await Notifications.scheduleNotificationAsync({
                  content: {
                    title: `Lembrete: Levar livro para a escola!`,
                    body: `${student.name}, não esqueça o livro de ${schedule.subject}: ${schedule.book} para a aula de hoje às ${schedule.time}!`,
                    sound: true,
                  },
                  trigger: {
                    date: notificationDate,
                    repeats: true,
                    weekday: dayIndex + 1, // Expo usa 1-7 para dias da semana
                  },
                });
              }
            }
          }
        }
      }
    }
  };

  const getDayIndex = (day) => {
    const days = { 'segunda': 0, 'terca': 1, 'quarta': 2, 'quinta': 3, 'sexta': 4 };
    return days[day] !== undefined ? days[day] : -1;
  };

  const getNextDayOfWeek = (dayIndex) => {
    const today = new Date();
    const resultDate = new Date(today);
    const todayDayIndex = today.getDay() - 1; // Domingo é 0 no JS, queremos segunda como 0
    
    // Se hoje for o dia desejado, mas o horário já passou, ou se o dia desejado for antes de hoje
    // na semana atual, então vamos para a próxima semana
    let daysToAdd = dayIndex - todayDayIndex;
    if (daysToAdd <= 0) {
      daysToAdd += 7;
    }
    
    resultDate.setDate(today.getDate() + daysToAdd);
    return resultDate;
  };

  const handleDeleteAllReminders = async () => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir todos os lembretes?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await deleteAllReminders();
              setReminders([]);
              await Notifications.cancelAllScheduledNotificationsAsync();
              Alert.alert('Sucesso', 'Todos os lembretes foram excluídos.');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir os lembretes.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const getDayName = (day) => {
    const days = {
      'segunda': 'Segunda-feira',
      'terca': 'Terça-feira',
      'quarta': 'Quarta-feira',
      'quinta': 'Quinta-feira',
      'sexta': 'Sexta-feira'
    };
    return days[day] || day;
  };

  const renderReminderItem = ({ item }) => {
    // Verificar se item.studentId e item.scheduleId são objetos populados
    const student = item.studentId && typeof item.studentId === 'object' ? item.studentId : null;
    const schedule = item.scheduleId && typeof item.scheduleId === 'object' ? item.scheduleId : null;
    
    if (!student || !schedule) {
      return null;
    }
    
    return (
      <View style={styles.reminderItem}>
        <View style={styles.reminderInfo}>
          <Text style={styles.studentName}>{student.name}</Text>
          <View style={styles.reminderDetails}>
            <Text style={styles.dayText}>{getDayName(item.day)}</Text>
            <Text style={styles.timeText}>{schedule.time}</Text>
          </View>
          <View style={styles.bookDetails}>
            <Text style={styles.subjectText}>Disciplina: {schedule.subject}</Text>
            <Text style={styles.bookText}>Livro: {schedule.book}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lembretes</Text>
        <Text style={styles.headerSubtitle}>Configure os lembretes para não esquecer os livros</Text>
      </View>

      <View style={styles.notificationSection}>
        <View style={styles.notificationToggle}>
          <Text style={styles.notificationText}>Notificações</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={requestNotificationPermissions}
            trackColor={{ false: '#767577', true: '#a5d6a7' }}
            thumbColor={notificationsEnabled ? '#2E7D32' : '#f4f3f4'}
          />
        </View>
        <Text style={styles.notificationDescription}>
          Receba lembretes 30 minutos antes de cada aula para não esquecer seus livros.
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
        </View>
      ) : (
        <>
          <FlatList
            data={reminders}
            renderItem={renderReminderItem}
            keyExtractor={(item) => item._id}
            style={styles.list}
            ListEmptyComponent={
              <View style={styles.emptyList}>
                <Ionicons name="notifications-off-outline" size={50} color="#aaa" />
                <Text style={styles.emptyText}>Nenhum lembrete configurado</Text>
                <Text style={styles.emptySubText}>
                  Clique no botão abaixo para configurar lembretes automáticos para todos os alunos
                </Text>
              </View>
            }
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleCreateReminders}
            >
              <Ionicons name="add-circle-outline" size={22} color="#FFF" />
              <Text style={styles.buttonText}>Configurar Lembretes</Text>
            </TouchableOpacity>

            {reminders.length > 0 && (
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={handleDeleteAllReminders}
              >
                <Ionicons name="trash-outline" size={22} color="#FFF" />
                <Text style={styles.buttonText}>Excluir Todos</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2E7D32',
    padding: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  notificationSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: -15,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  notificationToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
    padding: 16,
  },
  reminderItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reminderInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2E7D32',
  },
  reminderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  bookDetails: {
    marginTop: 4,
  },
  subjectText: {
    fontSize: 14,
    marginBottom: 4,
  },
  bookText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyList: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    marginTop: 30,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
  },
  emptySubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#2E7D32',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ReminderScreen; 