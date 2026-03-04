import { useState, useEffect, type FormEvent } from 'react';
import type { Task } from '../../types/task';
import axios from 'axios';
import "./mod-edit-tasks.css";


interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  tarefa: Task | null;
  onSuccess: () => void;
}

function EditTaskModal({ isOpen, onClose, tarefa, onSuccess }: EditTaskModalProps) {
  const [userName, setUserName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');

  useEffect(() => {
    if (tarefa) {
      setUserName(tarefa.usuario);
      setDescription(tarefa.tarefa);
      if (tarefa.dataEntrega) {
        setDueDate(tarefa.dataEntrega.split('T')[0]);
      }
    }
  }, [tarefa]);

  if (!isOpen || !tarefa) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/tarefa/${tarefa.id}`, {
        nome: userName,
        tarefa: description,
        dataEntrega: new Date(dueDate).toISOString()
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error updating task:", error);
      alert("Erro ao atualizar tarefa!");
    }
  };

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-container' onClick={(e) => e.stopPropagation()}>
        <div className='modal-content'>
          <button className='close-modal-btn' onClick={onClose}>X</button>
          <h2>Editar Tarefa</h2>
          <form className='modal-form' onSubmit={handleSubmit}>
            <div className='field-group'>
              <label>Usuário</label>
              <input 
                type='text' 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} 
                required 
              />
            </div>
            <div className='field-group'>
              <label>Tarefa</label>
              <input 
                type='text' 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
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

export default EditTaskModal;