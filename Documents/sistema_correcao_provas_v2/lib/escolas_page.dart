import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class EscolasPage extends StatefulWidget {
  @override
  _EscolasPageState createState() => _EscolasPageState();
}

class _EscolasPageState extends State<EscolasPage> {
  final _supabase = Supabase.instance.client;
  List<Map<String, dynamic>> escolas = [];
  bool isLoading = true;

  final _nomeController = TextEditingController();
  final _enderecoController = TextEditingController();
  final _telefoneController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _carregarEscolas();
  }

  Future<void> _carregarEscolas() async {
    try {
      final response = await _supabase
          .from('escolas')
          .select()
          .order('nome');
      
      setState(() {
        escolas = List<Map<String, dynamic>>.from(response);
        isLoading = false;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao carregar escolas: $e')),
      );
      setState(() => isLoading = false);
    }
  }

  Future<void> _adicionarEscola() async {
    if (_nomeController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Nome da escola é obrigatório')),
      );
      return;
    }

    try {
      await _supabase.from('escolas').insert({
        'nome': _nomeController.text.trim(),
        'endereco': _enderecoController.text.trim(),
        'telefone': _telefoneController.text.trim(),
      });

      _limparCampos();
      _carregarEscolas();
      Navigator.of(context).pop();
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Escola adicionada com sucesso!')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao adicionar escola: $e')),
      );
    }
  }

  Future<void> _excluirEscola(int id, String nome) async {
    final confirmar = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Confirmar Exclusão'),
        content: Text('Deseja realmente excluir a escola "$nome"?'),
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
        await _supabase.from('escolas').delete().eq('id', id);
        _carregarEscolas();
        
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Escola excluída com sucesso!')),
        );
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erro ao excluir escola: $e')),
        );
      }
    }
  }

  void _limparCampos() {
    _nomeController.clear();
    _enderecoController.clear();
    _telefoneController.clear();
  }

  Widget _buildFormDialog() {
    return AlertDialog(
      title: Text('Adicionar Escola'),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _nomeController,
              decoration: InputDecoration(
                labelText: 'Nome da Escola *',
                border: OutlineInputBorder(),
              ),
            ),
            SizedBox(height: 16),
            TextField(
              controller: _enderecoController,
              decoration: InputDecoration(
                labelText: 'Endereço',
                border: OutlineInputBorder(),
              ),
              maxLines: 2,
            ),
            SizedBox(height: 16),
            TextField(
              controller: _telefoneController,
              decoration: InputDecoration(
                labelText: 'Telefone',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.phone,
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
          onPressed: _adicionarEscola,
          child: Text('Salvar'),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Escolas'),
        backgroundColor: Colors.blue,
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
                    onPressed: () => showDialog(
                      context: context,
                      builder: (context) => StatefulBuilder(
                        builder: (context, setStateDialog) => _buildFormDialog(),
                      ),
                    ),
                    icon: Icon(Icons.add),
                    label: Text('Adicionar Escola'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                      minimumSize: Size(double.infinity, 50),
                    ),
                  ),
                ),
                
                // Lista de Escolas
                Expanded(
                  child: escolas.isEmpty
                      ? Center(
                          child: Text(
                            'Nenhuma escola cadastrada',
                            style: TextStyle(fontSize: 16, color: Colors.grey),
                          ),
                        )
                      : ListView.builder(
                          itemCount: escolas.length,
                          itemBuilder: (context, index) {
                            final escola = escolas[index];
                            return Card(
                              margin: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                              child: ListTile(
                                leading: CircleAvatar(
                                  backgroundColor: Colors.blue,
                                  child: Icon(Icons.school, color: Colors.white),
                                ),
                                title: Text(
                                  escola['nome'] ?? 'Nome não informado',
                                  style: TextStyle(fontWeight: FontWeight.bold),
                                ),
                                subtitle: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    if (escola['endereco']?.isNotEmpty == true)
                                      Text(
                                        'Endereço: ${escola['endereco']}',
                                        style: TextStyle(fontSize: 12),
                                      ),
                                    if (escola['telefone']?.isNotEmpty == true)
                                      Text(
                                        'Telefone: ${escola['telefone']}',
                                        style: TextStyle(fontSize: 12),
                                      ),
                                  ],
                                ),
                                trailing: IconButton(
                                  icon: Icon(Icons.delete, color: Colors.red),
                                  onPressed: () => _excluirEscola(escola['id'], escola['nome']),
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
    _enderecoController.dispose();
    _telefoneController.dispose();
    super.dispose();
  }
}