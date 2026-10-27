
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  validateEmail,
  validateUsername,
  validatePassword,
  validateFullName,
} from "../utils/validation";

export default function RegisterPage() {
  const { register, checkUsername, checkEmail } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({});
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  useEffect(() => {
  const username = form.username.trim();

  // Username format ശരിയല്ലെങ്കിൽ API check വേണ്ട
  if (!validateUsername(username)) {
    setUsernameTaken(false);
    setCheckingUsername(false);
    return;
  }

  // User typing നിർത്തിയ ശേഷം check ചെയ്യുക
  const timer = setTimeout(async () => {
    setCheckingUsername(true);

    try {
      const exists = await checkUsername(username);
      setUsernameTaken(exists);
    } catch (error) {
      console.error("Username check failed:", error);
    } finally {
      setCheckingUsername(false);
    }
  }, 500);

  return () => clearTimeout(timer);
}, [form.username]);

useEffect(() => {
  const email = form.email.trim().toLowerCase();

  // Email format ശരിയല്ലെങ്കിൽ API check വേണ്ട
  if (!validateEmail(email)) {
    setEmailTaken(false);
    setCheckingEmail(false);
    return;
  }

  // Typing നിർത്തിയ ശേഷം email പരിശോധിക്കുക
  const timer = setTimeout(async () => {
    setCheckingEmail(true);

    try {
      const exists = await checkEmail(email);
      setEmailTaken(exists);
    } catch (error) {
      console.error("Email check failed:", error);
    } finally {
      setCheckingEmail(false);
    }
  }, 500);

  return () => clearTimeout(timer);
}, [form.email]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");

    if (name === "username") {
      setUsernameTaken(false);
    }
  }

  function handleBlur(e) {
    setTouched((prev) => ({
      ...prev,
      [e.target.name]: true,
    }));
  }

  const errors = {
    fullName: validateFullName(form.fullName)
      ? ""
      : "Name must have at least 2 characters",

    username: validateUsername(form.username)
      ? usernameTaken
        ? "Username already exists"
        : ""
      : "Username must be 3–20 characters (letters, numbers, _)",

    email: validateEmail(form.email)
      ? ""
      : "Enter a valid email address",

    password: validatePassword(form.password)
      ? ""
      : "Password must have at least 8 characters",
  };

//   function inputClass(name) {
//     const value = form[name];

//     if (!touched[name] || !value) {
//       return "border-slate-300 focus:border-blue-500";
//     }

//     return errors[name]
//       ? "border-red-500 focus:border-red-500"
//       : "border-green-500 focus:border-green-500";
//   }
function inputClass(name) {
  const value = form[name];

  if (!value) {
    return "border-slate-300";
  }

  return errors[name]
    ? "border-red-500"
    : "border-green-500";
}

  async function handleSubmit(e) {
    e.preventDefault();

    setTouched({
      fullName: true,
      username: true,
      email: true,
      password: true,
    });

    const invalid = Object.values(errors).some(Boolean);

    if (invalid) return;

    if (usernameTaken || emailTaken) {
  setError("Please use a different username and email.");
  return;
}

    setLoading(true);
    setError("");

    try {
      await register({
        fullName: form.fullName.trim(),
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      navigate("/login", {
        replace: true,
        state: {
          message: "Registration successful. Please login.",
        },
      });
    } catch (err) {
      const message = err.message || "Registration failed";
      setError(message);

      if (message.toLowerCase().includes("username")) {
        setUsernameTaken(true);
        setTouched((prev) => ({ ...prev, username: true }));
      }
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
        <h1 className="text-center text-3xl font-bold">
          Create Account
        </h1>

        {error && (
          <p className="rounded-lg bg-red-100 p-3 text-red-700">
            {error}
          </p>
        )}

        {[
          { name: "fullName", label: "Full Name", type: "text" },
          { name: "username", label: "Username", type: "text" },
          { name: "email", label: "Email", type: "email" },
          { name: "password", label: "Password", type: "password" },
        ].map((field) => (
          <div key={field.name}>
            <label className="mb-1 block text-sm font-medium">
              {field.label}
            </label>

            <input
              name={field.name}
              type={field.type}
              value={form[field.name]}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`w-full rounded-lg border p-3 outline-none ${inputClass(field.name)}`}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />

             {touched[field.name] && errors[field.name] && (
              <p className="mt-1 text-sm text-red-600">
                {errors[field.name]}
              </p>
            )}

            {touched[field.name] &&
              form[field.name] &&
              !errors[field.name] && 
               field.name !== "username" &&(
                <p className="mt-1 text-sm text-green-600">
                  ✓ Valid {field.label.toLowerCase()}
                </p>
              )} 

              {field.name === "username" && (
  <>
    {checkingUsername && (
      <p className="mt-1 text-sm text-slate-500">
        Checking username...
      </p>
    )}

    {!checkingUsername && usernameTaken && (
      <p className="mt-1 text-sm text-red-600">
        Username already exists
      </p>
    )}

    {!checkingUsername &&
      form.username.trim() &&
      validateUsername(form.username) &&
      !usernameTaken && (
        <p className="mt-1 text-sm text-green-600">
          ✓ Username available
        </p>
      )}
  </>
)}

{field.name === "email" && (
  <>
    {checkingEmail && (
      <p className="mt-1 text-sm text-slate-500">
        Checking email...
      </p>
    )}

    {!checkingEmail && emailTaken && (
      <p className="mt-1 text-sm text-red-600">
        Email already registered
      </p>
    )}

    {!checkingEmail &&
      validateEmail(form.email) &&
      !emailTaken && (
        <p className="mt-1 text-sm text-green-600">
          ✓ Email available
        </p>
      )}
  </>
)}
          </div>
        ))}

        <button
          type="submit"
          disabled={
          loading ||
          checkingUsername ||
          checkingEmail ||
          usernameTaken ||
          emailTaken
          }
          className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}
