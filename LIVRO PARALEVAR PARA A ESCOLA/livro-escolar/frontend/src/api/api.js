import axios from 'axios';

// Substitua pelo IP do seu computador na rede local
// ou pelo endereço do seu servidor se estiver hospedado
const API_URL = 'http://192.168.1.100:5000/api';

// Funções para Alunos
export const getStudents = async () => {
  try {
    const response = await axios.get(`${API_URL}/students`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    throw error;
  }
};

export const addStudent = async (student) => {
  try {
    const response = await axios.post(`${API_URL}/students`, student);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar aluno:', error);
    throw error;
  }
};

export const deleteStudent = async (id) => {
  try {
    await axios.delete(`${API_URL}/students/${id}`);
  } catch (error) {
    console.error('Erro ao excluir aluno:', error);
    throw error;
  }
};

// Funções para Professores
export const getTeachers = async () => {
  try {
    const response = await axios.get(`${API_URL}/teachers`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar professores:', error);
    throw error;
  }
};

export const addTeacher = async (teacher) => {
  try {
    const response = await axios.post(`${API_URL}/teachers`, teacher);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar professor:', error);
    throw error;
  }
};

export const deleteTeacher = async (id) => {
  try {
    await axios.delete(`${API_URL}/teachers/${id}`);
  } catch (error) {
    console.error('Erro ao excluir professor:', error);
    throw error;
  }
};

// Funções para Livros
export const getBooks = async () => {
  try {
    const response = await axios.get(`${API_URL}/books`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    throw error;
  }
};

export const addBook = async (book) => {
  try {
    const response = await axios.post(`${API_URL}/books`, book);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar livro:', error);
    throw error;
  }
};

export const deleteBook = async (id) => {
  try {
    await axios.delete(`${API_URL}/books/${id}`);
  } catch (error) {
    console.error('Erro ao excluir livro:', error);
    throw error;
  }
};

// Funções para Horários
export const getSchedules = async () => {
  try {
    const response = await axios.get(`${API_URL}/schedules`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar horários:', error);
    throw error;
  }
};

export const getSchedulesByDayAndSerie = async (day, serie) => {
  try {
    const response = await axios.get(`${API_URL}/schedules/by-day/${day}/${serie}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar horários por dia:', error);
    throw error;
  }
};

export const addSchedule = async (schedule) => {
  try {
    const response = await axios.post(`${API_URL}/schedules`, schedule);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar horário:', error);
    throw error;
  }
};

export const deleteSchedule = async (id) => {
  try {
    await axios.delete(`${API_URL}/schedules/${id}`);
  } catch (error) {
    console.error('Erro ao excluir horário:', error);
    throw error;
  }
};

// Funções para Lembretes
export const getReminders = async () => {
  try {
    const response = await axios.get(`${API_URL}/reminders`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar lembretes:', error);
    throw error;
  }
};

export const addReminder = async (reminder) => {
  try {
    const response = await axios.post(`${API_URL}/reminders`, reminder);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar lembrete:', error);
    throw error;
  }
};

export const deleteReminder = async (id) => {
  try {
    await axios.delete(`${API_URL}/reminders/${id}`);
  } catch (error) {
    console.error('Erro ao excluir lembrete:', error);
    throw error;
  }
};

export const deleteAllReminders = async () => {
  try {
    await axios.delete(`${API_URL}/reminders`);
  } catch (error) {
    console.error('Erro ao excluir todos os lembretes:', error);
    throw error;
  }
}; 