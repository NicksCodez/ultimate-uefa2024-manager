import React from 'react';
import { render, screen } from '@testing-library/react';

// components
import PlayerCard from '../PlayerCard';

// utils
import { capitalizeFirstLetters } from '../../../utils/stringFunctions/StringFunctions';

// mock capitalizeFirstLetters function
jest.mock('../../../utils/stringFunctions/StringFunctions', () => ({
  capitalizeFirstLetters: jest.fn((str) => str),
}));

describe('PlayerCard', () => {
  const player = {
    name: 'john doe',
    picture: 'https://example.com/john.jpg',
    shooting: 85,
    passing: 90,
    defence: 75,
  };

  beforeEach(() => {
    capitalizeFirstLetters.mockClear();
  });

  test('renders player name with capitalized first letters', () => {
    capitalizeFirstLetters.mockReturnValue('John Doe');
    render(<PlayerCard player={player} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(capitalizeFirstLetters).toHaveBeenCalledWith('john doe');
  });

  test('renders player picture', () => {
    render(<PlayerCard player={player} />);
    const img = screen.getByAltText(player.name);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', player.picture);
  });

  test('renders player stats correctly', () => {
    render(<PlayerCard player={player} />);

    // shows text description
    expect(screen.getByText('SHO:')).toBeInTheDocument();
    expect(screen.getByText('PAS:')).toBeInTheDocument();
    expect(screen.getByText('DEF:')).toBeInTheDocument();

    // shows correct scores
    expect(screen.getByTestId('shooting-score')).toHaveTextContent('85');
    expect(screen.getByTestId('passing-score')).toHaveTextContent('90');
    expect(screen.getByTestId('defence-score')).toHaveTextContent('75');
  });
});
