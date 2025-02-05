import { describe, expect, jest } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';

import Modal from './modal';

describe('Modal', () => {
  it('renders modal component when isOpen is true', () => {
    const { getByText } = render(
      <Modal isOpen={true}>
        <div>Modal Content</div>
      </Modal>
    );

    const modalContent = getByText('Modal Content');
    expect(modalContent).not.toBeNull();
  });

  it('does not render modal component when isOpen is false', () => {
    const { queryByText } = render(
      <Modal isOpen={false}>
        <div>Modal Content</div>
      </Modal>
    );

    const modalContent = queryByText('Modal Content');
    expect(modalContent).toBeNull();
  });

  it('calls onClose when the close button is clicked', () => {
    const onCloseMock = jest.fn();
    const { getByTestId } = render(
      <Modal isOpen={true} showClose={true} onClose={onCloseMock}>
        <div>Modal Content</div>
      </Modal>
    );

    const closeButton = getByTestId('close-button');
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});

