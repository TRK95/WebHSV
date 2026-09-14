import { LinearProgress, useMediaQuery, useTheme } from "@mui/material";
import { withStyles } from "@mui/styles";
import classNames from "classnames";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { PropsWithoutRef, useEffect, useMemo } from "react";
import { scroller } from "react-scroll";
import { useDispatch, useSelector } from "../../../app/hooks";
import { ROUTER_STUDY } from "../../../app/router";
import { TOPIC_TYPE_TEST } from "../../../modules/share/constraint";
import Topic from "../../../modules/share/model/topic";
import "./style.scss";

const ScrollContainer = dynamic(() => import("../../common/ScrollContainer"), { ssr: false });

const TopicProgress = withStyles(() => ({
  barColorPrimary: { backgroundColor: "#4CAF50" }
}))(LinearProgress);

const SubTopicList = (props: PropsWithoutRef<{
  clickItemCallback?: () => void;
  onClickTopic?: (topic: Topic) => void;
  list?: Topic[];
}>) => {
  const {
    clickItemCallback = () => { },
    list: _list,
    onClickTopic: _onClickTopic
  } = props;
  const topics = useSelector((state) => state.topicState.list);
  const hasSub = useSelector((state) => state.topicState.hasSub);
  const rootTopic = useSelector((state) => state.topicState.rootTopic);
  const subTopic = useSelector((state) => state.topicState.subTopic);
  const topicProgresses = useSelector((state) => state.topicState.topicProgresses);
  const userId = useSelector((state) => state.authState.userId);
  const router = useRouter();

  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));

  const subTopicList = useMemo(() =>
    typeof _list !== "undefined"
      ? _list
      : (
        hasSub ? topics.filter((e) => e.parentId === rootTopic?._id) : topics.filter((e) => !e.parentId)
      ), [hasSub, rootTopic?._id, topics.length, _list]
  );

  useEffect(() => {
    setTimeout(() => {
      try {
        scroller.scrollTo(subTopic?._id, {
          containerId: "sub-topic-list",
          duration: 800,
          delay: 0,
          smooth: "easeInOutQuart"
        });
      } catch (error) { }
    }, 500);
  }, [subTopic?._id]);

  const onClickTopic = (item: Topic) => {
    if (item._id === subTopic?._id) return;
    if (typeof _onClickTopic !== "undefined") {
      _onClickTopic(item);
    } else {
      const slugs = router.query.slugs as string[];
      const slug = `/${ROUTER_STUDY}/${[...slugs.slice(0, -2), item.slug].join("/")}`;
      window.location.href = slug;
    }
    clickItemCallback();
  }

  return (<ScrollContainer thumbSize={50} style={{ height: "67vh" }} id="sub-topic-list">
    {subTopicList.map((topic, i) => {
      const isActive = topic._id === subTopic?._id;
      const progress = topicProgresses[topic._id]?.userId === userId ? (topicProgresses[topic._id]?.progress ?? 0) : 0;
      // const progress = topicProgresses[topic._id] ? (topicProgresses[topic._id]?.progress ?? 0) : 0;
      return (<div
        key={topic._id}
        id={topic._id}
        className={classNames("sub-topic-item", isActive ? "sub-active" : "", isTabletUI ? "tablet" : "")}
        onClick={() => onClickTopic(topic)}
      >
        <div className="sub-topic-item-name dot-1">{topic.name}</div>
        {topic.type !== TOPIC_TYPE_TEST && 
          <div className="sub-topic-progress">
            <TopicProgress
              className={classNames("sub-topic-progress-bar", isTabletUI ? "tablet" : "")}
              color="primary"
              variant="determinate"
              value={progress}
              style={{flex: 1}}
            />
            <div 
              className="topic-progress-percent" 
              style={
                {
                  color: progress > 0 ? "#62B966" : "unset",
                  marginLeft: "4px"
                }
              }
              >
                {progress}%
            </div>
          </div>
        }
      </div>)
    })}
  </ScrollContainer>)
}

export default SubTopicList;