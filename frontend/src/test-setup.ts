import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock fetch
Object.defineProperty(window, 'fetch', {
  value: vi.fn(),
  writable: true,
});

// Mock alert
Object.defineProperty(window, 'alert', {
  value: vi.fn(),
  writable: true,
});

// Mock console methods
Object.defineProperty(console, 'log', {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(console, 'error', {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(console, 'warn', {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(console, 'info', {
  value: vi.fn(),
  writable: true,
}); 