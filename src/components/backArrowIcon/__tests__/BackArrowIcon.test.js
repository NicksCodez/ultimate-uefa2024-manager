import React from 'react';
import { render } from '@testing-library/react';

// components
import BackArrowIcon from '../BackArrowIcon';

describe('BackArrowIcon', () => {
  test('renders SVG element', () => {
    render(<BackArrowIcon />);
    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement.tagName).toBe('svg');
  });

  test('SVG has correct attributes', () => {
    render(<BackArrowIcon />);
    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('width', '24');
    expect(svgElement).toHaveAttribute('height', '24');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svgElement).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
  });

  test('SVG contains path element with correct attributes', () => {
    render(<BackArrowIcon />);
    const pathElement = document.querySelector('svg path');
    expect(pathElement).toBeInTheDocument();
    expect(pathElement).toHaveAttribute('d', 'M19 12H5M12 19L5 12L12 5');
    expect(pathElement).toHaveAttribute('stroke', 'currentColor');
    expect(pathElement).toHaveAttribute('stroke-width', '2');
    expect(pathElement).toHaveAttribute('stroke-linecap', 'round');
    expect(pathElement).toHaveAttribute('stroke-linejoin', 'round');
  });
});
