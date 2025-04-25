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

export default function AlunosScreen() {
  const [nome, setNome] = useState('');
  const [serie, setSerie] = useState('');
  const [turno, setTurno] = useState('');
  const [telefone, setTelefone] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [telefoneResponsavel, setTelefoneResponsavel] = useState('');
  const [alunos, setAlunos] = useState([]);

  // Carregar alunos ao iniciar
  useEffect(() => {
    carregarAlunos();
  }, []);

  // Função para carregar alunos do armazenamento
  const carregarAlunos = async () => {
    try {
      const alunosData = await AsyncStorage.getItem('alunos');
      if (alunosData) {
        setAlunos(JSON.parse(alunosData));
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os alunos.');
    }
  };

  // Função para salvar aluno
  const salvarAluno = async () => {
    if (!nome || !serie || !turno) {
      Alert.alert('Erro', 'Por favor, preencha os campos obrigatórios.');
      return;
    }

    const novoAluno = {
      id: Math.random().toString(),
      nome,
      serie,
      turno,
      telefone,
      responsavel,
      telefoneResponsavel,
    };

    const novosAlunos = [...alunos, novoAluno];
    
    try {
      await AsyncStorage.setItem('alunos', JSON.stringify(novosAlunos));
      setAlunos(novosAlunos);
      limparCampos();
      Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o aluno.');
    }
  };

  // Função para limpar campos do formulário
  const limparCampos = () => {
    setNome('');
    setSerie('');
    setTurno('');
    setTelefone('');
    setResponsavel('');
    setTelefoneResponsavel('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cadastro de Alunos</Text>
      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.label}>Nome*</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Nome do aluno"
        />
        
        <Text style={styles.label}>Série*</Text>
        <TextInput
          style={styles.input}
          value={serie}
          onChangeText={setSerie}
          placeholder="Série/Ano"
        />
        
        <Text style={styles.label}>Turno*</Text>
        <TextInput
          style={styles.input}
          value={turno}
          onChangeText={setTurno}
          placeholder="Matutino/Vespertino/Noturno"
        />
        
        <Text style={styles.label}>Telefone do Aluno</Text>
        <TextInput
          style={styles.input}
          value={telefone}
          onChangeText={setTelefone}
          placeholder="(XX) XXXXX-XXXX"
          keyboardType="phone-pad"
        />
        
        <Text style={styles.label}>Nome do Responsável</Text>
        <TextInput
          style={styles.input}
          value={responsavel}
          onChangeText={setResponsavel}
          placeholder="Nome do responsável"
        />
        
        <Text style={styles.label}>Telefone do Responsável</Text>
        <TextInput
          style={styles.input}
          value={telefoneResponsavel}
          onChangeText={setTelefoneResponsavel}
          placeholder="(XX) XXXXX-XXXX"
          keyboardType="phone-pad"
        />
        
        <TouchableOpacity style={styles.button} onPress={salvarAluno}>
          <Text style={styles.buttonText}>Cadastrar Aluno</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Alunos Cadastrados</Text>
        {alunos.length > 0 ? (
          alunos.map((aluno) => (
            <View key={aluno.id} style={styles.listItem}>
              <Text style={styles.listItemTitle}>{aluno.nome}</Text>
              <Text>Série: {aluno.serie} - Turno: {aluno.turno}</Text>
              <Text>Telefone: {aluno.telefone || 'Não informado'}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhum aluno cadastrado.</Text>
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