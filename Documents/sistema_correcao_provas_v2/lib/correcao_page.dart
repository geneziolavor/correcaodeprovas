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
  File? _imagemCapturada;
  bool isLoading = true;
  bool isCorrigindo = false;

  // Agora o Map usa id da pergunta
  Map<int, String> respostasAluno = {};

  @override
  void initState() {
    super.initState();
    _carregarDados();
  }

  Future<void> _carregarDados() async {
    try {
      await Future.wait([
        _carregarAlunos(),
        _carregarQuestoesEGabarito(),
      ]);
      setState(() => isLoading = false);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao carregar dados: $e')),
      );
      setState(() => isLoading = false);
    }
  }

  Future<void> _carregarAlunos() async {
    final response = await supabase
        .from('alunos')
        .select('*')
        .eq('turma_id', widget.prova['turma_id'])
        .order('nome');

    setState(() {
      alunos = List<Map<String, dynamic>>.from(response);
    });
  }

  Future<void> _carregarQuestoesEGabarito() async {
    try {
      final questoesResponse = await supabase
          .from('perguntas')
          .select('*')
          .eq('prova_id', widget.prova['id'])
          .order('id'); // agora order por id

      setState(() {
        questoes = List<Map<String, dynamic>>.from(questoesResponse);
      });

      if (questoes.isNotEmpty) {
        List<Map<String, dynamic>> gabaritoTemp = [];

        for (var questao in questoes) {
          final gabResponse = await supabase
              .from('respostas_oficiais')
              .select('questao_id, resposta_correta')
              .eq('questao_id', questao['id'])
              .maybeSingle();

          if (gabResponse != null) {
            gabaritoTemp.add(Map<String, dynamic>.from(gabResponse));
          }
        }

        setState(() {
          gabarito = gabaritoTemp;
        });
      }

      respostasAluno.clear();
      for (var questao in questoes) {
        // Inicializa respostas usando id da pergunta
        respostasAluno[questao['id']] = '';
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao carregar questões: $e')),
      );
    }
  }

  Future<void> _selecionarDaGaleria() async {
    if (_alunoSelecionado == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Selecione um aluno primeiro')),
      );
      return;
    }

    try {
      final XFile? image =
          await _picker.pickImage(source: ImageSource.gallery, imageQuality: 85);

      if (image != null) {
        setState(() {
          _imagemCapturada = File(image.path);
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text('Foto selecionada! Marque as respostas'),
              backgroundColor: Colors.green),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao selecionar imagem: $e')),
      );
    }
  }

  Future<void> _capturarFoto() async {
    if (_alunoSelecionado == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Selecione um aluno primeiro')),
      );
      return;
    }

    try {
      final XFile? foto =
          await _picker.pickImage(source: ImageSource.camera, imageQuality: 85);

      if (foto != null) {
        setState(() {
          _imagemCapturada = File(foto.path);
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text('Foto capturada! Marque as respostas'),
              backgroundColor: Colors.green),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao capturar foto: $e')),
      );
    }
  }

  Future<void> _processarCorrecao() async {
    if (_alunoSelecionado == null || _imagemCapturada == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Selecione um aluno e capture a foto')),
      );
      return;
    }

    setState(() => isCorrigindo = true);

    try {
      int acertos = 0;
      int erros = 0;

      for (var questao in questoes) {
        final respostaAlunoAtual = respostasAluno[questao['id']] ?? '';

        final gabaritoQuestao = gabarito.firstWhere(
          (g) => g['questao_id'] == questao['id'],
          orElse: () => {'resposta_correta': ''}, // evita Null
        );

        final respostaCorreta = gabaritoQuestao['resposta_correta'] ?? '';

        await supabase.from('respostas_alunos').insert({
          'questao_id': questao['id'],
          'aluno_id': _alunoSelecionado,
          'resposta_marcada': respostaAlunoAtual,
        });

        if (respostaAlunoAtual.toUpperCase() == respostaCorreta.toUpperCase()) {
          acertos++;
        } else {
          erros++;
        }
      }

      final correcaoResponse = await supabase.from('correcoes').insert({
        'prova_id': widget.prova['id'],
        'aluno_id': _alunoSelecionado,
        'total_questoes': questoes.length,
        'acertos': acertos,
        'erros': erros,
      }).select();

      final porcentagemAcerto =
          questoes.isNotEmpty ? (acertos / questoes.length * 100).round() : 0;

      await supabase.from('resultados').insert({
        'correcao_id': correcaoResponse.first['id'],
        'porcentagem_acerto': porcentagemAcerto,
        'media_turma': porcentagemAcerto,
      });

      setState(() => isCorrigindo = false);

      final alunoNome = alunos.firstWhere(
        (a) => a['id'] == _alunoSelecionado,
        orElse: () => {'nome': 'Aluno'},
      )['nome'];

      await showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text('Correção Finalizada!'),
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
              child: Text('OK'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                Navigator.of(context).push(MaterialPageRoute(
                    builder: (context) => ResultadosPage(prova: widget.prova)));
              },
              child: Text('Ver Resultados'),
            ),
          ],
        ),
      );

      _limparFormulario();
    } catch (e) {
      setState(() => isCorrigindo = false);
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Erro: $e')));
    }
  }

  void _limparFormulario() {
    setState(() {
      _alunoSelecionado = null;
      _imagemCapturada = null;
      respostasAluno.clear();
      for (var questao in questoes) {
        respostasAluno[questao['id']] = '';
      }
    });
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
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Card(
                    child: Padding(
                      padding: EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Prova: ${widget.prova['titulo']}',
                              style: TextStyle(
                                  fontWeight: FontWeight.bold, fontSize: 18)),
                          Text('Total de questões: ${questoes.length}'),
                          Text('Alunos da turma: ${alunos.length}'),
                        ],
                      ),
                    ),
                  ),
                  SizedBox(height: 16),
                  Card(
                    child: Padding(
                      padding: EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('1. Selecione o Aluno',
                              style: TextStyle(
                                  fontWeight: FontWeight.bold, fontSize: 16)),
                          SizedBox(height: 8),
                          DropdownButtonFormField<int>(
                            value: _alunoSelecionado,
                            decoration: InputDecoration(
                                labelText: 'Aluno',
                                border: OutlineInputBorder()),
                            items: alunos
                                .map((aluno) => DropdownMenuItem<int>(
                                    value: aluno['id'],
                                    child: Text(aluno['nome'])))
                                .toList(),
                            onChanged: (value) {
                              setState(() {
                                _alunoSelecionado = value;
                                _imagemCapturada = null;
                              });
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                  SizedBox(height: 16),
                  Card(
                    child: Padding(
                      padding: EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('2. Capture a Prova',
                              style: TextStyle(
                                  fontWeight: FontWeight.bold, fontSize: 16)),
                          SizedBox(height: 8),
                          Row(
                            children: [
                              Expanded(
                                child: ElevatedButton.icon(
                                  onPressed: _alunoSelecionado == null
                                      ? null
                                      : _capturarFoto,
                                  icon: Icon(Icons.camera_alt),
                                  label: Text('Câmera'),
                                  style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.blue,
                                      foregroundColor: Colors.white),
                                ),
                              ),
                              SizedBox(width: 8),
                              Expanded(
                                child: ElevatedButton.icon(
                                  onPressed: _alunoSelecionado == null
                                      ? null
                                      : _selecionarDaGaleria,
                                  icon: Icon(Icons.photo_library),
                                  label: Text('Galeria'),
                                  style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.green,
                                      foregroundColor: Colors.white),
                                ),
                              ),
                            ],
                          ),
                          if (_imagemCapturada != null) ...[
                            SizedBox(height: 16),
                            Container(
                              height: 200,
                              width: double.infinity,
                              decoration: BoxDecoration(
                                  border: Border.all(color: Colors.grey),
                                  borderRadius: BorderRadius.circular(8)),
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(8),
                                child: Image.file(_imagemCapturada!,
                                    fit: BoxFit.cover),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                  if (_imagemCapturada != null) ...[
                    SizedBox(height: 16),
                    Card(
                      child: Padding(
                        padding: EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('3. Marque as Respostas',
                                style: TextStyle(
                                    fontWeight: FontWeight.bold, fontSize: 16)),
                            SizedBox(height: 16),
                            ...questoes.map((questao) {
                              final idQuestao = questao['id'];
                              return Padding(
                                padding: EdgeInsets.only(bottom: 16),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('Questão ${questao['id']}:',
                                        style: TextStyle(
                                            fontWeight: FontWeight.bold)),
                                    SizedBox(height: 8),
                                    Row(
                                      children: ['A', 'B', 'C', 'D', 'E']
                                          .map((opcao) => Expanded(
                                                child: Padding(
                                                  padding:
                                                      EdgeInsets.only(right: 4),
                                                  child: ElevatedButton(
                                                    onPressed: () {
                                                      setState(() {
                                                        respostasAluno[idQuestao] =
                                                            respostasAluno[
                                                                        idQuestao] ==
                                                                    opcao
                                                                ? ''
                                                                : opcao;
                                                      });
                                                    },
                                                    style: ElevatedButton.styleFrom(
                                                        backgroundColor:
                                                            respostasAluno[
                                                                        idQuestao] ==
                                                                    opcao
                                                                ? Colors.blue
                                                                : Colors
                                                                    .grey.shade300,
                                                        foregroundColor:
                                                            respostasAluno[
                                                                        idQuestao] ==
                                                                    opcao
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
                    ),
                    SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: isCorrigindo ? null : _processarCorrecao,
                        icon: isCorrigindo
                            ? SizedBox(
                                width: 16,
                                height: 16,
                                child: CircularProgressIndicator(
                                    strokeWidth: 2))
                            : Icon(Icons.check_circle),
                        label: Text(isCorrigindo
                            ? 'Corrigindo...'
                            : 'Finalizar Correção'),
                        style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.orange,
                            foregroundColor: Colors.white,
                            minimumSize: Size(double.infinity, 50)),
                      ),
                    ),
                  ],
                ],
              ),
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
              minimumSize: Size(double.infinity, 50)),
        ),
      ),
    );
  }
}
