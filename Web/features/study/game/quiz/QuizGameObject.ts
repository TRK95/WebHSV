import _ from "lodash";
import { Card } from "../../../../modules/share/model/card";
import { ClientCardProgress, GameObject } from "../game.core";

export class Choice {
  id: number;
  isSelected: boolean;
  content: string;
  isCorrect: boolean;
  constructor(args: {
    id?: number;
    content?: string;
    isSelected?: boolean;
    isCorrect?: boolean;
  } = {}) {
    const { id, isSelected, content, isCorrect } = args;
    this.id = id;
    this.content = content;
    this.isCorrect = isCorrect;
    this.isSelected = isSelected;
  }
}

export class QuizClientCardProgress extends ClientCardProgress {
  /**
   * Order of choices, default: [0, 1, 2...] - no texts & choice orders - alphabetical
   */
  choiceOrder: number[];
  /**
   * Selected choices' indexes, which are bound to the order value
   */
  selectedChoices: number[];
  constructor(args: {
    [key in keyof QuizClientCardProgress]?: any;
  }) {
    super(args);
    this.choiceOrder = args.choiceOrder ?? [];
    this.selectedChoices = args.selectedChoices ?? []
  }
}

export class QuizGameObject extends GameObject {
  choices: Choice[];
  numberOfAnswers: number;
  splitPointAnswers: boolean;

  selectedChoices: number[]
  constructor(args: Card = new Card()) {
    super(args);
    const correctChoices = args.answer.texts.map((e) => new Choice({ content: e, isCorrect: true }));
    const inCorrectChoices = args.answer.choices.map((e) => new Choice({ content: e, isCorrect: false }));
    // TODO_SORT_BY_ORDER
    this.choices = (_.sortBy([...correctChoices, ...inCorrectChoices], ["content"])).map((c, i) => { c.id = i; return c; });
    this.numberOfAnswers = correctChoices.length;
    this.splitPointAnswers = !!args.setting.splitPointAnswers
  }

  static fromGameObject(gameObject: GameObject): QuizGameObject {
    const _quizGameObject = new QuizGameObject();
    return Object.assign(_quizGameObject, gameObject);
  }

  setSelectedChoices(choiceIds: number[]) {
    this.selectedChoices = choiceIds;
  }
}