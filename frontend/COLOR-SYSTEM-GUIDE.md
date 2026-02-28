# 🎨 ShadSocial Color System Guide

Complete reference for all colors used across the application in both Light and Dark modes.

---

## 📋 Table of Contents
1. [Color Variables Overview](#color-variables-overview)
2. [Component Color Mapping](#component-color-mapping)
3. [Quick Reference by Use Case](#quick-reference-by-use-case)
4. [How to Modify Colors](#how-to-modify-colors)

---

## 🎨 Color Variables Overview

### Light Mode Colors
```css
--background: oklch(0.95 0.005 250)      /* Page background - light gray */
--foreground: oklch(0.15 0.02 250)       /* Main text - dark gray */
--card: oklch(1 0 0)                     /* Cards - pure white */
--card-foreground: oklch(0.15 0.02 250)  /* Card text - dark gray */
--primary: oklch(0.55 0.25 255)          /* Brand blue - vibrant */
--primary-foreground: oklch(0.99 0 0)    /* Text on primary - white */
--secondary: oklch(0.94 0.015 250)       /* Secondary bg - light gray */
--secondary-foreground: oklch(0.20 0.05 250) /* Secondary text */
--muted: oklch(0.95 0.01 250)            /* Muted bg - very light gray */
--muted-foreground: oklch(0.45 0.02 250) /* Muted text - medium gray */
--accent: oklch(0.93 0.03 250)           /* Hover states - soft blue */
--accent-foreground: oklch(0.20 0.05 250) /* Accent text */
--destructive: oklch(0.55 0.25 25)       /* Error/delete - red */
--success: oklch(0.62 0.19 145)          /* Success - green */
--border: oklch(0.85 0.01 250)           /* Borders - light gray */
--input: oklch(0.96 0.005 250)           /* Input bg - very light */
--ring: oklch(0.55 0.25 255)             /* Focus ring - blue */
```

### Dark Mode Colors
```css
--background: oklch(0.12 0 0)            /* Page background - true dark */
--foreground: oklch(0.93 0 0)            /* Main text - off-white */
--card: oklch(20.32% 0.00928 255.668)    /* Cards - elevated dark */
--card-foreground: oklch(0.93 0 0)       /* Card text - off-white */
--primary: oklch(0.62 0.20 255)          /* Brand blue - vibrant */
--primary-foreground: oklch(0.98 0 0)    /* Text on primary - white */
--secondary: oklch(0.26 0 0)             /* Secondary bg - dark gray */
--secondary-foreground: oklch(0.90 0 0)  /* Secondary text */
--muted: oklch(0.24 0 0)                 /* Muted bg - dark gray */
--muted-foreground: oklch(0.65 0 0)      /* Muted text - light gray */
--accent: oklch(0.28 0 0)                /* Hover states - lighter dark */
--accent-foreground: oklch(0.93 0 0)     /* Accent text */
--destructive: oklch(0.58 0.20 25)       /* Error/delete - red */
--success: oklch(0.55 0.16 145)          /* Success - green */
--border: oklch(0.32 0 0)                /* Borders - medium gray */
--input: oklch(0.18 0 0)                 /* Input bg - dark */
--ring: oklch(0.62 0.20 255)             /* Focus ring - blue */
```

---

## 🗂️ Component Color Mapping

### 1. **PostCard** (`frontend/components/Home/Util/PostCard.tsx`)

#### Container
- **Background**: `bg-card` (white in light, dark gray in dark)
- **Border**: `border-border/50` (subtle border)
- **Shadow**: `shadow-md` → `hover:shadow-lg`

#### User Header
- **Background**: `bg-card`
- **Username**: `text-foreground` (main text color)
- **Bio**: `text-muted-foreground` (secondary text)
- **Avatar Ring**: `ring-border` → `hover:ring-primary/50`

#### Caption
- **Text**: `text-foreground` (main text)
- **Background**: `bg-card`

#### Interaction Buttons
- **Like Button**:
  - Default: `text-muted-foreground`
  - Liked: `text-red-500` with `fill-red-500`
  - Hover: `hover:bg-accent/50` + `hover:text-red-500`
  
- **Comment Button**:
  - Default: `text-muted-foreground`
  - Hover: `hover:bg-accent/50` + `hover:text-primary`
  
- **Share Button**:
  - Default: `text-muted-foreground`
  - Hover: `hover:bg-accent/50` + `hover:text-green-600`

#### Tooltip
- **Background**: `bg-card`
- **Border**: `border-border`
- **Text**: inherits from parent

#### Comment Section
- **Background**: `bg-card`
- **Border Top**: `border-border/30`
- **Input Background**: `bg-accent/30`
- **Input Border**: `border-border/30`
- **Input Text**: `text-foreground`
- **Placeholder**: `placeholder:text-muted-foreground`
- **Send Button**: `bg-primary` + `text-white`

#### Poll Options
- **Default**: `border-border` + `hover:bg-accent`
- **Voted**: `bg-primary/10` + `border-primary`
- **Progress Bar**: `bg-muted` (container) + `bg-primary` (fill)
- **Text**: `text-foreground`
- **Percentage**: `text-muted-foreground`

#### Event Card
- **Border Left**: `border-primary`
- **Background**: `bg-primary/10` (light) / `bg-primary/5` (dark)
- **Title**: `text-foreground`
- **Details**: `text-muted-foreground`
- **RSVP Button**: `bg-primary` + `text-primary-foreground`
- **Going Button**: `bg-green-500` + `text-white`

---

### 2. **Navbar** (`frontend/components/Home/Navbar.tsx`)

#### Container
- **Background**: `bg-card`
- **Border**: `border-border/50`
- **Backdrop**: `backdrop-blur-sm`

#### Logo
- **Icon Container**: `bg-primary/10` → `hover:bg-primary/20`
- **Icon**: `text-primary`
- **Text**: `text-transparent` with `bg-gradient-to-r from-primary to-primary/70`

#### Search Bar
- **Background**: `bg-accent/50`
- **Border**: `border-border/50`
- **Text**: `text-foreground`
- **Placeholder**: `placeholder:text-muted-foreground`
- **Icon**: `text-muted-foreground`
- **Focus Ring**: `focus:ring-primary/50` + `focus:border-primary/50`

#### Icon Buttons
- **Background**: `bg-primary/10` → `hover:bg-primary/20`
- **Icon**: `text-primary`
- **Badge**: `bg-destructive` + `text-white`

#### Avatar
- **Container**: `bg-primary/10` → `hover:bg-primary/20`
- **Ring**: `ring-transparent` → `hover:ring-primary/30`

#### Dropdown Menu
- **Background**: `bg-card`
- **Border**: `border-border/50`
- **Shadow**: `shadow-2xl`
- **Item Hover**: `hover:bg-accent`
- **Logout Hover**: `hover:bg-destructive/10`
- **Icon Container**: `bg-primary/10` → `hover:bg-primary/20`
- **Logout Icon**: `bg-destructive/10` → `hover:bg-destructive/20`

---

### 3. **LeftSidebar** (`frontend/components/Home/LeftSidebar.tsx`)

#### Container
- **Background**: `bg-transparent`

#### Menu Items
- **Hover**: `hover:bg-accent/50`
- **Icon Container**: `bg-primary/10` → `hover:bg-primary/20` (normal items)
- **Icon Container (Logout)**: `bg-destructive/10` → `hover:bg-destructive/20`
- **Icon**: `text-primary` (normal) / `text-destructive` (logout)
- **Text**: `text-foreground` → `hover:text-primary`

---

### 4. **Auth Pages** (`frontend/components/Auth/Login.tsx`)

#### Page Background
- **Gradient**: `bg-gradient-to-br from-background via-background to-primary/5`

#### Banner (Desktop)
- **Overlay**: `bg-gradient-to-r from-black/60 via-black/40 to-transparent`
- **Title**: `text-white`
- **Description**: `text-white/80`
- **Feature Cards**: `bg-white/10` → `hover:bg-white/15`
- **Feature Icon**: `bg-primary` + `text-accent`

#### Form Card
- **Background**: `bg-card`
- **Border**: `border-border/50`
- **Shadow**: `shadow-xl shadow-primary/5`
- **Title**: `text-foreground`
- **Description**: `text-muted-foreground`

#### Inputs
- **Background**: `bg-accent/50`
- **Border**: `border-border`
- **Text**: `text-foreground`
- **Placeholder**: `placeholder:text-muted-foreground`
- **Focus Ring**: `focus:ring-primary` + `focus:border-transparent`

#### Submit Button
- **Background**: `bg-primary` → `hover:bg-primary/90`
- **Text**: `text-white`
- **Shadow**: `shadow-lg shadow-primary/25` → `hover:shadow-primary/40`

#### Links
- **Color**: `text-primary` → `hover:text-primary/80`

#### Modal (Reactivate)
- **Overlay**: `bg-black/50` + `backdrop-blur-sm`
- **Card**: `bg-card` + `border-border`
- **Alert Box**: `bg-destructive/10` + `border-destructive/20`
- **Alert Icon**: `text-destructive`
- **Cancel Button**: `border-border` + `hover:bg-accent`
- **Confirm Button**: `bg-primary` + `text-primary-foreground`

---

### 5. **ProfileCard** (`frontend/components/Profile/util/ProfileCard.tsx`)

#### Container
- **Background**: `bg-card`
- **Shadow**: `shadow-md`
- **Border Radius**: `md:rounded-b-xl`

#### Banner
- **Height**: `md:h-56 h-44`
- **Border Radius**: `md:rounded-md`

#### Profile Picture
- **Ring**: `ring-accent` (4px)
- **Shadow**: `shadow`
- **Background**: `bg-card`

#### Username
- **Text**: `text-foreground`
- **Font**: `text-2xl font-bold`

#### Stats
- **Numbers**: `text-primary` → `hover:text-primary/80`
- **Labels**: `text-muted-foreground`
- **Font**: `text-2xl font-bold` (numbers) / `text-sm` (labels)

---

## 🎯 Quick Reference by Use Case

### Text Colors
```css
/* Primary text (headings, main content) */
text-foreground

/* Secondary text (descriptions, metadata) */
text-muted-foreground

/* Links */
text-primary → hover:text-primary/80

/* Error/Delete */
text-destructive

/* Success */
text-success
```

### Background Colors
```css
/* Page background */
bg-background

/* Cards/Containers */
bg-card

/* Hover states */
hover:bg-accent
hover:bg-accent/50
hover:bg-accent/70

/* Input fields */
bg-accent/50
bg-input

/* Primary actions */
bg-primary → hover:bg-primary/90

/* Destructive actions */
bg-destructive → hover:bg-destructive/90

/* Icon containers */
bg-primary/10 → hover:bg-primary/20
```

### Border Colors
```css
/* Default borders */
border-border
border-border/50
border-border/30

/* Primary borders */
border-primary

/* Destructive borders */
border-destructive
```

### Button Styles
```css
/* Primary Button */
bg-primary text-primary-foreground hover:bg-primary/90

/* Secondary Button */
bg-secondary text-secondary-foreground hover:bg-secondary/80

/* Destructive Button */
bg-destructive text-white hover:bg-destructive/90

/* Ghost Button */
hover:bg-accent hover:text-accent-foreground

/* Outline Button */
border bg-background hover:bg-accent hover:text-accent-foreground
```

### Interactive States
```css
/* Hover - Backgrounds */
hover:bg-accent
hover:bg-accent/50
hover:bg-accent/70

/* Hover - Text */
hover:text-primary
hover:text-primary/80

/* Focus - Rings */
focus:ring-2 focus:ring-primary
focus:ring-primary/50

/* Active/Selected */
bg-primary/10 border-primary
```

---

## 🛠️ How to Modify Colors

### 1. **Change Primary Brand Color**
Edit in `frontend/app/globals.css`:
```css
:root {
  --primary: oklch(0.55 0.25 255);  /* Change this */
}

.dark {
  --primary: oklch(0.62 0.20 255);  /* And this */
}
```

### 2. **Change Card Background**
```css
:root {
  --card: oklch(1 0 0);  /* Pure white */
}

.dark {
  --card: oklch(20.32% 0.00928 255.668);  /* Dark gray */
}
```

### 3. **Change Text Colors**
```css
:root {
  --foreground: oklch(0.15 0.02 250);  /* Main text */
  --muted-foreground: oklch(0.45 0.02 250);  /* Secondary text */
}
```

### 4. **Change Hover States**
```css
:root {
  --accent: oklch(0.93 0.03 250);  /* Hover background */
}
```

### 5. **Test Your Changes**
1. Edit the color in `globals.css`
2. Save the file
3. Check both light and dark modes
4. Verify contrast ratios for accessibility

---

## 📊 Color Usage Statistics

### Most Used Colors (by frequency):
1. **bg-card** - All cards, modals, dropdowns
2. **text-foreground** - All primary text
3. **text-muted-foreground** - All secondary text
4. **bg-primary** - All primary buttons, icons
5. **hover:bg-accent** - All hover states
6. **border-border** - All borders
7. **text-primary** - All links, active states

### Color Combinations:
- **Cards**: `bg-card` + `border-border/50` + `shadow-md`
- **Buttons**: `bg-primary` + `text-primary-foreground` + `hover:bg-primary/90`
- **Inputs**: `bg-accent/50` + `border-border` + `text-foreground`
- **Hover**: `hover:bg-accent/50` + `hover:text-primary`

---

## 🎨 Design Tokens

### Opacity Levels
- `/5` = 5% opacity (very subtle)
- `/10` = 10% opacity (subtle)
- `/20` = 20% opacity (light)
- `/30` = 30% opacity (medium-light)
- `/50` = 50% opacity (medium)
- `/70` = 70% opacity (medium-strong)
- `/80` = 80% opacity (strong)
- `/90` = 90% opacity (very strong)

### Common Patterns
```css
/* Icon containers */
bg-primary/10 hover:bg-primary/20

/* Borders */
border-border/50

/* Hover backgrounds */
hover:bg-accent/50

/* Focus rings */
focus:ring-2 focus:ring-primary/50
```

---

## 📝 Notes

1. **Always test in both light and dark modes** when changing colors
2. **Maintain contrast ratios** for accessibility (WCAG AA: 4.5:1 for text)
3. **Use opacity modifiers** (`/10`, `/50`, etc.) for subtle variations
4. **Keep hover states consistent** across similar components
5. **Primary color** should be used for brand elements and CTAs
6. **Muted colors** for secondary information
7. **Destructive color** only for delete/error actions

---

## 🔗 Related Files
- `frontend/app/globals.css` - Color definitions
- `frontend/components/ui/button.tsx` - Button variants
- `frontend/components/Home/Util/PostCard.tsx` - Post styling
- `frontend/components/Home/Navbar.tsx` - Navigation styling
- `frontend/components/Auth/Login.tsx` - Auth page styling

---

**Last Updated**: Current Session
**Maintained By**: ShadSocial Team
