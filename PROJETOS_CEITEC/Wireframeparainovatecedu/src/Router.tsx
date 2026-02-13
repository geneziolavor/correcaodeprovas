import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { TeacherDashboardPage } from './pages/TeacherDashboardPage';
import { ActivitiesPage, PortfolioPage, ProgressPage, SubmitActivityPage } from './pages/StudentPages';
import { ClassManagementPage, GradingPage, SubmissionsListPage, ReportsPage, CalendarPage, ActivityCreatorPage, MissionManagementPage } from './pages/TeacherPages';
import { PrivateRoute } from './components/PrivateRoute';
import { MainLayout } from './layouts/MainLayout';

export function AppRouter() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Main Layout Wrapper for Protected Routes */}
            <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>

                {/* Student Routes */}
                <Route path="/student" element={<StudentDashboardPage />} />
                <Route path="/student/activities" element={<ActivitiesPage />} />
                <Route path="/student/activities/:activityId/submit" element={<SubmitActivityPage />} />
                <Route path="/student/portfolio" element={<PortfolioPage />} />
                <Route path="/student/progress" element={<ProgressPage />} />
                <Route path="/student/learning-paths" element={<Navigate to="/student" replace />} />

                {/* Teacher Routes */}
                <Route path="/teacher" element={<TeacherDashboardPage />} />
                <Route path="/teacher/classes" element={<ClassManagementPage />} />
                <Route path="/teacher/classes/:classId" element={<ClassManagementPage />} />
                <Route path="/teacher/missions" element={<MissionManagementPage />} />
                <Route path="/teacher/activity-creator" element={<ActivityCreatorPage />} />
                <Route path="/teacher/activity-creator/:classId" element={<ActivityCreatorPage />} />
                <Route path="/teacher/activity-creator/edit/:activityId" element={<ActivityCreatorPage />} />
                <Route path="/teacher/grading/:submissionId" element={<GradingPage />} />
                <Route path="/teacher/submissions" element={<SubmissionsListPage />} />
                <Route path="/teacher/reports" element={<ReportsPage />} />
                <Route path="/teacher/calendar" element={<CalendarPage />} />
            </Route>

            {/* Root Redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}
