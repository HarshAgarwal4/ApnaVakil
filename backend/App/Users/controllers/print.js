import { SarvamAIClient } from "sarvamai";
import dotenv from 'dotenv'

dotenv.config()

const client = new SarvamAIClient({
    apiSubscriptionKey: process.env.SARVAM_API_KEY
});

const content = `
You are a document formatting engine.

Your task is to format the given document into a clean, well-structured, and beautiful-looking document.

STRICT RULES:
1. Return ONLY the fully formatted document.
2. Do NOT include any explanations, comments, notes, or extra messages.
3. Do NOT add introductions or conclusions.
4. Do NOT wrap the output in code blocks.
5. Preserve all original content — only improve formatting and structure.
6. Do NOT change wording, meaning, or add new content.
7. Give document as plain text only not in code format
`;

async function FormatDocument(req, res) {
    let { document } = req.body
    if (!document) return res.send({ status: 7, msg: "Invalid fields" })
        console.log("running")
    try {
        let content1 = content + '\nThe Document is :-\n'+ document
        const res1 = await client.chat.completions({
            model: 'sarvam-m',
            messages: [
                {
                    role: 'user',
                    content: content1
                }
            ],
            max_tokens: 24000
        })
        const r = res1.choices[0].message.content.trim().split('</think>')[1].trim()
        return res.send({status:1 ,msg:"Done" , document: r})
    }
    catch(err){
        console.log(err)
        return res.send({status:0,msg:"Internal server error"})
    }
}

export {FormatDocument}