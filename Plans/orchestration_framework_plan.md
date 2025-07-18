# Orchestration Framework Implementation Plan

## Executive Summary

This plan outlines a comprehensive framework for creating and maintaining orchestration pages in the ZENO AI HIVE system. It establishes a standardized approach for component structure, styling, layouts, and development workflow to ensure consistency and maintainability across all orchestrations.

## Goals & Objectives

### Primary Goals

1. **Consistency**: Ensure all orchestration pages follow the same design patterns
2. **Reusability**: Maximize component reuse across different orchestrations
3. **Maintainability**: Single source of truth for common functionality
4. **Scalability**: Easy to add new orchestrations
5. **Developer Experience**: Clear patterns and templates for rapid development

### Success Metrics

- 90% component reuse across orchestrations
- < 2 hours to create a new orchestration from template
- Zero duplicate code for common functionality
- 100% TypeScript coverage for type safety

## Architecture Overview

```
frontend/src/
├── components/
│   └── orchestrations/
│       ├── core/                    # Core orchestration system
│       │   ├── BaseOrchestrationPage.tsx
│       │   ├── OrchestrationProvider.tsx
│       │   └── types.ts
│       ├── design-system/           # Design system components
│       │   ├── tokens/
│       │   ├── components/
│       │   ├── layouts/
│       │   └── hooks/
│       ├── shared/                  # Shared orchestration components
│       │   ├── OrchestrationNav.tsx
│       │   ├── HitlToggle.tsx
│       │   ├── StatusPanel.tsx
│       │   └── ActionButtons.tsx
│       ├── templates/               # Orchestration templates
│       │   ├── BasicTemplate.tsx
│       │   ├── SidebarTemplate.tsx
│       │   └── MultiPanelTemplate.tsx
│       └── implementations/         # Specific orchestrations
│           ├── HyattOrchestration/
│           ├── HiveOrchestration/
│           └── [NewOrchestration]/
```

## Component Architecture

### 1. Core Components

#### BaseOrchestrationPage

The foundation component that wraps all orchestrations:

```typescript
interface BaseOrchestrationPageProps {
  // Required props
  orchestrationId: string;
  orchestrationName: string;

  // Navigation
  onNavigateToOrchestrations: () => void;

  // HITL configuration
  hitlReview: boolean;
  onToggleHitl: () => void;

  // Layout configuration
  layout?: "single" | "sidebar" | "multi-panel";
  theme?: "default" | "dark" | "custom";

  // Content
  children: React.ReactNode;

  // Optional features
  showStatusBar?: boolean;
  showActionPanel?: boolean;
  customActions?: Action[];
}
```

#### OrchestrationProvider

Context provider for orchestration-wide state and functions:

```typescript
interface OrchestrationContextValue {
  orchestrationId: string;
  config: OrchestrationConfig;
  state: OrchestrationState;
  actions: OrchestrationActions;
  theme: ThemeConfig;
}
```

### 2. Design System

#### Design Tokens

Centralized design values:

```typescript
export const orchestrationTokens = {
  // Spacing
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    xxl: "3rem", // 48px
  },

  // Colors
  colors: {
    primary: {
      50: "#f0fdf4",
      600: "#16a34a",
      700: "#15803d",
    },
    neutral: {
      50: "#fafafa",
      800: "#262626",
      900: "#171717",
    },
  },

  // Typography
  typography: {
    heading1: "text-3xl font-bold",
    heading2: "text-2xl font-semibold",
    body: "text-base",
    caption: "text-sm text-gray-600",
  },

  // Shadows
  shadows: {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
  },

  // Borders
  borders: {
    radius: {
      sm: "rounded",
      md: "rounded-md",
      lg: "rounded-lg",
    },
  },
};
```

#### Component Library

##### Card Component

```typescript
interface CardProps {
  title?: string;
  status?: "active" | "inactive" | "pending";
  actions?: Action[];
  children: React.ReactNode;
  className?: string;
}
```

