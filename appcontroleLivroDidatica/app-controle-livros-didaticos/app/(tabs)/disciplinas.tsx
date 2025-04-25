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

// Tipo para representar uma disciplina
interface Disciplina {
  id: string;
  nome: string;
  descricao: string;
  cargaHoraria: string;
}

export default function DisciplinasScreen() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([
    { id: '1', nome: 'Matemática', descricao: 'Álgebra, geometria e cálculo', cargaHoraria: '80' },
    { id: '2', nome: 'Português', descricao: 'Gramática e literatura', cargaHoraria: '80' },
    { id: '3', nome: 'Ciências', descricao: 'Física, química e biologia', cargaHoraria: '60' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [editando, setEditando] = useState(false);
  const [disciplinaAtual, setDisciplinaAtual] = useState<Disciplina | null>(null);

  // Carregar disciplinas ao inicializar o componente
  useEffect(() => {
    carregarDisciplinas();
  }, []);

  // Função para carregar disciplinas salvas
  const carregarDisciplinas = async () => {
    try {
      const disciplinasJSON = await AsyncStorage.getItem('@disciplinas');
      if (disciplinasJSON) {
        setDisciplinas(JSON.parse(disciplinasJSON));
      }
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as disciplinas.');
    }
  };

  // Função para salvar disciplinas
  const salvarDisciplinasNoStorage = async (novosDados: Disciplina[]) => {
    try {
      await AsyncStorage.setItem('@disciplinas', JSON.stringify(novosDados));
    } catch (error) {
      console.error('Erro ao salvar disciplinas:', error);
      Alert.alert('Erro', 'Não foi possível salvar as disciplinas.');
    }
  };

  const limparFormulario = () => {
    setNome('');
    setDescricao('');
    setCargaHoraria('');
    setEditando(false);
    setDisciplinaAtual(null);
  };

  const abrirModal = (disciplina?: Disciplina) => {
    limparFormulario();
    
    if (disciplina) {
      setNome(disciplina.nome);
      setDescricao(disciplina.descricao);
      setCargaHoraria(disciplina.cargaHoraria);
      setEditando(true);
      setDisciplinaAtual(disciplina);
    }
    
    setModalVisible(true);
  };

  const salvarDisciplina = () => {
    if (!nome) {
      Alert.alert('Erro', 'Por favor, informe o nome da disciplina!');
      return;
    }

    let novasDisciplinas: Disciplina[];

    if (editando && disciplinaAtual) {
      // Atualiza a disciplina existente
      novasDisciplinas = disciplinas.map(d => 
        d.id === disciplinaAtual.id 
          ? { ...d, nome, descricao, cargaHoraria } 
          : d
      );
    } else {
      // Adiciona nova disciplina
      const novaDisciplina: Disciplina = {
        id: Date.now().toString(),
        nome,
        descricao,
        cargaHoraria
      };
      novasDisciplinas = [...disciplinas, novaDisciplina];
    }

    setDisciplinas(novasDisciplinas);
    salvarDisciplinasNoStorage(novasDisciplinas);
    setModalVisible(false);
    limparFormulario();
  };

  const excluirDisciplina = (id: string) => {
    Alert.alert(
      'Confirmação',
      'Tem certeza que deseja excluir esta disciplina?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            const novasDisciplinas = disciplinas.filter(disciplina => disciplina.id !== id);
            setDisciplinas(novasDisciplinas);
            salvarDisciplinasNoStorage(novasDisciplinas);
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: Disciplina }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.nome}</Text>
        <Text style={styles.cardSubtitle}>Descrição: {item.descricao}</Text>
        <Text style={styles.cardSubtitle}>Carga Horária: {item.cargaHoraria}h</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity onPress={() => abrirModal(item)}>
          <MaterialIcons name="edit" size={24} color="#344955" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => excluirDisciplina(item.id)}>
          <MaterialIcons name="delete" size={24} color="#FF5252" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Disciplinas',
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
              {editando ? 'Editar Disciplina' : 'Nova Disciplina'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nome da disciplina"
              value={nome}
              onChangeText={setNome}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descrição"
              value={descricao}
              onChangeText={setDescricao}
              multiline
              numberOfLines={3}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Carga Horária (horas)"
              value={cargaHoraria}
              onChangeText={setCargaHoraria}
              keyboardType="numeric"
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
                onPress={salvarDisciplina}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        data={disciplinas}
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
  textArea: {
    height: 100,
  },
}); 