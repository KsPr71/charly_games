// This file is no longer the primary source of data.
// It is kept to avoid breaking imports, but the data is now managed 
// via API routes and stored in /data/games.json.
// You can remove the `initialGames` export if it's no longer used for seeding.

import type { Game } from './types';

export const initialGames: Game[] = [
  {
    id: '1',
    title: 'Cyberpunk 2077',
    description: 'An open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification.',
    price: 59.99,
    category: 'RPG',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '2',
    title: 'The Witcher 3: Wild Hunt',
    description: 'As Geralt of Rivia, a monster slayer for hire, you must find the Child of Prophecy, a living weapon that can alter the shape of the world.',
    price: 39.99,
    category: 'RPG',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '3',
    title: 'Red Dead Redemption 2',
    description: 'The story of outlaw Arthur Morgan and the Van der Linde gang as they rob, fight and steal their way across the vast and rugged heart of America in order to survive.',
    price: 49.99,
    category: 'Action-Adventure',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '4',
    title: 'Elden Ring',
    description: 'A vast world where open fields with a variety of situations and huge dungeons with complex and three-dimensional designs are seamlessly connected.',
    price: 69.99,
    category: 'Souls-like',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '5',
    title: 'Stardew Valley',
    description: 'You\'ve inherited your grandfather\'s old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life.',
    price: 14.99,
    category: 'Simulation',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '6',
    title: 'Counter-Strike 2',
    description: 'For over two decades, millions of players globally have battled it out in a skill-based, 5v5 tactical first-person shooter.',
    price: 0,
    category: 'Shooter',
    imageUrl: 'https://placehold.co/600x400.png',
  },
    {
    id: '7',
    title: 'Helldivers 2',
    description: 'Join the Helldivers and fight for freedom in a hostile galaxy in this fast, frantic, and ferocious third-person shooter.',
    price: 39.99,
    category: 'Shooter',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '8',
    title: 'Baldur\'s Gate 3',
    description: 'Gather your party, and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power.',
    price: 59.99,
    category: 'RPG',
    imageUrl: 'https://placehold.co/600x400.png',
  },
];
