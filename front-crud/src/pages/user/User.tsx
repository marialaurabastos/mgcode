import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../services/api';
import "./user.css";
import EditIcon from "../../assets/pencil.png";
import DeleteIcon from "../../assets/bin.png";
import Layout from "../../layout/Layout";
import AddUserModal from "../../components/add-user/mod-add-user";
import EditUserModal from "../../components/edit-user/mod-edit-user";
import DeleteModal from "../../components/delete/mod-delete";

export interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
}

function User() {
  const [openModal, setOpenModal] = useState<'add' | 'edit' | 'delete' | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [search, setSearch] = useState<string>("");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("@App:token");
    localStorage.removeItem("@App:user");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("@App:token");
    if (!token) {
      navigate("/login");
      return;
    }
    loadUsers();
  }, [navigate]);

  const loadUsers = async () => {
    try {
      const response = await api.get('/user');
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  };

  const openAddModal = () => setOpenModal('add');
  const openDeleteModal = (name: UserData) => {
    setSelectedUser(name);
    setOpenModal('delete');
  };
  const openEditModal = (name: UserData) => {
    setSelectedUser(name);
    setOpenModal('edit');
  };
  const closeModals = () => {
    setOpenModal(null);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter((name) =>
    name.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="user-container">
      <Layout>
        <div className="user-page">
          <h1>Usuários</h1>
          <div className="user-header">
            <div className="user-search-wrapper">
              <input
                type="text"
                placeholder="Pesquisar usuário..."
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
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Perfil</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {search === "" && users.length === 0 ? (
                  <tr></tr>
                ) : (
                  <>
                    {search !== "" && filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5}>
                          Nenhum usuário encontrado com o termo "{search}".
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((name) => (
                        <tr key={name.id}>
                          <td>{name.id}</td>
                          <td>{name.name}</td>
                          <td>{name.email}</td>
                          <td>{name.role}</td>
                          <td className="actions-column">
                            <button className="edit-button" onClick={() => openEditModal(name)}>
                              <img className="edit-icon" src={EditIcon} alt="Editar" />
                            </button>
                            <button className="delete-button" onClick={() => openDeleteModal(name)}>
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

        <AddUserModal isOpen={openModal === 'add'} onClose={closeModals} onUserAdded={loadUsers} />
        <EditUserModal isOpen={openModal === 'edit'} onClose={closeModals} name={selectedUser} onUserUpdate={loadUsers} />
        <DeleteModal
          isOpen={openModal === 'delete'}
          onClose={closeModals}
          onConfirm={async () => {
            try {
              if (selectedUser) {

                await api.delete(`/user/${selectedUser.id}`);

                const loggedUser = localStorage.getItem("@App:userId");

                if (selectedUser.id.toString() === loggedUser) {
                  handleLogout();
                } else {
                  loadUsers();
                  closeModals();
                }
              }
            } catch (error) {
              alert("Erro ao excluir usuário");
            }
          }}
        />
      </Layout>
    </div>
  );
}

export default User;