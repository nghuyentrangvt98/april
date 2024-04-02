import { CommonException } from "./base";

export class InvalidScore extends CommonException {
  constructor() {
    super(`The total of midTerm, practical, and final must must 1.`, 400);
  }
}

export class InvalidFinalScore extends CommonException {
  constructor() {
    super(`The final score's weight must be the greatest.`, 400);
  }
}

export class InvalidregistrationEndDate extends CommonException {
  constructor() {
    super(`registrationEndDate should be greater than the current date.`, 400);
  }
}
