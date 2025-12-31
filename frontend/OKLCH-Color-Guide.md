# OKLCH Color Guide for ShadSocial

A complete reference guide for understanding and modifying OKLCH colors in your project.

---

## What is OKLCH?

OKLCH is a modern color format that's more intuitive than RGB or HEX. It stands for:

- **O** = OK (a perceptually uniform color space)
- **L** = Lightness
- **C** = Chroma (color intensity)
- **H** = Hue (color type)

### Syntax

```css
oklch(L C H)
      │ │ │
      │ │ └── Hue (0-360) = Color wheel position
      │ └──── Chroma (0-0.4) = Color intensity/saturation
      └────── Lightness (0-1) = How light/dark (0=black, 1=white)
```

---

## Quick Examples

```css
oklch(0.50 0.20 255)  /* Medium blue */
      ↑    ↑    ↑
      │    │    └── 255 = Blue hue
      │    └─────── 0.20 = Medium saturation
      └──────────── 0.50 = Medium brightness

oklch(0.20 0 0)       /* Dark gray (no color, just gray) */
oklch(0.95 0 0)       /* Light gray (almost white) */
oklch(0.60 0.25 25)   /* Red (hue 25 = red) */
oklch(0.60 0.20 145)  /* Green (hue 145 = green) */
```

---

## HEX to OKLCH Conversion Table

### Common Colors

| Color | HEX | OKLCH |
|-------|-----|-------|
| White | #FFFFFF | `oklch(1 0 0)` |
| Black | #000000 | `oklch(0 0 0)` |
| Blue | #3B82F6 | `oklch(0.60 0.20 255)` |
| Red | #EF4444 | `oklch(0.60 0.22 25)` |
| Green | #22C55E | `oklch(0.65 0.20 145)` |
| Yellow | #EAB308 | `oklch(0.75 0.18 85)` |
| Purple | #8B5CF6 | `oklch(0.55 0.25 300)` |
| Orange | #F97316 | `oklch(0.65 0.20 45)` |
| Pink | #EC4899 | `oklch(0.60 0.22 350)` |
| Cyan | #06B6D4 | `oklch(0.65 0.15 195)` |

### Gray Scale

| Description | HEX | OKLCH |
|-------------|-----|-------|
| Almost Black | #0A0A0A | `oklch(0.05 0 0)` |
| Very Dark | #1A1A1A | `oklch(0.12 0 0)` |
| Dark | #2D2D2D | `oklch(0.20 0 0)` |
| Medium Dark | #404040 | `oklch(0.30 0 0)` |
| Medium | #737373 | `oklch(0.50 0 0)` |
| Medium Light | #A3A3A3 | `oklch(0.68 0 0)` |
| Light | #D4D4D4 | `oklch(0.85 0 0)` |
| Very Light | #F5F5F5 | `oklch(0.96 0 0)` |
| Almost White | #FAFAFA | `oklch(0.98 0 0)` |

---

## Hue Reference Guide

The Hue value (H) determines the color type on a 360° color wheel:

```
Hue 0-30     = Red / Orange-Red
Hue 30-60    = Orange / Yellow-Orange
Hue 60-90    = Yellow / Yellow-Green
Hue 90-120   = Lime / Green
Hue 120-150  = Green / Teal
Hue 150-180  = Cyan / Turquoise
Hue 180-210  = Cyan / Sky Blue
Hue 210-240  = Blue / Azure
Hue 240-270  = Blue / Indigo
Hue 270-300  = Purple / Violet
Hue 300-330  = Magenta / Pink
Hue 330-360  = Pink / Red
```

### Visual Hue Map

```
    0° Red
    |
330°|  30° Orange
    |
300°|      60° Yellow
Purple     |
    |      90° Lime
270°|          |
Blue           120° Green
    |              |
240°               150° Teal
    |                  |
210° Sky Blue    180° Cyan
```

---

## ShadSocial Current Color Palette

### Light Mode Colors

| Variable | OKLCH | Approximate HEX | Description |
|----------|-------|-----------------|-------------|
| --background | `oklch(0.95 0.005 250)` | #EEEEF0 | Page background |
| --foreground | `oklch(0.13 0.02 250)` | #1A1A1F | Main text |
| --card | `oklch(1 0 0)` | #FFFFFF | Card background |
| --primary | `oklch(0.55 0.25 255)` | #2563EB | Primary blue |
| --primary-foreground | `oklch(0.99 0 0)` | #FCFCFC | Text on primary |
| --secondary | `oklch(0.94 0.015 250)` | #EDEDF0 | Secondary background |
| --muted | `oklch(0.95 0.01 250)` | #F0F0F2 | Muted background |
| --muted-foreground | `oklch(0.45 0.02 250)` | #6B6B73 | Secondary text |
| --accent | `oklch(0.93 0.03 250)` | #E8E8ED | Hover background |
| --border | `oklch(0.85 0.01 250)` | #D1D1D6 | Border color |
| --input | `oklch(0.96 0.005 250)` | #F3F3F5 | Input background |
| --destructive | `oklch(0.55 0.25 25)` | #DC2626 | Error/Delete red |
| --success | `oklch(0.62 0.19 145)` | #16A34A | Success green |

