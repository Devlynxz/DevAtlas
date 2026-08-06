import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { LogoMark } from "../components/layout/Logo";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(form.username, form.password);
      toast.success("Welcome back!");
      navigate(location.state?.from?.pathname || "/");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Invalid username or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <div className="mb-8 text-center">
        <LogoMark size={64} className="mx-auto mb-4" />
        <h1 className="font-heading text-2xl font-extrabold text-ink-primary dark:text-ink-invert">
          Welcome back to DevAtlas
        </h1>
        <p className="mt-2 text-sm text-ink-secondary dark:text-slate-400">
          Log in to continue reading and writing.
        </p>
      </div>

      <Card className="animate-slide-up p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Username"
            required
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <div className="text-right">
            <Link to="/forgot-password" className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Logging in..." : "Log in"}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-ink-secondary dark:text-slate-400">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
          Register
        </Link>
      </p>
    </div>
  );
}
