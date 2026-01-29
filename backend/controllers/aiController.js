const { GoogleGenerativeAI } = require('@google/generative-ai');

// @desc    Generate AI summary and tags for blog content
// @route   POST /api/ai/summarize
// @access  Private
const summarizeBlog = async (req, res) => {
    try {
        const { content, title } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Content is required for summarization' });
        }

        // Check if API key is configured
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your-gemini-api-key-here') {
            return res.status(500).json({
                message: 'Gemini API key not configured. Please add your API key to the .env file.'
            });
        }

        // Initialize Gemini AI
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `You are an expert knowledge distiller. Analyze the following blog post and return a JSON response with the following structure:

{
  "context": "A 2-3 sentence overview explaining what this content is about and why it matters",
  "coreIdeas": [
    "First key insight or main point from the content",
    "Second key insight or main point",
    "Third key insight or main point",
    "Add more if needed, max 6 items"
  ],
  "actionables": [
    "First practical action the reader can take",
    "Second practical action",
    "Third practical action"
  ],
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

Rules:
- Tags should be relevant categories like: AI/ML, Technology, Business, Productivity, Career Growth, Health, Science, Programming, Design, Marketing, Finance, Leadership, etc.
- Generate 3-5 relevant tags based on the content
- Core ideas should be numbered insights, not generic statements
- Actionables should be specific, practical steps the reader can implement
- Keep the context concise but informative

Title: ${title || 'Untitled'}

Content:
${content}

Return ONLY the JSON object, no additional text or markdown formatting.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();

        // Clean up the response - remove markdown code blocks if present
        if (text.startsWith('```json')) {
            text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (text.startsWith('```')) {
            text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        // Parse the JSON response
        const summary = JSON.parse(text);

        res.json({
            summary: {
                context: summary.context || '',
                coreIdeas: summary.coreIdeas || [],
                actionables: summary.actionables || []
            },
            tags: summary.tags || []
        });
    } catch (error) {
        console.error('AI Summarization Error:', error);

        // If JSON parsing failed, return a default structure
        if (error instanceof SyntaxError) {
            return res.status(500).json({
                message: 'Failed to parse AI response. Please try again.',
                error: 'Invalid JSON response from AI'
            });
        }

        res.status(500).json({
            message: 'Failed to generate summary. Please check your API key and try again.',
            error: error.message
        });
    }
};

module.exports = { summarizeBlog };
