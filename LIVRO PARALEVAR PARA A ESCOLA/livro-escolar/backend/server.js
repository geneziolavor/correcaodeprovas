const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Conectar ao MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Atlas conectado com sucesso!'))
.catch(err => console.error('Erro na conexão com MongoDB Atlas:', err));

// Definir modelos (schemas)
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  serie: { type: String, required: true },
  turno: { type: String, required: true },
  phone: { type: String, required: true }
});

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true }
});

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true }
});

const scheduleSchema = new mongoose.Schema({
  day: { type: String, required: true },
  time: { type: String, required: true },
  subject: { type: String, required: true },
  book: { type: String, required: true },
  serie: { type: String, required: true }
});

const reminderSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  day: { type: String, required: true },
  scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true },
  notificationSent: { type: Boolean, default: false }
});

// Criar modelos
const Student = mongoose.model('Student', studentSchema);
const Teacher = mongoose.model('Teacher', teacherSchema);
const Book = mongoose.model('Book', bookSchema);
const Schedule = mongoose.model('Schedule', scheduleSchema);
const Reminder = mongoose.model('Reminder', reminderSchema);

// Rotas para Alunos
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/students', async (req, res) => {
  const student = new Student(req.body);
  try {
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Aluno removido com sucesso' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rotas para Professores
app.get('/api/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/teachers', async (req, res) => {
  const teacher = new Teacher(req.body);
  try {
    const newTeacher = await teacher.save();
    res.status(201).json(newTeacher);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/teachers/:id', async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: 'Professor removido com sucesso' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rotas para Livros
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/books', async (req, res) => {
  const book = new Book(req.body);
  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/books/:id', async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Livro removido com sucesso' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rotas para Horários
app.get('/api/schedules', async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/schedules/by-day/:day/:serie', async (req, res) => {
  try {
    const { day, serie } = req.params;
    const schedules = await Schedule.find({ day, serie });
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/schedules', async (req, res) => {
  const schedule = new Schedule(req.body);
  try {
    const newSchedule = await schedule.save();
    res.status(201).json(newSchedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/schedules/:id', async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: 'Horário removido com sucesso' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rotas para Lembretes
app.get('/api/reminders', async (req, res) => {
  try {
    const reminders = await Reminder.find()
      .populate('studentId')
      .populate('scheduleId');
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/reminders', async (req, res) => {
  const reminder = new Reminder(req.body);
  try {
    const newReminder = await reminder.save();
    res.status(201).json(newReminder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/reminders/:id', async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lembrete removido com sucesso' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/reminders', async (req, res) => {
  try {
    await Reminder.deleteMany({});
    res.json({ message: 'Todos os lembretes foram removidos' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 