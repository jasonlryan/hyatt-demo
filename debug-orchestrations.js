const OrchestrationManager = require('./hive/orchestrations/OrchestrationManager');

console.log('🔍 Debugging Orchestration Manager...\n');

const manager = new OrchestrationManager();

console.log('📋 Available orchestrations:', manager.getAvailableOrchestrations());
console.log('🎯 Orchestration configs:', Object.keys(manager.orchestrationConfigs));
console.log('📊 Status:', manager.getStatus());

// Test if hyatt orchestration exists
console.log('\n🧪 Testing hyatt orchestration...');
try {
  const config = manager.orchestrationConfigs['hyatt'];
  if (config) {
    console.log('✅ Hyatt config found:', config.name);
  } else {
    console.log('❌ Hyatt config not found');
    console.log('Available keys:', Object.keys(manager.orchestrationConfigs));
  }
} catch (error) {
  console.log('❌ Error accessing hyatt config:', error.message);
}

console.log('\n🎨 Frontend orchestrations:');
console.log(JSON.stringify(manager.getFrontendOrchestrations(), null, 2));
