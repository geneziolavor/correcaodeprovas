import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class AlunosPage extends StatefulWidget {
  @override
  _AlunosPageState createState() => _AlunosPageState();
}

class _AlunosPageState extends State<AlunosPage> {
  final _supabase = Supabase.instance.client;
  List<Map<String, dynamic>> alunos = [];
  List<Map<String, dynamic>> turmas = [];
  bool isLoading = true;

  final _nomeController = TextEditingController();
  final _idadeController = TextEditingController();
  int? _turmaSelecionada;

  @override
  void initState() {
    super.initState();
    _carregarDados();
  }

  Future<void> _carregarDados() async {
    await Future.wait([
      _carregarAlunos(),
      _carregarTurmas(),
    ]);
    setState(() => isLoading = false);
  }

  Future<void> _carregarAlunos() async {
    try {
      final response = await _supabase
          .from('alunos')
          .select('''
            *,
            turmas(nome)
          ''')
          .order('nome');
      
      setState(() {
        alunos = List<Map<String, dynamic>>.from(response);
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao carregar alunos: $e')),
      );
    }
  }

  Future<void> _carregarTurmas() async {
    try {
      final response = await _supabase
          .from('turmas')
          .select('id, nome')
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

  Future<void> _adicionarAluno() async {
    if (_nomeController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Nome do aluno é obrigatório')),
      );
      return;
    }

    if (_turmaSelecionada == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Selecione uma turma')),
      );
      return;
    }

    try {
      await _supabase.from('alunos').insert({
        'nome': _nomeController.text.trim(),
        'idade': int.tryParse(_idadeController.text) ?? null,
        'turma_id': _turmaSelecionada,
      });

      _limparCampos();
      _carregarAlunos();
      Navigator.of(context).pop();
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Aluno adicionado com sucesso!')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao adicionar aluno: $e')),
      );
    }
  }

  Future<void> _excluirAluno(int id, String nome) async {
    final confirmar = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Confirmar Exclusão'),
        content: Text('Deseja realmente excluir o aluno "$nome"?'),
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
        await _supabase.from('alunos').delete().eq('id', id);
        _carregarAlunos();
        
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Aluno excluído com sucesso!')),
        );
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erro ao excluir aluno: $e')),
        );
      }
    }
  }

  void _limparCampos() {
    _nomeController.clear();
    _idadeController.clear();
    _turmaSelecionada = null;
  }

  Widget _buildFormDialog() {
    return AlertDialog(
      title: Text('Adicionar Aluno'),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _nomeController,
              decoration: InputDecoration(
                labelText: 'Nome do Aluno *',
                border: OutlineInputBorder(),
              ),
            ),
            SizedBox(height: 16),
            TextField(
              controller: _idadeController,
              decoration: InputDecoration(
                labelText: 'Idade',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
            ),
            SizedBox(height: 16),
            DropdownButtonFormField<int>(
              value: _turmaSelecionada,
              decoration: InputDecoration(
                labelText: 'Turma *',
                border: OutlineInputBorder(),
              ),
              items: turmas.map((turma) {
                return DropdownMenuItem<int>(
                  value: turma['id'],
                  child: Text(turma['nome']),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _turmaSelecionada = value;
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
          onPressed: _adicionarAluno,
          child: Text('Salvar'),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Alunos'),
        backgroundColor: Colors.green,
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
                    onPressed: turmas.isEmpty 
                        ? null 
                        : () => showDialog(
                            context: context,
                            builder: (context) => StatefulBuilder(
                              builder: (context, setStateDialog) => _buildFormDialog(),
                            ),
                          ),
                    icon: Icon(Icons.add),
                    label: Text(turmas.isEmpty 
                        ? 'Cadastre uma turma primeiro' 
                        : 'Adicionar Aluno'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                      minimumSize: Size(double.infinity, 50),
                    ),
                  ),
                ),
                
                // Lista de Alunos
                Expanded(
                  child: alunos.isEmpty
                      ? Center(
                          child: Text(
                            turmas.isEmpty 
                                ? 'Cadastre uma turma primeiro'
                                : 'Nenhum aluno cadastrado',
                            style: TextStyle(fontSize: 16, color: Colors.grey),
                          ),
                        )
                      : ListView.builder(
                          itemCount: alunos.length,
                          itemBuilder: (context, index) {
                            final aluno = alunos[index];
                            final nomeTurma = aluno['turmas']?['nome'] ?? 'Turma não encontrada';
                            
                            return Card(
                              margin: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                              child: ListTile(
                                leading: CircleAvatar(
                                  backgroundColor: Colors.green,
                                  child: Icon(Icons.person, color: Colors.white),
                                ),
                                title: Text(
                                  aluno['nome'] ?? 'Nome não informado',
                                  style: TextStyle(fontWeight: FontWeight.bold),
                                ),
                                subtitle: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    if (aluno['idade'] != null)
                                      Text('Idade: ${aluno['idade']} anos'),
                                    Text('Turma: $nomeTurma'),
                                  ],
                                ),
                                trailing: IconButton(
                                  icon: Icon(Icons.delete, color: Colors.red),
                                  onPressed: () => _excluirAluno(aluno['id'], aluno['nome']),
                                ),
                              ),
                            );
                          },
                        ),
                ),
              ],
            ),
      
      // Botão Voltar fixo na parte inferior
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
    _idadeController.dispose();
    super.dispose();
  }
}