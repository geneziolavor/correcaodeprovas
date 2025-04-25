import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  Switch 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

export default function NotificacoesScreen() {
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(false);
  const [tempoPrevio, setTempoPrevio] = useState('30');
  const [frequencia, setFrequencia] = useState('Diária');
  const [horarioEnvio, setHorarioEnvio] = useState('07:00');
  const [configSalva, setConfigSalva] = useState(false);
  
  useEffect(() => {
    carregarConfiguracoes();
    solicitarPermissoes();
  }, []);

  const carregarConfiguracoes = async () => {
    try {
      const config = await AsyncStorage.getItem('configNotificacoes');
      if (config) {
        const { ativas, tempo, frequencia, horario } = JSON.parse(config);
        setNotificacoesAtivas(ativas);
        setTempoPrevio(tempo.toString());
        setFrequencia(frequencia);
        setHorarioEnvio(horario);
        setConfigSalva(true);
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
        frequencia,
        horario: horarioEnvio
      };
      
      await AsyncStorage.setItem('configNotificacoes', JSON.stringify(config));
      
      if (notificacoesAtivas) {
        await agendarNotificacoes();
        Alert.alert('Sucesso', 'Notificações configuradas com sucesso!');
      } else {
        await Notifications.cancelAllScheduledNotificationsAsync();
        Alert.alert('Aviso', 'Notificações desativadas.');
      }
      
      setConfigSalva(true);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as configurações.');
    }
  };

  const agendarNotificacoes = async () => {
    try {
      // Cancelar todas as notificações anteriores
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      if (!notificacoesAtivas) return;
      
      // Exemplo simples de notificação:
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Controle de Livros Didáticos',
          body: 'Lembre-se de verificar os livros necessários para hoje!',
          data: { data: 'Lembrete diário' },
        },
        trigger: { 
          seconds: 10,  // Para teste: 10 segundos após salvar
          repeats: false
        },
      });
      
      console.log('Notificação agendada com sucesso');
    } catch (error) {
      console.log('Erro ao agendar notificações:', error);
    }
  };

  const frequenciasDisponiveis = ['Diária', 'Semanal', 'Apenas dias letivos'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configuração de Notificações</Text>
      </View>
      
      <View style={styles.formContainer}>
        <View style={styles.switchRow}>
          <Text style={styles.label}>Ativar notificações</Text>
          <Switch
            value={notificacoesAtivas}
            onValueChange={setNotificacoesAtivas}
            trackColor={{ false: '#767577', true: '#F9AA33' }}
            thumbColor={notificacoesAtivas ? '#344955' : '#f4f3f4'}
          />
        </View>
        
        <Text style={styles.label}>Tempo de antecedência (minutos)</Text>
        <TextInput
          style={[styles.input, !notificacoesAtivas && styles.inputDisabled]}
          value={tempoPrevio}
          onChangeText={setTempoPrevio}
          placeholder="30"
          keyboardType="numeric"
          editable={notificacoesAtivas}
        />
        
        <Text style={styles.label}>Frequência</Text>
        <View style={styles.frequenciaContainer}>
          {frequenciasDisponiveis.map((freq) => (
            <TouchableOpacity
              key={freq}
              style={[
                styles.frequenciaButton,
                frequencia === freq && styles.frequenciaSelecionada,
                !notificacoesAtivas && styles.buttonDisabled
              ]}
              onPress={() => notificacoesAtivas && setFrequencia(freq)}
              disabled={!notificacoesAtivas}
            >
              <Text style={[
                frequencia === freq && styles.frequenciaSelecionadaTexto,
                !notificacoesAtivas && styles.textDisabled
              ]}>
                {freq}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.label}>Horário de envio</Text>
        <TextInput
          style={[styles.input, !notificacoesAtivas && styles.inputDisabled]}
          value={horarioEnvio}
          onChangeText={setHorarioEnvio}
          placeholder="07:00"
          editable={notificacoesAtivas}
        />
        
        <TouchableOpacity 
          style={[styles.button, !notificacoesAtivas && styles.buttonDisabled]} 
          onPress={salvarConfiguracoes}
          disabled={!notificacoesAtivas}
        >
          <Text style={styles.buttonText}>Salvar Configurações</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Sobre as Notificações</Text>
        <Text style={styles.infoText}>
          As notificações ajudam a lembrar professores e alunos sobre os livros didáticos necessários para as aulas.
        </Text>
        <Text style={styles.infoText}>
          Com a configuração atual, você receberá notificações {tempoPrevio} minutos antes de cada aula.
        </Text>
        <Text style={styles.infoText}>
          A frequência está configurada para: {frequencia}.
        </Text>
        {configSalva ? (
          <Text style={styles.configStatus}>
            ✓ Configurações salvas
          </Text>
        ) : (
          <Text style={styles.configStatus}>
            Configurações ainda não salvas
          </Text>
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  inputDisabled: {
    backgroundColor: '#f0f0f0',
    color: '#999',
  },
  frequenciaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  frequenciaButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  frequenciaSelecionada: {
    backgroundColor: '#F9AA33',
    borderColor: '#F9AA33',
  },
  frequenciaSelecionadaTexto: {
    fontWeight: 'bold',
    color: '#344955',
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
  textDisabled: {
    color: '#999',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#e7f3ff',
    margin: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#344955',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  configStatus: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
}); 