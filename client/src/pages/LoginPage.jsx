import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    setUser({ username });
    navigate("/");
  };

  return (
    <div className="h-screen bg-slate-300 flex flex-col justify-center items-center">
      <h1 className="text-4xl mb-4">Enter your name</h1>
      <input
        className="px-4 py-2 mb-4"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button
        className="px-4 py-2 border border-black font-bold rounded-2xl"
        onClick={handleLogin}
      >
        Submit
      </button>
    </div>
  );
}
