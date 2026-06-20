import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;
const LEADS_FILE = path.join(process.cwd(), "leads.json");

// Read saved leads or initialize empty array
function getLeads() {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const data = fs.readFileSync(LEADS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading leads file:", error);
  }
  return [];
}

// Save lead
function saveLead(lead: any) {
  try {
    const leads = getLeads();
    const newLead = {
      id: "LEAD-" + Date.now().toString().slice(-6),
      createdAt: new Date().toISOString(),
      ...lead,
    };
    leads.push(newLead);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
    return newLead;
  } catch (error) {
    console.error("Error writing lead file:", error);
    throw error;
  }
}

// Initialize server-side Gemini client
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API endpoint to submit cash offers
app.post("/api/offers", (req, res) => {
  try {
    const lead = req.body;
    if (!lead.propertyAddress || !lead.fullName || !lead.phone || !lead.email) {
      return res.status(400).json({ error: "Missing required fields." });
    }
    const saved = saveLead(lead);
    res.json({ success: true, lead: saved });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to submit cash offer request." });
  }
});

// API endpoint to get leads
app.get("/api/leads", (req, res) => {
  try {
    const leads = getLeads();
    res.json(leads);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to load leads." });
  }
});

// Chatbot endpoint proxying Gemini
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "No message provided." });
    }

    const systemInstruction = `You are "J Morales Investments AI Advisor", a warm, transparent, and highly ethical real estate assistant for J Morales Investments (jmoralesinvestments.com), based in Merriam, Kansas (serving regional Merriam and the broader Kansas City metro area).
Your details for reference:
- Local Phone: 816-777-7474
- Contact Email: jmorales1339@gmail.com
- Office Location: Merriam, KS
- Primary Services: Cash home buying (as-is, no inspections or cleanup required), addressing foreclosure situations, managing inherited/probate estates, supporting landlords with unwanted rentals, and assisting with financial distress or rapid relocation.
- Value Proposition: 100% fair cash offers, quick closings in 7-14 days (or customized to their schedule), absolute zero fees or realtor commissions, zero hidden costs, clear ethical standards, and high local trustworthiness.

Answer client questions thoroughly but concisely (keep responses under 4 sentences). Ensure you guide them to fill out our "Cash Offer Form" on pages like "Sell Your House" or call our dedicated line at 816-777-7474. Maintain a supportive, understanding tone since some home sellers are dealing with challenging circumstances (foreclosure, inheritance, divorce, relocation).`;

    if (ai) {
      let promptText = "";
      if (history && Array.isArray(history) && history.length > 0) {
        promptText += "Chat History:\n";
        history.forEach((msg: any) => {
          const roleLabel = msg.role === "user" ? "Client" : "J Morales AI Advisor";
          promptText += `${roleLabel}: ${msg.text || msg.content}\n`;
        });
      }
      promptText += `Client: ${message}\n`;
      promptText += "J Morales AI Advisor:";

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } else {
      // Elegant fallback response mapper if no API key is specified
      const lower = message.toLowerCase();
      let answer = "Thank you for reaching out to J Morales Investments! We specialize in buying houses direct in Merriam, KS and the surrounding Kansas City area. How can we help you today with your property?";
      
      if (lower.includes("how it works") || lower.includes("process") || lower.includes("steps")) {
        answer = "Our process is incredibly simple: 1. You tell us about your property. 2. We analyze the local market and schedule a quick 15-minute walkthrough. 3. We present you with a fair, no-obligation cash offer, and you choose the closing date. Contact us at 816-777-7474 to start!";
      } else if (lower.includes("cash") || lower.includes("offer") || lower.includes("money") || lower.includes("value")) {
        answer = "We provide fair, all-cash offers based on recent sales in Merriam & Kansas City, minus any needed repairs. You don't pay any agent commissions, structural fees, or closing costs. You can fill out our 'Cash Offer Form' on our Sell Your House page, or call 816-777-7474!";
      } else if (lower.includes("repair") || lower.includes("as-is") || lower.includes("condition") || lower.includes("dirty") || lower.includes("bad")) {
        answer = "You don't need to lift a finger or sweep a floor! We buy houses completely 'as-is'. Whether it has extensive structural issues, fire damage, outdated kitchens, or personal items left behind, we'll buy it exactly as it stands.";
      } else if (lower.includes("fast") || lower.includes("time") || lower.includes("slow") || lower.includes("close") || lower.includes("days")) {
        answer = "We can close in as little as 7 to 14 days, or on any date that fits your personal schedule! Since we use cash and don't rely on bank mortgage approvals, there are zero lending delays or surprises.";
      } else if (lower.includes("inherited") || lower.includes("probate") || lower.includes("will") || lower.includes("estate")) {
        answer = "We specialize in inherited properties. We can help you navigate the probate process, handle remaining items in the house, and purchase the home direct so you can distribute the estate funds quickly. Call 816-777-7474 for confidential assistance.";
      } else if (lower.includes("divorce") || lower.includes("foreclosure") || lower.includes("landlord") || lower.includes("tenant")) {
        answer = "We specialize in helping owners in difficult situations—whether you are facing foreclosure, managing a divorce, or tired of dealing with troublesome tenants. Call us at 816-777-7474 to discuss your options in complete confidence.";
      } else if (lower.includes("contact") || lower.includes("phone") || lower.includes("number") || lower.includes("address") || lower.includes("location") || lower.includes("who")) {
        answer = "We are J Morales Investments, proudly located in Merriam, Kansas. You can call or text our local line at 44px-friendly 816-777-7474, or email us at jmorales1339@gmail.com. We are here to help!";
      }
      
      res.json({ text: answer });
    }
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: error.message || "Internal server error." });
  }
});

// Configure Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
