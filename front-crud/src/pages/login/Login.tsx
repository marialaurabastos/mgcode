import { useState, type SyntheticEvent } from "react";
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import "./login.css"; ''

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  //função para pegar reconhecer user logado
  function parseJwt(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  }

  const handleLogin = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.data && response.data.access_token) {
        const token = response.data.access_token;
        localStorage.setItem("@App:token", token);
        const dados = parseJwt(token)
        const userId = dados.sub;
        const userName = dados.name || "Usuário";
        localStorage.setItem("@App:user", userName);

        if (userId) {
          localStorage.setItem("@App:userId", String(userId));
        }

        alert(`Bem-vindo(a)!`);

        navigate('/tasks');
      } else {
        alert("Erro ao realizar o login");
      }

    } catch (error: any) {
      console.error("Login error", error);
      alert("Email ou senha incorretos");
      }
  };

  return (
    <div className="login-page">
      <div className="login-form-container">
        <h1>Login</h1>
        <form className="login-form" onSubmit={handleLogin}>
          <label>Email*</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Senha*</label>
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