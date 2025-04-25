import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Alert, 
  Modal 
} from 'react-native';
import { Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Livro {
  id: string;
  titulo: string;
  disciplina: string;
  serie: string;
  autor: string;
}

export default function LivrosScreen() {
  const [livros, setLivros] = useState<Livro[]>([
    { id: '1', titulo: 'Matemática Elementar', disciplina: 'Matemática', serie: '6º Ano', autor: 'Carlos Silva' },
    { id: '2', titulo: 'História do Brasil', disciplina: 'História', serie: '9º Ano', autor: 'Ana Rodrigues' },
    { id: '3', titulo: 'Ciências Naturais', disciplina: 'Ciências', serie: '7º Ano', autor: 'Roberto Santos' }
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [serie, setSerie] = useState('');
  const [autor, setAutor] = useState('');
  const [editando, setEditando] = useState(false);
  const [livroAtual, setLivroAtual] = useState<Livro | null>(null);

  // Carregar livros ao inicializar o componente
  useEffect(() => {
    carregarLivros();
  }, []);

  // Função para carregar livros salvos
  const carregarLivros = async () => {
    try {
      const livrosJSON = await AsyncStorage.getItem('@livros');
      if (livrosJSON) {
        setLivros(JSON.parse(livrosJSON));
      }
    } catch (error) {
      console.error('Erro ao carregar livros:', error);
      Alert.alert('Erro', 'Não foi possível carregar os livros.');
    }
  };

  // Função para salvar livros
  const salvarLivrosNoStorage = async (novosDados: Livro[]) => {
    try {
      await AsyncStorage.setItem('@livros', JSON.stringify(novosDados));
    } catch (error) {
      console.error('Erro ao salvar livros:', error);
      Alert.alert('Erro', 'Não foi possível salvar os livros.');
    }
  };

  const limparFormulario = () => {
    setTitulo('');
    setDisciplina('');
    setSerie('');
    setAutor('');
    setEditando(false);
    setLivroAtual(null);
  };

  const abrirModal = (livro?: Livro) => {
    limparFormulario();
    
    if (livro) {
      setTitulo(livro.titulo);
      setDisciplina(livro.disciplina);
      setSerie(livro.serie);
      setAutor(livro.autor);
      setEditando(true);
      setLivroAtual(livro);
    }
    
    setModalVisible(true);
  };

  const salvarLivro = () => {
    if (!titulo || !disciplina || !serie || !autor) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios!');
      return;
    }

    let novosLivros: Livro[];

    if (editando && livroAtual) {
      // Atualiza o livro existente
      novosLivros = livros.map(l => 
        l.id === livroAtual.id 
          ? { ...l, titulo, disciplina, serie, autor } 
          : l
      );
    } else {
      // Adiciona novo livro
      const novoLivro: Livro = {
        id: Date.now().toString(),
        titulo,
        disciplina,
        serie,
        autor
      };
      novosLivros = [...livros, novoLivro];
    }

    setLivros(novosLivros);
    salvarLivrosNoStorage(novosLivros);
    setModalVisible(false);
    limparFormulario();
  };

  const excluirLivro = (id: string) => {
    Alert.alert(
      'Confirmação',
      'Tem certeza que deseja excluir este livro?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            const novosLivros = livros.filter(l => l.id !== id);
            setLivros(novosLivros);
            salvarLivrosNoStorage(novosLivros);
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: Livro }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.titulo}</Text>
        <Text style={styles.cardSubtitle}>Disciplina: {item.disciplina}</Text>
        <Text style={styles.cardSubtitle}>Série: {item.serie}</Text>
        <Text style={styles.cardSubtitle}>Autor: {item.autor}</Text>
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
          onPress={() => excluirLivro(item.id)}
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
          title: 'Livros Didáticos',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <FlatList
        data={livros}
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
              {editando ? 'Editar Livro' : 'Novo Livro'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Título do livro"
              value={titulo}
              onChangeText={setTitulo}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Disciplina"
              value={disciplina}
              onChangeText={setDisciplina}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Série/Ano"
              value={serie}
              onChangeText={setSerie}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Autor"
              value={autor}
              onChangeText={setAutor}
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
                onPress={salvarLivro}
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
    backgroundColor: '#F9AA33',
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
    backgroundColor: '#F9AA33',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 