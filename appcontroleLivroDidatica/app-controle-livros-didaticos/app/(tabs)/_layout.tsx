import { Tabs } from 'expo-router';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

// Cores para o tema do aplicativo
const Colors = {
  primary: '#344955',
  accent: '#F9AA33',
  tabIconDefault: '#ccc',
  tabIconSelected: '#F9AA33',
  background: '#fff'
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.tabIconDefault,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: '#e0e0e0',
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={28} color={color} />,
          tabBarLabelStyle: { fontSize: 12 }
        }}
      />
      <Tabs.Screen
        name="alunos"
        options={{
          title: 'Alunos',
          tabBarIcon: ({ color }) => <MaterialIcons name="people" size={28} color={color} />,
          tabBarLabelStyle: { fontSize: 12 }
        }}
      />
      <Tabs.Screen
        name="professores"
        options={{
          title: 'Professores',
          tabBarIcon: ({ color }) => <MaterialIcons name="school" size={28} color={color} />,
          tabBarLabelStyle: { fontSize: 12 }
        }}
      />
      <Tabs.Screen
        name="disciplinas"
        options={{
          title: 'Disciplinas',
          tabBarIcon: ({ color }) => <MaterialIcons name="subject" size={28} color={color} />,
          tabBarLabelStyle: { fontSize: 12 }
        }}
      />
      <Tabs.Screen
        name="livros"
        options={{
          title: 'Livros',
          tabBarIcon: ({ color }) => <MaterialIcons name="book" size={28} color={color} />,
          tabBarLabelStyle: { fontSize: 12 }
        }}
      />
      <Tabs.Screen
        name="horarios"
        options={{
          title: 'Horários',
          tabBarIcon: ({ color }) => <MaterialIcons name="schedule" size={28} color={color} />,
          tabBarLabelStyle: { fontSize: 12 }
        }}
      />
      <Tabs.Screen
        name="notificacoes"
        options={{
          title: 'Notificações',
          tabBarIcon: ({ color }) => <MaterialIcons name="notifications" size={28} color={color} />,
          tabBarLabelStyle: { fontSize: 12 }
        }}
      />
    </Tabs>
  );
}
