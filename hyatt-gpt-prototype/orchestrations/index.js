/**
 * Orchestrations Index
 * Central export point for all orchestrators
 */

const BaseOrchestrator = require("./classes/BaseOrchestrator");
const AgentOrchestrator = require("./classes/AgentOrchestrator");
const HiveOrchestrator = require("./classes/HiveOrchestrator");
const orchestrationsConfig = require("./configs/orchestrations.config.json");

/**
 * Factory function to create orchestrators
 * @param {string} type - The type of orchestrator ('agent', 'hive', or custom)
 * @param {object} config - Configuration options
 * @returns {BaseOrchestrator} The created orchestrator instance
 */
function createOrchestrator(type, config = {}) {
  switch (type.toLowerCase()) {
    case "agent":
      return new AgentOrchestrator(config);
    case "hive":
      return new HiveOrchestrator(config);
    default:
      throw new Error(`Unknown orchestrator type: ${type}`);
  }
}

/**
 * Get available orchestrator types
 * @returns {string[]} Array of available orchestrator types
 */
function getAvailableOrchestrators() {
  return Object.keys(orchestrationsConfig.orchestrators);
}

/**
 * Get orchestrator configuration
 * @param {string} type - The orchestrator type
 * @returns {object} The orchestrator configuration
 */
function getOrchestratorConfig(type) {
  return orchestrationsConfig.orchestrators[type] || null;
}

module.exports = {
  BaseOrchestrator,
  AgentOrchestrator,
  HiveOrchestrator,
  createOrchestrator,
  getAvailableOrchestrators,
  getOrchestratorConfig,
  config: orchestrationsConfig,
};
