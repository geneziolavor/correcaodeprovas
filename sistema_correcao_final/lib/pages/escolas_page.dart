import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class EscolasPage extends StatefulWidget {
  const EscolasPage({super.key});

  @override
  State<EscolasPage> createState() => _EscolasPageState();
}

class _EscolasPageState extends State<EscolasPage> {
  final _supabase = Supabase.instance.client;
  final _nomeController = TextEditingController();
  bool _isLoading = false;

  Future<void> _addEscola() async {
    if (_nomeController.text.isEmpty) return;
    
    setState(() => _isLoading = true);
    try {
      await _supabase.from('escolas').insert({'nome': _nomeController.text});
      _nomeController.clear();
      if (mounted) Navigator.pop(context);
      _fetchEscolas();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erro ao adicionar: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showAddDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Nova Escola'),
        content: TextField(
          controller: _nomeController,
          decoration: const InputDecoration(labelText: 'Nome da Escola'),
          autofocus: true,
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancelar')),
          ElevatedButton(onPressed: _addEscola, child: const Text('Salvar')),
        ],
      ),
    );
  }

  Stream<List<Map<String, dynamic>>> _fetchEscolas() {
    return _supabase.from('escolas').stream(primaryKey: ['id']).order('nome');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: StreamBuilder<List<Map<String, dynamic>>>(
        stream: _fetchEscolas(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Erro: ${snapshot.error}'));
          }
          final escolas = snapshot.data ?? [];
          if (escolas.isEmpty) {
            return const Center(child: Text('Nenhuma escola cadastrada.'));
          }
          return ListView.builder(
            itemCount: escolas.length,
            itemBuilder: (context, index) {
              final escola = escolas[index];
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: ListTile(
                  title: Text(escola['nome'], style: const TextStyle(fontWeight: FontWeight.bold)),
                  leading: const Icon(Icons.school, color: Colors.blue),
                  trailing: IconButton(
                    icon: const Icon(Icons.delete, color: Colors.red),
                    onPressed: () async {
                      await _supabase.from('escolas').delete().eq('id', escola['id']);
                    },
                  ),
                ),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddDialog,
        child: const Icon(Icons.add),
      ),
    );
  }
}