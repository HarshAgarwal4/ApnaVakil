import { SarvamAIClient } from "sarvamai";
import dotenv from "dotenv";

dotenv.config();

const client = new SarvamAIClient({
    apiSubscriptionKey: process.env.SARVAM_API_KEY
});

async function runAI(systemPrompt, query, max_tokens = 300, retries = 3) {

    try {

        const messages = [];

        if (systemPrompt) {
            messages.push({
                role: "system",
                content: systemPrompt
            });
        }

        messages.push({
            role: "user",
            content: query
        });

        const resp = await client.chat.completions({
            model: "sarvam-105b",
            messages,
            max_tokens
        });

        if (!resp?.choices?.length) {
            return "AI returned empty response";
        }

        return resp.choices[0].message.content.trim();

    } catch (err) {

        console.error("AI Error:", err.message);

        if (retries > 0) {
            console.log("Retrying AI request...");
            await new Promise(r => setTimeout(r, 2000));
            return runAI(systemPrompt, query, max_tokens, retries - 1);
        }

        return "AI service temporarily unavailable";
    }
}

export { runAI };