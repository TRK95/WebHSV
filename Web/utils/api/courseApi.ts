import CourseCategory from "../../modules/share/model/courseCategory";
import { Course } from "../../modules/share/model/courses";
import { StudyScore } from "../../modules/share/model/studyScore";
import Topic from "../../modules/share/model/topic";
import { getEndpoint, post } from "../fetcher";

export type TopicProgress = {
  childCardnum: number,
  courseId: string,
  lastUpdate: number
  parentId: string,
  progress: number,
  status: number,
  topicId: string,
  userId: string,
  _id: string,
  isInit?: boolean,
}
export type TopicRes = Topic & { score?: number, topicProgress?: TopicProgress };
export type StudyScoreRes = StudyScore & { topicId: { _id: string; slug: string; name: string; type: number } };

export const apiLoadCourseDetail = async (courseId: string, local = true): Promise<any> => {
  const { data, error } = await post({ endpoint: getEndpoint("/api-cms/load-course-detail", local), body: { courseId } });
  return error ? null : data;
}

export const apiGetCoursesByCategorySlug = async (args: { categorySlug: string }): Promise<CourseCategory[]> => {
  const { data, error } = await post({
    endpoint: "/api/get-courses-by-category-slug",
    params: { type: "course_categorie" },
    body: args
  });
  return error ? [] : data;
}

export const apiGetCoursesBySections = async (args: { courseId: string, parentId: string, userId?: string }): Promise<Array<TopicRes & { childs: TopicRes[] }>> => {
  const { data, error } = await post({
    endpoint: "/api/get-course-sections",
    body: args
  });

  return error ? [] : data;
}

export const apiGetStudyScoresByCourseId = async (args: { courseId: string, userId: string, topicType?: number, offset?: number, limit?: number, queryString?: string[], level?: number }): Promise<{
  total: number;
  studyScores: StudyScoreRes[] | null;
  progressStudyScores?: StudyScore[];
}> => {
  const { data, error } = await post({
    endpoint: "/api/get-list-study-scores",
    body: args
  });

  return error ? [] : data;
}
