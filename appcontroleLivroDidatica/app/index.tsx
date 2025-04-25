import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  const navigateTo = (route: string) => {
    router.push(route);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sistema de Gestão</Text>
        <Text style={styles.subtitle}>Livros Didáticos</Text>
      </View>

      <ScrollView style={styles.cardsContainer}>
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigateTo('/alunos')}
        >
          <MaterialIcons name="people" size={48} color="#344955" />
          <Text style={styles.cardTitle}>Alunos</Text>
          <Text style={styles.cardDescription}>Gerenciar cadastro de alunos</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigateTo('/professores')}
        >
          <MaterialIcons name="school" size={48} color="#344955" />
          <Text style={styles.cardTitle}>Professores</Text>
          <Text style={styles.cardDescription}>Gerenciar cadastro de professores</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigateTo('/disciplinas')}
        >
          <MaterialIcons name="subject" size={48} color="#344955" />
          <Text style={styles.cardTitle}>Disciplinas</Text>
          <Text style={styles.cardDescription}>Gerenciar cadastro de disciplinas</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigateTo('/livros')}
        >
          <MaterialIcons name="book" size={48} color="#344955" />
          <Text style={styles.cardTitle}>Livros</Text>
          <Text style={styles.cardDescription}>Gerenciar acervo de livros didáticos</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigateTo('/horarios')}
        >
          <MaterialIcons name="schedule" size={48} color="#344955" />
          <Text style={styles.cardTitle}>Horários</Text>
          <Text style={styles.cardDescription}>Gerenciar horários de aulas</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigateTo('/notificacoes')}
        >
          <MaterialIcons name="notifications" size={48} color="#344955" />
          <Text style={styles.cardTitle}>Notificações</Text>
          <Text style={styles.cardDescription}>Gerenciar notificações do sistema</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Versão 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#344955',
    padding: 20,
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#F9AA33',
    marginTop: 5,
  },
  cardsContainer: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#344955',
    marginTop: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 5,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#666666',
    fontSize: 12,
  },
}); 