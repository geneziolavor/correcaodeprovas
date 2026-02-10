import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class GraficoPizzaPage extends StatefulWidget {
  final int? provaId;
  
  const GraficoPizzaPage({super.key, this.provaId});

  @override
  State<GraficoPizzaPage> createState() => _GraficoPizzaPageState();
}

class _GraficoPizzaPageState extends State<GraficoPizzaPage> {
  final _supabase = Supabase.instance.client;
  bool _loading = true;
  
  int _acima70 = 0;
  int _entre50e70 = 0;
  int _abaixo50 = 0;
  int _totalAlunos = 0;

  @override
  void initState() {
    super.initState();
    if (widget.provaId != null) {
      _calculateStats();
    }
  }

  Future<void> _calculateStats() async {
    try {
      // 1. Fetch all questions and their gabaritos for this exam
      final questoesResp = await _supabase
          .from('questoes')
          .select('id, gabarito')
          .eq('prova_id', widget.provaId!);
      
      final Map<int, String> gabaritos = {
        for (var q in questoesResp) q['id'] as int: (q['gabarito'] ?? '').toString().toUpperCase()
      };
      
      final totalQuestoes = gabaritos.length;
      if (totalQuestoes == 0) {
        setState(() => _loading = false);
        return;
      }

      // 2. Fetch all student answers for this exam
      final respostasResp = await _supabase
          .from('respostas_alunos')
          .select('aluno_id, questao_id, resposta_aluno')
          .inFilter('questao_id', gabaritos.keys.toList());

      // 3. Group by student and count correct answers
      Map<int, int> studentCorrectCount = {};
      Set<int> allStudents = {};

      for (var r in respostasResp) {
        int alunoId = r['aluno_id'];
        int questaoId = r['questao_id'];
        String resp = (r['resposta_aluno'] ?? '').toString().toUpperCase();
        
        allStudents.add(alunoId);
        if (resp == gabaritos[questaoId]) {
          studentCorrectCount[alunoId] = (studentCorrectCount[alunoId] ?? 0) + 1;
        }
      }

      // 4. Calculate buckets
      int a70 = 0, e5070 = 0, b50 = 0;
      
      for (var alunoId in allStudents) {
        double score = (studentCorrectCount[alunoId] ?? 0) / totalQuestoes;
        if (score >= 0.7) a70++;
        else if (score >= 0.5) e5070++;
        else b50++;
      }

      setState(() {
        _acima70 = a70;
        _entre50e70 = e5070;
        _abaixo50 = b50;
        _totalAlunos = allStudents.length;
        _loading = false;
      });

    } catch (e) {
      debugPrint('Erro ao calcular estatísticas: $e');
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Resultados da Provas (ID: ${widget.provaId ?? ""})'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: _loading 
        ? const Center(child: CircularProgressIndicator())
        : _totalAlunos == 0
          ? const Center(child: Text('Nenhum dado de correção encontrado.'))
          : SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  children: [
                    const Text(
                      'Desempenho Geral',
                      style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                    ),
                    Text('Total de $_totalAlunos alunos avaliados', style: const TextStyle(color: Colors.grey)),
                    const SizedBox(height: 40),
                    SizedBox(
                      height: 250,
                      child: PieChart(
                        PieChartData(
                          sectionsSpace: 2,
                          centerSpaceRadius: 40,
                          sections: [
                            if (_acima70 > 0) PieChartSectionData(
                              color: Colors.green,
                              value: _acima70.toDouble(),
                              title: '${((_acima70/_totalAlunos)*100).toStringAsFixed(0)}%',
                              radius: 80,
                              titleStyle: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white),
                            ),
                            if (_entre50e70 > 0) PieChartSectionData(
                              color: Colors.orange,
                              value: _entre50e70.toDouble(),
                              title: '${((_entre50e70/_totalAlunos)*100).toStringAsFixed(0)}%',
                              radius: 80,
                              titleStyle: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white),
                            ),
                            if (_abaixo50 > 0) PieChartSectionData(
                              color: Colors.red,
                              value: _abaixo50.toDouble(),
                              title: '${((_abaixo50/_totalAlunos)*100).toStringAsFixed(0)}%',
                              radius: 80,
                              titleStyle: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 40),
                    Column(
                      children: [
                        _LegendItem(color: Colors.green, label: 'Acima de 70% acertos', count: _acima70),
                        const SizedBox(height: 12),
                        _LegendItem(color: Colors.orange, label: 'Entre 50% e 70%', count: _entre50e70),
                        const SizedBox(height: 12),
                        _LegendItem(color: Colors.red, label: 'Abaixo de 50%', count: _abaixo50),
                      ],
                    ),
                    const SizedBox(height: 40),
                    ElevatedButton(
                      onPressed: () => Navigator.pop(context), 
                      child: const Text('Voltar para Painel')
                    )
                  ],
                ),
              ),
            ),
    );
  }
}

class _LegendItem extends StatelessWidget {
  final Color color;
  final String label;
  final int count;
  
  const _LegendItem({required this.color, required this.label, required this.count});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: color.withOpacity(0.3))
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(width: 12, height: 12, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
              const SizedBox(width: 12),
              Text(label, style: const TextStyle(fontWeight: FontWeight.w500)),
            ],
          ),
          Text('$count Alunos', style: const TextStyle(fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}