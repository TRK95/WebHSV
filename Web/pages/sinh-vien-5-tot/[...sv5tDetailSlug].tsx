
import { useRouter } from "next/router";
import { wrapper } from "../../app/store";
import Layout from "../../features/common/Layout";
import usePageAuth from "../../hooks/usePageAuth";
import { RESPONSE_SUCCESS } from "../../utils/constraint";
import NewsCategory from "../../models/newsCategoryModel";
import { apiGetNewsCategories } from "../../utils/api/newsApi";
import { getWebSEOProps } from "../../utils/getSEOProps";
import { META_ROBOT_INDEX_FOLLOW } from "../../modules/share/constraint";
import Sv5tPageView from "../../components/sv5t/sv5t-page-view";
import { setPublicPageCache } from "../../utils/pageCache";

function Sv5tDetailSlugPage({ slugs, newsCategories, page }: { slugs: string[], newsCategories: Array<NewsCategory>, page: Number }) {
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
    setPublicPageCache(context.res);
    const slugs = context.query?.sv5tDetailSlug as string[]
    const page = context.query?.page
    const newsCateRes = await apiGetNewsCategories({
        reqQuery: {
            parentId: -1,
            type: 5
        }
    })
    if (newsCateRes.status === RESPONSE_SUCCESS) {
        return {
            props: {
                slugs: slugs ?? [],
                newsCategories: newsCateRes.data,
                page: page ?? 1
            }
        }
    } else {
        return {
            props: {
                slugs: slugs ?? [],
                newsCategories: [],
                page: page ?? 1
            }
        }
    }
});

export default Sv5tDetailSlugPage;
