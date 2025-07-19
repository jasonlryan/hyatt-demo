# 🎨 Proactive Styling Integration Plan

## 🎯 **Overview**

This plan outlines how to integrate the proactive styling prompt into all generators, development workflows, and AI-powered systems in the Hive application to ensure consistent styling from day one.

> **Important**: All newly generated orchestrations and pages must use the unified styling system and design tokens. Hardcoded colors are never allowed.

## 🏗️ **1. Orchestration Generator Integration**

### **Current State**

- **File**: `pages/api/generate-orchestration.js`
- **Function**: Generates orchestration configurations (agents, workflows, config)
- **Limitation**: Does not generate UI components or React code

### **Enhanced Integration**

#### **1.1 Extend Orchestration Generator**

**Update**: `pages/api/generate-orchestration.js`

```javascript
// Add to system prompt
const systemPrompt = `You are an AI orchestration architect. Based on a description, generate a complete orchestration specification including agents, workflows, configuration, and comprehensive documentation.

CRITICAL STYLING REQUIREMENTS:
- When generating any UI components or React code, ALWAYS use the unified design token system
- NEVER use hardcoded colors (bg-blue-*, text-green-*, bg-gray-*, etc.)
- ALWAYS use design tokens (bg-primary, text-text-primary, border-border, etc.)
- Follow established component patterns from the Hive application

DESIGN TOKEN SYSTEM:
- Primary actions: bg-primary hover:bg-primary-hover text-white
- Success states: bg-success hover:bg-success-hover text-white
- Text hierarchy: text-text-primary (headings), text-text-secondary (body), text-text-muted (helper)
- Backgrounds: bg-secondary (containers), bg-bg-primary (main content)
- Borders: border border-border (standard), border-t border-border (dividers)
- Focus states: focus:ring-2 focus:ring-primary focus:border-primary

COMPONENT PATTERNS:
- Buttons: px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded transition-colors
- Cards: bg-white rounded-lg shadow-md p-6 border border-border
- Forms: w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition
- Status indicators: inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-light text-success

Available agent types to choose from:
[existing agent list...]

Generate a JSON response with this structure:
{
  "name": "Descriptive name for the orchestration",
  "description": "Detailed description of what this orchestration does",
  "agents": ["array", "of", "relevant", "agent", "ids"],
  "workflows": ["array", "of", "workflow", "names"],
  "config": {
    "maxConcurrentWorkflows": 3-10,
    "timeout": 300000-600000,
    "retryAttempts": 2-3,
    "enableLogging": true,
    "reactiveFramework": boolean,
    "parallelExecution": boolean
  },
  "documentation": {
    "overview": "Comprehensive overview of the orchestration's purpose and capabilities",
    "useCases": ["array", "of", "specific", "use", "cases"],
    "workflowDescription": "Detailed description of how the workflow operates",
    "agentRoles": {
      "agent_id": "Detailed description of this agent's role in this orchestration"
    },
    "deliverables": ["array", "of", "expected", "outputs"],
    "configuration": "Explanation of configuration options and their impact",
    "bestPractices": ["array", "of", "best", "practices", "for", "using", "this", "orchestration"],
    "limitations": ["array", "of", "current", "limitations", "or", "considerations"],
    "examples": {
      "goodInputs": ["array", "of", "good", "input", "examples"],
      "poorInputs": ["array", "of", "poor", "input", "examples"]
    }
  },
  "uiComponents": {
    "customComponents": [
      {
        "name": "ComponentName",
        "description": "What this component does",
        "reactCode": "// React component code using design tokens only",
        "usage": "How to use this component"
      }
    ],
    "stylingNotes": "Any specific styling considerations for this orchestration"
  }
}

Make the orchestration practical and focused on the described use case. Include comprehensive documentation that would help users understand and effectively use the orchestration. When generating any UI components, ensure they follow the unified styling system.`;
```

#### **1.2 New API Endpoint for Component Generation**

**Create**: `pages/api/generate-component.js`

```javascript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { componentType, requirements, orchestrationContext } = req.body;

    const systemPrompt = `You are a React component generator for the Hive application.

CRITICAL STYLING REQUIREMENTS:
- NEVER use hardcoded Tailwind colors (bg-blue-*, text-green-*, bg-gray-*, etc.)
- ALWAYS use the unified design token system
- Follow established patterns from existing components
- Ensure accessibility and brand consistency

