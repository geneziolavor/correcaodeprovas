import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getBooks, addBook, deleteBook } from '../api/api';

const BookScreen = () => {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await getBooks();
      setBooks(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar a lista de livros.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async () => {
    if (!title.trim() || !subject.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      const newBook = await addBook({ title, subject });
      setBooks([...books, newBook]);
      setTitle('');
      setSubject('');
      setModalVisible(false);
      Alert.alert('Sucesso', 'Livro adicionado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar o livro.');
    }
  };

  const handleDeleteBook = async (id) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este livro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBook(id);
              setBooks(books.filter(book => book._id !== id));
              Alert.alert('Sucesso', 'Livro excluído com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o livro.');
            }
          }
        }
      ]
    );
  };

  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookSubject}>Disciplina: {item.subject}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteBook(item._id)}
      >
        <Ionicons name="trash-outline" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Livros Didáticos</Text>
        <Text style={styles.headerSubtitle}>Cadastre os livros para cada disciplina</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
        </View>
      ) : (
        <>
          <FlatList
            data={books}
            renderItem={renderBookItem}
            keyExtractor={(item) => item._id}
            style={styles.list}
            ListEmptyComponent={
              <View style={styles.emptyList}>
                <Ionicons name="book-outline" size={50} color="#aaa" />
                <Text style={styles.emptyText}>Nenhum livro cadastrado</Text>
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
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Novo Livro</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Título do Livro</Text>
                  <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Ex: Matemática - 6º Ano"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Disciplina</Text>
                  <TextInput
                    style={styles.input}
                    value={subject}
                    onChangeText={setSubject}
                    placeholder="Ex: Matemática"
                  />
                </View>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleAddBook}
                >
                  <Text style={styles.submitButtonText}>Adicionar</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  bookItem: {
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
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bookSubject: {
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
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
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
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
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

export default BookScreen; 