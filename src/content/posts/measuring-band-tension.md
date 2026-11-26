---
title: Measuring band tension from stretch
description: Why a resistance band's label isn't enough, and how Hooke turns stretch into weight.
date: 2026-11-25
tags: [hooke, physics, computer-vision]
draft: true
---

I train at home with handled resistance bands. They work a lot like a cable machine, with one catch: the resistance changes with how far the band is stretched, and the label only gives a range. That makes it hard to tell whether I'm actually progressing.

Hooke is my attempt to fix that: estimate the load I'm pulling from how far the band is stretched.

## Hooke's law is the starting point

Hooke's law says force grows in a straight line with stretch: `F = kx`. It's a decent first approximation for a band, but real latex isn't perfectly linear, and no two bands are the same. So instead of trusting one constant, each band gets its own measured curve.

<figure>
<svg class="chart" viewBox="0 0 600 300" role="img" aria-label="Schematic chart: a straight dashed line for Hooke's law and a curved solid line for a real band, with calibration points along the curve">
<line class="axis" x1="60" y1="260" x2="580" y2="260"/>
<line class="axis" x1="60" y1="260" x2="60" y2="20"/>
<line class="model" x1="60" y1="260" x2="560" y2="60"/>
<path class="data" d="M60 260 C 120 200, 200 190, 300 170 S 470 110, 560 30"/>
<circle class="pt" cx="140" cy="203" r="4.5"/><circle class="pt" cx="230" cy="184" r="4.5"/><circle class="pt" cx="320" cy="164" r="4.5"/><circle class="pt" cx="420" cy="130" r="4.5"/><circle class="pt" cx="510" cy="78" r="4.5"/>
<text x="580" y="284" text-anchor="end">stretched length →</text>
<text x="70" y="24">force ↑</text>
<text x="548" y="28" text-anchor="end">real band</text>
<text class="m" x="150" y="250">Hooke's law (F = kx)</text>
<text class="m" x="190" y="128">fish-scale readings</text>
</svg>
<figcaption>FIG. 1 — Schematic only, not measured data. The dots are where calibration readings go.</figcaption>
</figure>

## The plan

**Calibrate each band.** Pull it to a series of tape-measured lengths and record the fish-scale reading at each one. Plotted together, those readings are that band's force-versus-length curve.

**Measure during a set.** Computer vision compares the band's stretched length to its rest length, and the curve turns that into an effective weight.

```ts
// one curve per band: [length_cm, scale_reading_lb]
const curve: [number, number][] = [/* calibration points */];

const loadAt = (lengthCm: number) => interpolate(curve, lengthCm);
```

Next up: tracking the band in video.
