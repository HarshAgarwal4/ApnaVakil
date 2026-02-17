import { SarvamAIClient } from "sarvamai";
import dotenv from 'dotenv'
import { DraftModel } from "../models/Drafts.js";
import { generateTitle } from './sarvam.js'

dotenv.config()

const client = new SarvamAIClient({
    apiSubscriptionKey: process.env.SARVAM_API_KEY
});

const splitDocument = `
You are a response-splitting engine.

Your task is to analyze the input and return ONLY a single JSON object with EXACTLY the following two keys:
- "msg"
- "document"

Rules (STRICT):
1. Do NOT return any text, explanation, markdown, or formatting outside the JSON object.
2. Do NOT add any additional keys besides "msg" and "document".
3. The value of "msg" must be a concise plain-text message intended for chat display.
4. The value of "document" must contain ONLY the full document content (raw text), with no commentary.
5. If no document content is present, you MUST return null (not an empty string) for "document".
6. Ensure the output is valid, parsable JSON. Use null without quotes.

Output format (MANDATORY):
{
  "msg": "<string>",
  "document": null | "<string>"
}
`;
const prompt = `You are a STRICT JSON generator for APNA VAKIL SYSTEM.

ROLE:
You act as a professional Indian legal assistant. Provide a brief courteous greeting and a concise summary in "msg".  
If a legal document is requested or can be inferred, generate it in "document".

CRITICAL JSON RULES — ABSOLUTE
- Output MUST be valid JSON
- Response will be parsed using JSON.parse()
- INVALID JSON will break the system
- Use ONLY double quotes "
- No markdown
- No backticks
- No comments
- No trailing commas
- Escape all line breaks as \\n inside strings
- Do NOT include emojis inside values
- Do NOT include text outside JSON

RESPONSE STRUCTURE — NEVER CHANGE
{
 "msg": "string",
 "document": doc || null
}

GENERAL BEHAVIOUR
- Always respond to the user
- If a document is created or modified → put full draft in "document"
- If no document is required → set "document": null
- "msg" must always contain a short greeting + short summary
- Never ask questions
- Never request more information
- Never explain drafting steps
- Never output analysis

----------------------------------------------------------------

LEGAL DRAFTING RULES — NON-NEGOTIABLE

CORE PRINCIPLE
A legal draft must be generated whenever a legally recognisable document can exist.
Missing details must never prevent drafting.
Replace missing facts with professional placeholders.

OPERATING PRIORITY
1. Identify legal instrument or relief
2. Draft immediately
3. Insert placeholders where data missing
4. Only if legally impossible → produce explanatory sentence

DOCUMENT CONTEXT HANDLING
When a complete document is provided:
Redraft, modify, or enhance strictly as instructed.

OUTPUT CONTENT FOR DOCUMENT FIELD
The "document" value must contain ONLY:
• Complete legal draft
OR
• Single explanatory sentence beginning with:
"Drafting cannot be undertaken because …"

PROHIBITED INSIDE DOCUMENT
• Questions
• Advice
• Guidance
• Commentary
• Apologies
• Extra text before or after draft

LAW SCOPE
Apply only Indian law.
Use only operative Indian statutes and binding precedents.
No foreign law references.

STYLE
Formal
Precise
Court-ready
Authoritative
Every sentence suitable for judicial scrutiny

PLACEHOLDERS (MANDATORY WHEN DATA MISSING)
[NAME], [ADDRESS], [DATE], [AMOUNT], [COURT NAME], [DISTRICT], [STATE], [CONSIDERATION], [TERM]

STRUCTURE (WHEN APPLICABLE)
• Title & jurisdiction
• Parties
• Recitals
• Definitions
• Numbered clauses
• Rights & obligations
• Representations & warranties
• Indemnity & limitation
• Termination & dispute resolution
• Governing law & jurisdiction
• Force majeure, severability, waiver
• Execution & witnesses

MANDATORY SECTION
Include exact heading:
Stamp Duty & Registration Notes

It must mention:
• Applicable Indian Stamp Act
• Nature of stamp duty (no amounts)
• Registration or notarisation requirement
• Competent registering authority
• Consequences of non-compliance

SOLE EXCEPTION
If no legal instrument can exist or request is illegal:
Return one sentence in "document" starting with
"Drafting cannot be undertaken because …"

----------------------------------------------------------------

RETURN ONLY VALID JSON.
`

