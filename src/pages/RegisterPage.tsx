import { useState } from "react";
import { register } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await register(form);
      toast.success("Registration successful, please login! :)");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.message || "Failed to register :(");
    }
  }

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <div className="min-h-screen min-w-screen flex bg-[#F8F8F8] font-sans">
      {/* SISI KIRI: PANEL BRANDING (Sama dengan Login) */}
      <div className="hidden lg:flex w-1/2 p-10">
        <div className="bg-[#FEF3C7] w-full rounded-[40px] p-12 flex flex-col justify-between relative overflow-hidden">
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

      {/* SISI KANAN: FORM REGISTER */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-112.5">
          <h2 className="text-[32px] font-black text-black mb-2">Create Account.</h2>
          <p className="text-gray-500 mb-8 font-medium">Join us to start booking your space.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Grid untuk First Name & Last Name agar rapi sampingan */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className="w-full px-6 py-4 bg-white border-none rounded-2xl shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[#FEF3C7] outline-none transition-all"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className="w-full px-6 py-4 bg-white border-none rounded-2xl shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[#FEF3C7] outline-none transition-all"
              />
            </div>

            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
              className="w-full px-6 py-4 bg-white border-none rounded-2xl shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[#FEF3C7] outline-none transition-all"
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="w-full px-6 py-4 bg-white border-none rounded-2xl shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[#FEF3C7] outline-none transition-all"
            />

            <button
              type="submit"
              className="w-full bg-[#FEF3C7]! text-black font-black py-4 rounded-2xl mt-4 hover:bg-[#fde68a] active:scale-[0.98] transition-all shadow-sm text-lg"
            >
              Register
            </button>
          </form>

          <p className="text-center mt-8 text-gray-500 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-black font-bold no-underline hover:underline">
              Login now
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}