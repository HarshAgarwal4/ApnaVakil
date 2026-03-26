import { SarvamAIClient } from "sarvamai";
import dotenv from 'dotenv'
dotenv.config()

const client = new SarvamAIClient({
    apiSubscriptionKey: process.env.SARVAM_API_KEY
});

async function main() {
    const stream = await client.chat.completions({
        model: "sarvam-105b",
        messages: [
            { role: "user", content: "Write a short paragraph on analysis of India's digital transformation journey." }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        stream: true,
    });
    for await (const chunk of stream) {
        if (chunk.choices?.[0]?.delta?.content) {
            console.log(chunk.choices[0].delta.content.split('\n')[0]);
        }
    }
    console.log();
}

// main();

// async function main() {
//     const response = await client.chat.completions({
//         model: "sarvam-30b",
//         messages: [
//             { role: "user", content: "say yes or no only in one word" }
//         ],
//         temperature: 0.7,
//         max_tokens: 2000
//     });
//     console.log(response.choices[0].message.content);
// }

main();