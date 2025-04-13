require("dotenv").config();
const settings = require("../../helpers/constants");
const path = require('path');

const allSettings = settings.ALL_NOTE_SETTINGS;

module.exports = {
  eleventyComputed: {
    layout: (data) => {
      if (data.tags && data.tags.indexOf("gardenEntry") != -1) {
        return "layouts/index.njk";
      }
      return "layouts/note.njk";
    },
    permalink: (data) => {
      if (!data || !data.page) {
        console.warn('Data or page object is undefined');
        return '/notes/undefined/';
      }

      if (data.tags && data.tags.indexOf("gardenEntry") != -1) {
        return "/";
      }

      // Get the file path and name
      const filePath = data.page.filePathStem || data.page.inputPath || '';
      const fileName = path.basename(filePath).replace(/\.md$/, '');
      
      // Handle files in subdirectories first
      if (filePath.includes('/rangerschool/')) {
        return `/rangerschool/${fileName}/`;
      }

      // Determine category from filename suffix
      if (fileName.endsWith('CY')) {
        return `/cybersecurity/${fileName}/`;
      } else if (fileName.endsWith('RS')) {
        return `/rangerschool/${fileName}/`;
      } else if (fileName.endsWith('AI')) {
        return `/ai/${fileName}/`;
      } else if (fileName.match(/linux$/i)) {
        return `/linux/${fileName}/`;
      }

      // If a permalink is explicitly set in the frontmatter and it's not /file/,
      // and it ends with a slash, use it
      if (data.permalink && 
          data.permalink !== '/file/' && 
          data.permalink.endsWith('/')) {
        return data.permalink;
      }

      // Default to notes directory
      return `/notes/${fileName}/`;
    },
    settings: (data) => {
      const noteSettings = {};
      allSettings.forEach((setting) => {
        let noteSetting = data[setting];
        let globalSetting = process.env[setting];

        let settingValue =
          noteSetting || (globalSetting === "true" && noteSetting !== false);
        noteSettings[setting] = settingValue;
      });
      return noteSettings;
    },
  },
};
