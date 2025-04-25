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
import { Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipo para representar um aluno
interface Aluno {
  id: string;
  nome: string;
  matricula: string;
  turma: string;
}

export default function AlunosScreen() {
  const [alunos, setAlunos] = useState<Aluno[]>([
    { id: '1', nome: 'Carlos Silva', matricula: '2023001', turma: '9° Ano A' },
    { id: '2', nome: 'Amanda Oliveira', matricula: '2023002', turma: '7° Ano B' },
    { id: '3', nome: 'Bruno Santos', matricula: '2023003', turma: '5° Ano C' }
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [turma, setTurma] = useState('');
  const [editando, setEditando] = useState(false);
  const [alunoAtual, setAlunoAtual] = useState<Aluno | null>(null);

  // Carregar alunos ao inicializar o componente
  useEffect(() => {
    carregarAlunos();
  }, []);

  // Função para carregar alunos salvos
  const carregarAlunos = async () => {
    try {
      const alunosJSON = await AsyncStorage.getItem('@alunos');
      if (alunosJSON) {
        setAlunos(JSON.parse(alunosJSON));
      }
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os alunos.');
    }
  };

  // Função para salvar alunos
  const salvarAlunosNoStorage = async (novosDados: Aluno[]) => {
    try {
      await AsyncStorage.setItem('@alunos', JSON.stringify(novosDados));
    } catch (error) {
      console.error('Erro ao salvar alunos:', error);
      Alert.alert('Erro', 'Não foi possível salvar os alunos.');
    }
  };

  const limparFormulario = () => {
    setNome('');
    setMatricula('');
    setTurma('');
    setEditando(false);
    setAlunoAtual(null);
  };

  const abrirModal = (aluno?: Aluno) => {
    limparFormulario();
    
    if (aluno) {
      setNome(aluno.nome);
      setMatricula(aluno.matricula);
      setTurma(aluno.turma);
      setEditando(true);
      setAlunoAtual(aluno);
    }
    
    setModalVisible(true);
  };

  const salvarAluno = () => {
    if (!nome || !matricula || !turma) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios!');
      return;
    }

    let novosAlunos: Aluno[];

    if (editando && alunoAtual) {
      // Atualiza o aluno existente
      novosAlunos = alunos.map(a => 
        a.id === alunoAtual.id 
          ? { ...a, nome, matricula, turma } 
          : a
      );
    } else {
      // Adiciona novo aluno
      const novoAluno: Aluno = {
        id: Date.now().toString(),
        nome,
        matricula,
        turma
      };
      novosAlunos = [...alunos, novoAluno];
    }

    setAlunos(novosAlunos);
    salvarAlunosNoStorage(novosAlunos);
    setModalVisible(false);
    limparFormulario();
  };

  const excluirAluno = (id: string) => {
    Alert.alert(
      'Confirmação',
      'Tem certeza que deseja excluir este aluno?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            const novosAlunos = alunos.filter(a => a.id !== id);
            setAlunos(novosAlunos);
            salvarAlunosNoStorage(novosAlunos);
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: Aluno }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.nome}</Text>
        <Text style={styles.cardSubtitle}>Matrícula: {item.matricula}</Text>
        <Text style={styles.cardSubtitle}>Turma: {item.turma}</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => abrirModal(item)}
        >
          <MaterialIcons name="edit" size={24} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => excluirAluno(item.id)}
        >
          <MaterialIcons name="delete" size={24} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Alunos',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <FlatList
        data={alunos}
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          limparFormulario();
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              {editando ? 'Editar Aluno' : 'Novo Aluno'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nome do aluno"
              value={nome}
              onChangeText={setNome}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Matrícula"
              value={matricula}
              onChangeText={setMatricula}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Turma"
              value={turma}
              onChangeText={setTurma}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => {
                  setModalVisible(false);
                  limparFormulario();
                }}
              >
                <Text style={styles.textStyle}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.buttonSave]}
                onPress={salvarAluno}
              >
                <Text style={styles.textStyle}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cardActions: {
    justifyContent: 'space-around',
  },
  actionButton: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#2196F3',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '85%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    borderRadius: 4,
    padding: 12,
    elevation: 2,
    minWidth: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: '#AAAAAA',
  },
  buttonSave: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 