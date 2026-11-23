# DataVolt homepage concept

Responsive static HTML, CSS and JavaScript, reusing the supplied stack. Neo Sans fonts and imagery are local. The live site’s Adobe Fonts stylesheet supplies Obvia for navigation, with Neo Sans Regular as fallback. No build step is required.

## Run

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Run from this directory and open http://127.0.0.1:4173. Use the local server for the WebGL assets; opening index.html directly displays the still-image fallback.

## Files

- index.html: homepage copy and structure.
- styles.css: homepage layout, responsive rules and floating navigation.
- brand.css: shared design tokens and component styles extracted from the live DataVolt website.
- design-system.json: observed brand values and source URLs.
- app.js: campus filters and keyboard selection, navigation and enquiry/destination dialogs.
- campuses.json: six records extracted from the wireframe.
- assets/: local brand logos, Neo Sans fonts, Geist fallback fonts and website imagery.

All homepage sections remain in their original order. The closing statement follows the user's explicit direction and retains the capacity-planning question beside the enquiry actions. Three news stories match the wireframe's final rendered state; its script removes a fourth draft story.

## Asset provenance

The ZIP supplied logos but no photography, brand font or formal brand guide. Following the request to apply the existing website style, the homepage now uses observed live-site values: Neo Sans Light headings/body, Neo Sans Medium labels/actions, Obvia navigation, navy #091C54, indigo #010050, blue #3B64DD, focus blue #2768FF, pale grey #F5F5F7, and 15px editorial image corners. The floating navigation remains as requested. These values were extracted from live styles on 20 November 2026, not from a separate official brand-guideline document. DataVolt, Vision Invest and HUMAIN logos remain supplied assets.

Supplementary photographs and renders come from DataVolt's public website. Their presence there does not establish separate approval for this concept. No AI-generated imagery is used.

| Asset | Source |
| --- | --- |
| tashkent.webp | https://data-volt.com/wp-content/uploads/2026/03/Tashkent-IT-Park-Rendering-2.png |
| riyadh.webp | https://data-volt.com/wp-content/uploads/2023/09/riyadh-city-e1688399838186.jpg |
| oxagon.webp | https://data-volt.com/wp-content/uploads/2026/01/Oxagon.jpeg |
| cooling.webp | https://data-volt.com/wp-content/uploads/2023/09/sus3.jpg |
| pipework.webp | https://data-volt.com/wp-content/uploads/2023/09/wcoolin.jpg |
| team.webp | https://data-volt.com/wp-content/uploads/2023/09/b2s.jpg |

The hero uses the available Tashkent architectural render at blue hour, not an aerial Saudi campus photograph. Mobile uses a separately directed crop and placement so the building remains visible below the headline and actions. Riyadh imagery is low resolution at source and needs replacement with approved high-resolution photography for production. Other campus imagery is explicitly labeled as regional context or illustrative engineering, rather than represented as actual campus photographs.

## Figures and content

Six campus capacities reconcile to **438 MW**: RUH-E 44, TASDC01 12, Yanbu 4, NEOM Phase 1 360, RUH-J 16, Haqel 2. Construction capacity reconciles to **378 MW**: 360 + 16 + 2. The wireframe supplies two countries and three campuses about to go live.

The supplied review notes identify PUE, dual feeds, Tier III targets and go-live quarters as fictitious layout data. They are preserved with explicit unapproved-specification labels. News and dates are sample editorial content, also labeled. No sustainability figures have been added.

## Interaction boundaries

The enquiry modal supports enquiry type, required fields, email validation, native focus containment, Escape, close and outside-click dismissal. It sends and stores no information and explicitly says so. No CRM endpoint was supplied.

Homepage anchors, telephone and careers links are preserved. Missing article, social and legal destinations open honest concept notices. Arabic opens the supplied draft headline sample, not a claimed full translation. All campus information remains visible when JavaScript is disabled.

## Checks

Validated at 1440, 1024 and 390 px: no horizontal overflow; first-load hero actions; navigation and mobile menu; campus filtering, image/details synchronization and keyboard selection; enquiry type and dismissal; local image loading; internal anchor targets; reduced motion. JavaScript syntax check passed. Desktop axe WCAG 2 A/AA and WCAG 2.1 AA scan returned zero violations. Further results are in validation.json. Automated checks are not a full accessibility certification.

This is a local homepage concept. No production deployment or additional pages were created.

## Current project location

The active source is `/Users/designer/Documents/ChatGPT/Datavolt`. The local preview at port 4173 serves this directory. Wireframe copy, section order, capacities and interactions are unchanged by the brand-style update.

## Deployment section — Arago reference

The Plan your deployment section follows the Interoperability section at https://arago.wawww.studio/, as requested. The original rack, drawer and layout GLB files, baked textures, cube maps, and rack/drawer shaders are stored locally. An isolated Three.js scene recreates the rack composition and scroll-driven drawer/pullback, with a technical grid and two editorial copy columns. DataVolt wording, fonts, navigation and enquiry action are retained. This is an adapted implementation, not the original site's complete rendering/postprocessing system.

`deployment.css` scopes the layout. `deployment-loader.js` loads the scene near the viewport. `src/deployment-scene.js` is the editable scene source (`src/shaders.js` retains the superseded reference shaders for provenance); `deployment-scene.js` is the browser-ready bundle. To rebuild after scene edits, run `npm install` followed by `npm run build:deployment`. Serving the committed bundle does not require installing Node dependencies. Three.js and its decoder license notices are in `vendors/deployment/`.

Mobile and reduced-motion modes use a fixed composition. Desktop offers Pause/Resume motion. The locally rendered desktop/mobile posters remain visible when WebGL is unavailable. The scene is labeled illustrative and is not represented as a DataVolt campus photograph. Assets and shader source originate from Arago / Wawww Studio; no ownership claim is made.

