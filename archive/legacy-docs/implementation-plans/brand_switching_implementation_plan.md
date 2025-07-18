# Brand Switching Implementation Plan

## Overview

This document outlines the implementation plan for making the Hyatt AI agents system brand-agnostic by treating "brand" as a type of "language" - similar to how multilingual sites use i18n configurations.

## 1. Brand as a Language: The Concept

Just as you use a config or translation file to switch languages, you use a "brand config" to switch all brand-specific elements. This config can control:

- UI text and copy
- Logos, colors, and images
- Prompts and agent instructions
- Any other brand-specific logic or assets

## 2. Current State Analysis

### Where Brand/Hyatt is Currently Hardcoded

#### A. In Prompts

- Many prompt files (Markdown) reference "Hyatt," "hotel," "property," or "brand" directly in campaign briefs, instructions, and sample outputs
- Examples: `"Hyatt's new eco-resort"`, `"Canvas by Hyatt"`, `"position Hyatt as the solution provider"`

#### B. In Code

- The agent code itself does not have hardcoded "Hyatt" or brand logic, but loads prompts that are Hyatt-specific
- The README and package metadata are Hyatt-specific

#### C. In Config/README

- Package name, description, and documentation are Hyatt-specific
- No brand logic in `.env.example` (all generic)

## 3. Implementation Strategy

### A. Create a Brand Config System

#### Directory Structure

```
/brands/
  hyatt.json
  marriott.json
  hilton.json
  four-seasons.json
```

#### Sample Brand Config (hyatt.json)

```json
{
  "name": "Hyatt",
  "displayName": "Hyatt Hotels Corporation",
  "logo": "/assets/logos/hyatt.png",
  "favicon": "/assets/favicons/hyatt.ico",
  "colors": {
    "primary": "#002d72",
    "primaryHover": "#0046a8",
    "secondary": "#d4af37",
    "accent": "#ffffff"
  },
  "slogan": "Feel the Hyatt Touch",
  "tagline": "World of Understanding",
  "promptReplacements": {
    "[BRAND_NAME]": "Hyatt",
    "[BRAND_SLOGAN]": "Feel the Hyatt Touch",
    "[BRAND_VOICE]": "sophisticated, welcoming, and globally-minded",
    "[PROPERTY_TYPE]": "hotels and resorts",
    "[COMPANY_VALUES]": "empathy, integrity, respect, humility, and fun"
  },
  "ui": {
    "headerTitle": "Hyatt Campaign Generator",
    "footerText": "Powered by Hyatt AI Agents",
    "loadingText": "Generating your Hyatt campaign...",
    "brandSpecificTerms": {
      "properties": "hotels and resorts",
      "guests": "guests",
      "loyalty": "World of Hyatt"
    }
  },
  "prompts": {
    "overrides": {
      "research_audience_gpt.md": "research_audience_hyatt.md"
    }
  }
}
```

### B. Load Brand Config Like a Language File

#### React Context Implementation

