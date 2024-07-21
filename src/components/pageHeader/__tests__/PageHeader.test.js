import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// components
import PageHeader from '../PageHeader';

jest.mock(
  '../../backArrowIcon/BackArrowIcon',
  () =>
    function () {
      return <div data-testid="mock-back-arrow">MockBackArrow</div>;
    },
);

describe('PageHeader', () => {
  test('renders the title', () => {
    render(<PageHeader title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  test('renders the back button with default icon', () => {
    render(<PageHeader />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('mock-back-arrow')).toBeInTheDocument();
  });

  test('renders custom back button text', () => {
    render(<PageHeader backButtonText="Go Back" />);
    expect(screen.getByRole('button')).toHaveTextContent('Go Back');
  });

  test('calls onBackClick when back button is clicked', () => {
    const mockOnBackClick = jest.fn();
    render(<PageHeader onBackClick={mockOnBackClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnBackClick).toHaveBeenCalledTimes(1);
  });

  test('renders custom back button icon when provided', () => {
    const CustomIcon = () => <span data-testid="custom-icon">Custom</span>;
    render(<PageHeader backButtonIcon={<CustomIcon />} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-back-arrow')).not.toBeInTheDocument();
  });

  test('renders right element when provided', () => {
    const RightElement = () => <button type="button">Right Button</button>;
    render(<PageHeader rightElement={<RightElement />} />);
    expect(screen.getByText('Right Button')).toBeInTheDocument();
  });

  test('does not render right element when not provided', () => {
    render(<PageHeader />);
    expect(screen.queryByText('Right Button')).not.toBeInTheDocument();
  });
});
