import { ExpandLess, ExpandMore } from "@mui/icons-material";
import classNames from "classnames";
import { useRouter } from "next/router";
import { MouseEvent, PropsWithoutRef, useState } from "react";
import NextLink from "../NextLink";
import "./mobileMegaNav.scss";
import NavItem from "./NavItem";

const MobileMegaNav = (props: PropsWithoutRef<{
  item: NavItem;
  onClickCallback?: () => void;
}>) => {
  const { item: { name, childs, slug, locale }, onClickCallback = () => { } } = props;
  const [open, setOpen] = useState(false);
  const [buttonExRef, setButtonExRef] = useState<HTMLDivElement | null>(null);
  const router = useRouter();
  const handleClickItem = (event: MouseEvent<HTMLDivElement>) => {
    const node = event.target as Node;
    if (node.contains(buttonExRef) || node.contains(buttonExRef.firstChild)) {
      setOpen(!open);
    } else {
      router.push(slug);
      onClickCallback();
    }
  }

  return <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
    <div className="mobile-mega-nav" onClick={handleClickItem}>
      <div className="mobile-mega-nav-parent-title">{name}</div>
      <div className="mobile-mega-nav-expand-icon" ref={setButtonExRef}>
        {open ? <ExpandLess /> : <ExpandMore />}
      </div>
    </div>
    {open && <div className="mobile-mega-children">
      {childs?.map((cItem, i) => (
        <div key={i} className={classNames("mobile-mega-children-item", i === childs?.length - 1 ? "last" : "")}>
          <NextLink href={cItem.slug}>
            {cItem.name}
          </NextLink>
        </div>
      ))}
    </div>}
  </div>
}

export default MobileMegaNav;