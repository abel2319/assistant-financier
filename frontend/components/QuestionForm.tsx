"use client";
import { useState } from "react";

export default function QuestionForm() {
  const [formData, setFormData] = useState({
    net: "",
    net_other: "",
    depenses_fixes: "",
    depenses_variables: "",
    objectif_epargne: "",
    dettes: "",
    informations_sup: "",
    file: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState(true);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });
  //const handleFile = (e: any) => setFormData({ ...formData, file: e.target.files[0] });
  
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFormData({ ...formData, file: selectedFile });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  if (!file) return;

  const formDataToSend = new FormData();
  formDataToSend.append(
    "data",
    JSON.stringify({
      net: formData.net,
      net_other: formData.net_other,
      depenses_fixes: formData.depenses_fixes,
      depenses_variables: formData.depenses_variables,
      objectif_epargne: formData.objectif_epargne,
      dettes: formData.dettes,
      informations_sup: formData.informations_sup,
    })
  );
  formDataToSend.append("file", file);

  try {
    const response = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      body: formDataToSend,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    const result = await response.json();
    console.log(result);
    setFileUrl(result.file_url);
    
  } catch (error) {
    console.error("Erreur :", error);
    setCheck(false);
  } finally {
    setLoading(false);
    
    setFormData({
      net: "",
      net_other: "",
      depenses_fixes: "",
      depenses_variables: "",
      objectif_epargne: "",
      dettes: "",
      informations_sup: "",
      file: null as File | null
    });
    setFile(null); 
  }
};

  return (
    <form onSubmit={handleSubmit} className="formulaire space-y-6">
      <div>
        <label className="block font-medium mb-1">Revenu net mensuel 💰 € (votre salaire net mensuel)</label>
        <input name="net" className="w-full border p-2 rounded" onChange={handleChange} value={formData.net} required />
      </div>

      <div>
        <label className="block font-medium mb-1">Autres revenus € (si vous avez d'autres rentrées d'argent, combien gagnezvous ?)</label>
        <input name="net_other" className="w-full border p-2 rounded" onChange={handleChange}  value={formData.net_other}/>
      </div>

      <div>
        <label className="block font-medium mb-1">Dépenses fixes 💡 € (Ex: loyer, charges, ... Les dépenses que vous ferez toujours chaque mois)</label>
        <input name="depenses_fixes" className="w-full border p-2 rounded"  value={formData.depenses_fixes} onChange={handleChange} required />
      </div>

      <div>
        <label className="block font-medium mb-1">Dépenses variables € 📊 (Ex: don, aide, ...)</label>
        <input name="depenses_variables" className="w-full border p-2 rounded"  value={formData.depenses_variables} onChange={handleChange} />
      </div>

      <div>
        <label className="block font-medium mb-1">Objectif d’épargne € (Combien souhaitez vous épargner ?) 🎯</label>
        <input name="objectif_epargne" className="w-full border p-2 rounded" value={formData.objectif_epargne} onChange={handleChange} required />
      </div>

      <div>
        <label className="block font-medium mb-1">Dettes € 💳 (À combien s'élèvent vos dettes ?)</label>
        <input name="dettes" className="w-full border p-2 rounded" value={formData.dettes} onChange={handleChange} />
      </div>

      <div>
        <label className="block font-medium mb-1">Informations supplémentaires 🧾 (Souhaitez-vous apporter des informations supplémentaires ?)</label>
        <textarea name="informations_sup" className="w-full border p-2 rounded" value={formData.informations_sup} rows={3} onChange={handleChange} />
      </div>

    <div className="flex items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
      >
        {file ? (
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-gray-700">{file.name}</p>
            <p className="text-xs text-gray-400 mt-1">Cliquez pour changer de fichier</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-6 pb-6">
            <svg
              className="w-10 h-10 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Vous pouvez ajouter un fichier. </span> Cliquez ici
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Word (.docx) ou Excel (.xlsx) (MAX. 2 Mo)
            </p>
          </div>
        )}
        <input id="dropzone-file" type="file" className="hidden" onChange={handleFile} />
      </label>
    </div>



      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 rounded w-full transition text-white 
          ${loading ? "bg-blue-700 cursor-not-allowed" : "bg-[#eba21d] hover:bg-[#d18e19]"}`}
      >
        {loading ? (
          <span>
            Analyse en cours <span className="loading-dots"></span>
          </span>
        ) : (
          "Analyser"
        )}
      </button>

      {check ? ( ( fileUrl &&
        <p className="mt-4 text-center">
          ✅ Plan généré :{" "}
          <a href={fileUrl} className="text-blue-600 underline" target="_blank">
            Télécharger le fichier
          </a>
        </p>)
        ) : (
        <p className="mt-4 text-center ">
          ⚠️ Aucun plan généré pour le moment. Rééssayez plus tard. 
        </p>)
      }
    </form>
  );
}
