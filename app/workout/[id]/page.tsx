import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWorkout } from "@/lib/api";
import WorkoutDetailClient from "@/components/WorkoutDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const workout = await getWorkout(id);
  if (!workout) return { title: "Workout not found | FitLog" };
  return { title: `${workout.name} | FitLog`, description: workout.description };
}

export default async function WorkoutDetailPage({ params }: PageProps) {
  const { id } = await params;
  const workout = await getWorkout(id);
  if (!workout) notFound();
  return <WorkoutDetailClient w={workout} />;
}