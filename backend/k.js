import { SarvamAIClient } from "sarvamai";
import dotenv from 'dotenv'
dotenv.config()

const client = new SarvamAIClient({
    apiSubscriptionKey: process.env.SARVAM_API_KEY
});

async function main() {
    const response = await client.chat.completions({
        messages: [
            {
                role: "user",
                content: "is there any api limit in your sarvam m chat free model"
            },
        ],
        wiki_grounding: true
    });
    console.log(response.choices[0].message.content);
}

main();