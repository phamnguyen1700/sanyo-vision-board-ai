'use client'

import { TiltCard } from '@/components/motion/tilt-card'
import { DEMO_IMAGE } from '@/lib/vision-topics'
import type { SceneTransition } from '@/lib/journey-flow'
import { DirectionIcon } from './direction-icon'

export function HeroSection({ onStart, direction }: { onStart: () => void; direction?: SceneTransition }) {
  return (
    <section className="journey-hero">
      <div className="hero-copy paper-reveal">
        <span className="hero-kicker">SANYO PRESENTS · A COOLER WAY TO DREAM</span>
        <h1>
          VISION
          <br />
          <em>BOARD</em>
          <strong>2027</strong>
        </h1>
        <p>
          Cool một năm thật khác.
          <br />
          Manifest phiên bản <b>COOL NEW ME!</b> của bạn.
        </p>
        <button type="button" className="hero-arrow hero-arrow--button" onClick={onStart}>
          <span>KHÁM PHÁ THÊM</span>
          <DirectionIcon direction={direction} />
        </button>
      </div>
      <TiltCard className="hero-collage-wrap">
        <div className="hero-collage paper-photo">
          <img src={DEMO_IMAGE} alt="SANYO vision board collage reference" />
          <span className="tape tape--hero" />
          <span className="photo-note">
            NEW YEAR
            <br />
            <b>NEW VIBE</b>
          </span>
        </div>
      </TiltCard>
      <div className="scribble scribble--hero">
        Dream it.
        <br />
        Plan it.
        <br />
        <b>Cool it.</b>
      </div>
    </section>
  )
}
