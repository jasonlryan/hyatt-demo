/**
 * Global HITL (Human-in-the-Loop) Routes
 * Provides consistent HITL endpoints across all orchestrations
 */

const HITLManager = require('../utils/HITLManager');

module.exports = function (app, { orchestrationManager }) {
  
  // Get HITL status for a workflow
  app.get('/api/hitl/:workflowId', async (req, res) => {
    try {
      const { workflowId } = req.params;
      
      const isPaused = HITLManager.isWorkflowPaused(workflowId);
      const pausedState = HITLManager.getPausedWorkflowState(workflowId);
      
      res.json({
        workflowId,
        isPaused,
        pausedState: pausedState ? {
          pausedAt: pausedState.pausedAt,
          pausedTime: pausedState.pausedTime,
          status: pausedState.workflowState.status
        } : null
      });
    } catch (error) {
      console.error('Get HITL status error:', error);
      res.status(500).json({ error: 'Failed to get HITL status', details: error.message });
    }
  });

  // Resume a paused workflow
  app.post('/api/hitl/:workflowId/resume', async (req, res) => {
    try {
      const { workflowId } = req.params;
      
      if (!HITLManager.isWorkflowPaused(workflowId)) {
        return res.status(400).json({ error: 'Workflow is not paused' });
      }

      // Create continue function that works with any orchestration
      const continueFunction = async (workflowState, originalContext, pausedAt) => {
        // Try to find the orchestration that owns this workflow
        for (const orchestrationId of orchestrationManager.getAvailableOrchestrations()) {
          const orchestration = orchestrationManager.getLoadedOrchestration(orchestrationId);
          
          if (orchestration) {
            // Check if this orchestration has this workflow/campaign
            const campaign = orchestration.campaigns?.get(workflowId);
            
            if (campaign) {
              // Use Hyatt-style resume
              const resumed = orchestration.resumeCampaign(workflowId);
              if (resumed) return;
            }
            
            // For Hive-style workflows, check activeWorkflows
            // This would need to be passed in or made globally accessible
            // For now, we'll handle this in the specific orchestration routes
          }
        }
        
        throw new Error(`Could not find orchestration for workflow ${workflowId}`);
      };

      await HITLManager.resumeWorkflow(workflowId, continueFunction);
      
      res.json({ 
        status: 'resumed', 
        workflowId,
        message: 'Workflow resumed successfully'
      });
    } catch (error) {
      console.error('Resume HITL workflow error:', error);
      res.status(500).json({ error: 'Failed to resume workflow', details: error.message });
    }
  });

  // Refine a paused workflow
  app.post('/api/hitl/:workflowId/refine', async (req, res) => {
    try {
      const { workflowId } = req.params;
      const { instructions } = req.body;
      
      if (!instructions) {
        return res.status(400).json({ error: 'Refinement instructions are required' });
      }

      if (!HITLManager.isWorkflowPaused(workflowId)) {
        return res.status(400).json({ error: 'Workflow is not paused' });
      }

      // Create refine function that works with any orchestration
      const refineFunction = async (workflowState, instructions, pausedState) => {
        // Try to find the orchestration that owns this workflow
        for (const orchestrationId of orchestrationManager.getAvailableOrchestrations()) {
          const orchestration = orchestrationManager.getLoadedOrchestration(orchestrationId);
          
          if (orchestration) {
            // Check if this orchestration has this workflow/campaign
            const campaign = orchestration.campaigns?.get(workflowId);
            
            if (campaign) {
              // Use Hyatt-style refine
              const refined = orchestration.refineCampaign(workflowId, instructions);
              if (refined) return;
            }
          }
        }
        
        // For other workflow types, we'd implement refinement logic here
        throw new Error(`Could not find orchestration for workflow ${workflowId}`);
      };

      await HITLManager.refineWorkflow(workflowId, instructions, refineFunction);
      
      res.json({ 
        status: 'refining', 
        workflowId,
        message: 'Refinement applied successfully'
      });
    } catch (error) {
      console.error('Refine HITL workflow error:', error);
      res.status(500).json({ error: 'Failed to refine workflow', details: error.message });
    }
  });

  // Get all paused workflows
  app.get('/api/hitl/paused', async (req, res) => {
    try {
      const pausedWorkflows = HITLManager.getPausedWorkflows();
      const workflowList = Array.from(pausedWorkflows.entries()).map(([id, state]) => ({
        workflowId: id,
        pausedAt: state.pausedAt,
        pausedTime: state.pausedTime,
        status: state.workflowState.status,
        type: state.config.orchestrationType || 'unknown'
      }));
      
      res.json({ pausedWorkflows: workflowList });
    } catch (error) {
      console.error('Get paused workflows error:', error);
      res.status(500).json({ error: 'Failed to get paused workflows', details: error.message });
    }
  });

  // Clean up completed workflow
  app.delete('/api/hitl/:workflowId', async (req, res) => {
    try {
      const { workflowId } = req.params;
      
      HITLManager.cleanup(workflowId);
      
      res.json({ 
        status: 'cleaned', 
        workflowId,
        message: 'Workflow cleaned up successfully'
      });
    } catch (error) {
      console.error('Clean up HITL workflow error:', error);
      res.status(500).json({ error: 'Failed to clean up workflow', details: error.message });
    }
  });
};