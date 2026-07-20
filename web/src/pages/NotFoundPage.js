import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import Button from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
        <Compass className="h-8 w-8" />
      </div>
      <h1 className="font-heading text-4xl font-extrabold text-ink-primary dark:text-ink-invert">404</h1>
      <p className="mt-2 text-ink-secondary dark:text-slate-400">
        This page seems to have wandered off the map.
      </p>
      <Button as={Link} to="/" className="mt-6">
        Back to home
      </Button>
    </div>
  );
}
