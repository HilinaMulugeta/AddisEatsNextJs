# Addis Eats performance budget and report

## Measurement method

Measurements use a production build (`npm run build` then `npm run start`) and Lighthouse CLI
13.5 against `/menu`. The before column is the Day 45 production build before the Day 45
performance changes; the after column is the final Day 45 build. Lighthouse's simulated mobile
throttling was applied to both audits (Slow 4G network and 4× CPU slowdown). The baseline used
Next.js 16.3.5/Turbopack; the final build uses the security-patched Next.js 16.4.0/Webpack
because Turbopack failed during production compilation after the upgrade. Score and LCP therefore
include a bundler/version change and are not a perfectly controlled comparison. Results vary
between lab runs and are not field data from real phones.

For First Load JS, the exact production page resources were summed from Lighthouse's
`network-requests` audit, counting transferred bytes for JS resources under
`/_next/static/`. Largest image is the largest transferred image resource on `/menu`. The
unthrottled Chromium check is reported separately from throttled Lighthouse LCP.

## Performance budget

| Measure | Target | Before Day 45 changes | After Day 45 changes |
| --- | ---: | ---: | ---: |
| LCP, throttled `/menu` | < 2.5 s | 3.8 s | 3.7 s |
| CLS, throttled `/menu` | < 0.1 | 0.00 | 0.00 |
| First Load JS, `/menu` (transferred) | < 120 kB | 180,339 B (176.1 KiB) | 161,670 B (157.9 KiB) |
| Largest image, `/menu` | < 150 kB | 113,280 B (110.6 KiB) | 77,300 B (75.5 KiB) |
| Lighthouse performance score | >= 90 | 0.87 | 0.84 |

## What changed and what remains

- The first menu card alone is eager and high priority; subsequent images remain lazy so the
  page does not promote every image.
- The first card uses quality 55; other menu cards retain quality 65.
- The mobile `sizes` rule matches the card's fixed-width grid container rather than claiming
  the whole viewport width. The first image request now selects a 640 px variant at quality 55;
  the largest measured image transfer fell by 35,980 bytes (about 31.8%).
- Prefetch is disabled on global/menu navigation links that otherwise downloaded many page
  chunks before the user navigated. Measured `/menu` JS transfer fell by 18,669 bytes (about
  10.4%) versus the baseline, though the bundler change limits the comparison.
- CLS and largest image transfer met budget in both builds. JS remains 41.7 kB above the
  120 kB budget, the Lighthouse score remains below 90, and throttled LCP remains above
  2.5 s. The LCP diagnostic selected the Kitfo card, whose image appeared below the initial
  viewport in Lighthouse's mobile layout; its element-render delay was about 1.2 s. The final
  responsive sizing and priority hints reduce image work, but did not bring this simulated LCP
  into budget. Further work should inspect the menu's mobile layout and main-thread render path
  on a real mid-range device rather than adding more speculative image preloads.
- A separate unthrottled Chromium run on the final production build measured about 0.33 s LCP
  and 0.00 CLS. This is not comparable to the throttled budget column.

Lighthouse's simulated mobile LCP misses the budget. The final score is lower than the baseline;
the different Next.js version and production bundler are additional variables. These figures
describe one local lab machine/build and should be remeasured on the deployed preview.

INP is not available from these Lighthouse lab runs. Do not infer it from Total Blocking Time;
record it from field data or an interaction-capable real-user measurement.

## Responsive and image-loading follow-up

The shared header changes to a two-row, three-column navigation on small screens to keep all
primary links visible without horizontal page overflow. Dish-card image `sizes` now account for
the menu sidebar and capped desktop content width, and dish-detail hero images are explicitly
high priority. The home and menu card images continue to use Next.js responsive image delivery;
the local source font is a 28 KB WOFF2 served with `font-display: swap`.

These implementation changes have not yet been measured in Lighthouse. Re-run the production
mobile audit before changing the reported performance budget values above.
