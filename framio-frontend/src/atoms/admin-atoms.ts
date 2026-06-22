import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

export const sidebarCollapsedAtom = atomWithStorage('sidebarCollapsed', false);
export const darkModeAtom = atomWithStorage('darkMode', false);
export const userAtom = atom<User | null>(null);