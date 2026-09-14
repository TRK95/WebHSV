import { useRouter } from "next/router";
import { wrapper } from "../../app/store";
import IntroducePageView from "../../components/introduce";
import Layout from "../../features/common/Layout";
import { apiGetNewsBySlug, apiGetNewsByType, apiGetNewsInCategory } from "../../utils/api/newsApi";
import usePageAuth from "../../hooks/usePageAuth";
import NewsModel from "../../models/newsModel";
import { META_ROBOT_INDEX_FOLLOW } from "../../modules/share/constraint";
import { DOMAIN_ID_ALUMNI, RESPONSE_SUCCESS } from "../../utils/constraint";
import { getWebSEOProps } from "../../utils/getSEOProps";
import NewsInCategory from "../../models/newsIncategory";

function IntroducePage({ introduceSlug, introduceCategories, introduceDetail }: { introduceSlug: string | string[], introduceCategories: Array<NewsModel>, introduceDetail: NewsModel }) {
    const router = useRouter();

    usePageAuth()

    return (
        <Layout
            {...getWebSEOProps({
                seoTitle: introduceDetail?.title ?? 'Giới thiệu - Hội Sinh viên Đại học Bách khoa Hà Nội',
                descriptionSeo: introduceDetail?.title ?? 'Giới thiệu - Hội Sinh viên Đại học Bách khoa Hà Nội',
                metaRobot: META_ROBOT_INDEX_FOLLOW,
                slug: router?.asPath ?? ''
            })}
        >
            <IntroducePageView introduceSlug={introduceSlug} introduceCategories={introduceCategories} introduceDetail={introduceDetail} />
        </Layout>
    );
}

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    const introduceSlug = context.query?.introduceSlug

    // const introduceDataRes = await apiGetNewsInCategory({
    //     reqQuery: {
    //         categoryId: 5582731543052289,
    //         offset: 0,
    //         limit: 10
    //     }
    // })

    const introduceDataRes = await apiGetNewsByType({
        reqQuery: {
            contentType: 4,
            offset: 0,
            limit: 10
        }
    })

    const introduceDetailRes = await apiGetNewsBySlug({
        reqQuery: {
            slug: introduceSlug,
        }
    })

    if (introduceDataRes.status === RESPONSE_SUCCESS && introduceDetailRes.status === RESPONSE_SUCCESS) {
        return {
            props: {
                introduceSlug,
                introduceCategories: introduceDataRes.data,
                introduceDetail: introduceDetailRes.data
            }
        }
    }
})

export default IntroducePage;