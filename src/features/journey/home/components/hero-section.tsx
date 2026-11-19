"use client";

import { TiltCard } from "@/components/motion/tilt-card";
import { DEMO_IMAGE } from "@/lib/vision-topics";
import type { SceneTransition } from "@/lib/journey-flow";
import { CampaignDiscoveryButton } from "@/components/common/campaign";

export function HeroSection({
  onStart,
  direction,
}: {
  onStart: () => void;
  direction?: SceneTransition;
}) {
  return (
    <section className="journey-hero journey-hero--desktop">
      <TiltCard className="hero-collage-wrap">
        <div className="hero-collage paper-photo">
          <img src={DEMO_IMAGE} alt="SANYO vision board collage reference" />
          <span className="tape tape--hero" />
          <span className="photo-note">
            NEW YEAR
            <br />
            <b>NEW VIBE</b>
          </span>
          <CampaignDiscoveryButton
            onClick={onStart}
            direction={direction}
          />
        </div>
      </TiltCard>
      <aside className="hero-program-note">
        <span>SANYO PRESENTS</span>
        <strong>
          A COOLER WAY
          <br />
          TO DREAM.
        </strong>
        <small>
          VISION BOARD 2027
          <br />
          05 CHỦ ĐỀ · 01 COOL NEW ME
        </small>
      </aside>
      <div className="scribble scribble--hero" aria-hidden="true">
        Dream it.
        <br />
        Plan it.
        <br />
        <b>Cool it.</b>
      </div>
    </section>
  );
}
