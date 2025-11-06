"use client";
import QuestionForm from "../components/QuestionForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Assistant Financier IA</h1>
      <QuestionForm />
    </main>
  );
}
