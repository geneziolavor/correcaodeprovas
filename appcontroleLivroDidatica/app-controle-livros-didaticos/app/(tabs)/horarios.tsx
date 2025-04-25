import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipo para representar um horário
interface Horario {
  id: string;
  turma: string;
  diaSemana: string;
  horarioInicio: string;
  horarioFim: string;
  disciplina: string;
  professor: string;
}

export default function HorariosScreen() {
  const [horarios, setHorarios] = useState<Horario[]>([
    { 
      id: '1', 
      turma: '9º Ano A', 
      diaSemana: 'Segunda-feira', 
      horarioInicio: '07:30', 
      horarioFim: '09:10', 
      disciplina: 'Matemática',
      professor: 'Carlos Silva'
    },
    { 
      id: '2', 
      turma: '8º Ano B', 
      diaSemana: 'Terça-feira', 
      horarioInicio: '09:30', 
      horarioFim: '11:10', 
      disciplina: 'Português',
      professor: 'Ana Oliveira'
    },
    { 
      id: '3', 
      turma: '7º Ano C', 
      diaSemana: 'Quarta-feira', 
      horarioInicio: '13:30', 
      horarioFim: '15:10', 
      disciplina: 'Ciências',
      professor: 'Pedro Santos'
    },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [turma, setTurma] = useState('');
  const [diaSemana, setDiaSemana] = useState('');
  const [horarioInicio, setHorarioInicio] = useState('');
  const [horarioFim, setHorarioFim] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [professor, setProfessor] = useState('');
  const [editando, setEditando] = useState(false);
  const [horarioAtual, setHorarioAtual] = useState<Horario | null>(null);

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
    setTurma('');
    setDiaSemana('');
    setHorarioInicio('');
    setHorarioFim('');
    setDisciplina('');
    setProfessor('');
    setEditando(false);
    setHorarioAtual(null);
  };

  const abrirModal = (horario?: Horario) => {
    limparFormulario();
    
    if (horario) {
      setTurma(horario.turma);
      setDiaSemana(horario.diaSemana);
      setHorarioInicio(horario.horarioInicio);
      setHorarioFim(horario.horarioFim);
      setDisciplina(horario.disciplina);
      setProfessor(horario.professor);
      setEditando(true);
      setHorarioAtual(horario);
    }
    
    setModalVisible(true);
  };

  const salvarHorario = () => {
    if (!turma || !diaSemana || !horarioInicio || !horarioFim || !disciplina || !professor) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos!');
      return;
    }

    let novosHorarios: Horario[];

    if (editando && horarioAtual) {
      // Atualiza o horário existente
      novosHorarios = horarios.map(h => 
        h.id === horarioAtual.id 
          ? { ...h, turma, diaSemana, horarioInicio, horarioFim, disciplina, professor } 
          : h
      );
    } else {
      // Adiciona novo horário
      const novoHorario: Horario = {
        id: Date.now().toString(),
        turma,
        diaSemana,
        horarioInicio,
        horarioFim,
        disciplina,
        professor
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
        <Text style={styles.cardTitle}>{item.turma} - {item.disciplina}</Text>
        <Text style={styles.cardSubtitle}>{item.diaSemana}, {item.horarioInicio} - {item.horarioFim}</Text>
        <Text style={styles.cardSubtitle}>Professor: {item.professor}</Text>
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
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editando ? 'Editar Horário' : 'Novo Horário'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Turma"
              value={turma}
              onChangeText={setTurma}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Dia da Semana"
              value={diaSemana}
              onChangeText={setDiaSemana}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Horário de Início"
              value={horarioInicio}
              onChangeText={setHorarioInicio}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Horário de Término"
              value={horarioFim}
              onChangeText={setHorarioFim}
            />
            
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
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 60,
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