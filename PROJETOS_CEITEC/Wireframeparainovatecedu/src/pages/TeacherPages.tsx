import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ClassManagement } from '../app/components/ClassManagement';
import { Grading } from '../app/components/Grading';
import { SubmissionsList } from '../app/components/SubmissionsList';
import { Button } from '../app/components/ui/button';
import { BarChart3, ArrowLeft, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { ActivityCreator } from '../app/components/ActivityCreator';
import { MissionManagement } from '../app/components/MissionManagement';

const handleTeacherNavigate = (navigate: any, screen: string, id: string | undefined = undefined) => {
    // Map legacy
    const routeMap: Record<string, string> = {
        'teacher-dashboard': '/teacher',
        'class-management': id ? `/teacher/classes/${id}` : '/teacher/classes',
        'mission-management': '/teacher/missions',
        'activity-creator': id ? `/teacher/activity-creator/${id}` : '/teacher/activity-creator',
        'activity-edit': id ? `/teacher/activity-creator/edit/${id}` : '/teacher/activity-creator',
        'grading': id ? `/teacher/grading/${id}` : '/teacher/grading',
        'submissions-list': '/teacher/submissions',
        'reports': '/teacher/reports',
        'calendar': '/teacher/calendar',
        'logout': '/login'
    };
    if (screen === 'logout') {
        // Handle logout
    }
    const target = routeMap[screen];
    if (target) navigate(target);
};

export function ClassManagementPage() {
    const { classId } = useParams();
    const { classes, enrolledStudents, addClass, addActivity, addStudent, deleteClass, deleteStudent } = useData();
    const navigate = useNavigate();

    const selectedClass = classes.find(c => String(c.id) === String(classId)) || classes[0];

    const classStudents = enrolledStudents.filter(s =>
        String(s.classId) === String(selectedClass?.id) ||
        String((s as any).class_id) === String(selectedClass?.id)
    );

    return (
        <ClassManagement
            onNavigate={(s, id) => handleTeacherNavigate(navigate, s, id)}
            onAddClass={addClass}
            onAddActivity={addActivity}
            selectedClass={selectedClass}
            classes={classes}
            students={classStudents}
            onAddStudent={addStudent}
            onDeleteClass={deleteClass}
            onDeleteStudent={deleteStudent}
        />
    );
}

export function ActivityCreatorPage() {
    const { classId, activityId } = useParams();
    const { classes, activities, addActivity, updateActivity } = useData();
    const navigate = useNavigate();

    const selectedClass = classes.find(c => String(c.id) === String(classId));
    const initialActivity = activities.find(a => String(a.id) === String(activityId));

    const handleSave = async (data: any) => {
        if (activityId) {
            return await updateActivity(activityId, data);
        } else {
            return await addActivity(data);
        }
    };

    return (
        <ActivityCreator
            onNavigate={(s, id) => handleTeacherNavigate(navigate, s, id)}
            onSave={handleSave}
            classes={classes}
            selectedClass={selectedClass ? { name: selectedClass.name, id: selectedClass.id } : undefined}
            initialData={initialActivity}
        />
    );
}

export function MissionManagementPage() {
    const { classes, activities, deleteActivity, updateActivity } = useData();
    const navigate = useNavigate();

    return (
        <MissionManagement
            onNavigate={(s, id) => handleTeacherNavigate(navigate, s, id)}
            classes={classes}
            activities={activities}
            onDeleteActivity={deleteActivity}
            onUpdateActivity={updateActivity}
        />
    );
}

export function GradingPage() {
    const { submissionId } = useParams();
    const { submissions, enrolledStudents, activities, gradeSubmission } = useData();
    const navigate = useNavigate();

    const sub = submissions.find(s => String(s.id) === String(submissionId));
    const st = enrolledStudents.find(s => String(s.id) === String(sub?.studentId || sub?.student_id));
    const act = activities.find(a => String(a.id) === String(sub?.activityId || sub?.activity_id));

    return (
        <Grading
            onNavigate={(s) => handleTeacherNavigate(navigate, s)}
            submission={sub}
            student={st}
            activity={act}
            onGrade={gradeSubmission}
        />
    );
}

export function SubmissionsListPage() {
    const { submissions, activities, enrolledStudents, deleteSubmission } = useData();
    const navigate = useNavigate();

    return (
        <SubmissionsList
            onNavigate={(s, id) => handleTeacherNavigate(navigate, s, id)}
            submissions={submissions}
            activities={activities}
            students={enrolledStudents}
            onDeleteSubmission={deleteSubmission}
        />
    );
}

import { Reports } from '../app/components/Reports';

export function ReportsPage() {
    const {
        classes,
        activities,
        submissions,
        enrolledStudents,
        loading,
        seedTestData
    } = useData();
    const navigate = useNavigate();

    return (
        <Reports
            onNavigate={(s, id) => handleTeacherNavigate(navigate, s, id)}
            classes={classes}
            activities={activities}
            submissions={submissions}
            students={enrolledStudents}
            loading={loading}
            onSeedData={seedTestData}
        />
    );
}

export function CalendarPage() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-[#1e3a8a] p-8 text-white flex flex-col items-center justify-center text-center">
            <CalendarIcon className="w-20 h-20 text-orange-400 mb-6 animate-bounce" />
            <h1 className="text-4xl font-bold mb-4">Calendário Acadêmico</h1>
            <p className="text-blue-200 max-w-md mb-8">Em breve: Agendamento de aulas, prazos de entrega e eventos integrados com sua agenda.</p>
            <Button onClick={() => navigate('/teacher')} className="bg-white/10 border-white/20 hover:bg-white/20">
                <ArrowLeft className="mr-2" /> Voltar ao Dashboard
            </Button>
        </div>
    );
}
