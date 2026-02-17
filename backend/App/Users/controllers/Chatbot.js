import { GoogleGenAI, Type, createUserContent, createPartFromUri } from "@google/genai";
import History from "../models/History.js";
import dotenv from 'dotenv'
import fs from 'fs'
import { deleteImageByUrl, uploadFileToCloud } from "../../../services/cloudinary.js";
import { generateTitle } from "./sarvam.js";
dotenv.config()

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

function removeFileParts(history) {
    return history.map(msg => ({
        ...msg,
        parts: msg.parts
            .filter(part => part.text)
            .map(part => ({
                text: typeof part.text === "string" ? part.text : JSON.stringify(part.text)
            }))
    }));
}

function extractJSON(text) {
    try {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
            return JSON.parse(match[0]); // convert to object
        }
    } catch (err) {
        console.error("Invalid JSON:", err);
    }
    return null;
}

async function chat(req, res) {
    console.log(req.file)
    console.log("1")
    let { query, history, chatId } = req.body
    console.log("2")
    if (!query || !history || chatId) {
        if (!(JSON.parse(history).length >= 0)) return res.send({ status: 7, msg: "Invalid Input fields" })
        }
    let url, content;
    console.log("3")
    try {
        console.log("4")
        if (req.file) {
            console.log("5")
            console.log(req.file)
            try {
                url = await uploadFileToCloud(req.file.path);
            } catch (err) {
                console.log(err)
            }
            let file = req.file
            let path = file.path
            console.log(req.file, req.file.path, req.file.mimetype)
            const myfile = await ai.files.upload({
                file: path,
                config: {
                    mimeType: file.mimetype,
                }
            });
            content = createUserContent([
                createPartFromUri(myfile.uri, myfile.mimeType),
                query,
            ]);
        } else {
            content = query
        }
        let hFinal = removeFileParts(JSON.parse(history));
        let finalText = ''
        const chat = ai.chats.create({
            model: "gemini-2.5-flash",
            config: {
                systemInstruction: process.env.systemInstruction,
                temperature: 0,
                //tools: [{ urlContext: {} }, { googleSearch: {} }],
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        answer: {
                            type: Type.STRING,
                            description: 'complete exact response of query in form of markdown text with proper formatting '
                        },
                        law: {
                            type: Type.STRING,
                            description: 'This field is required every time. it includes relevant law or section information relatd to user query if applicable otherwise return undefined or null',
                        },
                        lawyers: {
                            type: Type.ARRAY,
                            description: 'This field is required every time. it includes list of 5 lawyers with their name, contact number, speciality if applicable otherwise return undefined or null',
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: {
                                        type: Type.STRING,
                                        description: 'name of lawyer only'
                                    },
                                    speciality: {
                                        type: Type.STRING,
                                        description: 'speciality of that lawyer'
                                    },
                                    contact: {
                                        type: Type.STRING,
                                        description: 'contact of that lawyer'
                                    }
                                }
                            }
                        },
                        print: {
                            type: Type.STRING,
                            description: "If the response of user query includes any letter , draft , document overview then you have to write it as a proper formatted original legal document so that user can directky print it"
                        }
                    }
                }
            },
            history: hFinal,
        });
        const response1 = await chat.sendMessageStream({
            message: content,
        });
        for await (const chunk of response1) {
            if (chunk.text) {
                console.log(chunk.text);
                console.log("_".repeat(80));
                finalText += chunk.text
            }
        }

        let finalText1 = JSON.parse(finalText)
        console.log(finalText1)
        // let o = extractJSON(finalText)
        // let finalText1 = ''
        // if (o && o.answer) finalText1 = o?.answer
        // else finalText1 = finalText

        let history1
        if (chatId !== 'not') {
            history1 = await History.findOne({ _id: chatId })
        }
        let title
        if (!history1) {
            title = await generateTitle(JSON.stringify(hFinal))
            history1 = new History({title, userId: req.user.id, messages: [] });
        }
        let ob1 = {
            role: 'user',
            parts: [{ text: query }]
        }
        if (req.file && url) {
            // merge file info into the first part
            ob1.parts[0] = {
                ...ob1.parts[0],
                file: url.secure_url,
                fileType: req.file.mimetype,
                fileName: req.file.originalname
            }
        }
        let obj2 = {
            role: 'model',
            parts: [{ text: finalText }]
        }
        history1.messages.push(ob1);
        history1.messages.push(obj2);
        await history1.save();
        res.send({ status: 1, reply: finalText1, HID: history1._id , title});
    } catch (err) {
        console.error(err);
        if (url) await deleteImageByUrl(url)
        res.send({ status: 0, reply: "Error fetching AI response" });
    }
}

async function fetchHistory(req, res) {
    try {
        const history = await History.find({ userId: req.user.id }).sort({createdAt: -1}).limit(10);
        return res.send({ status: 1, data: history })
    } catch (err) {
        console.log(err.message);
        return res.send({ status: 0, msg: "Error in fetching history" })
    }
}

export { chat, fetchHistory }