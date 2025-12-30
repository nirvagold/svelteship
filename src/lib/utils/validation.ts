/**
 * Validation utilities for form inputs
 * Requirements: 2.3, 2.4, 6.3
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates email format using RFC 5322 simplified regex
 * Requirements: 2.3
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  const trimmed = email.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'Email is required' };
  }

  // RFC 5322 simplified email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  return { valid: true };
}

/**
 * Validates password meets minimum length requirement
 * Requirements: 2.4
 */
export function validatePassword(password: string): ValidationResult {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }

  return { valid: true };
}

/**
 * Validates name meets maximum length requirement
 * Requirements: 6.3
 */
export function validateName(name: string): ValidationResult {
  if (!name || typeof name !== 'string') {
    return { valid: true }; // Name is optional
  }

  const trimmed = name.trim();
  if (trimmed.length > 100) {
    return { valid: false, error: 'Name must be less than 100 characters' };
  }

  return { valid: true };
}
