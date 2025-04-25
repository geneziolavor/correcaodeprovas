import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LivrosScreen() {
  const [titulo, setTitulo] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [serie, setSerie] = useState('');
  const [autor, setAutor] = useState('');
  const [livros, setLivros] = useState([]);

  useEffect(() => {
    carregarLivros();
  }, []);

  const carregarLivros = async () => {
    try {
      const data = await AsyncStorage.getItem('livros');
      if (data) {
        setLivros(JSON.parse(data));
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os livros.');
    }
  };

  const salvarLivro = async () => {
    if (!titulo || !disciplina || !serie) {
      Alert.alert('Erro', 'Por favor, preencha os campos obrigatórios.');
      return;
    }

    const novoLivro = {
      id: Math.random().toString(),
      titulo,
      disciplina,
      serie,
      autor,
    };

    const novosLivros = [...livros, novoLivro];
    
    try {
      await AsyncStorage.setItem('livros', JSON.stringify(novosLivros));
      setLivros(novosLivros);
      limparCampos();
      Alert.alert('Sucesso', 'Livro cadastrado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o livro.');
    }
  };

  const limparCampos = () => {
    setTitulo('');
    setDisciplina('');
    setSerie('');
    setAutor('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cadastro de Livros Didáticos</Text>
      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.label}>Título*</Text>
        <TextInput
          style={styles.input}
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Título do livro"
        />
        
        <Text style={styles.label}>Disciplina*</Text>
        <TextInput
          style={styles.input}
          value={disciplina}
          onChangeText={setDisciplina}
          placeholder="Disciplina relacionada"
        />
        
        <Text style={styles.label}>Série/Ano*</Text>
        <TextInput
          style={styles.input}
          value={serie}
          onChangeText={setSerie}
          placeholder="Série ou ano escolar"
        />
        
        <Text style={styles.label}>Autor</Text>
        <TextInput
          style={styles.input}
          value={autor}
          onChangeText={setAutor}
          placeholder="Nome do autor"
        />
        
        <TouchableOpacity style={styles.button} onPress={salvarLivro}>
          <Text style={styles.buttonText}>Cadastrar Livro</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Livros Cadastrados</Text>
        {livros.length > 0 ? (
          livros.map((livro) => (
            <View key={livro.id} style={styles.listItem}>
              <Text style={styles.listItemTitle}>{livro.titulo}</Text>
              <Text>Disciplina: {livro.disciplina}</Text>
              <Text>Série: {livro.serie}</Text>
              <Text>Autor: {livro.autor || 'Não informado'}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhum livro cadastrado.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#344955',
    padding: 16,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  formContainer: {
    padding: 16,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#F9AA33',
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#344955',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    marginBottom: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#344955',
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#999',
    textAlign: 'center',
    marginVertical: 16,
  },
}); 