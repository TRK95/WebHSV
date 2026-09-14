import { STUDY_SCORE_DETAIL_CORRECT } from "../../../modules/share/constraint";
import { Card } from "../../../modules/share/model/card";
import StudyScoreDetail from "../../../modules/share/model/studyScoreDetail";

export const CLASS_GAME_FILL_PARAGRAPH = "table-question";

export enum GameObjectStatus {
  NOT_ANSWER = 0,
  ANSWERED = 1,
  SKIP = 2,
  BOOKMARK = 3,
  REVIEW = 4
}

export enum GameTypes {
  INIT = -1,
  PRACTICE = 0,
  TEST = 1,
  FLASH_CARD = 2,
  LESSON = 3
}

export type ExplanationType = "explanation" | "example" | "explanation-example";

export interface GameObjectResult {
  gameObject: GameObject;
}

export class QuestionItem {
  id: string;
  index: number;
  status: GameObjectStatus;
  correct: boolean;
  skillValue?: number;
  path: string[];
  selectedChoices: number[];
  answerText: string;
  constructor(args: {
    id?: string; index?: number;
    status?: GameObjectStatus;
    correct?: boolean;
    path?: string[];
    skillValue?: number;
  } = {}) {
    this.id = args?.id;
    this.index = args?.index;
    this.status = args?.status;
    this.correct = args?.correct;
    this.path = args?.path;
    this.skillValue = args?.skillValue;
  }

  setProgress(args: { correct: boolean; status: GameObjectStatus }) {
    this.correct = args.correct;
    this.status = args.status;
  }

  setSelectedChoices(choiceIds: number[]) {
    this.selectedChoices = choiceIds;
  }

  setAnswerText(answerText: string) {
    this.answerText = answerText;
  }

  static clone(args: QuestionItem) {
    return new QuestionItem({ ...args })
  }
}

export enum FaceTypes {
  NONE = 0,
  QUESTION = 1,
  ANSWER_CORRECT = 2,
  ANSWER_INCORRECT = 3
}

export class Face {
  content: string;
  urlImage: string;
  urlSound: string;
  hint: string;
  type: FaceTypes;
  constructor(args: {
    content?: string;
    urlImage?: string;
    urlSound?: string;
    hint?: string;
    type?: FaceTypes;
  } = {}) {
    this.content = args.content;
    this.urlImage = args.urlImage;
    this.urlSound = args.urlSound;
    this.hint = args.hint;
    this.type = args.type;
  }
}

export class GameObject {
  id: string;
  parentId: string;
  question: Face;
  status: GameObjectStatus;
  bookmark: boolean;
  isCorrect: boolean;
  index: number;
  label: string;
  explanation: string;

  constructor(args: Card = new Card()) {
    this.id = args._id;
    this.parentId = args.parentId;
    this.question = new Face({
      content: args.question.text,
      hint: args.question.hint,
      urlImage: args.question.image,
      urlSound: args.question.sound,
      type: FaceTypes.QUESTION
    });
    this.status = GameObjectStatus.NOT_ANSWER;
    this.bookmark = false;
    this.isCorrect = false;
    this.index = args.orderIndex;
    this.explanation = args.answer.hint;
  }

  setProgress(args: {
    correct: boolean;
    status: GameObjectStatus
  }) {
    this.isCorrect = args.correct;
    this.status = args.status;
  }

  setStatus(status: GameObjectStatus) {
    this.status = status;
  }

  static clone(args: GameObject) {
    const _gameObject = new GameObject();
    Object.assign(_gameObject, args);
    return _gameObject;
  }
}

export class ClientCardProgress {
  id: string;
  studyTime: number;
  cardId: string;
  topicId: string;
  userId: string;
  correct: boolean;
  history: boolean[];
  constructor(args: {
    [key in keyof ClientCardProgress]?: any
  } = {}) {
    [
      "studyTime",
      "cardId",
      "topicId",
      "userId",
      "correct",
      "history"
    ].forEach((key) => {
      if (args.hasOwnProperty(key)) this[key] = args[key];
    });
    this.id = `${args.topicId}_${args.cardId}`
  }

  setHistory(args: boolean[]) {
    this.history = args;
  }

  static clone(args: ClientCardProgress) {
    return new ClientCardProgress({ ...args });
  }
};

export class GameFunction {
  onAnswer?: (args: ClientCardProgress) => any;
  fetchCardProgress?: () => Promise<ClientCardProgress[]>;
  constructor(args: {
    onAnswer?: (args: ClientCardProgress) => any;
    fetchCardProgress?: () => Promise<ClientCardProgress[]>;
  }) {
    this.onAnswer = args.onAnswer;
    this.fetchCardProgress = args.fetchCardProgress;
  }
}
