import { useEffect, useState } from "react";
import slugify from "slugify";
import { useDispatch } from "../../app/hooks";

export type HeadingData = {
  id: string;
  title: string;
  nested?: Array<HeadingData>;
}

const getSlug = (content: string) => slugify(content, { replacement: "-", remove: /[*+~.()?'"!:@/]/g, lower: true, strict: false, locale: "vi" });

const useHeadingsData = (args: {
  rootElement?: HTMLElement
}) => {
  const dispatch = useDispatch();
  const { rootElement } = args;
  const [headings, setHeadings] = useState<HeadingData[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && !!rootElement) {
      const headingEls = rootElement.querySelectorAll("h2, h3");
      const headingData: Array<HeadingData> = [];
      headingEls.forEach((heading) => {
        const title = heading.textContent;
        const id = getSlug(title);
        heading.id = id;

        if (heading.nodeName === "H2") {
          headingData.push({ id, title, nested: [] });
        } else if (heading.nodeName === "H3") {
          headingData[headingData.length - 1]?.nested?.push({ id, title });
        }
      });
      setHeadings(headingData);
    }
  }, [rootElement]);

  return { headings };
}

export default useHeadingsData;