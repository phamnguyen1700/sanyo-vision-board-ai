# SANYO Vision Board design system

## Tokens

Design tokens live in `app/globals.css`: SANYO red (`--red`), campaign blue (`--blue`), cream paper (`--cream`), pink and yellow accents, typography, radii, shadow, and motion easing. Use these variables rather than feature-specific hex values.

## Structure

- `.site-shell`, `.site-header`, `.site-footer`: shared microsite chrome
- `.button`, `.button--primary`, `.button--ghost`: reusable CTAs
- `.field`, `.choice-card`, `.kicker`, `.progress-dots`: shared form primitives
- `home__*`, `information__*`, `result__*`, `board__*`: feature-prefixed classes

New features should keep container logic in the feature entry and move visual composition into components. The current demo keeps the flow offline in session storage and exposes the shared `Session` model near the app boundary; replace `readSession`/`saveSession` with an API-backed repository when persistence is introduced.

## Adding a topic

Topic content lives in `lib/vision-topics.ts`. Navigation order and directions live in `lib/journey-flow.ts`, separately from board slot placement. The stable topic IDs map answers to review notes and result slots; use these same IDs for future image jobs and Canva fields.

## Motion

`Journey` accepts `scenes`, `transitionDuration` (seconds), `enableGestures`, and `resultImageSrc` props. Each scene's `transitionToNext` describes where the next screen enters: `down`, `right`, `up`, or `left`. Review uses `expand` to reveal the result inline. `result` is a terminal flow/session state, not another viewport screen. `next` defines the route, so array order and board coordinates do not drive navigation.

`useScreenJourney` locks navigation synchronously until `JourneyViewport` finishes its GSAP timeline. Only the active screen and its incoming neighbor are mounted. Back navigation reverses the preceding edge; editing from review opens the chosen topic and returns directly to review. Drafts, active screen, and edit return are stored through `lib/vision-session.ts`.

Wheel down/swipe forward requests the next valid step regardless of its visual direction. Native scrolling inside long screens takes priority; a fresh gesture at the boundary navigates. Form controls retain their native interactions. Review requires an explicit Manifest click. Set `enableGestures={false}` for button-only navigation.

`ReviewStage` owns a persistent area within the review screen. Review shows a text-only center and answer notes, with no design preview. `ManifestReveal` expands a paper surface from the center text bounds while the text and notes move outward and fade. Only its completion callback mounts `ResultBoard` in the same stage. There is no modal, portal, result screen navigation, or second zoom/fade after expansion. The result displays the supplied final design as one image component; replace `resultImageSrc` with the future Canva export URL. Both motion components clean up their GSAP contexts and settle immediately for `prefers-reduced-motion`.

The screen layout overrides live in `app/journey.css`, imported after the campaign's existing global styles. Header/footer stay outside the animated viewport; long screens scroll internally. Run `pnpm test:journey` for route, validation and session regression checks, and `pnpm exec tsc --noEmit` for full type checking. In environments where Turbopack cannot spawn its CSS worker, use `pnpm dev --webpack --port 3001` or `pnpm build --webpack`.

## Current mock boundaries

`public/vision-board-final-demo.png` is the user-supplied reference image used as the final design placeholder. It is not personalized or Canva-generated yet. Earlier topic inspiration images remain demo assets. Sharing uses the system share dialog or clipboard; it does not publish to Facebook. Replace the demo asset and result repository with generated image URLs, progress polling, and a public board URL when the backend is connected.
