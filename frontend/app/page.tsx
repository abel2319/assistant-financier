"use client";
import Image from "next/image";
import QuestionForm from "../components/QuestionForm";
import logo from "../public/logo.png"; 
import '@/styles/globals.css'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="flex flex- items-center space-x-3 mb-6">
        <Image src={logo} alt="Logo SP IA" width={50} height={50} />
        <h1 className="text-3xl font-bold text-gray-800">Votre Assistant Sereine et Prospère</h1>
      </div>

      <div className="content items-center justify-center flex flex-col w-full max-w-4xl">
        <div className="max-w-2xl text-center mb-10 rounded-xl p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Bienvenue 👋
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Cet assistant a été conçu pour vous aider à{" "}
            <strong>structurer vos finances personnelles</strong> et atteindre vos
            objectifs d’épargne sereinement 💰.  
            <br />
            En quelques questions simples, il analysera votre profil financier,
            vos revenus, vos dépenses et vos dettes pour vous proposer un{" "}
            <strong>plan de gestion personnalisé</strong> sur plusieurs mois.
          </p>
          <p className="mt-3 text-gray-500 text-sm">
            Vous pouvez également joindre un fichier Word ou Excel contenant
            davantage de détails sur votre situation.
          </p>
        </div>

        <div className="w-full max-w-lg bg-white text-gray-800 rounded-lg shadow-md p-6 sm:p-8">
          <QuestionForm />
        </div>
      </div>
      
    </main>
  );
}
