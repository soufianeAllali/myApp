import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Menu from './Menu';
import Topbar from './components/Topbar';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard';
import Teachers from './pages/Teachers/Teachers';
import Students from './pages/Students/Students';
import Classes from './pages/Classes/Classes';
import Subjects from './pages/Subjects/Subjects';
import Rooms from './pages/Rooms/Rooms';
import Schedules from './pages/Schedules';
import TimeSlots from './pages/TimeSlots/TimeSlots';
import TeacherTimetable from './pages/TeacherTimetable/TeacherTimetable';
import StudentTimetable from './pages/StudentTimetable/StudentTimetable';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/teacher/timetable" element={
          <ProtectedRoute allowedRole="teacher">
            <TeacherTimetable />
          </ProtectedRoute>
        } />
        <Route path="/student/timetable" element={
          <ProtectedRoute allowedRole="student">
            <StudentTimetable />
          </ProtectedRoute>
        } />

        <Route
          path="/*"
          element={
            <ProtectedRoute allowedRole="admin">
              <div className="app-container">
                <Menu />
                <div className="main-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Topbar />
                  <main className="main-content">
                    <Routes>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="teachers" element={<Teachers />} />
                      <Route path="students" element={<Students />} />
                      <Route path="classes" element={<Classes />} />
                      <Route path="subjects" element={<Subjects />} />
                      <Route path="rooms" element={<Rooms />} />
                      <Route path="schedules" element={<Schedules />} />
                      <Route path="timeslots" element={<TimeSlots />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;