// BaseAgent with real OpenAI chat capability and orchestration awareness
const fs = require("fs").promises;
const path = require("path");
const OpenAI = require("openai");
const orchestrationConfig = require('../../orchestrations/OrchestrationConfig');

class BaseAgent {
  constructor(id, options = {}) {
    this.id = id;
    this.model = options.model || "gpt-4o-2024-08-06";
    this.temperature = options.temperature ?? 0.7;
    this.maxTokens = options.maxTokens ?? 1000;
    this.promptFile = options.promptFile || `${id}.md`;
    this.systemPrompt = null;
    this.openai =
      options.openaiClient ||
      new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    // Orchestration awareness - optional, backward compatible
    this.orchestrationType = options.orchestrationType || null;
    this.orchestrationConfig = this.orchestrationType 
      ? orchestrationConfig.getOrchestration(this.orchestrationType)
      : null;
  }

  async loadSystemPrompt() {
    if (this.systemPrompt) return;
    const searchPaths = [
      path.join(__dirname, "../prompts", this.promptFile),
      path.join(__dirname, "../../prompts", this.promptFile),
      path.join(process.cwd(), "hive", "agents", "prompts", this.promptFile),
    ];
    for (const p of searchPaths) {
      try {
        const content = await fs.readFile(p, "utf8");
        this.systemPrompt = content;
        return;
      } catch (_) {
        /* try next */
      }
    }
    throw new Error(`System prompt file not found: ${this.promptFile}`);
  }

  async chat(userContent, orchestrationContext = {}) {
    await this.loadSystemPrompt();
    // If no API key, return placeholder to avoid throwing.
    if (
      !process.env.OPENAI_API_KEY ||
      process.env.OPENAI_API_KEY === "your-api-key-here"
    ) {
      return "[Placeholder response – set OPENAI_API_KEY for live generation]";
    }
    
    // Enhance user content with orchestration context if available
    const enhancedContent = this.enhanceContentWithOrchestrationContext(userContent, orchestrationContext);

    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: enhancedContent },
        ],
        temperature: this.temperature,
        max_tokens: this.maxTokens,
      });
      return response.choices[0].message.content?.trim() || "[No content returned]";
    } catch (err) {
      console.warn(`OpenAI request failed (${this.id}):`, err?.message || err);
      return "[Placeholder response – OpenAI error]";
    }
  }

  // Orchestration-aware content enhancement
  enhanceContentWithOrchestrationContext(userContent, orchestrationContext = {}) {
    if (!this.orchestrationConfig) {
      return userContent; // No orchestration awareness, return as-is
    }

    const workflowLabel = this.orchestrationConfig.workflowLabel || 'Workflow';
    const workflowType = this.orchestrationConfig.workflowType || 'workflow';
    const orchestrationName = this.orchestrationConfig.name || 'Unknown';

    // Add orchestration context to the user content
    const contextPrefix = `
ORCHESTRATION CONTEXT:
- Type: ${this.orchestrationType.toUpperCase()}
- Name: ${orchestrationName}
- Workflow Type: ${workflowType}
- Workflow Label: ${workflowLabel}
${Object.keys(orchestrationContext).length > 0 ? `- Additional Context: ${JSON.stringify(orchestrationContext, null, 2)}` : ''}

ORIGINAL REQUEST:
`;

    return contextPrefix + userContent;
  }

  // Helper methods for orchestration-aware agents
  getWorkflowLabel() {
    return this.orchestrationConfig?.workflowLabel || 'Workflow';
  }

  getWorkflowType() {
    return this.orchestrationConfig?.workflowType || 'workflow';
  }

  getOrchestrationName() {
    return this.orchestrationConfig?.name || 'Unknown';
  }

  isOrchestrationAware() {
    return this.orchestrationConfig !== null;
  }

  // Get next agent in workflow (if configured)
  getNextAgent() {
    if (!this.orchestrationConfig || !this.orchestrationConfig.workflow) {
      return null;
    }

    const workflow = this.orchestrationConfig.workflow;
    const currentIndex = workflow.findIndex(step => step.agent === this.id);
    
    if (currentIndex === -1 || currentIndex === workflow.length - 1) {
      return null;
    }

    return workflow[currentIndex + 1];
  }

  // Get agent role in current orchestration
  getAgentRole() {
    if (!this.orchestrationConfig || !this.orchestrationConfig.workflow) {
      return 'Agent';
    }

    const workflow = this.orchestrationConfig.workflow;
    const agentStep = workflow.find(step => step.agent === this.id);
    
    return agentStep?.role || 'Agent';
  }
}

module.exports = BaseAgent;
