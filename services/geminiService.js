import Groq from "groq-sdk";
import { AlertSeverity } from "../types";
import { nearbyServices } from "../constants";

// ─── API Key ────────────────────────────────────────────────────────────────
// Set VITE_GROQ_API_KEY in your .env.local file.
// Get a free key at https://console.groq.com/keys
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.error(
    "[Crisis AI] VITE_GROQ_API_KEY is not set. " +
    "Create a .env.local file with: VITE_GROQ_API_KEY=your_key_here"
  );
}

// dangerouslyAllowBrowser is required for client-side Vite apps.
const groq = GROQ_API_KEY
  ? new Groq({ apiKey: GROQ_API_KEY, dangerouslyAllowBrowser: true })
  : null;

const SERVICE_UNAVAILABLE_MSG =
  "AI service is unavailable: VITE_GROQ_API_KEY is not configured. " +
  "Please add it to your .env.local file and restart the dev server.";

function getGroq() {
  if (!groq) throw new Error(SERVICE_UNAVAILABLE_MSG);
  return groq;
}

// Default model — fast and highly capable
const MODEL = "llama-3.3-70b-versatile";

// ─── Helper: call Groq and parse JSON response ───────────────────────────────
async function callJSON(prompt) {
  const completion = await getGroq().chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.4,
  });
  const text = completion.choices[0]?.message?.content || "{}";
  return JSON.parse(text);
}

// ─── Helper: call Groq and return plain text ─────────────────────────────────
async function callText(prompt) {
  const completion = await getGroq().chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
  });
  return completion.choices[0]?.message?.content || "";
}

// ─── Exported Service Functions ──────────────────────────────────────────────

export const assessRiskAndCategorize = async (report) => {
  try {
    const data = await callJSON(
      `Analyze the following disaster report and respond with a JSON object with exactly these fields:
      - "title": A concise title for the alert (e.g., "Structural Collapse Downtown").
      - "summary": A brief one-sentence summary of the event.
      - "disasterType": The disaster category (e.g., "Earthquake", "Flood", "Fire", "Industrial Accident").
      - "severity": Must be exactly one of: "Low", "Medium", "High", "Critical".

      Report: "${report}"`
    );

    const severityValues = Object.values(AlertSeverity);
    if (!severityValues.includes(data.severity)) {
      throw new Error(`Invalid severity returned: ${data.severity}`);
    }
    return data;
  } catch (error) {
    console.error("Error assessing risk:", error);
    throw new Error("Failed to analyze the disaster report with AI.");
  }
};

export const generateActionPlan = async (disasterType, severity) => {
  try {
    return await callText(
      `Generate a concise, step-by-step emergency action plan for a '${disasterType}' of '${severity}' severity. ` +
      `The plan should be a list of 3-5 key actions for first responders. ` +
      `Use plain text only. Format as simple numbered lines (e.g., "1. Do this." then "2. Do that.") ` +
      `without any Markdown or special symbols.`
    );
  } catch (error) {
    console.error("Error generating action plan:", error);
    throw new Error("Failed to generate an action plan.");
  }
};

export const generateEmergencyResponsePlan = async (disasterType, location, severity) => {
  try {
    return await callJSON(
      `Generate an emergency response plan for a ${severity} severity ${disasterType} in ${location}.
      Respond with a JSON object with exactly these fields:
      - "immediateActions": An array of exactly 3 action strings for first responders.
      - "resourceRequirements": An array of specific resource strings (e.g., "3 ambulances", "2 fire trucks").
      - "evacuationRoute": A brief string describing the safest exit path.
      - "publicMessage": A single sentence warning to broadcast to local citizens.`
    );
  } catch (error) {
    console.error("Error generating emergency response plan:", error);
    throw new Error("Failed to generate emergency response plan.");
  }
};

export const translateAlert = async (text, languages) => {
  try {
    return await callJSON(
      `Translate the following alert into these languages: ${languages.join(", ")}.
      Respond with a JSON object where keys are the language names and values are the translations.
      Alert: "${text}"`
    );
  } catch (error) {
    console.error("Error translating alert:", error);
    throw new Error("Failed to translate the alert.");
  }
};

export const generateDetailedAssessment = async (alert) => {
  try {
    return await callText(
      `Provide a detailed risk assessment for the following emergency alert.
      IMPORTANT: The entire response must be in plain text. Do not use Markdown, asterisks, or special symbols.
      Use clear section headings followed by standard paragraphs. Be professional and clear.

      Alert Details:
      - Title: ${alert.title}
      - Type: ${alert.type}
      - Location: ${alert.location}
      - Severity: ${alert.severity}
      - Description: ${alert.description}
      - People Affected: ${alert.affected.toLocaleString()}

      Include these sections:
      1. Risk Analysis: Detailed analysis of the current situation and potential escalations.
      2. Potential Impact: Impact on population, infrastructure, and environment.
      3. Recommended Actions: Immediate, actionable recommendations for response teams.`
    );
  } catch (error) {
    console.error("Error generating detailed assessment:", error);
    throw new Error("Failed to generate a detailed assessment.");
  }
};

