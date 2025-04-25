import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  Alert,
  ScrollView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

// Tipo para representar um horário
interface Horario {
  id: string;
  disciplina: string;
  professor: string;
  turma: string;
  diaSemana: string;
  horaInicio: string;
  horaFim: string;
}

export default function HorariosScreen() {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [disciplina, setDisciplina] = useState('');
  const [professor, setProfessor] = useState('');
  const [turma, setTurma] = useState('');
  const [diaSemana, setDiaSemana] = useState('Segunda-feira');
  const [horaInicio, setHoraInicio] = useState('07:00');
  const [horaFim, setHoraFim] = useState('08:00');
  const [editando, setEditando] = useState(false);
  const [horarioAtual, setHorarioAtual] = useState<Horario | null>(null);

  const diasSemana = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado'
  ];

  // Carregar horários ao inicializar o componente
  useEffect(() => {
    carregarHorarios();
  }, []);

  // Função para carregar horários salvos
  const carregarHorarios = async () => {
    try {
      const horariosJSON = await AsyncStorage.getItem('@horarios');
      if (horariosJSON) {
        setHorarios(JSON.parse(horariosJSON));
      }
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
      Alert.alert('Erro', 'Não foi possível carregar os horários.');
    }
  };

  // Função para salvar horários
  const salvarHorariosNoStorage = async (novosDados: Horario[]) => {
    try {
      await AsyncStorage.setItem('@horarios', JSON.stringify(novosDados));
    } catch (error) {
      console.error('Erro ao salvar horários:', error);
      Alert.alert('Erro', 'Não foi possível salvar os horários.');
    }
  };

  const limparFormulario = () => {
    setDisciplina('');
    setProfessor('');
    setTurma('');
    setDiaSemana('Segunda-feira');
    setHoraInicio('07:00');
    setHoraFim('08:00');
    setEditando(false);
    setHorarioAtual(null);
  };

  const abrirModal = (horario?: Horario) => {
    limparFormulario();
    
    if (horario) {
      setDisciplina(horario.disciplina);
      setProfessor(horario.professor);
      setTurma(horario.turma);
      setDiaSemana(horario.diaSemana);
      setHoraInicio(horario.horaInicio);
      setHoraFim(horario.horaFim);
      setEditando(true);
      setHorarioAtual(horario);
    }
    
    setModalVisible(true);
  };

  const salvarHorario = () => {
    if (!disciplina || !professor || !turma) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    // Validar horários
    if (horaInicio >= horaFim) {
      Alert.alert('Erro', 'A hora de início deve ser anterior à hora de fim!');
      return;
    }

    let novosHorarios: Horario[];

    if (editando && horarioAtual) {
      // Atualiza o horário existente
      novosHorarios = horarios.map(h => 
        h.id === horarioAtual.id 
          ? { 
              ...h, 
              disciplina, 
              professor, 
              turma, 
              diaSemana, 
              horaInicio, 
              horaFim 
            } 
          : h
      );
    } else {
      // Adiciona novo horário
      const novoHorario: Horario = {
        id: Date.now().toString(),
        disciplina,
        professor,
        turma,
        diaSemana,
        horaInicio,
        horaFim
      };
      novosHorarios = [...horarios, novoHorario];
    }

    setHorarios(novosHorarios);
    salvarHorariosNoStorage(novosHorarios);
    setModalVisible(false);
    limparFormulario();
  };

  const excluirHorario = (id: string) => {
    Alert.alert(
      'Confirmação',
      'Tem certeza que deseja excluir este horário?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            const novosHorarios = horarios.filter(horario => horario.id !== id);
            setHorarios(novosHorarios);
            salvarHorariosNoStorage(novosHorarios);
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: Horario }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.disciplina}</Text>
        <Text style={styles.cardSubtitle}>Professor: {item.professor}</Text>
        <Text style={styles.cardSubtitle}>Turma: {item.turma}</Text>
        <Text style={styles.cardSubtitle}>Dia: {item.diaSemana}</Text>
        <Text style={styles.cardSubtitle}>Horário: {item.horaInicio} - {item.horaFim}</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity onPress={() => abrirModal(item)}>
          <MaterialIcons name="edit" size={24} color="#344955" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => excluirHorario(item.id)}>
          <MaterialIcons name="delete" size={24} color="#FF5252" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Horários',
          headerShown: true,
          headerStyle: { backgroundColor: '#344955' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editando ? 'Editar Horário' : 'Novo Horário'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Disciplina"
              value={disciplina}
              onChangeText={setDisciplina}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Professor"
              value={professor}
              onChangeText={setProfessor}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Turma"
              value={turma}
              onChangeText={setTurma}
            />
            
            <Text style={styles.pickerLabel}>Dia da Semana:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={diaSemana}
                onValueChange={(itemValue) => setDiaSemana(itemValue)}
                style={styles.picker}
              >
                {diasSemana.map(dia => (
                  <Picker.Item key={dia} label={dia} value={dia} />
                ))}
              </Picker>
            </View>
            
            <Text style={styles.pickerLabel}>Hora de Início:</Text>
            <TextInput
              style={styles.input}
              placeholder="Hora de Início (HH:MM)"
              value={horaInicio}
              onChangeText={setHoraInicio}
              keyboardType="default"
            />
            
            <Text style={styles.pickerLabel}>Hora de Término:</Text>
            <TextInput
              style={styles.input}
              placeholder="Hora de Término (HH:MM)"
              value={horaFim}
              onChangeText={setHoraFim}
              keyboardType="default"
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]} 
                onPress={salvarHorario}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <FlatList
        data={horarios}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
      
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => abrirModal()}
      >
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#344955',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#4A6572',
    marginBottom: 2,
  },
  cardActions: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 60,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#F9AA33',
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '100%',
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#344955',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  pickerLabel: {
    fontSize: 16,
    color: '#4A6572',
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    marginBottom: 16,
  },
  picker: {
    height: 50,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    borderRadius: 4,
    padding: 12,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#AAAAAA',
  },
  saveButton: {
    backgroundColor: '#F9AA33',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 