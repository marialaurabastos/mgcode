import { useState, useEffect, type FormEvent } from 'react';
import api from '../../services/api';
import "./mod-add-tasks.css";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface User {
  id: number;
  name: string;
}

function AddTaskModal({ isOpen, onClose, onSuccess }: AddTaskModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [status, setStatus] = useState<string>('pendente');
  const [dueDate, setDueDate] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        try {
          const response = await api.get('/user');
          setUsers(response.data);
        } catch (error) {
          console.error("Erro ao carregar usuários:", error);
        }
      };
      fetchUsers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!name) {
        alert("Escolha um responsável pela tarefa.");
        return;
      }

      const formattedDate = new Date(dueDate).toISOString();

      await api.post("/tasks", {
        title: title,
        status: status || 'pendente',
        dueDate: formattedDate,
        userId: Number(name)
      });

      onSuccess();
      onClose();

      alert('Tarefa criada com sucesso!');

    } catch (error: any) {
      console.error("Error saving task:", error);
      alert(error.response?.data?.message || "Erro ao salvar tarefa no banco!");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className='modal-container' onClick={(e) => e.stopPropagation()}>
        <div className='modal-content'>
          <button className='close-modal-btn' onClick={onClose}>X</button>
          <h2>Adicionar Tarefa</h2>
          <form className='modal-form' onSubmit={handleSubmit}>
            <div className='field-group'>
              <div className='field-group'>
                <label>Usuário Responsável</label>
                <select
                  className="name-select"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                >
                  <option value="">Selecione um usuário</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <label>Tarefa</label>
              <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className='field-group'>
              <label>Status da Tarefa</label>
              <select
                className="status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="pendente">Pendente</option>
                <option value="em_progresso">Em Progresso</option>
                <option value="concluida">Concluída</option>
              </select>
            </div>
            <div className='field-group'>
              <label>Data de vencimento</label>
              <input
                type='date'
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
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

export default AddTaskModal;