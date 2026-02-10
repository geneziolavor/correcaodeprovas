import 'dart:io';
import 'package:flutter/foundation.dart'; // For KIsWeb
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:google_mlkit_text_recognition/google_mlkit_text_recognition.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'grafico_pizza_page.dart';

class OcrCorrecaoPage extends StatefulWidget {
  final int? provaId;
  final int? alunoId;
  
  const OcrCorrecaoPage({super.key, this.provaId, this.alunoId});

  @override
  State<OcrCorrecaoPage> createState() => _OcrCorrecaoPageState();
}

class _OcrCorrecaoPageState extends State<OcrCorrecaoPage> {
  final _supabase = Supabase.instance.client;
  File? _image;
  String _statusMessage = '';
  Color _statusColor = Colors.blue;
  bool _processando = false;
  
  // Selection Data
  List<Map<String, dynamic>> _turmas = [];
  List<Map<String, dynamic>> _provas = [];
  List<Map<String, dynamic>> _alunos = [];
  
  // Selection State
  int? _selectedTurmaId;
  int? _selectedProvaId;
  int? _selectedAlunoId;

  // OCR Results State
  List<TextEditingController> _controllers = [];
  List<int> _questoesIds = []; // IDs from DB
  bool _mostrarEditor = false;

  @override
  void initState() {
    super.initState();
    _fetchTurmas();
    _selectedProvaId = widget.provaId;
    _selectedAlunoId = widget.alunoId;
    
    // If IDs provided, try to load context
    if (_selectedProvaId != null) {
      _fetchQuestoes(_selectedProvaId!);
      // Could also try to reverse lookup turma...
    }
  }

  Future<void> _fetchTurmas() async {
    try {
      final response = await _supabase.from('turmas').select('id, nome').order('nome');
      setState(() {
        _turmas = List<Map<String, dynamic>>.from(response);
      });
    } catch (e) {
      _showError('Erro ao carregar turmas: $e');
    }
  }

  Future<void> _fetchProvas(int turmaId) async {
    try {
      final response = await _supabase
          .from('provas')
          .select('id, titulo')
          .eq('turma_id', turmaId)
          .order('created_at', ascending: false);
      setState(() {
        _provas = List<Map<String, dynamic>>.from(response);
        _selectedProvaId = null;
        _questoesIds = [];
        _controllers = [];
        _mostrarEditor = false;
      });
    } catch (e) {
      _showError('Erro ao carregar provas: $e');
    }
  }

  Future<void> _fetchAlunos(int turmaId) async {
    try {
      final response = await _supabase
          .from('alunos')
          .select('id, nome')
          .eq('turma_id', turmaId)
          .order('nome');
      setState(() {
        _alunos = List<Map<String, dynamic>>.from(response);
        _selectedAlunoId = null;
      });
    } catch (e) {
      _showError('Erro ao carregar alunos: $e');
    }
  }

  List<String> _gabaritos = []; // Gabaritos from DB

  Future<void> _fetchQuestoes(int provaId) async {
    try {
      final response = await _supabase
          .from('questoes')
          .select('id, numero, gabarito')
          .eq('prova_id', provaId)
          .order('numero', ascending: true);
      
      final questoes = List<Map<String, dynamic>>.from(response);
      setState(() {
        _questoesIds = questoes.map((q) => q['id'] as int).toList();
        _gabaritos = questoes.map((q) => (q['gabarito'] ?? '').toString().toUpperCase()).toList();
        
        // Rebuild controllers list to match question count
        _controllers = List.generate(
          _questoesIds.length, 
          (index) => TextEditingController()
        );
      });
    } catch (e) {
      _showError('Erro ao carregar gabarito: $e');
    }
  }

