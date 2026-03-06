import { useState, useEffect } from "react";
import type { Task } from '../../types/task'
import { useNavigate } from "react-router-dom";
import api from '../../services/api';
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

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("@App:token");
    localStorage.removeItem("@App:user");
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("@App:token");
    if (!token) {
      navigate("/login");
      return;
    }
    loadTasks();
  }, [navigate]);

  const loadTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Erro! Provavelmente você não está logado.");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const userName = task.user?.name.toLowerCase() || "";
    const taskTitle = task.title?.toLowerCase() || "";
    const searchTerm = search.toLowerCase();

    return userName.includes(searchTerm) || taskTitle.includes(searchTerm);
  });

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

  const statusLabels: Record<string, string> = {
    pendente: "Pendente",
    em_progresso: "Em Progresso",
    concluida: "Concluída"
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

                <div className='logout-button-wrapper'>
                  <button onClick={handleLogout}>Sair</button>
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
                  <th>Status</th>
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
                        <td colSpan={6}>
                          Nenhuma tarefa encontrada para "{search}".
                        </td>
                      </tr>
                    ) : (
                      filteredTasks.map((task) => (
                        <tr key={task.id}>
                          <td>{task.id}</td>
                          <td>{task.user?.name || ''}</td>
                          <td>{task.title}</td>
                          <td>
                            <span className={`status-badge ${task.status}`}>
                              {statusLabels[task.status] || task.status}
                            </span>
                          </td>
                          <td>{formatDate(task.dueDate)}</td>
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
        <EditTaskModal isOpen={openModal === 'edit'} onClose={closeModals} task={selectedTask} onSuccess={loadTasks} />
        <DeleteModal
          isOpen={openModal === 'delete'}
          onClose={closeModals}
          onConfirm={async () => {
            try {
              if (selectedTask) {
                await api.delete(`/tasks/${selectedTask.id}`);
                loadTasks();
                closeModals();
              }
            } catch (error) {
              console.error("Erro ao deletar tarefa:", error);
            }
          }}
        />
      </Layout>
    </div>
  );
}

export default Tasks;