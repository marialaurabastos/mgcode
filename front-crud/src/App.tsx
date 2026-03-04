import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import User from './pages/user/User';
import Tasks from './pages/tasks/Tasks';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<User />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </Router>
  );
}

export default App;