import { Grid, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import _ from "lodash";
import { useRouter } from "next/router";
import { Fragment, PropsWithoutRef, useEffect, useMemo } from "react";
import { scroller } from "react-scroll";
import { useDispatch, useSelector } from "../../../app/hooks";
import { ROUTER_STUDY } from "../../../app/router";
import { TOPIC_TYPE_LESSON } from "../../../modules/share/constraint";
import ScrollContainer from "../../common/ScrollContainer";
import { setCurrentStudyInfo, setCurrentTopic, setTopicLoading, TopicItem } from "../topic.slice";
import "./style.scss";


const TOPIC_CHUNK_SIZE = 3;
// const currentTopicList = [
//   { _id: 1, name: "Exercise 1" },
//   { _id: 2, name: "Exercise 2" },
//   { _id: 3, name: "Exercise 3" },
//   { _id: 4, name: "Exercise 4" },
//   { _id: 5, name: "Exercise 5" },
//   { _id: 6, name: "Exercise 6" },
//   { _id: 7, name: "Exercise 7" },
//   { _id: 8, name: "Exercise 8" },
//   { _id: 9, name: "Exercise 9" },
// ]

function getChunks<R>(arr: R[], chunkSize: number) {
  if (chunkSize < 0) return [];
  return _.reduce(arr, (chunks: Array<Array<R>>, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);
    chunks[chunkIndex] = [...(chunks[chunkIndex] || []), item];
    return chunks;
  }, []);
}

const CurrentTopicList = (props: PropsWithoutRef<{ clickItemCallback?: () => void; }>) => {
  const { clickItemCallback = () => { } } = props;
  const topics = useSelector((state) => state.topicState.list);
  const subTopic = useSelector((state) => state.topicState.subTopic);
  const studyBaseSlug = useSelector((state) => state.topicState.studyBaseSlug);
  const currentTopic = useSelector((state) => state.topicState.currentTopic);
  const topicLoading = useSelector((state) => state.topicState.loading);
  const topicProgesses = useSelector((state) => state.topicState.topicProgresses);
  const userId = useSelector((state) => state.authState.userId);

  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));

  const {
    lessonList,
    currentTopicList
  } = useMemo(() => {
    const list = topics.filter((e) => e.parentId === subTopic?._id);
    return ({
      lessonList: list.filter((e) => e.type === TOPIC_TYPE_LESSON),
      currentTopicList: list.filter((e) => e.type !== TOPIC_TYPE_LESSON),
    })
  }, [subTopic?._id, topics.length]);

  const topicChunks = useMemo(() =>
    getChunks(currentTopicList, TOPIC_CHUNK_SIZE),
    [currentTopicList.length]);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      try {
        scroller.scrollTo(currentTopic?._id, {
          containerId: currentTopic?.type === TOPIC_TYPE_LESSON
            ? "current-topic-lesson-list" : "current-topic-list",
          duration: 800,
          delay: 0,
          smooth: 'easeInOutQuart'
        });
      } catch (error) { }
    }, 500);
  }, [currentTopic?._id]);

  const onClickTopic = (item: TopicItem) => {
    if (item._id === currentTopic?._id) return;
    if (topicLoading) return;
    clickItemCallback();
    dispatch(setTopicLoading(true));
    dispatch(setCurrentStudyInfo({ courseId: item.courseId, studyScoreId: '', studyScoreDataId: '' }));
    const slug = `/${studyBaseSlug}/${item.slug}`;
    router.replace(slug, undefined, { shallow: true });
    dispatch(setCurrentTopic(item));
    dispatch(setTopicLoading(false));
  }

  return (!!currentTopicList.length || !!lessonList.length
    ? <>
      {!!currentTopicList.length && !!lessonList.length && <div className="current-level-list-label">Lessons</div>}
      {!!lessonList.length && <ScrollContainer id="current-topic-lesson-list" className="current-topic-list" thumbSize={20} style={{ height: 130 }}>
        {lessonList.map((lesson) => {
          const isActive = currentTopic?._id === lesson._id;
          return <Fragment key={lesson._id}>
            <div
              className={classNames(
                "topic-level-item item-lesson",
                isActive ? "current-level" : "",
              )}
              onClick={() => onClickTopic(lesson)}
            >
              <span className="level-name level-lesson-name dot-1">{lesson.name}</span>
            </div>
          </Fragment>
        })}
      </ScrollContainer>}

      {!!currentTopicList.length && <>
        {!!lessonList.length && !!currentTopicList.length && <div className="current-level-list-label">Practices</div>}
        <ScrollContainer id="current-topic-list" className="current-topic-list" thumbSize={20} style={{ height: isTabletUI ? "67vh" : 130 }}>
          {topicChunks.map((chunk, index) => {
            const isReversed = index % 2 !== 0;
            return <Grid container key={index} className="topic-levels" spacing={1} flexDirection={isReversed ? "row-reverse" : "row"}>
              {chunk.map((topic, cIndex) => {
                const isActive = currentTopic?._id === topic._id;
                const hasAfterConnector = cIndex < TOPIC_CHUNK_SIZE - 1 && cIndex !== chunk.length - 1;
                const hasBeforeConnector = index > 0 && cIndex === 0;
                const progress = topicProgesses[topic._id]?.userId === userId ? (topicProgesses[topic._id]?.progress ?? 0) : 0;
                // const progress = topicProgesses[topic._id] ? (topicProgesses[topic._id]?.progress ?? 0) : 0;
                return (
                  <Grid item xs={Math.floor(12 / TOPIC_CHUNK_SIZE)} key={topic._id}>
                    <div
                      id={topic._id}
                      className={classNames(
                        "topic-level-item",
                        isActive ? "current-level" : "",
                        hasAfterConnector ? (isReversed ? "after-connector-reversed" : "after-connector") : "",
                        hasBeforeConnector ? "before-connector" : "",
                        !isActive && progress > 0 ? "has-progress-border" : "",
                        progress === 0 && !isActive ? "no-progress" : "",
                        progress === 0 && hasAfterConnector ? "after-connector-2" : "",
                        progress === 0 && hasBeforeConnector ? "before-connector-2" : ""
                      )}
                      onClick={() => onClickTopic(topic)}
                    >
                      <span className="level-name">{topic.name}</span>
                      <div
                        className={classNames(
                          "level-progress",
                          isActive ? "current-level" : ""
                        )}
                        style={{
                          background: "#fff",
                          width: `${progress}%`,
                          borderTopRightRadius: progress <= 90 ? 0 : 10,
                          borderBottomRightRadius: progress <= 90 ? 0 : 10,
                        }}
                      />
                    </div>
                  </Grid>
                )
              })}
            </Grid>
          })}
        </ScrollContainer>
      </>}
    </>
    : <></>
  )
}

export default CurrentTopicList;