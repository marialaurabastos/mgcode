import { useState, useEffect } from "react";
import type { Task } from '../../types/task';
import axios from "axios";
import "./tasks.css";
import EditIcon from "../../assets/pencil.png";
import DeleteIcon from "../../assets/bin.png";
import Layout from "../../layout/Layout";
import AddTaskModal from "../../components/add-tasks/mod-add-tasks";
import EditTaskModal from "../../components/edit-tasks/mod-edit-tasks";
import DeleteModal from "../../components/delete/mod-delete";

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState<string>("");
  const [openModal, setOpenModal] = useState<'add' | 'edit' | 'delete' | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const loadTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/tarefa");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const filteredTasks = tasks.filter((task) =>
    task.usuario.toLowerCase().includes(search.toLowerCase()) ||
    task.tarefa.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => setOpenModal('add');
  const openDeleteModal = (task: Task) => {
    setSelectedTask(task);
    setOpenModal('delete');
  }
  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setOpenModal('edit');
  }
  const closeModals = () => {
    setOpenModal(null);
    setSelectedTask(null);
  }

  const formatDate = (isoDate: string) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  return (
    <div className="tasks-container">
      <Layout>
      <div className="tasks-page">
        <h1>Tarefas</h1>
        <div className="tasks-header">
          <div className="tasks-search-wrapper">
            <input 
              type="text" 
              placeholder="Pesquisar tarefa ou usuário..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="search-input"
            />
            <div className="action-buttons">
              <div className="clear-button-wrapper">
                <button onClick={() => setSearch("")}>Limpar</button>
              </div>
              <div className="add-button-wrapper">
                <button onClick={openAddModal}>Adicionar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="tasks-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuário</th>
                <th>Tarefa</th>
                <th>Vencimento</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {search === "" && tasks.length === 0 ? (
                <tr></tr>
              ) : (
                <>
                  {search !== "" && filteredTasks.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center' }}>
                        Nenhuma tarefa encontrada para "{search}".
                      </td>
                    </tr>
                  ) : (
                    filteredTasks.map((task) => (
                      <tr key={task.id}>
                        <td>{task.id}</td>
                        <td>{task.usuario}</td>
                        <td>{task.tarefa}</td>
                        <td>{formatDate(task.dataEntrega)}</td>
                        <td className="actions-column">
                          <button className="edit-button" onClick={() => openEditModal(task)}>
                            <img className="edit-icon" src={EditIcon} alt="Editar" />
                          </button>
                          <button className="delete-button" onClick={() => openDeleteModal(task)}>
                            <img className="delete-icon" src={DeleteIcon} alt="Excluir" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddTaskModal isOpen={openModal === 'add'} onClose={closeModals} onSuccess={loadTasks} />
      <EditTaskModal isOpen={openModal === 'edit'} onClose={closeModals} tarefa={selectedTask} onSuccess={loadTasks} />
      <DeleteModal
        isOpen={openModal === 'delete'}
        onClose={closeModals}
        onConfirm={async () => {
          try {
            if (selectedTask) {
              await axios.delete(`http://localhost:3000/tarefa/${selectedTask.id}`);
              loadTasks();
              closeModals();
            }
          } catch (error) {
            console.error("Delete error:", error);
          }
        }}
      />
      </Layout>
    </div>
  );
}

export default Tasks;