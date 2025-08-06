/**
 * Phase Configuration System
 * 
 * This file centralizes all phase definitions for different orchestration types.
 * Extracted from hardcoded phase definitions in components to create a single source of truth.
 * 
 * Phase 1 of Orchestration Unification Plan
 */

export interface PhaseConfig {
  key: string;
  label: string; 
  icon: string;
  description?: string;
}

/**
 * Phase definitions for all orchestration types
 * These match the exact phases used in the workflow executors and components
 */
export const ORCHESTRATION_PHASES: Record<string, PhaseConfig[]> = {
  hive: [
    { 
      key: "pr_manager", 
      label: "PR Manager", 
      icon: "📋",
      description: "Establishes strategic framework and coordinates campaign response"
    },
    { 
      key: "trending", 
      label: "Trending News", 
      icon: "📰",
      description: "Analyzes cultural moments and trend data"
    },
    { 
      key: "strategic", 
      label: "Strategic Insight", 
      icon: "💡",
      description: "Discovers deeper human truths from trend analysis"
    },
    { 
      key: "story", 
      label: "Story Angles", 
      icon: "✍️",
      description: "Crafts compelling narrative angles and headlines"
    },
    { 
      key: "brand_lens", 
      label: "Brand Lens", 
      icon: "👓",
      description: "Applies brand perspective to campaign strategy"
    },
    { 
      key: "visual_prompt_generator", 
      label: "Visual Generator", 
      icon: "🎨",
      description: "Creates compelling visual concepts and generates images"
    },
    { 
      key: "brand_qa", 
      label: "Brand QA", 
      icon: "✅",
      description: "Conducts comprehensive quality assessment"
    },
  ],
  
  hyatt: [
    { 
      key: "research", 
      label: "Audience Research", 
      icon: "🔍",
      description: "Analyzes target demographics and audience insights"
    },
    { 
      key: "strategic_insight", 
      label: "Strategic Insights", 
      icon: "💡",
      description: "Develops strategic insights and positioning"
    },
    { 
      key: "trending", 
      label: "Trend Analysis", 
      icon: "📈",
      description: "Analyzes current trends and cultural moments"
    },
    { 
      key: "story", 
      label: "Story Development", 
      icon: "✍️",
      description: "Develops compelling story angles and messaging"
    },
    { 
      key: "collaborative", 
      label: "Collaborative Review", 
      icon: "🤝",
      description: "Final collaborative strategy review and refinement"
    },
  ]
};

/**
 * Get phases for a specific orchestration type
 */
export function getOrchestrationPhases(orchestrationType: string): PhaseConfig[] {
  const phases = ORCHESTRATION_PHASES[orchestrationType];
  if (!phases) {
    console.warn(`Unknown orchestration type: ${orchestrationType}. Returning empty phases array.`);
    return [];
  }
  return phases;
}

/**
 * Get a specific phase configuration
 */
export function getPhaseConfig(orchestrationType: string, phaseKey: string): PhaseConfig | null {
  const phases = getOrchestrationPhases(orchestrationType);
  return phases.find(phase => phase.key === phaseKey) || null;
}

/**
 * Validate that all required phases exist for an orchestration type
 */
export function validatePhaseConfiguration(orchestrationType: string, requiredPhases: string[]): boolean {
  const phases = getOrchestrationPhases(orchestrationType);
  const phaseKeys = phases.map(phase => phase.key);
  
  return requiredPhases.every(required => phaseKeys.includes(required));
}