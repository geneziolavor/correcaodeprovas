import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipo para representar uma notificação
interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  data: string;
  destinatarios: string;
  lida: boolean;
}

export default function NotificacoesScreen() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([
    { 
      id: '1', 
      titulo: 'Reunião de Pais e Mestres', 
      mensagem: 'Informamos que no dia 15/05 haverá reunião de pais e mestres às 19h.', 
      data: '10/05/2023', 
      destinatarios: 'Todos',
      lida: true
    },
    { 
      id: '2', 
      titulo: 'Alteração no Horário de Aulas', 
      mensagem: 'A partir do dia 20/05, as aulas do período matutino iniciarão às 7h30.', 
      data: '12/05/2023', 
      destinatarios: 'Alunos do período matutino',
      lida: false
    },
    { 
      id: '3', 
      titulo: 'Entrega de Livros Didáticos', 
      mensagem: 'Os livros didáticos do 2º bimestre serão entregues na próxima semana.', 
      data: '14/05/2023', 
      destinatarios: 'Professores',
      lida: false
    },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [destinatarios, setDestinatarios] = useState('');
  const [editando, setEditando] = useState(false);
  const [notificacaoAtual, setNotificacaoAtual] = useState<Notificacao | null>(null);

  // Carregar notificações ao inicializar o componente
  useEffect(() => {
    carregarNotificacoes();
  }, []);

  // Função para carregar notificações salvas
  const carregarNotificacoes = async () => {
    try {
      const notificacoesJSON = await AsyncStorage.getItem('@notificacoes');
      if (notificacoesJSON) {
        setNotificacoes(JSON.parse(notificacoesJSON));
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      Alert.alert('Erro', 'Não foi possível carregar as notificações.');
    }
  };

  // Função para salvar notificações
  const salvarNotificacoesNoStorage = async (novosDados: Notificacao[]) => {
    try {
      await AsyncStorage.setItem('@notificacoes', JSON.stringify(novosDados));
    } catch (error) {
      console.error('Erro ao salvar notificações:', error);
      Alert.alert('Erro', 'Não foi possível salvar as notificações.');
    }
  };

  const limparFormulario = () => {
    setTitulo('');
    setMensagem('');
    setDestinatarios('');
    setEditando(false);
    setNotificacaoAtual(null);
  };

  const abrirModal = (notificacao?: Notificacao) => {
    limparFormulario();
    
    if (notificacao) {
      setTitulo(notificacao.titulo);
      setMensagem(notificacao.mensagem);
      setDestinatarios(notificacao.destinatarios);
      setEditando(true);
      setNotificacaoAtual(notificacao);
    }
    
    setModalVisible(true);
  };

  const salvarNotificacao = () => {
    if (!titulo || !mensagem || !destinatarios) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const dataAtual = new Date();
    const dataFormatada = `${dataAtual.getDate().toString().padStart(2, '0')}/${(dataAtual.getMonth() + 1).toString().padStart(2, '0')}/${dataAtual.getFullYear()}`;

    let novasNotificacoes: Notificacao[];

    if (editando && notificacaoAtual) {
      // Atualiza a notificação existente
      novasNotificacoes = notificacoes.map(n => 
        n.id === notificacaoAtual.id 
          ? { ...n, titulo, mensagem, destinatarios } 
          : n
      );
    } else {
      // Adiciona nova notificação
      const novaNotificacao: Notificacao = {
        id: Date.now().toString(),
        titulo,
        mensagem,
        data: dataFormatada,
        destinatarios,
        lida: false
      };
      novasNotificacoes = [...notificacoes, novaNotificacao];
    }

    setNotificacoes(novasNotificacoes);
    salvarNotificacoesNoStorage(novasNotificacoes);
    setModalVisible(false);
    limparFormulario();
  };

  const marcarComoLida = (id: string) => {
    const novasNotificacoes = notificacoes.map(notificacao => 
      notificacao.id === id 
        ? { ...notificacao, lida: true } 
        : notificacao
    );
    setNotificacoes(novasNotificacoes);
    salvarNotificacoesNoStorage(novasNotificacoes);
  };

  const excluirNotificacao = (id: string) => {
    Alert.alert(
      'Confirmação',
      'Tem certeza que deseja excluir esta notificação?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            const novasNotificacoes = notificacoes.filter(notificacao => notificacao.id !== id);
            setNotificacoes(novasNotificacoes);
            salvarNotificacoesNoStorage(novasNotificacoes);
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: Notificacao }) => (
    <View style={[styles.card, !item.lida && styles.cardNaoLida]}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.titulo}</Text>
        <Text style={styles.cardSubtitle}>{item.mensagem}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardDate}>Data: {item.data}</Text>
          <Text style={styles.cardDestination}>Para: {item.destinatarios}</Text>
        </View>
      </View>
      <View style={styles.cardActions}>
        {!item.lida && (
          <TouchableOpacity onPress={() => marcarComoLida(item.id)}>
            <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => abrirModal(item)}>
          <MaterialIcons name="edit" size={24} color="#344955" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => excluirNotificacao(item.id)}>
          <MaterialIcons name="delete" size={24} color="#FF5252" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Notificações',
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
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editando ? 'Editar Notificação' : 'Nova Notificação'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Título"
              value={titulo}
              onChangeText={setTitulo}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Mensagem"
              value={mensagem}
              onChangeText={setMensagem}
              multiline
              numberOfLines={5}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Destinatários (ex: Todos, Professores, Alunos)"
              value={destinatarios}
              onChangeText={setDestinatarios}
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
                onPress={salvarNotificacao}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        data={notificacoes}
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
  cardNaoLida: {
    borderLeftWidth: 5,
    borderLeftColor: '#F9AA33',
  },
  cardContent: {
    flex: 1,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#344955',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#4A6572',
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cardDate: {
    fontSize: 12,
    color: '#888',
  },
  cardDestination: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  cardActions: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 90,
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