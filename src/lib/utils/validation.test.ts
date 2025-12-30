/**
 * Property-based tests for validation utilities
 * **Feature: svelteship, Property 2: Input validation rejects invalid data**
 * **Validates: Requirements 2.3, 2.4**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateEmail, validatePassword, validateName } from './validation';

describe('Validation utilities', () => {
  describe('validateEmail', () => {
    /**
     * **Feature: svelteship, Property 2: Input validation rejects invalid data**
     * Property: Any string without @ symbol should be rejected
     * **Validates: Requirements 2.3**
     */
    it('rejects strings without @ symbol', () => {
      fc.assert(
        fc.property(
          fc.string().filter((s) => !s.includes('@')),
          (input) => {
            const result = validateEmail(input);
            return result.valid === false;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * **Feature: svelteship, Property 2: Input validation rejects invalid data**
     * Property: Any string with @ but no domain part should be rejected
     * **Validates: Requirements 2.3**
     */
    it('rejects strings with @ but invalid domain', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }).filter((s) => !s.includes('@') && !s.includes('.')),
          (localPart) => {
            const invalidEmail = `${localPart}@`;
            const result = validateEmail(invalidEmail);
            return result.valid === false;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * **Feature: svelteship, Property 2: Input validation rejects invalid data**
     * Property: Valid email format should be accepted
     * **Validates: Requirements 2.3**
     */
    it('accepts valid email formats', () => {
      fc.assert(
        fc.property(
          fc.tuple(
            fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9.]{0,20}$/),
            fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9]{0,10}$/),
            fc.stringMatching(/^[a-zA-Z]{2,6}$/)
          ),
          ([localPart, domain, tld]) => {
            const email = `${localPart}@${domain}.${tld}`;
            const result = validateEmail(email);
            return result.valid === true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('validatePassword', () => {
    /**
     * **Feature: svelteship, Property 2: Input validation rejects invalid data**
     * Property: Any password shorter than 8 characters should be rejected
     * **Validates: Requirements 2.4**
     */
    it('rejects passwords shorter than 8 characters', () => {
      fc.assert(
        fc.property(fc.string({ maxLength: 7 }), (password) => {
          const result = validatePassword(password);
          return result.valid === false;
        }),
        { numRuns: 100 }
      );
    });

    /**
     * **Feature: svelteship, Property 2: Input validation rejects invalid data**
     * Property: Any password with 8 or more characters should be accepted
     * **Validates: Requirements 2.4**
     */
    it('accepts passwords with 8 or more characters', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 8, maxLength: 100 }), (password) => {
          const result = validatePassword(password);
          return result.valid === true;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('validateName', () => {
    /**
     * Property: Names longer than 100 characters should be rejected
     * **Validates: Requirements 6.3**
     */
    it('rejects names longer than 100 characters', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 101, maxLength: 200 }), (name) => {
          const result = validateName(name);
          return result.valid === false;
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Names with 100 or fewer characters should be accepted
     * **Validates: Requirements 6.3**
     */
    it('accepts names with 100 or fewer characters', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 100 }), (name) => {
          const result = validateName(name);
          return result.valid === true;
        }),
        { numRuns: 100 }
      );
    });
  });
});
