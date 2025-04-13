const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Function to run after the site is built
module.exports = function() {
  try {
    const dailyNotesDir = path.join(__dirname, '../../site/notes/Daily Notes');
    const outputFile = path.join(__dirname, '../../site/notes/Daily Notes.md');
    
    // Read all the MD files in the Daily Notes directory
    const files = fs.readdirSync(dailyNotesDir)
      .filter(file => file.endsWith('.md'))
      .sort((a, b) => b.localeCompare(a)); // Sort files by date (newest first)
    
    // Group files by month
    const monthGroups = {};
    
    files.forEach(file => {
      // Extract date components from filename (assuming format: YYYY-MM-DD.md)
      const [year, month, day] = file.split('.')[0].split('-');
      
      // Get month name
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
      const monthName = monthNames[parseInt(month, 10) - 1];
      
      // Create year-month key
      const yearMonthKey = `${year} ${monthName}`;
      
      // Get file contents to extract title or description if available
      const filePath = path.join(dailyNotesDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const parsed = matter(fileContent);
      
      // Get title if available, or first heading
      let title = '';
      const headingMatch = parsed.content.match(/^#\s+(.*)/m);
      if (headingMatch) {
        title = headingMatch[1];
      }
      
      // Format date in readable format
      const displayDate = `${day} ${monthNames[parseInt(month, 10) - 1].substring(0, 3)} ${year}`;
      
      // Initialize group if it doesn't exist
      if (!monthGroups[yearMonthKey]) {
        monthGroups[yearMonthKey] = [];
      }
      
      // Add file to group
      monthGroups[yearMonthKey].push({
        path: `Daily Notes/${file.replace('.md', '')}`,
        displayDate: displayDate,
        title: title,
        originalFileName: file
      });
    });
    
    // Generate the Markdown content
    let content = `---
dg-publish: true
noteIcon: "calendar"
created: "2025-03-25"
permalink: /daily-notes/
---

# Daily Notes Archive

This page contains links to all daily notes, sorted by date (newest first). This index is automatically generated.

`;
    
    // Add each group to the content
    Object.entries(monthGroups).forEach(([key, files]) => {
      content += `## ${key}\n`;
      
      files.forEach(file => {
        let line = `- [[${file.path}|${file.displayDate}]]`;
        if (file.title) {
          line += ` - ${file.title}`;
        }
        content += line + '\n';
      });
      
      content += '\n';
    });
    
    // Add footer
    const today = new Date();
    const formattedDate = `${today.getDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][today.getMonth()]} ${today.getFullYear()}`;
    
    content += `<div class="note-footer">
  <div class="note-updated">Last updated: ${formattedDate}</div>
</div>`;
    
    // Write the content to the file
    fs.writeFileSync(outputFile, content);
    
    console.log('Daily Notes index generated successfully!');
    return true;
  } catch (error) {
    console.error('Error generating Daily Notes index:', error);
    return false;
  }
}; 