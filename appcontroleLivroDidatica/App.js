import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  FlatList,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Configuração das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Configuração dos navegadores
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Componente Tela Inicial
const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sistema de Controle Escolar</Text>
      </View>
      
      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Alunos')}
        >
          <Icon name="people" size={40} color="#4A6572" />
          <Text style={styles.menuText}>Alunos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Professores')}
        >
          <Icon name="school" size={40} color="#4A6572" />
          <Text style={styles.menuText}>Professores</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Disciplinas')}
        >
          <Icon name="menu-book" size={40} color="#4A6572" />
          <Text style={styles.menuText}>Disciplinas</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Livros')}
        >
          <Icon name="library-books" size={40} color="#4A6572" />
          <Text style={styles.menuText}>Livros</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Horarios')}
        >
          <Icon name="schedule" size={40} color="#4A6572" />
          <Text style={styles.menuText}>Horários</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Notificacoes')}
        >
          <Icon name="notifications" size={40} color="#4A6572" />
          <Text style={styles.menuText}>Notificações</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Tela de Cadastro de Alunos
const AlunosScreen = () => {
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
};

// Tela de Professores
const ProfessoresScreen = () => {
  const [nome, setNome] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [telefone, setTelefone] = useState('');
  const [professores, setProfessores] = useState([]);

  useEffect(() => {
    carregarProfessores();
  }, []);

  const carregarProfessores = async () => {
    try {
      const data = await AsyncStorage.getItem('professores');
      if (data) {
        setProfessores(JSON.parse(data));
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os professores.');
    }
  };

  const salvarProfessor = async () => {
    if (!nome || !disciplina) {
      Alert.alert('Erro', 'Por favor, preencha os campos obrigatórios.');
      return;
    }

    const novoProfessor = {
      id: Math.random().toString(),
      nome,
      disciplina,
      telefone,
    };

    const novosProfessores = [...professores, novoProfessor];
    
    try {
      await AsyncStorage.setItem('professores', JSON.stringify(novosProfessores));
      setProfessores(novosProfessores);
      limparCampos();
      Alert.alert('Sucesso', 'Professor cadastrado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o professor.');
    }
  };

  const limparCampos = () => {
    setNome('');
    setDisciplina('');
    setTelefone('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cadastro de Professores</Text>
      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.label}>Nome*</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Nome do professor"
        />
        
        <Text style={styles.label}>Disciplina*</Text>
        <TextInput
          style={styles.input}
          value={disciplina}
          onChangeText={setDisciplina}
          placeholder="Disciplina lecionada"
        />
        
        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          value={telefone}
          onChangeText={setTelefone}
          placeholder="(XX) XXXXX-XXXX"
          keyboardType="phone-pad"
        />
        
        <TouchableOpacity style={styles.button} onPress={salvarProfessor}>
          <Text style={styles.buttonText}>Cadastrar Professor</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Professores Cadastrados</Text>
        {professores.length > 0 ? (
          professores.map((professor) => (
            <View key={professor.id} style={styles.listItem}>
              <Text style={styles.listItemTitle}>{professor.nome}</Text>
              <Text>Disciplina: {professor.disciplina}</Text>
              <Text>Telefone: {professor.telefone || 'Não informado'}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhum professor cadastrado.</Text>
        )}
      </View>
    </ScrollView>
  );
};

// Tela de Cadastro de Livros
const LivrosScreen = () => {
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
};

// Tela de Horários
const HorariosScreen = () => {
  const [serie, setSerie] = useState('');
  const [turma, setTurma] = useState('');
  const [diaSemana, setDiaSemana] = useState('');
  const [horario, setHorario] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [professor, setProfessor] = useState('');
  const [livro, setLivro] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [livros, setLivros] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const horariosData = await AsyncStorage.getItem('horarios');
      const professoresData = await AsyncStorage.getItem('professores');
      const livrosData = await AsyncStorage.getItem('livros');
      
      if (horariosData) setHorarios(JSON.parse(horariosData));
      if (professoresData) setProfessores(JSON.parse(professoresData));
      if (livrosData) setLivros(JSON.parse(livrosData));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados.');
    }
  };

  const salvarHorario = async () => {
    if (!serie || !turma || !diaSemana || !horario || !disciplina) {
      Alert.alert('Erro', 'Por favor, preencha os campos obrigatórios.');
      return;
    }

    const novoHorario = {
      id: Math.random().toString(),
      serie,
      turma,
      diaSemana,
      horario,
      disciplina,
      professor,
      livro,
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
    setSerie('');
    setTurma('');
    setDiaSemana('');
    setHorario('');
    setDisciplina('');
    setProfessor('');
    setLivro('');
  };

  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Horários de Aulas</Text>
      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.label}>Série/Ano*</Text>
        <TextInput
          style={styles.input}
          value={serie}
          onChangeText={setSerie}
          placeholder="Ex: 1º Ano"
        />
        
        <Text style={styles.label}>Turma*</Text>
        <TextInput
          style={styles.input}
          value={turma}
          onChangeText={setTurma}
          placeholder="Ex: A, B, C"
        />
        
        <Text style={styles.label}>Dia da Semana*</Text>
        <View style={styles.pickerContainer}>
          {diasSemana.map((dia) => (
            <TouchableOpacity 
              key={dia}
              style={[
                styles.dayButton,
                diaSemana === dia && styles.selectedDay
              ]}
              onPress={() => setDiaSemana(dia)}
            >
              <Text 
                style={[
                  styles.dayButtonText,
                  diaSemana === dia && styles.selectedDayText
                ]}
              >
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
        
        <Text style={styles.label}>Livro Didático</Text>
        <TextInput
          style={styles.input}
          value={livro}
          onChangeText={setLivro}
          placeholder="Título do livro"
        />
        
        <TouchableOpacity style={styles.button} onPress={salvarHorario}>
          <Text style={styles.buttonText}>Cadastrar Horário</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Horários Cadastrados</Text>
        {horarios.length > 0 ? (
          <View>
            {diasSemana.map((dia) => {
              const horariosDia = horarios.filter(h => h.diaSemana === dia);
              if (horariosDia.length === 0) return null;
              
              return (
                <View key={dia} style={styles.diaContainer}>
                  <Text style={styles.diaTitle}>{dia}</Text>
                  {horariosDia.map((horario) => (
                    <View key={horario.id} style={styles.listItem}>
                      <Text style={styles.listItemTitle}>
                        {horario.horario} - {horario.disciplina}
                      </Text>
                      <Text>Série: {horario.serie} {horario.turma}</Text>
                      <Text>Professor: {horario.professor || 'Não informado'}</Text>
                      <Text>Livro: {horario.livro || 'Não informado'}</Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={styles.emptyText}>Nenhum horário cadastrado.</Text>
        )}
      </View>
    </ScrollView>
  );
};

// Tela de Disciplinas
const DisciplinasScreen = () => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
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
      Alert.alert('Erro', 'Por favor, preencha o nome da disciplina.');
      return;
    }

    const novaDisciplina = {
      id: Math.random().toString(),
      nome,
      descricao,
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
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cadastro de Disciplinas</Text>
      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.label}>Nome da Disciplina*</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Ex: Matemática"
        />
        
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Descrição da disciplina"
          multiline
          numberOfLines={4}
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
                <Text>{disciplina.descricao}</Text>
              ) : null}
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhuma disciplina cadastrada.</Text>
        )}
      </View>
    </ScrollView>
  );
};

// Tela de Notificações
const NotificacoesScreen = () => {
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(false);
  const [tempoPrevio, setTempoPrevio] = useState('30');
  const [quantidadeAlertas, setQuantidadeAlertas] = useState('3');
  
  useEffect(() => {
    carregarConfiguracoes();
    solicitarPermissoes();
  }, []);

  const carregarConfiguracoes = async () => {
    try {
      const config = await AsyncStorage.getItem('configNotificacoes');
      if (config) {
        const { ativas, tempo, quantidade } = JSON.parse(config);
        setNotificacoesAtivas(ativas);
        setTempoPrevio(tempo.toString());
        setQuantidadeAlertas(quantidade.toString());
      }
    } catch (error) {
      console.log('Erro ao carregar configurações:', error);
    }
  };

  const solicitarPermissoes = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'As notificações precisam de permissão para funcionar.');
      setNotificacoesAtivas(false);
    }
  };

  const salvarConfiguracoes = async () => {
    try {
      const config = {
        ativas: notificacoesAtivas,
        tempo: parseInt(tempoPrevio),
        quantidade: parseInt(quantidadeAlertas)
      };
      
      await AsyncStorage.setItem('configNotificacoes', JSON.stringify(config));
      
      if (notificacoesAtivas) {
        await agendarNotificacoes();
        Alert.alert('Sucesso', 'Notificações configuradas com sucesso!');
      } else {
        await Notifications.cancelAllScheduledNotificationsAsync();
        Alert.alert('Aviso', 'Notificações desativadas.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as configurações.');
    }
  };

  const agendarNotificacoes = async () => {
    try {
      // Cancelar todas as notificações anteriores
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      if (!notificacoesAtivas) return;
      
      // Carregar horários e alunos para gerar notificações
      const horariosData = await AsyncStorage.getItem('horarios');
      const alunosData = await AsyncStorage.getItem('alunos');
      
      if (!horariosData || !alunosData) {
        Alert.alert('Aviso', 'Não há dados suficientes para agendar notificações.');
        return;
      }
      
      const horarios = JSON.parse(horariosData);
      
      // Aqui seria o lugar para criar notificações personalizadas para cada aluno
      // baseado em seus horários e os livros necessários
      
      // Exemplo simples de notificação geral:
      const identificador = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Lembrete de Aula',
          body: 'Não esqueça de verificar seus horários e livros para hoje!',
          data: { data: 'Verificação diária' },
        },
        trigger: { 
          seconds: 60,  // Agendando para 1 minuto depois
          repeats: false
        },
      });
      
      console.log('Notificação agendada:', identificador);
    } catch (error) {
      console.log('Erro ao agendar notificações:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configurações de Notificações</Text>
      </View>
      
      <View style={styles.formContainer}>
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Ativar notificações</Text>
          <TouchableOpacity 
            style={[
              styles.switch,
              notificacoesAtivas ? styles.switchOn : styles.switchOff
            ]}
            onPress={() => setNotificacoesAtivas(!notificacoesAtivas)}
          >
            <View style={[
              styles.switchHandle,
              notificacoesAtivas ? styles.switchHandleOn : styles.switchHandleOff
            ]} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.label}>Tempo antes da aula (minutos)</Text>
        <TextInput
          style={styles.input}
          value={tempoPrevio}
          onChangeText={setTempoPrevio}
          placeholder="30"
          keyboardType="numeric"
          editable={notificacoesAtivas}
        />
        
        <Text style={styles.label}>Quantidade de alertas</Text>
        <TextInput
          style={styles.input}
          value={quantidadeAlertas}
          onChangeText={setQuantidadeAlertas}
          placeholder="3"
          keyboardType="numeric"
          editable={notificacoesAtivas}
        />
        
        <TouchableOpacity 
          style={[styles.button, !notificacoesAtivas && styles.buttonDisabled]}
          onPress={salvarConfiguracoes}
        >
          <Text style={styles.buttonText}>Salvar Configurações</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Como funcionam as notificações</Text>
        <Text style={styles.infoText}>
          As notificações serão enviadas {tempoPrevio} minutos antes de cada aula,
          lembrando qual livro didático levar para a escola.
        </Text>
        <Text style={styles.infoText}>
          Serão enviados {quantidadeAlertas} alertas para garantir que o aluno não esqueça.
        </Text>
        <Text style={styles.infoText}>
          Certifique-se de que todos os horários e livros estejam corretamente cadastrados
          no sistema para que as notificações funcionem adequadamente.
        </Text>
      </View>
    </ScrollView>
  );
};