The deployment section now uses the supplied white/silver product-render reference: a white background, navy typography, fine cool-grey rules, and pale satin-metal shaders with soft directional lighting and retained grille detail. Desktop and mobile still posters were regenerated from the updated scene.


The current server finish uses opaque Three.js MeshPhysicalMaterial with satin aluminium roughness/metalness, a studio reflection environment, directional lighting, normal-map recess occlusion, and cast/received shadows. The black baked albedo and LED glow are no longer sampled. Coincident rack proxy positions are deduplicated. The camera pullback keeps equipment below the editorial copy. The earlier recoloring shaders are no longer used at runtime. Both still posters were regenerated from this physically lit scene.


The latest material and lighting direction follows the user-supplied `istockphoto-2262901678-640_adpp_is.mp4` as a visual reference: warm grey coated metal with subtle procedural roughness grain, dark grille recesses, warm overhead key lighting, cyan floor-level area lights and narrow light channels, and a slate-blue section background. The source video is not embedded or redistributed. The scene remains locally rendered and interactive; mobile/desktop posters reflect this latest finish.

The rack rows now begin with stepped rooflines. Individual cabinets rise into shared alignment over the first 42% of desktop scroll progress; the camera pullback starts at 45%. The drawer follows its host rack vertically. Scrolling back reverses the alignment, Pause freezes it, and mobile/reduced-motion views show fully aligned cabinets.

The current rack palette is coordinated with the navy background: brushed blue-grey metal housings, darker graphite vent panels, neutral cool key lighting, and restrained blue-white edge/floor illumination. Warm yellow and teal lighting have been replaced. Directional metal reflections and fine roughness grain provide surface texture without an overlay. The staggered alignment and drawer animation are preserved.


The latest framing update uses desktop camera poses sampled from the Arago reference on 20 November 2026. The opening remains lower briefly for DataVolt's longer introduction; the subsequent close-up and panorama follow the sampled trajectory. The editorial block exits during the pullback and returns on keyboard focus. The desktop sequence now spans 500vh. Camera-depth fog (24–65 scene units) blends distant banks into #091D54, with additional illumination falloff across distant rack banks. The ground is a shadow receiver, avoiding an opaque flat floor. Mobile and reduced-motion modes retain a fixed composition with all copy visible. The blue-grey materials and stepped alignment are preserved.

Each cabinet now has two small steady blue-white status LEDs. The instanced emissive lenses follow the cabinet height animation, floor clipping, and distance falloff. They do not flash or add bloom. Desktop and mobile fallback posters include the LEDs.


## What we offer — editorial service sequence

The services section adapts the layout and scrolling emphasis from https://unitedcarriers.com/careers: a dark editorial introduction, engineering imagery, an oversized split heading, and a sticky left-hand progress marker beside four service rows. DataVolt fonts, service copy and existing CTA behavior are preserved. `offers.css` scopes the design and `offers.js` updates the active row and numbered progress indicator. Inactive rows retain readable contrast. Mobile uses stacked content; reduced-motion mode keeps the marker static and removes transitions. All service content remains available without JavaScript.

Checked at 1440, 1024 and 390 px with no horizontal overflow or section-level axe WCAG A/AA violations. Verified sequential progress, keyboard focus, reduced motion, existing enquiry/link behavior, and JavaScript syntax.


## DataVolt Möbius preloader

The full-screen introduction follows the centered 3D mark, fine progress line and percentage treatment at https://www.j-vers.com/. It uses the supplied `mobius-logo.glb` unchanged in `assets/preloader/`, with its cyan-to-violet vertex colors, soft satin lighting, and the site's solid #091D54 navy. The supplied standalone HTML was used as a material/color reference; its standalone interface was not imported.

`preloader-boot.js` opens a native modal before the homepage, waits for the model and tracks hero/font readiness, then runs the reference animation timeline. Skip intro and Escape dismiss immediately. An 8-second watchdog releases the homepage if a dependency stalls. Reduced motion removes rotation, transitions and the minimum presentation time. Without JavaScript, the dialog stays hidden. The WebGL scene and GPU resources are disposed on exit.

Edit `src/preloader-scene.js`, then run `npm run build:preloader` to update the browser bundle. `preloader.css` contains the responsive presentation. Verified at 1440, 1024 and 390 px, plus keyboard skip, Escape, reduced motion, model failure, module timeout, no-JavaScript fallback and an axe WCAG A/AA scan of the preloader.


### Reference motion refinement

The preloader now reproduces the observed J-Vers animation timing: scale 0→1 and depth −25→0 over 1.7s (`power1.inOut`), visible Z spin 10→0 radians over 3.4s (`power3.out`), then a forward depth zoom 0→4 over the following 1.7s (`back.inOut(1.5)`). Camera-relative depth and responsive sizing adapt the movement to DataVolt’s supplied model. Its authored shape and cyan/violet colors remain intact. The header mark fades at 1.7s; the introduction counter reaches 100% at 2.4s; the overlay fades from 2.6–3.2s while the zoom continues. The earlier slide-up exit is removed. The percentage represents the introduction timeline, not downloaded bytes, and pauses before exit if essential assets are pending. Reduced motion bypasses the animated sequence.

Compared staged reference captures with the updated animation and checked the local result at 1440, 1024 and 390 px: no horizontal overflow or runtime errors, scroll unlocked after reveal, keyboard skip and reduced motion passed.


### Additional 3D rotation

The logo now tilts around X and Y into the supplied upright/open-ring pose, then returns to its shallow angle before the final zoom. The tilt eases in from 1.05–1.77s and returns from 2.02–2.60s. The reference spin, scale, zoom and fade continue on the existing timeline; restored satin materials and lighting remain unchanged. Reduced motion uses the static pose. Desktop/mobile reveal and scroll unlock passed with no runtime errors.

The preloader now plays at 2/3 speed: its synchronized rotation, tilt, progress, zoom and fade span approximately 4.8 seconds after the model becomes ready. Skip and reduced motion remain available.


