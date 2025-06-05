export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface Theme {
  themeName: string;
  flashcards: Flashcard[];
}

export interface FlashcardData {
  themes: Theme[];
}

export interface DeckInfo {
  id: string;
  name: string;
  data: FlashcardData;
  lastAccessed: string;
  totalCards: number;
}