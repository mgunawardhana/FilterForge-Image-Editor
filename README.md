![image](https://github.com/user-attachments/assets/ae51ca54-9d00-49d6-80dc-fa63e6d70448)


# **App Name**: FilterForge

## Core Features:

- Image Upload and Preview: Allow users to upload up to three images simultaneously via drag-and-drop or file picker. Display uploaded images as thumbnails.
- Built-in Filters: Provide a panel with six built-in filters/effects (grayscale, sepia, invert, brightness, contrast, blur) with slider controls for adjustable intensity.
- Theme Overlays: Implement three theme overlays (soft pastel gradient, neon glow, dark vignette) that can be applied to the image.
- Effect Stacking: Enable stacking of multiple effects and theme overlays with real-time preview updates.
- Export Options: Allow users to export the edited image in PNG, JPEG, and WebP formats with quality settings (50%-100% slider) for JPEG/WebP.

## Original User Request:

1. **Image Upload & Preview**
   - Allow users to upload up to **three** images at once.
   - Display the uploads as thumbnails; when a thumbnail is clicked, load that image into the main preview pane.
   - Support drag‑and‑drop and file‑picker upload.

2. **Editing & Effects**
   - Provide a panel of at least **six** built‑in filters/effects (e.g. grayscale, sepia, invert, brightness/contrast sliders, blur).
   - Include **three** theme overlays (e.g. soft pastel gradient, neon glow, dark vignette).
   - Allow stacking of multiple effects, with real‑time preview.

3. **Save & Export**
   - Let users export the edited image in **PNG**, **JPEG**, and **WebP** formats.
   - Offer quality settings (e.g. slider from 50% to 100%) for JPEG/WebP.
   - Ensure the exported image retains the applied filters and themes at full resolution.

4. **UI & Styling**
   - Use a **modern gradient color scheme** throughout (e.g. blue→purple, orange→pink).
   - Design a clean, card‑based layout with 2xl rounded corners, soft shadows, and consistent spacing.
   - All UI elements must be fully responsive from **4K desktop** down to **mobile** (min-width 320px).
   - Include smooth transitions (e.g. hover states, opening/closing panels) via Framer Motion.

5. **Code Quality & Structure**
   - Use React functional components and hooks (e.g. useState, useEffect, Context API).
   - Organize code into logical folders (components/, hooks/, contexts/, styles/, utils/).
   - Write clear comments and PropTypes (or TypeScript) for all components.
   - Ensure accessibility (ARIA labels, keyboard navigation).

6. **Bonus (upcoming...)**
   - Persist recent edits in localStorage so users can reload and continue.
   - Allow downloading all three images as a ZIP.
  
