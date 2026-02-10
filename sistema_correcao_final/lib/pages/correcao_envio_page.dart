 import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'grafico_pizza_page.dart';

class CorrecaoEnvioPage extends StatefulWidget {
  final int? provaId;
  final int? alunoId;
  const CorrecaoEnvioPage({super.key, this.provaId, this.alunoId});

  @override
  State<CorrecaoEnvioPage> createState() => _CorrecaoEnvioPageState();
}

class _CorrecaoEnvioPageState extends State<CorrecaoEnvioPage> {
  late Future<List<Map<String, dynamic>>> _questoesFuture;
  final Map<int, String> _respostas = {};

  @override
  void initState() {
    super.initState();
    _questoesFuture = _fetchQuestoes();
  }

  Future<List<Map<String, dynamic>>> _fetchQuestoes() async {
    final response = await Supabase.instance.client
        .from('questoes')
        .select()
        .eq('prova_id', widget.provaId as Object);
    return response as List<Map<String, dynamic>>;
  }

  Future<void> _enviarRespostas() async {
    try {
      final questoes = await _questoesFuture;
      if (questoes.isEmpty) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Esta prova não possui questões!')),
        );
        return;
      }

      final supabase = Supabase.instance.client;
      final questaoIds = questoes.map((q) => q['id'] as int).toList();

      if (questaoIds.isNotEmpty) {
        final idsString = '(${questaoIds.join(',')})';
        await supabase
            .from('respostas_alunos')
            .delete()
            .eq('aluno_id', widget.alunoId as Object)
            .filter('questao_id', 'in', idsString);
      }

      for (var questao in questoes) {
        final resposta = _respostas[questao['id']] ?? '';
        if (resposta.isNotEmpty) {
          await supabase.from('respostas_alunos').insert({
            'aluno_id': widget.alunoId,
            'questao_id': questao['id'],
            'resposta_aluno': resposta,
          });
        }
      }

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Respostas enviadas com sucesso!')),
      );

      await Future.delayed(const Duration(seconds: 1));
      if (!mounted) return;
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => GraficoPizzaPage(provaId: widget.provaId),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao enviar: $e')),
      );
      print('Erro detalhado: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Enviar Respostas do Aluno')),
      body: FutureBuilder<List<Map<String, dynamic>>>(
        future: _questoesFuture,
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return const Center(child: CircularProgressIndicator());
          }
          final questoes = snapshot.data!;
          if (questoes.isEmpty) {
            return const Center(child: Text('Nenhuma questão encontrada para esta prova.'));
          }
          return ListView.builder(
            itemCount: questoes.length,
            itemBuilder: (context, index) {
              final questao = questoes[index];
              return Card(
                margin: const EdgeInsets.all(8.0),
                child: Padding(
                  padding: const EdgeInsets.all(12.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Questão ${index + 1}',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        questao['enunciado'],
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 12),
                      SizedBox(
                        height: 50,
                        child: TextField(
                          maxLines: 1,
                          decoration: InputDecoration(
                            labelText: 'Resposta (ex: A, B, C, D)',
                            border: OutlineInputBorder(),
                            isDense: true,
                          ),
                          onChanged: (value) {
                            _respostas[questao['id']] = value;
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _enviarRespostas,
        icon: const Icon(Icons.send),
        label: const Text('Enviar e Ver Resultados'),
      ),
    );
  }
}