import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// We strictly follow the rule: create instance right before call if key might change, 
// but here we assume env key is static for the session or handled via a context if dynamic.
// For this demo, we initialize it here but catch errors if key is missing.

const getAIClient = () => {
  const apiKey = process.env.API_KEY || '';
  if (!apiKey) {
    console.warn("API_KEY is missing. AI features will return mock responses.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeSymptoms = async (symptoms: string, patientData: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "AI Service Unavailable: Please configure API Key.";

  try {
    const prompt = `
      Act as a senior medical diagnostic assistant.
      Patient Data: ${patientData}
      Current Symptoms: ${symptoms}
      
      Provide a concise potential diagnosis, recommended tests, and immediate advice. 
      Format the response in clear HTML sections (using tags like <strong>, <ul>, <li>) but return it as a string.
      Keep it professional but concise.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No analysis could be generated.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Error generating diagnosis. Please check system logs.";
  }
};

export const predictStockShortage = async (inventoryList: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "AI Service Unavailable.";

  try {
    const prompt = `
      Analyze this pharmacy inventory list and predict which items are at risk of running out based on typical hospital usage patterns.
      Inventory: ${inventoryList}
      
      Return a JSON array of objects with properties: "medicineName", "riskLevel" (High/Medium), and "reason".
      Only return valid JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    return response.text || "[]";
  } catch (error) {
    console.error("AI Stock Error:", error);
    return "[]";
  }
};

export const generateSmartSchedule = async (doctors: string, pendingAppointments: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "AI Service Unavailable.";

  try {
    const prompt = `
      Optimize the daily schedule.
      Doctors Available: ${doctors}
      Pending Appointments: ${pendingAppointments}
      
      Assign patients to doctors to minimize wait time. Return a summary text of the optimized schedule.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Scheduling optimization failed.";
  } catch (e) {
    return "Error in scheduling AI.";
  }
};
