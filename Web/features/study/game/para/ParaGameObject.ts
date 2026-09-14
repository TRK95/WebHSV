import { Card } from "../../../../modules/share/model/card";
import { GameObject } from "../game.core";

export class ParaGameObject extends GameObject {
  childGameObjects: GameObject[];
  constructor(args: Card = new Card()) {
    super(args);
  }

  static fromGameObject(gameObject: GameObject): ParaGameObject {
    const _paraGameObject =  new ParaGameObject();
    return Object.assign(_paraGameObject, gameObject);
  }
}