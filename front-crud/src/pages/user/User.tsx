import { useState, useEffect } from "react";
import api from '../../services/api';
import "./user.css";
import EditIcon from "../../assets/pencil.png";
import DeleteIcon from "../../assets/bin.png";
import Layout from "../../layout/Layout";
import AddUserModal from "../../components/add-user/mod-add-user";
import EditUserModal from "../../components/edit-user/mod-edit-user";
import DeleteModal from "../../components/delete/mod-delete";

interface User {
  id: number;
  usuario: string;
  email: string;
  perfil: string;
}

function User() {
  const [openModal, setOpenModal] = useState<'add' | 'edit' | 'delete' | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");

  const loadUsers = async () => {
    try {
      const response = await api.get('/usuarios');
      setUsers(response.data);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openAddModal = () => setOpenModal('add');
  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setOpenModal('delete');
  };
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setOpenModal('edit');
  };
  const closeModals = () => {
    setOpenModal(null);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter((user) =>
    user.usuario.toLowerCase().includes(search.toLowerCase())
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
                    filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.usuario}</td>
                        <td>{user.email}</td>
                        <td>{user.perfil}</td>
                        <td className="actions-column">
                          <button className="edit-button" onClick={() => openEditModal(user)}>
                            <img className="edit-icon" src={EditIcon} alt="Editar" />
                          </button>
                          <button className="delete-button" onClick={() => openDeleteModal(user)}>
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
      <EditUserModal isOpen={openModal === 'edit'} onClose={closeModals} usuario={selectedUser} onUserUpdate={loadUsers} />
      <DeleteModal
        isOpen={openModal === 'delete'}
        onClose={closeModals}
        onConfirm={async () => {
          try {
            if (selectedUser) {
              await api.delete(`/usuarios/${selectedUser.id}`);
              loadUsers();
              closeModals();
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