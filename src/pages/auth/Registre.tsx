import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "@/routes/router.const";
import "./auth.css";

interface IRegisterModel {
  email: string;
  password: string;
  name: string;
  username: string;
}

const Register = () => {
  const [data, setData] = useState<IRegisterModel>({
    email: "",
    password: "",
    name: "",
    username: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { email, password, name, username } = data;
    if (!email || !password || !name || !username) {
      setError("Merci de remplir tous les champs.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, username }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Erreur lors de l'inscription.");
      }

      // Optionnel : const result = await response.json();
      alert("Inscription réussie !");
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-right">
        <form onSubmit={handleFormSubmit}>
          <h3>Skills Quest</h3>

          {error && <p className="text-red-500">{error}</p>}

          <label>Nom</label>
          <input type="text" placeholder="Nom" id="name" value={data.name} onChange={handleInputChange} />

          <label>Prénom</label>
          <input type="text" placeholder="Prénom" id="username" value={data.username} onChange={handleInputChange} />

          <label>Email</label>
          <input type="email" placeholder="Email" id="email" value={data.email} onChange={handleInputChange} />

          <label>Mot de passe</label>
          <input
            type="password"
            placeholder="Mot de passe"
            id="password"
            value={data.password}
            onChange={handleInputChange}
          />

          <button type="submit">Inscription</button>

          <div className="social">
            <h4>
              <Link to={routes.signIn.path}>Déjà un compte ? Connexion</Link>
            </h4>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
