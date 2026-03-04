import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import api from "../../services/api";
import "./mod-edit-user.css";

interface User {
  id: number;
  usuario: string;
  email: string;
  perfil: string;
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuario: User | null;
  onUserUpdate: () => void;
}

function EditUserModal({ isOpen, onClose, usuario, onUserUpdate }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: ''
  });

  useEffect(() => {
    if (usuario) {
      setFormData({
        username: usuario.usuario,
        email: usuario.email,
        role: usuario.perfil
      });
    }
  }, [usuario]);

  if (!isOpen || !usuario) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/usuarios/${usuario.id}`, {
        usuario: formData.username,
        email: formData.email,
        perfil: formData.role
      }); 
      alert("Usuário atualizado com sucesso!");
      onUserUpdate();
      onClose();
    } catch (error) {
      console.error("Error editing user:", error);
      alert("Erro ao atualizar usuário.");
    }
  };

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-container' onClick={(e) => e.stopPropagation()}>
        <div className='modal-content'>
          <button className='close-modal-btn' onClick={onClose}>X</button>
          <h2>Editar Usuário</h2>
          <form className='modal-form' onSubmit={handleSubmit}>
            <div className='field-group'>
              <label>Usuário</label>
              <input 
                name='username' 
                value={formData.username} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className='field-group'>
              <label>Email</label>
              <input 
                name='email' 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className='field-group'>
              <label>Perfil</label>
              <select name="role" value={formData.role} onChange={handleChange} required>
                <option value="admin">Administrador</option>
                <option value="usuario">Usuário</option>
                <option value="comum">Comum</option>
              </select>
            </div>
            <div className='modal-actions'>
              <button type='button' onClick={onClose} className='cancel-btn'>Cancelar</button>
              <button type='submit' className='save-btn'>Salvar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditUserModal;