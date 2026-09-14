import { useRouter } from "next/router";
import Sv5tApplicationPageView from "../../components/sv5t/sv5t-application-page-view";
import Layout from "../../features/common/Layout";
import usePageAuth from "../../hooks/usePageAuth";
import { META_ROBOT_NO_INDEX_FOLLOW } from "../../modules/share/constraint";
import { getWebSEOProps } from "../../utils/getSEOProps";

export default function Sv5tApplicationPage() {
  const router = useRouter();
  usePageAuth();
  return <Layout {...getWebSEOProps({
    seoTitle: "Nộp hồ sơ Sinh viên 5 tốt",
    descriptionSeo: "Nộp và theo dõi hồ sơ Sinh viên 5 tốt",
    metaRobot: META_ROBOT_NO_INDEX_FOLLOW,
    slug: router?.asPath ?? "",
  })}><Sv5tApplicationPageView /></Layout>;
}