// Serviço de Notificações
const NotificacaoService = {
  // Agendar notificações para um aluno específico
  agendarNotificacoesAluno: async (alunoId) => {
    try {
      // Recuperar configurações de notificação
      const configData = await AsyncStorage.getItem('configNotificacoes');
      if (!configData) return;
      
      const { ativas, tempo, quantidade } = JSON.parse(configData);
      if (!ativas) return;
      
      // Recuperar dados do aluno
      const alunosData = await AsyncStorage.getItem('alunos');
      if (!alunosData) return;
      
      const alunos = JSON.parse(alunosData);
      const aluno = alunos.find(a => a.id === alunoId);
      if (!aluno) return;
      
      // Recuperar horários para a série do aluno
      const horariosData = await AsyncStorage.getItem('horarios');
      if (!horariosData) return;
      
      const horarios = JSON.parse(horariosData);
      const horariosAluno = horarios.filter(h => h.serie === aluno.serie);
      
      // Recuperar livros
      const livrosData = await AsyncStorage.getItem('livros');
      if (!livrosData) return;
      
      const livros = JSON.parse(livrosData);
      
      // Mapear dias da semana para números (0 = domingo, 1 = segunda, etc.)
      const diasSemanaMap = {
        'Domingo': 0,
        'Segunda': 1,
        'Terça': 2,
        'Quarta': 3,
        'Quinta': 4,
        'Sexta': 5,
        'Sábado': 6
      };
      
      // Para cada horário da semana, agendar notificações
      for (const horario of horariosAluno) {
        // Encontrar o livro associado à disciplina
        const livroInfo = livros.find(l => 
          l.disciplina === horario.disciplina && l.serie === aluno.serie
        );
        
        if (!livroInfo) continue;
        
        // Extrair hora e minuto do formato "HH:MM - HH:MM"
        const horaInicio = horario.horario.split(' - ')[0];
        const [hora, minuto] = horaInicio.split(':').map(n => parseInt(n));
        
        // Calcular o próximo dia da semana
        const diaSemanaNumero = diasSemanaMap[horario.diaSemana];
        if (diaSemanaNumero === undefined) continue;
        
        // Criar notificações para cada alerta conforme a quantidade configurada
        for (let i = 0; i < quantidade; i++) {
          // Calcular o tempo para cada alerta (espaçados por 5 minutos)
          const minutosAntecipacao = tempo + (i * 5);
          
          // Agendar notificação
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `Lembrete: Aula de ${horario.disciplina}`,
              body: `Não esqueça de levar o livro "${livroInfo.titulo}" para a aula de ${horario.disciplina} hoje às ${horaInicio}.`,
              data: { horarioId: horario.id, alunoId: aluno.id },
            },
            trigger: {
              weekday: diaSemanaNumero + 1, // API espera 1-7 (segunda-domingo)
              hour: hora,
              minute: Math.max(0, minuto - minutosAntecipacao),
              repeats: true,
            },
          });
        }
      }
      
      console.log(`Notificações agendadas para o aluno ${aluno.nome}`);
      return true;
    } catch (error) {
      console.error('Erro ao agendar notificações:', error);
      return false;
    }
  },
  
  // Agendar notificações para todos os alunos
  agendarNotificacoesTodos: async () => {
    try {
      // Limpar todas as notificações existentes
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      // Recuperar todos os alunos
      const alunosData = await AsyncStorage.getItem('alunos');
      if (!alunosData) return;
      
      const alunos = JSON.parse(alunosData);
      
      // Agendar notificações para cada aluno
      for (const aluno of alunos) {
        await NotificacaoService.agendarNotificacoesAluno(aluno.id);
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao agendar notificações para todos:', error);
      return false;
    }
  }
};

