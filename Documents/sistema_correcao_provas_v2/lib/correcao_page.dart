import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'resultados_page.dart';

class CorrecaoPage extends StatefulWidget {
  final Map<String, dynamic> prova;

  const CorrecaoPage({Key? key, required this.prova}) : super(key: key);

  @override
  _CorrecaoPageState createState() => _CorrecaoPageState();
}

class _CorrecaoPageState extends State<CorrecaoPage> {
  final SupabaseClient supabase = Supabase.instance.client;
  final ImagePicker _picker = ImagePicker();

  List<Map<String, dynamic>> alunos = [];
  List<Map<String, dynamic>> questoes = [];
  List<Map<String, dynamic>> gabarito = [];

  int? _alunoSelecionado;
  XFile? _imagemCapturada;
  bool isLoading = true;
  bool isCorrigindo = false;

  Map<int, String> respostasAluno = {};

  @override
  void initState() {
    super.initState();
    _carregarDados();
  }

  Future<void> _carregarDados() async {
    try {
      await Future.wait([_carregarAlunos(), _carregarQuestoesEGabarito()]);
      setState(() => isLoading = false);
    } catch (e) {
      setState(() => isLoading = false);
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Erro ao carregar dados: $e')));
    }
  }

  Future<void> _carregarAlunos() async {
    final response = await supabase
        .from('alunos')
        .select('*')
        .eq('turma_id', widget.prova['turma_id'])
        .order('nome');

    alunos = List<Map<String, dynamic>>.from(response as List<dynamic>);
  }

  Future<void> _carregarQuestoesEGabarito() async {
    final questoesResponse = await supabase
        .from('perguntas')
        .select('*')
        .eq('prova_id', widget.prova['id'])
        .order('id');

    questoes = List<Map<String, dynamic>>.from(questoesResponse as List<dynamic>);
    gabarito = [];

    for (var questao in questoes) {
      final gabResponse = await supabase
          .from('respostas_oficiais')
          .select('questao_id, resposta_correta')
          .eq('questao_id', questao['id'])
          .maybeSingle();
      if (gabResponse != null) {
        gabarito.add(Map<String, dynamic>.from(gabResponse as Map));
      }
    }

    respostasAluno = {for (var q in questoes) q['id'] as int: ''};
  }

