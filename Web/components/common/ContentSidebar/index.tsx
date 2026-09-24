import "./style.scss";

export type ContentSidebarItem = {
  key: string | number;
  label: string;
  active?: boolean;
  expanded?: boolean;
  children?: ContentSidebarItem[];
  onClick?: () => void;
};

type ContentSidebarProps = {
  items: ContentSidebarItem[];
  className?: string;
};

const ContentSidebar = ({ items, className = "" }: ContentSidebarProps) => {
  const renderItems = (sidebarItems: ContentSidebarItem[], isChild = false) => (
    <ul className={isChild ? "content-sidebar-sub-list" : "content-sidebar-list"}>
      {sidebarItems.map((item) => {
        const hasChildren = !!item.children?.length;

        return (
          <li
            key={item.key}
            className={[
              "content-sidebar-item",
              item.active ? "active" : "",
              hasChildren ? "has-children" : "",
            ].filter(Boolean).join(" ")}
          >
            <button type="button" onClick={item.onClick}>
              <span>{item.label}</span>
              {hasChildren && <strong>{item.expanded ? "-" : "+"}</strong>}
            </button>
            {hasChildren && item.expanded && renderItems(item.children, true)}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside className={`content-sidebar-wrapper ${className}`}>
      <nav className="content-sidebar" aria-label="Danh mục nội dung">
        {renderItems(items)}
      </nav>
    </aside>
  );
};

export default ContentSidebar;
