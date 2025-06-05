import { render, fireEvent } from '@testing-library/react';
import DeliverablesPanel from '../DeliverablesPanel';

describe('DeliverablesPanel', () => {
  test('shows message when empty', () => {
    const { getByText } = render(<DeliverablesPanel deliverables={{}} onOpen={() => {}} />);
    expect(getByText(/no deliverables/i)).toBeInTheDocument();
  });

  test('lists deliverables and triggers open', () => {
    const handleOpen = jest.fn();
    const deliverables = {
      agent1: { title: 'First' },
      agent2: { title: 'Second' }
    };
    const { getByText, getAllByRole } = render(
      <DeliverablesPanel deliverables={deliverables} onOpen={handleOpen} />
    );
    expect(getByText('First')).toBeInTheDocument();
    fireEvent.click(getAllByRole('button', { name: /view/i })[0]);
    expect(handleOpen).toHaveBeenCalledWith('agent1');
  });
});
