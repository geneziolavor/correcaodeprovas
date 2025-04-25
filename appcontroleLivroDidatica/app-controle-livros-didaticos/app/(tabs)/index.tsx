import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Sistema de Gestão',
        headerShown: true,
        headerLargeTitle: true,
        headerStyle: {
          backgroundColor: '#344955',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }} />

      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>Controle de Livros Didáticos</Text>
        </View>

        <View style={styles.cardsContainer}>
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => router.push("/(tabs)/alunos")}
          >
            <MaterialIcons name="people" size={48} color={tintColor} />
            <Text style={styles.cardTitle}>Alunos</Text>
            <Text style={styles.cardDescription}>Gerenciar cadastro de alunos</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card} 
            onPress={() => router.push("/(tabs)/professores")}
          >
            <MaterialIcons name="school" size={48} color={tintColor} />
            <Text style={styles.cardTitle}>Professores</Text>
            <Text style={styles.cardDescription}>Gerenciar cadastro de professores</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card} 
            onPress={() => router.push("/(tabs)/disciplinas")}
          >
            <MaterialIcons name="subject" size={48} color={tintColor} />
            <Text style={styles.cardTitle}>Disciplinas</Text>
            <Text style={styles.cardDescription}>Gerenciar cadastro de disciplinas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card} 
            onPress={() => router.push("/(tabs)/livros")}
          >
            <MaterialIcons name="book" size={48} color={tintColor} />
            <Text style={styles.cardTitle}>Livros</Text>
            <Text style={styles.cardDescription}>Gerenciar acervo de livros didáticos</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card} 
            onPress={() => router.push("/(tabs)/horarios")}
          >
            <MaterialIcons name="schedule" size={48} color={tintColor} />
            <Text style={styles.cardTitle}>Horários</Text>
            <Text style={styles.cardDescription}>Gerenciar horários de aulas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card} 
            onPress={() => router.push("/(tabs)/notificacoes")}
          >
            <MaterialIcons name="notifications" size={48} color={tintColor} />
            <Text style={styles.cardTitle}>Notificações</Text>
            <Text style={styles.cardDescription}>Gerenciar notificações do sistema</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Versão 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 5,
  },
  cardsContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
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
    marginTop: 12,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 6,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 40,
  },
  footerText: {
    color: '#666666',
    fontSize: 12,
  },
});
