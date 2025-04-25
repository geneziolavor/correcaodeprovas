import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  TextInput 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Tipo para representar um livro didático
interface LivroDidatico {
  id: string;
  titulo: string;
  disciplina: string;
  autor: string;
  editora: string;
  anoPublicacao: string;
  quantidade: string;
}

export default function LivroDidaticoScreen() {
  const [livros, setLivros] = useState<LivroDidatico[]>([
    { id: '1', titulo: 'Matemática Fundamental', disciplina: 'Matemática', autor: 'Roberto Silva', editora: 'Educação Brasil', anoPublicacao: '2022', quantidade: '30' },
    { id: '2', titulo: 'Gramática Completa', disciplina: 'Português', autor: 'Maria Souza', editora: 'Letras & Cia', anoPublicacao: '2021', quantidade: '25' },
    { id: '3', titulo: 'Ciências da Natureza', disciplina: 'Ciências', autor: 'Pedro Almeida', editora: 'Universo Escolar', anoPublicacao: '2023', quantidade: '20' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [autor, setAutor] = useState('');
  const [editora, setEditora] = useState('');
  const [anoPublicacao, setAnoPublicacao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [editando, setEditando] = useState(false);
  const [livroAtual, setLivroAtual] = useState<LivroDidatico | null>(null);

  const limparFormulario = () => {
    setTitulo('');
    setDisciplina('');
    setAutor('');
    setEditora('');
    setAnoPublicacao('');
    setQuantidade('');
    setEditando(false);
    setLivroAtual(null);
  };

  const abrirModal = (livro?: LivroDidatico) => {
    limparFormulario();
    
    if (livro) {
      setTitulo(livro.titulo);
      setDisciplina(livro.disciplina);
      setAutor(livro.autor);
      setEditora(livro.editora);
      setAnoPublicacao(livro.anoPublicacao);
      setQuantidade(livro.quantidade);
      setEditando(true);
      setLivroAtual(livro);
    }
    
    setModalVisible(true);
  };

  const salvarLivro = () => {
    if (!titulo || !disciplina || !autor || !editora || !anoPublicacao || !quantidade) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    if (editando && livroAtual) {
      // Atualiza o livro existente
      const novosLivros = livros.map(l => 
        l.id === livroAtual.id 
          ? { ...l, titulo, disciplina, autor, editora, anoPublicacao, quantidade } 
          : l
      );
      setLivros(novosLivros);
    } else {
      // Adiciona novo livro
      const novoLivro: LivroDidatico = {
        id: Date.now().toString(),
        titulo,
        disciplina,
        autor,
        editora,
        anoPublicacao,
        quantidade
      };
      setLivros([...livros, novoLivro]);
    }

    setModalVisible(false);
    limparFormulario();
  };

  const excluirLivro = (id: string) => {
    setLivros(livros.filter(livro => livro.id !== id));
  };

  const renderItem = ({ item }: { item: LivroDidatico }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.titulo}</Text>
        <Text style={styles.cardSubtitle}>Disciplina: {item.disciplina}</Text>
        <Text style={styles.cardSubtitle}>Autor: {item.autor}</Text>
        <Text style={styles.cardSubtitle}>Editora: {item.editora}</Text>
        <Text style={styles.cardSubtitle}>Ano: {item.anoPublicacao}</Text>
        <Text style={styles.cardSubtitle}>Quantidade: {item.quantidade}</Text>
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editando ? 'Editar Livro Didático' : 'Novo Livro Didático'}
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
              placeholder="Ano de publicação"
              value={anoPublicacao}
              onChangeText={setAnoPublicacao}
              keyboardType="numeric"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Quantidade disponível"
              value={quantidade}
              onChangeText={setQuantidade}
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
                onPress={salvarLivro}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
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