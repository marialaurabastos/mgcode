import { useState, type FormEvent } from 'react';
import axios from 'axios';
import "./mod-add-tasks.css";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function AddTaskModal({ isOpen, onClose, onSuccess }: AddTaskModalProps) {
  const [user, setUser] = useState<string>('');
  const [task, setTask] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const formattedDate = new Date(dueDate).toISOString();
      await axios.post("http://localhost:3000/tasks", {
        usuario: user,
        tarefa: task,
        dataEntrega: formattedDate
      });
      
      onSuccess();
      setUser('');
      setTask('');
      setDueDate('');
      onClose();
    } catch (error: any) {
      console.error("Error saving task:", error);
      alert("Erro ao salvar tarefa no banco!");
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
              <label>Usuário</label>
              <input 
                type='text' 
                value={user} 
                onChange={(e) => setUser(e.target.value)} 
                required 
              />
            </div>
            <div className='field-group'>
              <label>Tarefa</label>
              <input 
                type='text' 
                value={task} 
                onChange={(e) => setTask(e.target.value)} 
                required 
              />
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