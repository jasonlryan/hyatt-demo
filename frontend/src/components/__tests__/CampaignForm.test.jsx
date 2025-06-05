import { render, fireEvent } from '@testing-library/react';
import CampaignForm from '../CampaignForm';

describe('CampaignForm', () => {
  test('submits brief and clears input', () => {
    const handleCreate = jest.fn();
    const { getByRole } = render(<CampaignForm onCreate={handleCreate} />);
    const textarea = getByRole('textbox');
    fireEvent.change(textarea, { target: { value: '  hello world  ' } });
    fireEvent.click(getByRole('button', { name: /create campaign/i }));
    expect(handleCreate).toHaveBeenCalledWith('hello world');
    expect(textarea.value).toBe('');
  });
});