DESIGN TOKEN SYSTEM:
- Primary actions: bg-primary hover:bg-primary-hover text-white
- Success states: bg-success hover:bg-success-hover text-white
- Text hierarchy: text-text-primary (headings), text-text-secondary (body), text-text-muted (helper)
- Backgrounds: bg-secondary (containers), bg-bg-primary (main content)
- Borders: border border-border (standard), border-t border-border (dividers)
- Focus states: focus:ring-2 focus:ring-primary focus:border-primary

COMPONENT PATTERNS:
- Buttons: px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded transition-colors
- Cards: bg-white rounded-lg shadow-md p-6 border border-border
- Forms: w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition
- Status indicators: inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-light text-success

Generate a complete React component that:
1. Uses ONLY design tokens for styling
2. Follows established patterns from the Hive application
3. Includes proper TypeScript interfaces
4. Has proper accessibility features
5. Includes hover and focus states
6. Is responsive and well-structured

Return the component as a complete, ready-to-use React TypeScript file.`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Generate a ${componentType} component for: ${requirements}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const generatedComponent = completion.choices[0].message.content;

    res.status(200).json({
      component: generatedComponent,
      metadata: {
        generatedAt: new Date().toISOString(),
        componentType,
        requirements,
        orchestrationContext,
      },
    });
  } catch (error) {
    console.error("Error generating component:", error);
    res.status(500).json({
      error: "Failed to generate component",
      details: error.message,
    });
  }
}
```

## 🎨 **2. Page Generator Integration**

### **2.1 New Page Generator API**

**Create**: `pages/api/generate-page.js`

```javascript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { pageType, requirements, features } = req.body;

    const systemPrompt = `You are a React page generator for the Hive application.

CRITICAL STYLING REQUIREMENTS:
- NEVER use hardcoded Tailwind colors (bg-blue-*, text-green-*, bg-gray-*, etc.)
- ALWAYS use the unified design token system
- Follow established patterns from existing pages
- Ensure accessibility and brand consistency

DESIGN TOKEN SYSTEM:
- Primary actions: bg-primary hover:bg-primary-hover text-white
- Success states: bg-success hover:bg-success-hover text-white
- Text hierarchy: text-text-primary (headings), text-text-secondary (body), text-text-muted (helper)
- Backgrounds: bg-secondary (containers), bg-bg-primary (main content)
- Borders: border border-border (standard), border-t border-border (dividers)
- Focus states: focus:ring-2 focus:ring-primary focus:border-primary

PAGE PATTERNS:
- Page container: bg-secondary min-h-screen
- Main content: max-w-7xl mx-auto px-4 py-8
- Page header: text-2xl font-bold text-text-primary mb-6
- Content cards: bg-white rounded-lg shadow-md p-6 border border-border
- Action buttons: px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded transition-colors font-medium

Generate a complete React page that:
1. Uses ONLY design tokens for styling
2. Follows established page patterns from the Hive application
3. Includes proper TypeScript interfaces
4. Has proper accessibility features
5. Is responsive and well-structured
6. Integrates with existing shared components when appropriate

Return the page as a complete, ready-to-use React TypeScript file.`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Generate a ${pageType} page with features: ${features}. Requirements: ${requirements}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 3000,
    });

    const generatedPage = completion.choices[0].message.content;

    res.status(200).json({
      page: generatedPage,
      metadata: {
        generatedAt: new Date().toISOString(),
        pageType,
        requirements,
        features,
      },
    });
  } catch (error) {
    console.error("Error generating page:", error);
    res.status(500).json({
      error: "Failed to generate page",
      details: error.message,
    });
  }
}
```

## 🗂️ **3. File System Integration**

### **3.1 Generated Files Structure**

**Create**: File organization system for generated components

```bash
frontend/src/components/orchestrations/
├── generated/                    # Generated orchestration pages
│   ├── index.ts                 # Dynamic exports
│   ├── [orchestration-id].tsx   # Generated orchestration pages
│   └── types.ts                 # Generated TypeScript types
├── shared/                      # Shared orchestration components
└── templates/                   # Orchestration templates
```

### **3.2 Dynamic Export System**

**Create**: `frontend/src/components/orchestrations/generated/index.ts`

