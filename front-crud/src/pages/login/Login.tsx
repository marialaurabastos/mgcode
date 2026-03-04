import { useState, type FormEvent } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./login.css";''

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password
      });

      if (response.data && response.data.user) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("loggedUser", response.data.user.username);
        
        alert(`Bem-vindo(a), ${response.data.user.username}!`);
        navigate('/user');
      } else {
        alert("Erro ao realizar o login");
      }

    } catch (error: any) {
      console.error("Login error", error);
      alert(error.response?.data?.error || "Erro ao conectar com o servidor");
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