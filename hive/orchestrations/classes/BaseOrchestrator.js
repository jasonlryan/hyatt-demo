/**
 * Base Orchestrator Class
 * Provides common functionality for all orchestrators
 */

class BaseOrchestrator {
  constructor(config = {}) {
    this.config = {
      name: "BaseOrchestrator",
      version: "1.0.0",
      agents: [],
      workflows: [],
      ...config,
    };

    this.agents = new Map();
    this.workflows = new Map();
    this.activeWorkflows = new Map();
    this.logs = [];
  }

  /**
   * Initialize the orchestrator
   */
  async initialize() {
    this.log("Initializing orchestrator...");
    try {
      await this.loadAgents();
      await this.loadWorkflows();
      this.log("Orchestrator initialized successfully");
      return true;
    } catch (error) {
      this.log(`Failed to initialize orchestrator: ${error.message}`, "error");
      throw error;
    }
  }

  /**
   * Load available agents
   */
  async loadAgents() {
    // To be implemented by subclasses
    this.log("Loading agents...");
  }

  /**
   * Load available workflows
   */
  async loadWorkflows() {
    // To be implemented by subclasses
    this.log("Loading workflows...");
  }

  /**
   * Start a workflow
   */
  async startWorkflow(workflowId, input = {}) {
    this.log(`Starting workflow: ${workflowId}`);
    try {
      const workflow = this.workflows.get(workflowId);
      if (!workflow) {
        throw new Error(`Workflow ${workflowId} not found`);
      }

      const executionId = this.generateExecutionId();
      const execution = {
        id: executionId,
        workflowId,
        input,
        status: "running",
        startTime: new Date(),
        steps: [],
        results: {},
      };

      this.activeWorkflows.set(executionId, execution);

      const result = await this.executeWorkflow(workflow, execution);

      execution.status = "completed";
      execution.endTime = new Date();
      execution.results = result;

      this.log(`Workflow ${workflowId} completed successfully`);
      return result;
    } catch (error) {
      this.log(`Workflow ${workflowId} failed: ${error.message}`, "error");
      throw error;
    }
  }

  /**
   * Execute a workflow (to be implemented by subclasses)
   */
  async executeWorkflow(workflow, execution) {
    // To be implemented by subclasses
    throw new Error("executeWorkflow must be implemented by subclass");
  }

  /**
   * Get orchestrator status
   */
  getStatus() {
    return {
      name: this.config.name,
      version: this.config.version,
      agents: Array.from(this.agents.keys()),
      workflows: Array.from(this.workflows.keys()),
      activeWorkflows: Array.from(this.activeWorkflows.keys()),
      logs: this.logs.slice(-50), // Last 50 logs
    };
  }

  /**
   * Log a message
   */
  log(message, level = "info") {
    const logEntry = {
      timestamp: new Date(),
      level,
      message,
      orchestrator: this.config.name,
    };

    this.logs.push(logEntry);
    console.log(`[${this.config.name}] ${level.toUpperCase()}: ${message}`);
  }

  /**
   * Generate unique execution ID
   */
  generateExecutionId() {
    return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clean up resources
   */
  async cleanup() {
    this.log("Cleaning up orchestrator...");
    this.activeWorkflows.clear();
    this.logs = [];
  }
}

module.exports = BaseOrchestrator;
