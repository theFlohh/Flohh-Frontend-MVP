// import { useState } from "react";
// import API from "../Services/Api";
// import { Link, useNavigate } from "react-router-dom";

// const Signup = () => {
//   const [form, setForm] = useState({ name: "", email: "", password: "", role:"user" });
//   const navigate = useNavigate();

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await API.post("/auth/register", form);
//       navigate("/login");
//     } catch (err) {
//       alert("Signup failed. Please try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-tr from-gray-100 to-white flex items-center justify-center px-4">
//       <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 space-y-6">
//         <div className="text-center">
//           <h2 className="text-3xl font-extrabold text-gray-800">Create Account</h2>
//           <p className="mt-2 text-sm text-gray-500">Join us by filling in the information below</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-gray-700 text-sm font-medium mb-1">Name</label>
//             <input
//               type="text"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               placeholder="Your name"
//               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               placeholder="you@example.com"
//               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//               placeholder="Create a password"
//               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 rounded-lg transition"
//           >
//             Register
//           </button>
//         </form>

//         <div className="text-center text-sm text-gray-500">
//           Already have an account?{" "}
//           <Link to="/login" className="text-indigo-500 hover:underline">
//             Sign in
//           </Link>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;

import { useState } from "react";
import API from "../Services/Api";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role:"user" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear any previous errors
    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      console.log("error is", err);
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-login-stripes">
      <div className="w-full max-w-md glass-card p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white mb-1">Create an Account</h2>
          <p className="mt-2 text-sm text-gray-200">
            Today is a new day. It's your day. You shape it.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm mb-2">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 w-80">
          <div>
            <label className="block text-gray-200 text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full bg-[#2d2346]/60 border-none rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-gray-200 text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Example@email.com"
              className="w-full bg-[#2d2346]/60 border-none rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-gray-200 text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="at least 8 characters"
              className="w-full bg-[#2d2346]/60 border-none rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              required
              disabled={isLoading}
            />
          </div>
          <div className="text-xs text-gray-400 mb-1">Term &amp; Conditions Apply.</div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-500 text-white font-semibold py-2 rounded-full transition flex items-center justify-center shadow-lg"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing Up...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="flex items-center my-2">
          <div className="flex-grow h-px bg-gray-600 opacity-40"></div>
          <span className="mx-3 text-gray-400 text-xs">Or Register With</span>
          <div className="flex-grow h-px bg-gray-600 opacity-40"></div>
        </div>

        <div className="space-y-3 w-80">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-full border border-white/20 transition"
            disabled
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-full border border-white/20 transition"
            disabled
          >
            <img src="https://www.svgrepo.com/show/448234/facebook.svg" alt="Facebook" className="w-5 h-5" />
            Sign in with Facebook
          </button>
        </div>

        <div className="text-center text-sm text-gray-300 mt-2">
          Do you have an account?{" "}
          <Link to="/login" className="text-purple-300 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
