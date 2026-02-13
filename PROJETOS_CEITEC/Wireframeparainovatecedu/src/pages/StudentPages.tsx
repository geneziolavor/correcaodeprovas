import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Activities } from '../app/components/Activities';
import { Portfolio } from '../app/components/Portfolio';
import { Progress } from '../app/components/Progress';
import { SubmitActivity } from '../app/components/SubmitActivity';
import { useParams } from 'react-router-dom';

const handleStudentNavigate = (navigate: any, screen: string, id: string | undefined = undefined) => {
    // Map legacy
    const routeMap: Record<string, string> = {
        'student-dashboard': '/student',
        'activities': '/student/activities',
        'portfolio': '/student/portfolio',
        'progress': '/student/progress',
        'learning-paths': '/student/learning-paths',
        'submit-activity': id ? `/student/activities/${id}/submit` : '/student/activities',
        'logout': '/login'
    };
    if (screen === 'logout') {
        const { logout } = useAuth(); // Can't hook here
    }
    const target = routeMap[screen];
    if (target) navigate(target);
};

export function ActivitiesPage() {
    const { activities, submissions } = useData();
    const { user } = useAuth();
    const navigate = useNavigate();
    const mySubs = submissions.filter(s => s.studentId === user?.id);

    return <Activities onNavigate={(s, id) => handleStudentNavigate(navigate, s, id)} activities={activities} submissions={mySubs} />;
}

export function PortfolioPage() {
    const { activities, submissions, deleteSubmission } = useData();
    const { user } = useAuth();
    const navigate = useNavigate();
    const mySubs = submissions.filter(s => String(s.studentId || s.student_id) === String(user?.id));

    return <Portfolio onNavigate={(s) => handleStudentNavigate(navigate, s)} submissions={mySubs} activities={activities} onDeleteSubmission={deleteSubmission} />;
}

export function ProgressPage() {
    const { activities, submissions } = useData();
    const { user } = useAuth();
    const navigate = useNavigate();
    const mySubs = submissions.filter(s => s.studentId === user?.id);

    return <Progress onNavigate={(s) => handleStudentNavigate(navigate, s)} submissions={mySubs} activities={activities} currentUser={user} />;
}

export function SubmitActivityPage() {
    const { activityId } = useParams();
    const { activities, addSubmission } = useData();
    const navigate = useNavigate();

    return (
        <SubmitActivity
            onNavigate={(s) => handleStudentNavigate(navigate, s)}
            onSubmit={addSubmission}
            activityId={activityId || ''}
            activities={activities}
        />
    );
}
