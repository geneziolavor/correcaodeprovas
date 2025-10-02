import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class PerguntasPage extends StatefulWidget {
  final Map<String, dynamic> prova;

  const PerguntasPage({Key? key, required this.prova}) : super(key: key);

  @override
  _PerguntasPageState createState() => _PerguntasPageState();
}

class _PerguntasPageState extends State<PerguntasPage> {
  final SupabaseClient supabase = Supabase.instance.client;
  List<dynamic> _perguntas = [];
  final TextEditingController _textoController = TextEditingController();
  final TextEditingController _respostaCorretaController = TextEditingController();
  final List<TextEditingController> _alternativasControllers = List.generate(4, (_) => TextEditingController());

  @override
  void initState() {
    super.initState();
    _carregarPerguntas();
  }

  Future<void> _carregarPerguntas() async {
    try {
      final response = await supabase
          .from('perguntas')
          .select()
          .eq('prova_id', widget.prova['id']);

      setState(() {
        _perguntas = response;
      });
    } catch (e) {
      print('Erro ao carregar perguntas: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao carregar perguntas: $e')),
      );
    }
  }

  Future<void> _salvarPergunta() async {
    try {
      final novaPergunta = {
        'texto': _textoController.text,
        'resposta_correta': _respostaCorretaController.text,
        'alternativa_a': _alternativasControllers[0].text,
        'alternativa_b': _alternativasControllers[1].text,
        'alternativa_c': _alternativasControllers[2].text,
        'alternativa_d': _alternativasControllers[3].text,
        'prova_id': widget.prova['id'],
      };

      await supabase.from('perguntas').insert(novaPergunta);

      _textoController.clear();
      _respostaCorretaController.clear();
      for (var c in _alternativasControllers) {
        c.clear();
      }

      _carregarPerguntas();
    } catch (e) {
      print('Erro ao salvar pergunta: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao salvar pergunta: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Perguntas da Prova: ${widget.prova['titulo']}')),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: _perguntas.length,
              itemBuilder: (context, index) {
                final pergunta = _perguntas[index];
                return ListTile(
                  title: Text(pergunta['texto'] ?? ''),
                  subtitle: Text("Resposta correta: ${pergunta['resposta_correta'] ?? ''}"),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                TextField(
                  controller: _textoController,
                  decoration: const InputDecoration(labelText: 'Texto da Pergunta'),
                ),
                TextField(
                  controller: _respostaCorretaController,
                  decoration: const InputDecoration(labelText: 'Resposta Correta'),
                ),
                ...List.generate(4, (index) {
                  return TextField(
                    controller: _alternativasControllers[index],
                    decoration: InputDecoration(labelText: 'Alternativa ${String.fromCharCode(65 + index)}'),
                  );
                }),
                const SizedBox(height: 12),
                ElevatedButton(
                  onPressed: _salvarPergunta,
                  child: const Text('Salvar Pergunta'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