```typescript
// Dynamic orchestration page loader
export const loadOrchestrationPage = async (orchestrationId: string) => {
  try {
    // Try to load the specific generated page
    const module = await import(`./${orchestrationId}.tsx`);
    return module.default;
  } catch (error) {
    // Fallback to generic template
    const { default: GenericOrchestrationPage } = await import(
      "../GenericOrchestrationPage"
    );
    return GenericOrchestrationPage;
  }
};

// Type for generated orchestration pages
export interface GeneratedOrchestrationPageProps {
  orchestrationId: string;
  orchestrationName: string;
  hitlReview?: boolean;
  onToggleHitl?: () => void;
  onNavigateToOrchestrations?: () => void;
}
```

### **3.3 File Generation Service**

**Create**: `utils/fileGenerator.js`

```javascript
import fs from "fs";
import path from "path";

export class FileGenerator {
  constructor(baseDir = process.cwd()) {
    this.baseDir = baseDir;
    this.generatedDir = path.join(
      baseDir,
      "frontend/src/components/orchestrations/generated"
    );
  }

  async generateOrchestrationPage(
    orchestrationId,
    orchestrationName,
    pageCode
  ) {
    // Ensure directory exists
    await this.ensureDirectoryExists(this.generatedDir);

    // Generate the page file
    const fileName = `${orchestrationId}.tsx`;
    const filePath = path.join(this.generatedDir, fileName);

    const fullPageCode = `// Auto-generated orchestration page for ${orchestrationName}
// Generated at: ${new Date().toISOString()}
// Do not edit manually - regenerate via Orchestration Builder

${pageCode}`;

    await fs.promises.writeFile(filePath, fullPageCode, "utf8");

    // Update the index file
    await this.updateIndexFile(orchestrationId, orchestrationName);

    return filePath;
  }

  async ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      await fs.promises.mkdir(dirPath, { recursive: true });
    }
  }

  async updateIndexFile(orchestrationId, orchestrationName) {
    const indexPath = path.join(this.generatedDir, "index.ts");

    let indexContent = "";
    if (fs.existsSync(indexPath)) {
      indexContent = await fs.promises.readFile(indexPath, "utf8");
    }

    // Add export if not already present
    const exportLine = `export { default as ${orchestrationId}Page } from './${orchestrationId}';`;

    if (!indexContent.includes(exportLine)) {
      indexContent += `\n${exportLine}`;
      await fs.promises.writeFile(indexPath, indexContent, "utf8");
    }
  }

  async cleanupOrchestrationPage(orchestrationId) {
    const filePath = path.join(this.generatedDir, `${orchestrationId}.tsx`);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }
}
```

## 🔄 **4. Dynamic Page Loading System**

### **4.1 Enhanced App.tsx**

**Update**: `frontend/src/App.tsx`

