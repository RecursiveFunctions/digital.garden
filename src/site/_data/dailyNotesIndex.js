const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

module.exports = function() {
  const dailyNotesDir = path.join(__dirname, '../../site/notes/Daily Notes');
  const files = fs.readdirSync(dailyNotesDir).filter(file => file.endsWith('.md'));
  
  // Sort files by date (newest first)
  files.sort((a, b) => b.localeCompare(a));
  
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
  
  return {
    groups: Object.entries(monthGroups).map(([key, files]) => ({
      name: key,
      files: files
    }))
  };
}; 