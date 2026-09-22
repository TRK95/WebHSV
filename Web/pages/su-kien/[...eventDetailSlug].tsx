import { useRouter } from "next/router";
import { wrapper } from "../../app/store";
import DetailEventsPageView from "../../components/events/detail-events-page-view";
import EventsPageView from "../../components/events/events-page-view";
import Layout from "../../features/common/Layout";
import usePageAuth from "../../hooks/usePageAuth";
import EventModel from "../../models/eventModel";
import { META_ROBOT_INDEX_FOLLOW } from "../../modules/share/constraint";
import { apiGetMembersEvent } from "../../utils/api/eventsApi";
import {
    apiGetEventBySlug,
    apiGetEventsByDate,
} from "../../utils/api/eventsApi";
import { RESPONSE_SUCCESS } from "../../utils/constraint";
import { getWebSEOProps } from "../../utils/getSEOProps";
import { MAX_DATA_DISPLAY } from "../../components/news/activity-news";
import { setPublicPageCache } from "../../utils/pageCache";

export const dataEventCategories = [
    {
        name: "Tất cả sự kiện",
        slug: "tat-ca-su-kien",
        type: 0,
    },
    {
        name: "Sự kiện sắp diễn ra",
        slug: "su-kien-sap-dien-ra",
        type: 1,
    },
    {
        name: "Sự kiện đang diễn ra",
        slug: "su-kien-dang-dien-ra",
        type: 2,
    },
    {
        name: "Sự kiện đã kết thúc",
        slug: "su-kien-da-ket-thuc",
        type: 3,
    },
];

function DetailEventSlugPage({
    slugs,
    eventsData,
    dataEventCategories,
    detailEvent,
    membersEvent,
    totalEvents,
    pageQuery,
    start,
    end
}: {
    slugs: string[];
    eventsData: EventModel[];
    dataEventCategories: Array<{ name: string; slug: string; type: number }>;
    detailEvent: EventModel;
    membersEvent: any;
    totalEvents: number;
    pageQuery: number;
    start: number,
    end: number
}) {
    const router = useRouter();

    usePageAuth();
    const renderView = () => {
        switch (slugs.length) {
            case 1: {
                // return <NewsPageView slugs={slugs} newsCategories={newsCategories} />
                return (
                    <Layout
                        {...getWebSEOProps({
                            seoTitle: 'Sự kiện - Hội Sinh viên Đại học Bách khoa Hà Nội',
                            descriptionSeo: 'Sự kiện - Hội Sinh viên Đại học Bách khoa Hà Nội',
                            metaRobot: META_ROBOT_INDEX_FOLLOW,
                            slug: router?.asPath ?? ''
                        })}
                    >
                        <EventsPageView
                            slug={slugs?.[0]}
                            eventsData={eventsData}
                            dataEventCategories={dataEventCategories}
                            totalEvents={totalEvents}
                            pageQuery={pageQuery}
                            start={start}
                            end={end}
                        />
                    </Layout>
                );
            }
            case 2: {
                return <Layout
                    {...getWebSEOProps({
                        seoTitle: detailEvent?.title ?? '',
                        descriptionSeo: detailEvent?.title ?? '',
                        metaRobot: META_ROBOT_INDEX_FOLLOW,
                        slug: router?.asPath ?? ''
                    })}
                >
                    <DetailEventsPageView detailEvent={detailEvent} slugs={slugs} membersEvent={membersEvent} />
                </Layout>;
            }
        }
    };

    return renderView();
}

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    setPublicPageCache(context.res);
    const slugs = context.query?.eventDetailSlug as string[];
    const _pageQuery = context.query.page as string;
    const pageQuery = !!_pageQuery && !isNaN(+_pageQuery) ? +_pageQuery : 1;
    const start = (pageQuery - 1) * MAX_DATA_DISPLAY;
    const end = start + MAX_DATA_DISPLAY;

    if (slugs?.length === 1) {
        const eventsDataRes = await apiGetEventsByDate({
            reqQuery: {
                limit: 100,
                offset: 0,
            },
        });

        return {
            props: {
                slugs,
                eventsData: eventsDataRes.status === RESPONSE_SUCCESS ? eventsDataRes?.data ?? [] : [],
                totalEvents: eventsDataRes.status === RESPONSE_SUCCESS ? eventsDataRes.total ?? 0 : 0,
                dataEventCategories: dataEventCategories,
                detailEvent: null,
                membersEvent: [],
                pageQuery: pageQuery ?? 1,
                start,
                end
            },
        };
    }

    const eventDetailRes = await apiGetEventBySlug({
        reqQuery: {
            slug: slugs?.[slugs.length - 1] ?? "",
        },
    });
    const memberEventRes = eventDetailRes.status === RESPONSE_SUCCESS
        ? await apiGetMembersEvent({
            reqQuery: {
                limit: 100,
                offset: 0,
                eventId: eventDetailRes?.data?._id ?? ''
            }
        })
        : null;

    return {
        props: {
            slugs,
            eventsData: [],
            totalEvents: 0,
            dataEventCategories,
            detailEvent: eventDetailRes.status === RESPONSE_SUCCESS ? eventDetailRes.data ?? null : null,
            membersEvent: memberEventRes?.status === RESPONSE_SUCCESS ? memberEventRes.data ?? [] : [],
            pageQuery: pageQuery ?? 1,
            start,
            end
        },
    };
}
);

export default DetailEventSlugPage;
