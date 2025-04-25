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

// Tipo para representar um professor
interface Professor {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  disciplinas: string[];
  formacao: string;
}

export default function ProfessoresScreen() {
  const [professores, setProfessores] = useState<Professor[]>([
    { 
      id: '1', 
      nome: 'Carlos Roberto Alves', 
      email: 'carlos.alves@escola.edu.br', 
      telefone: '(11) 98765-4321', 
      disciplinas: ['Matemática', 'Física'], 
      formacao: 'Licenciatura em Matemática, Mestrado em Ensino de Ciências'
    },
    { 
      id: '2', 
      nome: 'Márcia Santos Silva', 
      email: 'marcia.silva@escola.edu.br', 
      telefone: '(11) 91234-5678', 
      disciplinas: ['Português', 'Literatura'], 
      formacao: 'Letras, Doutorado em Linguística'
    },
    { 
      id: '3', 
      nome: 'Ricardo Oliveira Costa', 
      email: 'ricardo.costa@escola.edu.br', 
      telefone: '(11) 97777-8888', 
      disciplinas: ['História', 'Geografia'], 
      formacao: 'Licenciatura em História, Especialização em Geografia Humana'
    },
  ]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [disciplinasTexto, setDisciplinasTexto] = useState('');
  const [formacao, setFormacao] = useState('');
  const [editando, setEditando] = useState(false);
  const [professorAtual, setProfessorAtual] = useState<Professor | null>(null);

  // Carregar professores ao inicializar o componente
  useEffect(() => {
    carregarProfessores();
  }, []);

  // Função para carregar professores salvos
  const carregarProfessores = async () => {
    try {
      const professoresJSON = await AsyncStorage.getItem('@professores');
      if (professoresJSON) {
        setProfessores(JSON.parse(professoresJSON));
      }
    } catch (error) {
      console.error('Erro ao carregar professores:', error);
      Alert.alert('Erro', 'Não foi possível carregar os professores.');
    }
  };

  // Função para salvar professores
  const salvarProfessoresNoStorage = async (novosDados: Professor[]) => {
    try {
      await AsyncStorage.setItem('@professores', JSON.stringify(novosDados));
    } catch (error) {
      console.error('Erro ao salvar professores:', error);
      Alert.alert('Erro', 'Não foi possível salvar os professores.');
    }
  };

  const limparFormulario = () => {
    setNome('');
    setEmail('');
    setTelefone('');
    setDisciplinasTexto('');
    setFormacao('');
    setEditando(false);
    setProfessorAtual(null);
  };

  const abrirModal = (professor?: Professor) => {
    limparFormulario();
    
    if (professor) {
      setNome(professor.nome);
      setEmail(professor.email);
      setTelefone(professor.telefone);
      setDisciplinasTexto(professor.disciplinas.join(', '));
      setFormacao(professor.formacao);
      setEditando(true);
      setProfessorAtual(professor);
    }
    
    setModalVisible(true);
  };

  const salvarProfessor = () => {
    if (!nome || !email) {
      Alert.alert('Erro', 'Por favor, preencha pelo menos o nome e o email!');
      return;
    }

    // Converte a string de disciplinas em um array
    const disciplinasArray = disciplinasTexto
      .split(',')
      .map(disciplina => disciplina.trim())
      .filter(disciplina => disciplina.length > 0);

    let novosProfessores: Professor[];

    if (editando && professorAtual) {
      // Atualiza o professor existente
      novosProfessores = professores.map(p => 
        p.id === professorAtual.id 
          ? { 
              ...p, 
              nome, 
              email, 
              telefone, 
              disciplinas: disciplinasArray, 
              formacao 
            } 
          : p
      );
    } else {
      // Adiciona novo professor
      const novoProfessor: Professor = {
        id: Date.now().toString(),
        nome,
        email,
        telefone,
        disciplinas: disciplinasArray,
        formacao
      };
      novosProfessores = [...professores, novoProfessor];
    }

    setProfessores(novosProfessores);
    salvarProfessoresNoStorage(novosProfessores);
    setModalVisible(false);
    limparFormulario();
  };

  const excluirProfessor = (id: string) => {
    Alert.alert(
      'Confirmação',
      'Tem certeza que deseja excluir este professor?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            const novosProfessores = professores.filter(p => p.id !== id);
            setProfessores(novosProfessores);
            salvarProfessoresNoStorage(novosProfessores);
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: Professor }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.nome}</Text>
        <Text style={styles.cardSubtitle}>{item.email}</Text>
        <Text style={styles.cardSubtitle}>Tel: {item.telefone}</Text>
        <Text style={styles.cardSubtitle}>
          Disciplinas: {item.disciplinas.join(', ')}
        </Text>
        <Text style={styles.cardSubtitle}>Formação: {item.formacao}</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity onPress={() => abrirModal(item)}>
          <MaterialIcons name="edit" size={24} color="#344955" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => excluirProfessor(item.id)}>
          <MaterialIcons name="delete" size={24} color="#FF5252" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Professores',
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
              {editando ? 'Editar Professor' : 'Novo Professor'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nome completo *"
              value={nome}
              onChangeText={setNome}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Email *"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Telefone"
              value={telefone}
              onChangeText={setTelefone}
              keyboardType="phone-pad"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Disciplinas (separadas por vírgula)"
              value={disciplinasTexto}
              onChangeText={setDisciplinasTexto}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Formação acadêmica"
              value={formacao}
              onChangeText={setFormacao}
              multiline
              numberOfLines={3}
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
                onPress={salvarProfessor}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        data={professores}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '100%',
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
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