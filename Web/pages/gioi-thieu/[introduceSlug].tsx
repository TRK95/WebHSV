import { useRouter } from "next/router";
import { wrapper } from "../../app/store";
import IntroducePageView, { IntroduceCategory } from "../../components/introduce";
import Layout from "../../features/common/Layout";
import usePageAuth from "../../hooks/usePageAuth";
import NewsCategory from "../../models/newsCategoryModel";
import { META_ROBOT_INDEX_FOLLOW } from "../../modules/share/constraint";
import { RESPONSE_SUCCESS, STATUS_PUBLIC } from "../../utils/constraint";
import { getWebSEOProps } from "../../utils/getSEOProps";
import { apiGetNewsCategories } from "../../utils/api/newsApi";

const flattenCategories = (categories: IntroduceCategory[] = []) => {
    return categories.reduce<NewsCategory[]>((result, item) => {
        result.push(item);
        if (item.children?.length) {
            result.push(...item.children);
        }
        return result;
    }, []);
};

function IntroducePage({
    introduceSlug,
    introduceCategories,
}: {
    introduceSlug: string | string[],
    introduceCategories: IntroduceCategory[],
}) {
    const router = useRouter();
    const currentSlug = Array.isArray(introduceSlug) ? introduceSlug[0] : introduceSlug;
    const selectedCategory = flattenCategories(introduceCategories).find(item => item.slug === currentSlug);

    usePageAuth();

    return (
        <Layout
            {...getWebSEOProps({
                seoTitle: selectedCategory?.title ?? "Giới thiệu - Hội Sinh viên Đại học Bách khoa Hà Nội",
                descriptionSeo: selectedCategory?.title ?? "Giới thiệu - Hội Sinh viên Đại học Bách khoa Hà Nội",
                metaRobot: META_ROBOT_INDEX_FOLLOW,
                slug: router?.asPath ?? ""
            })}
        >
            <IntroducePageView introduceSlug={introduceSlug} introduceCategories={introduceCategories} />
        </Layout>
    );
}

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    const introduceSlug = context.query?.introduceSlug;
    const rootCategoriesRes = await apiGetNewsCategories({
        reqQuery: {
            parentId: "-1",
            type: 4,
            status: STATUS_PUBLIC,
        }
    });

    if (rootCategoriesRes.status !== RESPONSE_SUCCESS) {
        return {
            props: {
                introduceSlug,
                introduceCategories: [],
            }
        };
    }

    const introduceCategories = await Promise.all(
        (rootCategoriesRes.data ?? []).map(async (item) => {
            const childrenRes = await apiGetNewsCategories({
                reqQuery: {
                    parentId: item._id,
                    status: STATUS_PUBLIC,
                }
            });

            return {
                ...item,
                children: childrenRes.status === RESPONSE_SUCCESS ? childrenRes.data ?? [] : [],
            };
        })
    );

    return {
        props: {
            introduceSlug,
            introduceCategories,
        }
    };
});

export default IntroducePage;
