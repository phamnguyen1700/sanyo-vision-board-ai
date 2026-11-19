import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function CampaignTapePatches() {
  return (
    <>
      <span className="campaign-tape__patch campaign-tape__patch--left" aria-hidden="true" />
      <span className="campaign-tape__patch campaign-tape__patch--right" aria-hidden="true" />
    </>
  );
}

type CampaignTapeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: "discovery" | "vibe";
};

export function CampaignTape({
  children,
  className,
  tone = "discovery",
  ...props
}: CampaignTapeProps) {
  return (
    <span
      {...props}
      className={cn("campaign-tape", `campaign-tape--${tone}`, className)}
    >
      <CampaignTapePatches />
      <span className="campaign-tape__label">{children}</span>
    </span>
  );
}
