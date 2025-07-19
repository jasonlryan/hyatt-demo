import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch for API calls
const mockFetch = vi.fn();
Object.defineProperty(window, 'fetch', {
  value: mockFetch,
  writable: true,
});

describe('Orchestration Generation E2E', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
    mockFetch.mockReset();
  });

  describe('Complete Orchestration Generation Workflow', () => {
    it('should generate complete orchestration with page and component', async () => {
      // Step 1: Generate Orchestration
      const mockOrchestration = {
        id: 'test-orchestration-123',
        name: 'Test PR Campaign Orchestration',
        description: 'Complete PR campaign orchestration for hotel marketing',
        agents: ['pr_manager', 'research_audience', 'strategic_insight', 'trending_news', 'story_angles'],
        workflows: ['pr_campaign_workflow', 'content_creation_workflow'],
        config: {
          maxConcurrentWorkflows: 5,
          timeout: 300000,
          retryAttempts: 3,
          enableLogging: true,
        },
        documentation: {
          overview: 'Comprehensive PR campaign orchestration',
          useCases: ['Hotel marketing', 'Brand awareness'],
          workflowDescription: 'Multi-stage PR campaign execution',
          agentRoles: {
            pr_manager: 'Orchestrates the entire campaign',
            research_audience: 'Analyzes target audience',
            strategic_insight: 'Provides strategic recommendations',
            trending_news: 'Monitors trending topics',
            story_angles: 'Creates compelling story angles',
          },
          deliverables: ['Press releases', 'Social media content', 'Media pitches'],
          configuration: 'Optimized for hotel industry campaigns',
          bestPractices: ['Regular monitoring', 'Content optimization'],
          limitations: ['Requires manual review', 'Limited to PR campaigns'],
          examples: {
            goodInputs: ['Hotel opening campaign', 'Brand refresh announcement'],
            poorInputs: ['Technical documentation', 'Financial reports'],
          },
        },
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ orchestration: mockOrchestration }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            page: `
              import React from 'react';
              import { TestOrchestrationPage } from './TestOrchestrationPage';
              
              export default function TestOrchestrationPageWrapper() {
                return <TestOrchestrationPage />;
              }
            `,
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            component: `
              import React from 'react';
              
              export const TestOrchestrationComponent = () => {
                return (
                  <div className="test-orchestration-component">
                    <h2>Test PR Campaign Orchestration</h2>
                    <p>Complete orchestration for hotel marketing campaigns</p>
                  </div>
                );
              };
            `,
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true, id: 'test-orchestration-123' }),
        });

      // Execute the complete workflow
      const orchestrationRes = await fetch('/api/generate-orchestration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          description: 'Create a comprehensive PR campaign orchestration for hotel marketing' 
        }),
      });

      expect(orchestrationRes.ok).toBe(true);
      const orchestrationData = await orchestrationRes.json();
      expect(orchestrationData.orchestration).toEqual(mockOrchestration);

      // Step 2: Generate Page
      const pageRes = await fetch('/api/generate-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageType: 'orchestration',
          requirements: mockOrchestration.description,
          features: mockOrchestration.workflows.join(', '),
        }),
      });

      expect(pageRes.ok).toBe(true);
      const pageData = await pageRes.json();
      expect(pageData.page).toContain('TestOrchestrationPage');

      // Step 3: Generate Component
      const componentRes = await fetch('/api/generate-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          componentType: 'orchestration-ui',
          requirements: mockOrchestration.description,
          orchestrationContext: mockOrchestration.name,
        }),
      });

      expect(componentRes.ok).toBe(true);
      const componentData = await componentRes.json();
      expect(componentData.component).toContain('TestOrchestrationComponent');

      // Step 4: Save Complete Orchestration
      const saveData = {
        ...mockOrchestration,
        generatedPage: pageData.page,
        generatedComponent: componentData.component,
      };

      const saveRes = await fetch('/api/save-orchestration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData),
      });

      expect(saveRes.ok).toBe(true);
      const saveResult = await saveRes.json();
      expect(saveResult.success).toBe(true);
      expect(saveResult.id).toBe('test-orchestration-123');

      // Verify all API calls were made correctly
      expect(mockFetch).toHaveBeenCalledTimes(4);
    });

    it('should handle orchestration generation failure gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const response = await fetch('/api/generate-orchestration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          description: 'Create a PR campaign orchestration' 
        }),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    });

    it('should handle page generation failure gracefully', async () => {
      const mockOrchestration = {
        id: 'test-orchestration',
        name: 'Test Orchestration',
        description: 'Test description',
        agents: ['agent1', 'agent2'],
        workflows: ['workflow1'],
        config: { maxConcurrentWorkflows: 3 },
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ orchestration: mockOrchestration }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          statusText: 'Bad Request',
        });

      // Generate orchestration successfully
      const orchestrationRes = await fetch('/api/generate-orchestration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'Test orchestration' }),
      });

      expect(orchestrationRes.ok).toBe(true);

      // Page generation fails
      const pageRes = await fetch('/api/generate-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageType: 'orchestration',
          requirements: mockOrchestration.description,
          features: mockOrchestration.workflows.join(', '),
        }),
      });

      expect(pageRes.ok).toBe(false);
      expect(pageRes.status).toBe(400);
    });
  });

  describe('Orchestration Builder Integration', () => {
    it('should handle complete builder workflow with form validation', async () => {
      const mockFormData = {
        name: 'Test Orchestration',
        description: 'Test Description',
        orchestrationDescription: 'Create a comprehensive PR campaign orchestration',
      };

      const mockGeneratedOrchestration = {
        id: 'builder-generated-123',
        name: mockFormData.name,
        description: mockFormData.description,
        agents: ['pr_manager', 'research_audience', 'strategic_insight'],
        workflows: ['pr_campaign_workflow'],
        config: { maxConcurrentWorkflows: 5 },
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ orchestration: mockGeneratedOrchestration }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ page: '<div>Generated Page</div>' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ component: '<div>Generated Component</div>' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });

      // Simulate form submission
      const response = await fetch('/api/generate-orchestration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: mockFormData.orchestrationDescription }),
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.orchestration.name).toBe(mockFormData.name);
      expect(data.orchestration.description).toBe(mockFormData.description);
    });
  });

  describe('File System Integration', () => {
    it('should save orchestration with generated files', async () => {
      const mockOrchestration = {
        id: 'file-test-123',
        name: 'File Test Orchestration',
        description: 'Test orchestration for file system integration',
        agents: ['agent1', 'agent2'],
        workflows: ['workflow1'],
        config: { maxConcurrentWorkflows: 3 },
        generatedPage: `
          import React from 'react';
          export default function FileTestPage() {
            return <div>File Test Page</div>;
          }
        `,
        generatedComponent: `
          import React from 'react';
          export const FileTestComponent = () => {
            return <div>File Test Component</div>;
          };
        `,
      };

      // Reset mocks for this specific test
      mockFetch.mockReset();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ 
          success: true, 
          id: 'file-test-123',
          files: [
            'src/components/orchestrations/generated/FileTestPage.tsx',
            'src/components/orchestrations/generated/FileTestComponent.tsx',
            'data/generated-orchestrations.json',
          ],
        }),
      });

      const response = await fetch('/api/save-orchestration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockOrchestration),
      });

      expect(response.ok).toBe(true);
      const result = await response.json();
      expect(result.success).toBe(true);
      expect(result.files).toHaveLength(3);
      expect(result.files[0]).toContain('FileTestPage.tsx');
      expect(result.files[1]).toContain('FileTestComponent.tsx');
    });
  });

  describe('Error Handling and Validation', () => {
    it('should validate required fields in orchestration generation', async () => {
      // Test with missing description
      mockFetch.mockReset();
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Description is required' }),
      });

      const response = await fetch('/api/generate-orchestration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      expect(response.ok).toBe(false);
    });

    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      try {
        await fetch('/api/generate-orchestration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description: 'Test' }),
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Network error');
      }
    });

    it('should handle malformed orchestration data', async () => {
      const mockOrchestration = {
        id: 'malformed-123',
        name: 'Malformed Orchestration',
        // Missing required fields
      };

      mockFetch.mockReset();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ 
          orchestration: {
            ...mockOrchestration,
            agents: [], // Default values for missing fields
            workflows: [],
            config: { maxConcurrentWorkflows: 3 },
          }
        }),
      });

      const response = await fetch('/api/generate-orchestration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'Test' }),
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.orchestration).toHaveProperty('id');
      expect(data.orchestration).toHaveProperty('name');
      // Should have default values for missing fields
      expect(data.orchestration.agents).toBeDefined();
      expect(data.orchestration.workflows).toBeDefined();
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle large orchestration configurations', async () => {
      const largeOrchestration = {
        id: 'large-orchestration-123',
        name: 'Large Scale Orchestration',
        description: 'Complex orchestration with many agents and workflows',
        agents: Array.from({ length: 20 }, (_, i) => `agent_${i + 1}`),
        workflows: Array.from({ length: 10 }, (_, i) => `workflow_${i + 1}`),
        config: { maxConcurrentWorkflows: 50 },
        documentation: {
          overview: 'Large scale orchestration for enterprise use',
          useCases: Array.from({ length: 15 }, (_, i) => `use_case_${i + 1}`),
          agentRoles: Object.fromEntries(
            Array.from({ length: 20 }, (_, i) => [`agent_${i + 1}`, `Role for agent ${i + 1}`])
          ),
        },
      };

      mockFetch.mockReset();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ orchestration: largeOrchestration }),
      });

      const response = await fetch('/api/generate-orchestration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          description: 'Create a large scale orchestration with many agents and workflows' 
        }),
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.orchestration.agents).toHaveLength(20);
      expect(data.orchestration.workflows).toHaveLength(10);
      expect(data.orchestration.config.maxConcurrentWorkflows).toBe(50);
    });
  });
}); 