import { atom } from 'jotai';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const userAtom = atom<User | null>(null);
export const tokenAtom = atom<string | null>(null);
export const isAuthenticatedAtom = atom((get) => !!get(tokenAtom));
