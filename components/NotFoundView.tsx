import Link from "next/link";
import { container } from "@/lib/ui";

interface Props { title?: string; text?: string }

export default function NotFoundView({
  title = "Page not found",
  text = "That page doesn't exist. Head back to the library and pick a lift.",
}: Props) {
  return (
    <section className={`${container} flex flex-col items-center py-24 text-center`}>
      <p className="font-display text-8xl font-bold text-accent sm:text-9xl">404</p>
      <h1 className="mt-2 font-display text-3xl font-bold uppercase">{title}</h1>
      <p className="mt-3 max-w-md text-sm text-muted">{text}</p>
      <Link href="/" className="mt-8 rounded-full bg-accent px-6 py-2.5 text-xs font-semibold text-black hover:bg-white">
        Go to workouts
      </Link>
    </section>
  );
}