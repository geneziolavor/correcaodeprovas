import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class QuestoesPage extends StatefulWidget {
  final int? provaId;
  final String? provaTitulo;
  
  const QuestoesPage({super.key, this.provaId, this.provaTitulo});

  @override
  State<QuestoesPage> createState() => _QuestoesPageState();
}

class _QuestoesPageState extends State<QuestoesPage> {
  final _supabase = Supabase.instance.client;
  final _numeroController = TextEditingController();
  final _enunciadoController = TextEditingController();
  String _selectedGabarito = 'A';
  bool _isLoading = false;

  Future<void> _addQuestao() async {
    if (widget.provaId == null) return;
    
    setState(() => _isLoading = true);
    try {
      await _supabase.from('questoes').insert({
        'prova_id': widget.provaId,
        'numero': int.tryParse(_numeroController.text) ?? 0,
        'enunciado': _enunciadoController.text,
        'gabarito': _selectedGabarito,
      });
      _numeroController.clear();
      _enunciadoController.clear();
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
          title: const Text('Nova Questão'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: _numeroController,
                  decoration: const InputDecoration(labelText: 'Número da Questão'),
                  keyboardType: TextInputType.number,
                ),
                TextField(
                  controller: _enunciadoController,
                  decoration: const InputDecoration(labelText: 'Enunciado (Opcional)'),
                ),
                const SizedBox(height: 10),
                const Text('Gabarito Correto:'),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: ['A', 'B', 'C', 'D', 'E'].map((letter) {
                    return ChoiceChip(
                      label: Text(letter),
                      selected: _selectedGabarito == letter,
                      onSelected: (selected) {
                        setDialogState(() => _selectedGabarito = letter);
                      },
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancelar')),
            ElevatedButton(onPressed: _addQuestao, child: const Text('Salvar')),
          ],
        ),
      ),
    );
  }

  Stream<List<Map<String, dynamic>>> _fetchQuestoes() {
    return _supabase
        .from('questoes')
        .stream(primaryKey: ['id'])
        .eq('prova_id', widget.provaId as Object)
        .order('numero', ascending: true);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.provaTitulo ?? 'Questões'),
      ),
      body: StreamBuilder<List<Map<String, dynamic>>>(
        stream: _fetchQuestoes(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          final questoes = snapshot.data ?? [];
          if (questoes.isEmpty) {
            return const Center(child: Text('Nenhuma questão cadastrada para esta prova.'));
          }
          return ListView.builder(
            itemCount: questoes.length,
            itemBuilder: (context, index) {
              final q = questoes[index];
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: ListTile(
                  leading: CircleAvatar(child: Text(q['numero'].toString())),
                  title: Text(q['enunciado'] ?? 'Sem enunciado'),
                  subtitle: Text('Gabarito: ${q['gabarito']}', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.blue)),
                  trailing: IconButton(
                    icon: const Icon(Icons.delete, color: Colors.red),
                    onPressed: () async {
                      await _supabase.from('questoes').delete().eq('id', q['id']);
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