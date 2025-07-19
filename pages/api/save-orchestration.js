import fs from "fs";
import path from "path";

// Helper function to generate documentation markdown
function generateDocumentationMarkdown(orchestration) {
  const { name, description, agents, workflows, config, documentation } =
    orchestration;

  return `# ${name}

## Overview

${documentation.overview || description}

## 🎯 Purpose

${
  documentation.useCases
    ? documentation.useCases.map((useCase) => `- ${useCase}`).join("\n")
    : "- Automated orchestration workflow"
}

## 🏗️ Architecture

### Core Components

1. **Campaign Form** (\`SharedCampaignForm\`)
   - Campaign brief input
   - Orchestration selection
   - Campaign loading from existing campaigns

2. **Progress Panel** (\`SharedProgressPanel\`)
   - Campaign status display
   - Phase tracking
   - Detailed progress access

3. **Agent Collaboration** (\`AgentCollaboration\`)
   - Real-time agent communication
   - Phase-based workflow execution
   - Manual review integration

4. **Deliverables Panel** (\`SharedDeliverablePanel\`)
   - Campaign output display
   - Deliverable management
   - Download and review capabilities

### Layout Structure

\`\`\`
┌─────────────────┬─────────────────┬─────────────────┐
│   Side Panel    │   Main Content  │  Deliverables   │
│   (Transcript)   │   (Campaign)    │    (Outputs)    │
│                 │                 │                 │
│ - Agent Messages│ - Campaign Form │ - Research      │
│ - Conversation  │ - Progress      │ - Strategy      │
│ - Status Log    │ - Collaboration │ - Content       │
└─────────────────┴─────────────────┴─────────────────┘
\`\`\`

## 🤖 Agent Configuration

### Primary Agents

${agents
  .map((agentId) => {
    const agentNames = {
      research: "Research & Audience GPT",
      trending: "Trending News GPT",
      story: "Story Angles & Headlines GPT",
      strategic: "Strategic Insight GPT",
      "pr-manager": "PR Manager GPT",
      visual_prompt_generator: "Visual Prompt Generator",
      modular_elements_recommender: "Modular Elements Recommender",
      trend_cultural_analyzer: "Trend & Cultural Analyzer",
      brand_qa: "Brand QA Agent",
    };
    return `| \`${agentId}\` | ${agentNames[agentId] || agentId} | ${
      documentation.agentRoles?.[agentId] || "Agent role in this orchestration"
    } |`;
  })
  .join("\n")}

### Agent Workflow

\`\`\`
${workflows.join(" → ")}
\`\`\`

## 📋 Workflows

${
  documentation.workflowDescription ||
  "This orchestration follows a sequential workflow pattern."
}

## ⚙️ Configuration

### Default Settings

\`\`\`json
${JSON.stringify(config, null, 2)}
\`\`\`

## 🔄 Human-in-the-Loop (HITL)

### Review Points
- After each workflow completion
- Before proceeding to next phase
- At final deliverable stage

### Actions Available
- **Resume**: Continue to next phase
- **Refine**: Provide additional instructions and retry
- **Review**: Examine detailed outputs

### HITL Toggle
- Located in page header
- Enables/disables manual review requirement
- Default: Enabled

## 📊 Deliverables

${
  documentation.deliverables
    ? documentation.deliverables
        .map((deliverable) => `- ${deliverable}`)
        .join("\n")
    : "- Campaign outputs and deliverables"
}

## 🚀 How to Use

### 1. Access the Orchestration
- Navigate to the Orchestrations page
- Select "${name}" from the list
- The orchestration interface will load

### 2. Create a Campaign
- Enter a detailed campaign brief
- Click "Create Campaign" to start
- Monitor progress in real-time

### 3. Review and Refine
- Use HITL to review outputs at each phase
- Provide refinements when needed
- Continue through the workflow

### 4. Access Deliverables
- View generated deliverables in the right panel
- Download or review specific outputs
- Use results for your campaign

## 📝 Best Practices

${
  documentation.bestPractices
    ? documentation.bestPractices.map((practice) => `- ${practice}`).join("\n")
    : "- Provide detailed campaign briefs for best results\n- Use HITL review points to ensure quality\n- Monitor agent outputs for alignment with goals"
}

## 🚧 Limitations

${
  documentation.limitations
    ? documentation.limitations
        .map((limitation) => `- ${limitation}`)
        .join("\n")
    : "- Sequential workflow execution (no parallel processing)\n- Limited customization options\n- No advanced analytics"
}

## 📋 Examples

### Good Input Examples
${
  documentation.examples?.goodInputs
    ? documentation.examples.goodInputs
        .map((example) => `- ${example}`)
        .join("\n")
    : "- Detailed campaign briefs with specific goals\n- Clear target audience descriptions\n- Specific campaign objectives and KPIs"
}

### Poor Input Examples
${
  documentation.examples?.poorInputs
    ? documentation.examples.poorInputs
        .map((example) => `- ${example}`)
        .join("\n")
    : "- Vague or incomplete briefs\n- Missing target audience information\n- Unclear campaign objectives"
}

## 🧪 Testing

### Manual Testing Checklist
- [ ] Campaign creation with valid brief
- [ ] Agent workflow execution
- [ ] HITL review functionality
- [ ] Deliverable generation and display
- [ ] Campaign loading from existing campaigns
- [ ] Error handling and recovery

## 📈 Performance Metrics

### Key Performance Indicators
- Campaign completion rate
- Agent response times
- User satisfaction scores
- Deliverable quality ratings

## 🔄 Changelog

### Version 1.0.0 (${new Date().toISOString().split("T")[0]})
- Initial implementation via Orchestration Builder
- Basic agent workflow
- HITL integration
- Deliverable management

## 📚 Related Documentation

- [Agent Mapping](./AgentMapping.md) - Detailed agent capabilities
- [Workflow Definitions](./WorkflowDefinitions.md) - Workflow specifications
- [Configuration Guide](./ConfigurationGuide.md) - Customization options
- [Feature Parity Checklist](./FeatureParityChecklist.md) - Feature completeness

---

*Last updated: ${new Date().toISOString().split("T")[0]}*
*Version: 1.0.0*
*Generated by: Orchestration Builder*
`;
}

