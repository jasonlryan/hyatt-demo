import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SharedCampaignForm from '../SharedCampaignForm';

const baseProps = {
  onCreate: vi.fn(),
  onCancel: vi.fn(),
  isLoading: false,
  onNewCampaign: vi.fn(),
  onLoadCampaign: vi.fn(),
  campaigns: [],
  dropdownOpen: false,
  setDropdownOpen: vi.fn(),
};

describe('SharedCampaignForm', () => {
  it('disables create button when brief is empty', () => {
    const { getByRole } = render(
      <SharedCampaignForm {...baseProps} />
    );
    const button = getByRole('button', { name: /create campaign/i });
    expect(button.hasAttribute('disabled')).toBe(true);
  });

  it('enables create button when brief is entered', () => {
    const { getByRole, getByLabelText } = render(
      <SharedCampaignForm {...baseProps} />
    );
    fireEvent.change(getByLabelText(/campaign brief/i), { target: { value: 'test' } });
    const button = getByRole('button', { name: /create campaign/i });
    expect(button.hasAttribute('disabled')).toBe(false);
  });
});
