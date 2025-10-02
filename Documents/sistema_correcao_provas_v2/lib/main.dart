import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'dashboard_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // SUBSTITUA ESTAS INFORMAÇÕES PELAS SUAS DO SUPABASE (COM ASPAS):
  await Supabase.initialize(
    url: 'https://vriifcjhnovvjberwojm.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyaWlmY2pobm92dmpiZXJ3b2ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODA2NDksImV4cCI6MjA3NDY1NjY0OX0.Ew6WIwWYA3ecOQnsgOV36d5CQ4Y2Qs_iLk25mBteC1g',
  );
  
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sistema de Correção de Provas',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: DashboardPage(),
    );
  }
}