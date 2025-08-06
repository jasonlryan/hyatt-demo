/**
 * Global Human-in-the-Loop (HITL) Manager
 * Provides consistent HITL functionality across all orchestrations
 */

class HITLManager {
  constructor() {
    this.pausedWorkflows = new Map(); // workflowId -> workflow state
    this.pauseCallbacks = new Map(); // workflowId -> callback functions
  }

  /**
   * Configure HITL settings for a workflow
   * @param {string} workflowId - Unique workflow identifier
   * @param {Object} config - HITL configuration
   * @param {boolean} config.enabled - Enable HITL for this workflow
   * @param {Array<string>} config.pauseAfter - Phases to pause after
   * @param {Function} config.onPause - Callback when workflow pauses
   * @param {Function} config.onResume - Callback when workflow resumes
   */
  configureWorkflow(workflowId, config = {}) {
    const defaultConfig = {
      enabled: false,
      pauseAfter: [], // Empty means pause after every phase
      onPause: null,
      onResume: null,
      requireFinalSignoff: true,
    };

    const workflowConfig = { ...defaultConfig, ...config };
    
    this.pauseCallbacks.set(workflowId, workflowConfig);
    
    return workflowConfig;
  }

  /**
   * Check if workflow should pause after a phase
   * @param {string} workflowId - Workflow identifier
   * @param {string} currentPhase - Current phase name
   * @param {Object} workflowState - Current workflow state
   * @returns {boolean} - Should pause
   */
  shouldPause(workflowId, currentPhase, workflowState) {
    const config = this.pauseCallbacks.get(workflowId);
    
    if (!config || !config.enabled) {
      return false;
    }

    // If pauseAfter is empty, pause after every phase
    if (config.pauseAfter.length === 0) {
      return true;
    }

    // Otherwise, only pause after specified phases
    return config.pauseAfter.includes(currentPhase);
  }

  /**
   * Pause a workflow for human review
   * @param {string} workflowId - Workflow identifier
   * @param {string} currentPhase - Phase that just completed
   * @param {Object} workflowState - Current workflow state
   * @param {Object} context - Workflow context for resume
   */
  async pauseWorkflow(workflowId, currentPhase, workflowState, context = {}) {
    const config = this.pauseCallbacks.get(workflowId);
    
    if (!config) {
      throw new Error(`No HITL configuration found for workflow ${workflowId}`);
    }

    // Store paused workflow state
    const pausedState = {
      workflowId,
      pausedAt: currentPhase,
      pausedTime: new Date().toISOString(),
      workflowState,
      originalContext: context,
      config,
    };

    this.pausedWorkflows.set(workflowId, pausedState);

    // Update workflow state
    workflowState.status = 'paused';
    workflowState.isPaused = true;
    workflowState.pausedAt = currentPhase;
    workflowState.lastUpdated = new Date().toISOString();

    // Add pause message to conversation
    if (workflowState.conversation) {
      workflowState.conversation.push({
        speaker: "System",
        message: `Workflow paused for human review after ${currentPhase.replace(/_/g, ' ')} phase. Please review the deliverable and either refine or resume.`,
        timestamp: new Date().toISOString(),
        hitlPause: true,
      });
    }

    // Execute pause callback if provided
    if (config.onPause) {
      try {
        await config.onPause(workflowId, currentPhase, workflowState);
      } catch (error) {
        console.error(`HITL pause callback error for ${workflowId}:`, error);
      }
    }

    console.log(`🔄 HITL: Workflow ${workflowId} paused after ${currentPhase} phase`);
    
    return pausedState;
  }

  /**
   * Resume a paused workflow
   * @param {string} workflowId - Workflow identifier
   * @param {Function} continueFunction - Function to continue workflow execution
   */
  async resumeWorkflow(workflowId, continueFunction) {
    const pausedState = this.pausedWorkflows.get(workflowId);
    
    if (!pausedState) {
      throw new Error(`No paused workflow found with ID ${workflowId}`);
    }

    const { workflowState, originalContext, config } = pausedState;

    // Update workflow state
    workflowState.status = 'running';
    workflowState.isPaused = false;
    workflowState.lastUpdated = new Date().toISOString();

    // Add resume message to conversation
    if (workflowState.conversation) {
      workflowState.conversation.push({
        speaker: "Human",
        message: "Workflow resumed by user",
        timestamp: new Date().toISOString(),
      });
    }

    // Remove from paused workflows
    this.pausedWorkflows.delete(workflowId);

    // Execute resume callback if provided
    if (config.onResume) {
      try {
        await config.onResume(workflowId, pausedState.pausedAt, workflowState);
      } catch (error) {
        console.error(`HITL resume callback error for ${workflowId}:`, error);
      }
    }

    console.log(`▶️ HITL: Workflow ${workflowId} resumed from ${pausedState.pausedAt} phase`);

    // Continue workflow execution
    if (continueFunction) {
      try {
        await continueFunction(workflowState, originalContext, pausedState.pausedAt);
      } catch (error) {
        console.error(`HITL resume execution error for ${workflowId}:`, error);
        workflowState.status = 'failed';
        workflowState.error = error.message;
        throw error;
      }
    }

    return workflowState;
  }

