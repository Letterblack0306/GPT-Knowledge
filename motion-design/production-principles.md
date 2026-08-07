# Motion Design Production Principles

## Scope

This reference consolidates production rules for scene direction, typography, captions, transitions, audio reactivity, and deterministic GSAP composition.

## Scene direction

Treat every beat as a visual world, not a static layout. Define:

- concept and intended viewer experience;
- mood and cultural/design references;
- depth layers: background, midground, foreground;
- a specific motion verb for every element;
- sound cues;
- transition type, duration, and easing;
- the handoff into the next beat.

Declare the overall rhythm before implementation, such as `hook-PUNCH-hold-CTA` or `drift-build-PEAK-drift-resolve`.

## Video composition

Video frames are not web pages.

- Use 8–10 meaningful visual elements per scene.
- Include background texture, midground content, and foreground accents.
- Maintain at least two focal points.
- Anchor content to zones and edges rather than relying on centered stacks.
- Use video-scale typography: headlines generally 64–120 px, body 28–42 px, labels 18–24 px.
- Make accent color visible enough to survive compression.
- Every decorative element needs purposeful ambient motion.

## Motion hierarchy

- Entrances use `.out` eases; exits use `.in`; repositioning uses `.inOut`.
- Vary ease, duration, direction, and stagger deliberately.
- The slowest motion in a sequence should be materially slower than the fastest.
- Entrances are usually longer than exits.
- The first moving element establishes hierarchy.
- Every scene should contain build, breathe, and resolve phases.
- Do not start the first animation exactly at time zero; use a small intentional offset.

## Deterministic GSAP rules

- Prefer `tl.fromTo()` over `tl.from()` when scenes are seeked non-linearly.
- Do not stack independent transform tweens on the same element. Combine them or split motion across parent and child.
- Attach ambient motion to the seekable scene timeline, never standalone wall-clock tweens.
- Hard-kill visibility at scene boundaries when an element must remain gone.
- Avoid runtime randomness and wall-clock values.
- Do not use iframes for captured content; use screenshots or native layers.

## Typography

- Avoid default AI font monoculture.
- Do not pair two similar sans-serifs; use cross-category contrast or one family with strong internal contrast.
- Use one expressive voice and one supporting voice unless the concept explicitly requires multiple registers.
- Weight contrast must be obvious in motion.
- Treat timing and motion as part of typography.
- Use tabular numerals for vertically aligned data.
- Compensate for light-on-dark optical weight and spacing.

## Captions

- Use language-appropriate transcription models. Do not use `.en` models unless the audio is confirmed English.
- Read and quality-check the transcript before building captions.
- Reject or retry transcripts with excessive music tokens, nonsense, or unreliable timestamps.
- Group words based on energy and natural phrase breaks.
- Keep one caption group visible at a time.
- Fit long text deterministically and reserve scale headroom for emphasized words.
- Every caption group requires a deterministic visibility kill at its end.
- Emphasis words may use stronger scale, color, marker highlight, circle, burst, or scribble treatment.

## Audio reactivity

For music-driven work, audio reactivity is required, but it must remain content-led.

- Pre-extract deterministic per-frame audio data.
- Map bass to controlled scale, treble to glow, and amplitude to subtle lift or color breathing.
- Keep text reactions subtle; larger background forms may react more strongly.
- Do not add generic equalizers, waveform displays, rainbow cycling, or strobing.
- Audio controls timing and intensity; narrative and brand determine visual vocabulary.

## Transitions

Transitions communicate meaning:

- crossfade: continuation;
- hard cut: disruption;
- push/slide: next point;
- blur/focus pull: drift or reflection;
- zoom and shader distortion: hero reveal or energy shift.

Choose one primary transition family and one or two accents. Do not use a different transition for every scene. Match duration and easing to energy. For shader-based compositions, follow capture-safe CSS constraints and do not mix CSS and shader transition systems in the same composition.

## Design selection

Use a two-stage process:

1. choose a complete mood-board direction;
2. fine-tune architecture, palette, typography, density, depth, and easing.

Options must be contextual to the actual product, brand, audience, and narrative. Generic mood boards are a failure. Preview layouts must be dense enough to expose real differences and must use all design tokens visibly.

## Prompt expansion

After design direction is established, expand every multi-scene prompt into a full production specification containing:

- exact design tokens;
- rhythm declaration;
- global motion rules;
- per-scene concepts and depth layers;
- motion verbs for every element;
- specific transitions;
- recurring motifs;
- negative constraints.

The expansion is not a summary. It enriches the user's brief with atmosphere, micro-details, ambient motion, and object-level transition choreography.
