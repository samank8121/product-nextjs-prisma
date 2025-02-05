import { describe, it, expect } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react';
import React, { useState } from 'react';

import IncreaseDecrease from './increase-decrease';

describe('IncreaseDecrease Component', () => {
  it('renders with custom button name', () => {
    const { getByRole } = render(
      <IncreaseDecrease addBtnText="Add" />
    );
    // Check if the component renders with the default props
    expect(getByRole('button').textContent).toEqual('Add');
  });

  it('renders with custom value', () => {
    const { getByText } = render(
      <IncreaseDecrease value={3} addBtnText="Custom Add" maxValue={5} />
    );
    expect(getByText('3')).toBeTruthy();
  });

  it('increments and decrements the value', () => {
    const Wrapper = () => {
      const [value, setValue] = useState(0);
      return <IncreaseDecrease addBtnText="Add" value={value} onChange={setValue} />;
    };
  
    const { getByTestId, getByText } = render(<Wrapper />);
    const addBtn = getByTestId('add');
    // Click the "Add" button and check if the value increases
    fireEvent.click(addBtn);
    expect(getByText('1')).toBeTruthy();

    const decrementBtn = getByTestId('decrease');
    const incrementBtn = getByTestId('increase');

    // Click the "Increment" button and check if the value increases again
    fireEvent.click(incrementBtn);
    expect(getByText('2')).toBeTruthy();

    // Click the "Decrement" button and check if the value decreases
    fireEvent.click(decrementBtn);
    expect(getByText('1')).toBeTruthy();
  });
});
