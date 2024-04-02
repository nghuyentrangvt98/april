import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { saltRounds, secretKey } from "../setting";

interface Payload {
  userId: string;
}

class Authentication {
  public static hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, +saltRounds);
  }

  public static async verifyPassword(
    text: string,
    encryptedText: string
  ): Promise<boolean> {
    return await bcrypt.compare(text, encryptedText);
  }

  public static generateToken(id: string): string {
    const payload: Payload = {
      userId: id,
    };
    const oneDayInSeconds = 24 * 3600;
    const option = { expiresIn: oneDayInSeconds };

    return jwt.sign(payload, secretKey, option);
  }

  public static validateToken(token: string): Payload | null {
    try {
      return jwt.verify(token, secretKey) as Payload;
    } catch (err) {
      return null;
    }
  }
}

export default Authentication;
