import { Container } from "@mui/material";
import { useRouter } from "next/router";
import { wrapper } from "../../../app/store";
import Layout from "../../../features/common/Layout";
import customMaxWidthContainer from "../../../features/common/CustomMaxWidth";
import usePageAuth from "../../../hooks/usePageAuth";
import { META_ROBOT_INDEX_FOLLOW } from "../../../modules/share/constraint";
import { apiGetClubFeatureChildByClubSlug } from "../../../utils/api/clubFeatureApi";
import { RESPONSE_SUCCESS, STATUS_PUBLIC } from "../../../utils/constraint";
import { getWebSEOProps } from "../../../utils/getSEOProps";

function YourClubIndexPage({ clubSlug }: { clubSlug: string }) {
  const router = useRouter();
  usePageAuth();

  return (
    <Layout
      {...getWebSEOProps({
        seoTitle: "Tổ chức của bạn - Hội Sinh viên Đại học Bách khoa Hà Nội",
        descriptionSeo: "Tổ chức của bạn - Hội Sinh viên Đại học Bách khoa Hà Nội",
        metaRobot: META_ROBOT_INDEX_FOLLOW,
        slug: router?.asPath ?? "",
      })}
    >
      <Container maxWidth={customMaxWidthContainer()} style={{ paddingTop: 40, paddingBottom: 60 }}>
        <h2>Tổ chức của bạn</h2>
        <p>Tổ chức này chưa có chuyên mục nội dung công khai.</p>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const clubSlug = context.query.yourClub as string;
  const featureCateRes = await apiGetClubFeatureChildByClubSlug({
    slug: clubSlug || "",
    status: STATUS_PUBLIC,
  });

  if (featureCateRes.status === RESPONSE_SUCCESS && featureCateRes.data?.length) {
    const firstFeature = featureCateRes.data[0];
    return {
      redirect: {
        destination: `/to-chuc-cua-ban/${clubSlug}/${firstFeature.slug}-${firstFeature._id}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      clubSlug: clubSlug ?? "",
    },
  };
});

export default YourClubIndexPage;
