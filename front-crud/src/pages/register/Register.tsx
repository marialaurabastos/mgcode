import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../services/api';
import "./register.css";

function Register() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.post("http://localhost:3000/user", {
        name: name,
        email: email,
        role: "common",
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
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
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