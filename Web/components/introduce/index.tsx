import { CircularProgress, Container, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import customMaxWidthContainer from "../../features/common/CustomMaxWidth";
import NewsCategory from "../../models/newsCategoryModel";
import NewsInCategory from "../../models/newsIncategory";
import NewsModel from "../../models/newsModel";
import { RESPONSE_SUCCESS, STATUS_PUBLIC } from "../../utils/constraint";
import { apiGetNewsInCategory } from "../../utils/api/newsApi";
import { getPurifiedContent } from "../../utils/format";
import BreadCrumb from "../breadcrumb/BreadCrumb";
import "./style.scss";

export type IntroduceCategory = NewsCategory & {
    children?: NewsCategory[];
};

type CategoryId = string | number;

const flattenCategories = (categories: IntroduceCategory[] = []) => {
    return categories.reduce<NewsCategory[]>((result, item) => {
        result.push(item);
        if (item.children?.length) {
            result.push(...item.children);
        }
        return result;
    }, []);
};

const findParentCategory = (categories: IntroduceCategory[] = [], childId?: CategoryId) => {
    return categories.find(item => item.children?.some(child => child._id === childId));
};

function IntroducePageView({
    introduceSlug,
    introduceCategories,
}: {
    introduceSlug: string | string[],
    introduceCategories: IntroduceCategory[],
}) {
    const router = useRouter();
    const routeSlug = router.query.introduceSlug;
    const currentSlug = typeof routeSlug === "string"
        ? routeSlug
        : (Array.isArray(introduceSlug) ? introduceSlug[0] : introduceSlug);
    const allCategories = useMemo(() => flattenCategories(introduceCategories), [introduceCategories]);
    const initialCategory = allCategories.find(item => item.slug === currentSlug) ?? allCategories[0];
    const [loading, setLoading] = useState(true);
    const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId | null>(initialCategory?._id ?? null);
    const [selectedNews, setSelectedNews] = useState<NewsModel | null>(null);
    const [expandedIds, setExpandedIds] = useState<CategoryId[]>([]);
    const [path, setPath] = useState<{
        label?: string,
        slug?: string
    }>({
        label: initialCategory?.title ?? "Giới thiệu",
        slug: initialCategory?.slug ? `gioi-thieu/${initialCategory.slug}` : "gioi-thieu"
    });

    useEffect(() => {
        const selectedCategory = allCategories.find(item => item.slug === currentSlug) ?? allCategories[0];
        const parentCategory = findParentCategory(introduceCategories, selectedCategory?._id);

        setSelectedCategoryId(selectedCategory?._id ?? null);
        setPath({
            label: selectedCategory?.title ?? "Giới thiệu",
            slug: selectedCategory?.slug ? `gioi-thieu/${selectedCategory.slug}` : "gioi-thieu"
        });

        if (parentCategory?._id) {
            setExpandedIds(prev => prev.includes(parentCategory._id) ? prev : [...prev, parentCategory._id]);
        }
    }, [allCategories, currentSlug, introduceCategories]);

    useEffect(() => {
        const getNewsInCategory = async () => {
            if (!selectedCategoryId) {
                setSelectedNews(null);
                setLoading(false);
                return;
            }

            setLoading(true);
            const responseNewsInCate = await apiGetNewsInCategory({
                reqQuery: {
                    offset: 0,
                    limit: 1,
                    status: STATUS_PUBLIC,
                    categoryId: selectedCategoryId,
                }
            });

            if (responseNewsInCate.status === RESPONSE_SUCCESS) {
                const newsInCategory = responseNewsInCate.data?.[0] as NewsInCategory & { news: NewsModel };
                setSelectedNews(newsInCategory?.news ?? null);
            } else {
                setSelectedNews(null);
            }
            setLoading(false);
        };

        getNewsInCategory();
    }, [selectedCategoryId]);

    const handleChangeCate = (item: NewsCategory) => {
        router.push(`/gioi-thieu/${item.slug}`, undefined, { shallow: true, scroll: false });
        window.scrollTo(0, 0);
        setSelectedCategoryId(item?._id ?? null);
        setPath({
            label: item?.title ?? "",
            slug: `gioi-thieu/${item?.slug ?? ""}`
        });
    };

    const toggleCategory = (item: IntroduceCategory) => {
        if (item.children?.length) {
            setExpandedIds(prev => (
                prev.includes(item._id)
                    ? prev.filter(id => id !== item._id)
                    : [...prev, item._id]
            ));
        }
        handleChangeCate(item);
    };

    return (
        <div id="introduce-page-view">
            <Container maxWidth={customMaxWidthContainer()}>
                <BreadCrumb path={[{ label: "Giới thiệu", slug: "gioi-thieu" }, { label: path?.label, slug: path?.slug }]} />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4} md={3}>
                        <div className="introduce-page-view-side-bar">
                            <ul>
                                {introduceCategories?.map(item => {
                                    const isExpanded = expandedIds.includes(item._id);
                                    const hasChildren = !!item.children?.length;
                                    const isActive = selectedCategoryId === item._id;
                                    const hasActiveChild = item.children?.some(child => child._id === selectedCategoryId);

                                    return (
                                        <li key={item._id} className={`${isActive || hasActiveChild ? "active" : ""} ${hasChildren ? "has-children" : ""}`}>
                                            <div className="introduce-page-view-side-bar-row" onClick={() => toggleCategory(item)}>
                                                <p>{item.title}</p>
                                                {hasChildren && <span>{isExpanded ? "-" : "+"}</span>}
                                            </div>
                                            {hasChildren && isExpanded &&
                                                <ul className="introduce-page-view-sub-list">
                                                    {item.children.map(child => (
                                                        <li key={child._id} className={selectedCategoryId === child._id ? "active" : ""} onClick={() => handleChangeCate(child)}>
                                                            <p>{child.title}</p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            }
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </Grid>

                    <Grid item xs={12} sm={8} md={9}>
                        {!loading
                            ? <div className="introduce-page-view-main">
                                {selectedNews
                                    ? <>
                                        <h2 className="introduce-page-view-main-title">
                                            {selectedNews.title}
                                        </h2>
                                        <div
                                            className="introduce-page-view-main-content"
                                            dangerouslySetInnerHTML={{ __html: getPurifiedContent(selectedNews.content || selectedNews.shortDes || "") }}
                                        />
                                    </>
                                    : <div className="introduce-page-view-empty">
                                        Chưa có nội dung cho danh mục này.
                                    </div>
                                }
                            </div>
                            : <div style={{ margin: "100px auto", textAlign: "center" }}>
                                <CircularProgress />
                            </div>
                        }
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

export default IntroducePageView;
