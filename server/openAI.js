require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function generateText(prompt) {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
    });
    return response.choices[0].message.content.trim();
}

async function generateImage(prompt) {
    const response = await openai.images.generate({
        prompt: prompt,
        n: 1,
        size: '512x512',
    });
    return response.data[0].url;
}

app.post('/api/generate-content', async (req, res) => {
    const { name, purpose, positiveEffect, price } = req.body;

    try {
        // Generate text content
        const headlinePrompt = `Generate a catchy headline for a product named ${name} that ${purpose}`;
        const descriptionPrompt = `Describe the product ${name} that ${purpose}. Highlight its positive effects: ${positiveEffect}`;
        const ctaPrompt = `Generate a call to action for purchasing ${name}`;

        const headline = await generateText(headlinePrompt);
        const description = await generateText(descriptionPrompt);
        const cta = await generateText(ctaPrompt);

        // Generate image
        const imagePrompt = `An illustrative image of a product named ${name} that ${purpose}. It should highlight the positive effects: ${positiveEffect}`;
        const imageURL = await generateImage(imagePrompt);

        res.json({
            headline,
            description,
            cta,
            purpose,
            positiveEffect,
            price,
            imageURL,
        });
    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).json({ error: 'Failed to generate content' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
