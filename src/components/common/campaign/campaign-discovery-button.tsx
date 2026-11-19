import type { ComponentProps } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CampaignTapePatches } from "./campaign-tape";
import type { SceneTransition } from "@/lib/journey-flow";
import { cn } from "@/lib/utils";

type CampaignDiscoveryButtonProps = Omit<
  ComponentProps<typeof Button>,
  "children"
> & {
  direction?: SceneTransition;
  label?: string;
};

export function CampaignDiscoveryButton({
  className,
  direction,
  label = "KHÁM PHÁ THÊM",
  ...props
}: CampaignDiscoveryButtonProps) {
  const Icon = {
    down: ArrowDown,
    right: ArrowRight,
    up: ArrowUp,
    left: ArrowLeft,
    expand: Expand,
  }[direction ?? "down"];

  return (
    <Button
      {...props}
      type="button"
      variant="ghost"
      className={cn(
        "campaign-discovery-tape",
        className,
      )}
    >
      <CampaignTapePatches />
      <span>{label}</span>
      <Icon size={17} aria-hidden="true" />
    </Button>
  );
}
