# Composition Patterns

Reusable composition structures for deterministic video work. Use these as implementation patterns under the rules in [house-style.md](house-style.md).

## Picture-in-Picture

Animate a wrapper for position and size; the media element fills the wrapper. Keep lifecycle `data-*` attributes on the media element, not the wrapper.

## Text Behind Subject

Use three synchronized layers:

1. opaque base video;
2. headline layer;
3. transparent cutout video above the headline.

Keep both videos mounted from the same start time so decoding stays frame-aligned. Control visibility on a wrapper without lifecycle attributes because the runtime may own opacity on active media elements.

## Title Cards

Use a dedicated timed composition with explicit entrance and deterministic end state. Do not rely on implicit visibility after the final tween.

## Slides and Sections

Use separate timed elements on the same track. Let the composition runtime mount and unmount by `data-start` and `data-duration` rather than manually hiding arbitrary DOM trees.

## Top-Level Composition

A top-level composition may combine primitive video, image, audio, and nested composition elements. Register one paused GSAP timeline under the composition ID and let the framework nest sub-compositions.

## Core constraints

- wrappers own layout animation;
- media elements own playback lifecycle;
- synchronized overlays start together;
- every timeline covers the full composition duration;
- nested compositions remain deterministic and seekable;
- no runtime-only state that cannot be reconstructed by timeline seeking.