### Seamless Möbius motion

The current motion uses a periodic quaternion rotation with smoothly varying pitch and yaw, replacing the separate tilt keyframes. The rendered orientation matches exactly at the cycle boundary. A quintic scale-in and monotonic zoom replace the previous depth overshoot, avoiding a backward bounce and camera/surface intersection. Rotation has its own clock and continues while essential assets hold the reveal. The 2/3 playback speed, approximately 4.8-second normal presentation, restored materials, skip control and reduced-motion behavior are retained. Desktop/mobile checks passed with no runtime errors or overflow; reveal unlocks scrolling.


### Preloader to navigation handoff

The current intro grows and rotates once, then shrinks and travels to the navigation logo mark instead of zooming past the camera. The homepage background reveals behind the moving mark. The destination is measured from the live header layout each frame, with a projection offset that avoids perspective skew during travel. A transparent render of the final 3D pose replaces the navigation mark on completion; the existing DataVolt wordmark and home link remain. The renderer is disposed after handoff. No-JavaScript/model-failure paths retain the original logo. Reduced motion updates the mark directly. At the existing 2/3 playback rate the normal sequence now lasts approximately 5.4 seconds after model readiness. Verified at 1440, 1024 and 390 px, including the mobile menu, header image load, reduced motion, no overflow and no runtime errors.


### Navigation mark fidelity

The final navigation logo now uses the existing approved DataVolt brand asset, preserving the supplied reference's proportions, cyan/violet gradient and dark inner fold. The animated 3D logo settles to a slightly tilted landing pose and crossfades into this mark during the last part of its travel. It no longer leaves a differently lit 3D snapshot in the header. The original wordmark and home link are retained. Desktop and mobile header rendering and build/syntax checks passed.


## Interactive hero logo

The hero's campus photograph and architectural-render caption have been replaced, as requested, by the supplied 3D Möbius logo on a solid navy background. Desktop uses copy/actions on the left and the model on the right; mobile stacks the model below the actions. All original hero wording and CTAs are preserved. The preloader and navigation handoff remain in place.

`src/hero-logo.js` implements gentle automatic rotation, pointer dragging, arrow-key rotation, Home/reset, pause/play, and reduced-motion defaults. Horizontal touch gestures rotate the model while vertical page scrolling remains available. Rendering pauses offscreen and in background tabs; stopped poses do not continuously redraw. `hero-logo.css` scopes the responsive layout. `assets/hero-mobius.png` is a locally rendered still for no-JavaScript/WebGL fallback. Rebuild with `npm run build:hero`.

Checked at 1440, 1024 and 390 px: no overflow or hero axe A/AA violations; dragging and arrow keys visibly rotate the model; enquiry opens; reduced motion starts paused; fallback image and CTAs are available without JavaScript. Build and syntax checks passed.


## Who we support — ON.energy reference

The audience section adapts the performance section at https://www.on.energy/: a right-aligned editorial introduction over sweeping light trails, followed by spacious rounded panels. The three existing DataVolt audience groups, descriptions and CTA behavior are preserved. Large 01–03 labels are decorative sequence markers, not business metrics; no reference-site statistics or claims were imported.

