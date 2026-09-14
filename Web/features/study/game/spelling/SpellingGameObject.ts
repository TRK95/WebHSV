import { Card } from "../../../../modules/share/model/card";
import { ClientCardProgress, GameObject } from "../game.core";

export class SpellingClientCardProgress extends ClientCardProgress {
  answer: string;
  constructor(args: {
    [key in keyof SpellingClientCardProgress]?: any;
  }) {
    super(args);
    this.answer = args.answer ?? "";
  }
}

export class SpellingGameObject extends GameObject {
  answer: string;
  constructor(args: Card = new Card()) {
    super(args);
    this.answer = args.answer.texts[0] ?? "";
  }
}