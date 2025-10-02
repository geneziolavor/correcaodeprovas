import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:fl_chart/fl_chart.dart';

class ResultadosPage extends StatefulWidget {
  final Map<String, dynamic> prova;

  ResultadosPage({required this.prova});

  @override
  _ResultadosPageState createState() => _ResultadosPageState();
}

class _ResultadosPageState extends State<ResultadosPage> {
  final _supabase = Supabase.instance.client;
  
  List<Map<String, dynamic>> correcoes = [];
  Map<String, dynamic> estatisticas = {};
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _carregarResultados();
  }

  Future<void> _carregarResultados() async {
    try {
      final correcoesResponse = await _supabase
          .from('correcoes')
          .select('''
            *,
            alunos(nome),
            resultados(porcentagem_acerto)
          ''')
          .eq('prova_id', widget.prova['id'])
          .order('created_at', ascending: false);

      setState(() {
        correcoes = List<Map<String, dynamic>>.from(correcoesResponse);
      });

      _calcularEstatisticas();
      setState(() => isLoading = false);
      
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao carregar resultados: $e')),
      );
      setState(() => isLoading = false);
    }
  }

  void _calcularEstatisticas() {
    if (correcoes.isEmpty) {
      estatisticas = {
        'totalAlunos': 0,
        'mediaGeral': 0.0,
        'maiorNota': 0.0,
        'menorNota': 0.0,
        'aprovados': 0,
        'reprovados': 0,
        'totalAcertos': 0,
        'totalErros': 0,
      };
      return;
    }

    int totalAcertos = 0;
    int totalErros = 0;
    
    List<double> notas = [];
    int aprovados = 0;
    
    for (var correcao in correcoes) {
      final acertos = correcao['acertos'] ?? 0;
      final erros = correcao['erros'] ?? 0;
      final porcentagem = correcao['resultados']?.isNotEmpty == true
          ? correcao['resultados'][0]['porcentagem_acerto'] ?? 0
          : 0;
      
      totalAcertos += acertos as int;
      totalErros += erros as int;
      
      final nota = porcentagem / 10.0;
      notas.add(nota);
      
      if (nota >= 6.0) aprovados++;
    }

    final mediaGeral = notas.isNotEmpty 
        ? notas.reduce((a, b) => a + b) / notas.length 
        : 0.0;
    
    estatisticas = {
      'totalAlunos': correcoes.length,
      'mediaGeral': mediaGeral,
      'maiorNota': notas.isNotEmpty ? notas.reduce((a, b) => a > b ? a : b) : 0.0,
      'menorNota': notas.isNotEmpty ? notas.reduce((a, b) => a < b ? a : b) : 0.0,
      'aprovados': aprovados,
      'reprovados': correcoes.length - aprovados,
      'totalAcertos': totalAcertos,
      'totalErros': totalErros,
    };
  }

  Widget _buildGraficoPizza() {
    final totalAcertos = estatisticas['totalAcertos'] ?? 0;
    final totalErros = estatisticas['totalErros'] ?? 0;
    final total = totalAcertos + totalErros;

    if (total == 0) {
      return Center(
        child: Text(
          'Nenhuma correção realizada ainda',
          style: TextStyle(fontSize: 16, color: Colors.grey),
        ),
      );
    }

    return Container(
      height: 250,
      child: PieChart(
        PieChartData(
          sectionsSpace: 2,
          centerSpaceRadius: 40,
          sections: [
            PieChartSectionData(
              color: Colors.green,
              value: totalAcertos.toDouble(),
              title: '${((totalAcertos / total) * 100).round()}%',
              titleStyle: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
              radius: 100,
            ),
            PieChartSectionData(
              color: Colors.red,
              value: totalErros.toDouble(),
              title: '${((totalErros / total) * 100).round()}%',
              titleStyle: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
              radius: 100,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEstatisticaCard(String titulo, String valor, IconData icone, Color cor) {
    return Container(
      padding: EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: cor.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: cor.withOpacity(0.3)),
      ),
      child: Column(
        children: [
          Icon(icone, color: cor, size: 24),
          SizedBox(height: 8),
          Text(
            valor,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: cor,
            ),
          ),
          Text(
            titulo,
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey.shade600,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Resultados - ${widget.prova['titulo']}'),
        backgroundColor: Colors.purple,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: _carregarResultados,
            tooltip: 'Atualizar',
          ),
        ],
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Estatísticas gerais
                  Card(
                    child: Padding(
                      padding: EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Estatísticas Gerais',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                          ),
                          SizedBox(height: 16),
                          Row(
                            children: [
                              Expanded(
                                child: _buildEstatisticaCard(
                                  'Alunos',
                                  '${estatisticas['totalAlunos']}',
                                  Icons.people,
                                  Colors.blue,
                                ),
                              ),
                              SizedBox(width: 8),
                              Expanded(
                                child: _buildEstatisticaCard(
                                  'Média Geral',
                                  '${estatisticas['mediaGeral']?.toStringAsFixed(1)}',
                                  Icons.trending_up,
                                  Colors.green,
                                ),
                              ),
                            ],
                          ),
                          SizedBox(height: 8),
                          Row(
                            children: [
                              Expanded(
                                child: _buildEstatisticaCard(
                                  'Aprovados',
                                  '${estatisticas['aprovados']}',
                                  Icons.check_circle,
                                  Colors.green,
                                ),
                              ),
                              SizedBox(width: 8),
                              Expanded(
                                child: _buildEstatisticaCard(
                                  'Reprovados',
                                  '${estatisticas['reprovados']}',
                                  Icons.cancel,
                                  Colors.red,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),

                  SizedBox(height: 16),

                  // Gráfico de Pizza
                  Card(
                    child: Padding(
                      padding: EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Acertos vs Erros (Geral)',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                          ),
                          SizedBox(height: 16),
                          _buildGraficoPizza(),
                          SizedBox(height: 16),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    width: 16,
                                    height: 16,
                                    color: Colors.green,
                                  ),
                                  SizedBox(width: 8),
                                  Text('Acertos: ${estatisticas['totalAcertos']}'),
                                ],
                              ),
                              Row(
                                children: [
                                  Container(
                                    width: 16,
                                    height: 16,
                                    color: Colors.red,
                                  ),
                                  SizedBox(width: 8),
                                  Text('Erros: ${estatisticas['totalErros']}'),
                                ],
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),

                  SizedBox(height: 16),

                  // Lista de correções
                  Card(
                    child: Padding(
                      padding: EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Correções Individuais',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                          ),
                          SizedBox(height: 16),
                          
                          if (correcoes.isEmpty)
                            Center(
                              child: Text(
                                'Nenhuma correção realizada ainda',
                                style: TextStyle(fontSize: 16, color: Colors.grey),
                              ),
                            )
                          else
                            ...correcoes.map((correcao) {
                              final aluno = correcao['alunos'];
                              final resultado = correcao['resultados']?.isNotEmpty == true 
                                  ? correcao['resultados'][0] 
                                  : null;
                              final porcentagem = resultado?['porcentagem_acerto'] ?? 0;
                              final nota = porcentagem / 10.0;
                              final aprovado = nota >= 6.0;
                              
                              return Card(
                                color: aprovado ? Colors.green.shade50 : Colors.red.shade50,
                                margin: EdgeInsets.only(bottom: 8),
                                child: ListTile(
                                  leading: CircleAvatar(
                                    backgroundColor: aprovado ? Colors.green : Colors.red,
                                    child: Icon(
                                      aprovado ? Icons.check : Icons.close,
                                      color: Colors.white,
                                    ),
                                  ),
                                  title: Text(
                                    aluno?['nome'] ?? 'Aluno não encontrado',
                                    style: TextStyle(fontWeight: FontWeight.bold),
                                  ),
                                  subtitle: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text('Acertos: ${correcao['acertos']} de ${correcao['total_questoes']}'),
                                      Text('Nota: ${nota.toStringAsFixed(1)} (${porcentagem}%)'),
                                      Text(
                                        aprovado ? 'APROVADO' : 'REPROVADO',
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          color: aprovado ? Colors.green : Colors.red,
                                        ),
                                      ),
                                    ],
                                  ),
                                  trailing: IconButton(
                                    icon: Icon(Icons.delete, color: Colors.red),
                                    onPressed: () => _excluirCorrecao(correcao['id'], aluno?['nome'] ?? 'Aluno'),
                                  ),
                                ),
                              );
                            }).toList(),
                        ],
                      ),
                    ),
                  ),
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
            minimumSize: Size(double.infinity, 50),
          ),
        ),
      ),
    );
  }

  Future<void> _excluirCorrecao(int correcaoId, String alunoNome) async {
    final confirmar = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Excluir Correção'),
        content: Text('Deseja realmente excluir a correção de $alunoNome?'),
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
        await _supabase.from('correcoes').delete().eq('id', correcaoId);
        _carregarResultados();
        
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Correção excluída com sucesso!')),
        );
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erro ao excluir correção: $e')),
        );
      }
    }
  }
}