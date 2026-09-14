import { Course } from "../../modules/share/model/courses";
import Topic from "../../modules/share/model/topic";
import { post } from "../fetcher";

export const apiGetTopicByCourseSlug = async (args: {
  categorySlug: string;
  courseSlug: string;
  parentId: string | null;
}): Promise<{ courseDetail: Course; dataTopics: Topic[] }> => {
  const { data, error } = await post({
    endpoint: "/api/get-topic-by-course-slug",
    body: args
  });
  return error ? {} : data;
}

export const apiGetTopicByParentId = async (args: { parentId: string }) => {
  const { data, error } = await post({
    endpoint: '/api-cms/get-topic-by-parent-id',
    body: args
  });
  return error ? [] : data;
}

export const apiGetPathBySlugs = async (args: { slugs: string[], childTopicId?: string }) => {
  const { data, error } = await post({
    endpoint: '/api/get-path-by-slugs',
    body: args
  });
  return error ? [] : data;
}