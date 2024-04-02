import { CommonException } from "./base";

export class NotFound extends CommonException {
  constructor(name: string, id: string) {
    super(`${name} ${id} not found.`, 404);
  }
}

export class AlreadyExist extends CommonException {
  constructor(model: string, value: string) {
    super(`${model} with ${value} already exist.`, 400);
  }
}

export class MissingField extends CommonException {
  constructor(field: string) {
    super(`missing ${field}.`, 400);
  }
}
