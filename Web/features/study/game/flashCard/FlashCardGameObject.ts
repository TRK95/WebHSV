import _ from "lodash";
import { Card } from "../../../../modules/share/model/card";
import { GameObject } from "../game.core";
import { Choice, QuizGameObject } from "../quiz/QuizGameObject";

export enum FlashCardGameTypes {
  QUIZ = 0,
  SPELLING = 1
}

export class FlashCardGameObject extends GameObject {
  backText: string;
  boxNum: number;
  render: boolean;
  choices: Choice[];

  constructor(args: Card & {
    boxNum?: number;
    bookmark?: boolean;
    render?: boolean
  } = new Card()) {
    super(args);
    this.boxNum = args.boxNum ?? 0;
    this.bookmark = !!args.bookmark;
    this.render = !!args.render;
    this.backText = args?.answer?.texts[0] ?? "";

    const correctChoices = args.answer.texts.map((e) => new Choice({ content: e, isCorrect: true }));
    const inCorrectChoices = args.answer.choices.map((e) => new Choice({ content: e, isCorrect: false }));

    this.choices = (_.sortBy([...correctChoices, ...inCorrectChoices], ["content"])).map((c, i) => { c.id = i; return c; });
  }

  setBoxNum(boxNum: number) {
    this.boxNum = boxNum;
  }

  toQuizGameObject(args: {
    samples?: FlashCardGameObject[];
  } = { samples: [] }) {
    const { samples = [] } = args;
    const choices = [new Choice({ content: this.question.content, isCorrect: true })];
    const _samples = samples.filter((go) => go.id !== this.id);
    const _choices = _.sampleSize(_samples, 3).map((go) => new Choice({ content: go.question.content, isCorrect: false }));
    choices.push(..._choices);
    const quizGameObject = QuizGameObject.fromGameObject({
      ...this,
      choices: _.shuffle([...choices]).map((choice, i) => { choice.id = i; return choice; }),
      question: {
        ...this.question,
        content: this.backText,
        urlSound: ""
      }
    });
    return quizGameObject;
  }
}