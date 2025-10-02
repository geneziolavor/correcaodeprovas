import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

// Importar as telas
import HomeScreen from './src/screens/HomeScreen';
import StudentScreen from './src/screens/StudentScreen';
import TeacherScreen from './src/screens/TeacherScreen';
import BookScreen from './src/screens/BookScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import ReminderScreen from './src/screens/ReminderScreen';

// Configurar as notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    // Solicitar permissões para notificações
    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Você precisa conceder permissão para receber notificações!');
      }
    }
    
    requestPermissions();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#2E7D32" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Início') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Alunos') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Professores') {
              iconName = focused ? 'school' : 'school-outline';
            } else if (route.name === 'Livros') {
              iconName = focused ? 'book' : 'book-outline';
            } else if (route.name === 'Horários') {
              iconName = focused ? 'time' : 'time-outline';
            } else if (route.name === 'Lembretes') {
              iconName = focused ? 'notifications' : 'notifications-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2E7D32',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#2E7D32',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
          }
        })}
      >
        <Tab.Screen name="Início" component={HomeScreen} />
        <Tab.Screen name="Alunos" component={StudentScreen} />
        <Tab.Screen name="Professores" component={TeacherScreen} />
        <Tab.Screen name="Livros" component={BookScreen} />
        <Tab.Screen name="Horários" component={ScheduleScreen} />
        <Tab.Screen name="Lembretes" component={ReminderScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
} 