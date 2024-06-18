import React from 'react';
import { render } from '@testing-library/react';
import LoadingSpinner from '../../components/LoadingSpinner';

describe('LoadingSpinner', () => {
  test('renders correctly based on props', () => {
    const { container, rerender } = render(<LoadingSpinner show={true} />);
    expect(container.firstChild).toHaveClass('loading-spinner');

    rerender(<LoadingSpinner show={true} alt={true} />);
    expect(container.firstChild).toHaveClass('alt-color');

    rerender(<LoadingSpinner show={true} opaque={true} />);
    expect(container.firstChild).toHaveClass('opaque');

    rerender(<LoadingSpinner show={false} />);
    expect(container.firstChild).toBeNull();
  });
});