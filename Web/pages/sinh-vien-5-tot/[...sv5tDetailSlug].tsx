
import { useRouter } from "next/router";
import { wrapper } from "../../app/store";
import DetailNewsPageView from "../../components/news/detail-news-page-view";
import Layout from "../../features/common/Layout";
import usePageAuth from "../../hooks/usePageAuth";
import Club from "../../models/clubsModel";
import NewsModel from "../../models/newsModel";
import { DOMAIN_ID_ALUMNI, RESPONSE_SUCCESS } from "../../utils/constraint";
import NewsPageView from "../../components/news/news-page-view";
import NewsCategory from "../../models/newsCategoryModel";
import { apiGetNewsBySlug, apiGetNewsCategories } from "../../utils/api/newsApi";
import { getWebSEOProps } from "../../utils/getSEOProps";
import { META_ROBOT_INDEX_FOLLOW } from "../../modules/share/constraint";
import Sv5tPageView from "../../components/sv5t/sv5t-page-view";

function Sv5tDetailSlugPage({ newsDetail, slugs, newsCategories, page }: { newsDetail: NewsModel, slugs: string[], newsCategories: Array<NewsCategory>, page: Number }) {
    const router = useRouter();

    usePageAuth()

    const renderView = () => {
        switch (slugs.length) {
            case 1: {
                return <Layout
                    {...getWebSEOProps({
                        seoTitle: 'Sinh viên 5 tốt - Hội Sinh viên Đại học Bách khoa Hà Nội',
                        descriptionSeo: 'Sinh viên 5 tốt - Hội Sinh viên Đại học Bách khoa Hà Nội',
                        metaRobot: META_ROBOT_INDEX_FOLLOW,
                        slug: router?.asPath ?? ''
                    })}
                >
                    <Sv5tPageView slugs={slugs} newsCategories={newsCategories} pageQuery={page} />
                </Layout>
            }
        }
    }

    return renderView()
}

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    const slugs = context.query?.sv5tDetailSlug as string[]
    const page = context.query?.page
    const newsDetailRes = await apiGetNewsBySlug({
        reqQuery: {
            slug: slugs?.length ? slugs?.[slugs?.length - 1] : ''
        }
    })

    const newsCateRes = await apiGetNewsCategories({
        reqQuery: {
            parentId: -1,
            type: 5
        }
    })
    if (newsDetailRes.status === RESPONSE_SUCCESS && newsCateRes.status === RESPONSE_SUCCESS) {
        return {
            props: {
                slugs: slugs ?? [],
                newsDetail: newsDetailRes.data,
                newsCategories: newsCateRes.data,
                page: page ?? 1
            }
        }
    } else {
        return {
            props: {
                slugs: slugs ?? [],
                page: page ?? 1
            }
        }
    }
});

export default Sv5tDetailSlugPage;