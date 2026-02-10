class Aluno {
  final String id;
  final String nome;
  final String turmaId;
  final String matricula;
  final String? email;

  Aluno({
    required this.id,
    required this.nome,
    required this.turmaId,
    required this.matricula,
    this.email,
  });

  factory Aluno.fromJson(Map<String, dynamic> json) {
    return Aluno(
      id: json['id'] as String,
      nome: json['nome'] as String,
      turmaId: json['turma_id'] as String,
      matricula: json['matricula'] as String,
      email: json['email'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'nome': nome,
      'turma_id': turmaId,
      'matricula': matricula,
      'email': email,
    };
  }
}
