import { useState } from "react";
import { toast } from "react-toastify";
import { submitContactMessage } from "../api/contact";
import ContactInfo from "../components/blog/ContactInfo";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";

const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export default function ContactPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Please enter your name.";
    if (!EMAIL_REGEX.test(form.email)) nextErrors.email = "Please enter a valid email address.";
    if (!form.subject.trim()) nextErrors.subject = "Please enter a subject.";
    if (!form.message.trim()) nextErrors.message = "Please enter a message.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await submitContactMessage(form);
      toast.success("Your message has been sent! We'll get back to you soon.");
      setForm(EMPTY_FORM);
      setErrors({});
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-12 text-center">
        <h1 className="font-heading text-3xl font-extrabold text-ink-primary dark:text-ink-invert sm:text-4xl">
          Get in Touch
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-secondary dark:text-slate-400">
          Questions, feedback, or ideas for DevAtlas? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.4fr]">
        <Card className="animate-slide-up p-8">
          <h2 className="mb-6 font-heading text-lg font-semibold text-ink-primary dark:text-ink-invert">
            Contact Information
          </h2>
          <ContactInfo />
        </Card>

        <Card className="animate-slide-up p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input
                label="Name"
                value={form.name}
                error={errors.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                error={errors.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <Input
              label="Subject"
              value={form.subject}
              error={errors.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
            <Textarea
              label="Message"
              rows={6}
              value={form.message}
              error={errors.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