  /**
   * Refine a paused workflow with human feedback
   * @param {string} workflowId - Workflow identifier
   * @param {string} instructions - Human refinement instructions
   * @param {Function} refineFunction - Function to apply refinements
   */
  async refineWorkflow(workflowId, instructions, refineFunction) {
    const pausedState = this.pausedWorkflows.get(workflowId);
    
    if (!pausedState) {
      throw new Error(`No paused workflow found with ID ${workflowId}`);
    }

    const { workflowState } = pausedState;

    // Add refinement message to conversation
    if (workflowState.conversation) {
      workflowState.conversation.push({
        speaker: "Human",
        message: `Refinement requested: ${instructions}`,
        timestamp: new Date().toISOString(),
      });
    }

    workflowState.status = 'refining';
    workflowState.lastUpdated = new Date().toISOString();

    console.log(`🔧 HITL: Refining workflow ${workflowId} with instructions: ${instructions}`);

    // Execute refinement function if provided
    if (refineFunction) {
      try {
        await refineFunction(workflowState, instructions, pausedState);
      } catch (error) {
        console.error(`HITL refinement error for ${workflowId}:`, error);
        workflowState.status = 'failed';
        workflowState.error = error.message;
        throw error;
      }
    }

    return workflowState;
  }

  /**
   * Get all paused workflows
   * @returns {Map} - Map of paused workflows
   */
  getPausedWorkflows() {
    return new Map(this.pausedWorkflows);
  }

  /**
   * Check if a workflow is paused
   * @param {string} workflowId - Workflow identifier
   * @returns {boolean} - Is paused
   */
  isWorkflowPaused(workflowId) {
    return this.pausedWorkflows.has(workflowId);
  }

  /**
   * Get paused workflow state
   * @param {string} workflowId - Workflow identifier
   * @returns {Object|null} - Paused workflow state
   */
  getPausedWorkflowState(workflowId) {
    return this.pausedWorkflows.get(workflowId) || null;
  }

  /**
   * Clean up completed or failed workflows
   * @param {string} workflowId - Workflow identifier
   */
  cleanup(workflowId) {
    this.pausedWorkflows.delete(workflowId);
    this.pauseCallbacks.delete(workflowId);
    console.log(`🧹 HITL: Cleaned up workflow ${workflowId}`);
  }

  /**
   * Create a standardized HITL-enabled executor wrapper
   * @param {string} workflowId - Workflow identifier
   * @param {Object} phases - Phase configuration
   * @param {Object} config - HITL configuration
   * @returns {Object} - HITL-enabled executor
   */
  createExecutor(workflowId, phases, config = {}) {
    this.configureWorkflow(workflowId, config);

    return {
      async executePhase(phaseName, phaseFunction, workflowState, context) {
        console.log(`🔄 Executing phase: ${phaseName}`);
        
        // Execute the phase
        await phaseFunction(workflowState, context);
        
        // Check if should pause after this phase
        const shouldPause = this.shouldPause(workflowId, phaseName, workflowState);
        
        if (shouldPause && phaseName !== phases[phases.length - 1]) {
          // Pause (unless it's the last phase)
          await this.pauseWorkflow(workflowId, phaseName, workflowState, context);
          return { paused: true, phase: phaseName };
        }
        
        return { paused: false, phase: phaseName };
      },

      async resume(continueFunction) {
        return await this.resumeWorkflow(workflowId, continueFunction);
      },

      async refine(instructions, refineFunction) {
        return await this.refineWorkflow(workflowId, instructions, refineFunction);
      },

      cleanup: () => this.cleanup(workflowId),
    };
  }
}

// Export singleton instance
module.exports = new HITLManager();