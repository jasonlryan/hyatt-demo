import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SharedHitlToggle from '../SharedHitlToggle';

describe('SharedHitlToggle', () => {
  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn();
    const { getByRole } = render(<SharedHitlToggle enabled={false} onToggle={onToggle} />);
    const button = getByRole('button');
    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalled();
  });
});
