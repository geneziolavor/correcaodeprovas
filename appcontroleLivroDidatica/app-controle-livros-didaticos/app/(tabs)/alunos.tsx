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

// Tipo para representar um aluno
interface Aluno {
  id: string;
  nome: string;
  matricula: string;
  turma: string;
}

export default function AlunosScreen() {
  const [alunos, setAlunos] = useState<Aluno[]>([
    { id: '1', nome: 'João Silva', matricula: '2023001', turma: '9º Ano A' },
    { id: '2', nome: 'Maria Santos', matricula: '2023002', turma: '7º Ano B' },
    { id: '3', nome: 'Pedro Oliveira', matricula: '2023003', turma: '8º Ano C' },
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
      Alert.alert('Erro', 'Por favor, preencha todos os campos!');
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
        <TouchableOpacity onPress={() => abrirModal(item)}>
          <MaterialIcons name="edit" size={24} color="#344955" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => excluirAluno(item.id)}>
          <MaterialIcons name="delete" size={24} color="#FF5252" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Alunos',
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
              {editando ? 'Editar Aluno' : 'Novo Aluno'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
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
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]} 
                onPress={salvarAluno}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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