// BaseAgent with real OpenAI chat capability
const fs = require("fs").promises;
const path = require("path");
const OpenAI = require("openai");

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
  }

  async loadSystemPrompt() {
    if (this.systemPrompt) return;
    const searchPaths = [
      path.join(__dirname, "../prompts", this.promptFile),
      path.join(__dirname, "../../prompts", this.promptFile),
      path.join(
        process.cwd(),
        "hive",
        "agents",
        "prompts",
        this.promptFile
      ),
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

  async chat(userContent) {
    await this.loadSystemPrompt();
    // If no API key, return placeholder to avoid throwing.
    if (
      !process.env.OPENAI_API_KEY ||
      process.env.OPENAI_API_KEY === "your-api-key-here"
    ) {
      return "[Placeholder response – set OPENAI_API_KEY for live generation]";
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: userContent },
        ],
        temperature: this.temperature,
        max_tokens: this.maxTokens,
      });
      return (
        completion.choices?.[0]?.message?.content?.trim() ||
        "[No content returned]"
      );
    } catch (err) {
      console.warn(`OpenAI request failed (${this.id}):`, err?.message || err);
      return "[Placeholder response – OpenAI error]";
    }
  }
}

module.exports = BaseAgent;
