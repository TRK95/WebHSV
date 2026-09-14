import { SharedModel } from "./base";

export type CardFace = {
  text?: string;
  content?: string;
  hint?: string;
  image?: string;
  sound?: string;
  urlImage?: string;
  urlSound?: string;
  texts?: string[];
};

export type CardAnswer = CardFace & {
  choices?: any[];
};

export class Card extends SharedModel {
  _id: string;
  id: string;
  parentId: string;
  topicId: string;
  orderIndex: number;
  hasChild: number;
  question: CardFace;
  answer: CardAnswer;
  explanation: string;
  children: Card[];
  childCards: Card[];

  constructor(args: Partial<Card> & Record<string, any> = {}) {
    super(args);
    this._id = args._id ?? args.id ?? "";
    this.id = args.id ?? this._id;
    this.parentId = args.parentId ?? "";
    this.topicId = args.topicId ?? "";
    this.orderIndex = args.orderIndex ?? 0;
    this.hasChild = args.hasChild ?? 0;
    this.question = {
      text: "",
      content: "",
      hint: "",
      image: "",
      sound: "",
      urlImage: "",
      urlSound: "",
      ...(args.question ?? {}),
    };
    this.answer = {
      text: "",
      content: "",
      hint: "",
      image: "",
      sound: "",
      urlImage: "",
      urlSound: "",
      texts: [],
      choices: [],
      ...(args.answer ?? {}),
    };
    this.explanation = args.explanation ?? this.answer.hint ?? "";
    this.children = (args.children ?? []).map((item: any) => item instanceof Card ? item : new Card(item));
    this.childCards = (args.childCards ?? []).map((item: any) => item instanceof Card ? item : new Card(item));
  }
}

export type CardGames = Card;
