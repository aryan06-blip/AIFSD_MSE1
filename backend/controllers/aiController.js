const axios = require('axios');

// @desc    Get AI Recommendation for employees
// @route   POST /api/ai/recommend
// @access  Private
const getAiRecommendation = async (req, res, next) => {
  try {
    const { employees } = req.body;

    if (!employees || employees.length === 0) {
      res.status(400);
      throw new Error('Please provide employee data for recommendation');
    }

    const prompt = `
    Analyze the following employee(s) data and provide:
    1. Promotion Recommendation (Who deserves a promotion based on high score and experience)
    2. Employee Ranking (Rank them based on performance)
    3. Training Suggestions (If low score or missing skills)
    4. AI Feedback Generation (General feedback for each)
    
    Format the response as a JSON array of objects, where each object corresponds to an employee and has the following keys:
    "employeeName", "promotionRecommendation", "rank", "trainingSuggestions", "feedback".
    Do not include any markdown formatting like \`\`\`json, just return the raw JSON array.

    Employee Data:
    ${JSON.stringify(employees, null, 2)}
    `;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5000',
          'X-Title': 'Employee Analytics System'
        }
      }
    );

    let aiContent = response.data.choices[0].message.content;
    
    // Clean up markdown code blocks if the AI accidentally includes them
    if (aiContent.startsWith('\`\`\`json')) {
      aiContent = aiContent.replace(/^\`\`\`json\n/, '').replace(/\n\`\`\`$/, '');
    } else if (aiContent.startsWith('\`\`\`')) {
      aiContent = aiContent.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
    }

    const recommendations = JSON.parse(aiContent);

    res.json(recommendations);
  } catch (error) {
    console.error('AI API Error:', error.response ? error.response.data : error.message);
    res.status(500);
    next(new Error('Failed to generate AI recommendations'));
  }
};

module.exports = { getAiRecommendation };