```jsx
// BrandContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const BrandContext = createContext();

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error("useBrand must be used within a BrandProvider");
  }
  return context;
};

export const BrandProvider = ({ children }) => {
  const [currentBrand, setCurrentBrand] = useState("hyatt");
  const [brandConfig, setBrandConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadBrandConfig = async (brandName) => {
    try {
      const config = await import(`../brands/${brandName}.json`);
      setBrandConfig(config.default);
      setCurrentBrand(brandName);
    } catch (error) {
      console.error(`Failed to load brand config for ${brandName}:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrandConfig(currentBrand);
  }, [currentBrand]);

  const switchBrand = (newBrand) => {
    setLoading(true);
    loadBrandConfig(newBrand);
  };

  return (
    <BrandContext.Provider
      value={{
        currentBrand,
        brandConfig,
        switchBrand,
        loading,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};
```

### C. Use Brand Config in UI

#### Brand Selector Component

```jsx
// BrandSelector.jsx
import React from "react";
import { useBrand } from "./BrandContext";

const BrandSelector = () => {
  const { currentBrand, switchBrand } = useBrand();

  const availableBrands = [
    { value: "hyatt", label: "Hyatt" },
    { value: "marriott", label: "Marriott" },
    { value: "hilton", label: "Hilton" },
    { value: "four-seasons", label: "Four Seasons" },
  ];

  return (
    <select
      value={currentBrand}
      onChange={(e) => switchBrand(e.target.value)}
      className="brand-selector"
    >
      {availableBrands.map((brand) => (
        <option key={brand.value} value={brand.value}>
          {brand.label}
        </option>
      ))}
    </select>
  );
};
```

#### Dynamic UI Elements

```jsx
// App.jsx
import React from "react";
import { useBrand } from "./BrandContext";

const App = () => {
  const { brandConfig, loading } = useBrand();

  if (loading || !brandConfig) {
    return <div>Loading brand configuration...</div>;
  }

  return (
    <div
      style={{
        "--primary-color": brandConfig.colors.primary,
        "--secondary-color": brandConfig.colors.secondary,
      }}
    >
      <header>
        <img src={brandConfig.logo} alt={`${brandConfig.name} logo`} />
        <h1>{brandConfig.ui.headerTitle}</h1>
      </header>

      <main>
        <p>{brandConfig.slogan}</p>
        {/* Other components */}
      </main>

      <footer>
        <p>{brandConfig.ui.footerText}</p>
      </footer>
    </div>
  );
};
```

### D. Use Brand Config in Prompts/Agents

#### Prompt Processing Function

```js
// brandPromptProcessor.js
export const processBrandPrompt = (promptTemplate, brandConfig) => {
  let processedPrompt = promptTemplate;

  // Replace brand-specific placeholders
  Object.entries(brandConfig.promptReplacements).forEach(([key, value]) => {
    processedPrompt = processedPrompt.replaceAll(key, value);
  });

  return processedPrompt;
};
```

#### Updated Agent Code

```js
// PRManagerAgent.js (updated)
const { processBrandPrompt } = require("./brandPromptProcessor");

class PRManagerAgent {
  constructor(brandConfig = null) {
    this.brandConfig = brandConfig;
    // ... existing constructor code
  }

  async loadSystemPrompt(attempt = 1) {
    // ... existing prompt loading logic

    // Process brand-specific replacements
    if (this.brandConfig) {
      this.systemPrompt = processBrandPrompt(
        this.systemPrompt,
        this.brandConfig
      );
    }
  }

  async generateCampaignIntroduction(campaignBrief, campaignContext) {
    // Include brand context in the prompt
    const brandContext = this.brandConfig
      ? {
          brandName: this.brandConfig.name,
          brandVoice: this.brandConfig.promptReplacements["[BRAND_VOICE]"],
          brandValues: this.brandConfig.promptReplacements["[COMPANY_VALUES]"],
        }
      : {};

    const prompt = `
BRAND CONTEXT:
${JSON.stringify(brandContext, null, 2)}

ORIGINAL CAMPAIGN BRIEF:
${campaignBrief}

// ... rest of existing prompt
`;

    // ... rest of existing method
  }
}
```

## 4. Environment Configuration

### Updated .env.example

```bash
# Brand Configuration
DEFAULT_BRAND=hyatt
BRAND_CONFIG_PATH=./brands/

# Existing OpenAI configuration...
OPENAI_API_KEY=your-openai-api-key-here
```

## 5. File Structure Changes

### New Directory Structure

```
project/
├── brands/
│   ├── hyatt.json
│   ├── marriott.json
│   ├── hilton.json
│   └── four-seasons.json
├── assets/
│   ├── logos/
│   │   ├── hyatt.png
│   │   ├── marriott.png
│   │   └── hilton.png
│   └── favicons/
├── agents/
│   ├── PRManagerAgent.js (updated)
│   ├── ResearchAudienceAgent.js (updated)
│   └── brandPromptProcessor.js (new)
├── prompts/
│   ├── base/
│   │   ├── pr_manager_gpt.md
│   │   └── research_audience_gpt.md
│   └── brand-specific/ (optional overrides)
│       ├── hyatt/
│       └── marriott/
└── ui/
    ├── BrandContext.js
    ├── BrandSelector.jsx
    └── App.jsx (updated)
```

## 6. Implementation Phases

### Phase 1: Core Infrastructure

- [ ] Create brand config system
- [ ] Implement brand context/provider
- [ ] Create brand selector component
- [ ] Update basic UI elements (logo, colors, text)

### Phase 2: Agent Integration

- [ ] Update agent constructors to accept brand config
- [ ] Implement prompt processing with brand replacements
- [ ] Test agents with different brand configurations

### Phase 3: Advanced Features

- [ ] Brand-specific prompt overrides
- [ ] Advanced UI theming
- [ ] Brand-specific validation rules
- [ ] Analytics and reporting per brand

### Phase 4: Testing & Optimization

- [ ] Cross-brand testing
- [ ] Performance optimization
- [ ] Documentation updates
- [ ] Deployment configuration

## 7. Benefits of This Approach

- **Scalable:** Add new brands as easily as new languages
- **Consistent:** All brand logic is centralized and easy to update
- **Flexible:** Supports both simple replacements and full overrides
- **Maintainable:** Clear separation of brand-specific and generic logic
- **Testable:** Easy to test different brand configurations

## 8. Migration Strategy

### From Current Hyatt-Only System

1. Extract all Hyatt-specific elements into a hyatt.json config
2. Replace hardcoded references with placeholder tokens
3. Update agent code to process brand configurations
4. Add brand switching UI
5. Test with multiple brand configurations

### Backwards Compatibility

- Default to Hyatt configuration if no brand is specified
- Maintain existing API contracts while adding brand parameters
- Gradual migration of hardcoded elements

## 9. Future Enhancements

- **Multi-language + Multi-brand:** Combine with i18n for true multi-language, multi-brand support
- **Brand Templates:** Pre-configured templates for common brand types (luxury, budget, boutique)
- **Dynamic Brand Loading:** Load brand configurations from external APIs
- **Brand Analytics:** Track performance and usage by brand
- **White-label Solutions:** Complete brand customization for partners

## 10. Technical Considerations

- **Performance:** Cache brand configurations to avoid repeated loading
- **Security:** Validate brand configurations to prevent injection attacks
- **Fallbacks:** Graceful degradation when brand configs are missing
- **Versioning:** Version brand configurations for rollback capabilities

This implementation treats brand switching as a first-class feature, making it as easy to switch brands as it is to switch languages in a modern web application.
