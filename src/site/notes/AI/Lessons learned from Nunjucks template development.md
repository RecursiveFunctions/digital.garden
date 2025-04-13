---
dg-publish: true
dg-path: AI/Lessons learned from Nunjucks template development
permalink: /ai/lessons-learned-from-nunjucks-template-development/
aliases:
  - messing around with filters in Nunjucks
  - Nunjucks template
tags:
  - AI
---
# Lessons Learned from Nunjucks Template Development

## Introduction
This document summarizes the lessons learned while implementing a navigation component for daily notes using Nunjucks templates in an 11ty static site. The process involved several iterations to address compatibility issues with Nunjucks filters in the Vercel deployment environment.

## Key Challenges

### 1. Filter Availability
Not all filters commonly used in Nunjucks development are available in the default 11ty/Vercel environment. We encountered issues with:
- `push` filter: Not available for array manipulation
- `split` filter: Not available for string splitting
- `slice` filter: Implementation issues in the build environment
- `date` filter: Requires special configuration
- `substring` and `indexOf` methods: Not available on string objects

### 2. Error Detection
Build failures provided limited context about which filters were causing issues, requiring trial and error to identify problematic code.

### 3. Development vs. Production
Filters that work in local development may not work in the production build environment, necessitating thorough testing.

## Solutions

### 1. Using Core Filters
We simplified the implementation to rely only on core Nunjucks filters:
- `replace`: For string manipulation
- `includes`: For string pattern checking
- `length`: For array and string length checking

### 2. String Manipulation with `replace`
Instead of complex string operations, we used chained `replace` filters to transform date formats:
```njk
{{ fileSlug | replace("2025-01-", "Jan ") | replace("-", " ") }}
```

### 3. Robust Comparison Logic
We implemented date comparisons without relying on advanced filters:
```njk
{% if noteDate < currentDate %}
  {% if prevNote == null or noteDate > prevNote.fileSlug %}
    {% set prevNote = note %}
  {% endif %}
{% endif %}
```

## Best Practices

### 1. Stick to Core Filters
Use only the most basic Nunjucks filters that are guaranteed to be available:
- `replace`
- `length`
- `includes`
- Simple comparisons (`<`, `>`, `==`)

### 2. Test in Production Environment
Don't assume filters that work locally will work in production. Test deployments frequently during development.

### 3. Favor Explicit Logic
Instead of relying on complex filter chains, break logic into explicit steps using basic conditionals and variables.

### 4. Fallback Strategies
Develop with fallbacks in mind - if a filter might not be available, have an alternative approach ready.

### 5. Simplify Date Formatting
For date formatting, use simple string replacements instead of relying on format filters.

## Implementation Example
Our final implementation for displaying date navigation between daily notes:

```njk
{% if prevNote %}
  <a href="{{ prevNote.url }}" class="prev-day">
    <i icon-name="chevron-left"></i>
    {{ prevNote.fileSlug | replace("2025-03-", "Mar ") | replace("-", " ") }}
  </a>
{% endif %}
```

## Conclusion
Working with Nunjucks in a deployment environment requires careful consideration of filter availability. By focusing on basic, widely-available filters and explicit control flow, we can create robust templates that work consistently across different environments.

Remember to document which filters are available in your specific environment to avoid future issues. 