import 'package:flutter/material.dart';
import 'alunos_page.dart';
import 'escolas_page.dart';
import 'turmas_page.dart';
import 'provas_page.dart';
import 'perguntas_page.dart';

class DashboardPage extends StatelessWidget {
  const DashboardPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(90),
        child: AppBar(
          backgroundColor: Colors.blueAccent,
          centerTitle: true,
          flexibleSpace: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
              Padding(
                padding: EdgeInsets.only(top: 20),
                child: Text(
                  'Sistema de Correção de Provas – EEB Professor Pedro Teixeira Barros',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Text(
                'Desenvolvido pelo Professor Genezio de Lavor',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 12,
                  fontStyle: FontStyle.italic,
                ),
              ),
            ],
          ),
        ),
      ),
      drawer: Drawer(
        child: Container(
          color: Colors.blue[50],
          child: ListView(
            padding: EdgeInsets.zero,
            children: [
              const DrawerHeader(
                decoration: BoxDecoration(
                  color: Colors.blueAccent,
                ),
                child: Text(
                  'Menu',
                  style: TextStyle(color: Colors.white, fontSize: 24),
                ),
              ),
              ListTile(
                leading: const Icon(Icons.people),
                title: const Text('Alunos'),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => AlunosPage()),
                  );
                },
              ),
              ListTile(
                leading: const Icon(Icons.school),
                title: const Text('Escolas'),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => EscolasPage()),
                  );
                },
              ),
              ListTile(
                leading: const Icon(Icons.group),
                title: const Text('Turmas'),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => TurmasPage()),
                  );
                },
              ),
              ListTile(
                leading: const Icon(Icons.assignment),
                title: const Text('Provas'),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => ProvasPage()),
                  );
                },
              ),
            ],
          ),
        ),
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.blueAccent, Colors.lightBlue],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisSize: MainAxisSize.max,
          children: [
            const SizedBox(height: 20),
            Center(
              child: Wrap(
                alignment: WrapAlignment.center,
                spacing: 25,
                runSpacing: 25,
                children: [
                  _buildDashboardCard(
                    context,
                    title: 'Alunos',
                    icon: Icons.people,
                    color: Colors.orange,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => AlunosPage()),
                      );
                    },
                  ),
                  _buildDashboardCard(
                    context,
                    title: 'Escolas',
                    icon: Icons.school,
                    color: Colors.green,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => EscolasPage()),
                      );
                    },
                  ),
                  _buildDashboardCard(
                    context,
                    title: 'Turmas',
                    icon: Icons.group,
                    color: Colors.purple,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => TurmasPage()),
                      );
                    },
                  ),
                  _buildDashboardCard(
                    context,
                    title: 'Provas',
                    icon: Icons.assignment,
                    color: Colors.red,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => ProvasPage()),
                      );
                    },
                  ),
                ],
              ),
            ),
            const Spacer(),
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 12),
              child: Text(
                '© 2025 ITA Tecnologia Educacional – Todos os direitos reservados',
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.white,
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDashboardCard(BuildContext context,
      {required String title,
      required IconData icon,
      required Color color,
      required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        width: 140,
        height: 140,
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.3),
              offset: const Offset(0, 4),
              blurRadius: 8,
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TweenAnimationBuilder(
              tween: Tween<double>(begin: 0, end: 1),
              duration: const Duration(milliseconds: 500),
              builder: (context, double value, child) {
                return Transform.scale(
                  scale: value,
                  child: Icon(icon, size: 50, color: Colors.white),
                );
              },
            ),
            const SizedBox(height: 15),
            Text(
              title,
              style: const TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }
}
