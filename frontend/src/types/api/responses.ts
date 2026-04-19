import type { Character } from '../models/character';

export interface SearchCharactersResponse {
  searchCharacters: Character[];
}

export interface CharactersInfo {
  count: number;
  pages: number;
}

export interface CharactersResponse {
  characters: {
    info: CharactersInfo;
    results: Character[];
  };
}
