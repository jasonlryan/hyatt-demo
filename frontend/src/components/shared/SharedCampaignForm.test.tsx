import { render, fireEvent } from '@testing-library/react';
import SharedCampaignForm from './SharedCampaignForm';
import { Campaign } from '../../types';

describe('SharedCampaignForm', () => {
  it('submits brief text', () => {
    const onCreate = vi.fn();
    const dummyCampaigns: Campaign[] = [];
    const { getByLabelText, getByText } = render(
      <SharedCampaignForm
        onCreate={onCreate}
        isLoading={false}
        onCancel={() => {}}
        selectedOrchestration={null}
        onNewCampaign={() => {}}
        onLoadCampaign={() => {}}
        campaigns={dummyCampaigns}
        dropdownOpen={false}
        setDropdownOpen={() => {}}
      />
    );

    fireEvent.change(getByLabelText('Campaign Brief'), { target: { value: 'test' } });
    fireEvent.click(getByText('Create Campaign'));
    expect(onCreate).toHaveBeenCalledWith('test');
  });
});
