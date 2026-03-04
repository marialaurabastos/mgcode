import { useState, type ChangeEvent, type FormEvent } from 'react';
import api from '../../services/api';
import './mod-add-user.css';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: () => void;
}

function AddUserModal({ isOpen, onClose, onUserAdded }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/usuarios', {
        usuario: formData.username,
        email: formData.email,
        perfil: formData.role,
        senha: formData.password
      });

      alert("Usuário cadastrado com sucesso!");
      setFormData({ username: '', email: '', role: '', password: '' });
      onUserAdded();
      onClose();
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Erro ao cadastrar usuário.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <button className="close-modal-btn" onClick={onClose}>X</button>

          <h2>Adicionar Usuário</h2>
          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="field-group">
              <label htmlFor="username">Usuário</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="role">Perfil</label>
              <select
                name="role"
                id="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Selecione</option>
                <option value="admin">Administrador</option>
                <option value="usuario">Usuário</option>
                <option value="comum">Comum</option>
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="modal-actions">
              <button type="button" onClick={onClose} className="cancel-btn">Cancelar</button>
              <button type="submit" className="save-btn">Salvar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddUserModal;