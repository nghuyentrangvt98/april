export let secretKey = process.env.JWT_SECRET_KEY;

export let mailUsername = process.env.MAIL_USERNAME;
export let mailPassword = process.env.MAIL_PASSWORD;

export const MONGO_URL = process.env.MONGO_URL; // DB URI
export const saltRounds = process.env.SALT_ROUNDS;
export let firstPassword = process.env.FIRST_PASSWORD;
export let firstEmail = process.env.FIRST_EMAIL;