// Componente principal de navegação
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Alunos') {
              iconName = 'people';
            } else if (route.name === 'Professores') {
              iconName = 'school';
            } else if (route.name === 'Livros') {
              iconName = 'library-books';
            } else if (route.name === 'Horarios') {
              iconName = 'schedule';
            } else if (route.name === 'Notificacoes') {
              iconName = 'notifications';
            } else if (route.name === 'Disciplinas') {
              iconName = 'menu-book';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#344955',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Alunos" component={AlunosScreen} />
        <Tab.Screen name="Professores" component={ProfessoresScreen} />
        <Tab.Screen name="Disciplinas" component={DisciplinasScreen} />
        <Tab.Screen name="Livros" component={LivrosScreen} />
        <Tab.Screen name="Horarios" component={HorariosScreen} />
        <Tab.Screen name="Notificacoes" component={NotificacoesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

// Definição de estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#344955',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItem: {
    width: '48%',
    backgroundColor: '#F9AA33',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  menuText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#344955',
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
  buttonDisabled: {
    backgroundColor: '#ddd',
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
  diaContainer: {
    marginBottom: 16,
  },
  diaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  dayButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedDay: {
    backgroundColor: '#F9AA33',
    borderColor: '#F9AA33',
  },
  dayButtonText: {
    color: '#333',
  },
  selectedDayText: {
    color: '#344955',
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 2,
  },
  switchOn: {
    backgroundColor: '#F9AA33',
  },
  switchOff: {
    backgroundColor: '#ddd',
  },
  switchHandle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
  },
  switchHandleOn: {
    alignSelf: 'flex-end',
  },
  switchHandleOff: {
    alignSelf: 'flex-start',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#E7F3FF',
    margin: 16,
    borderRadius: 8,
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#344955',
  },
  infoText: {
    marginBottom: 8,
    color: '#333',
  },
});

// Componente principal da aplicação
export default function App() {
  useEffect(() => {
    // Registrar manipulador de notificações
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificação recebida:', notification);
    });
    
    // Inicializar as permissões de notificação
    const inicializarNotificacoes = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      console.log('Status da permissão de notificações:', status);
    };
    
    inicializarNotificacoes();
    
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <AppNavigator />
  );
} 