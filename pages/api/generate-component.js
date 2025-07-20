import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { componentType, requirements, orchestrationContext } = req.body;

    const systemPrompt = `You are a React component generator for the Hive application.

CRITICAL STYLING REQUIREMENTS:
- NEVER use hardcoded Tailwind colors (bg-blue-*, text-green-*, bg-gray-*, etc.)
- ALWAYS use the unified design token system
- Follow established patterns from existing components
- Ensure accessibility and brand consistency

DESIGN TOKEN SYSTEM:
- Primary actions: bg-primary hover:bg-primary-hover text-white
- Success states: bg-success hover:bg-success-hover text-white
- Text hierarchy: text-text-primary (headings), text-text-secondary (body), text-text-muted (helper)
- Backgrounds: bg-secondary (containers), bg-bg-primary (main content)
- Borders: border border-border (standard), border-t border-border (dividers)
- Focus states: focus:ring-2 focus:ring-primary focus:border-primary

COMPONENT PATTERNS:
- Buttons: px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded transition-colors
- Cards: bg-white rounded-lg shadow-md p-6 border border-border
- Forms: w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition
- Status indicators: inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-light text-success

Generate a complete React component that:
1. Uses ONLY design tokens for styling
2. Follows established patterns from the Hive application
3. Includes proper TypeScript interfaces
4. Has proper accessibility features
5. Includes hover and focus states
6. Is responsive and well-structured

Return the component as a complete, ready-to-use React TypeScript file.`;

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-2024-08-06",
      input: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Generate a ${componentType} component for: ${requirements}`,
        },
      ],
      temperature: 0.3,
    });

    const generatedComponent = response.output_text;

    res.status(200).json({
      component: generatedComponent,
      metadata: {
        generatedAt: new Date().toISOString(),
        componentType,
        requirements,
        orchestrationContext,
      },
    });
  } catch (error) {
    console.error("Error generating component:", error);
    res.status(500).json({
      error: "Failed to generate component",
      details: error.message,
    });
  }
}
