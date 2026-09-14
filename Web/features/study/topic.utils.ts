import localforage from "localforage";
import { apiOffsetTopicsByParentId } from "./topic.api";
import { MapTopicProgress, TopicItem } from "./topic.slice";

export const getRelaTopicList = async (topic: TopicItem, serverSide = true, topicTypes?: number[]) => {
  const topics = await apiOffsetTopicsByParentId({
    courseId: topic.courseId,
    parentId: topic.parentId,
    topicTypes,
    topicFields: [
      "_id",
      "childType",
      "type",
      "status",
      "videoUrl",
      "courseId",
      "name",
      "shortDescription",
      "slug",
      "orderIndex",
      "parentId"
    ],
    exerciseFields: ["contentType", "questionsNum", "duration", "topicSettingId", "pass", "contentType", "baremScore", "shuffleQuestion"],
    field: "orderIndex",
    asc: true,
    serverSide
  });
  return topics;
}

export const getRelaProgress = (args: {
  list: TopicItem[]; topicProgresses: MapTopicProgress; item: TopicItem; userId: string;
}) => {
  const { list, topicProgresses, item, userId } = args;
  const relaList = list.filter((e) => e._id !== item._id);
  const progressTotal = relaList.reduce((total, topic) => {
    const topicProgress = topicProgresses[topic._id];
    const progressNum = topicProgress?.userId === userId ? (topicProgress?.progress ?? 0) : 0;
    // const progressNum = topicProgress ? (topicProgress?.progress ?? 0) : 0;
    total += progressNum;
    return total;
  }, 0);
  return progressTotal;
}

export const gameLocalStore = localforage.createInstance({
  name: "koolsoft-elearning",
  storeName: "redux-persist"
});