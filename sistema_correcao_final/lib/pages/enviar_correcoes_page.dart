import 'package:flutter/material.dart';

class EnviarCorrecoesPage extends StatelessWidget {
  const EnviarCorrecoesPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Enviar Correções'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Enviar Correções',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 40),
            ElevatedButton.icon(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Correções enviadas com sucesso!')),
                );
              },
              icon: Icon(Icons.send),
              label: Text('Enviar Correções'),
            ),
          ],
        ),
      ),
    );
  }
}