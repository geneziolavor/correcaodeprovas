import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class TurmasPage extends StatefulWidget {
  @override
  _TurmasPageState createState() => _TurmasPageState();
}

class _TurmasPageState extends State<TurmasPage> {
  final _supabase = Supabase.instance.client;
  List<Map<String, dynamic>> turmas = [];
  List<Map<String, dynamic>> escolas = [];
  bool isLoading = true;

  final _nomeController = TextEditingController();
  final _serieController = TextEditingController();
  int? _escolaSelecionada;

  @override
  void initState() {
    super.initState();
    _carregarDados();
  }

  Future<void> _carregarDados() async {
    await Future.wait([
      _carregarTurmas(),
      _carregarEscolas(),
    ]);
    setState(() => isLoading = false);
  }

  Future<void> _carregarTurmas() async {
    try {
      final response = await _supabase
          .from('turmas')
          .select('''
            *,
            escolas(nome)
          ''')
          .order('nome');
      
      setState(() {
        turmas = List<Map<String, dynamic>>.from(response);
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao carregar turmas: $e')),
      );
    }
  }

  Future<void> _carregarEscolas() async {
    try {
      final response = await _supabase
          .from('escolas')
          .select('id, nome')
          .order('nome');
      
      setState(() {
        escolas = List<Map<String, dynamic>>.from(response);
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao carregar escolas: $e')),
      );
    }
  }

  Future<void> _adicionarTurma() async {
    if (_nomeController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Nome da turma é obrigatório')),
      );
      return;
    }

    if (_escolaSelecionada == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Selecione uma escola')),
      );
      return;
    }

    try {
      await _supabase.from('turmas').insert({
        'nome': _nomeController.text.trim(),
        'serie': _serieController.text.trim(),
        'escola_id': _escolaSelecionada,
      });

      _limparCampos();
      _carregarTurmas();
      Navigator.of(context).pop();
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Turma adicionada com sucesso!')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao adicionar turma: $e')),
      );
    }
  }

  Future<void> _excluirTurma(int id, String nome) async {
    final confirmar = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Confirmar Exclusão'),
        content: Text('Deseja realmente excluir a turma "$nome"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: Text('Cancelar'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: Text('Excluir', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );

    if (confirmar == true) {
      try {
        await _supabase.from('turmas').delete().eq('id', id);
        _carregarTurmas();
        
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Turma excluída com sucesso!')),
        );
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erro ao excluir turma: $e')),
        );
      }
    }
  }

  void _limparCampos() {
    _nomeController.clear();
    _serieController.clear();
    _escolaSelecionada = null;
  }

  Widget _buildFormDialog() {
    return AlertDialog(
      title: Text('Adicionar Turma'),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _nomeController,
              decoration: InputDecoration(
                labelText: 'Nome da Turma *',
                border: OutlineInputBorder(),
              ),
            ),
            SizedBox(height: 16),
            TextField(
              controller: _serieController,
              decoration: InputDecoration(
                labelText: 'Série/Ano',
                border: OutlineInputBorder(),
              ),
            ),
            SizedBox(height: 16),
            DropdownButtonFormField<int>(
              value: _escolaSelecionada,
              decoration: InputDecoration(
                labelText: 'Escola *',
                border: OutlineInputBorder(),
              ),
              items: escolas.map((escola) {
                return DropdownMenuItem<int>(
                  value: escola['id'],
                  child: Text(escola['nome']),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _escolaSelecionada = value;
                });
              },
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () {
            _limparCampos();
            Navigator.of(context).pop();
          },
          child: Text('Cancelar'),
        ),
        ElevatedButton(
          onPressed: _adicionarTurma,
          child: Text('Salvar'),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Turmas'),
        backgroundColor: Colors.purple,
        foregroundColor: Colors.white,
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // Botão Adicionar
                Padding(
                  padding: EdgeInsets.all(16),
                  child: ElevatedButton.icon(
                    onPressed: escolas.isEmpty 
                        ? null 
                        : () => showDialog(
                            context: context,
                            builder: (context) => StatefulBuilder(
                              builder: (context, setStateDialog) => _buildFormDialog(),
                            ),
                          ),
                    icon: Icon(Icons.add),
                    label: Text(escolas.isEmpty 
                        ? 'Cadastre uma escola primeiro' 
                        : 'Adicionar Turma'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                      minimumSize: Size(double.infinity, 50),
                    ),
                  ),
                ),
                
                // Lista de Turmas
                Expanded(
                  child: turmas.isEmpty
                      ? Center(
                          child: Text(
                            escolas.isEmpty 
                                ? 'Cadastre uma escola primeiro'
                                : 'Nenhuma turma cadastrada',
                            style: TextStyle(fontSize: 16, color: Colors.grey),
                          ),
                        )
                      : ListView.builder(
                          itemCount: turmas.length,
                          itemBuilder: (context, index) {
                            final turma = turmas[index];
                            final nomeEscola = turma['escolas']?['nome'] ?? 'Escola não encontrada';
                            
                            return Card(
                              margin: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                              child: ListTile(
                                leading: CircleAvatar(
                                  backgroundColor: Colors.purple,
                                  child: Icon(Icons.class_, color: Colors.white),
                                ),
                                title: Text(
                                  turma['nome'] ?? 'Nome não informado',
                                  style: TextStyle(fontWeight: FontWeight.bold),
                                ),
                                subtitle: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    if (turma['serie']?.isNotEmpty == true)
                                      Text(
                                        'Série: ${turma['serie']}',
                                        style: TextStyle(fontSize: 12),
                                      ),
                                    Text(
                                      'Escola: $nomeEscola',
                                      style: TextStyle(fontSize: 12, color: Colors.blue),
                                    ),
                                  ],
                                ),
                                trailing: IconButton(
                                  icon: Icon(Icons.delete, color: Colors.red),
                                  onPressed: () => _excluirTurma(turma['id'], turma['nome']),
                                ),
                              ),
                            );
                          },
                        ),
                ),
              ],
            ),
      
      bottomNavigationBar: Container(
        padding: EdgeInsets.all(16),
        child: ElevatedButton.icon(
          onPressed: () => Navigator.of(context).pop(),
          icon: Icon(Icons.arrow_back),
          label: Text('Voltar'),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.grey,
            foregroundColor: Colors.white,
            minimumSize: Size(double.infinity, 50),
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _nomeController.dispose();
    _serieController.dispose();
    super.dispose();
  }
}