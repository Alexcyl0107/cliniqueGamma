import { GoogleGenAI, Type } from "@google/genai";

export const analyzeSymptoms = async (symptoms: string, patientData: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("Clé API manquante.");
    return "Service IA indisponible : Veuillez configurer la clé API.";
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const prompt = `
      Agis en tant qu'assistant de diagnostic médical senior.
      Données du patient : ${patientData}
      Symptômes actuels : ${symptoms}
      
      Fournis un diagnostic potentiel concis, les tests recommandés et des conseils immédiats. 
      Formate la réponse en sections HTML claires (en utilisant des balises comme <strong>, <ul>, <li>) mais retourne-la sous forme de chaîne de caractères.
      Reste professionnel mais concis. Réponds exclusivement en Français.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    return response.text || "Aucune analyse n'a pu être générée.";
  } catch (error) {
    console.error("Erreur IA:", error);
    return "Erreur lors de la génération du diagnostic. Veuillez consulter les journaux système.";
  }
};

export const predictStockShortage = async (inventoryList: string): Promise<string> => {
  if (!process.env.API_KEY) return "[]";
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const prompt = `
      Analyse cette liste d'inventaire de pharmacie et prédis quels articles risquent d'être en rupture de stock en fonction des modèles d'utilisation hospitalière typiques.
      Inventaire : ${inventoryList}
      
      Retourne un tableau JSON d'objets avec les propriétés : "medicineName" (nom), "riskLevel" (Niveau de risque : Élevé/Moyen), et "reason" (raison en français).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              medicineName: {
                type: Type.STRING,
                description: "Nom du médicament"
              },
              riskLevel: {
                type: Type.STRING,
                description: "Niveau de risque : Élevé ou Moyen"
              },
              reason: {
                type: Type.STRING,
                description: "Raison de la pénurie prédite"
              }
            },
            required: ["medicineName", "riskLevel", "reason"]
          }
        }
      }
    });

    return response.text || "[]";
  } catch (error) {
    console.error("Erreur Stock IA:", error);
    return "[]";
  }
};