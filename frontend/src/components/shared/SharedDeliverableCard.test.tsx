import { render, fireEvent } from '@testing-library/react';
import SharedDeliverableCard from './SharedDeliverableCard';
import { Deliverable } from '../../types';

describe('SharedDeliverableCard', () => {
  it('fires onViewDetails when clicked', () => {
    const onViewDetails = vi.fn();
    const deliverable: Deliverable = {
      id: '1',
      title: 'Test',
      status: 'ready',
      agent: 'Agent',
      timestamp: 'now',
      content: 'text'
    };

    const { getByText } = render(
      <SharedDeliverableCard deliverable={deliverable} onViewDetails={onViewDetails} />
    );

    fireEvent.click(getByText('Test'));
    expect(onViewDetails).toHaveBeenCalledWith('1');
  });
});
