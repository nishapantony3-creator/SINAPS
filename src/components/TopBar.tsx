import React from "react";
import siteContent from "@/data/siteContent.json";

export default function TopBar() {
  const { announcement } = siteContent;

  return (
    <div className="top-bar">
      <div className="top-bar-inner">
        <span>{announcement.text}</span>
        <span className="sep">·</span>
        <span>{announcement.gradePill}</span>
        <span className="sep">·</span>
        <span>{announcement.cbsePill}</span>
        <span className="sep">·</span>
        <a href={`tel:${announcement.phone.replace(/[^0-9+]/g, "")}`}>
          <i className="ti ti-phone-call" style={{ marginRight: 4 }}></i>
          {announcement.phone}
        </a>
      </div>
    </div>
  );
}
