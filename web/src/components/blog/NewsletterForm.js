import { useState } from "react";
import { toast } from "react-toastify";
import { Mail } from "lucide-react";
import { subscribeNewsletter } from "../../api/newsletter";
import Button from "../ui/Button";

export default function NewsletterForm({ className = "" }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await subscribeNewsletter(email);
      toast.success("You're subscribed! Welcome to DevAtlas.");
      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex w-full max-w-md flex-col gap-3 sm:flex-row ${className}`}>
      <div className="relative flex-1">
        <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-full border border-slate-300 bg-white py-2.5 pl-11 pr-4 text-sm text-ink-primary outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-ink-invert"
        />
      </div>
      <Button type="submit" disabled={submitting}>
        {submitting ? "Subscribing..." : "Subscribe"}
      </Button>
    </form>
  );
}
