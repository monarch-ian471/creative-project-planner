const validator = require('validator');

/**
 * Validation middleware for user registration
 */
const validateRegistration = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const errors = [];

  // Check required fields
  if (!firstName || firstName.trim().length === 0) {
    errors.push('First name is required');
  }
  if (!lastName || lastName.trim().length === 0) {
    errors.push('Last name is required');
  }
  if (!email || !validator.isEmail(email)) {
    errors.push('Valid email is required');
  }
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  // Check name length
  if (firstName && firstName.length > 50) {
    errors.push('First name too long (max 50 characters)');
  }
  if (lastName && lastName.length > 50) {
    errors.push('Last name too long (max 50 characters)');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

/**
 * Validation middleware for login
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !validator.isEmail(email)) {
    errors.push('Valid email is required');
  }
  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

/**
 * Validation middleware for project creation
 */
const validateProject = (req, res, next) => {
  const { title, description } = req.body;
  const errors = [];

  if (!title || title.trim().length === 0) {
    errors.push('Project title is required');
  }
  if (title && title.length > 200) {
    errors.push('Title too long (max 200 characters)');
  }
  if (description && description.length > 5000) {
    errors.push('Description too long (max 5000 characters)');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

/**
 * Validation middleware for product creation
 */
const validateProduct = (req, res, next) => {
  const { name, description, price, category } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push('Product name is required');
  }
  if (name && name.length > 200) {
    errors.push('Name too long (max 200 characters)');
  }
  if (!description || description.trim().length === 0) {
    errors.push('Description is required');
  }
  if (description && description.length > 5000) {
    errors.push('Description too long (max 5000 characters)');
  }
  if (!price || isNaN(price) || price < 0) {
    errors.push('Valid price is required (must be 0 or greater)');
  }
  if (!category || category.trim().length === 0) {
    errors.push('Category is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

/**
 * Sanitize string inputs
 */
const sanitizeString = (str) => {
  if (!str) return str;
  return validator.escape(str.trim());
};

/**
 * Validate MongoDB ObjectId
 */
const validateObjectId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    next();
  };
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateProject,
  validateProduct,
  sanitizeString,
  validateObjectId
};
