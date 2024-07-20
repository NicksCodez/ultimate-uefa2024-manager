import React from 'react';
import { render, screen } from '@testing-library/react';

// components
import PlayerList from '../PlayerList';

describe('PlayerList', () => {
  const players = [
    { docId: '1', name: 'john smith', position: 'defender' },
    { docId: '2', name: 'jane doe', position: 'midfielder' },
    { docId: '3', name: 'alice brown', position: 'attacker' },
    { docId: '4', name: 'bob jones', position: 'goalkeeper' },
  ];

  test('renders players sorted alphabetically', () => {
    render(<PlayerList players={players} firstPosition="attacker" />);

    // this is because PlayerCard capitalizez the names when rendering them
    const sortedNames = ['Alice Brown', 'Bob Jones', 'Jane Doe', 'John Smith'];

    sortedNames.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  test('groups players by position', () => {
    render(<PlayerList players={players} />);

    expect(screen.getByText('Defenders')).toBeInTheDocument();
    expect(screen.getByText('Midfielders')).toBeInTheDocument();
    expect(screen.getByText('Attackers')).toBeInTheDocument();
    expect(screen.getByText('Goalkeepers')).toBeInTheDocument();
  });

  test('renders groups in the correct order when firstPosition is specified', () => {
    render(<PlayerList players={players} firstPosition="midfielder" />);

    // Ensure "Midfielders" is displayed first
    expect(screen.getByText('Midfielders')).toBeInTheDocument();

    // Check the next positions
    expect(screen.getByText('Attackers')).toBeInTheDocument();
    expect(screen.getByText('Defenders')).toBeInTheDocument();
    expect(screen.getByText('Goalkeepers')).toBeInTheDocument();
  });

  test('renders no players for an empty list', () => {
    render(<PlayerList players={[]} />);

    // No position groups should be displayed
    expect(screen.queryByText('Defenders')).not.toBeInTheDocument();
    expect(screen.queryByText('Midfielders')).not.toBeInTheDocument();
    expect(screen.queryByText('Attackers')).not.toBeInTheDocument();
    expect(screen.queryByText('Goalkeepers')).not.toBeInTheDocument();
  });
});
