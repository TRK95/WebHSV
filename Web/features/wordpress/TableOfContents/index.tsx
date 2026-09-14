import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import classNames from "classnames";
import { Fragment, PropsWithoutRef, useEffect, useRef, useState } from "react";
import RawLink from "../../../components/RawLink";
import { HeadingData } from "../useHeadingsData";
import "./toc.scss";

const TableOfContents = (props: PropsWithoutRef<{
  headings: Array<HeadingData>;
  className?: string;
}>) => {
  const { headings, className } = props;
  const tocRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stickyTOC = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > 130) {
          if (tocRef.current) tocRef.current.classList.add("sticky");
        } else {
          if (tocRef.current) tocRef.current.classList.remove("sticky");
        }
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", stickyTOC);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", stickyTOC);
      }
    }
  }, []);

  return <div id="post-toc" ref={tocRef} className={classNames(className)}>
    {!!headings.length && <>
      <Accordion
        defaultExpanded
        elevation={0}
        className="post-toc-container"
      >
        <AccordionSummary expandIcon={<ExpandMore />} className="post-toc-header">
          Table of Contents
        </AccordionSummary>

        <AccordionDetails>
          {headings.map((heading, i) => {
            return <Fragment key={i}>
              <div className="post-toc-list-item" key={i}>
                <RawLink href={`#${heading.id}`}>{heading.title}</RawLink>
              </div>

              {!!heading.nested && <div className="post-toc-nested">
                {heading.nested.map((childHeading, cI) => {
                  return <div className="post-toc-list-item child-item" key={cI}>
                    <RawLink href={`#${childHeading.id}`}>{childHeading.title}</RawLink>
                  </div>
                })}
              </div>}
            </Fragment>
          })}
        </AccordionDetails>
      </Accordion>
    </>}
  </div>
}

export default TableOfContents;