##### Button Component

```typescript
interface ButtonProps {
  variant: "primary" | "secondary" | "danger" | "ghost";
  size: "sm" | "md" | "lg";
  icon?: React.ComponentType;
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}
```

##### Status Indicator

```typescript
interface StatusIndicatorProps {
  status: "idle" | "running" | "success" | "error" | "warning";
  message?: string;
  showSpinner?: boolean;
}
```

### 3. Layout Templates

#### Single Column Template

For simple orchestrations with linear flow:

```typescript
export const SingleColumnTemplate: React.FC<TemplateProps> = ({
  children,
  maxWidth = "4xl",
}) => {
  return (
    <div className={`max-w-${maxWidth} mx-auto space-y-6`}>{children}</div>
  );
};
```

#### Sidebar Template

For orchestrations with main content and sidebar:

```typescript
export const SidebarTemplate: React.FC<TemplateProps> = ({
  mainContent,
  sidebarContent,
  sidebarPosition = "right",
  sidebarWidth = "1/3",
}) => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className={sidebarPosition === "left" ? "col-span-4" : "col-span-8"}>
        {sidebarPosition === "left" ? sidebarContent : mainContent}
      </div>
      <div className={sidebarPosition === "left" ? "col-span-8" : "col-span-4"}>
        {sidebarPosition === "left" ? mainContent : sidebarContent}
      </div>
    </div>
  );
};
```

#### Multi-Panel Template

For complex orchestrations with multiple sections:

```typescript
export const MultiPanelTemplate: React.FC<TemplateProps> = ({
  panels,
  layout = "equal",
}) => {
  const gridCols = {
    equal: "grid-cols-3",
    focus: "grid-cols-12", // Custom spans per panel
    responsive: "grid-cols-1 lg:grid-cols-3",
  };

  return (
    <div className={`grid ${gridCols[layout]} gap-6`}>
      {panels.map((panel, index) => (
        <div key={index} className={panel.className}>
          {panel.content}
        </div>
      ))}
    </div>
  );
};
```

### 4. Shared Components

#### OrchestrationNav

Consistent navigation across all orchestrations:

```typescript
export const OrchestrationNav: React.FC<NavProps> = ({
  orchestrationName,
  onNavigateBack,
  breadcrumbs = [],
}) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <button
        onClick={onNavigateBack}
        className="text-green-600 hover:text-green-700"
      >
        Orchestrations
      </button>
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          <span>›</span>
          {crumb.link ? (
            <button
              onClick={crumb.onClick}
              className="text-green-600 hover:text-green-700"
            >
              {crumb.label}
            </button>
          ) : (
            <span className="text-gray-800 font-medium">{crumb.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
```

#### HitlToggle

Standardized HITL review toggle:

```typescript
export const HitlToggle: React.FC<HitlToggleProps> = ({
  enabled,
  onToggle,
  position = "top-right",
}) => {
  return (
    <div className={`flex items-center gap-2 ${getPositionClasses(position)}`}>
      <span className="text-sm text-gray-600">HITL Review</span>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
          enabled ? "bg-green-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? "translate-x-7" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};
```

## Implementation Strategy

### Phase 1: Foundation (Week 1-2)

1. **Create Core Components**

   - [ ] BaseOrchestrationPage component
   - [ ] OrchestrationProvider context
   - [ ] TypeScript interfaces and types
   - [ ] Unit tests for core components

2. **Design System Setup**
   - [ ] Design tokens configuration
   - [ ] Base component styles
   - [ ] Tailwind configuration updates
   - [ ] Theme system implementation

### Phase 2: Component Library (Week 3-4)

1. **Build Shared Components**

   - [ ] Card, Button, Status components
   - [ ] Navigation components
   - [ ] Form components
   - [ ] Layout templates

