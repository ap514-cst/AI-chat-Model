import { useState } from "react";

export default function Login({ onLogin }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      alert("Email and Password cannot be empty!");
      return;
    }

    const userData = {
      email,
      loggedIn: true
    };

    // Save data in localStorage
    localStorage.setItem("user", JSON.stringify(userData));

    onLogin(); // redirect to App
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-zinc-200 dark:bg-zinc-900">
      <div className="bg-white dark:bg-zinc-800 shadow-lg p-10 rounded-xl w-80">

        <h2 className="text-2xl font-bold text-center mb-5 dark:text-white">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg border dark:bg-zinc-700 dark:text-white"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg border dark:bg-zinc-700 dark:text-white"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </form>

      </div>
    </div>
  );
}
