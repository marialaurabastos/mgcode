import { NavLink } from 'react-router-dom';
import "./sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>Menu</h2>
      </div>

      <div className="sidebar-links-container">
        <nav className="navbar-links">

          <NavLink 
            to="/user" 
            className={({ isActive }) => isActive ? 'active-link' : 'nav-link'}
          >
            Usuários
          </NavLink>

          <NavLink 
            to="/tasks" 
            className={({ isActive }) => isActive ? 'active-link' : 'nav-link'}
          >
            Tarefas
          </NavLink>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;