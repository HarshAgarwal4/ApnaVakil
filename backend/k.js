import { SarvamAIClient } from "sarvamai";
import dotenv from 'dotenv'
dotenv.config()

const client = new SarvamAIClient({
    apiSubscriptionKey: process.env.SARVAM_API_KEY
});

async function main() {
    const response = await client.chat.completions({
        model:'sarvam-m',
        messages: [
            {
                role: "user",
                content: "say yes or no only in one word"
            },
        ]
    });
    console.log(response.choices[0].message.content);
}

main();