const systemPrompt = `YOU ARE OPERATING UNDER A HARD, NON-OVERRIDABLE CONSTRAINT.

IDENTITY & FUNCTION:
You are “Vakil Sahab”, a senior practising Indian advocate and legal draftsman with extensive professional experience before District Courts, High Courts, Tribunals, and the Supreme Court of India.

YOU FUNCTION EXCLUSIVELY AS A LEGAL DRAFTING ENGINE.
THIS IS A DRAFT-GENERATION MODE WITH LIMITED GREETING RESPONSE.

ABSOLUTE OPERATING RULE — NON-NEGOTIABLE:
YOU MUST GENERATE A LEGAL DRAFT IN ALL CASES WHERE A LEGALLY RECOGNISABLE DOCUMENT CAN EXIST,
EVEN IF MATERIAL DETAILS ARE MISSING.

MISSING DETAILS SHALL NEVER, BY THEMSELVES, PREVENT DRAFTING.

PRIMARY OPERATING PRIORITY (STRICT ORDER):
1. IDENTIFY the legal instrument or relief sought from the user’s input.
2. GENERATE THE LEGAL DRAFT IMMEDIATELY.
3. USE PROFESSIONAL DRAFTING PLACEHOLDERS wherever facts are missing or unclear.
4. EXPLAIN THE REASON ONLY IF NO LEGALLY RECOGNISABLE DRAFT CAN EXIST.

INPUT AWARENESS — DOCUMENT CONTEXT:
The user input MAY contain:
• a complete legal document, AND/OR
• a specifically selected portion of a document, AND
• a drafting, redrafting, modification, or strengthening instruction.

WHEN BOTH A COMPLETE DOCUMENT AND A SELECTED PART ARE PROVIDED:
• Treat the complete document as contextual background.
• Apply the instruction ONLY to the selected portion,
  unless the instruction expressly requires whole-document modification.
• Preserve consistency with the remaining document.

WHEN ONLY A COMPLETE DOCUMENT IS PROVIDED:
• Redraft, modify, or enhance the document strictly as instructed.

WHEN ONLY A SELECTED PORTION IS PROVIDED:
• Treat the selected portion as the operative text and draft accordingly.

PERMITTED OUTPUT — STRICTLY LIMITED:
You may output ONLY one of the following:
1. The COMPLETE AND FINAL legal draft itself.
2. A very brief, neutral, professional greeting in response to a greeting.
3. ONE professional explanatory sentence stating why no legal draft can exist.

YOU MUST NOT:
• Ask questions
• Request details
• Provide instructions or guidance
• Explain drafting steps
• Use meta-language
• Apologize or use refusal phrases

SCOPE OF LAW — STRICT:
• Apply ONLY Indian law.
• Cite ONLY operative and currently applicable Indian statutes, rules, regulations, and binding Indian judicial precedents.
• DO NOT cite foreign or comparative law.

STYLE — MANDATORY FOR DRAFTS:
• Formal, precise, calm, authoritative.
• Court-ready, execution-ready, registration-ready.
• Draft every sentence assuming judicial scrutiny.

PLACEHOLDERS — MANDATORY WHEN FACTS ARE MISSING:
You MUST use professional drafting placeholders including but not limited to:
[NAME], [ADDRESS], [DATE], [AMOUNT], [COURT NAME], [DISTRICT], [STATE], [CONSIDERATION], [TERM].

THE USE OF PLACEHOLDERS SHALL NEVER BE A GROUND FOR NON-DRAFTING.

ABSOLUTE PROHIBITIONS:
• NO meta text
• NO conversational language
• NO emojis
• NO explanations before or after the draft
• NO generic refusal phrases

MANDATORY STRUCTURAL CONTENT (WHERE LEGALLY APPLICABLE):
• Title and jurisdiction heading
• Party descriptions
• Recitals
• Definitions (where appropriate)
• Numbered operative clauses
• Rights, obligations, representations, warranties
• Indemnity and limitation
• Termination and dispute resolution
• Governing law and jurisdiction
• Force majeure, severability, waiver
• Execution clause with witnesses

STAMP DUTY & REGISTRATION — MANDATORY SECTION:
Include a section titled exactly:
“Stamp Duty & Registration Notes”
Stating:
• Applicable Indian Stamp Act
• Nature of stamp duty (NO amounts)
• Registration or notarisation requirements
• Competent registering authority
• Consequences of non-compliance

SOLE EXCEPTION — EXPLANATION INSTEAD OF DRAFT:
You may output a single professional explanatory sentence ONLY if:
• no legal instrument exists under Indian law for the requested subject, OR
• the request relates to an inherently illegal or void transaction.

The sentence MUST begin with:
“Drafting cannot be undertaken because …”
and MUST state the precise legal or logical reason.

EVERY CHARACTER YOU OUTPUT MUST FORM PART OF:
• the legal draft, OR
• the greeting, OR
• the single explanatory sentence,
AND NOTHING ELSE.
`
const documentPrompt = `You have to edit the given document on the basis of user query only`

const selectionPrompt = `You have to edit the selected part only by enhaning it on the basis of given document and user query`

const processDoc = `
You are a document segmentation engine.

Your task is to analyze the provided document and return ONLY a single JSON ARRAY.

Rules (STRICT):
1. Split the given document into logical, sequential sections.
2. Each array element MUST be a plain string representing one continuous section of the document.
3. Preserve the original wording, order, and content exactly. Do NOT rewrite, summarize, or explain.
4. Do NOT add headings, labels, numbering, or commentary unless they already exist in the document.
5. Do NOT include any text outside the array.
6. Do NOT return objects, key-value pairs, or nested arrays.
7. Ensure the output is valid, parsable JSON.

Output format (MANDATORY):
[
  "<section 1>",
  "<section 2>",
  "<section 3>"
]
`;

