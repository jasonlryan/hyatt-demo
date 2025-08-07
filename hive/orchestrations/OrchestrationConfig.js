const fs = require('fs');
const path = require('path');

class OrchestrationConfig {
  constructor() {
    this.config = null;
    this.loadConfig();
  }

  loadConfig() {
    try {
      const configPath = path.join(__dirname, 'orchestrations.config.json');
      const configData = fs.readFileSync(configPath, 'utf8');
      this.config = JSON.parse(configData);
    } catch (error) {
      console.error('Failed to load orchestration config:', error);
      this.config = { orchestrations: {} };
    }
  }

  getOrchestration(type) {
    return this.config.orchestrations[type] || null;
  }

  getWorkflow(type) {
    const orchestration = this.getOrchestration(type);
    return orchestration ? orchestration.workflow : [];
  }

  getNextAgent(type, currentAgent) {
    const workflow = this.getWorkflow(type);
    const currentIndex = workflow.findIndex(step => step.agent === currentAgent);
    
    if (currentIndex === -1 || currentIndex === workflow.length - 1) {
      return null;
    }
    
    return workflow[currentIndex + 1];
  }

  getWorkflowDescription(type) {
    const workflow = this.getWorkflow(type);
    return workflow.map(step => step.name).join(' → ');
  }

  getWorkflowType(type) {
    const orchestration = this.getOrchestration(type);
    return orchestration ? orchestration.workflowType : null;
  }

  getWorkflowLabel(type) {
    const orchestration = this.getOrchestration(type);
    return orchestration ? orchestration.workflowLabel : 'Workflow';
  }

  getUI(type) {
    const orchestration = this.getOrchestration(type);
    return orchestration ? orchestration.ui : {
      displayName: 'Default Orchestrator',
      createNew: 'Create New Workflow',
      briefLabel: 'Workflow Brief',
      buttonCreate: 'Create Workflow',
      buttonLoad: 'Load Workflow',
      workflowNoun: 'Workflow',
      workflowNounPlural: 'Workflows'
    };
  }

  getAgentRole(type, agentId) {
    const workflow = this.getWorkflow(type);
    const agent = workflow.find(step => step.agent === agentId);
    return agent ? agent.role : null;
  }

  getAllOrchestrationTypes() {
    return Object.keys(this.config.orchestrations);
  }

  // Agent mapping methods
  getAgentMapping(type) {
    const orchestration = this.getOrchestration(type);
    return orchestration ? orchestration.agentMapping : {};
  }

  getAgentClass(type, agentId) {
    const mapping = this.getAgentMapping(type);
    return mapping[agentId] ? mapping[agentId].agentClass : null;
  }

  getAgentFile(type, agentId) {
    const mapping = this.getAgentMapping(type);
    return mapping[agentId] ? mapping[agentId].agentFile : null;
  }

  // Create agent instance dynamically
  createAgentInstance(type, agentId, options = {}) {
    const agentFile = this.getAgentFile(type, agentId);
    if (!agentFile) {
      throw new Error(`Agent mapping not found for ${agentId} in ${type} orchestration`);
    }

    try {
      const path = require('path');
      const agentPath = path.resolve(__dirname, agentFile);
      const AgentClass = require(agentPath);
      
      // Pass orchestration type to constructor for orchestration-aware agents
      const agentOptions = { ...options, orchestrationType: type };
      return new AgentClass(agentOptions);
    } catch (error) {
      console.error(`Failed to create agent instance for ${agentId}:`, error);
      throw new Error(`Failed to instantiate agent ${agentId}: ${error.message}`);
    }
  }
}

module.exports = new OrchestrationConfig();