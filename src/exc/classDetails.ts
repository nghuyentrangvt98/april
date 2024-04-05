import { CommonException } from "./base";

export class InvalidScore extends CommonException {
  constructor() {
    super(
      `Invalid score! The score should fall within the range of 0 to 10.`,
      400
    );
  }
}

export class InvalidClass extends CommonException {
  constructor() {
    super(`Invalid class! Class registration is now closed..`, 400);
  }
}
