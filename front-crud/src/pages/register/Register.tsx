import { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../services/api';
import "./register.css";

function Register() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleRegister = async (e: SyntheticEvent) => {
    e.preventDefault();

    const temArroba = email.includes("@");
    const temPonto = email.split("@")[1]?.includes(".");

    if (!temArroba || !temPonto) {
      alert("E-mail inválido! Certifique-se de usar '@' e '.' (ex: teste@gmail.com)");
      return;
    }

    if (password.length < 6) {
      alert("A senha precisa ter no mínimo 6 caracteres")
      return;
    }
    try {
      await api.post("http://localhost:3000/user", {
        name: name,
        email: email,
        role: role,
        password: password
      });

      alert("Cadastro realizado com sucesso!");
      navigate("/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      alert(error.response?.data?.error || "Erro ao realizar o cadastro");
    }
  };

  return (
    <div className="register-page">
      <div className="register-form-container">
        <h1>Cadastro</h1>
        <form className="register-form" onSubmit={handleRegister}>
          <label>Nome *</label>
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label>Email*</label>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Tipo do perfil *</label>
          <select
            name="role"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Selecione</option>
            <option value="administrador">Administrador</option>
            <option value="usuario">Usuário</option>
            <option value="comum">Comum</option>
          </select>
          <label>Senha*</label>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">CADASTRAR</button>
        </form>

        <div className="login-link-container">
          <p>Já tem uma conta?</p>
          <div className="login-button-wrapper">
            <button onClick={() => navigate("/login")}>Faça login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;