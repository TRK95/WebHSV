import Image from "next/image";
import { ExpandMore } from "@mui/icons-material";
import { Box, Collapse, Paper, Popover, Theme, Tooltip, Typography } from "@mui/material";
import { SxProps } from "@mui/system";
import { useRouter } from "next/router";
import { PropsWithoutRef, useEffect, useMemo, useState } from "react";
import appConfigs from "../../config/appConfigs.json";
import ScrollContainer from "../../features/common/ScrollContainer";
import useCheckState from "../../hooks/useCheckState";
import NextLink from "../NextLink";
import MobileMegaNav from "./MobileMegaNav";
import NavItem from "./NavItem";
import ClubFeatureChild from "../../models/ClubFeatureChild";
import { apiGetClubFeatureChildByClubSlug } from "../../utils/api/clubFeatureApi";
import { RESPONSE_SUCCESS, STATUS_PUBLIC } from "../../utils/constraint";
import Loading from "../loading/Loading";
import { LoadingOutlined, RightOutlined } from "@ant-design/icons";

const appName = process.env.NEXT_PUBLIC_APP_NAME;
const data = appConfigs[appName] || {};

const desktopMenuItemStyle: SxProps<Theme> = {
  display: 'block', textAlign: 'left', padding: '0', fontWeight: 700, color: data.menuTextColor, flex: "0 0 auto", cursor: "pointer"
}

const NavItemLink = (props: PropsWithoutRef<NavItem & {
  tabActive?: boolean;
  onClickCallback?: () => void;
  type: "nav" | "toggle"
}>) => {
  const { type, tabActive, onClickFunction, onClickCallback, ...item } = props;
  const { name, slug, childs } = item;

  const router = useRouter();
  const hasChild = useMemo(() => !!childs?.length, [childs?.length]);
  const totalChilds = useMemo(() => childs?.length ?? 0, [childs?.length]);
  const { checkState, currentState } = useCheckState();
  const [clubFeatures, setClubFeatures] = useState<ClubFeatureChild[]>([]);
  const [loading, setLoading] = useState(true);
  const [indexOpen, setIndexOpen] = useState(-1)


  const fetchClubFeature = async (club: NavItem) => {
    const res = await apiGetClubFeatureChildByClubSlug({
      slug: club?.slug,
      status: STATUS_PUBLIC
    });
    if (res.status === RESPONSE_SUCCESS) {
      setClubFeatures(res.data);
      setLoading(false)
    }
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, childItem: NavItem, index: number) => {
    setLoading(true)
    setClubFeatures([])
    // if (index === indexOpen)
    //   setOpen(!open)
    fetchClubFeature(childItem);
    setIndexOpen(index)
  };

  const handlePopoverClose = () => {
    setLoading(true)
    setClubFeatures([])
    setIndexOpen(-1)
  };

  const handleClickFunction = () => {
    if (onClickFunction === "select-state") {
      checkState({
        practiceSlug: `${currentState?.slug}-full-test`,
        onClickSamePath: () => {
          router.push({ hash: `${currentState?.slug}-full-test` }, undefined, { shallow: true });
        }
      });
    } else if (onClickFunction === "scroll") {
      const id = item.slug?.startsWith("#") ? (item.slug?.slice(1) ?? '') : '';
      if (!id) return;
      const element = document.getElementById(id);
      if (element) {
        router.push({ hash: item.slug }, undefined, { shallow: true });
      } else {
        router.push({ pathname: "/", hash: item.slug });
      }
    } else {
      router.push(item.slug);
    }
    if (typeof onClickCallback !== "undefined") onClickCallback();
  };

  return type === "nav"
    ? <>
      <Box className="main-menu-item-desktop" onClick={handleClickFunction} sx={desktopMenuItemStyle}>
        <div className="menu-item-desktop-title">
          <span>{name}</span>
        </div>
      </Box>
      {hasChild && (
        <Paper className="sub-menu-desktop" elevation={1}>
          {totalChilds >= 9 ? (
            <ScrollContainer thumbSize={50} style={{ height: 504 }}>
              {childs?.map((childItem, i) => (
                <NextLink href={childItem.slug} key={i}>
                  <div className="sub-menu-desktop-title">{childItem.name}</div>
                </NextLink>
              ))}
            </ScrollContainer>
          ) : (
            <>
              {childs?.map((childItem, i) => (
                name !== "Tổ chức của bạn" ? (
                  <NextLink href={childItem.slug} key={i}>
                    <div className="sub-menu-desktop-title">{childItem.name}</div>
                  </NextLink>
                ) : (
                  <div key={i} onMouseEnter={(event) => handlePopoverOpen(event, childItem, i)} onMouseLeave={handlePopoverClose}>
                    <div className="sub-menu-desktop-title">
                      <div className="sub-menu-desktop-title-main">
                        {childItem.name}
                        <RightOutlined />
                      </div>
                      <Paper className="your-club-feature">
                        {
                          (loading && indexOpen === i) ? <LoadingOutlined /> : (
                            <>
                              {clubFeatures.length > 0 ? (
                                clubFeatures.map((clubFeature, index) => (
                                  <NextLink href={`/to-chuc-cua-ban/${childItem?.slug}/${clubFeature?.slug}-${clubFeature?._id}`} key={index}>
                                    <div className="your-club-feature-title" style={{ display: indexOpen === i ? "block" : "none", cursor: "pointer" }}>
                                      {clubFeature?.title}
                                    </div>
                                  </NextLink>
                                ))
                              ) : (
                                <div className="your-club-feature-title" style={{ display: indexOpen === i ? "block" : "none", cursor: "not-allowed" }}>Chưa có dữ liệu</div>
                              )}
                            </>
                          )
                        }
                      </Paper>
                    </div>
                  </div>
                )
              ))}
            </>
          )}
        </Paper>
      )}
    </>
    : (
      <>
        {hasChild ? (
          <MobileMegaNav item={item} onClickCallback={onClickCallback} />
        ) : (
          <Typography textAlign="center">
            <Box
              onClick={() => {
                if (!!onClickFunction) {
                  handleClickFunction();
                }
                onClickCallback();
              }}
              component="span"
            >
              {!!onClickFunction ? (
                item.name
              ) : (
                <NextLink href={`${item.slug}`}>{item.name}</NextLink>
              )}
            </Box>
          </Typography>
        )}
      </>
    );
}

export default NavItemLink;
