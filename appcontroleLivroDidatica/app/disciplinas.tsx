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

export default function DisciplinasScreen() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [disciplinas, setDisciplinas] = useState([]);

  useEffect(() => {
    carregarDisciplinas();
  }, []);

  const carregarDisciplinas = async () => {
    try {
      const data = await AsyncStorage.getItem('disciplinas');
      if (data) {
        setDisciplinas(JSON.parse(data));
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as disciplinas.');
    }
  };

  const salvarDisciplina = async () => {
    if (!nome) {
      Alert.alert('Erro', 'Por favor, informe o nome da disciplina.');
      return;
    }

    const novaDisciplina = {
      id: Math.random().toString(),
      nome,
      descricao,
      cargaHoraria,
    };

    const novasDisciplinas = [...disciplinas, novaDisciplina];
    
    try {
      await AsyncStorage.setItem('disciplinas', JSON.stringify(novasDisciplinas));
      setDisciplinas(novasDisciplinas);
      limparCampos();
      Alert.alert('Sucesso', 'Disciplina cadastrada com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a disciplina.');
    }
  };

  const limparCampos = () => {
    setNome('');
    setDescricao('');
    setCargaHoraria('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cadastro de Disciplinas</Text>
      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.label}>Nome*</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Nome da disciplina"
        />
        
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={styles.input}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Descrição da disciplina"
          multiline
          numberOfLines={3}
        />
        
        <Text style={styles.label}>Carga Horária</Text>
        <TextInput
          style={styles.input}
          value={cargaHoraria}
          onChangeText={setCargaHoraria}
          placeholder="Carga horária (horas)"
          keyboardType="numeric"
        />
        
        <TouchableOpacity style={styles.button} onPress={salvarDisciplina}>
          <Text style={styles.buttonText}>Cadastrar Disciplina</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Disciplinas Cadastradas</Text>
        {disciplinas.length > 0 ? (
          disciplinas.map((disciplina) => (
            <View key={disciplina.id} style={styles.listItem}>
              <Text style={styles.listItemTitle}>{disciplina.nome}</Text>
              {disciplina.descricao ? (
                <Text>Descrição: {disciplina.descricao}</Text>
              ) : null}
              {disciplina.cargaHoraria ? (
                <Text>Carga Horária: {disciplina.cargaHoraria}h</Text>
              ) : null}
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhuma disciplina cadastrada.</Text>
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