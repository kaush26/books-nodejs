import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.CRYPTO_SECRET_KEY;

export function unix() {
  return parseInt(Date.now() * 1e-3);
}

export const parseValue = (schema, doc, skipValidation = false) => {
  const doc_ = {};
  for (let key in schema) {
    const sanitizedValue = schema[key]?.sanitize?.(doc[key]) ?? doc[key];
    const validValue = !skipValidation
      ? schema[key]?.validation?.(sanitizedValue, doc) ?? sanitizedValue
      : sanitizedValue;
    doc_[key] = validValue;
  }

  return doc_;
};

export const decode = (token, options = {}) => {
  if (!token) {
    throw new Error("⚠️ Token is Required!");
  }

  try {
    return jwt.verify(token, JWT_SECRET_KEY, options);
  } catch (err) {
    throw new Error("⚠️ Invalid Token!");
  }
};

export const encode = (data, options) => {
  return jwt.sign(data, JWT_SECRET_KEY, options);
};
