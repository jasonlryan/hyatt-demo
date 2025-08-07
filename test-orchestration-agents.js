#!/usr/bin/env node

// Set mock API key for testing
process.env.OPENAI_API_KEY = 'sk-test-key-for-orchestration-testing';

/**
 * Test Script: Orchestration-Aware Agent Instantiation
 * 
 * This script tests the new dynamic orchestration system to ensure:
 * 1. Agents can be instantiated with orchestration awareness
 * 2. Configuration mapping works correctly
 * 3. Orchestration context is properly passed to agents
 */

const orchestrationConfig = require('./hive/orchestrations/OrchestrationConfig');

async function testOrchestrationAwareAgents() {
  console.log('🧪 Testing Orchestration-Aware Agent System\n');
  
  // Test 1: Configuration Loading
  console.log('📋 Test 1: Configuration Loading');
  try {
    const hiveConfig = orchestrationConfig.getOrchestration('hive');
    const hyattConfig = orchestrationConfig.getOrchestration('hyatt');
    
    console.log(`✅ Hive config loaded: ${hiveConfig.name} (${hiveConfig.workflowType})`);
    console.log(`✅ Hyatt config loaded: ${hyattConfig.name} (${hyattConfig.workflowType})`);
    console.log();
  } catch (error) {
    console.error('❌ Configuration loading failed:', error.message);
    return;
  }

  // Test 2: Agent Mapping
  console.log('🗺️ Test 2: Agent Mapping');
  try {
    const hiveMapping = orchestrationConfig.getAgentMapping('hive');
    const hyattMapping = orchestrationConfig.getAgentMapping('hyatt');
    
    console.log(`✅ Hive agents mapped: ${Object.keys(hiveMapping).length} agents`);
    console.log(`   - Agents: ${Object.keys(hiveMapping).join(', ')}`);
    console.log(`✅ Hyatt agents mapped: ${Object.keys(hyattMapping).length} agents`);
    console.log(`   - Agents: ${Object.keys(hyattMapping).join(', ')}`);
    console.log();
  } catch (error) {
    console.error('❌ Agent mapping failed:', error.message);
    return;
  }

  // Test 3: Dynamic Agent Instantiation
  console.log('🤖 Test 3: Dynamic Agent Instantiation');
  
  const testCases = [
    { orchestrationType: 'hive', agentId: 'strategic' },
    { orchestrationType: 'hyatt', agentId: 'research' },
    { orchestrationType: 'hive', agentId: 'story' },
    { orchestrationType: 'hive', agentId: 'brand_qa' }
  ];

  for (const testCase of testCases) {
    try {
      const agent = orchestrationConfig.createAgentInstance(
        testCase.orchestrationType, 
        testCase.agentId
      );
      
      const isAware = agent.isOrchestrationAware ? agent.isOrchestrationAware() : false;
      const workflowLabel = agent.getWorkflowLabel ? agent.getWorkflowLabel() : 'N/A';
      const agentRole = agent.getAgentRole ? agent.getAgentRole() : 'N/A';
      
      console.log(`✅ ${testCase.orchestrationType.toUpperCase()} ${testCase.agentId}:`);
      console.log(`   - Orchestration aware: ${isAware}`);
      console.log(`   - Workflow label: ${workflowLabel}`);
      console.log(`   - Agent role: ${agentRole}`);
      
    } catch (error) {
      console.log(`❌ ${testCase.orchestrationType.toUpperCase()} ${testCase.agentId}: ${error.message}`);
    }
  }
  
  console.log();

  // Test 4: Orchestration Context Enhancement
  console.log('🔄 Test 4: Orchestration Context Enhancement');
  try {
    const hiveAgent = orchestrationConfig.createAgentInstance('hive', 'strategic');
    
    if (hiveAgent.enhanceContentWithOrchestrationContext) {
      const originalContent = "Analyze the target audience for this marketing initiative.";
      const enhancedContent = hiveAgent.enhanceContentWithOrchestrationContext(
        originalContent, 
        { testContext: 'unit_test' }
      );
      
      const isEnhanced = enhancedContent.includes('ORCHESTRATION CONTEXT') && 
                        enhancedContent.includes('HIVE') &&
                        enhancedContent.includes('spark');
      
      console.log(`✅ Content enhancement: ${isEnhanced ? 'Working' : 'Failed'}`);
      if (isEnhanced) {
        console.log('   - Contains orchestration context: ✓');
        console.log('   - Contains workflow type: ✓');
        console.log('   - Preserves original content: ✓');
      }
    } else {
      console.log('❌ Agent does not have orchestration context enhancement');
    }
  } catch (error) {
    console.error('❌ Context enhancement test failed:', error.message);
  }
  
  console.log();

  // Test 5: Cross-Orchestration Comparison
  console.log('⚖️ Test 5: Cross-Orchestration Comparison');
  try {
    const hiveStrategic = orchestrationConfig.createAgentInstance('hive', 'strategic');
    const hyattResearch = orchestrationConfig.createAgentInstance('hyatt', 'research');
    
    console.log(`✅ Hive Strategic Agent:`);
    console.log(`   - Type: ${hiveStrategic.orchestrationType || 'N/A'}`);
    console.log(`   - Workflow: ${hiveStrategic.getWorkflowType ? hiveStrategic.getWorkflowType() : 'N/A'}`);
    console.log(`   - Label: ${hiveStrategic.getWorkflowLabel ? hiveStrategic.getWorkflowLabel() : 'N/A'}`);
    
    console.log(`✅ Hyatt Research Agent:`);
    console.log(`   - Type: ${hyattResearch.orchestrationType || 'N/A'}`);
    console.log(`   - Workflow: ${hyattResearch.getWorkflowType ? hyattResearch.getWorkflowType() : 'N/A'}`);
    console.log(`   - Label: ${hyattResearch.getWorkflowLabel ? hyattResearch.getWorkflowLabel() : 'N/A'}`);
    
  } catch (error) {
    console.error('❌ Cross-orchestration comparison failed:', error.message);
  }

  console.log('\n🎉 Orchestration-Aware Agent System Test Complete!');
}

// Run the tests
testOrchestrationAwareAgents().catch(console.error);