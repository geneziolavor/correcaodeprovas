import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert, Modal, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getSchedules, addSchedule, deleteSchedule, getTeachers, getBooks } from '../api/api';

const ScheduleScreen = () => {
  const [schedules, setSchedules] = useState([]);
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [subject, setSubject] = useState('');
  const [book, setBook] = useState('');
  const [serie, setSerie] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);

  // Dias da semana para seleção
  const weekDays = [
    { id: 'segunda', name: 'Segunda-feira' },
    { id: 'terca', name: 'Terça-feira' },
    { id: 'quarta', name: 'Quarta-feira' },
    { id: 'quinta', name: 'Quinta-feira' },
    { id: 'sexta', name: 'Sexta-feira' },
  ];

  // Séries para seleção
  const serieOptions = [
    { id: '6ano', name: '6º Ano' },
    { id: '7ano', name: '7º Ano' },
    { id: '8ano', name: '8º Ano' },
    { id: '9ano', name: '9º Ano' },
    { id: '1ano', name: '1º Ano - Ensino Médio' },
    { id: '2ano', name: '2º Ano - Ensino Médio' },
    { id: '3ano', name: '3º Ano - Ensino Médio' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Filtrar livros com base na disciplina selecionada
    if (subject) {
      const filtered = books.filter(book => book.subject === subject);
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks([]);
    }
  }, [subject, books]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Carregar todos os dados necessários
      const [schedulesData, teachersData, booksData] = await Promise.all([
        getSchedules(),
        getTeachers(),
        getBooks()
      ]);
      
      setSchedules(schedulesData);
      setTeachers(teachersData);
      setBooks(booksData);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSchedule = async () => {
    if (!day || !time || !subject || !book || !serie) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      const newSchedule = await addSchedule({ day, time, subject, book, serie });
      setSchedules([...schedules, newSchedule]);
      resetForm();
      setModalVisible(false);
      Alert.alert('Sucesso', 'Horário adicionado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar o horário.');
    }
  };

  const resetForm = () => {
    setDay('');
    setTime('');
    setSubject('');
    setBook('');
    setSerie('');
  };

  const handleDeleteSchedule = async (id) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este horário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSchedule(id);
              setSchedules(schedules.filter(schedule => schedule._id !== id));
              Alert.alert('Sucesso', 'Horário excluído com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o horário.');
            }
          }
        }
      ]
    );
  };

  const getDayName = (dayId) => {
    const day = weekDays.find(d => d.id === dayId);
    return day ? day.name : dayId;
  };

  const getSerieName = (serieId) => {
    const serie = serieOptions.find(s => s.id === serieId);
    return serie ? serie.name : serieId;
  };

  const renderScheduleItem = ({ item }) => (
    <View style={styles.scheduleItem}>
      <View style={styles.scheduleInfo}>
        <View style={styles.scheduleHeader}>
          <Text style={styles.scheduleDay}>{getDayName(item.day)}</Text>
          <Text style={styles.scheduleTime}>{item.time}</Text>
        </View>
        <Text style={styles.scheduleSubject}>Disciplina: {item.subject}</Text>
        <Text style={styles.scheduleBook}>Livro: {item.book}</Text>
        <Text style={styles.scheduleSerie}>Série: {getSerieName(item.serie)}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteSchedule(item._id)}
      >
        <Ionicons name="trash-outline" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Horários de Aula</Text>
        <Text style={styles.headerSubtitle}>Configure os horários das aulas por série</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
        </View>
      ) : (
        <>
          <FlatList
            data={schedules}
            renderItem={renderScheduleItem}
            keyExtractor={(item) => item._id}
            style={styles.list}
            ListEmptyComponent={
              <View style={styles.emptyList}>
                <Ionicons name="time-outline" size={50} color="#aaa" />
                <Text style={styles.emptyText}>Nenhum horário configurado</Text>
              </View>
            }
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={24} color="#FFF" />
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <ScrollView style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Novo Horário</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Dia da semana</Text>
                  <View style={styles.optionsContainer}>
                    {weekDays.map(weekDay => (
                      <TouchableOpacity
                        key={weekDay.id}
                        style={[
                          styles.optionButton,
                          day === weekDay.id && styles.optionButtonSelected
                        ]}
                        onPress={() => setDay(weekDay.id)}
                      >
                        <Text
                          style={[
                            styles.optionButtonText,
                            day === weekDay.id && styles.optionButtonTextSelected
                          ]}
                        >
                          {weekDay.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Série</Text>
                  <View style={styles.optionsContainer}>
                    {serieOptions.map(serieOption => (
                      <TouchableOpacity
                        key={serieOption.id}
                        style={[
                          styles.optionButton,
                          serie === serieOption.id && styles.optionButtonSelected
                        ]}
                        onPress={() => setSerie(serieOption.id)}
                      >
                        <Text
                          style={[
                            styles.optionButtonText,
                            serie === serieOption.id && styles.optionButtonTextSelected
                          ]}
                        >
                          {serieOption.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Horário</Text>
                  <TextInput
                    style={styles.input}
                    value={time}
                    onChangeText={setTime}
                    placeholder="Ex: 07:30 - 08:20"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Disciplina</Text>
                  <View style={styles.optionsContainer}>
                    {teachers.map(teacher => (
                      <TouchableOpacity
                        key={teacher._id}
                        style={[
                          styles.optionButton,
                          subject === teacher.subject && styles.optionButtonSelected
                        ]}
                        onPress={() => setSubject(teacher.subject)}
                      >
                        <Text
                          style={[
                            styles.optionButtonText,
                            subject === teacher.subject && styles.optionButtonTextSelected
                          ]}
                        >
                          {teacher.subject}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {subject && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Livro</Text>
                    <View style={styles.optionsContainer}>
                      {filteredBooks.length > 0 ? (
                        filteredBooks.map(bookItem => (
                          <TouchableOpacity
                            key={bookItem._id}
                            style={[
                              styles.optionButton,
                              book === bookItem.title && styles.optionButtonSelected
                            ]}
                            onPress={() => setBook(bookItem.title)}
                          >
                            <Text
                              style={[
                                styles.optionButtonText,
                                book === bookItem.title && styles.optionButtonTextSelected
                              ]}
                            >
                              {bookItem.title}
                            </Text>
                          </TouchableOpacity>
                        ))
                      ) : (
                        <Text style={styles.noOptionsText}>
                          Nenhum livro encontrado para esta disciplina
                        </Text>
                      )}
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleAddSchedule}
                >
                  <Text style={styles.submitButtonText}>Adicionar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Modal>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
    padding: 16,
  },
  scheduleItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scheduleDay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  scheduleTime: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  scheduleSubject: {
    fontSize: 14,
    marginBottom: 4,
  },
  scheduleBook: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
  scheduleSerie: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    padding: 5,
  },
  emptyList: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#2E7D32',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 40,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    padding: 10,
    margin: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  optionButtonSelected: {
    backgroundColor: '#e8f5e9',
    borderColor: '#2E7D32',
  },
  optionButtonText: {
    color: '#666',
  },
  optionButtonTextSelected: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  noOptionsText: {
    color: '#999',
    padding: 10,
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ScheduleScreen; 