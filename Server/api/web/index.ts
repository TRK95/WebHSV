import { Router } from "express";
import { newsRouters } from "./news";
import { uploadRouters } from "./upload";
import { uploadStaticRouters } from "./uploadStatic";
import { eventsRouters } from "./events";
import { userInfoRouters } from "./userInfo";
import { searchRouters } from "./search";
import { clubCategoryRouter } from "./clubCategory";
import { clubRouter } from "./club";
import { clubMemberRouter } from "./clubMembers";
import { clubFeatureRouter } from "./clubFeature";
import { sv5tRouters } from "./sv5t";

const router = Router();

router.use(newsRouters);
router.use(uploadRouters);
router.use(uploadStaticRouters);
router.use(eventsRouters);
router.use(userInfoRouters);
router.use(searchRouters);
router.use(clubCategoryRouter);
router.use(clubRouter);
router.use(clubMemberRouter);
router.use(clubFeatureRouter);
router.use(sv5tRouters);

export { router as webRouters };