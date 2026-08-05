import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { LogoMark } from "../components/layout/Logo";

const INITIAL_FORM = {
  username: "",
  email: "",
  name: "",
  password: "",
  phone_number: "",
  sex: "MALE",
};

function formatBirthDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}-${month}-${date.getFullYear()}`;
}

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [birthDate, setBirthDate] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!birthDate) {
      toast.error("Please select your date of birth.");
      return;
    }
    setSubmitting(true);
    try {
      await register({ ...form, birth: formatBirthDate(birthDate) });
      toast.success("Account created! You can now log in.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-16">
      <div className="mb-8 text-center">
        <LogoMark size={48} className="mx-auto mb-4" />
        <h1 className="font-heading text-2xl font-extrabold text-ink-primary dark:text-ink-invert">
          Join DevAtlas
        </h1>
        <p className="mt-2 text-sm text-ink-secondary dark:text-slate-400">
          Create an account to read, write, and share knowledge.
        </p>
      </div>

      <Card className="animate-slide-up p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Full name" required value={form.name} onChange={handleChange("name")} />
          <Input label="Username" required value={form.username} onChange={handleChange("username")} />
          <Input label="Email" type="email" required value={form.email} onChange={handleChange("email")} />
          <Input
            label="Password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={handleChange("password")}
          />
          <Input
            label="Phone number"
            required
            placeholder="0917-1234-5678"
            value={form.phone_number}
            onChange={handleChange("phone_number")}
          />
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-secondary dark:text-slate-300">
                Date of birth
              </span>
              <DatePicker
                selected={birthDate}
                onChange={setBirthDate}
                dateFormat="dd-MM-yyyy"
                showYearDropdown
                dropdownMode="select"
                maxDate={new Date()}
                placeholderText="Select date"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-ink-primary outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-ink-invert"
                portalId="datepicker-portal"
                withPortal
                required
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-secondary dark:text-slate-300">
                Sex
              </span>
              <select
                value={form.sex}
                onChange={handleChange("sex")}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-ink-primary outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-ink-invert"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </label>
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-ink-secondary dark:text-slate-400">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
          Log in
        </Link>
      </p>
    </div>
  );
}
