import { SarvamAIClient } from "sarvamai";
import dotenv from 'dotenv'
dotenv.config()

const client = new SarvamAIClient({
    apiSubscriptionKey: process.env.SARVAM_API_KEY
});

async function generateTitle(chat) {
    const prompt = `
You are generating a chat title for a software application.

STRICT RULES (VIOLATION NOT ALLOWED):
- Output MUST be plain text only
- Output MUST NOT include any symbols, punctuation, quotes, braces, brackets, or special formatting
- DO NOT use LaTeX, Markdown, or code formatting
- DO NOT use words like "boxed", "title", or any wrappers
- Use a MAXIMUM of 3 words
- Use formal and professional language
- Use Title Case
- Do NOT add explanations, prefixes, or suffixes
- Output ONLY the title text

VALID OUTPUT EXAMPLES:
Contract Termination
Greeting and exchange
User Authentication Issue
Legal Consultation Request

INVALID OUTPUT EXAMPLES:
boxed{Contract Termination}
"Contract Termination"
**Contract Termination**
Title: Contract Termination
Contract Termination Explained

CHAT CONTENT:
${chat}
`

    const response = await client.chat.completions({
        messages: [
            {
                role: "user",
                content: prompt
            },
        ],
    });
    console.log("title is ", response.choices[0].message.content.split('"')[0]);
    return response.choices[0].message.content.split('"')[0]
}

export { generateTitle }