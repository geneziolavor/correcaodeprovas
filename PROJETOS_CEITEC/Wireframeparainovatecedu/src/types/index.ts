export type Role = 'student' | 'teacher';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    xp?: number;
    level?: number;
    avatar?: string;
    badges?: string[];
    progress?: number;
    accessCode?: string;
}

export interface Question {
    id: string;
    prompt: string;
    options?: string[];
    answer: string;
}

export interface Activity {
    id: string;
    title: string;
    description: string;
    points: number;
    deadline: string | null;
    icon?: string;
    color?: string;
    discipline: string;
    questions?: Question[];
    type?: 'atividade' | 'desafio' | 'projeto' | 'avaliação';
    class_id?: string;
    classId?: string; // App compatibility
}

export interface Submission {
    id: string;
    activity_id?: string; // Supabase style
    activityId?: string; // App style (need to normalize)
    student_id?: string;
    studentId?: string;
    status: 'pending' | 'delivered' | 'graded';
    grade?: number;
    feedback?: string;
    submitted_at?: string;
    submittedAt?: string;
    graded_at?: string;
    file_url?: string;
    comments?: string;
}

export interface Class {
    id: string;
    name: string;
    studentsCount: number;
    progress: number;
    disciplines: string[];
}

export interface EnrolledStudent {
    id: string;
    name: string;
    email: string;
    role?: Role; // Optional because sometimes it's just student data
    classId: string; // or class_id
    schedule?: string;
    discipline?: string;
    accessCode?: string;
    xp: number;
    progress: number;
    avatar: string;
}
