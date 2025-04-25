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

// Tipo para representar um livro
interface Livro {
  id: string;
  titulo: string;
  disciplina: string;
  autor: string;
  editora: string;
  anoEdicao: string;
  serie: string;
  quantidade: string;
  observacoes: string;
}

export default function LivrosScreen() {
  const [livros, setLivros] = useState<Livro[]>([
    { 
      id: '1', 
      titulo: 'Matemática Fundamental', 
      disciplina: 'Matemática', 
      autor: 'João Silva', 
      editora: 'Educativa', 
      anoEdicao: '2022', 
      serie: '6º ano', 
      quantidade: '30',
      observacoes: 'Bom estado de conservação'
    },
    { 
      id: '2', 
      titulo: 'Português e Redação', 
      disciplina: 'Português', 
      autor: 'Maria Pereira', 
      editora: 'Linguagens', 
      anoEdicao: '2021', 
      serie: '7º ano', 
      quantidade: '25',
      observacoes: 'Alguns livros danificados'
    },
    { 
      id: '3', 
      titulo: 'Ciências da Natureza', 
      disciplina: 'Ciências', 
      autor: 'Pedro Oliveira', 
      editora: 'Científica', 
      anoEdicao: '2023', 
      serie: '8º ano', 
      quantidade: '35',
      observacoes: 'Novos, adquiridos recentemente'
    },
  ]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [autor, setAutor] = useState('');
  const [editora, setEditora] = useState('');
  const [anoEdicao, setAnoEdicao] = useState('');
  const [serie, setSerie] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [observacoes, setObservacoes] = useState('');
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
    setAutor('');
    setEditora('');
    setAnoEdicao('');
    setSerie('');
    setQuantidade('');
    setObservacoes('');
    setEditando(false);
    setLivroAtual(null);
  };

  const abrirModal = (livro?: Livro) => {
    limparFormulario();
    
    if (livro) {
      setTitulo(livro.titulo);
      setDisciplina(livro.disciplina);
      setAutor(livro.autor);
      setEditora(livro.editora);
      setAnoEdicao(livro.anoEdicao);
      setSerie(livro.serie);
      setQuantidade(livro.quantidade);
      setObservacoes(livro.observacoes);
      setEditando(true);
      setLivroAtual(livro);
    }
    
    setModalVisible(true);
  };

  const salvarLivro = () => {
    if (!titulo || !disciplina || !quantidade) {
      Alert.alert('Erro', 'Por favor, preencha os campos obrigatórios!');
      return;
    }

    let novosLivros: Livro[];

    if (editando && livroAtual) {
      // Atualiza o livro existente
      novosLivros = livros.map(l => 
        l.id === livroAtual.id 
          ? { 
              ...l, 
              titulo, 
              disciplina, 
              autor, 
              editora, 
              anoEdicao, 
              serie, 
              quantidade, 
              observacoes 
            } 
          : l
      );
    } else {
      // Adiciona novo livro
      const novoLivro: Livro = {
        id: Date.now().toString(),
        titulo,
        disciplina,
        autor,
        editora,
        anoEdicao,
        serie,
        quantidade,
        observacoes
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
            const novosLivros = livros.filter(livro => livro.id !== id);
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
        <Text style={styles.cardSubtitle}>Autor: {item.autor}</Text>
        <Text style={styles.cardSubtitle}>Editora: {item.editora}</Text>
        <Text style={styles.cardSubtitle}>Ano: {item.anoEdicao} | Série: {item.serie}</Text>
        <Text style={styles.cardSubtitle}>Quantidade: {item.quantidade} unidades</Text>
        {item.observacoes ? (
          <Text style={styles.cardObservacoes}>Obs: {item.observacoes}</Text>
        ) : null}
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity onPress={() => abrirModal(item)}>
          <MaterialIcons name="edit" size={24} color="#344955" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => excluirLivro(item.id)}>
          <MaterialIcons name="delete" size={24} color="#FF5252" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Livros Didáticos',
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
          <ScrollView>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {editando ? 'Editar Livro' : 'Novo Livro'}
              </Text>
              
              <TextInput
                style={styles.input}
                placeholder="Título do livro *"
                value={titulo}
                onChangeText={setTitulo}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Disciplina *"
                value={disciplina}
                onChangeText={setDisciplina}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Autor"
                value={autor}
                onChangeText={setAutor}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Editora"
                value={editora}
                onChangeText={setEditora}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Ano de Edição"
                value={anoEdicao}
                onChangeText={setAnoEdicao}
                keyboardType="numeric"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Série/Ano escolar"
                value={serie}
                onChangeText={setSerie}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Quantidade *"
                value={quantidade}
                onChangeText={setQuantidade}
                keyboardType="numeric"
              />
              
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Observações"
                value={observacoes}
                onChangeText={setObservacoes}
                multiline
                numberOfLines={4}
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
                  onPress={salvarLivro}
                >
                  <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

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
  cardObservacoes: {
    fontSize: 13,
    color: '#6C757D',
    fontStyle: 'italic',
    marginTop: 4,
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
    minHeight: 100,
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