class AgentValidator {
  static validateAgentClass(classCode) {
    const errors = [];

    // Check for BaseAgent extension
    if (!classCode.includes("extends BaseAgent")) {
      errors.push("Agent must extend BaseAgent class");
    }

    // Check for required methods
    if (!classCode.includes("process")) {
      errors.push("Agent must implement process method");
    }

    // Check for proper imports
    if (!classCode.includes("require(\"./BaseAgent\")") && !classCode.includes("require('./BaseAgent')")) {
      errors.push("Agent must import BaseAgent");
    }

    // Check for proper exports
    if (!classCode.includes("module.exports")) {
      errors.push("Agent must export the class");
    }

    // Responses API validation
    if (classCode.includes("chat.completions.create")) {
      errors.push("Agent MUST use responses.create() NOT chat.completions.create()");
    }
    if (!classCode.includes("responses.create")) {
      errors.push("Agent MUST use openai.responses.create() API");
    }
    if (classCode.includes('"messages"')) {
      errors.push("Agent MUST use 'input' parameter NOT 'messages'");
    }
    if (classCode.includes("choices[0].message.content")) {
      errors.push("Agent MUST use response.output_text NOT completion.choices[0].message.content");
    }

    return { isValid: errors.length === 0, errors };
  }

  static validateAgentPrompt(promptCode) {
    const errors = [];

    // Check for markdown structure
    if (!promptCode.includes("#")) {
      errors.push("Prompt must include markdown headers");
    }

    // Check for purpose section
    if (!promptCode.toLowerCase().includes("purpose")) {
      errors.push("Prompt must include purpose section");
    }

    return { isValid: errors.length === 0, errors };
  }
}

module.exports = AgentValidator;
