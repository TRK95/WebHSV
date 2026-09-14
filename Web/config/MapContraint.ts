import { META_ROBOT_INDEX_FOLLOW, META_ROBOT_NO_INDEX_FOLLOW, META_ROBOT_NO_INDEX_NO_FOLLOW } from "../modules/share/constraint";

export const mapMetaRobot = {
  [META_ROBOT_NO_INDEX_FOLLOW]: "noindex, follow",
  [META_ROBOT_INDEX_FOLLOW]: "index, follow",
  [META_ROBOT_NO_INDEX_NO_FOLLOW]: "noindex, nofollow"
}

export const LOCALE_SESSION_KEY = "current_locale";