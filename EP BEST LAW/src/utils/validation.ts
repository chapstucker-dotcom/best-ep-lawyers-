// Validation utilities for firm profile forms

export interface ValidationError {
  field: string;
  message: string;
}

export const validateFirmProfile = (data: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Required fields
  if (!data.name || data.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Firm name is required' });
  } else if (data.name.length < 3) {
    errors.push({ field: 'name', message: 'Firm name must be at least 3 characters' });
  }

  // Optional but validated fields
  if (data.email && !isValidEmail(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email address' });
  }

  if (data.phone && !isValidPhone(data.phone)) {
    errors.push({ field: 'phone', message: 'Invalid phone number' });
  }

  if (data.website && !isValidUrl(data.website)) {
    errors.push({ field: 'website', message: 'Invalid website URL' });
  }

  if (data.zip_code && !isValidZipCode(data.zip_code)) {
    errors.push({ field: 'zip_code', message: 'Invalid ZIP code' });
  }

  return errors;
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\(\)\+]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
};

const isValidZipCode = (zip: string): boolean => {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zip);
};


