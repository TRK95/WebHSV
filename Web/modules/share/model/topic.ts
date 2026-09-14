import { SharedModel } from "./base";
import TopicExercise from "./topicExercise";

export interface ITopic {
  _id?: string;
  id?: string;
  name?: string;
  fullName?: string;
  slug?: string;
  parentId?: string | null;
  courseId?: string;
  type?: number;
  childType?: number;
  orderIndex?: number;
  avatar?: string;
  description?: string;
  shortDescription?: string;
  videoUrl?: string;
  topicExercise?: TopicExercise;
  children?: Topic[];
  [key: string]: any;
}

export default class Topic extends SharedModel implements ITopic {
  _id: string;
  id: string;
  name: string;
  fullName: string;
  slug: string;
  parentId: string | null;
  type: number;
  orderIndex: number;
  topicExercise?: TopicExercise;
  children: Topic[];

  constructor(args: ITopic = {}) {
    super(args);
    this._id = args._id ?? args.id ?? "";
    this.id = args.id ?? this._id;
    this.name = args.name ?? "";
    this.fullName = args.fullName ?? this.name;
    this.slug = args.slug ?? "";
    this.parentId = args.parentId ?? null;
    this.type = args.type ?? 0;
    this.orderIndex = args.orderIndex ?? 0;
    this.topicExercise = args.topicExercise ? new TopicExercise(args.topicExercise) : undefined;
    this.children = (args.children ?? []).map((item: any) => item instanceof Topic ? item : new Topic(item));
  }
}
