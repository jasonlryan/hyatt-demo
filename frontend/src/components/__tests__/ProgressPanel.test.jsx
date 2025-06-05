import { render } from '@testing-library/react';
import ProgressPanel from '../ProgressPanel';

describe('ProgressPanel', () => {
  test('shows message when empty', () => {
    const { getByText } = render(<ProgressPanel messages={[]} />);
    expect(getByText(/no updates yet/i)).toBeInTheDocument();
  });

  test('renders messages', () => {
    const messages = [{ speaker: 'Bot', message: 'Hello' }];
    const { getByText } = render(<ProgressPanel messages={messages} />);
    expect(getByText(/bot:/i)).toBeInTheDocument();
    expect(getByText(/hello/i)).toBeInTheDocument();
  });
});
