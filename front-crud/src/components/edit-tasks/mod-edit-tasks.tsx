import { useState, useEffect, type FormEvent } from 'react';
import type { Task } from '../../types/task';
import api from '../../services/api'
import "./mod-edit-tasks.css";


interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSuccess: () => void;
}

function EditTaskModal({ isOpen, onClose, task, onSuccess }: EditTaskModalProps) {
  const [title, setTitle] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setStatus(task.status);;
      if (task.dueDate) {
        setDueDate(task.dueDate.split('T')[0]);
      }
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/tasks/${task.id}`, {
        title: title,
        status: status,
        dueDate: new Date(dueDate).toISOString()
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error ao atualizar:", error);
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
              <label>Tarefa</label>
              <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className='field-group'>
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