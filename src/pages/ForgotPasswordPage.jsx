import { useState } from "react";
import { Link } from "react-router-dom";
import { checkEmail } from "../services/authApi";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

//   function handleSubmit(e) {
//     e.preventDefault();

//     setMessage(
//       "Password reset instructions would be sent to your email."
//     );
//   }

async function handleSubmit(e) {
  e.preventDefault();

  setMessage("");
  setLoading(true);

  try {
    const exists = await checkEmail(email);

    if (exists) {
      setMessage(
        "Email verified! Password reset can be continued."
      );
    } else {
      setMessage("No account found with this email.");
    }
  } catch (error) {
    setMessage("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
}

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-2xl bg-white p-8 shadow-xl"
      >
        <h1 className="text-center text-2xl font-bold">
          Forgot Password?
        </h1>

        <p className="text-center text-slate-600">
          Enter your email to reset your password.
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
        />

    

        <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
         >
        {loading ? "Checking email..." : "Reset Password"}
        </button>

        {message && (
          <p className="text-center text-sm text-green-600">
            {message}
          </p>
        )}

        <p className="text-center text-sm">
          <Link to="/login" className="text-blue-600">
            Back to Login
          </Link>
        </p>
      </form>
    </main>
  );
}