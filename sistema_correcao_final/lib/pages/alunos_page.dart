import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class AlunosPage extends StatefulWidget {
  const AlunosPage({super.key});

  @override
  State<AlunosPage> createState() => _AlunosPageState();
}

class _AlunosPageState extends State<AlunosPage> {
  final _supabase = Supabase.instance.client;
  final _nomeController = TextEditingController();
  final _matriculaController = TextEditingController();
  int? _selectedTurmaId;
  List<Map<String, dynamic>> _turmas = [];
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadTurmas();
  }

  Future<void> _loadTurmas() async {
    final response = await _supabase.from('turmas').select().order('nome');
    setState(() {
      _turmas = List<Map<String, dynamic>>.from(response);
    });
  }

  Future<void> _addAluno() async {
    if (_nomeController.text.isEmpty || _selectedTurmaId == null) return;
    
    setState(() => _isLoading = true);
    try {
      await _supabase.from('alunos').insert({
        'nome': _nomeController.text,
        'matricula': _matriculaController.text,
        'turma_id': _selectedTurmaId,
      });
      _nomeController.clear();
      _matriculaController.clear();
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
          title: const Text('Novo Aluno'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: _nomeController,
                decoration: const InputDecoration(labelText: 'Nome do Aluno'),
              ),
              TextField(
                controller: _matriculaController,
                decoration: const InputDecoration(labelText: 'Matrícula'),
              ),
              const SizedBox(height: 10),
              DropdownButtonFormField<int>(
                value: _selectedTurmaId,
                decoration: const InputDecoration(labelText: 'Turma'),
                items: _turmas.map((t) => DropdownMenuItem<int>(
                  value: t['id'],
                  child: Text(t['nome']),
                )).toList(),
                onChanged: (val) => setDialogState(() => _selectedTurmaId = val),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancelar')),
            ElevatedButton(onPressed: _addAluno, child: const Text('Salvar')),
          ],
        ),
      ),
    );
  }

  Stream<List<Map<String, dynamic>>> _fetchAlunos() {
    return _supabase.from('alunos').stream(primaryKey: ['id']).order('nome');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: StreamBuilder<List<Map<String, dynamic>>>(
        stream: _fetchAlunos(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          final alunos = snapshot.data ?? [];
          return ListView.builder(
            itemCount: alunos.length,
            itemBuilder: (context, index) {
              final aluno = alunos[index];
              final turma = _turmas.firstWhere((t) => t['id'] == aluno['turma_id'], orElse: () => {'nome': 'N/A'});
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: ListTile(
                  title: Text(aluno['nome'], style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text('Turma: ${turma['nome']} | Matrícula: ${aluno['matricula'] ?? ''}'),
                  leading: const Icon(Icons.person, color: Colors.orange),
                  trailing: IconButton(
                    icon: const Icon(Icons.delete, color: Colors.red),
                    onPressed: () async {
                      await _supabase.from('alunos').delete().eq('id', aluno['id']);
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