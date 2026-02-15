import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await login({ username, password });
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("token", res.token);

      toast.success("Login successful! :)");

      if (res.user.role === "Admin") navigate("/dashboard");
      else navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Login failed :(");
    }
  }

  return (
    <div className="min-h-screen min-w-screen flex bg-[#F8F8F8] font-sans">
      {/* SISI KIRI: PANEL BRANDING */}
      <div className="hidden lg:flex p-10 w-1/2">
        <div className="bg-[#FEF3C7] min-w-full rounded-[40px] p-12 flex flex-col justify-between relative overflow-hidden">
          <div>
            <h1 className="text-[44px] font-black text-black mb-2">Spaceific</h1>
            <p className="text-xl font-bold text-black">
              Your Specific Space, Just a Book Away.
            </p>
          </div>

          <div className="max-w-md">
            <p className="text-sm leading-relaxed text-black font-medium text-justify">
              <span className="font-bold">Spaceific:</span> The ultimate campus room booking platform. 
              Discover specific spaces, check availability, and book your next venue in seconds. 
              Your space, specifically tailored.
            </p>
          </div>
        </div>
      </div>

      {/* SISI KANAN: FORM LOGIN */}
      <div className="w-1/2 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-100">
          <h2 className="text-[32px] font-black text-black mb-8">Welcome back.</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-6 py-4 bg-white border-none rounded-2xl shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[#FEF3C7] outline-none transition-all"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-white border-none rounded-2xl shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[#FEF3C7] outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#FEF3C7]! text-black font-black py-4 rounded-2xl mt-4 hover:bg-[#fde68a] active:scale-[0.98] transition-all shadow-sm text-lg"
            >
              Login
            </button>
          </form>

          <p className="text-center mt-8 text-gray-500 font-medium">
            Don't have an account yet?{" "}
            <Link to="/register" className="text-black font-bold no-underline hover:underline">
              Register now
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}