`audiences.css` scopes the layout; `audiences.js` controls video loading, pause/play, offscreen/background suspension and reduced-motion behavior. The reference light-trail film is stored in `assets/audiences/light-trail.mp4` (source: https://www.on.energy/video/trail.mp4), with a still extracted at 2 seconds for fallback. A CSS hue shift adapts the gold light to blue. These visual reference assets are attributed to ON.energy; no ownership claim is made. The intro video loads only near the viewport, and reduced motion uses the still without downloading the film unless Play is selected. Text stays visible without animation or JavaScript.

Validated at 1440, 1024 and 390 px: no overflow or section-level axe WCAG A/AA violations; pause/play and reduced motion passed; all original CTA behaviors were checked; mobile panels keep numbers and copy separated. JavaScript syntax passed with no runtime errors.


## Elastic Möbius hero — Hyperiux reference

The hero now adapts the oversized, cropped 3D composition and dotted field at https://vault.hyperiux.com/, using the supplied DataVolt Möbius GLB and navy/cyan/blue palette. The headline sits at lower left and the original portfolio copy and both actions align at lower right. Mobile stacks the text below a separate model crop, with both actions visible at 390 × 844. This supersedes the earlier side-by-side interactive hero layout. The navigation, preloader and other homepage sections are unchanged.

Pointer movement across the banner drives underdamped springs for tilt, stretch and mesh bending. Shader normals follow the bend so the lighting responds to the actual surface. Leaving the banner returns the model smoothly to rest. The implementation is original Three.js code, not a copy of the reference site's source. Drag/touch, arrow keys, Home/reset, pause/play, offscreen suspension and reduced-motion behavior remain available. The transparent fallback still was rendered locally from the same model and pose.

Validation: responsive checks at 1440, 1024 and 390 px; no horizontal overflow or hero axe violations; visible hover response; pixel-stable paused and reduced-motion views; keyboard and native touch rotation; mobile menu; campus link; enquiry dialog; no-JavaScript fallback. Build and syntax checks passed.


## Hover-only reference motion

Click/drag, swipe rotation, pointer capture and keyboard orbit controls have been removed from the hero. The cursor is now the default cursor, and the instructions describe hover only. Native touch scrolling is preserved.

Closer inspection of the Hyperiux hero showed a six-point cursor trail, local radial displacement with a decaying wave, slow pointer-following tilt and a small idle roll. The DataVolt implementation now uses that movement pattern instead of the earlier global spring bend/stretch. Its frame-rate independent follow factors are 0.025 for tilt, 0.12/0.15 for the leading/following trail points, 0.18 for speed and 0.05 for influence. The deformation is adapted to the supplied Möbius mesh and lighting remains in the DataVolt palette. Mouse buttons do not drive the model. Pause and reduced motion keep the rendered pose still.

Verified: no pointer-down/up/move listeners or capture on the canvas, no drag rotation, default cursor, reduced-motion pixel stability, native touch scrolling, no runtime errors, responsive layout and hero accessibility checks. Build and syntax passed.


## Hero pose and controls refinement

Adjusted the Möbius to the supplied shallow-oval pose and moved the desktop composition lower and toward the center so the upper silhouette is visible below the navigation. Removed the hero Pause motion and Reset view buttons and their JavaScript handlers. Hover ripple remains; click/drag remains disabled. Ambient movement now fades out with hover, and reduced motion remains static. Re-rendered the transparent fallback from the updated pose. Verified 1440/1024/390 layouts, no overflow or hero axe violations, working hover and enquiry action, and no runtime errors.


## Möbius light strands — AutoRouter reference

Replaced the hero's filled 3D material with fine animated cyan, blue and violet strands, inspired by the moving fibres at https://autorouter.com/. The paths are derived from the supplied GLB's 512 × 72 surface lattice, resampled by cross-section arc length. Each strand follows the model through two circuits across its half-twist seam, forming a continuous closed path. Arc-length-based pulses and a periodic color field travel along these strands; no reference-site assets or source code are included.

The existing hero pose, navigation, preloader, copy and primary actions are preserved. Hover adds a restrained tilt; click/drag and swipe rotation remain disabled, and the removed controls remain absent. Rendering stops offscreen, in background tabs and under reduced motion. Reduced motion retains a static line sculpture; no-JavaScript/WebGL fallback uses a newly rendered transparent line image.

Validation: built and syntax checked; checked 1440/1024/390 with no horizontal overflow or hero axe violations; no runtime errors; pixel comparison confirms motion with normal preferences and an unchanged image under reduced motion, including pointer movement. Enquiry opens and fallback loads.


## Reference spectrum and motion refinement

Updated the line treatment to the requested AutoRouter reference spectrum: green, blue, violet, pink and orange, with a fixed hue per strand. The black scene replaces the navy dotted field. Fine low-intensity paths sway slowly; soft moving illumination, selected bright trails and five staggered pulses within a ten-second cycle run along the original Möbius paths. This supersedes the previous cyan/blue/violet treatment and moving hue. There are 32 closed, two-circuit paths, covering 64 surface strands. Dense interpolated points keep the bright trails continuous. No reference logo, text or code bundle is included.

Motion is autonomous; hover orbit and the hover instruction are removed. The navigation, DataVolt copy, enquiries and supplied model silhouette remain. Reduced motion and offscreen/background suspension are preserved. Fallback was rendered again in the full spectrum. Checks passed at 1440/1024/390, with no overflow, hero axe violations or runtime errors. Pixel comparisons confirm movement normally and no movement under reduced motion. A short desktop rendering sample averaged approximately 16.3 ms per frame on the test machine. Build and syntax passed.


## Navy compositing fix

The hero renderer now clears to the CSS hero background (#000445) before adding the colored strands. This removes the opaque-black fringes caused by additive shader fragments accumulating over a transparent black canvas. Regenerated the fallback still against the same navy. Desktop and mobile screenshots confirm that the strand region does not darken below the background beyond one 8-bit rounding level. Build and syntax checks passed.


## Proof in numbers — Madar reference

Restyled the portfolio band as a full-width architectural image section with an oversized right-aligned heading and five tall figure panels. Uses the existing Tashkent IT Park render with a visible architectural-render caption, DataVolt blue for the lead panel, and translucent blue/navy panels. Preserves 438 MW total portfolio capacity, 378 MW capacity in construction, 6 campuses, 2 countries, and 3 about to go live. The mobile layout wraps into two columns with the final panel spanning both. All content is available without JavaScript or animation. Styles are isolated in proof.css.

Reference: https://madarplatform.com/en/ . Verified at 1440, 1024, and 390 px, with no horizontal or panel overflow. Section axe checks passed on desktop and mobile; project syntax checks passed.


## Campus directory — LPAS reference

Reworked the campus directory into a large architectural image gallery, with oversized campus names, location/status/capacity overlays, and a narrow preview of the next campus. The specifications sit in a compact navy strip beneath the image. Existing six-campus copy, figures, image-provenance captions, filters, tabs and enquiry actions are retained. Next/previous navigation respects country filters and disables for a single result. Keyboard tab arrows continue to work. No scroll hijacking or automatic advance is used. Styles are isolated in campuses.css.

Reference: https://lpas.com/ . Verified at 1440, 1024, and 390 px with no overflow or section axe violations. Checked image/detail/counter synchronization, next/previous, country filtering, keyboard selection, campus preview and enquiry dialogs. Syntax checks passed.


## Campus scroll sequence — revised interaction

Supersedes the previous tabbed campus gallery. The section initially shows only the Campus directory label, Our campuses heading, introductory sentence and Discuss your requirements button over a darkened architectural image. Continued vertical scrolling pins the section and brings all six campus cards in horizontally from the right. Scrolling backwards reverses the movement; after the last card, normal page scrolling resumes. Card imagery, names, locations, statuses, capacity and enquiry destinations are preserved. Specifications are available in expandable rows on every card. Header country shortcuts still filter the sequence.

The interaction uses native page scroll with a sticky viewport and requestAnimationFrame transform updates, without wheel interception. Keyboard focus brings offscreen card controls into view. Reduced-motion and no-JavaScript modes show the intro followed by vertically stacked cards. Checked at 1440, 1024 and 390 px: no horizontal document overflow or section axe violations. Verified introduction-only entry, right-to-left travel, reverse scrolling, release after the last card, keyboard access, specification disclosure and enquiry dialogs. Syntax check now includes campuses.js.


## LPAS motion and interaction review

Reviewed the live LPAS desktop and mobile section, its rendered animation states and published behavior. Rebuilt the campus interaction to keep the introduction stationary behind independent moving cards, with approximately 0.5-second horizontal catch-up, slower image/row scrubbing, 1.3-to-1 image zoom, growing image areas (50% toward viewport height minus 285 px), first-card brightness recovery, blur/fade title reveals and delayed location/index/button reveals. Desktop card width follows the reference's 6:7 aspect ratio with responsive limits. A 110 px Explore cursor follows the pointer with easing, shrinks during scroll and restores afterward. Images and circular plus buttons open the existing campus preview. No third-party code bundle is included.

Preserves the user's intro-only initial viewport, DataVolt imagery/copy/colors, and specification disclosure. Unlike the prior iteration, mobile and coarse pointers follow LPAS's vertical 72/28 split cards with right-to-left image entry; card height is increased to retain DataVolt information. Reduced motion and JavaScript-disabled operation remain static and readable. Keyboard focus can reveal offscreen cards without interfering with mouse clicks.

Validation: 1440/1024/390 px, zero section axe violations and no document overflow; tested eased movement, fixed intro, image clicking, circular button behavior, keyboard preview, specifications, final-card alignment, release to following section, and reduced-motion reset.


## Proof section — white palette

Removed the Proof in numbers background render and caption. The section now uses a pure white background, navy heading and figures, grey introductory text, a solid brand-blue lead panel, a pale-blue second panel and cool off-white remaining panels. Removed the photo overlay, backdrop blur and text shadows. All five figures, units, labels and responsive layouts remain. Verified 1440/1024/390 px with no horizontal overflow or section axe violations.


## Proof heading typography

Proof in numbers now matches the Why DataVolt heading scale: clamp(48px, 4.5vw, 68px) on desktop, 50px at tablet widths and 45px on mobile, with matching line height and tracking. Computed sizes match at 1440/1024/390 px; no horizontal overflow.


## Deployment — intro and sequential steps

Moved Contact sales beneath the introduction. On entry, the section shows the background/racks, label, headline, description and CTA. Further scrolling reveals Share your requirements, Explore campus options and Discuss next steps cumulatively down the right side, each with its existing description. Reveals begin at 16%, 38% and 60% of the pinned sequence; scrolling back reverses them. Removed the old early editorial fade/exit and focus-triggered scroll reset so the lead remains readable throughout. Rack geometry/materials/camera motion are preserved. Mobile uses vertical reveals and reduced-motion/no-JavaScript modes retain all content. The sequence also works over the still poster if WebGL is unavailable.

Verified intro-only entry and all three reveal stages, CTA dialogue, mobile entry, zero section axe violations and no horizontal overflow at 1440/1024/390. Rebuilt deployment-scene.js and passed syntax checks with no runtime errors in the final scene.

## Campus gallery — official imagery and palette (23 November 2026)
Replaced the low-resolution regional/cooling images with locally stored DataVolt website assets: data-hall photography, networking equipment and an illustrative infrastructure render. Tashkent and Oxagon use the full-size official sources. Site-specific versus illustrative captions remain explicit; no campus figures changed. Source URLs and intrinsic dimensions are in `assets/campuses/sources.json`. Card backgrounds now use shared brand-indigo (#010050), brand-lavender (#5D65AE), and brand-blue (#3B64DD) tokens, with white text and a brand-blue Explore cursor. The LPAS-style scroll and reveal behavior is unchanged.

## What we offer — dot icon scroll sequence (23 November 2026)
Reviewed the live United Carriers careers “Why join us” interaction. Replaced the numeric dial with four original 16×16 dot-matrix service icons (racks, building, chip, connected nodes), a fine 80-tick progress ring, and 500ms staggered dot transitions. On desktop the dial stays centered while headings fade/scale with scroll; active descriptions reveal word by word over 600ms. Scrolling backward reverses the selection. The background uses the existing DataVolt brand-indigo token #010050. Mobile shows a small icon beside each readable service row; reduced motion removes animated reveals. Existing copy, actions, and navigation routes are preserved. Keyboard focus reveals the selected row. No reference scripts or artwork are shipped.

## Why DataVolt — full-width editorial rows (23 November 2026)
Replaced the split layout with a large offset uppercase headline and three numbered full-width rows inspired by United Carriers’ careers process section. Image column, title, description, and number share a 12-column grid. Pointer hover or keyboard focus reveals the row image and a DataVolt indigo band; inactive rows show a fine dot pattern. Mobile shows images alongside readable stacked copy. Arrow keys, Home, and End navigate the focusable rows; reduced motion removes transitions. Original wording and CTA are retained. `why.css` and `why.js` scope the change.

## Blue transition between audiences and Why DataVolt (23 November 2026)
Replaced the abrupt dark/white section boundary with an original CSS elliptical gradient inspired by United Carriers’ About page. The existing dark background curves down through DataVolt navy, blue and periwinkle, with brighter side glows, before fading completely to white above the Why DataVolt heading. It follows document scroll without an animation loop; mobile uses a 300px, separately proportioned ellipse. Copy and row interactions remain unchanged.

## Softer, higher blue transition (23 November 2026)
Moved the transition background behind the last 200px of the audience cards (160px on mobile), removed the separate 64px gap, and broadened its dark-to-blue and blue-to-white color stops. Card fills and motion controls remain as restored. Verified no horizontal overflow at 1440, 1024, and 390px.

Removed the audience background-motion button on request; the video still respects reduced motion and pauses offscreen. The softened gradient and card styling are unchanged.

Fixed the white Vision Invest partner logo on the light backing section using a scoped dark CSS filter. Preserved both logo assets and aspect ratios; verified desktop loading and mobile layout without overflow.

## Full-screen sustainability (23 November 2026)
Replaced the split layout with a full-viewport, edge-to-edge photographic scene inspired by https://unitedcarriers.com/about. The introduction and CTA sit top-left; a thin divider introduces the large theme heading at left and description at right. Desktop scroll crossfades through Energy efficiency, Cooling and water, and Responsible development, reversing when scrolling back. Mobile, short screens and reduced-motion use normal stacked scenes without pinning. Existing copy and CTA behavior are preserved.
Unsplash photography: NASA (Q1p7bh3SHj8), Manny Moreno (EkjlCOuEwq0), Red Morley Hewitt (kizs7vYY5Dg). Local optimized WebP files, visible source credits and license/source manifest are in assets/sustainability/. These are illustrative images, not DataVolt facilities.
Verified desktop 1440px, tablet 1024px and mobile 390px without horizontal overflow; all images load; forward/reverse theme transitions and reduced-motion fallback pass. Section axe scan reports no violations. JavaScript syntax checks pass.

Sustainability refinement: removed the theme numbers and aligned titles to the section gutter. The divider fills left-to-right and headings reveal from muted blue-grey to white with scroll progress, reversing on upward scroll. Mobile uses viewport-based reveal; reduced motion shows complete white headings and static lines. Checked desktop/mobile layout, progress reversal and JavaScript syntax.

Sustainability progress now uses three equal line segments with divider ticks. Each third of the total scroll fills one segment and advances its corresponding card; completed segments remain filled and reverse on upward scroll. Verified transitions at one-third and two-thirds, reverse scroll, equal mobile segment widths and reduced-motion rendering.

## Media Centre card carousel (23 November 2026)
Reworked News & Insights using the tall card layout at https://terminal-industries.com/resources as reference. DataVolt blue cards carry category/date metadata and titles, revealing existing DataVolt imagery and a More action on hover or keyboard focus. Rounded edges remain unchanged; no side cutout. Touch/mobile shows imagery and actions directly. Date/type sorting, previous/next buttons, native horizontal swiping and arrow keys work with the three existing sample articles; original article preview dialogs and content are retained. No additional articles were invented.
Verified 1440, 1024 and 390px without page overflow, both sorting modes, carousel movement, keyboard navigation, image loading, article opening/Escape, unchanged hover shape, reduced-motion styling, and no section axe violations. JavaScript syntax checks pass.

## Shared photographic CTA and footer (23 November 2026)
Adapted the large translucent panel layout from https://madarplatform.com/en to DataVolt. Book a tour and Contact sales are now two large, fully clickable panels with oversized light titles, frosted brand-blue fills and arrow hover/focus effects. Both retain the existing enquiry form actions. A continuous Tashkent architectural-render backdrop connects the panels and footer, darkening behind navigation for readability. Preserved closing copy, contact information, navigation, social placeholders and legal actions. Mobile stacks the panels. No new animation JavaScript is needed; reduced motion disables hover movement.
Verified 1440, 1024 and 390px layouts without horizontal overflow, both enquiry types, Escape dismissal, footer anchor navigation, and zero axe violations in the combined area. JavaScript checks pass.

Moved the Let’s talk introduction above the two CTA panels; footer navigation remains below them. Verified order and no overflow at desktop and mobile widths.

## Preloader forward-zoom finish (23 November 2026)
Removed the preloader top wordmark and visible Skip intro button. After required assets are ready and progress reaches 100%, the centered rotating Mobius scales beyond the viewport and fades into the hero. Removed all navigation docking/mark injection and its CSS; the existing navigation logo is untouched. Escape cancellation, bounded failure recovery, reduced motion and renderer disposal remain. Rebuilt preloader-scene.js from src/preloader-scene.js. Verified desktop and mobile completion, full-screen intermediate zoom, hero visibility, scroll unlock, no injected/clipped nav mark, and reduced-motion completion. Syntax checks pass.

Preloader refinement: increased the exit zoom to 32× and removed the simultaneous loader/hero crossfade. Loader background and 3D canvas stay opaque through the zoom, then the entire dialog is removed together for a clean hero reveal. Verified opacity across 105 exit frames and successful desktop/mobile completion without page overflow.

Removed the preloader progress line; only the centered percentage remains. Verified percentage updates and successful zoom completion.

## Compact navigation and search (23 November 2026)
Reduced desktop navigation height from 78px to 62.4px (20%); mobile uses 52px while keeping 44px controls. Added the supplied SVG search icon immediately before Book a tour, opening an accessible local homepage search dialog. Navigation labels and dropdown links now use 15px / 500. Verified 320–1440px layouts without header overflow, matching and empty search results, result navigation, Escape dismissal, and mobile menu/search.

Increased the navigation logo width by 20% at each breakpoint. Adjusted narrow-screen spacing to retain the compact header height; verified 320–1440px without header overflow.

Preloader circular exit: blend into the reference half-turn orientation during the zoom, center the offset opening, and use optical zoom to preserve its nearly circular silhouette without clipping the mesh through the camera. Clean opaque-to-hero completion retained. Verified desktop and mobile completion and scroll unlock.

Preloader clockwise refinement: replaced shortest-path quaternion settling with an unwrapped clockwise phase and monotone easing to the next front-facing half turn. Slowed the rotation cycle and extended the exit to 2.25 seconds of playback, with zoom starting after the alignment begins. Verified clockwise easing across starting angles, desktop/mobile completion, and scroll unlock.

Full clockwise turn: increased rotation speed to one revolution every 2.7 seconds of playback. The logo reaches full size after 0.75 seconds, allowing more than one complete visible turn before alignment begins. Shortened the exit zoom to 1.575 seconds; clockwise-only settling and centered opening retained. Desktop/mobile completion and syntax checks pass.

## Gradient button palette (23 November 2026)
Adapted the gradient fill, outline and animated background-position treatment observed at https://www.eternacloud.com/ using the supplied palette: #00FAFF, #091C54, #5A7AD9, #6462F2. Shared buttons.css updates standard CTA buttons, including navigation and hero, with rounded corners and a one-second gradient sweep. Secondary CTAs use a gradient border and cyan hover fill; labels change to navy on bright fills. Existing sizes and actions remain. Keyboard focus uses the same treatment; reduced motion removes transitions. Verified hover intermediate/end states, enquiry actions, keyboard focus and 320–1440px layouts.

Arabic navigation control: transparent at rest, light background on hover. Verified both computed states.

Button edge refinement: disabled gradient tiling and aligned backgrounds to the border box to remove the primary button’s left-edge seam. Increased secondary gradient stroke from 1px to 2px. Visually verified hero controls.

Removed Contact sales from the navigation; Book a tour, search and language remain.

Hero line thickness: replaced hardware-limited line primitives with screen-space ribbon geometry for consistent 2 CSS-pixel strands. Retained existing colors, travelling highlights and motion; width updates with viewport resizing. Rebuilt hero-logo.js. Verified desktop/mobile render readiness, no page errors, and syntax checks.

Hero refinement: reduced strands to 1 CSS pixel and added mouse-follow tilt/offset with a damped spring and smooth return on pointer leave. No click/drag interaction. Touch is ignored and reduced motion disables the pointer effect. Verified mouse positions, render readiness, mobile layout and syntax checks.

Preloader/hero handoff: both now use the shared #000445 background. Removed the exit hold and close the preloader as soon as the circular opening clears the viewport, avoiding the blank tail of the 32× zoom. Verified matching computed backgrounds and ready hero canvases at desktop/mobile handoff.

## Coordinated page reveals (23 November 2026)
Added motion.js/motion.css: hero logo, label, three headline lines, description and CTAs enter in sequence immediately after the preloader-complete event (0–660ms stagger). Section headings, figures, cards, supporting copy and footer columns reveal once on entering the viewport with capped 85ms staggers and gentle 760ms easing. Existing campus horizontal motion, deployment steps, service word reveals and sustainability scroll scenes retain their own animation control. Keyboard focus makes controls available immediately; reduced motion shows content without reveal effects. Verified hero timing, all 12 following sections, mobile overflow, keyboard access, reduced-motion startup/change, and JavaScript syntax.

## FAQ interaction refinement (23 November 2026)
Adapted only the accordion interaction from https://hyperbolic.studiofreight.dev/: a 2px accent divider draws left-to-right, a thin plus with a center diamond rotates its vertical stroke into a minus, and answers expand/collapse over 500ms. Opening a row closes the previous row. Original FAQ grid, font, summary dimensions and spacing are unchanged (desktop summary 75.1875px high, 18px Neo Sans Regular). Native details semantics retained with explicit expanded state and inert closing answers. Verified intermediate animation states, rapid reversal, single-open behavior, Enter interaction, mobile enquiry CTA, reduced motion and syntax.

FAQ layout refinement: removed Locations/Services/Site visits, shortened the eyebrow to FAQ, and top-aligned the introduction with the question list. Desktop introduction sticks 100px from the viewport top within its section; stacked mobile layout stays in normal flow. Verified matching initial top positions, sticky position at successive scroll offsets and no mobile overflow.

Proof in numbers: figures count from zero once as their cards enter view, using a 1.6-second ease-out with capped staggers. Five locally stored Unsplash photographs fade and gently zoom into view on hover or keyboard focus; navy shading keeps white labels legible. Reduced motion displays final values immediately. Sources and illustrative-use notes are in assets/proof/sources.json. Verified intermediate/final counts, hover/focus, reduced motion, mobile overflow and JavaScript syntax.

Campus directory update: replaced the introductory backdrop with the user-supplied DataVolt-Branded-4K image (3840px JPEG). Removed image caption bars from all six campus cards. Specifications now open in the existing accessible dialog from the image or dotted-arrow control, with the original values and sample-data note preserved. Arrow based on the ON.energy reference, styled in #091C54 and #00FAFF with a gentle horizontal hover movement. Checked all six dialogs, Escape, mobile overflow, image loading and syntax.

RUH-E card image replaced with the user-supplied building exterior at dusk, centered within the existing image area.

Yanbu card image replaced with the user-supplied sunset architectural view; crop positioned at 72% vertically to emphasize the buildings.

NEOM Phase 1 card image replaced with the user-supplied data centre and power infrastructure image at sunset.

RUH-J card image replaced with the user-supplied data centre exterior with blue lighting at dusk, centered within the existing card.

Haqel card illustration replaced with the user-supplied building exterior along a tree-lined street at dusk.

Lavender campus card backgrounds (TASDC01 and RUH-J) updated to #6462F2.

Campus final-card timing: the final visible card now completes its image/reveal progress at its stopping position. Added an 80vh (minimum 600px) pinned scroll interval after horizontal movement finishes, before the next section enters. Verified full text/arrow opacity, final image height and stable pin throughout the hold, followed by normal section release.

Deployment step sequence: each right-side heading now reveals before its description, followed by a left-to-right cyan/violet divider and the next step. Independent child progress uses smooth easing and 90ms scroll catch-up; reverse scrolling reverses the sequence. All three steps complete before the pinned section exits. Mobile uses viewport-relative progression and reduced motion displays everything immediately. Verified title-only, partial description, completed divider, second heading, full completion and reversal; mobile has no horizontal overflow.

Services introduction: moved heading, description and CTA to the left and image to the right. Matched deployment heading typography (Neo Sans Light, weight 400, clamp 48px/4.5vw/68px, 1.06 line height), sentence case, 18px body and 15px CTA. Mobile stacks copy before image. Verified matching computed desktop fonts and no mobile overflow.

Services introduction image updated to the user-supplied blue-lit server room photograph, optimized to 2000px wide. Applied 16px rounded corners and removed the previous desaturation/darkening filter to preserve the supplied colors.

Audience cards: changed to a single horizontal row with three equal cards matching news dimensions, gaps and radius (desktop clamp 310px/34vw/480px width and 460px/36vw/560px height; mobile 82vw by 460px). Added a smooth dark overlay fading the video into the card background. Keyboard focus scrolls the full card into view. Verified exact news/audience dimensions on desktop and mobile, last-card keyboard access and no page overflow.

Audience scroll sequence: desktop shows the video and introduction first, then scroll brings three equal-width cards in from the right. Heading, description and CTA rows align across cards. Smaller screens use a swipeable carousel with previous/next controls and a position indicator. Reduced motion uses a static layout. Verified desktop staging and alignment, phone/tablet navigation, reduced motion and absence of horizontal page overflow.

Audience persistent introduction: heading and description remain visible in a top row throughout the desktop card entrance. Cards sit below the measured introduction, with equal responsive heights that fit the available viewport. Verified non-overlapping text/cards at 1440×955 and 1144×700; existing small-screen carousel retained.

Audience glass cards: matched the Contact sales panel with translucent navy rgba(9,28,84,.66), 20px backdrop blur and a subtle light border. Reduced card heights by approximately 10%, preserving content clearance on short screens. Verified desktop/mobile content fit and no page overflow.

Audience reference layout and sequencing: introduction sits upper right above the glass cards. Video is visible first; eyebrow, heading and description reveal after 400/650/900ms, with cards following at 1200/1350/1500ms and retaining their horizontal scroll entrance. Reduced motion shows content immediately. A broad elliptical blue gradient overlays the lower video, continuing through matching blue into white below the section without a hard edge. Verified delayed opacity samples, complete reveals, short-desktop content fit, mobile carousel and reduced motion.

Audience-to-Why spacing: shortened the gradient tail to 80–112px desktop and 64px mobile, and adjusted the following section top padding to 48–64px. Verified the desktop card-to-heading gap is approximately 253px at 1440×955 (previously approximately 693px), retaining the smooth gradient and no mobile overflow.

Feathered the audience video overlay with a gradual alpha mask across its upper 44%, removing the horizontal edge from the elliptical gradient. Visually verified the unobstructed video state and retained the blue boundary color.

Audience gradient refinement: shared one continuous gradient coordinate space between the video overlay and transition tail. Dark elliptical centre and richer blue sides now fade through lavender toward white, starting behind the cards rather than compressing the white fade into the section boundary. Existing compact section spacing retained. Visually verified the transition and matching background dimensions.

Strategic backing image: replaced Oxagon with the supplied renewable-energy scene, removed its caption, and right-aligned a 5% cover zoom to exclude the source image’s white top/bottom strips. Preserved rounded corners. Verified image decoding, crop and mobile overflow.

Sustainability imagery: replaced the Earth backdrop with the supplied solar-panel and wind-turbine sunset image. Removed visible image-credit annotations from all three sustainability scenes. Kept the existing text, contrast overlay and scroll animation. Verified image decoding and caption removal in the browser.

Responsible development background replaced with the supplied Zac Wolff wind-farm photograph. Existing contrast overlay and scroll transitions retained; image verified at 2400×1800.

Media Centre cleanup: removed Date/Type of news sorting controls and sample editorial note. Placed Explore all directly below the description, with carousel arrows aligned to the right. Removed unused sorting code and updated entrance-animation targeting. Verified all requested removals, button position, carousel navigation, mobile overflow and JavaScript syntax.

Partnerships image replaced with the latest supplied coastal development aerial view. Reset the previous right-aligned zoom to a centred cover crop; rounded corners and caption-free presentation retained. Browser image decoding and visual crop verified.

Removed image annotation labels from all three news cards, including architectural-render and illustrative-photography captions. Hover images, article titles, dates and More controls retained. Browser verified zero image labels and working image hover.

Cooling and water background replaced with the supplied cooling-tower nightscape and reflections. Existing layout, contrast overlay and scene animation retained. Verified active scene and image decoding at 1532×1026.

CTA/footer background replaced with the supplied Riyadh digital-city image. Cover crop is anchored to the top so the upper artwork is shown and excess lower content clips beyond the section. Verified top alignment on desktop/mobile and no horizontal overflow.

Unified arrows: replaced 16 text arrows across services, audience cards/carousel, news cards/carousel and footer CTAs with the Campus directory’s nine-dot SVG arrow. Shared navy/cyan styling, rounded controls and reversed left arrow direction; hover inverts colors and shifts in the direction of travel. Verified carousel navigation, footer hover, left rotation and mobile overflow.

Added a fourth editorial card before the existing news cards: Designing infrastructure for a sustainable future, using the solar/wind image and no invented publication date. Standardised More buttons to a 140px minimum width, 52px height and 12px text/icon gap. Verified desktop/mobile layout, carousel navigation, article preview and JavaScript syntax.

Footer container alignment: CTA introduction, both cards and footer columns now use the shared .wrap container (1440px maximum and responsive page gutters). Background remains full width. Verified matching bounds at 1906px, 1144px and 390px with no horizontal overflow.

Why DataVolt heading now matches the deployment heading: Neo Sans Light, weight 400, sentence case, identical responsive font sizes and line heights. Verified at 1440px, 1024px and 390px without horizontal overflow.

Reduced both footer CTA card heights by 20%: desktop clamp 272px/23.2vw/432px and mobile 208px. Reduced mobile internal spacer to keep content within the shorter cards. Verified equal heights and no overflow at 1906, 1440, 1144 and 390px.

Proof in numbers now uses the shared 1440px maximum container and responsive gutters, with headings aligned to the cards. Cards scale within that container; tablet figures shrink to prevent clipping. Top and bottom padding both use the shared section spacing (72px mobile, 88–132px larger screens). Verified alignment and no number/page overflow at 1906, 1440, 1024, 768 and 390px.

GitHub Pages deployment: published from the root of the main branch at https://deisgne8.github.io/datavolt-e8/. The site uses committed browser-ready assets; no server-side build is required. Push changes to main to update the published site. The .nojekyll file preserves static asset paths.
