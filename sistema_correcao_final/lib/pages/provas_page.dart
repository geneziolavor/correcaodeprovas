import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'questoes_page.dart';

class ProvasPage extends StatefulWidget {
  const ProvasPage({super.key});

  @override
  State<ProvasPage> createState() => _ProvasPageState();
}

class _ProvasPageState extends State<ProvasPage> {
  final _supabase = Supabase.instance.client;
  final _tituloController = TextEditingController();
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

  Future<void> _addProva() async {
    if (_tituloController.text.isEmpty || _selectedTurmaId == null) return;
    
    setState(() => _isLoading = true);
    try {
      await _supabase.from('provas').insert({
        'titulo': _tituloController.text,
        'turma_id': _selectedTurmaId,
      });
      _tituloController.clear();
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
          title: const Text('Nova Prova'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: _tituloController,
                decoration: const InputDecoration(labelText: 'Título da Prova'),
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
            ElevatedButton(onPressed: _addProva, child: const Text('Salvar')),
          ],
        ),
      ),
    );
  }

  Stream<List<Map<String, dynamic>>> _fetchProvas() {
    return _supabase.from('provas').stream(primaryKey: ['id']).order('created_at', ascending: false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: StreamBuilder<List<Map<String, dynamic>>>(
        stream: _fetchProvas(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          final provas = snapshot.data ?? [];
          return ListView.builder(
            itemCount: provas.length,
            itemBuilder: (context, index) {
              final prova = provas[index];
              final turma = _turmas.firstWhere((t) => t['id'] == prova['turma_id'], orElse: () => {'nome': 'N/A'});
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                child: ListTile(
                  title: Text(prova['titulo'], style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text('Turma: ${turma['nome']}'),
                  leading: const Icon(Icons.assignment, color: Colors.blueAccent),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.list_alt, color: Colors.green),
                        tooltip: 'Gerenciar Questões',
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => QuestoesPage(provaId: prova['id'], provaTitulo: prova['titulo']),
                            ),
                          );
                        },
                      ),
                      IconButton(
                        icon: const Icon(Icons.delete, color: Colors.red),
                        onPressed: () async {
                          await _supabase.from('provas').delete().eq('id', prova['id']);
                        },
                      ),
                    ],
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