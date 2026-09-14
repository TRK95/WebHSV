export type PracticeDataConfig = {
  homeCourseIndexes: number[],
  practiceCourseIndex: number;
  practiceParentId: string | null,
  testCourseIndex: number;
  testParentId: string | null;
  practiceMeta?: Array<TestMeta>;
  practiceParentSlug: string | string[];
  testParentSlug: string;
  flashCardCourseIndex: number;
  flashCardParentSlug: string;
  groupSlugs?: Array<{
    name: string;
    slugs: string[];
  }>;
  mapSlugData?: {
    [slug: string]: {
      name: string;
      fullName?: string;
      meta?: Array<TestMeta>
      tag?: string;
      tagIndex?: number;
      avatar?: string;
    }
  }
  mapSubjectCourseIndex: Array<string>;
}

export type TestMeta = {
  name: string;
  value: any;
}