  Future<void> _selecionarImagem(ImageSource source) async {
    if (_alunoSelecionado == null) {
      ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Selecione um aluno primeiro')));
      return;
    }

    try {
      final XFile? image =
          await _picker.pickImage(source: source, imageQuality: 85);

      if (image != null) {
        setState(() => _imagemCapturada = image);
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
            content: Text('Foto carregada! Marque as respostas'),
            backgroundColor: Colors.green));
      }
    } catch (e) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Erro: $e')));
    }
  }

  Future<void> _processarCorrecao() async {
    if (_alunoSelecionado == null || _imagemCapturada == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Selecione um aluno e capture a foto')));
      return;
    }

    setState(() => isCorrigindo = true);

    try {
      int acertos = 0;

      for (var questao in questoes) {
        final respostaAlunoAtual = respostasAluno[questao['id']] ?? '';
        final gabaritoQuestao = gabarito.firstWhere(
            (g) => g['questao_id'] == questao['id'],
            orElse: () => {'resposta_correta': ''});
        final respostaCorreta = gabaritoQuestao['resposta_correta'] ?? '';

        await supabase.from('respostas_alunos').insert({
          'questao_id': questao['id'],
          'aluno_id': _alunoSelecionado,
          'resposta_marcada': respostaAlunoAtual,
        });

        if (respostaAlunoAtual.toUpperCase() == respostaCorreta.toUpperCase()) {
          acertos++;
        }
      }

      final correcaoResponse = await supabase.from('correcoes').insert({
        'prova_id': widget.prova['id'],
        'aluno_id': _alunoSelecionado,
        'total_questoes': questoes.length,
        'acertos': acertos,
        'erros': questoes.length - acertos,
      }).select();

      final correcaoId = correcaoResponse.isNotEmpty
          ? (correcaoResponse[0]['id'] as int)
          : null;

      final porcentagemAcerto =
          questoes.isNotEmpty ? (acertos / questoes.length * 100).round() : 0;

      if (correcaoId != null) {
        await supabase.from('resultados').insert({
          'correcao_id': correcaoId,
          'porcentagem_acerto': porcentagemAcerto,
          'media_turma': porcentagemAcerto,
        });
      }

      final alunoNome = alunos
          .firstWhere((a) => a['id'] == _alunoSelecionado)['nome']
          .toString();

      await showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Correção Finalizada!'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Aluno: $alunoNome'),
              Text('Acertos: $acertos de ${questoes.length}'),
              Text('Porcentagem: $porcentagemAcerto%'),
              Text('Nota: ${(porcentagemAcerto / 10).toStringAsFixed(1)}'),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('OK'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                Navigator.of(context).push(MaterialPageRoute(
                    builder: (context) =>
                        ResultadosPage(prova: widget.prova)));
              },
              child: const Text('Ver Resultados'),
            ),
          ],
        ),
      );

      _limparFormulario();
    } catch (e) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Erro ao corrigir: $e')));
    } finally {
      setState(() => isCorrigindo = false);
    }
  }

  void _limparFormulario() {
    _alunoSelecionado = null;
    _imagemCapturada = null;
    respostasAluno = {for (var q in questoes) q['id'] as int: ''};
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Correção - ${widget.prova['titulo']}'),
        backgroundColor: Colors.teal,
        foregroundColor: Colors.white,
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildCardInfoProva(),
                  const SizedBox(height: 16),
                  _buildCardSelecionarAluno(),
                  const SizedBox(height: 16),
                  _buildCardCapturaProva(),
                  if (_imagemCapturada != null) const SizedBox(height: 16),
                  if (_imagemCapturada != null) _buildCardMarcarRespostas(),
                  if (_imagemCapturada != null) const SizedBox(height: 16),
                  if (_imagemCapturada != null) _buildBotaoFinalizarCorrecao(),
                ],
              ),
            ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(16),
        child: ElevatedButton.icon(
          onPressed: () => Navigator.of(context).pop(),
          icon: const Icon(Icons.arrow_back),
          label: const Text('Voltar'),
          style: ElevatedButton.styleFrom(
              backgroundColor: Colors.grey,
              foregroundColor: Colors.white,
              minimumSize: const Size(double.infinity, 50)),
        ),
      ),
    );
  }

  Card _buildCardInfoProva() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Prova: ${widget.prova['titulo']}',
                style:
                    const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            Text('Total de questões: ${questoes.length}'),
            Text('Alunos da turma: ${alunos.length}'),
          ],
        ),
      ),
    );
  }

  Card _buildCardSelecionarAluno() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('1. Selecione o Aluno',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 8),
            DropdownButtonFormField<int>(
              value: _alunoSelecionado,
              decoration: const InputDecoration(
                  labelText: 'Aluno', border: OutlineInputBorder()),
              items: alunos
                  .map((aluno) => DropdownMenuItem<int>(
                      value: aluno['id'] as int,
                      child: Text(aluno['nome'].toString())))
                  .toList(),
              onChanged: (value) => setState(() {
                _alunoSelecionado = value;
                _imagemCapturada = null;
              }),
            ),
          ],
        ),
      ),
    );
  }

  Card _buildCardCapturaProva() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('2. Capture a Prova',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _alunoSelecionado == null
                        ? null
                        : () => _selecionarImagem(ImageSource.camera),
                    icon: const Icon(Icons.camera_alt),
                    label: const Text('Câmera'),
                    style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue, foregroundColor: Colors.white),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _alunoSelecionado == null
                        ? null
                        : () => _selecionarImagem(ImageSource.gallery),
                    icon: const Icon(Icons.photo_library),
                    label: const Text('Galeria'),
                    style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        foregroundColor: Colors.white),
                  ),
                ),
              ],
            ),
            if (_imagemCapturada != null) ...[
              const SizedBox(height: 16),
              Container(
                height: 200,
                width: double.infinity,
                decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey),
                    borderRadius: BorderRadius.circular(8)),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: kIsWeb
                      ? Image.network(_imagemCapturada!.path, fit: BoxFit.cover)
                      : Image.file(File(_imagemCapturada!.path), fit: BoxFit.cover),
                ),
              ),
            ]
          ],
        ),
      ),
    );
  }

  Card _buildCardMarcarRespostas() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('3. Marque as Respostas',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 16),
            ...questoes.map((questao) {
              final idQuestao = questao['id'] as int;
              return Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Questão $idQuestao:',
                        style: const TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    Row(
                      children: ['A', 'B', 'C', 'D', 'E']
                          .map((opcao) => Expanded(
                                child: Padding(
                                  padding: const EdgeInsets.only(right: 4),
                                  child: ElevatedButton(
                                    onPressed: () {
                                      setState(() {
                                        respostasAluno[idQuestao] =
                                            respostasAluno[idQuestao] == opcao
                                                ? ''
                                                : opcao;
                                      });
                                    },
                                    style: ElevatedButton.styleFrom(
                                        backgroundColor:
                                            respostasAluno[idQuestao] == opcao
                                                ? Colors.blue
                                                : Colors.grey.shade300,
                                        foregroundColor:
                                            respostasAluno[idQuestao] == opcao
                                                ? Colors.white
                                                : Colors.black),
                                    child: Text(opcao),
                                  ),
                                ),
                              ))
                          .toList(),
                    ),
                  ],
                ),
              );
            }).toList(),
          ],
        ),
      ),
    );
  }

  SizedBox _buildBotaoFinalizarCorrecao() {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        onPressed: isCorrigindo ? null : _processarCorrecao,
        icon: isCorrigindo
            ? const SizedBox(
                width: 16,
                height: 16,
                child: CircularProgressIndicator(strokeWidth: 2))
            : const Icon(Icons.check_circle),
        label: Text(isCorrigindo ? 'Corrigindo...' : 'Finalizar Correção'),
        style: ElevatedButton.styleFrom(
            backgroundColor: Colors.orange,
            foregroundColor: Colors.white,
            minimumSize: const Size(double.infinity, 50)),
      ),
    );
  }
}
