import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import api from "../../services/api";
import "./mod-edit-user.css";

export interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: UserData | null;
  onUserUpdate: () => void;
}

function EditUserModal({ isOpen, onClose, name, onUserUpdate }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  });

  useEffect(() => {
    if (name) {
      setFormData({
        name: name.name,
        email: name.email,
        role: name.role
      });
    }
  }, [name]);

  if (!isOpen || !name) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/user/${name.id}`, {
        name: formData.name,
        email: formData.email,
        role: formData.role
      }); 
      alert("Usuário atualizado com sucesso!");
      onUserUpdate();
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
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
                name='name' 
                value={formData.name} 
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
                <option value="administrador">Administrador</option>
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