### Dark Mode Colors

| Variable | OKLCH | Approximate HEX | Description |
|----------|-------|-----------------|-------------|
| --background | `oklch(0.12 0 0)` | #1F1F1F | Page background |
| --foreground | `oklch(0.93 0 0)` | #EDEDED | Main text |
| --card | `oklch(0.20 0 0)` | #333333 | Card background |
| --primary | `oklch(0.62 0.20 255)` | #3B82F6 | Primary blue |
| --primary-foreground | `oklch(0.98 0 0)` | #FAFAFA | Text on primary |
| --secondary | `oklch(0.26 0 0)` | #424242 | Secondary background |
| --muted | `oklch(0.24 0 0)` | #3D3D3D | Muted background |
| --muted-foreground | `oklch(0.65 0 0)` | #A6A6A6 | Secondary text |
| --accent | `oklch(0.28 0 0)` | #474747 | Hover background |
| --border | `oklch(0.32 0 0)` | #525252 | Border color |
| --input | `oklch(0.18 0 0)` | #2E2E2E | Input background |
| --destructive | `oklch(0.58 0.20 25)` | #EF4444 | Error/Delete red |
| --success | `oklch(0.55 0.16 145)` | #22C55E | Success green |

---

## How to Modify Colors

### Making Colors Lighter or Darker

To adjust brightness, change the **first number (L)**:

```css
/* Original */
--card: oklch(0.20 0 0);  /* Dark gray */

/* Lighter - increase L */
--card: oklch(0.25 0 0);  /* Lighter gray */
--card: oklch(0.30 0 0);  /* Even lighter */

/* Darker - decrease L */
--card: oklch(0.15 0 0);  /* Darker gray */
--card: oklch(0.10 0 0);  /* Even darker */
```

### Making Colors More or Less Saturated

To adjust color intensity, change the **second number (C)**:

```css
/* Original */
--primary: oklch(0.55 0.25 255);  /* Vibrant blue */

/* Less saturated - decrease C */
--primary: oklch(0.55 0.15 255);  /* Muted blue */
--primary: oklch(0.55 0.05 255);  /* Very muted blue */

/* More saturated - increase C (max ~0.4) */
--primary: oklch(0.55 0.30 255);  /* Very vibrant blue */
```

### Changing the Color Completely

To change the color type, change the **third number (H)**:

```css
/* Original - Blue */
--primary: oklch(0.55 0.25 255);

/* Change to Purple */
--primary: oklch(0.55 0.25 300);

/* Change to Green */
--primary: oklch(0.55 0.25 145);

/* Change to Red */
--primary: oklch(0.55 0.25 25);

/* Change to Orange */
--primary: oklch(0.55 0.25 45);
```

### Creating Gray Colors

For pure grays, set Chroma (C) to 0:

```css
oklch(0.10 0 0)  /* Very dark gray */
oklch(0.20 0 0)  /* Dark gray */
oklch(0.50 0 0)  /* Medium gray */
oklch(0.80 0 0)  /* Light gray */
oklch(0.95 0 0)  /* Very light gray */
```

---

## Online Tools for Conversion

### Recommended Converters

1. **OKLCH Color Picker**: [oklch.com](https://oklch.com)
   - Best for picking colors visually
   - Shows HEX, RGB, and OKLCH

2. **Color.js**: [colorjs.io/apps/convert](https://colorjs.io/apps/convert/)
   - Convert between any color formats

3. **CSS Color Converter**: [convertacolor.com](https://convertacolor.com)
   - Quick HEX to OKLCH conversion

---

## Quick Reference Card

### Lightness (L) - First Number
| Value | Result |
|-------|--------|
| 0.00 | Black |
| 0.10-0.20 | Very Dark |
| 0.20-0.40 | Dark |
| 0.40-0.60 | Medium |
| 0.60-0.80 | Light |
| 0.80-0.95 | Very Light |
| 1.00 | White |

### Chroma (C) - Second Number
| Value | Result |
|-------|--------|
| 0.00 | Pure Gray (no color) |
| 0.05-0.10 | Very Muted |
| 0.10-0.15 | Muted |
| 0.15-0.20 | Normal |
| 0.20-0.25 | Vibrant |
| 0.25-0.40 | Very Vibrant |

### Hue (H) - Third Number
| Value | Color |
|-------|-------|
| 0-30 | Red |
| 30-60 | Orange |
| 60-90 | Yellow |
| 90-145 | Green |
| 145-200 | Cyan |
| 200-270 | Blue |
| 270-330 | Purple |
| 330-360 | Pink/Red |

---

## Tips for Consistency

1. **Keep the same Lightness** for elements that should have equal visual weight
2. **Use consistent Chroma** across your primary colors for harmony
3. **For grays**, always use `0` for Chroma
4. **Test in both light and dark modes** after making changes
5. **Small changes matter** - even 0.02 difference in Lightness is visible

---

## Need Help?

If you need to convert a specific color:
1. Go to [oklch.com](https://oklch.com)
2. Enter your HEX code (e.g., #3B82F6)
3. Copy the OKLCH value shown
4. Paste into your globals.css

---

*Created for ShadSocial - December 2024*