```typescript
import { useState, useEffect, Suspense } from "react";
import { useOrchestrationNavigation } from "./hooks/useOrchestrationNavigation";
import GlobalNav from "./components/GlobalNav";
import AgentsPage from "./components/AgentsPage";
import WorkflowsPage from "./components/WorkflowsPage";
import OrchestrationsPage from "./components/OrchestrationsPage";
import HyattOrchestrationPage from "./components/orchestrations/HyattOrchestrationPage";
import HiveOrchestrationPage from "./components/orchestrations/HiveOrchestrationPage";
import TemplateOrchestrationPage from "./components/orchestrations/TemplateOrchestrationPage";
import OrchestrationBuilderPage from "./components/orchestrations/OrchestrationBuilderPage";
import HitlReviewModal from "./components/HitlReviewModal";
import StylePanel from "./components/StylePanel";
import { loadOrchestrationPage } from "./components/orchestrations/generated";
import "./components/deliverableStyles.css";

// Loading component for dynamic imports
const OrchestrationPageLoader = ({ orchestrationId, ...props }) => {
  const [OrchestrationComponent, setOrchestrationComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true);
        const Component = await loadOrchestrationPage(orchestrationId);
        setOrchestrationComponent(() => Component);
      } catch (err) {
        console.error(
          `Failed to load orchestration page for ${orchestrationId}:`,
          err
        );
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [orchestrationId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading orchestration...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-error mb-4">Failed to load orchestration</p>
          <p className="text-text-secondary">Using generic template</p>
        </div>
      </div>
    );
  }

  return OrchestrationComponent ? <OrchestrationComponent {...props} /> : null;
};

function App() {
  // ... existing state and hooks

  const renderCurrentView = () => {
    // If an orchestration is selected, show the specific orchestration page
    if (selectedOrchestration) {
      switch (selectedOrchestration) {
        case "hyatt":
          return (
            <HyattOrchestrationPage
              selectedOrchestration={selectedOrchestration}
              hitlReview={hitlReview}
              onToggleHitl={async () => {
                const newState = !hitlReview;
                await updateHitlReviewState(newState);
                if (newState) {
                  setIsHitlModalOpen(true);
                }
              }}
              onNavigateToOrchestrations={handleNavigateToOrchestrations}
            />
          );
        case "template":
          return (
            <TemplateOrchestrationPage
              orchestrationId="hyatt"
              hitlReview={hitlReview}
              onToggleHitl={async () => {
                const newState = !hitlReview;
                await updateHitlReviewState(newState);
                if (newState) {
                  setIsHitlModalOpen(true);
                }
              }}
            />
          );
        case "builder":
          return (
            <OrchestrationBuilderPage
              orchestrationId="builder"
              hitlReview={hitlReview}
              onToggleHitl={async () => {
                const newState = !hitlReview;
                await updateHitlReviewState(newState);
                if (newState) {
                  setIsHitlModalOpen(true);
                }
              }}
            />
          );
        case "hive":
          return (
            <HiveOrchestrationPage
              selectedOrchestration={selectedOrchestration}
              hitlReview={hitlReview}
              onToggleHitl={async () => {
                const newState = !hitlReview;
                await updateHitlReviewState(newState);
                if (newState) {
                  setIsHitlModalOpen(true);
                }
              }}
              onNavigateToOrchestrations={handleNavigateToOrchestrations}
            />
          );
        default:
          // Dynamic loading for generated orchestrations
          return (
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary">
                      Loading orchestration...
                    </p>
                  </div>
                </div>
              }
            >
              <OrchestrationPageLoader
                orchestrationId={selectedOrchestration}
                orchestrationName={selectedOrchestration}
                hitlReview={hitlReview}
                onToggleHitl={async () => {
                  const newState = !hitlReview;
                  await updateHitlReviewState(newState);
                  if (newState) {
                    setIsHitlModalOpen(true);
                  }
                }}
                onNavigateToOrchestrations={handleNavigateToOrchestrations}
              />
            </Suspense>
          );
      }
    }

    // ... rest of the component
  };

  // ... rest of the component
}

export default App;
```

## 🛠️ **5. Build System Integration**

### **5.1 Vite Configuration**

**Update**: `frontend/vite.config.ts`

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
      output: {
        manualChunks: {
          // Separate generated orchestration pages into their own chunks
          orchestrations: ["./src/components/orchestrations/generated"],
        },
      },
    },
  },
  // Enable dynamic imports for generated files
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
});
```

### **5.2 TypeScript Configuration**

**Update**: `frontend/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/components/orchestrations/generated/*": [
        "src/components/orchestrations/generated/*"
      ]
    }
  },
  "include": ["src", "src/components/orchestrations/generated/**/*"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## ⚠️ **6. Error Handling & Validation**

### **6.1 Code Validation Service**

**Create**: `utils/codeValidator.js`

```javascript
export class CodeValidator {
  static validateStyling(code) {
    const hardcodedColorPatterns = [
      /bg-blue-\d+/g,
      /bg-green-\d+/g,
      /bg-gray-\d+/g,
      /text-blue-\d+/g,
      /text-green-\d+/g,
      /text-gray-\d+/g,
      /border-blue-\d+/g,
      /border-green-\d+/g,
      /border-gray-\d+/g,
    ];

    const violations = [];

    hardcodedColorPatterns.forEach((pattern) => {
      const matches = code.match(pattern);
      if (matches) {
        violations.push({
          pattern: pattern.source,
          matches: matches,
          message: `Hardcoded colors found: ${matches.join(", ")}`,
        });
      }
    });

    return {
      isValid: violations.length === 0,
      violations,
    };
  }

  static validateReactSyntax(code) {
    // Basic React syntax validation
    const requiredPatterns = [
      /import.*React.*from.*['"]react['"]/,
      /export.*default/,
      /function.*Component|const.*Component.*=/,
    ];

    const missingPatterns = [];

    requiredPatterns.forEach((pattern) => {
      if (!pattern.test(code)) {
        missingPatterns.push(pattern.source);
      }
    });

    return {
      isValid: missingPatterns.length === 0,
      missingPatterns,
    };
  }

  static validateTypeScript(code) {
    // Basic TypeScript validation
    const hasInterface = /interface.*Props/.test(code);
    const hasTypeAnnotation = /:\s*React\.FC/.test(code);

    return {
      isValid: hasInterface && hasTypeAnnotation,
      missing: {
        interface: !hasInterface,
        typeAnnotation: !hasTypeAnnotation,
      },
    };
  }
}
```

