const router = require('express').Router();
const { OpenAIApi, Configuration } = require('openai');
const dotenv = require('dotenv');
dotenv.config();

const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY
}));
console.log(process.env.OPENAI_API_KEY)
router.post("/send", async (req, res) => {
    try {
        const { question } = req.body;
        // const response= await openai.createChatCompletion({
        //     model:"gpt-3.5-turbo",
        //     messages:[{role:"user", content:question}]
        // })
        // res.status(200).json({
        //     answer: response.data.choices[0].message.content
        // });
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: question,
            max_tokens: 2000,
            temperature: 1
        });
        let text = response.data.choices[0].text;


        //         text = text.replace(/\n/g, "");

        //         // Escape backticks
        //         text = text.replace(/`/g, "`");

        //         // Replace example code snippets with formatting
        //         text = text.replace(/`([^`]+)`/g, "<code>$1</code>");

        //         console.log(text);

        //         // Remove unnecessary line breaks
        //         const codeRegex = /<code>(.*?)<\/code>/g;
        // const codeMatches = text.match(codeRegex);
        // const codeSnippets = codeMatches ? codeMatches.map(match => match.replace(/<\/?code>/g, "")) : [];

        // const numberingRegex = /\d+\.(.*?)\d+\./g;
        // const numberingMatches = text.match(numberingRegex);
        // const numberedTexts = numberingMatches ? numberingMatches.map(match => match.trim()) : [];

        const segments = text.split(/\d+\. /);
        let finalResponse = [];
        for (let i = 0; i < segments.length; i++) {
            let littleSegment = segments[i].split("\n");
            finalResponse = [...finalResponse, ...littleSegment];
        }

        finalResponse = finalResponse.filter((element) => element !== '');

        // const segments = text.split(/\n(?=\d+\.\s)/);



        res.status(200).json({
            answer: finalResponse
        })


    }
    catch (error) {
        res.status(501).json({ error: error.message });
    }
})
module.exports = router;