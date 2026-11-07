---
inclusion: always
---
# Art style: 1992 Windows 3.1 edutainment

The look is studied from a 1992 Windows typing tutor (local reference only, in Crew Knowledge, **never committed**). We copy its **technique**, never its images.

## Palette: bavis-21 (`assets/palette/bavis-21.gpl`)
The reference's 161 bitmaps use exactly these 21 colours: the Windows 16 plus five three-quarter shades.

`000000 800000 008000 808000 000080 800080 008080 C0C0C0 808080 FF0000 00FF00 FFFF00 0000FF FF00FF 00FFFF FFFFFF` + `BF0000 00BF00 BFBF00 0000BF 00BFBF`

Any pixel outside this set fails the asset pipeline. Fully transparent pixels are allowed.

## Technique
| Trait | Rule |
|---|---|
| Screen | 640×480 logical; full-screen backdrops are 640×480; an on-screen keyboard strip is 640×222 |
| Shading | Ordered / pattern **dithering** in place of extra colours |
| Animation | **Frame swap**, no tweening or easing: short cycles of 4–8 whole frames (metronome 7 × 92×49, logo 8 × 270×134, road stripe 4 × 81×105, sparkle 4 × 21×24) |
| Fake 3D | Pre-drawn **fixed sizes** of an object (reference: 18 sizes from 9×5 to 233×149), swapped by distance; never scaled at run time |
| Transparency | Reference used paired 1-bit masks; we use PNG alpha (1-bit: fully on or fully off, no soft edges) |
| Sizes | Props about 50–170 px tall, splats 30×20, buttons 54×34 with three states (normal, pressed, disabled) |
| Text | OFL pixel/bitmap fonts, self-hosted, rendered at whole-pixel sizes |

## AI pixel art
AI-made sprites are an experiment, not the default (John draws the art). Any AI output must go through quantise-to-bavis-21 + dither + native-size check before use, and must be logged in `docs/ai-pixel-test.md`.
