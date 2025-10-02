import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'perguntas_page.dart';
import 'correcao_page.dart';
import 'resultados_page.dart';

class ProvasPage extends StatefulWidget {
  @override
  _ProvasPageState createState() => _ProvasPageState();
}

class _ProvasPageState extends State<ProvasPage> {
  final _supabase = Supabase.instance.client;
  List<Map<String, dynamic>> provas = [];
  List<Map<String, dynamic>> turmas = [];
  bool isLoading = true;

  final _tituloController = TextEditingController();
  final _descricaoController = TextEditingController();
  int? _turmaSelecionada;
  DateTime? _dataSelecionada;

  @override
  void initState() {
    super.initState();
    _carregarDados();
  }

  Future<void> _carregarDados() async {
    await Future.wait([_carregarProvas(), _carregarTurmas()]);
    setState(() => isLoading = false);
  }

  Future<void> _carregarProvas() async {
    try {
      final response = await _supabase
          .from('provas')
          .select('''
            *,
            turmas(
              nome,
              escolas(nome)
            )
          ''')
          .order('created_at', ascending: false);
      setState(() {
        provas = List<Map<String, dynamic>>.from(response);
      });
    } catch (e) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Erro ao carregar provas: $e')));
    }
  }

  Future<void> _carregarTurmas() async {
    try {
      final response = await _supabase
          .from('turmas')
          .select('id, nome, escolas(nome)')
          .order('nome');
      setState(() {
        turmas = List<Map<String, dynamic>>.from(response);
      });
    } catch (e) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Erro ao carregar turmas: $e')));
    }
  }

  Future<void> _adicionarProva() async {
    if (_tituloController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Título da prova é obrigatório')));
      return;
    }
    if (_turmaSelecionada == null) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Selecione uma turma')));
      return;
    }

    try {
      final response = await _supabase.from('provas').insert({
        'titulo': _tituloController.text.trim(),
        'descricao': _descricaoController.text.trim(),
        'turma_id': _turmaSelecionada,
        'data_aplicacao': _dataSelecionada?.toIso8601String(),
      }).select();

      _limparCampos();
      _carregarProvas();
      Navigator.of(context).pop();

      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Prova adicionada com sucesso!')));

      final prova = response.first;
      final navegarParaPerguntas = await showDialog<bool>(
        context: context,
        builder: (context) => AlertDialog(
          title: Text('Prova Criada!'),
          content: Text('Deseja adicionar perguntas para esta prova agora?'),
          actions: [
            TextButton(
                onPressed: () => Navigator.of(context).pop(false),
                child: Text('Mais tarde')),
            TextButton(
                onPressed: () => Navigator.of(context).pop(true),
                child: Text('Adicionar perguntas')),
          ],
        ),
      );

      if (navegarParaPerguntas == true) {
        Navigator.of(context).push(
          MaterialPageRoute(builder: (context) => PerguntasPage(prova: prova)),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Erro ao adicionar prova: $e')));
    }
  }

  Future<void> _excluirProva(int id, String titulo) async {
    final confirmar = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Confirmar Exclusão'),
        content: Text('Deseja realmente excluir a prova "$titulo"?'),
        actions: [
          TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: Text('Cancelar')),
          TextButton(
              onPressed: () => Navigator.of(context).pop(true),
              child: Text('Excluir', style: TextStyle(color: Colors.red))),
        ],
      ),
    );

    if (confirmar == true) {
      try {
        await _supabase.from('provas').delete().eq('id', id);
        _carregarProvas();
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text('Prova excluída com sucesso!')));
      } catch (e) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text('Erro ao excluir prova: $e')));
      }
    }
  }

  void _limparCampos() {
    _tituloController.clear();
    _descricaoController.clear();
    _turmaSelecionada = null;
    _dataSelecionada = null;
  }

  Future<void> _selecionarData() async {
    final data = await showDatePicker(
      context: context,
      initialDate: _dataSelecionada ?? DateTime.now(),
      firstDate: DateTime.now().subtract(Duration(days: 365)),
      lastDate: DateTime.now().add(Duration(days: 365)),
    );
    if (data != null) {
      setState(() {
        _dataSelecionada = data;
      });
    }
  }

  Widget _buildFormDialog() {
    return StatefulBuilder(builder: (context, setStateDialog) {
      return AlertDialog(
        title: Text('Adicionar Prova'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                  controller: _tituloController,
                  decoration: InputDecoration(
                      labelText: 'Título da Prova *',
                      border: OutlineInputBorder())),
              SizedBox(height: 16),
              TextField(
                  controller: _descricaoController,
                  decoration: InputDecoration(
                      labelText: 'Descrição', border: OutlineInputBorder()),
                  maxLines: 3),
              SizedBox(height: 16),
              DropdownButtonFormField<int>(
                value: _turmaSelecionada,
                decoration: InputDecoration(
                    labelText: 'Turma *', border: OutlineInputBorder()),
                items: turmas.map((turma) {
                  final nomeEscola = turma['escolas']?['nome'] ?? '';
                  return DropdownMenuItem<int>(
                      value: turma['id'],
                      child: Text('${turma['nome']} - $nomeEscola'));
                }).toList(),
                onChanged: (value) {
                  setStateDialog(() {
                    _turmaSelecionada = value;
                  });
                },
              ),
              SizedBox(height: 16),
              InkWell(
                onTap: () async {
                  await _selecionarData();
                  setStateDialog(() {});
                },
                child: Container(
                  width: double.infinity,
                  padding: EdgeInsets.all(16),
                  decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey),
                      borderRadius: BorderRadius.circular(4)),
                  child: Row(
                    children: [
                      Icon(Icons.calendar_today, color: Colors.grey),
                      SizedBox(width: 12),
                      Text(
                        _dataSelecionada == null
                            ? 'Data de Aplicação (opcional)'
                            : 'Data: ${_dataSelecionada!.day}/${_dataSelecionada!.month}/${_dataSelecionada!.year}',
                        style: TextStyle(
                          color:
                              _dataSelecionada == null ? Colors.grey : Colors.black,
                        ),
                      ),
                    ],
                  ),
                ),
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
              child: Text('Cancelar')),
          ElevatedButton(onPressed: _adicionarProva, child: Text('Salvar')),
        ],
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Provas'),
        backgroundColor: Colors.orange,
        foregroundColor: Colors.white,
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : Column(
              children: [
                Padding(
                  padding: EdgeInsets.all(16),
                  child: ElevatedButton.icon(
                    onPressed: turmas.isEmpty
                        ? null
                        : () => showDialog(
                            context: context,
                            builder: (context) => _buildFormDialog(),
                          ),
                    icon: Icon(Icons.add),
                    label: Text(turmas.isEmpty
                        ? 'Cadastre uma turma primeiro'
                        : 'Adicionar Prova'),
                    style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        foregroundColor: Colors.white,
                        minimumSize: Size(double.infinity, 50)),
                  ),
                ),
                Expanded(
                  child: provas.isEmpty
                      ? Center(
                          child: Text(
                            turmas.isEmpty
                                ? 'Cadastre uma turma primeiro'
                                : 'Nenhuma prova cadastrada',
                            style: TextStyle(fontSize: 16, color: Colors.grey),
                          ),
                        )
                      : ListView.builder(
                          itemCount: provas.length,
                          itemBuilder: (context, index) {
                            final prova = provas[index];
                            final nomeTurma =
                                prova['turmas']?['nome'] ?? 'Turma não encontrada';
                            final nomeEscola =
                                prova['turmas']?['escolas']?['nome'] ?? '';
                            final dataAplicacao = prova['data_aplicacao'] != null
                                ? DateTime.parse(prova['data_aplicacao'])
                                : null;

                            return Card(
                              margin: EdgeInsets.symmetric(
                                  horizontal: 16, vertical: 4),
                              child: ListTile(
                                leading: CircleAvatar(
                                  backgroundColor: Colors.orange,
                                  child: Icon(Icons.quiz, color: Colors.white),
                                ),
                                title: Text(prova['titulo'] ?? 'Título não informado',
                                    style: TextStyle(fontWeight: FontWeight.bold)),
                                subtitle: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    if (prova['descricao']?.isNotEmpty == true)
                                      Text(
                                        prova['descricao'],
                                        style: TextStyle(fontSize: 12),
                                        maxLines: 2,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    Text(
                                      'Turma: $nomeTurma - $nomeEscola',
                                      style: TextStyle(fontSize: 12, color: Colors.blue),
                                    ),
                                    if (dataAplicacao != null)
                                      Text(
                                        'Data: ${dataAplicacao.day}/${dataAplicacao.month}/${dataAplicacao.year}',
                                        style: TextStyle(
                                            fontSize: 12, color: Colors.green),
                                      ),
                                  ],
                                ),
                                trailing: PopupMenuButton<String>(
                                  onSelected: (value) async {
                                    if (value == 'editar') {
                                      // editar prova
                                    } else if (value == 'excluir') {
                                      await _excluirProva(
                                          prova['id'], prova['titulo']);
                                    } else if (value == 'perguntas') {
                                      Navigator.of(context).push(MaterialPageRoute(
                                          builder: (context) =>
                                              PerguntasPage(prova: prova)));
                                    } else if (value == 'correcao') {
                                      Navigator.of(context).push(MaterialPageRoute(
                                          builder: (context) =>
                                              CorrecaoPage(prova: prova)));
                                    } else if (value == 'resultados') {
                                      Navigator.of(context).push(MaterialPageRoute(
                                          builder: (context) =>
                                              ResultadosPage(prova: prova)));
                                    }
                                  },
                                  itemBuilder: (context) => [
                                    PopupMenuItem(value: 'perguntas', child: Text('Perguntas')),
                                    PopupMenuItem(value: 'correcao', child: Text('Correção')),
                                    PopupMenuItem(value: 'resultados', child: Text('Resultados')),
                                    PopupMenuItem(value: 'editar', child: Text('Editar')),
                                    PopupMenuItem(value: 'excluir', child: Text('Excluir')),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
                ),
              ],
            ),
    );
  }
}
