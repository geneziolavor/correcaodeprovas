import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class TurmasPage extends StatefulWidget {
  const TurmasPage({super.key});

  @override
  State<TurmasPage> createState() => _TurmasPageState();
}

class _TurmasPageState extends State<TurmasPage> {
  final _supabase = Supabase.instance.client;
  final _nomeController = TextEditingController();
  int? _selectedEscolaId;
  List<Map<String, dynamic>> _escolas = [];
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadEscolas();
  }

  Future<void> _loadEscolas() async {
    final response = await _supabase.from('escolas').select().order('nome');
    setState(() {
      _escolas = List<Map<String, dynamic>>.from(response);
    });
  }

  Future<void> _addTurma() async {
    if (_nomeController.text.isEmpty || _selectedEscolaId == null) return;
    
    setState(() => _isLoading = true);
    try {
      await _supabase.from('turmas').insert({
        'nome': _nomeController.text,
        'escola_id': _selectedEscolaId,
      });
      _nomeController.clear();
      if (mounted) Navigator.pop(context);
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
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Nova Turma'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: _nomeController,
                decoration: const InputDecoration(labelText: 'Nome da Turma'),
              ),
              const SizedBox(height: 10),
              DropdownButtonFormField<int>(
                value: _selectedEscolaId,
                decoration: const InputDecoration(labelText: 'Escola'),
                items: _escolas.map((e) => DropdownMenuItem<int>(
                  value: e['id'],
                  child: Text(e['nome']),
                )).toList(),
                onChanged: (val) => setDialogState(() => _selectedEscolaId = val),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancelar')),
            ElevatedButton(onPressed: _addTurma, child: const Text('Salvar')),
          ],
        ),
      ),
    );
  }

  Stream<List<Map<String, dynamic>>> _fetchTurmas() {
    // Note: Stream in supabase_flutter doesn't easily join tables. 
    // For a simple app, we'll use a FutureBuilder or a periodic refresh, or just show IDs for now.
    // Better: use select().stream() and handle it.
    return _supabase.from('turmas').stream(primaryKey: ['id']).order('nome');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: StreamBuilder<List<Map<String, dynamic>>>(
        stream: _fetchTurmas(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          final turmas = snapshot.data ?? [];
          return ListView.builder(
            itemCount: turmas.length,
            itemBuilder: (context, index) {
              final turma = turmas[index];
              final escola = _escolas.firstWhere((e) => e['id'] == turma['escola_id'], orElse: () => {'nome': 'N/A'});
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: ListTile(
                  title: Text(turma['nome'], style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text('Escola: ${escola['nome']}'),
                  leading: const Icon(Icons.group, color: Colors.green),
                  trailing: IconButton(
                    icon: const Icon(Icons.delete, color: Colors.red),
                    onPressed: () async {
                      await _supabase.from('turmas').delete().eq('id', turma['id']);
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