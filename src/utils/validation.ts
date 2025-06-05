import { FlashcardData, Theme, Flashcard } from '../types/flashcard';

export const validateFlashcardJson = (json: any): { valid: boolean; message?: string } => {
  try {
    // Check if json has themes property and it's an array
    if (!json.themes || !Array.isArray(json.themes)) {
      return { valid: false, message: 'JSON must have a "themes" array property' };
    }

    // Check each theme
    for (const theme of json.themes) {
      if (!theme.themeName || typeof theme.themeName !== 'string') {
        return { valid: false, message: 'Each theme must have a "themeName" string property' };
      }

      if (!theme.flashcards || !Array.isArray(theme.flashcards)) {
        return { valid: false, message: `Theme "${theme.themeName}" must have a "flashcards" array property` };
      }

      // Check each flashcard
      for (const flashcard of theme.flashcards) {
        if (!flashcard.id || typeof flashcard.id !== 'string') {
          return { valid: false, message: `Each flashcard must have an "id" string property in theme "${theme.themeName}"` };
        }

        if (!flashcard.front || typeof flashcard.front !== 'string') {
          return { valid: false, message: `Each flashcard must have a "front" string property in theme "${theme.themeName}"` };
        }

        if (!flashcard.back || typeof flashcard.back !== 'string') {
          return { valid: false, message: `Each flashcard must have a "back" string property in theme "${theme.themeName}"` };
        }
      }
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, message: 'Invalid JSON format' };
  }
};