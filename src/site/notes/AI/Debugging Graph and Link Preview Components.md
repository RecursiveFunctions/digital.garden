---
dg-publish: true
created: "2025-04-12"
---

# Debugging Graph and Link Preview Components in Digital Garden

This document outlines the process of troubleshooting and fixing issues with two key interactive components in an Eleventy-powered digital garden site: graph visualization and link previews.

## The Issues

When working with a digital garden built on Eleventy, we encountered these problems:

1. **Wiki Links Not Rendering:** Internal links in Obsidian format `[[wiki links]]` were not being properly parsed, causing build errors.
2. **Link Previews Not Working:** Hovering over internal links should show preview popups, but this wasn't functioning.
3. **Graph Visualization Missing:** The network graph showing relationships between notes was not appearing in the sidebar.

## Debugging Approach

### 1. Identifying the Wiki Link Problem

The first issue was a regex pattern in the link filter that only recognized wiki links with aliases (`[[Link|Title]]`), causing build errors with standard links (`[[Link]]`).

```javascript
// Original problematic regex (in .eleventy.js)
str.replace(/\[\[(.*?\|.*?)\]\]/g, function (match, p1) {
  // This only matches [[text|alias]] format
  // ...
});
```

### 2. Making Link Previews Appear

The link preview issue required multi-level debugging:

1. **Settings Configuration:** Fixed logical operator issues in `meta.js`:
   ```javascript
   // Problematic version (always true regardless of environment variable)
   dgLinkPreview: process.env.DG_LINK_PREVIEW == "true" || true,
   
   // Fixed version (defaults to true unless explicitly false)
   dgLinkPreview: process.env.DG_LINK_PREVIEW !== "false",
   ```

2. **Error Handling:** Added robust error handling around preview generation:
   ```javascript
   try {
     // Safely check if elements exist before accessing them
     const h1Element = iframe.contentWindow.document.querySelector('h1');
     if (h1Element) {
       tooltipContentHtml += '<div style="...">' + h1Element.innerHTML + '</div>';
     } else {
       tooltipContentHtml += '<div style="...">Preview</div>';
     }
     // etc...
   } catch (error) {
     console.error("Error displaying preview:", error);
     // Fallback content
   }
   ```

3. **CSS Improvements:** Enhanced visibility and styling of previews, especially for mobile.

### 3. Fixing the Missing Graph

The graph visualization required extensive debugging:

1. **Force Inclusion** of the sidebar component in the layout by removing the conditional:
   ```html
   <!-- Was conditional -->
   {% if settings.dgShowBacklinks === true or settings.dgShowLocalGraph === true or settings.dgShowToc === true%}
     {%include "components/sidebar.njk"%}
   {% endif %}
   
   <!-- Changed to always include -->
   {%include "components/sidebar.njk"%}
   ```

2. **Debug Visualization:** Added a visible fallback to confirm the component was loading:
   ```html
   <div id="graph-debug-fallback" style="height: 320px; width: 320px; background-color: purple;">
     <h3>Graph Debug Visualization</h3>
     <!-- Content to show when the real graph fails -->
   </div>
   ```

3. **CSS Force Display:** Added `!important` CSS rules to ensure visibility:
   ```css
   .graph {
     display: block !important;
     visibility: visible !important;
     opacity: 1 !important;
     min-height: 350px !important;
     width: 320px !important;
   }
   ```

4. **Script Loading Order:** Changed script loading from async to synchronous/defer:
   ```html
   <!-- Changed from async to synchronous -->
   <script src="https://fastly.jsdelivr.net/npm/force-graph@1.43.0/dist/force-graph.min.js"></script>
   <!-- Changed from async to defer -->
   <script src="https://fastly.jsdelivr.net/npm/alpinejs@3.11.1/dist/cdn.min.js" defer></script>
   ```

5. **Robust Error Handling** in Alpine.js initialization and graph rendering:
   ```javascript
   try {
     console.log('Rendering local graph...');
     if (graphData && graphData.nodes) {
       window.graph = renderLocalGraph(graphData, depth, fullScreen);
       console.log('Local graph rendered successfully');
     }
   } catch(e) {
     console.error('Error rendering graph:', e);
   }
   ```

## Key Lessons Learned

1. **Always Check Configuration Values:** Environment variable handling needs proper logical operators.

2. **Test Rendering at Multiple Levels:**
   - Is the component included in the DOM?
   - Is it visible (CSS properties)?
   - Is the data available?
   - Are the scripts loading in the correct order?

3. **Add Visible Debug Elements:** When troubleshooting, add obvious visual markers that will show up even if the main functionality fails.

4. **Script Loading Order Matters:** Libraries that depend on each other should be loaded in the correct sequence, using `defer` instead of `async` when order is important.

5. **Error Boundaries Are Essential:** Wrap Alpine.js and other JavaScript in try-catch blocks to prevent silent failures.

6. **Build Robust Fallbacks:** Always provide default or empty structures rather than letting code try to work with null or undefined values.

## Best Practices for Eleventy + Alpine.js Components

1. **Initialize Data First:** Start with empty objects/arrays in Alpine.js's x-data attribute:
   ```html
   x-data="{ graphData: { nodes: [], links: [] }, ... }"
   ```

2. **Proper Error Handling:** Use try-catch blocks for data fetching and processing.

3. **Event Sequencing:** Be careful about the order in which Alpine.js initializes and the DOM renders.

4. **CSS Debugging:** Use colored borders or backgrounds to visualize component boundaries.

5. **Console Logging:** Add strategic console logs to track the flow of execution and data transformations.

By implementing these debugging techniques, we were able to successfully fix both the link preview functionality and graph visualization, significantly improving the interactivity and navigation of the digital garden. 