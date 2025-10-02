import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.schoolName}>ESCOLA PROFESSOR PEDRO TEIXEIRA BARROSO</Text>
        <Text style={styles.appName}>Controle de Livros Didáticos</Text>
      </View>
      
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/book.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      
      <Text style={styles.description}>
        Este aplicativo ajuda os alunos a não esquecerem os livros didáticos necessários para as aulas do dia,
        enviando lembretes 30 minutos antes do horário de ir para a escola.
      </Text>
      
      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>Funcionalidades:</Text>
        
        <TouchableOpacity 
          style={styles.featureItem} 
          onPress={() => navigation.navigate('Alunos')}
        >
          <Ionicons name="people" size={24} color="#2E7D32" />
          <Text style={styles.featureText}>Cadastro de Alunos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.featureItem}
          onPress={() => navigation.navigate('Professores')}
        >
          <Ionicons name="school" size={24} color="#2E7D32" />
          <Text style={styles.featureText}>Cadastro de Professores</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.featureItem}
          onPress={() => navigation.navigate('Livros')}
        >
          <Ionicons name="book" size={24} color="#2E7D32" />
          <Text style={styles.featureText}>Cadastro de Livros</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.featureItem}
          onPress={() => navigation.navigate('Horários')}
        >
          <Ionicons name="time" size={24} color="#2E7D32" />
          <Text style={styles.featureText}>Configuração de Horários</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.featureItem}
          onPress={() => navigation.navigate('Lembretes')}
        >
          <Ionicons name="notifications" size={24} color="#2E7D32" />
          <Text style={styles.featureText}>Gerenciamento de Lembretes</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Desenvolvido por:</Text>
        <Text style={styles.developer}>Genezio de Lavor Oliveira</Text>
        <Text style={styles.organization}>Clube de Robótica Criativa</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
  },
  schoolName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    lineHeight: 24,
  },
  featuresContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2E7D32',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  featureText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
  footer: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
    padding: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  developer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 5,
  },
  organization: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    marginTop: 5,
  },
});

export default HomeScreen; 