import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStudents, addStudent, deleteStudent } from '../api/api';

const StudentScreen = () => {
  const [name, setName] = useState('');
  const [serie, setSerie] = useState('');
  const [turno, setTurno] = useState('');
  const [phone, setPhone] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar os alunos. Verifique sua conexão de internet.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadStudents();
  };

  const saveStudent = async () => {
    if (!name || !serie || !turno || !phone) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const newStudent = {
      name,
      serie,
      turno,
      phone
    };
    
    try {
      await addStudent(newStudent);
      setName('');
      setSerie('');
      setTurno('');
      setPhone('');
      loadStudents(); // Recarrega a lista
      Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar o aluno. Verifique sua conexão de internet.');
    }
  };

  const handleDeleteStudent = async (id) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este aluno?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteStudent(id);
              loadStudents(); // Recarrega a lista
            } catch (error) {
              Alert.alert('Erro', 'Falha ao excluir o aluno.');
            }
          }
        }
      ]
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>Cadastro de Alunos</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome do Aluno:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nome completo"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Série/Turma:</Text>
          <TextInput
            style={styles.input}
            value={serie}
            onChangeText={setSerie}
            placeholder="Ex: 9° ano A"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Turno:</Text>
          <TextInput
            style={styles.input}
            value={turno}
            onChangeText={setTurno}
            placeholder="Manhã, Tarde ou Noite"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Telefone (com DDD):</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
          />
        </View>
        
        <TouchableOpacity style={styles.button} onPress={saveStudent}>
          <Text style={styles.buttonText}>Cadastrar Aluno</Text>
        </TouchableOpacity>
        
        <Text style={styles.listTitle}>Alunos Cadastrados:</Text>
        
        {students.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum aluno cadastrado ainda.</Text>
        ) : (
          <FlatList
            data={students}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <View>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  <Text style={styles.itemSubtitle}>{item.serie} - {item.turno}</Text>
                  <Text style={styles.itemSubtitle}>Tel: {item.phone}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton} 
                  onPress={() => handleDeleteStudent(item._id)}
                >
                  <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            )}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            style={styles.list}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2E7D32',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#2E7D32',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#388E3C',
  },
  list: {
    marginBottom: 20,
  },
  listItem: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  deleteButton: {
    padding: 5,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 20,
  },
});

export default StudentScreen; 