// Uses mock data from constants — no AI call needed.
export const findNearbyServices = async (location, serviceType) => {
  console.log(`Searching for ${serviceType} services near ${location}`);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const cityServices = nearbyServices[location];
  if (!cityServices || !cityServices[serviceType]) {
    throw new Error(`No ${serviceType} services data available for ${location}.`);
  }
  return Promise.resolve(cityServices[serviceType]);
};

export const predictDisasterRisk = async (location, environmentalData) => {
  try {
    return await callJSON(
      `Analyze the following location and environmental data to predict disaster risk.
      Location: ${location}
      Environmental Data: ${JSON.stringify(environmentalData)}

      Respond with a JSON object with exactly these fields:
      - "riskLevel": Exactly one of "Low", "Medium", "High", "Critical".
      - "probability": A percentage string (e.g., "85%").
      - "primaryThreat": The most likely disaster type (e.g., "Flash Flood", "Wildfire").
      - "keyRiskFactors": An array of reason strings (e.g., ["Soil saturation at 90%"]).`
    );
  } catch (error) {
    console.error("Error predicting disaster risk:", error);
    throw new Error("Failed to predict disaster risk.");
  }
};

export const getProactiveNationalRisk = async (country) => {
  try {
    return await callJSON(
      `Act as a disaster risk scientist for ${country}. Generate a pre-emptive predictive report
      based on historical patterns and seasonal environmental trends.

      Respond with a JSON object with exactly these fields:
      - "currentRiskLevel": An integer from 1 to 10.
      - "highRiskStates": An array of objects, each with "state" (string) and "primaryThreat" (string).
      - "predictedTimeline": An array of 7 objects each with "day" (1-7), "date" (e.g., "Tomorrow"),
        "probability" (0-100 integer), "description" (string).
      - "commandLevel": A string with recommendations for state or national alert levels.`
    );
  } catch (error) {
    console.error("Error generating national risk report:", error);
    throw new Error("Failed to generate national intelligence report.");
  }
};

export const analyzeSocialRadar = async (location) => {
  try {
    return await callJSON(
      `Act as a social media early warning radar. Simulate scanning X (Twitter), Facebook, and local
      forums for disaster keywords ("flood", "building collapse", "fire", "earthquake") near ${location}
      in the last 2 hours. Filter out figurative uses (e.g., "I'm on fire today!").

      Respond with a JSON object with exactly these fields:
      - "overallStatus": A brief status string like "Elevated Chatter", "Quiet", or "Critical Alerts".
      - "flaggedPosts": An array of objects each with "platform" (string), "time" (e.g., "10 mins ago"),
        "content" (string), "threatType" (string), "confidence" (integer 0-100).
      - "summary": A 1-2 sentence summary of the social media landscape for this location.`
    );
  } catch (error) {
    console.error("Error analyzing social radar:", error);
    throw new Error("Failed to analyze social media radar.");
  }
};

export const fetchLiveAlerts = async () => {
  try {
    const currentMonth = new Date().toLocaleString("default", { month: "long" });
    const data = await callJSON(
      `Generate a JSON object containing a single key "alerts" whose value is an array of 5-8
      current or highly probable emergency events in India.
      It is currently ${currentMonth}, so prioritize seasonal threats (Heatwaves, Forest Fires, Floods, Cyclones).

      Each alert object must have these fields:
      - "title": Specific location and event (e.g., "Heatwave Alert - North Delhi").
      - "type": One of: Fire, Flood, Landslide, Cyclone, Heatwave.
      - "description": A brief description with reasoning.
      - "location": General location string.
      - "severity": Exactly one of "Low", "Medium", "High", "Critical".
      - "status": Exactly one of "Active", "Monitoring", "Resolved".
      - "affected": A realistic integer number of people impacted.
      - "timestamp": Relative time like "2 hours ago" or "Just Now".
      - "lat": Precise latitude (number) for the event in India.
      - "lng": Precise longitude (number) for the event in India.`
    );

    const alerts = Array.isArray(data) ? data : (data.alerts || []);
    return alerts.map((alert, index) => ({
      ...alert,
      id: `live-alert-${Date.now()}-${index}`,
    }));
  } catch (error) {
    console.error("Error fetching live alerts:", error);
    throw new Error("Failed to fetch live alerts from AI.");
  }
};

export const getChatbotResponse = async (message, history) => {
  try {
    // Convert Google GenAI history format → OpenAI/Groq format
    const messages = history.map((msg) => ({
      role: msg.role === "model" ? "assistant" : msg.role,
      content: msg.parts?.[0]?.text ?? msg.content ?? "",
    }));

    const completion = await getGroq().chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a Health & Disaster Expert. Speak like a real human, not an AI. " +
            "Your tone should be calm, empathetic, and reassuring. " +
            "Provide very brief, clear, and direct advice. " +
            "When helpful, use a simple numbered or dashed list. " +
            "Use plain text only — no Markdown, no asterisks, no bolding.",
        },
        ...messages,
        { role: "user", content: message },
      ],
      temperature: 0.6,
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error getting chatbot response:", error);
    throw new Error("The AI assistant is currently unavailable. Please try again later.");
  }
};
