class AgentTester {
  static async testGeneratedAgent(agentId, agentClass) {
    try {
      const AgentClass = require(`../hive/agents/classes/${agentClass.className}.js`);
      const agent = new AgentClass();
      await agent.loadSystemPrompt();
      const result = await agent.process("test input");
      return {
        isValid: true,
        result,
        agentId,
        className: agentClass.className,
      };
    } catch (error) {
      return {
        isValid: false,
        error: error.message,
        agentId,
        className: agentClass.className,
      };
    }
  }

  static async testAllGeneratedAgents(generatedAgents) {
    const testResults = [];
    for (const agent of generatedAgents) {
      const result = await this.testGeneratedAgent(agent.agentId, agent.agentClass);
      testResults.push(result);
    }
    return testResults;
  }
}

module.exports = AgentTester;
