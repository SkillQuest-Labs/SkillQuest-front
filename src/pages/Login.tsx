import React, { useState } from "react";
import { Mail, Lock, Github, Eye, EyeOff } from "lucide-react";

interface FormData {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    // Simulation d'une requête d'inscription
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Form submitted:", formData);
    setIsLoading(false);
  };

  const handleGithubLogin = () => {
    console.log("GitHub login clicked");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">
      {/* Colonnes décoratives en arrière-plan */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-1/4 top-0 w-16 h-full bg-gradient-to-b from-gray-600 to-gray-800 transform rotate-1"></div>
        <div className="absolute left-1/2 top-0 w-20 h-full bg-gradient-to-b from-gray-500 to-gray-700 transform -rotate-1"></div>
        <div className="absolute right-1/4 top-0 w-16 h-full bg-gradient-to-b from-gray-600 to-gray-800 transform rotate-1"></div>
      </div>

      {/* Effets de particules */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gray-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Formulaire principal */}
      <div className="relative z-10 w-full max-w-md p-8">
        <div className="bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-gray-900 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="hello@email.com"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Votre mot de passe"
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300 transition-colors" />
                  )}
                </div>
              </div>
            </div>

            {/* Bouton d'inscription */}
            <div
              onClick={handleSubmit}
              className="w-full bg-white text-gray-900 font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-center"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                  Inscription...
                </div>
              ) : (
                "S'inscrire"
              )}
            </div>

            {/* Lien de connexion */}
            <div className="text-center">
              <p className="text-sm text-gray-400">
                Déjà un compte ?{" "}
                <div className="text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer">
                  Se connecter
                </div>
              </p>
            </div>

            {/* Séparateur */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">OU</span>
              </div>
            </div>

            {/* Bouton GitHub */}
            <div
              onClick={handleGithubLogin}
              className="w-full bg-gray-700 text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 flex items-center justify-center cursor-pointer"
            >
              <Github className="h-5 w-5 mr-2" />
              Continuer avec GitHub
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
