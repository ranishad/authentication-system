import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900">
            My Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </header>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-lg sm:p-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <img
              src={
                user?.avatar ||
                "https://placehold.co/150x150?text=Profile"
              }
              alt="Profile"
              className="h-24 w-24 rounded-full border-4 border-blue-100 object-cover"
            />

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">
                Welcome, {user?.fullName}!
              </h2>
              <p className="text-slate-500">@{user?.username}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Full Name</p>
              <p className="mt-1 font-semibold">{user?.fullName}</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Username</p>
              <p className="mt-1 font-semibold">{user?.username}</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Email</p>
              <p className="mt-1 break-all font-semibold">{user?.email}</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Member Since</p>
              <p className="mt-1 font-semibold">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Not available"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}