// Helper function to update the main README.md
function updateMainReadme(orchestration, uniqueId, docsDir) {
  const readmePath = path.join(docsDir, "README.md");

  if (!fs.existsSync(readmePath)) {
    return; // Main README doesn't exist yet
  }

  let readmeContent = fs.readFileSync(readmePath, "utf8");

  // Add to the Core Orchestrations section
  const coreOrchestrationsSection = "### Core Orchestrations";
  const newOrchestrationEntry = `- [${orchestration.name}](./${uniqueId}.md) - ${orchestration.description}`;

  if (readmeContent.includes(coreOrchestrationsSection)) {
    // Find the end of the Core Orchestrations section
    const sectionStart = readmeContent.indexOf(coreOrchestrationsSection);
    const sectionEnd = readmeContent.indexOf(
      "### ",
      sectionStart + coreOrchestrationsSection.length
    );

    if (sectionEnd === -1) {
      // No next section, add at the end
      readmeContent += `\n${newOrchestrationEntry}`;
    } else {
      // Insert before the next section
      readmeContent =
        readmeContent.slice(0, sectionEnd) +
        `\n${newOrchestrationEntry}\n\n` +
        readmeContent.slice(sectionEnd);
    }
  }

  fs.writeFileSync(readmePath, readmeContent);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const orchestration = req.body;

    if (
      !orchestration.name ||
      !orchestration.agents ||
      !orchestration.workflows
    ) {
      return res.status(400).json({ error: "Invalid orchestration data" });
    }

    // Generate a unique ID for the orchestration
    const id = orchestration.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const timestamp = Date.now();
    const uniqueId = `${id}-${timestamp}`;

    // Create the orchestration object
    const newOrchestration = {
      id: uniqueId,
      name: orchestration.name,
      description: orchestration.description,
      enabled: true,
      config: {
        maxConcurrentWorkflows:
          orchestration.config.maxConcurrentWorkflows || 5,
        timeout: orchestration.config.timeout || 300000,
        retryAttempts: orchestration.config.retryAttempts || 3,
        enableLogging: orchestration.config.enableLogging !== false,
        reactiveFramework: orchestration.config.reactiveFramework || false,
        parallelExecution: orchestration.config.parallelExecution || false,
      },
      workflows: orchestration.workflows,
      agents: orchestration.agents,
      documentation: orchestration.documentation || {},
      metadata: {
        ...orchestration.metadata,
        createdBy: "orchestration-builder",
        createdAt: new Date().toISOString(),
      },
    };

    // Save to a file (in a real app, this would go to a database)
    const orchestrationsDir = path.join(
      process.cwd(),
      "data",
      "orchestrations"
    );

    // Ensure directory exists
    if (!fs.existsSync(orchestrationsDir)) {
      fs.mkdirSync(orchestrationsDir, { recursive: true });
    }

    const filePath = path.join(orchestrationsDir, `${uniqueId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(newOrchestration, null, 2));

    // Also save to a master list file
    const masterListPath = path.join(
      orchestrationsDir,
      "generated-orchestrations.json"
    );
    let masterList = [];

    if (fs.existsSync(masterListPath)) {
      masterList = JSON.parse(fs.readFileSync(masterListPath, "utf8"));
    }

    masterList.push(newOrchestration);
    fs.writeFileSync(masterListPath, JSON.stringify(masterList, null, 2));

    // Generate and save documentation
    if (orchestration.documentation) {
      const docsDir = path.join(
        process.cwd(),
        "hive",
        "orchestrations",
        "docs"
      );

      // Ensure docs directory exists
      if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir, { recursive: true });
      }

      // Generate documentation markdown
      const docContent = generateDocumentationMarkdown(orchestration);
      const docFilePath = path.join(docsDir, `${uniqueId}.md`);
      fs.writeFileSync(docFilePath, docContent);

      // Update the main README.md to include the new orchestration
      updateMainReadme(orchestration, uniqueId, docsDir);
    }

    res.status(200).json({
      success: true,
      orchestration: newOrchestration,
      message: "Orchestration and documentation saved successfully",
    });
  } catch (error) {
    console.error("Error saving orchestration:", error);
    res.status(500).json({
      error: "Failed to save orchestration",
      details: error.message,
    });
  }
}
