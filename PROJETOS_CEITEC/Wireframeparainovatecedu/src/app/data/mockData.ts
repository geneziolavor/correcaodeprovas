import { User, Activity, Submission, Class, EnrolledStudent } from '../../types';

export type { User, Activity, Submission, Class, EnrolledStudent };

export const users: User[] = [
    {
        id: '1',
        name: 'Pedro A.',
        email: 'pedro@email.com',
        role: 'student',
        xp: 1450,
        level: 3,
        avatar: '👨‍💻',
        badges: ['Criador Maker', 'Lógica em Ação', 'Maker Criativa', 'Startup Criativa'],
        progress: 75
    },
    {
        id: '2',
        name: 'Prof. Ricardo',
        email: 'prof.ricardo@email.com',
        role: 'teacher',
        xp: 0,
        level: 0,
        avatar: '👨‍🏫',
        badges: [],
        progress: 0
    }
];

export const activities: Activity[] = [
    {
        id: '1',
        title: 'Introdução ao PictoBlox',
        description: 'Aprenda os conceitos básicos da programação visual',
        points: 100,
        deadline: '2026-02-15',
        discipline: 'Programação',
        icon: '✅',
        color: 'from-green-400 to-emerald-500'
    },
    {
        id: '2',
        title: 'Desafio de Robótica',
        description: 'Crie um projeto de robô seguidor de linha',
        points: 150,
        deadline: '2026-02-20',
        discipline: 'Robótica',
        icon: '🤖',
        color: 'from-red-400 to-orange-500'
    },
    {
        id: '3',
        title: 'Plano de Negócio',
        description: 'Desenvolva um plano de negócio digital',
        points: 120,
        deadline: '2026-02-25',
        discipline: 'Empreendedorismo',
        icon: '💼',
        color: 'from-blue-400 to-cyan-500'
    }
];

export const submissions: Submission[] = [
    {
        id: 's1',
        activityId: '1',
        studentId: '1',
        status: 'graded',
        grade: 9.5,
        feedback: 'Excelente trabalho com os blocos!',
        submittedAt: '2026-02-01',
    },
    {
        id: 's2',
        activityId: '2',
        studentId: '1',
        status: 'pending',
        submittedAt: '2026-02-04',
        comments: 'Consegui fazer o robô seguir a linha, mas ele está um pouco lento nas curvas.'
    }
];

export const initialEnrolledStudents: EnrolledStudent[] = [
    {
        id: '1',
        name: 'Pedro A.',
        email: 'pedro@email.com',
        classId: '9a',
        schedule: '08:00 - 10:00',
        discipline: 'Robótica',
        accessCode: 'INV-1029',
        xp: 1450,
        progress: 75,
        avatar: '👨‍💻',
        role: 'student'
    },
    {
        id: '2',
        name: 'Ana Silva',
        email: 'ana@email.com',
        classId: '9a',
        schedule: '10:00 - 12:00',
        discipline: 'Programação',
        accessCode: 'INV-3342',
        xp: 1680,
        progress: 85,
        avatar: '👩‍💻',
        role: 'student'
    },
];

export const classes: Class[] = [
    {
        id: '9a',
        name: 'Turma 9A',
        studentsCount: 2,
        progress: 68,
        disciplines: ['Robótica', 'Programação', 'Inovação']
    },
    {
        id: '9b',
        name: 'Turma 9B',
        studentsCount: 0,
        progress: 0,
        disciplines: ['Empreendedorismo', 'Programação', 'Inovação']
    }
];
