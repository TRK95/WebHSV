import { Check } from "@mui/icons-material";
import { Box, Container, Drawer, Typography, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";
import { scroller } from "react-scroll";
import { useDispatch, useSelector } from "../../app/hooks";
import { ROUTER_STUDY } from "../../app/router";
import LoadingContainer from "../common/LoadingContainer";
import ScrollContainer from "../common/ScrollContainer";
import WordListView from "./game/flashCard/WordListView/WordListView";
import GameLessonView from "./game/GameLessonView";
import LevelIcon from "./icons/LevelIcon";
import "./studyLessonView.scss";
import { ClientTopicProgress } from "./topic.model";
import { TopicItem, updateTopicProgress } from "./topic.slice";

enum StudyNavItemType {
  NONE = 'none',
  LEVELS = 'levels',
}

const StudyLessonView = (props: {
  baseSlug?: string;
}) => {
  const { baseSlug } = props;
  const { currentTopic, loading, fetchedTopicProgresses, list, topicProgresses, rootTopic } = useSelector((state) => state.topicState);
  const openTabletMenu = useSelector((state) => state.studyLayoutState.openTabletMenu);
  const { userId, user } = useSelector((state) => state.authState);
  const [tabletItemHovering, setTabletItemHovering] = useState<StudyNavItemType>(StudyNavItemType.NONE);
  const [tabletItemActive, setTabletItemActive] = useState<StudyNavItemType>(StudyNavItemType.NONE);

  const theme = useTheme();
  const isSmallDesktop = useMediaQuery(theme.breakpoints.between("lg", "xl"));
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));
  const dispatch = useDispatch();

  useEffect(() => {
    if (!!currentTopic?._id) {
      dispatch(updateTopicProgress(new ClientTopicProgress({ topicId: currentTopic?._id, userId, progress: 100 })))
    }
    setTimeout(() => {
      try {
        scroller.scrollTo(currentTopic?._id, {
          containerId: "sub-topic-list",
          duration: 800,
          delay: 0,
          smooth: 'easeInOutQuart'
        });
      } catch (error) { }
    }, 500);
  }, [currentTopic?._id]);

  const onClickTopicItem = (topic: TopicItem) => {
    if (topic._id === currentTopic?._id) return;
    const slug = `/${ROUTER_STUDY}/lesson${baseSlug ? `/${baseSlug}/` : '/'}${topic.slug}`;
    setTabletItemActive(StudyNavItemType.NONE);
    window.location.href = slug;
  }

  const renderLessonSubList = useCallback(() => {
    return <ScrollContainer thumbSize={50} style={{ height: "67vh" }} id="sub-topic-list">
      {list.map((topic, i) => {
        const isActive = topic._id === currentTopic._id;
        return <div
          key={topic._id}
          id={topic._id}
          className={classNames("sub-topic-item", isActive ? "sub-active" : "", isTabletUI ? "tablet" : "")}
          onClick={() => onClickTopicItem(topic)}
        >
          <div className="sub-topic-item-name item-with-mark">
            <span className="sub-topic-item-name-text dot-1">{topic.name}</span>
            {topicProgresses[topic._id]?.userId === userId && topicProgresses[topic._id]?.progress > 0 && <Check />}
          </div>
        </div>
      })}
    </ScrollContainer>
  }, [list, isTabletUI, topicProgresses]);

  const renderStudyNavMenuContent = () => {
    switch (tabletItemActive) {
      case StudyNavItemType.LEVELS:
        return <Box sx={{ pt: "30px", pl: "10px", background: "#fff" }}>{renderLessonSubList()}</Box>;
      default:
        return <></>;
    }
  };

  return <LoadingContainer loading={loading}>
    <div id="main-study-view" className="lesson-view">
      <Container maxWidth="xl_game">
        {!isTabletUI && <div style={{ display: "flex" }}>
          <div style={{ width: isSmallDesktop ? "250px" : "335px" }} />
          <Typography component="h1" className="root-topic-name">
            {`${rootTopic ? `${rootTopic?.name ?? ''}: ` : ''}${currentTopic.name}`}
          </Typography>
        </div>
        }
        <div className={classNames("main-study-layout", isTabletUI ? "tablet" : "")}>
          <div className={classNames(
            "study-layout-item study-layout-left",
            isSmallDesktop ? "small-desktop" : "",
            isTabletUI ? "tablet" : ""
          )}>
            {renderLessonSubList()}
          </div>

          <div className="study-layout-item study-layout-mid">
            <div className="main-lesson-view">
              <GameLessonView
                description={currentTopic?.description}
                videoUrl={currentTopic?.videoUrl}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>

    {isTabletUI && <>
      <div id="tablet-study-view-nav" className={openTabletMenu ? "tablet-nav-open" : ""}>
        <div className="tablet-study-main-nav" style={{ gridTemplateColumns: "1fr" }}>
          <div className="study-nav-item all-levels-item"
            onMouseEnter={() => setTabletItemHovering(StudyNavItemType.LEVELS)}
            onMouseLeave={() => setTabletItemHovering(StudyNavItemType.NONE)}
            onClick={() => {
              if (tabletItemActive === StudyNavItemType.LEVELS) setTabletItemActive(StudyNavItemType.NONE);
              else setTabletItemActive(StudyNavItemType.LEVELS);
            }}
          >
            <LevelIcon fill={(tabletItemHovering === StudyNavItemType.LEVELS || tabletItemActive === StudyNavItemType.LEVELS) ? "#007AFF" : undefined} />
            <div className={classNames("study-nav-item-label", tabletItemActive === StudyNavItemType.LEVELS ? "active" : "")}>Other parts</div>
          </div>
        </div>
      </div>
      <Drawer
        anchor="bottom"
        open={tabletItemActive !== StudyNavItemType.NONE}
        onClose={() => setTabletItemActive(StudyNavItemType.NONE)}
        PaperProps={{
          id: "tablet-study-menu-item-content"
        }}
      >
        {renderStudyNavMenuContent()}
      </Drawer>
    </>}
  </LoadingContainer>
}

export default StudyLessonView;