  void _showError(String msg) {
    if (!mounted) return;
    setState(() {
      _statusMessage = msg;
      _statusColor = Colors.red;
    });
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg), backgroundColor: Colors.red));
  }

  Future<void> _pickImage(ImageSource source) async {
    // MOCK FOR DESKTOP - Avoid crash since ImagePicker may not support Windows
    if (kIsWeb || Platform.isWindows || Platform.isLinux || Platform.isMacOS) {
       setState(() {
         // Use a dummy file path - logic ignores content anyway in mock mode
         if (!kIsWeb) _image = File('mock_image.png');
         _statusMessage = '[MOCK] Imagem simulada. Clique em Processar.';
         _statusColor = Colors.blue;
       });
       return;
    }

    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: source);
    if (image != null) {
      setState(() {
        _image = File(image.path);
        _statusMessage = 'Imagem carregada. Clique em Processar.';
        _statusColor = Colors.blue;
      });
    }
  }

  Future<void> _processarImagem() async {
    // MOCK FOR DESKTOP OCR - Avoid ML Kit UnimplementedError
    if (kIsWeb || Platform.isWindows || Platform.isLinux || Platform.isMacOS) {
       setState(() {
          _processando = true;
          _statusMessage = '[MOCK] Simulando OCR...';
       });
       await Future.delayed(const Duration(seconds: 1));
       setState(() {
          for(int i=0; i<_controllers.length; i++) {
             // Loop through A-E for demo
             _controllers[i].text = ['A','B','C','D','E'][i % 5];
          }
          _processando = false;
          _mostrarEditor = true;
          _statusMessage = '[MOCK] Resultados simulados gerados.';
          _statusColor = Colors.green;
       });
       return;
    }

    if (_image == null) return;
    if (_selectedProvaId == null) {
      _showError('Selecione uma Prova antes de analisar.');
      return;
    }
    
    // Ensure questions are loaded
    if (_questoesIds.isEmpty) {
       await _fetchQuestoes(_selectedProvaId!);
       if (_questoesIds.isEmpty) {
         _showError('Esta prova não tem questões cadastradas.');
         return;
       }
    }

    setState(() {
      _processando = true;
      _statusMessage = 'Processando OCR...';
      _statusColor = Colors.orange;
    });

    try {
      final inputImage = InputImage.fromFile(_image!);
      final textRecognizer = TextRecognizer(script: TextRecognitionScript.latin);
      final RecognizedText recognizedText = await textRecognizer.processImage(inputImage);
      
      await textRecognizer.close();

      // Heuristic: Extract all A-E characters found
      List<String> foundAnswers = [];
      String fullText = recognizedText.text.toUpperCase();
      
      // 1. Try to find pattern like "1. A", "1-B", "1 C"
      final lines = fullText.split('\n');
      Map<int, String> answersByNum = {};
      RegExp numberedPattern = RegExp(r'(\d+)[\s\.\-:]+([A-E])\b');
      
      for (var line in lines) {
         var matches = numberedPattern.allMatches(line);
         for(var m in matches) {
           int? num = int.tryParse(m.group(1)!);
           if (num != null) answersByNum[num] = m.group(2)!;
         }
      }

      // Use the already declared foundAnswers

      if (answersByNum.isNotEmpty) {
         var sortedKeys = answersByNum.keys.toList()..sort();
         for(var k in sortedKeys) foundAnswers.add(answersByNum[k]!);
      } else {
        // Fallback: isolated A-E letters
        for (var line in lines) {
           RegExp isolatedExp = RegExp(r'\b([A-E])\b');
           var matches = isolatedExp.allMatches(line);
           for(var m in matches) foundAnswers.add(m.group(1)!);
        }
      }

      // Final fallback
      if (foundAnswers.length < _questoesIds.length / 2) {
          foundAnswers.clear();
          RegExp lenient = RegExp(r'\b[A-E]\b');
          var matches = lenient.allMatches(fullText);
          for(var m in matches) foundAnswers.add(m.group(0)!);
      }

      setState(() {
        // Fill controllers
        for (int i = 0; i < _controllers.length; i++) {
          if (i < foundAnswers.length) {
            _controllers[i].text = foundAnswers[i];
          } else {
             _controllers[i].text = ''; 
          }
        }
        _processando = false;
        _statusMessage = 'OCR Concluído. Por favor, revise as respostas abaixo antes de salvar.';
        _statusColor = Colors.green;
        _mostrarEditor = true;
      });

    } catch (e) {
      setState(() {
        _processando = false;
        _statusMessage = 'Erro no OCR: $e';
        _statusColor = Colors.red;
      });
    }
  }

  Future<void> _salvarRespostas() async {
    if (_selectedAlunoId == null || _selectedProvaId == null) {
      _showError('Selecione Aluno e Prova.');
      return;
    }

    setState(() => _processando = true);

    try {
      final List<Map<String, dynamic>> upsertData = [];
      int count = 0;
      
      for (int i = 0; i < _questoesIds.length; i++) {
        String resp = _controllers[i].text.trim().toUpperCase();
        if (resp.isNotEmpty) {
           // Basic validation
           if (!['A','B','C','D','E'].contains(resp)) {
              // Should we warn? Let it slide for now, maybe nullify or fix?
              // Let's assume teacher puts valid data.
           }
           
           upsertData.add({
             'aluno_id': _selectedAlunoId,
             'questao_id': _questoesIds[i],
             'resposta_aluno': resp,
           });
           count++;
        }
      }

      if (upsertData.isNotEmpty) {
        await _supabase.from('respostas_alunos').upsert(
          upsertData, onConflict: 'aluno_id,questao_id'
        );
        
        if (mounted) {
           ScaffoldMessenger.of(context).showSnackBar(
             SnackBar(content: Text('Sucesso! $count respostas salvas.'), backgroundColor: Colors.green)
           );
           
           // Optional: clear to scan next student?
           // For now, redirect to stats
           Navigator.pushReplacement(
            context,
            MaterialPageRoute(
               builder: (_) => GraficoPizzaPage(provaId: _selectedProvaId),
            ),
           );
        }
      } else {
        _showError('Nenhuma resposta preenchida para salvar.');
      }

    } catch (e) {
      _showError('Erro ao salvar: $e');
    } finally {
      if (mounted) setState(() => _processando = false);
    }
  }

  @override
  void dispose() {
    for (var c in _controllers) c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Correção via OCR'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // --- SELECTION CARD ---
            Card(
              elevation: 4,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('1. Configuração', 
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    const SizedBox(height: 10),
                    DropdownButtonFormField<int>(
                      value: _selectedTurmaId,
                      decoration: const InputDecoration(labelText: 'Turma', border: OutlineInputBorder()),
                      items: _turmas.map((t) => DropdownMenuItem<int>(
                        value: t['id'], 
                        child: Text(t['nome'])
                      )).toList(),
                      onChanged: (val) {
                        setState(() {
                          _selectedTurmaId = val;
                          _selectedProvaId = null;
                          _selectedAlunoId = null;
                          _provas = [];
                          _alunos = [];
                        });
                        if (val != null) {
                          _fetchProvas(val);
                          _fetchAlunos(val);
                        }
                      },
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(
                          child: DropdownButtonFormField<int>(
                            value: _selectedProvaId,
                            decoration: const InputDecoration(labelText: 'Prova', border: OutlineInputBorder()),
                            items: _provas.map((p) => DropdownMenuItem<int>(
                              value: p['id'], 
                              child: Text(p['titulo'])
                            )).toList(),
                            onChanged: (val) {
                               setState(() => _selectedProvaId = val);
                               if (val != null) _fetchQuestoes(val);
                            },
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    DropdownButtonFormField<int>(
                      value: _selectedAlunoId,
                      decoration: const InputDecoration(labelText: 'Aluno', border: OutlineInputBorder()),
                      items: _alunos.map((a) => DropdownMenuItem<int>(
                        value: a['id'], 
                        child: Text(a['nome'])
                      )).toList(),
                      onChanged: (val) => setState(() => _selectedAlunoId = val),
                    ),
                  ],
                ),
              ),
            ),
            
            const SizedBox(height: 16),

            // --- IMAGE CAPTURE ---
            Card(
              elevation: 4,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                     const Text('2. Captura da Folha', 
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                     const SizedBox(height: 10),
                     GestureDetector(
                        onTap: () => _pickImage(ImageSource.camera),
                        child: Container(
                          height: 180,
                          width: double.infinity,
                          decoration: BoxDecoration(
                            color: Colors.grey[100],
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: Colors.grey[300]!),
                          ),
                          child: _image != null
                              ? ClipRRect(
                                  borderRadius: BorderRadius.circular(8),
                                  child: Image.file(_image!, fit: BoxFit.cover),
                                )
                              : Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: const [
                                    Icon(Icons.camera_alt, size: 50, color: Colors.blueGrey),
                                    SizedBox(height: 8),
                                    Text('Toque para usar a Câmera', style: TextStyle(color: Colors.blueGrey)),
                                  ],
                                ),
                        ),
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton.icon(
                              onPressed: () => _pickImage(ImageSource.gallery), 
                              icon: const Icon(Icons.photo_library),
                              label: const Text('Galeria')
                            )
                          ),
                          const SizedBox(width: 10), 
                          Expanded(
                            child: ElevatedButton.icon(
                              onPressed: (_image != null && !_processando) ? _processarImagem : null,
                              icon: _processando 
                                ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                                : const Icon(Icons.auto_fix_high),
                              label: const Text('Processar OCR'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.blue,
                                foregroundColor: Colors.white,
                              ),
                            )
                          ),
                        ],
                      ),
                  ],
                ),
              ),
            ),

            if (_statusMessage.isNotEmpty)
              Container(
                margin: const EdgeInsets.symmetric(vertical: 10),
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: _statusColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: _statusColor.withOpacity(0.5))
                ),
                child: Text(_statusMessage, 
                  textAlign: TextAlign.center, 
                  style: TextStyle(color: _statusColor, fontWeight: FontWeight.bold)
                ),
              ),

            // --- RESULTS EDITOR ---
            if (_mostrarEditor && _questoesIds.isNotEmpty) ...[
              const SizedBox(height: 10),
              Card(
                elevation: 4,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('3. Conferência e Ajustes', 
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      const Text('Verifique se as respostas foram lidas corretamente:',
                         style: TextStyle(color: Colors.grey)),
                      const SizedBox(height: 15),
                      
                      ListView.separated(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: _controllers.length,
                        separatorBuilder: (_,__) => const SizedBox(height: 8),
                        itemBuilder: (context, index) {
                           String currentResp = _controllers[index].text.toUpperCase();
                           String clearGabarito = _gabaritos[index];
                           bool isCorrect = currentResp == clearGabarito && currentResp.isNotEmpty;

                           return Row(
                             children: [
                               CircleAvatar(
                                 backgroundColor: Colors.blue[100],
                                 radius: 18,
                                 child: Text('${index + 1}', style: const TextStyle(fontWeight: FontWeight.bold)),
                               ),
                               const SizedBox(width: 15),
                               Expanded(
                                 child: TextField(
                                   controller: _controllers[index],
                                   textCapitalization: TextCapitalization.characters,
                                   maxLength: 1,
                                   textAlign: TextAlign.center,
                                   onChanged: (_) => setState(() {}), // Refresh match icon
                                   decoration: InputDecoration(
                                     border: const OutlineInputBorder(),
                                     hintText: '-',
                                     counterText: "",
                                     label: Text('Resposta Q${index + 1}'),
                                     contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 10),
                                   ),
                                   style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                                 ),
                               ),
                               const SizedBox(width: 15),
                               Column(
                                 children: [
                                   const Text('Gabarito', style: TextStyle(fontSize: 10, color: Colors.grey)),
                                   Text(clearGabarito, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.blue)),
                                 ],
                               ),
                               const SizedBox(width: 10),
                               Icon(
                                 isCorrect ? Icons.check_circle : Icons.error_outline,
                                 color: isCorrect ? Colors.green : (currentResp.isEmpty ? Colors.grey : Colors.orange),
                               ),
                             ],
                           );
                        },
                      ),
                      
                      const SizedBox(height: 20),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: _processando ? null : _salvarRespostas, 
                          icon: const Icon(Icons.save),
                          label: const Text('FINALIZAR CORREÇÃO'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 15),
                            textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 30),
            ],
          ],
        ),
      ),
    );
  }
}