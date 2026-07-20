import { Link } from "react-router-dom";
import { BookOpen, Rocket, Users2 } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import ContactInfo from "../components/blog/ContactInfo";
import Reveal from "../components/motion/Reveal";

const VALUES = [
  {
    icon: BookOpen,
    title: "Learn",
    description: "In-depth articles on frontend, backend, AI, cloud, and DevOps — written by practitioners.",
  },
  {
    icon: Rocket,
    title: "Build",
    description: "Practical, hands-on knowledge you can apply to real projects, not just theory.",
  },
  {
    icon: Users2,
    title: "Share",
    description: "A place for developers of every background to publish what they've learned.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="text-center">
        <h1 className="font-heading text-3xl font-extrabold text-ink-primary dark:text-ink-invert sm:text-4xl">
          About DevAtlas
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-secondary dark:text-slate-400">
          DevAtlas is a modern knowledge hub built for developers, engineers, and technology
          enthusiasts — a place to explore ideas, build real skills, and share what you know with
          the community.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {VALUES.map(({ icon: Icon, title, description }, index) => (
          <Reveal key={title} delay={index * 0.1}>
            <Card className="p-6 text-center transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-ink-primary dark:text-ink-invert">
                {title}
              </h3>
              <p className="mt-2 text-sm text-ink-secondary dark:text-slate-400">{description}</p>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16 text-center">
        <h2 className="font-heading text-2xl font-bold text-ink-primary dark:text-ink-invert">
          Have something worth sharing?
        </h2>
        <p className="mt-2 text-ink-secondary dark:text-slate-400">
          Create an account and publish your first article in minutes.
        </p>
        <div className="mt-6">
          <Button as={Link} to="/register" size="lg">
            Get started
          </Button>
        </div>
      </Reveal>

      <Reveal>
        <Card className="mx-auto mt-16 max-w-md p-8">
          <h2 className="mb-6 text-center font-heading text-lg font-semibold text-ink-primary dark:text-ink-invert">
            Contact
          </h2>
          <ContactInfo />
        </Card>
      </Reveal>
    </div>
  );
}
