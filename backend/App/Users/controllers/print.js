import { SarvamAIClient } from "sarvamai";
import dotenv from 'dotenv'

dotenv.config()

const client = new SarvamAIClient({
    apiSubscriptionKey: process.env.SARVAM_API_KEY
});

const content = `You are a professional legal document formatting engine.

Your task is to format the given document into a clean, structured, and professionally styled legal document.

STRICT RULES:
1. Return ONLY the fully formatted legal document.
2. Do NOT include explanations, comments, notes, or extra messages.
3. Do NOT add introductions, summaries, or conclusions.
4. Do NOT wrap the output in code blocks.
5. Preserve ALL original content exactly — do NOT change wording, grammar, or meaning.
6. Do NOT add new information or remove any information.
7. Improve ONLY the formatting and structure.

LEGAL FORMATTING REQUIREMENTS:
1. Use proper legal document hierarchy with clear sections, subsections, and headings.
2. Ensure consistent indentation, spacing, and alignment.
3. Clearly format titles, clauses, numbered points, and subpoints.
4. Maintain professional spacing between paragraphs and sections.
5. Format lists using proper numbering (1., 1.1, (a), (i) etc.) when applicable.
6. Keep the document clean, readable, and suitable for official/legal use.
7. Maintain all names, dates, addresses, clauses, and references exactly as given.
8. Ensure the final output looks like a professionally prepared legal document.

OUTPUT FORMAT:
Return the document as **plain text only**.`

async function FormatDocument(req, res) {
    let { document } = req.body
    if (!document) return res.send({ status: 7, msg: "Invalid fields" })
    try {
        let content1 = 'The Document is :-\n'+ document
        const res1 = await client.chat.completions({
            model: 'sarvam-105b',
            messages: [
                {
                    role: 'system',
                    content: content
                },
                {
                    role: 'user',
                    content: content1
                }
            ],
            max_tokens: 30000
        })
        const r = res1.choices[0].message.content.trim()
        return res.send({status:1 ,msg:"Done" , document: r})
    }
    catch(err){
        console.log('error is' , err)
        return res.send({status:0,msg:"Internal server error"})
    }
}

export {FormatDocument}