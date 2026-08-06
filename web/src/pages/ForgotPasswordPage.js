import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotPassword } from "../api/auth";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { LogoMark } from "../components/layout/Logo";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", new_password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await forgotPassword(form);
      toast.success("Password updated! You can now log in.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <div className="mb-8 text-center">
        <LogoMark size={64} className="mx-auto mb-4" />
        <h1 className="font-heading text-2xl font-extrabold text-ink-primary dark:text-ink-invert">
          Reset your password
        </h1>
        <p className="mt-2 text-sm text-ink-secondary dark:text-slate-400">
          Enter your email and choose a new password.
        </p>
      </div>

      <Card className="animate-slide-up p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="New password"
            type="password"
            required
            minLength={6}
            value={form.new_password}
            onChange={(e) => setForm({ ...form, new_password: e.target.value })}
          />
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Updating..." : "Update password"}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-ink-secondary dark:text-slate-400">
        Remembered it?{" "}
        <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
          Log in
        </Link>
      </p>
    </div>
  );
}
