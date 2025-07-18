import { render, fireEvent } from '@testing-library/react';
import SharedHitlToggle from './SharedHitlToggle';

describe('SharedHitlToggle', () => {
  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn();
    const { getByRole } = render(<SharedHitlToggle enabled={false} onToggle={onToggle} />);
    fireEvent.click(getByRole('button'));
    expect(onToggle).toHaveBeenCalled();
  });
});
