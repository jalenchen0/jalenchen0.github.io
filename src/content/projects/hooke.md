---
title: Hooke
order: 1
description: Measures resistance-band load from how far the band stretches, using computer vision.
status: building
node: { x: 500, y: 120, label: right }
tags:
  - { name: computer vision, x: 600, y: 60, labelX: 600, labelY: 44, anchor: end }
links:
  - { to: opengym, label: integrates, labelX: 510, labelY: 234 }
connections: [openGym fork, computer vision]
---
