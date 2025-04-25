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

export default function HorariosScreen() {
  const [turma, setTurma] = useState('');
  const [diaSemana, setDiaSemana] = useState('');
  const [horario, setHorario] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [professor, setProfessor] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const horariosData = await AsyncStorage.getItem('horarios');
      const professoresData = await AsyncStorage.getItem('professores');
      const disciplinasData = await AsyncStorage.getItem('disciplinas');
      
      if (horariosData) setHorarios(JSON.parse(horariosData));
      if (professoresData) setProfessores(JSON.parse(professoresData));
      if (disciplinasData) setDisciplinas(JSON.parse(disciplinasData));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados.');
    }
  };

  const salvarHorario = async () => {
    if (!turma || !diaSemana || !horario || !disciplina) {
      Alert.alert('Erro', 'Por favor, preencha os campos obrigatórios.');
      return;
    }

    const novoHorario = {
      id: Math.random().toString(),
      turma,
      diaSemana,
      horario,
      disciplina,
      professor,
    };

    const novosHorarios = [...horarios, novoHorario];
    
    try {
      await AsyncStorage.setItem('horarios', JSON.stringify(novosHorarios));
      setHorarios(novosHorarios);
      limparCampos();
      Alert.alert('Sucesso', 'Horário cadastrado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o horário.');
    }
  };

  const limparCampos = () => {
    setTurma('');
    setDiaSemana('');
    setHorario('');
    setDisciplina('');
    setProfessor('');
  };

  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cadastro de Horários</Text>
      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.label}>Turma*</Text>
        <TextInput
          style={styles.input}
          value={turma}
          onChangeText={setTurma}
          placeholder="Ex: 9º Ano A"
        />
        
        <Text style={styles.label}>Dia da Semana*</Text>
        <View style={styles.diasContainer}>
          {diasSemana.map((dia) => (
            <TouchableOpacity
              key={dia}
              style={[
                styles.diaButton,
                diaSemana === dia && styles.diaSelecionado
              ]}
              onPress={() => setDiaSemana(dia)}
            >
              <Text style={diaSemana === dia ? styles.diaSelecionadoTexto : null}>
                {dia}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.label}>Horário*</Text>
        <TextInput
          style={styles.input}
          value={horario}
          onChangeText={setHorario}
          placeholder="Ex: 07:30 - 08:20"
        />
        
        <Text style={styles.label}>Disciplina*</Text>
        <TextInput
          style={styles.input}
          value={disciplina}
          onChangeText={setDisciplina}
          placeholder="Nome da disciplina"
        />
        
        <Text style={styles.label}>Professor</Text>
        <TextInput
          style={styles.input}
          value={professor}
          onChangeText={setProfessor}
          placeholder="Nome do professor"
        />
        
        <TouchableOpacity style={styles.button} onPress={salvarHorario}>
          <Text style={styles.buttonText}>Cadastrar Horário</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Horários Cadastrados</Text>
        {horarios.length > 0 ? (
          diasSemana.map((dia) => {
            const horariosDia = horarios.filter(h => h.diaSemana === dia);
            if (horariosDia.length === 0) return null;
            
            return (
              <View key={dia} style={styles.diaGroup}>
                <Text style={styles.diaTitulo}>{dia}</Text>
                {horariosDia.map((horario) => (
                  <View key={horario.id} style={styles.listItem}>
                    <Text style={styles.listItemTitle}>
                      {horario.horario} - {horario.disciplina}
                    </Text>
                    <Text>Turma: {horario.turma}</Text>
                    {horario.professor ? (
                      <Text>Professor: {horario.professor}</Text>
                    ) : null}
                  </View>
                ))}
              </View>
            );
          })
        ) : (
          <Text style={styles.emptyText}>Nenhum horário cadastrado.</Text>
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
  diasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  diaButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  diaSelecionado: {
    backgroundColor: '#F9AA33',
    borderColor: '#F9AA33',
  },
  diaSelecionadoTexto: {
    fontWeight: 'bold',
    color: '#344955',
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
  diaGroup: {
    marginBottom: 16,
  },
  diaTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
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