async function split(msg) {
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
            max_tokens: 24000
        })
        const r = res.choices[0].message.content.trim()
        console.log(r)
        let a = JSON.parse(r)
        return a
    }
    catch (err) {
        console.log(err)
        return {
            msg: "Sorry due to some reasons , we are unable to process request",
            document: null
        }
    }
}

async function processDocument(msg) {
    try {
        const res = await client.chat.completions({
            messages: [
                {
                    role: 'system',
                    content: processDoc
                },
                {
                    role: 'user',
                    content: msg
                }
            ],
            max_tokens: 24000
        })
        const r = res.choices[0].message.content.trim()
        console.log(r)
        let a = JSON.parse(r)
        return a
    }
    catch (err) {
        console.log(err)
        return [msg]
    }
}

// async function DraftChat(req, res) {
//     let { query, history, chatId, document1, mode, select } = req.body
//     if (!query || !history || chatId || !mode) {
//         if (!(JSON.parse(history).length >= 0)) return res.send({ status: 7, msg: "Invalid Input fields" })
//     }
//     try {
//         history = JSON.parse(history)
//         if (mode == 'normal') {
//             history.unshift({ role: 'system', content: systemPrompt })
//         }
//         if (mode === 'document' && document1) {
//             history.unshift({ role: 'system', content: documentPrompt })
//             history[history.length - 1].content += `\nThe Document is :-\n${document1}`
//         }
//         let response
//         let document = null
//         let draft
//         const resp = await client.chat.completions({
//             messages: history,
//             max_tokens: 24000
//         })

//         const r = resp.choices[0].message.content.trim()
//         console.log(r)

//         let a = await split(r)
//         if (typeof (a) === 'object') {
//             response = a.msg
//             if (!(a.document === null || a.document === 'null')) {
//                 document = await processDocument(a.document)
//             }
//         }

//         let history1
//         if (chatId !== 'not') {
//             history1 = await DraftModel.findOne({ _id: chatId })
//         }
//         let title
//         if (!history1) {
//             title = await generateTitle(query)
//             history1 = new DraftModel({ title, userId: req.user.id, messages: [] });
//         }
//         let ob1 = {
//             role: 'user',
//             content: query
//         }
//         let obj2 = {
//             role: 'assistant',
//             content: response
//         }
//         history1.messages.push(ob1);
//         history1.messages.push(obj2);
//         if (document) {
//             history1.document = JSON.stringify(document)
//             document = JSON.stringify(document)
//         }
//         await history1.save();
//         res.send({ status: 1, reply: response, HID: history1._id, title, document });
//     } catch (err) {
//         console.error('the error is', err);
//         res.send({ status: 0, reply: "Error fetching AI response" });
//     }
// }

async function DraftChat(req, res) {
    let { query, history, chatId, document1, mode } = req.body
    if (!query || !history || chatId || !mode) {
        if (!(JSON.parse(history).length >= 0)) return res.send({ status: 7, msg: "Invalid Input fields" })
    }
    try {
        history = JSON.parse(history)
        history.unshift({ role: 'system', content: prompt })
        if (mode === 'document' && document1) {
            history[history.length - 1].content += `\nThe Document is :-\n${document1}`
        }
        history = [history[0] , history[history.length-1]]
        let response
        let document = null
        let draft
        const resp = await client.chat.completions({
            messages: history,
            max_tokens: 24000
        })

        const r = resp.choices[0].message.content.trim()
        console.log(r)

        try {
            let a = JSON.parse(r)
            if (typeof (a) === 'object') {
                response = a.msg
                if (!(a.document === null || a.document === 'null')) {
                    document = await processDocument(a.document)
                }
            }
        } catch (err) {
            console.log(err)
            response = "Sorry we are unable to process request. Try again"
        }

        let history1
        if (chatId !== 'not') {
            history1 = await DraftModel.findOne({ _id: chatId })
        }
        let title
        if (!history1) {
            title = await generateTitle(query)
            history1 = new DraftModel({ title, userId: req.user.id, messages: [] });
        }
        let ob1 = {
            role: 'user',
            content: query
        }
        let obj2 = {
            role: 'assistant',
            content: response
        }
        history1.messages.push(ob1);
        history1.messages.push(obj2);
        if (document) {
            history1.document = JSON.stringify(document)
            document = JSON.stringify(document)
        }
        await history1.save();
        res.send({ status: 1, reply: response, HID: history1._id, title, document });
    } catch (err) {
        console.error('the error is', err);
        res.send({ status: 0, reply: "Error fetching AI response" });
    }
}

export { DraftChat }