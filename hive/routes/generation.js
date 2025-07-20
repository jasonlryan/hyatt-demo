const fs = require("fs");
const path = require("path");

module.exports = function (app, { orchestrationManager }) {
  app.get("/api/orchestrations", (req, res) => {
    try {
      const orchestrations = orchestrationManager.getFrontendOrchestrations();
      res.status(200).json({ orchestrators: orchestrations });
    } catch (error) {
      console.error("Error loading orchestrations:", error);
      res.status(500).json({
        message: "Failed to load orchestrations",
        error: error.message,
      });
    }
  });

  app.get("/api/orchestration-documentation", (req, res) => {
    if (req.method !== "GET")
      return res.status(405).json({ message: "Method not allowed" });
    try {
      const { id } = req.query;
      if (!id)
        return res.status(400).json({ message: "Missing orchestration id" });
      const fs = require("fs");
      const path = require("path");
      const documentationPaths = {
        hyatt: "docs/orchestrations/HyattOrchestrator.md",
        builder: "docs/orchestrations/OrchestrationBuilder.md",
        hive: "docs/orchestrations/HiveOrchestrator.md",
      };
      const docPath = path.join(
        __dirname,
        "..",
        documentationPaths[id] || `docs/orchestrations/${id}.md`
      );
      if (!fs.existsSync(docPath))
        return res.status(404).json({ message: "Documentation not found" });
      const markdown = fs.readFileSync(docPath, "utf8");
      res.status(200).json({
        markdown,
        metadata: {
          orchestrationId: id,
          lastModified: fs.statSync(docPath).mtime.toISOString(),
        },
      });
    } catch (error) {
      console.error("Documentation loading failed:", error);
      res.status(500).json({ message: "Failed to load documentation" });
    }
  });

  app.post("/api/generate-orchestration", async (req, res) => {
    if (req.method !== "POST")
      return res.status(405).json({ error: "Method not allowed" });
    try {
      const { description } = req.body;
      if (!description)
        return res.status(400).json({ error: "Description is required" });
      const OpenAI = require("openai");
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const systemPrompt = `You are an AI orchestration architect. Based on a description, generate a complete orchestration specification including agents, workflows, configuration, and comprehensive documentation.`;
      const response = await openai.responses.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-2024-08-06",
        input: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Create an orchestration for: ${description}`,
          },
        ],
        temperature: 0.3,
      });
      const generated = JSON.parse(response.output_text);
      if (!generated.name || !generated.agents || !generated.workflows)
        throw new Error("Invalid orchestration structure generated");
      generated.metadata = {
        generatedAt: new Date().toISOString(),
        sourceDescription: description,
        model: process.env.OPENAI_MODEL || "gpt-4o-2024-08-06",
      };
      res.status(200).json(generated);
    } catch (error) {
      console.error("Error generating orchestration:", error);
      res.status(500).json({
        error: "Failed to generate orchestration",
        details: error.message,
      });
    }
  });

  app.post("/api/generate-diagram", (req, res) => {
    if (req.method !== "POST")
      return res.status(405).json({ message: "Method not allowed" });
    try {
      const { id } = req.body;
      if (!id) return res.status(400).json({ message: "Missing id" });
      const orchestrations = {
        hyatt: {
          agents: [
            "pr_manager",
            "research_audience",
            "strategic_insight",
            "trending_news",
            "story_angles",
          ],
        },
        hive: {
          agents: [
            "trend_cultural_analyzer",
            "brand_lens",
            "visual_prompt_generator",
            "modular_elements_recommender",
            "brand_qa",
          ],
        },
      };
      const agentColors = {
        research: "#2563eb",
        strategy: "#ec4899",
        trending: "#22c55e",
        story: "#7c3aed",
        "pr-manager": "#64748b",
        visual_prompt_generator: "#f59e0b",
        modular_elements_recommender: "#06b6d4",
        trend_cultural_analyzer: "#8b5cf6",
        brand_qa: "#ef4444",
        brand_lens: "#10b981",
      };
      const calculateNodePosition = (index, total) => {
        const centerX = 600;
        const centerY = 300;
        const radius = 200;
        if (total === 1) return { x: centerX, y: centerY };
        const angle = (index / total) * Math.PI * 2;
        return {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        };
      };
      const generateNodes = (agents) =>
        agents.map((a, i) => ({
          id: a,
          label: a,
          position: calculateNodePosition(i, agents.length),
          connectors: [
            { id: `${a}-T`, position: "T" },
            { id: `${a}-B`, position: "B" },
            { id: `${a}-L`, position: "L" },
            { id: `${a}-R`, position: "R" },
          ],
          style: { border: `2px solid ${agentColors[a] || "#64748b"}` },
        }));
      const generateSequentialConnections = (agents) => {
        const connections = [];
        for (let i = 0; i < agents.length - 1; i++)
          connections.push(`${agents[i]}:R -> ${agents[i + 1]}:L`);
        return connections;
      };
      const parseConnection = (c) => {
        const [nodeId, connector] = c.split(":");
        return { nodeId, connector };
      };
      const createEdgeFromString = (str) => {
        const [from, to] = str.split("->").map((s) => s.trim());
        const fromConn = parseConnection(from);
        const toConn = parseConnection(to);
        return {
          id: `${from}-${to}`,
          from: fromConn,
          to: toConn,
          style: {
            color: "#2563eb",
            dashed: true,
            animated: true,
            strokeWidth: 2,
          },
          type: "default",
        };
      };
      const generateDiagramFromOrchestration = (orch) => {
        if (!orch || !Array.isArray(orch.agents) || orch.agents.length === 0) {
          return {
            nodes: [
              {
                id: "empty",
                label: "No Agents",
                position: { x: 600, y: 300 },
                connectors: [],
              },
            ],
            edges: [],
          };
        }
        const nodes = generateNodes(orch.agents);
        const edges = generateSequentialConnections(orch.agents).map(
          createEdgeFromString
        );
        return { nodes, edges };
      };
      const orchestration = orchestrations[id];
      if (!orchestration) return res.status(404).json({ message: "Not found" });
      const diagram = generateDiagramFromOrchestration(orchestration);
      res.status(200).json({ diagram });
    } catch (err) {
      console.error("Diagram generation failed:", err);
      res.status(500).json({ message: "Failed to generate diagram" });
    }
  });

  app.post("/api/generate-page", async (req, res) => {
    if (req.method !== "POST")
      return res.status(405).json({ error: "Method not allowed" });
    try {
      const { pageType, requirements, features } = req.body;
      const { OpenAI } = require("openai");
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
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
      const response = await openai.responses.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-2024-08-06",
        input: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Generate a ${pageType} page with features: ${features}. Requirements: ${requirements}`,
          },
        ],
        temperature: 0.3,
      });
      const generatedPage = response.output_text;
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
      res
        .status(500)
        .json({ error: "Failed to generate page", details: error.message });
    }
  });

  app.post("/api/generate-component", async (req, res) => {
    if (req.method !== "POST")
      return res.status(405).json({ error: "Method not allowed" });
    try {
      const { componentType, requirements, orchestrationContext } = req.body;
      const { OpenAI } = require("openai");
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
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
          { role: "system", content: systemPrompt },
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
  });

  app.post("/api/generate-agents", async (req, res) => {
    if (req.method !== "POST")
      return res.status(405).json({ error: "Method not allowed" });
    try {
      const { agents, orchestrationContext, cleanup = false } = req.body;

      // Handle cleanup request
      if (cleanup && agents && agents.length > 0) {
        const cleanupResult = await cleanupTestAgent(agents[0]);
        return res.status(200).json({
          message: "Test agent cleaned up",
          cleanupResult,
        });
      }

      if (!agents || !Array.isArray(agents) || agents.length === 0) {
        return res.status(400).json({ error: "Agents array is required" });
      }

      if (!orchestrationContext) {
        return res
          .status(400)
          .json({ error: "Orchestration context is required" });
      }

      console.log(
        `🎯 Generating agents: ${agents.join(
          ", "
        )} for context: ${orchestrationContext}`
      );

      // Generate agent class and prompt for the first agent
      const agentId = agents[0];
      const agentClass = await generateAgentClass(
        agentId,
        orchestrationContext
      );
      const agentPrompt = await generateAgentPrompt(
        agentId,
        orchestrationContext
      );

      // Save the generated files
      const filePaths = await saveGeneratedAgent(
        agentId,
        agentClass,
        agentPrompt
      );

      // Update agent config
      const configUpdated = await updateAgentConfig(
        agentId,
        agentClass,
        agentPrompt,
        orchestrationContext
      );

      // Reload orchestrations to include the new agent
      orchestrationManager.reloadAgentsConfig();

      res.status(200).json({
        agentClass,
        agentPrompt,
        filePaths,
        configUpdated,
        metadata: {
          generatedAt: new Date().toISOString(),
          agentId: agentId,
          context: orchestrationContext,
          totalAgents: agents.length,
        },
      });
    } catch (error) {
      console.error("Agent generation failed:", error);
      res.status(500).json({
        error: "Failed to generate agent",
        details: error.message,
      });
    }
  });

  async function generateAgentClass(agentId, context) {
    const { OpenAI } = require("openai");
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const systemPrompt = `You are an AI agent architect. Generate a complete agent class.

CRITICAL: Return ONLY raw JavaScript code. NO markdown, NO backticks, NO JSON, NO formatting.

Generate a JavaScript class that:
- Extends BaseAgent
- Has constructor with super() call
- Has process() method
- Uses naming pattern: [AgentId]Agent
- Uses model: 'gpt-4o-2024-08-06', temperature: 0.3, maxTokens: 2000

Example (replace [AgentId] with actual agent ID):
const { BaseAgent } = require('./BaseAgent');

class [AgentId]Agent extends BaseAgent {
  constructor() {
    super({
      model: 'gpt-4o-2024-08-06',
      temperature: 0.3,
      maxTokens: 2000
    });
  }

  async process(input) {
    // Agent-specific logic here
    return result;
  }
}

module.exports = [AgentId]Agent;`;

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-2024-08-06",
      input: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Generate agent class for: ${agentId} in context: ${context}`,
        },
      ],
      temperature: 0.3,
    });

    // Extract class name from the generated code
    let classCode = response.output_text;

    // Clean up any markdown formatting if AI still returns it
    if (classCode.includes("```")) {
      const codeBlockMatch = classCode.match(
        /```(?:javascript|js)?\s*([\s\S]*?)```/
      );
      if (codeBlockMatch) {
        classCode = codeBlockMatch[1].trim();
      }
    }

    const classNameMatch = classCode.match(/class\s+(\w+)\s+extends/);
    const className = classNameMatch
      ? classNameMatch[1]
      : `${agentId.charAt(0).toUpperCase() + agentId.slice(1)}Agent`;

    return {
      className,
      classCode,
      config: {
        model: "gpt-4o-2024-08-06",
        temperature: 0.3,
        maxTokens: 2000,
      },
    };
  }

  async function generateAgentPrompt(agentId, context) {
    const { OpenAI } = require("openai");
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const systemPrompt = `You are an AI prompt engineer. Generate a system prompt.

CRITICAL: Return ONLY raw markdown content. NO JSON, NO backticks, NO formatting.

Generate a markdown prompt that:
- Starts with # heading
- Defines agent role
- Includes input/output formats
- Provides examples

Example:
# Test Agent

You are a test agent that processes input data.

## Input Format
Text input to process

## Output Format
Processed result

## Examples
Input: "hello"
Output: "processed: hello"`;

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-2024-08-06",
      input: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Generate prompt for: ${agentId} in context: ${context}`,
        },
      ],
      temperature: 0.3,
    });

    // Extract role from the generated prompt
    let promptCode = response.output_text;

    // Clean up any markdown formatting if AI still returns it
    if (promptCode.includes("```")) {
      const codeBlockMatch = promptCode.match(
        /```(?:markdown|md)?\s*([\s\S]*?)```/
      );
      if (codeBlockMatch) {
        promptCode = codeBlockMatch[1].trim();
      }
    }

    const roleMatch = promptCode.match(/#\s*(.+?)\s+Agent/);
    const role = roleMatch ? roleMatch[1].trim() : "custom";

    return {
      promptCode,
      metadata: {
        role,
        context: context || "orchestration",
      },
    };
  }

  async function saveGeneratedAgent(agentId, agentClass, agentPrompt) {
    const baseDir = process.cwd();

    // Save agent class - use correct path structure
    const agentClassDir = path.join(baseDir, "agents", "classes");
    const agentClassPath = path.join(
      agentClassDir,
      `${agentClass.className}.js`
    );

    await fs.promises.mkdir(agentClassDir, { recursive: true });
    await fs.promises.writeFile(agentClassPath, agentClass.classCode, "utf8");

    // Save agent prompt - use correct path structure
    const agentPromptDir = path.join(baseDir, "agents", "prompts");
    const agentPromptPath = path.join(agentPromptDir, `${agentId}.md`);

    await fs.promises.mkdir(agentPromptDir, { recursive: true });
    await fs.promises.writeFile(
      agentPromptPath,
      agentPrompt.promptCode,
      "utf8"
    );

    return {
      agentClassPath,
      agentPromptPath,
    };
  }

  async function updateAgentConfig(agentId, agentClass, agentPrompt, context) {
    const configPath = path.join(process.cwd(), "agents", "agents.config.json");

    // Read existing config
    let config = {};
    if (fs.existsSync(configPath)) {
      config = JSON.parse(await fs.promises.readFile(configPath, "utf8"));
    }

    // Ensure agents object exists
    if (!config.agents) {
      config.agents = {};
    }

    // Add new agent to config
    config.agents[agentId] = {
      id: agentId,
      name: agentClass.className,
      description: `Generated agent for ${
        agentPrompt.metadata?.context || "orchestration"
      }`,
      enabled: true,
      model: agentClass.config.model,
      temperature: agentClass.config.temperature,
      maxTokens: agentClass.config.maxTokens,
      promptFile: `${agentId}.md`,
      role: agentPrompt.metadata?.role || "custom",
      priority: Object.keys(config.agents).length + 1,
      orchestration: context ? context.toLowerCase() : "none",
    };

    // Write updated config
    await fs.promises.writeFile(configPath, JSON.stringify(config, null, 2));

    return {
      configPath,
      agentAdded: true,
      totalAgents: Object.keys(config.agents).length,
    };
  }

  async function cleanupTestAgent(agentId) {
    const baseDir = process.cwd();

    try {
      // Remove agent class file
      const agentClassDir = path.join(baseDir, "agents", "classes");
      const agentClassFiles = await fs.promises.readdir(agentClassDir);

      // Look for the exact class file name - test_agent -> TestAgent.js
      const agentClassName = "TestAgent";
      const expectedFileName = `${agentClassName}.js`;

      console.log(`🔍 Looking for agent class: ${expectedFileName}`);
      console.log(`🔍 Available files:`, agentClassFiles);

      const agentClassFile = agentClassFiles.find(
        (file) => file === expectedFileName
      );

      console.log(`🔍 Found file:`, agentClassFile);

      if (agentClassFile) {
        const agentClassPath = path.join(agentClassDir, agentClassFile);
        await fs.promises.unlink(agentClassPath);
        console.log(`🗑️ Removed agent class: ${agentClassFile}`);
      } else {
        console.log(
          `❌ No agent class file found for: ${agentId} (expected: ${expectedFileName})`
        );
      }

      // Remove agent prompt file
      const agentPromptPath = path.join(
        baseDir,
        "agents",
        "prompts",
        `${agentId}.md`
      );
      if (fs.existsSync(agentPromptPath)) {
        await fs.promises.unlink(agentPromptPath);
        console.log(`🗑️ Removed agent prompt: ${agentId}.md`);
      }

      // Remove from config
      const configPath = path.join(baseDir, "agents", "agents.config.json");
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(
          await fs.promises.readFile(configPath, "utf8")
        );
        if (config.agents && config.agents[agentId]) {
          delete config.agents[agentId];
          await fs.promises.writeFile(
            configPath,
            JSON.stringify(config, null, 2)
          );
          console.log(`🗑️ Removed agent from config: ${agentId}`);
        }
      }

      return {
        agentId,
        filesRemoved: true,
        configUpdated: true,
      };
    } catch (error) {
      console.error("Cleanup failed:", error);
      return {
        agentId,
        error: error.message,
      };
    }
  }
};
