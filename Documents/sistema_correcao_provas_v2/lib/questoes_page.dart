import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class QuestoesPage extends StatefulWidget {
  final Map<String, dynamic> prova;

  const QuestoesPage({Key? key, required this.prova}) : super(key: key);

  @override
  _QuestoesPageState createState() => _QuestoesPageState();
}

class _QuestoesPageState extends State<QuestoesPage> {
  final supabase = Supabase.instance.client;
  List<Map<String, dynamic>> questoes = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _carregarQuestoes();
  }

  Future<void> _carregarQuestoes() async {
    setState(() => isLoading = true);
    try {
      final result = await supabase
          .from('perguntas')
          .select()
          .eq('prova_id', widget.prova['id']);
      setState(() {
        questoes = (result as List).map((e) => e as Map<String, dynamic>).toList();
        isLoading = false;
      });
    } catch (e) {
      setState(() => isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao carregar questões: $e')),
      );
    }
  }

  Future<void> _adicionarQuestao() async {
    final enunciadoController = TextEditingController();
    final aController = TextEditingController();
    final bController = TextEditingController();
    final cController = TextEditingController();
    final dController = TextEditingController();
    final respostaController = TextEditingController();

    await showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Adicionar Questão'),
        content: SingleChildScrollView(
          child: Column(
            children: [
              TextField(controller: enunciadoController, decoration: const InputDecoration(labelText: 'Enunciado')),
              TextField(controller: aController, decoration: const InputDecoration(labelText: 'Alternativa A')),
              TextField(controller: bController, decoration: const InputDecoration(labelText: 'Alternativa B')),
              TextField(controller: cController, decoration: const InputDecoration(labelText: 'Alternativa C')),
              TextField(controller: dController, decoration: const InputDecoration(labelText: 'Alternativa D')),
              TextField(controller: respostaController, decoration: const InputDecoration(labelText: 'Resposta Correta')),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancelar')),
          TextButton(
            onPressed: () async {
              if (enunciadoController.text.isNotEmpty && respostaController.text.isNotEmpty) {
                await supabase.from('perguntas').insert({
                  'prova_id': widget.prova['id'],
                  'enunciado': enunciadoController.text,
                  'alternativa_a': aController.text,
                  'alternativa_b': bController.text,
                  'alternativa_c': cController.text,
                  'alternativa_d': dController.text,
                  'resposta_correta': respostaController.text,
                });
                Navigator.pop(context);
                _carregarQuestoes();
              }
            },
            child: const Text('Salvar'),
          ),
        ],
      ),
    );
  }

  Future<void> _editarQuestao(Map<String, dynamic> questao) async {
    final enunciadoController = TextEditingController(text: questao['enunciado']);
    final aController = TextEditingController(text: questao['alternativa_a']);
    final bController = TextEditingController(text: questao['alternativa_b']);
    final cController = TextEditingController(text: questao['alternativa_c']);
    final dController = TextEditingController(text: questao['alternativa_d']);
    final respostaController = TextEditingController(text: questao['resposta_correta']);

    await showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Editar Questão'),
        content: SingleChildScrollView(
          child: Column(
            children: [
              TextField(controller: enunciadoController, decoration: const InputDecoration(labelText: 'Enunciado')),
              TextField(controller: aController, decoration: const InputDecoration(labelText: 'Alternativa A')),
              TextField(controller: bController, decoration: const InputDecoration(labelText: 'Alternativa B')),
              TextField(controller: cController, decoration: const InputDecoration(labelText: 'Alternativa C')),
              TextField(controller: dController, decoration: const InputDecoration(labelText: 'Alternativa D')),
              TextField(controller: respostaController, decoration: const InputDecoration(labelText: 'Resposta Correta')),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancelar')),
          TextButton(
            onPressed: () async {
              await supabase.from('perguntas').update({
                'enunciado': enunciadoController.text,
                'alternativa_a': aController.text,
                'alternativa_b': bController.text,
                'alternativa_c': cController.text,
                'alternativa_d': dController.text,
                'resposta_correta': respostaController.text,
              }).eq('id', questao['id']);
              Navigator.pop(context);
              _carregarQuestoes();
            },
            child: const Text('Salvar'),
          ),
        ],
      ),
    );
  }

  Future<void> _excluirQuestao(int id) async {
    await supabase.from('perguntas').delete().eq('id', id);
    _carregarQuestoes();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Questões - ${widget.prova['titulo']}'),
        actions: [
          IconButton(icon: const Icon(Icons.add), onPressed: _adicionarQuestao),
        ],
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : questoes.isEmpty
              ? const Center(child: Text('Nenhuma questão cadastrada.'))
              : ListView.builder(
                  itemCount: questoes.length,
                  itemBuilder: (context, index) {
                    final questao = questoes[index];
                    return Card(
                      margin: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      child: ListTile(
                        title: Text(questao['enunciado'] ?? ''),
                        subtitle: Text('Resposta correta: ${questao['resposta_correta'] ?? ''}'),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(icon: const Icon(Icons.edit, color: Colors.orange), onPressed: () => _editarQuestao(questao)),
                            IconButton(icon: const Icon(Icons.delete, color: Colors.red), onPressed: () => _excluirQuestao(questao['id'])),
                          ],
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
