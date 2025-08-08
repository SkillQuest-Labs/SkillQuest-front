import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import { routes } from "@/routes/router.const";

interface ILoginModel {
  username: string;
  password: string;
}

const Login = () => {
  const [data, setData] = useState<ILoginModel>({ username: "", password: "" });
  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = event.target.id;
    const value = event.target.value;
    setData({ ...data, [id]: value });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!data.username || !data.password) {
      alert("Please fill all the fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:1338/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        alert(err.message || "Login failed");
        return;
      }

      const { user } = await response.json();

      // Stocker l'utilisateur dans localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // Redirection vers le dashboard
      navigate(routes.dashboard.path);
    } catch (error) {
      console.error("Login error:", error);
      alert("Une erreur est survenue");
    }
  };

  return (
    <div className="login-container">
      <div className="login-right">
        <form onSubmit={handleFormSubmit}>
          <h3>Skills Quest</h3>
          <label>Email</label>
          <input type="text" placeholder="Email" value={data.username} id="username" onChange={handleInputChange} />
          <label>Mot de Passe</label>
          <input
            type="password"
            placeholder="Password"
            id="password"
            value={data.password}
            onChange={handleInputChange}
          />
          <div className="social">
            <div className="google">
              <i className="fab fa-google"></i> Connexion Google
            </div>
            <div className="github fb">
              <i className="fab fa-github"></i> Connexion GitHub
            </div>
          </div>
          <button>Connexion</button>
          <div className="social">
            <h4>
              <Link to={routes.signUp.path}>Créer un compte</Link>
            </h4>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
