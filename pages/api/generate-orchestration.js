import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    // Use the existing agent configuration as a reference
    const systemPrompt = `You are an AI orchestration architect. Based on a description, generate a complete orchestration specification including agents, workflows, configuration, and comprehensive documentation.

Available agent types to choose from:
- research: Audience research and demographic analysis
- trending: Trend identification and news opportunities  
- story: Story angles and headline creation
- strategic: Strategic insights and recommendations
- pr-manager: Campaign coordination and strategy management
- visual_prompt_generator: Visual creative prompts
- modular_elements_recommender: Modular visual elements
- trend_cultural_analyzer: Cultural trend analysis
- brand_qa: Brand alignment and quality assurance

Generate a JSON response with this structure:
{
  "name": "Descriptive name for the orchestration",
  "description": "Detailed description of what this orchestration does",
  "agents": ["array", "of", "relevant", "agent", "ids"],
  "workflows": ["array", "of", "workflow", "names"],
  "config": {
    "maxConcurrentWorkflows": 3-10,
    "timeout": 300000-600000,
    "retryAttempts": 2-3,
    "enableLogging": true,
    "reactiveFramework": boolean,
    "parallelExecution": boolean
  },
  "documentation": {
    "overview": "Comprehensive overview of the orchestration's purpose and capabilities",
    "useCases": ["array", "of", "specific", "use", "cases"],
    "workflowDescription": "Detailed description of how the workflow operates",
    "agentRoles": {
      "agent_id": "Detailed description of this agent's role in this orchestration"
    },
    "deliverables": ["array", "of", "expected", "outputs"],
    "configuration": "Explanation of configuration options and their impact",
    "bestPractices": ["array", "of", "best", "practices", "for", "using", "this", "orchestration"],
    "limitations": ["array", "of", "current", "limitations", "or", "considerations"],
    "examples": {
      "goodInputs": ["array", "of", "good", "input", "examples"],
      "poorInputs": ["array", "of", "poor", "input", "examples"]
    }
  }
}

Make the orchestration practical and focused on the described use case. Include comprehensive documentation that would help users understand and effectively use the orchestration.`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Create an orchestration for: ${description}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const generatedOrchestration = JSON.parse(
      completion.choices[0].message.content
    );

    // Validate the generated orchestration
    if (
      !generatedOrchestration.name ||
      !generatedOrchestration.agents ||
      !generatedOrchestration.workflows
    ) {
      throw new Error("Invalid orchestration structure generated");
    }

    // Add metadata
    generatedOrchestration.metadata = {
      generatedAt: new Date().toISOString(),
      sourceDescription: description,
      model: process.env.OPENAI_MODEL || "gpt-4o-2024-08-06",
    };

    res.status(200).json(generatedOrchestration);
  } catch (error) {
    console.error("Error generating orchestration:", error);
    res.status(500).json({
      error: "Failed to generate orchestration",
      details: error.message,
    });
  }
}
