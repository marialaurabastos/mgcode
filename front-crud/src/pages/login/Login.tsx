import { useState, type FormEvent } from "react";
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import "./login.css"; ''

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.data && response.data.access_token) {
        localStorage.setItem("@App:token", response.data.access_token);

        const user = response.data.user;
        const userName = user?.name || "Usuário";
        const userId = user?.id || null;

        localStorage.setItem("@App:user", userName);

        if (userId) {
          localStorage.setItem("@App:userId", String(userId));
        }

        alert(`Bem-vindo(a), ${userName}!`);

        navigate('/tasks');
      } else {
        alert("Erro ao realizar o login");
      }

    } catch (error: any) {
      console.error("Login error", error);
      const message = error.response?.data?.message || "Erro ao conectar com o servidor";
      alert(message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-form-container">
        <h1>Login</h1>
        <form className="login-form" onSubmit={handleLogin}>
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

          <button type="submit">ENTRAR</button>
        </form>
        <div className="register-link-container">
          <p>Não tem uma conta?</p>
          <div className="register-button-wrapper">
            <button onClick={() => navigate("/register")}>Cadastre-se</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;