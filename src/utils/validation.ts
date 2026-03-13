/**
 * Shared validation utilities — used by both frontend components and API routes.
 */

/** Valid email format */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/** Exactly 10 numeric digits */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

/** Name: 2–60 chars, letters/spaces/hyphens/apostrophes only */
export const validateName = (name: string): boolean => {
  const nameRegex = /^[A-Za-z\s\-'.]{2,60}$/;
  return nameRegex.test(name.trim());
};

/**
 * Password strength:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 digit
 * - At least 1 special character
 */
export const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 8)
    return { valid: false, message: "Password must be at least 8 characters." };
  if (!/[A-Z]/.test(password))
    return { valid: false, message: "Password must contain at least one uppercase letter." };
  if (!/\d/.test(password))
    return { valid: false, message: "Password must contain at least one number." };
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    return { valid: false, message: "Password must contain at least one special character." };
  return { valid: true, message: "" };
};

/** Message: minimum 10 characters */
export const validateMessage = (message: string, minLength = 10): boolean => {
  return message.trim().length >= minLength;
};

/** Generic required field check */
export const isRequired = (value: string): boolean => {
  return value.trim().length > 0;
};