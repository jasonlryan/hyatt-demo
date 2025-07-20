/**
 * Orchestrations Index
 * Central export point for all orchestrators
 */

const BaseOrchestrator = require("./classes/BaseOrchestrator");
const HyattOrchestrator = require("./classes/HyattOrchestrator");
const HiveOrchestrator = require("./classes/HiveOrchestrator");
/**
 * Factory function to create orchestrators
 * @param {string} type - The type of orchestrator ('hyatt', 'hive', or custom)
 * @param {object} config - Configuration options
 * @returns {BaseOrchestrator} The created orchestrator instance
 */
function createOrchestrator(type, config = {}) {
  switch (type.toLowerCase()) {
    case "hyatt":
      return new HyattOrchestrator(config);
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
  return ["hyatt", "hive"];
}

/**
 * Get orchestrator configuration
 * @param {string} type - The orchestrator type
 * @returns {object} The orchestrator configuration
 */
function getOrchestratorConfig(type) {
  // Configs are now generated dynamically by OrchestrationManager
  return null;
}

module.exports = {
  BaseOrchestrator,
  HyattOrchestrator,
  HiveOrchestrator,
  createOrchestrator,
  getAvailableOrchestrators,
  getOrchestratorConfig,
};
