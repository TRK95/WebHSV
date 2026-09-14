import { Card } from "../../../../modules/share/model/card";
import { GameObject } from "../game.core";
import { SpellingGameObject } from "../spelling/SpellingGameObject";

export const PREFIX_ID_FILL_PARA_QUESTION = "q-";

export class FillParaGameObject extends GameObject {
  childGameObjects: SpellingGameObject[];
  constructor(args: Card = new Card()) {
    super(args);
  }

  static fromGameObject(gameObject: GameObject): FillParaGameObject {
    const _paraGameObject = new FillParaGameObject();
    return Object.assign(_paraGameObject, gameObject);
  }
}