export type StateData = {
  name: string;
  /**
   * **no leading slash**
   */
  slug: string;
  shortSlug: string;
  dataSlug: string;
  avatar: string;
  subjects?: Array<{
    name: string;
    fullName: string;
    slug: string;
  }>
  courses?: Array<{
    name: string;
    slug: string;
  }>
}

export type DMVSubject = "dmv-permit" | "dmv-motorcycle" | "dmv-cdl-permit";