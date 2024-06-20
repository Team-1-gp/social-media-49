import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({ username });
    localStorage.username = username;
    navigate("/");
  };

  return (
    <div className="h-screen bg-[url('/cover.jpeg')] bg-contain flex flex-col justify-center items-center">
      {/* <img src="/cover.jpeg" alt="" /> */}
      <div className="bg-white p-10 rounded-lg">
        <h1 className="text-4xl font-bold mb-8 text-center">Login</h1>
        <form onSubmit={handleLogin}>
          <input
            className="px-4 py-2 mb-4 w-full border border-black rounded-lg"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <div className="text-center">
            <button
              className="px-4 py-2 hover:bg-primary hover:text-white border border-black font-bold rounded-lg"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
