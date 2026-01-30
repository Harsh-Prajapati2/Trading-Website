// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation - min 6 characters
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Phone number validation - 10 digits
export const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

// Name validation - min 2 characters
export const isValidName = (name) => {
  return name && name.trim().length >= 2;
};

// Number validation - positive number
export const isValidNumber = (num) => {
  const number = parseFloat(num);
  return !isNaN(number) && number > 0;
};

// Quantity validation - positive integer
export const isValidQuantity = (qty) => {
  const quantity = parseInt(qty);
  return !isNaN(quantity) && quantity > 0;
};

// Validate Login Form
export const validateLoginForm = (email, password) => {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = "Email is required";
  } else if (!isValidEmail(email)) {
    errors.email = "Invalid email format";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (!isValidPassword(password)) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};

// Validate Signup Form
export const validateSignupForm = (name, email, mobileNo, password, confirmPassword) => {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = "Name is required";
  } else if (!isValidName(name)) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!email || !email.trim()) {
    errors.email = "Email is required";
  } else if (!isValidEmail(email)) {
    errors.email = "Invalid email format";
  }

  if (!mobileNo || !mobileNo.trim()) {
    errors.mobileNo = "Phone number is required";
  } else if (!isValidPhone(mobileNo)) {
    errors.mobileNo = "Phone number must be 10 digits";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (!isValidPassword(password)) {
    errors.password = "Password must be at least 6 characters";
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};

// Validate Trade Form
export const validateTradeForm = (symbol, quantity, balance, stockPrice, tradeType) => {
  const errors = {};

  if (!symbol || !symbol.trim()) {
    errors.symbol = "Stock symbol is required";
  }

  if (!quantity || !isValidQuantity(quantity)) {
    errors.quantity = "Quantity must be a positive number";
  }

  if (tradeType === "BUY") {
    const totalCost = parseFloat(quantity) * parseFloat(stockPrice);
    if (totalCost > balance) {
      errors.balance = "Insufficient balance";
    }
  }

  return errors;
};
