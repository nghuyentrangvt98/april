import { CommonException } from "./base";

export class WrongUsernamePassword extends CommonException {
  constructor() {
    super("wrong email or password.", 400);
  }
}

export class InvalidToken extends CommonException {
  constructor() {
    super("invalid token.", 403);
    this.status = 403;
  }
}

export class MissingAuthorization extends CommonException {
  constructor() {
    super("either access token or session-id must be provided.", 403);
  }
}

export class NoPermission extends CommonException {
  constructor() {
    super("not enough permission to perform this action.", 403);
  }
}

export class PasswordNotMatch extends CommonException {
  constructor() {
    super("wrong password", 400);
  }
}
