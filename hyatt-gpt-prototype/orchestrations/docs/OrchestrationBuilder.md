# Orchestration Builder

## Overview

The Orchestration Builder is a **meta-orchestration** that enables users to generate new orchestrations by describing their requirements in natural language. It leverages OpenAI's API and the system's agent library to create practical, ready-to-use orchestrations.

## 🎯 Purpose

- **Democratize Orchestration Creation**: Allow non-technical users to create orchestrations
- **Rapid Prototyping**: Quickly generate orchestration concepts and configurations
- **Consistency**: Ensure all generated orchestrations follow established patterns
- **Scalability**: Enable unlimited custom orchestration creation

## 🏗️ Architecture

### Components

1. **Frontend UI** (`OrchestrationBuilderPage.tsx`)

   - Description input form
   - Generation progress indicator
   - Preview modal with generated orchestration
   - Save functionality

2. **AI Generation API** (`/api/generate-orchestration`)

   - Processes natural language descriptions
   - Uses OpenAI GPT-4o with structured outputs
   - Generates orchestration specifications

3. **Save API** (`/api/save-orchestration`)
   - Persists generated orchestrations
   - Creates unique IDs and metadata
   - Stores to file system (extensible to database)

### Data Flow

```
User Input → AI Analysis → Orchestration Spec → Preview → Save → Available Orchestration
```

## 🚀 How to Use

### 1. Access the Builder

- Navigate to the Orchestrations page
- Select "Orchestration Builder" from the list
- The builder interface will load

### 2. Describe Your Orchestration

Enter a detailed description of what you want the orchestration to do:

**Good Examples:**

- "A crisis management orchestration that monitors social media, analyzes sentiment, and generates response strategies"
- "A product launch orchestration that researches competitors, creates launch materials, and plans media outreach"
- "A content marketing orchestration that researches trending topics, creates blog posts, and distributes them across social media platforms"

**Poor Examples:**

- "Make an orchestration" (too vague)
- "Something for marketing" (not specific enough)

### 3. Generate and Review

- Click "Generate Orchestration"
- Review the generated agents, workflows, and configuration
- Make adjustments if needed

### 4. Save and Use

- Click "Save Orchestration" to persist it
- The orchestration becomes available in your orchestrations list
- **Automatic Documentation**: Complete documentation is generated and saved

## 📋 Generated Orchestration Structure

```json
{
  "name": "Descriptive name for the orchestration",
  "description": "Detailed description of what this orchestration does",
  "agents": ["research", "trending", "pr-manager"],
  "workflows": ["research_workflow", "content_creation"],
  "config": {
    "maxConcurrentWorkflows": 3,
    "timeout": 300000,
    "retryAttempts": 2,
    "enableLogging": true,
    "reactiveFramework": true,
    "parallelExecution": true
  },
  "documentation": {
    "overview": "Comprehensive overview of the orchestration's purpose and capabilities",
    "useCases": ["Specific use case 1", "Specific use case 2"],
    "workflowDescription": "Detailed description of how the workflow operates",
    "agentRoles": {
      "research": "Detailed description of research agent's role",
      "trending": "Detailed description of trending agent's role"
    },
    "deliverables": ["Expected output 1", "Expected output 2"],
    "configuration": "Explanation of configuration options and their impact",
    "bestPractices": ["Best practice 1", "Best practice 2"],
    "limitations": ["Current limitation 1", "Current limitation 2"],
    "examples": {
      "goodInputs": ["Good input example 1", "Good input example 2"],
      "poorInputs": ["Poor input example 1", "Poor input example 2"]
    }
  },
  "metadata": {
    "generatedAt": "2024-07-XXT00:00:00.000Z",
    "sourceDescription": "Original user description",
    "model": "gpt-4o-2024-08-06",
    "createdBy": "orchestration-builder"
  }
}
```

## 🤖 AI Agent Integration

The builder uses the existing agent library from `agents.config.json`:

### Available Agents

- **research**: Audience research and demographic analysis
- **trending**: Trend identification and news opportunities
- **story**: Story angles and headline creation
- **strategic**: Strategic insights and recommendations
- **pr-manager**: Campaign coordination and strategy management
- **visual_prompt_generator**: Visual creative prompts
- **modular_elements_recommender**: Modular visual elements
- **trend_cultural_analyzer**: Cultural trend analysis
- **brand_qa**: Brand alignment and quality assurance

### Agent Selection Logic

The AI analyzes the description and selects the most relevant agents based on:

- Keywords and context
- Required capabilities
- Workflow dependencies
- Best practices for the use case

