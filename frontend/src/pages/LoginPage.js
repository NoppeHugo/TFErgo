import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.js";
import Toast, { showSuccessToast, showErrorToast } from "../components/common/Toast.js";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post('/auth/login', {
        email,
        password
      });

      showSuccessToast(setToast, 'Connexion réussie !');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      console.error(err.response?.data || err.message);
      showErrorToast(setToast, "Échec de la connexion. Vérifie tes identifiants.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Connexion à Ergogo
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border p-2 rounded-lg"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              className="w-full border p-2 rounded-lg"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Se connecter
          </button>
        </form>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          onClose={() => setToast(null)}
          type={toast.type}
          persistent={toast.persistent}
        />
      )}
    </div>
  );
}
