const wikiLinkRegex = /\[\[(.*?\|.*?)\]\]/g;
const internalLinkRegex = /href="\/(.*?)"/g;
const matter = require('gray-matter');
const path = require('path');
const fs = require('fs');
const slugify = require("@sindresorhus/slugify");

function caselessCompare(a, b) {
  return a.toLowerCase() === b.toLowerCase();
}

function extractLinks(content) {
  return [
    ...(content.match(wikiLinkRegex) || []).map(
      (link) =>
        link
          .slice(2, -2)
          .split("|")[0]
          .replace(/.(md|markdown)\s?$/i, "")
          .replace("\\", "")
          .trim()
          .split("#")[0]
    ),
    ...(content.match(internalLinkRegex) || []).map(
      (link) =>
        link
          .slice(6, -1)
          .split("|")[0]
          .replace(/.(md|markdown)\s?$/i, "")
          .replace("\\", "")
          .trim()
          .split("#")[0]
    ),
  ];
}

function generateDefaultUrl(inputPath) {
  // Remove the src/site/notes prefix and .md extension
  const relativePath = inputPath.replace(/^.*?\/notes\//, '').replace(/\.md$/, '');
  return `/notes/${relativePath}`;
}

// NEW FUNCTION: Resolve a link string to a target URL based on files/frontmatter
function resolveLinkToUrl(linkString, allNotePaths) {
    let fileName = linkString.replaceAll("&amp;", "&");
    let header = "";
    
    if (fileName.startsWith('/') && fileName.endsWith('/')) {
        // Assume it's already a resolved permalink
        return fileName;
    }

    if (fileName.includes("#")) {
        [fileName, header] = fileName.split("#");
    }

    let targetUrl = null;
    const noteFile = fileName.endsWith('.md') ? fileName : `${fileName}.md`;

    // 1. Check for exact match in the list of known note paths
    const exactMatchPath = allNotePaths.find(p => p.toLowerCase().endsWith(`/${noteFile.toLowerCase()}`));

    if (exactMatchPath) {
        try {
            const fileContent = fs.readFileSync(exactMatchPath, 'utf8');
            const frontMatter = matter(fileContent).data;
            if (frontMatter.permalink) {
                targetUrl = frontMatter.permalink;
            } else if (frontMatter['dg-home'] === true || (frontMatter.tags && frontMatter.tags.includes('gardenEntry'))) {
                targetUrl = "/"; // Assume home note maps to root
            } else {
                 // Fallback to default URL generation based on path
                 targetUrl = generateDefaultUrl(exactMatchPath);
            }
        } catch (e) {
             console.warn(`[resolveLinkToUrl] Error reading file ${exactMatchPath} for link "${linkString}":`, e);
             // Fallback: generate default based on the *expected* path structure
             targetUrl = `/notes/${slugify(fileName)}`;
        }
    } else {
        // 2. If no exact path match, maybe it's an alias? (More complex, skipping for now)
        // console.warn(`[resolveLinkToUrl] Could not find exact path for link "${linkString}". Alias resolution not yet implemented here.`);
        // Fallback for unresolved links: best guess based on slug
        targetUrl = `/notes/${slugify(fileName)}`;
    }

    return targetUrl; // Return URL without header for now
}

function getGraph(data) {
  return new Promise((resolve) => {
    console.log('Graph generation started. Collections:', Object.keys(data.collections));
    
    let nodes = {};
    let links = [];
    let stemURLs = {};
    let homeAlias = "/";
    let excludedNodes = new Set();
    
    const noteCollection = data.collections.note || [];
    console.log(`Total notes found: ${noteCollection.length}`);
    
    if (!noteCollection.length) {
      console.warn('No notes found in collection. Check eleventy configuration.');
      resolve({
        homeAlias: "/",
        nodes: {},
        links: []
      });
      return;
    }

    // Create a list of all inputPaths ONCE for the resolver
    const allNotePaths = noteCollection.map(note => note.inputPath).filter(Boolean);
    console.log(`[getGraph] Collected ${allNotePaths.length} input paths for link resolution.`);

    // Process each note in sequence
    for (let idx = 0; idx < noteCollection.length; idx++) {
      const note = noteCollection[idx];
      const inputPath = note.inputPath; // Define inputPath early for logging

      // Get content and frontmatter safely
      let content = '';
      let frontMatter = {};
      try {
        // Only access inputPath from the note object
        if (!inputPath) {
          console.error(`[getGraph] Error: Missing inputPath for note at index ${idx}`);
          continue; // Skip this note
        }
        if (!fs.existsSync(inputPath)) {
          console.error(`[getGraph] Error: File does not exist for note at index ${idx}: ${inputPath}`);
          continue; // Skip this note
        }

        const rawContent = fs.readFileSync(inputPath, 'utf8');
        
        const parsed = matter(rawContent);
        content = parsed.content;
        frontMatter = parsed.data;
      } catch (error) {
        console.error(`[getGraph] Error processing note at index ${idx} (path: ${inputPath}):`, error);
        throw error;
      }

      // Generate safe data without accessing any template properties
      const defaultUrl = generateDefaultUrl(note.inputPath);
      const fileSlug = path.basename(note.inputPath, '.md');
      
      const safeData = {
        url: frontMatter.permalink || defaultUrl,
        fileSlug,
        filePathStem: note.inputPath.replace(/\.md$/, ''),
        inputPath: note.inputPath,
        data: {
          title: frontMatter.title || fileSlug,
          tags: Array.isArray(frontMatter.tags) ? [...frontMatter.tags] : [],
          'dg-home': frontMatter['dg-home'] || false,
          'dg-graph-exclude': frontMatter['dg-graph-exclude'] || false,
          'dg-graph-title': frontMatter['dg-graph-title'] || '',
          noteIcon: frontMatter.noteIcon || process.env.NOTE_ICON_DEFAULT,
          hideInGraph: frontMatter.hide || false
        }
      };

      // Check if this is a home/garden entry
      if (safeData.data.tags.includes('gardenEntry')) {
        safeData.data['dg-home'] = true;
      }

      console.log(`Processing note: ${safeData.url}`, {
        title: safeData.data.title,
        fileSlug: safeData.fileSlug,
        graphExclude: safeData.data['dg-graph-exclude']
      });

      // Only exclude if dg-graph-exclude is explicitly true (boolean)
      if (safeData.data['dg-graph-exclude'] === true) { 
        console.log(`Excluding note: ${safeData.url} because dg-graph-exclude is true.`);
        excludedNodes.add(safeData.url);
        continue;
      }
      
      // Determine group based on file path
      let parts = note.inputPath.split(path.sep);
      let group = "none";
      const notesIndex = parts.indexOf('notes');
      if (notesIndex >= 0 && parts.length > notesIndex + 2) {
        group = parts[notesIndex + 1];
      }

      // Extract links from the content
      const outboundLinks = extractLinks(content || '');
      console.log(`Found ${outboundLinks.length} outbound links in ${safeData.url}`);

      nodes[safeData.url] = {
        id: idx,
        title: safeData.data['dg-graph-title'] || safeData.data.title,
        url: safeData.url,
        inputPath: safeData.inputPath, // Store input path
        group,
        home: safeData.data['dg-home'],
        outBound: outboundLinks, // Store raw outbound links initially
        neighbors: new Set(),
        backLinks: new Set(),
        noteIcon: safeData.data.noteIcon,
        hide: safeData.data.hideInGraph,
      };

      console.log(`Node created: ${safeData.url} with ID ${idx}`);
      stemURLs[fileSlug] = safeData.url;
      if (safeData.data['dg-home']) {
        homeAlias = safeData.url;
      }
    }

    // Process links after all nodes are created
    if (Object.keys(nodes).length === 0) {
      console.warn('No nodes were created for the graph.');
      resolve({
        homeAlias,
        nodes: {},
        links: []
      });
      return;
    }

    let validLinkCount = 0;
    let invalidLinkCount = 0;
    
    Object.values(nodes).forEach((node) => {
      // node.outBound currently holds raw extracted link strings
      let resolvedOutBound = new Set();
      node.outBound.forEach((olink) => {
        // Resolve the raw link string (olink) to a target URL
        const targetUrl = resolveLinkToUrl(olink, allNotePaths);
        
        if (targetUrl && nodes[targetUrl] && !excludedNodes.has(targetUrl)) {
          // If resolved URL exists as a node and isn't excluded, add it
          resolvedOutBound.add(targetUrl);
          validLinkCount++;
          // console.log(`[getGraph] Resolved link "${olink}" to "${targetUrl}" from node ${node.url}`);
        } else {
          invalidLinkCount++;
           console.log(`[getGraph] Invalid or excluded link: raw="${olink}", resolved="${targetUrl || 'null'}", from node=${node.url}`);
        }
      });

      // Update node.outBound to store the resolved URLs
      node.outBound = Array.from(resolvedOutBound);

      // Now create links based on resolved outbound URLs
      node.outBound.forEach((targetUrl) => {
        let n = nodes[targetUrl]; // Target node already validated
        n.neighbors.add(node.url); 
        n.backLinks.add(node.url);
        node.neighbors.add(n.url); // Use targetUrl here
        links.push({ 
          source: node.id, 
          target: n.id,
          value: 1
        });
        // console.log(`Added link from ${node.id} (${node.url}) to ${n.id} (${targetUrl})`);
      });
    });

    // Convert Set objects to Arrays for JSON serialization
    Object.values(nodes).forEach(node => {
      node.neighbors = Array.from(node.neighbors);
      node.backLinks = Array.from(node.backLinks);
    });

    console.log(`Graph generation complete. Valid links: ${validLinkCount}, Invalid links: ${invalidLinkCount}`);
    resolve({
      homeAlias,
      nodes,
      links
    });
  });
}

exports.wikiLinkRegex = wikiLinkRegex;
exports.internalLinkRegex = internalLinkRegex;
exports.extractLinks = extractLinks;
exports.resolveLinkToUrl = resolveLinkToUrl; // Export new function if needed elsewhere
exports.getGraph = getGraph;
