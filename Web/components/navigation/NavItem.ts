export type OnClickFunction =
  "select-state"

type NavItem = {
  name: string;
  onClickFunction?: OnClickFunction;
  dynamic?: boolean;
  slug?: string;
  childs?: Array<NavItem>;
  locale?: string;
}

export default NavItem;