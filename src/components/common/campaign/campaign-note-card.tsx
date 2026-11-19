import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CampaignNoteCardProps = ComponentPropsWithoutRef<typeof Card> & {
  children: ReactNode;
};

export function CampaignNoteCard({ className, children, ...props }: CampaignNoteCardProps) {
  return (
    <Card {...props} className={cn("campaign-note-card", className)}>
      {children}
    </Card>
  );
}