2. **Create Storybook Documentation**
   - [ ] Component stories
   - [ ] Design system documentation
   - [ ] Interactive examples
   - [ ] Usage guidelines

### Phase 3: Migration (Week 5-6)

1. **Refactor Existing Orchestrations**

   - [ ] Migrate HyattOrchestrationPage
   - [ ] Migrate HiveOrchestrationPage
   - [ ] Extract shared logic
   - [ ] Update tests

2. **Create Templates**
   - [ ] Basic orchestration template
   - [ ] Advanced orchestration template
   - [ ] CLI generator tool

### Phase 4: Documentation & Training (Week 7)

1. **Documentation**

   - [ ] Developer guide
   - [ ] Component API reference
   - [ ] Best practices guide
   - [ ] Migration guide

2. **Training & Rollout**
   - [ ] Team training session
   - [ ] Code review guidelines
   - [ ] Support documentation

## Development Workflow

### Creating a New Orchestration

1. **Use CLI Generator**

```bash
npm run create:orchestration -- --name "Brand" --template "sidebar"
```

2. **Generated Structure**

```
implementations/BrandOrchestration/
├── index.tsx                 # Main orchestration component
├── components/              # Orchestration-specific components
├── hooks/                   # Custom hooks
├── types.ts                # TypeScript types
├── styles.module.css       # Custom styles (if needed)
└── README.md               # Documentation
```

3. **Implementation Example**

```typescript
import { BaseOrchestrationPage } from "../../core";
import { SidebarTemplate } from "../../templates";
import { Card, Button } from "../../design-system/components";

export const BrandOrchestration: React.FC = () => {
  return (
    <BaseOrchestrationPage
      orchestrationId="brand"
      orchestrationName="Brand Orchestrator"
      layout="sidebar"
    >
      <SidebarTemplate
        mainContent={
          <Card title="Brand Configuration">{/* Main content */}</Card>
        }
        sidebarContent={
          <Card title="Actions">
            <Button variant="primary">Start Campaign</Button>
          </Card>
        }
      />
    </BaseOrchestrationPage>
  );
};
```

## Style Guide & Best Practices

### Component Guidelines

1. **Always use design tokens** instead of hardcoded values
2. **Compose with existing components** before creating new ones
3. **Follow TypeScript interfaces** strictly
4. **Write tests** for custom components
5. **Document** complex logic with comments

### Naming Conventions

- **Components**: PascalCase (e.g., `OrchestrationCard`)
- **Files**: PascalCase for components, camelCase for utilities
- **CSS Classes**: Use Tailwind utilities or BEM for custom styles
- **Props**: Descriptive names with proper TypeScript types

### State Management

1. **Local State**: For component-specific state
2. **Context**: For orchestration-wide state
3. **Redux/Zustand**: For global app state (if needed)

### Performance Considerations

1. **Lazy load** orchestration implementations
2. **Memoize** expensive computations
3. **Use React.memo** for pure components
4. **Optimize** re-renders with proper dependencies

## Testing Strategy

### Unit Tests

- Core components
- Utility functions
- Custom hooks

### Integration Tests

- Orchestration workflows
- Component interactions
- API integrations

### E2E Tests

- Critical user paths
- Cross-orchestration navigation
- HITL review flows

## Maintenance & Evolution

### Version Control

- Semantic versioning for component library
- Changelog maintenance
- Breaking change documentation

### Review Process

1. Design review for new components
2. Code review for implementations
3. Accessibility review
4. Performance review

### Monitoring

- Component usage analytics
- Performance metrics
- Error tracking
- User feedback

## Conclusion

This framework provides a solid foundation for creating and maintaining orchestration pages. It emphasizes:

- **Consistency** through shared components and design tokens
- **Efficiency** through templates and generators
- **Quality** through TypeScript and testing
- **Scalability** through modular architecture

The implementation will enable rapid development of new orchestrations while maintaining high quality and consistency across the entire system.
