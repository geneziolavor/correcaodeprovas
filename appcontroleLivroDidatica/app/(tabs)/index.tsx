import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sistema de Controle Escolar</Text>
      </View>
      
      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/alunos')}
        >
          <MaterialIcons name="people" size={40} color="#4A6572" />
          <Text style={styles.menuText}>Alunos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/professores')}
        >
          <MaterialIcons name="school" size={40} color="#4A6572" />
          <Text style={styles.menuText}>Professores</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/disciplinas')}
        >
          <MaterialIcons name="menu-book" size={40} color="#4A6572" />
          <Text style={styles.menuText}>Disciplinas</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/livros')}
        >
          <MaterialIcons name="library-books" size={40} color="#4A6572" />
          <Text style={styles.menuText}>Livros</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/horarios')}
        >
          <MaterialIcons name="schedule" size={40} color="#4A6572" />
          <Text style={styles.menuText}>Horários</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/notificacoes')}
        >
          <MaterialIcons name="notifications" size={40} color="#4A6572" />
          <Text style={styles.menuText}>Notificações</Text>
        </TouchableOpacity>
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
  }
}); 