import { TestBed } from '@angular/core/testing';
import { CharacterCountService } from '../character-count.service';

describe('CharacterCountService', () => {
  let service: CharacterCountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharacterCountService);
  });

  describe('getCharacterCountText', () => {
    it('should return correct text when characters remaining is positive', () => {
      const result = service.getCharacterCountText(5);
      expect(result).toEqual('You have 5 characters remaining');
    });

    it('should return correct text when characters remaining is negative', () => {
      const result = service.getCharacterCountText(-3);
      expect(result).toEqual('You have 3 characters too many');
    });

    it('should return correct text when only one character is remaining', () => {
      const result = service.getCharacterCountText(1);
      expect(result).toEqual('You have 1 character remaining');
    });

    it('should return correct text when only one character is too many', () => {
      const result = service.getCharacterCountText(-1);
      expect(result).toEqual('You have 1 character too many');
    });

    it('should return correct text when no characters are remaining', () => {
      const result = service.getCharacterCountText(0);
      expect(result).toEqual('You have 0 characters remaining');
    });
  });

  describe('charactersExceeded', () => {
    it('should return true if characters exceeded', () => {
      const result = service.charactersExceeded(-1);
      expect(result).toEqual(true);
    });

    it('should return false if characters not exceeded', () => {
      const result = service.charactersExceeded(1);
      expect(result).toEqual(false);
    });
  });
});
