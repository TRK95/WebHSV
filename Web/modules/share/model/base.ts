export type LooseObject = Record<string, any>;

export class SharedModel {
  [key: string]: any;

  constructor(args: LooseObject = {}) {
    Object.assign(this, args);
  }
}
