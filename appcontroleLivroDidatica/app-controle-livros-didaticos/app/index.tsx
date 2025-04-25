import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  const navigateTo = (route: string) => {
    router.push(route);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sistema de Gestão de Livros Didáticos</Text>
        <Text style={styles.subtitle}>Controle eficiente para sua escola</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MaterialIcons name="book" size={36} color="#F9AA33" />
          <Text style={styles.statValue}>Livros</Text>
          <Text style={styles.statLabel}>Gerenciamento completo do acervo</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="people" size={36} color="#F9AA33" />
          <Text style={styles.statValue}>Alunos</Text>
          <Text style={styles.statLabel}>Cadastro e acompanhamento</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="school" size={36} color="#F9AA33" />
          <Text style={styles.statValue}>Professores</Text>
          <Text style={styles.statLabel}>Corpo docente completo</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Acesso Rápido</Text>
      
      <View style={styles.quickAccessContainer}>
        <TouchableOpacity 
          style={styles.quickAccessButton}
          onPress={() => navigateTo('/livros')}
        >
          <MaterialIcons name="book" size={24} color="#FFFFFF" />
          <Text style={styles.quickAccessText}>Gerenciar Livros</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickAccessButton}
          onPress={() => navigateTo('/alunos')}
        >
          <MaterialIcons name="people" size={24} color="#FFFFFF" />
          <Text style={styles.quickAccessText}>Gerenciar Alunos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickAccessButton}
          onPress={() => navigateTo('/professores')}
        >
          <MaterialIcons name="school" size={24} color="#FFFFFF" />
          <Text style={styles.quickAccessText}>Gerenciar Professores</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Versão 1.0.0</Text>
        <Text style={styles.footerText}>© 2023 Sistema de Gestão de Livros Didáticos</Text>
      </View>
    </ScrollView>
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
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    marginBottom: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#F9AA33',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    padding: 16,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    width: '30%',
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#344955',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#4A6572',
    textAlign: 'center',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#344955',
    marginLeft: 16,
    marginBottom: 16,
  },
  quickAccessContainer: {
    padding: 16,
    gap: 16,
  },
  quickAccessButton: {
    backgroundColor: '#4A6572',
    padding: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  quickAccessText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 16,
    fontSize: 16,
  },
  footer: {
    marginTop: 40,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#344955',
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginBottom: 4,
  }
}); 