### **6.2 Enhanced Save Orchestration with Validation**

**Update**: `pages/api/save-orchestration.js`

```javascript
import { FileGenerator } from "../../utils/fileGenerator";
import { CodeValidator } from "../../utils/codeValidator";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const orchestration = req.body;

    // Validate orchestration structure
    if (
      !orchestration.name ||
      !orchestration.agents ||
      !orchestration.workflows
    ) {
      return res.status(400).json({ error: "Invalid orchestration data" });
    }

    // Generate orchestration page if UI components are provided
    if (orchestration.uiComponents?.customComponents) {
      try {
        const fileGenerator = new FileGenerator();

        // Generate the main orchestration page
        const pageCode = await generateOrchestrationPageCode(orchestration);

        // Validate the generated code
        const stylingValidation = CodeValidator.validateStyling(pageCode);
        const reactValidation = CodeValidator.validateReactSyntax(pageCode);
        const tsValidation = CodeValidator.validateTypeScript(pageCode);

        if (!stylingValidation.isValid) {
          return res.status(400).json({
            error: "Generated code contains styling violations",
            violations: stylingValidation.violations,
          });
        }

        if (!reactValidation.isValid) {
          return res.status(400).json({
            error: "Generated code has React syntax issues",
            missingPatterns: reactValidation.missingPatterns,
          });
        }

        // Generate unique ID for the orchestration
        const id = orchestration.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
        const timestamp = Date.now();
        const uniqueId = `${id}-${timestamp}`;

        // Save the generated page
        await fileGenerator.generateOrchestrationPage(
          uniqueId,
          orchestration.name,
          pageCode
        );

        // Add the page path to orchestration metadata
        orchestration.metadata = {
          ...orchestration.metadata,
          generatedPagePath: `frontend/src/components/orchestrations/generated/${uniqueId}.tsx`,
          generatedPageId: uniqueId,
        };
      } catch (error) {
        console.error("Error generating orchestration page:", error);
        return res.status(500).json({
          error: "Failed to generate orchestration page",
          details: error.message,
        });
      }
    }

    // Continue with existing save logic...
    // [existing save orchestration code]

    res.status(200).json({
      success: true,
      orchestration: newOrchestration,
      message:
        "Orchestration, documentation, and UI components saved successfully",
    });
  } catch (error) {
    console.error("Error saving orchestration:", error);
    res.status(500).json({
      error: "Failed to save orchestration",
      details: error.message,
    });
  }
}

async function generateOrchestrationPageCode(orchestration) {
  // This would call the page generator API or use the same logic
  // For now, return a template
  return `
import React from 'react';
import GenericOrchestrationPage from '../GenericOrchestrationPage';

interface ${orchestration.name.replace(/\s+/g, "")}PageProps {
  orchestrationId: string;
  orchestrationName: string;
  hitlReview?: boolean;
  onToggleHitl?: () => void;
  onNavigateToOrchestrations?: () => void;
}

const ${orchestration.name.replace(
    /\s+/g,
    ""
  )}Page: React.FC<${orchestration.name.replace(
    /\s+/g,
    ""
  )}PageProps> = (props) => {
  return (
    <GenericOrchestrationPage
      {...props}
      orchestrationName="${orchestration.name}"
    />
  );
};

export default ${orchestration.name.replace(/\s+/g, "")}Page;
`;
}
```

## 🔧 **7. Development Workflow Integration**

### **7.1 Cursor IDE Integration**

**Update**: `.cursor/rules/styling-system.mdc`

