import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Alert,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

interface Professor {
  id: string;
  nome: string;
  disciplina: string;
  formacao: string;
  contato: string;
}

export default function ProfessoresScreen() {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [formacao, setFormacao] = useState('');
  const [contato, setContato] = useState('');
  const [professorEditando, setProfessorEditando] = useState<string | null>(null);

  useEffect(() => {
    carregarProfessores();
  }, []);

  const carregarProfessores = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@professores_data');
      if (jsonValue !== null) {
        setProfessores(JSON.parse(jsonValue));
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar os professores.');
    }
  };

  const limparFormulario = () => {
    setNome('');
    setDisciplina('');
    setFormacao('');
    setContato('');
    setProfessorEditando(null);
  };

  const abrirModal = (professor?: Professor) => {
    limparFormulario();
    if (professor) {
      setNome(professor.nome);
      setDisciplina(professor.disciplina);
      setFormacao(professor.formacao);
      setContato(professor.contato);
      setProfessorEditando(professor.id);
    }
    setModalVisible(true);
  };

  const salvarProfessor = async () => {
    if (!nome.trim() || !disciplina.trim()) {
      Alert.alert('Erro', 'Nome e disciplina são obrigatórios.');
      return;
    }

    try {
      let novaLista;
      const novoProfessor: Professor = {
        id: professorEditando || Date.now().toString(),
        nome,
        disciplina,
        formacao,
        contato
      };

      if (professorEditando) {
        // Editando professor existente
        novaLista = professores.map(p => 
          p.id === professorEditando ? novoProfessor : p
        );
      } else {
        // Adicionando novo professor
        novaLista = [...professores, novoProfessor];
      }

      await AsyncStorage.setItem('@professores_data', JSON.stringify(novaLista));
      setProfessores(novaLista);
      setModalVisible(false);
      limparFormulario();
      Alert.alert('Sucesso', professorEditando ? 'Professor atualizado com sucesso.' : 'Professor cadastrado com sucesso.');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar o professor.');
    }
  };

  const excluirProfessor = async (id: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este professor?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const novaLista = professores.filter(p => p.id !== id);
              await AsyncStorage.setItem('@professores_data', JSON.stringify(novaLista));
              setProfessores(novaLista);
              Alert.alert('Sucesso', 'Professor excluído com sucesso.');
            } catch (e) {
              Alert.alert('Erro', 'Não foi possível excluir o professor.');
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: Professor }) => (
    <View style={styles.professorItem}>
      <View style={styles.professorInfo}>
        <Text style={styles.professorNome}>{item.nome}</Text>
        <Text style={styles.professorDisciplina}>Disciplina: {item.disciplina}</Text>
        {item.formacao ? (
          <Text style={styles.professorDetalhe}>Formação: {item.formacao}</Text>
        ) : null}
        {item.contato ? (
          <Text style={styles.professorDetalhe}>Contato: {item.contato}</Text>
        ) : null}
      </View>
      <View style={styles.acoes}>
        <TouchableOpacity onPress={() => abrirModal(item)} style={styles.botaoEditar}>
          <MaterialIcons name="edit" size={24} color="#344955" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => excluirProfessor(item.id)} style={styles.botaoExcluir}>
          <MaterialIcons name="delete" size={24} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {professores.length > 0 ? (
        <FlatList
          data={professores}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listaContainer}
        />
      ) : (
        <View style={styles.semDados}>
          <MaterialIcons name="person-search" size={50} color="#344955" />
          <Text style={styles.semDadosTexto}>Nenhum professor cadastrado</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.botaoAdicionar}
        onPress={() => abrirModal()}
      >
        <MaterialIcons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.centeredView}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitulo}>
              {professorEditando ? 'Editar Professor' : 'Novo Professor'}
            </Text>
            
            <View style={styles.campoFormulario}>
              <Text style={styles.label}>Nome*</Text>
              <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Nome do professor"
              />
            </View>
            
            <View style={styles.campoFormulario}>
              <Text style={styles.label}>Disciplina*</Text>
              <TextInput
                style={styles.input}
                value={disciplina}
                onChangeText={setDisciplina}
                placeholder="Disciplina que leciona"
              />
            </View>
            
            <View style={styles.campoFormulario}>
              <Text style={styles.label}>Formação</Text>
              <TextInput
                style={styles.input}
                value={formacao}
                onChangeText={setFormacao}
                placeholder="Formação acadêmica"
              />
            </View>
            
            <View style={styles.campoFormulario}>
              <Text style={styles.label}>Contato</Text>
              <TextInput
                style={styles.input}
                value={contato}
                onChangeText={setContato}
                placeholder="E-mail ou telefone"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.botoesModal}>
              <TouchableOpacity
                style={[styles.botao, styles.botaoCancelar]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.botao, styles.botaoSalvar]}
                onPress={salvarProfessor}
              >
                <Text style={styles.textoBotaoSalvar}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listaContainer: {
    padding: 16,
  },
  professorItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  professorInfo: {
    flex: 1,
  },
  professorNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#344955',
    marginBottom: 4,
  },
  professorDisciplina: {
    fontSize: 16,
    color: '#4A6572',
    marginBottom: 4,
  },
  professorDetalhe: {
    fontSize: 14,
    color: '#4A6572',
    marginBottom: 2,
  },
  acoes: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoEditar: {
    padding: 8,
    marginBottom: 8,
  },
  botaoExcluir: {
    padding: 8,
  },
  botaoAdicionar: {
    position: 'absolute',
    right: 25,
    bottom: 25,
    backgroundColor: '#F9AA33',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#344955',
    marginBottom: 15,
    textAlign: 'center',
  },
  campoFormulario: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#4A6572',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  botoesModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  botao: {
    borderRadius: 5,
    padding: 12,
    width: '48%',
    alignItems: 'center',
  },
  botaoCancelar: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  textoBotaoCancelar: {
    color: '#4A6572',
    fontWeight: 'bold',
  },
  botaoSalvar: {
    backgroundColor: '#344955',
  },
  textoBotaoSalvar: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  semDados: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  semDadosTexto: {
    fontSize: 18,
    color: '#4A6572',
    marginTop: 10,
    textAlign: 'center',
  },
}); 