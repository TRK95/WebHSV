import { wrapper } from "../app/store";
import { getWebSEOProps } from "../utils/getSEOProps";
import { apiGetNewsBySlug } from "../utils/api/newsApi";
import { DOMAIN_ID_ALUMNI, RESPONSE_SUCCESS, STATUS_OPEN } from "../utils/constraint";
import NewsModel from "../models/newsModel";
import { META_ROBOT_INDEX_FOLLOW } from "../modules/share/constraint";
import { useRouter } from "next/router";
import DetailNewsPageView from "../components/news/detail-news-page-view";
import Layout from "../features/common/Layout";
import usePageAuth from "../hooks/usePageAuth";
import ErrorView from "../features/error/ErrorView";
import { setPublicPageCache } from "../utils/pageCache";

function DynamicPage({ newsDetail }: { newsDetail: { data: NewsModel, slug: string } }) {
    const router = useRouter();

    usePageAuth()
    const renderView = () => {
        if (newsDetail.data?._id) {
            return <Layout
                {...getWebSEOProps({
                    seoTitle: newsDetail.data?.title ?? '',
                    descriptionSeo: newsDetail.data?.title ?? '',
                    metaRobot: META_ROBOT_INDEX_FOLLOW,
                    slug: router?.asPath ?? ''
                })}
            >
                <DetailNewsPageView newsDetail={newsDetail.data} slug={newsDetail.slug} />
            </Layout>
        }
        return <ErrorView errorCode={404} message={'Not Found'} />
    }

    return renderView()
}

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    setPublicPageCache(context.res);
    const slugs = context.query?.slugs as string[]
    const dynamicSlug = slugs[0]
    let newsDetail = {}

    const newsDetailRes = await apiGetNewsBySlug({
        reqQuery: {
            slug: dynamicSlug,
            status: 1
        }
    })

    if (newsDetailRes.status === RESPONSE_SUCCESS) {
        newsDetail = newsDetailRes.data
    }

    return {
        props: {
            newsDetail: {
                data: newsDetail,
                slug: dynamicSlug
            }
        }
    }
})

export default DynamicPage;