## 🔧 Configuration

### AI Model Settings

- **Model**: `gpt-4o-2024-08-06` (supports structured outputs)
- **Temperature**: 0.3 (balanced creativity and consistency)
- **Max Tokens**: 2000
- **Response Format**: JSON object

### System Prompt

The AI uses a comprehensive system prompt that includes:

- Available agent types and their capabilities
- Required output structure
- Best practices for orchestration design
- Validation requirements

## 📁 File Storage

### Generated Orchestrations

- **Location**: `/data/orchestrations/`
- **Individual Files**: `{orchestration-id}.json`
- **Master List**: `generated-orchestrations.json`

### Generated Documentation

- **Location**: `/hyatt-gpt-prototype/orchestrations/docs/`
- **Individual Files**: `{orchestration-id}.md`
- **Main Index**: `README.md` (automatically updated)

### File Naming Convention

- Generated ID: `{name-slug}-{timestamp}`
- Example: `crisis-management-1703123456789.json`
- Documentation: `crisis-management-1703123456789.md`

## 📚 Automatic Documentation Generation

### Documentation Features

The Orchestration Builder automatically generates comprehensive documentation for every orchestration it creates:

- **Complete Markdown Files**: Full documentation following the established template
- **Agent Role Descriptions**: Detailed explanations of each agent's role in the orchestration
- **Use Cases and Examples**: Practical examples of good and poor inputs
- **Best Practices**: Guidelines for effective use of the orchestration
- **Configuration Explanations**: Details about configuration options and their impact
- **Limitations and Considerations**: Honest assessment of current limitations

### Documentation Structure

Each generated orchestration includes:

1. **Overview**: Purpose and capabilities
2. **Architecture**: Component descriptions and layout
3. **Agent Configuration**: Detailed agent roles and workflows
4. **Usage Instructions**: Step-by-step guide
5. **Best Practices**: Guidelines for optimal results
6. **Examples**: Good and poor input examples
7. **Testing Checklist**: Manual testing guidelines
8. **Changelog**: Version tracking and updates

### Integration with Main Documentation

- **Automatic Indexing**: New orchestrations are automatically added to the main README
- **Cross-References**: Links to related documentation (Agent Mapping, etc.)
- **Consistent Formatting**: Follows established documentation standards
- **Version Control**: Includes creation dates and version information

## 🔍 Error Handling

### AI Generation Failures

- Fallback to mock data with basic agent selection
- Error logging for debugging
- User-friendly error messages

### Save Failures

- Validation of orchestration structure
- File system error handling
- Rollback mechanisms

### Documentation Failures

- Graceful handling of documentation generation errors
- Fallback to basic documentation template
- Error logging for debugging

## 🚧 Limitations

### Current Limitations

- **AI Dependency**: Quality depends on OpenAI API availability
- **Agent Library**: Limited to existing agent types
- **No Editing**: Generated orchestrations cannot be edited (planned feature)
- **No Versioning**: No built-in version control (planned feature)

### Planned Improvements

- **Orchestration Editor**: Edit generated orchestrations
- **Version Control**: Track changes and rollbacks
- **Template Library**: Pre-built orchestration templates
- **Advanced Validation**: More sophisticated orchestration validation

## 🧪 Testing

### Manual Testing

1. Test with various description types
2. Verify agent selection accuracy
3. Check configuration appropriateness
4. Validate save and load functionality

### Automated Testing

- Unit tests for API endpoints
- Integration tests for AI generation
- UI component tests
- End-to-end workflow tests

## 📊 Metrics and Monitoring

### Key Metrics

- Generation success rate
- User satisfaction with generated orchestrations
- Most common use cases
- AI response times

### Monitoring

- API response times
- Error rates
- User interaction patterns
- Generated orchestration quality

## 🔄 Changelog

### Version 1.0.0 (2024-07-XX)

- Initial implementation
- Basic AI-powered orchestration generation
- Save and load functionality
- Integration with existing agent library
- **Automatic documentation generation**
- **Complete markdown documentation templates**
- **Main documentation index integration**

### Planned Features

- Orchestration editing capabilities
- Version control and rollbacks
- Template library
- Advanced validation and optimization

## 📚 Related Documentation

- [Agent Mapping](./AgentMapping.md) - Detailed agent capabilities
- [Configuration Guide](./ConfigurationGuide.md) - How to customize orchestrations
- [Feature Parity Checklist](./FeatureParityChecklist.md) - Ensuring consistency

---

_Last updated: 2024-07-XX_
_Version: 1.0.0_