```markdown
# Styling System Rules

## FORBIDDEN: Hardcoded Colors

- NEVER use: `bg-blue-*`, `bg-green-*`, `bg-gray-*`, `text-blue-*`, `text-green-*`, `text-gray-*`
- NEVER use: `border-blue-*`, `border-green-*`, `border-gray-*`
- NEVER use: `focus:ring-blue-*`, `focus:border-blue-*`

## REQUIRED: Design Tokens

- ALWAYS use: `bg-primary`, `bg-success`, `text-text-primary`, `text-text-secondary`
- ALWAYS use: `border-border`, `focus:ring-primary`, `focus:border-primary`
- ALWAYS use: `hover:bg-primary-hover`, `hover:bg-success-hover`

## PATTERNS: Component Standards

- Buttons: `bg-primary hover:bg-primary-hover text-white`
- Text: `text-text-primary` for headings, `text-text-secondary` for body
- Containers: `bg-secondary` for backgrounds, `border border-border` for borders
- Status: `bg-success-light text-success` for success states

## PROACTIVE DEVELOPMENT

When creating new components or features:

1. Start with design tokens from the beginning
2. Follow established patterns from existing components
3. Use the proactive styling prompt for guidance
4. Validate before committing

## REFERENCE

- Styling System Guide: docs/frontend/STYLING_SYSTEM_GUIDE.md
- Enforcement Guide: docs/frontend/STYLING_ENFORCEMENT_GUIDE.md
- Proactive Prompt: docs/plans/proactive-styling-prompt.md
```

### **7.2 Pre-commit Hook Enhancement**

**Update**: `.husky/pre-commit`

```bash
#!/bin/sh
# Pre-commit hook to validate styling

echo "🔍 Checking for hardcoded colors..."

# Check for forbidden patterns
if grep -r "bg-blue-\|bg-green-\|bg-gray-\|text-blue-\|text-green-\|text-gray-" frontend/src/components/; then
  echo "❌ ERROR: Hardcoded colors found! Use design tokens instead."
  echo "📚 See: docs/frontend/STYLING_SYSTEM_GUIDE.md"
  echo "🎨 Use proactive styling prompt: docs/plans/proactive-styling-prompt.md"
  exit 1
fi

echo "✅ No hardcoded colors found!"

# Additional validation for new components
echo "🔍 Validating new components..."

# Check if any new .tsx files were added
NEW_COMPONENTS=$(git diff --cached --name-only --diff-filter=A | grep "\.tsx$")

if [ -n "$NEW_COMPONENTS" ]; then
  echo "📝 New components detected. Validating styling compliance..."

  for component in $NEW_COMPONENTS; do
    if grep -q "bg-blue-\|bg-green-\|bg-gray-\|text-blue-\|text-green-\|text-gray-" "$component"; then
      echo "❌ ERROR: New component $component contains hardcoded colors!"
      echo "🎨 Please use the proactive styling prompt for guidance."
      exit 1
    fi
  done

  echo "✅ All new components follow styling guidelines!"
fi
```

## 🤖 **8. AI Assistant Integration**

### **8.1 Cursor AI Assistant Configuration**

**Create**: `.cursor/assistant-config.json`

```json
{
  "name": "Hive Styling Assistant",
  "description": "AI assistant that enforces the unified styling system",
  "instructions": [
    "You are a React development assistant for the Hive application.",
    "CRITICAL: Always enforce the unified styling system.",
    "NEVER suggest hardcoded colors (bg-blue-*, text-green-*, etc.).",
    "ALWAYS suggest design tokens (bg-primary, text-text-primary, etc.).",
    "Follow established component patterns from the codebase.",
    "When creating new components, use the proactive styling prompt.",
    "Reference: docs/frontend/STYLING_SYSTEM_GUIDE.md",
    "Enforcement: docs/frontend/STYLING_ENFORCEMENT_GUIDE.md"
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "validate_styling",
        "description": "Check if code follows styling guidelines",
        "parameters": {
          "type": "object",
          "properties": {
            "code": {
              "type": "string",
              "description": "React component code to validate"
            }
          },
          "required": ["code"]
        }
      }
    }
  ]
}
```

### **8.2 GitHub Copilot Integration**

**Create**: `.github/copilot/README.md`

````markdown
# GitHub Copilot Configuration for Hive

## Styling System Integration

Copilot should be configured to:

1. Always suggest design tokens instead of hardcoded colors
2. Follow established component patterns
3. Use the unified styling system
4. Reference existing components for consistency

## Configuration

Add to your IDE settings:

