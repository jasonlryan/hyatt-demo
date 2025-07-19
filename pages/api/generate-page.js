import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { pageType, requirements, features } = req.body;

    const systemPrompt = `You are a React page generator for the Hive application.

CRITICAL STYLING REQUIREMENTS:
- NEVER use hardcoded Tailwind colors (bg-blue-*, text-green-*, bg-gray-*, etc.)
- ALWAYS use the unified design token system
- Follow established patterns from existing pages
- Ensure accessibility and brand consistency

DESIGN TOKEN SYSTEM:
- Primary actions: bg-primary hover:bg-primary-hover text-white
- Success states: bg-success hover:bg-success-hover text-white
- Text hierarchy: text-text-primary (headings), text-text-secondary (body), text-text-muted (helper)
- Backgrounds: bg-secondary (containers), bg-bg-primary (main content)
- Borders: border border-border (standard), border-t border-border (dividers)
- Focus states: focus:ring-2 focus:ring-primary focus:border-primary

PAGE PATTERNS:
- Page container: bg-secondary min-h-screen
- Main content: max-w-7xl mx-auto px-4 py-8
- Page header: text-2xl font-bold text-text-primary mb-6
- Content cards: bg-white rounded-lg shadow-md p-6 border border-border
- Action buttons: px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded transition-colors font-medium

Generate a complete React page that:
1. Uses ONLY design tokens for styling
2. Follows established page patterns from the Hive application
3. Includes proper TypeScript interfaces
4. Has proper accessibility features
5. Is responsive and well-structured
6. Integrates with existing shared components when appropriate

Return the page as a complete, ready-to-use React TypeScript file.`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Generate a ${pageType} page with features: ${features}. Requirements: ${requirements}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 3000,
    });

    const generatedPage = completion.choices[0].message.content;

    res.status(200).json({
      page: generatedPage,
      metadata: {
        generatedAt: new Date().toISOString(),
        pageType,
        requirements,
        features,
      },
    });
  } catch (error) {
    console.error("Error generating page:", error);
    res.status(500).json({
      error: "Failed to generate page",
      details: error.message,
    });
  }
}
