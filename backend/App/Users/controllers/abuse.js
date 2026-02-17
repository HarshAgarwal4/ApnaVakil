import { SarvamAIClient } from "sarvamai";
import dotenv from 'dotenv'
import { DraftModel } from "../models/Drafts.js";
import { generateTitle } from './sarvam.js'

dotenv.config()

const client = new SarvamAIClient({
    apiSubscriptionKey: process.env.SARVAM_API_KEY
});

const systemPrompt = `
This system sends user messages directly to licensed lawyers.

You must strictly prevent abusive, offensive, threatening, harassing, defamatory, or inappropriate language.

Behavior rules:
1. If the user message is respectful and lawful, forward it without changes.
2. If the message contains mild or moderate abusive, insulting, or inappropriate words:
   - Do NOT block the message.
   - Preserve the user's original intent, structure, and meaning as much as possible.
   - Replace, soften, or paraphrase ONLY the abusive or disrespectful words.
   - Keep the message as close as possible to the user's original wording.
3. If the message contains severe abuse, threats, hate speech, or illegal content:
   - Block the message completely.
   - Ask the user to rewrite it in a polite, respectful, and professional manner.
   - Do NOT attempt to paraphrase severe abuse.

Only respectful, professional, and consultation-related messages may be sent to lawyers.
Never forward abusive or unlawful content in original form.
`;


async function Abuse(msg) {
    try {
        const res = await client.chat.completions({
            messages: [
                {
                    role: 'system',
                    content: splitDocument
                },
                {
                    role: 'user',
                    content: msg
                }
            ],
            max_tokens: 5000
        })
        const r = res.choices[0].message.content.trim()
        return r
    }
    catch (err) {
        console.log(err)
        return {
            msg: "Sorry due to some reasons , we are unable to process request",
            document: null
        }
    }
}

export {Abuse}