```json
{
  "copilot.settings": {
    "stylingSystem": "unified",
    "designTokens": "required",
    "hardcodedColors": "forbidden"
  }
}
```
````

## Reference Materials

- Styling System Guide: docs/frontend/STYLING_SYSTEM_GUIDE.md
- Enforcement Guide: docs/frontend/STYLING_ENFORCEMENT_GUIDE.md
- Proactive Prompt: docs/plans/proactive-styling-prompt.md

````

## 📋 **9. Development Team Integration**

### **9.1 Onboarding Process**

**Create**: `docs/onboarding/styling-system-onboarding.md`

```markdown
# Styling System Onboarding

## Welcome to the Hive Development Team!

As a new developer, you'll be working with our unified styling system. This ensures consistency, maintainability, and brand alignment across the entire application.

## 🎯 What You Need to Know

### 1. Design Token System
- All colors use CSS custom properties (design tokens)
- No hardcoded Tailwind colors allowed
- Centralized color management

### 2. Component Patterns
- Established patterns for buttons, cards, forms, etc.
- Consistent hover and focus states
- Accessibility built-in

### 3. Development Workflow
- Use the proactive styling prompt for new components
- Validate before committing
- Follow the enforcement mechanisms

## 📚 Required Reading

1. [Styling System Guide](../frontend/STYLING_SYSTEM_GUIDE.md)
2. [Enforcement Guide](../frontend/STYLING_ENFORCEMENT_GUIDE.md)
3. [Proactive Styling Prompt](../plans/proactive-styling-prompt.md)

## 🛠️ Setup Your Environment

1. **Install Cursor IDE** with styling rules
2. **Configure pre-commit hooks**
3. **Set up validation scripts**
4. **Review existing components** for patterns

## 🎨 Your First Component

When creating your first component:
1. Use the proactive styling prompt
2. Follow established patterns
3. Validate with the enforcement tools
4. Ask for code review

## 🚀 Getting Help

- **Questions**: Review existing components for examples
- **Issues**: Check the enforcement mechanisms
- **Patterns**: Use the design token reference table
- **Support**: Ask in team channels or code reviews
````

### **9.2 Team Training Sessions**

**Schedule**: Monthly styling review sessions

**Agenda**:

1. Review recent violations and fixes
2. Discuss new patterns and improvements
3. Update documentation as needed
4. Share best practices and tips
5. Q&A session

## 🚀 **10. Implementation Timeline**

### **Phase 1: Foundation (Week 1)**

- [ ] Update orchestration generator with styling requirements
- [ ] Create component generation API
- [ ] Create page generation API
- [ ] Update Cursor rules

### **Phase 2: File System & Build Integration (Week 2)**

- [ ] Implement file generation service
- [ ] Set up dynamic page loading system
- [ ] Configure build system for generated files
- [ ] Add error handling and validation

### **Phase 3: Workflow Integration (Week 3)**

- [ ] Enhance pre-commit hooks
- [ ] Configure AI assistants
- [ ] Create onboarding documentation
- [ ] Set up team training

### **Phase 4: Validation & Testing (Week 4)**

- [ ] Test all generators with styling requirements
- [ ] Validate enforcement mechanisms
- [ ] Conduct team training sessions
- [ ] Gather feedback and iterate

### **Phase 5: Documentation & Rollout (Week 5)**

- [ ] Finalize all documentation
- [ ] Roll out to development team
- [ ] Monitor compliance and effectiveness
- [ ] Plan continuous improvements

## 📊 **11. Success Metrics**

### **Quantitative Metrics**

- **0 hardcoded colors** in new components
- **100% design token usage** from generation
- **Reduced migration effort** (no retrospective fixes needed)
- **Faster development** (consistent patterns)

### **Qualitative Metrics**

- **Developer satisfaction** with styling system
- **Code review efficiency** (fewer styling issues)
- **Brand consistency** across all features
- **Maintainability** improvements

## 🎯 **12. Continuous Improvement**

### **Regular Reviews**

- Monthly styling system effectiveness review
- Quarterly pattern evolution assessment
- Annual system architecture review

### **Feedback Loop**

- Developer suggestions for new patterns
- Design team input for brand alignment
- User experience feedback for accessibility
- Performance considerations for optimization

---

**Remember**: The goal is to make the unified styling system so integrated and natural that developers never think about using hardcoded colors again!
