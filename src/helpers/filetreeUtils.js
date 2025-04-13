const sortTree = (unsorted) => {
  //Sort by folder before file, then by name
  const orderedTree = Object.keys(unsorted)
    .sort((a, b) => {
      let a_pinned = unsorted[a].pinned || false;
      let b_pinned = unsorted[b].pinned || false;
      if (a_pinned != b_pinned) {
        if (a_pinned) {
          return -1;
        } else {
          return 1;
        }
      }

      const a_is_note = a.indexOf(".md") > -1;
      const b_is_note = b.indexOf(".md") > -1;

      if (a_is_note && !b_is_note) {
        return 1;
      }

      if (!a_is_note && b_is_note) {
        return -1;
      }

      // If both are notes and they're in Daily Notes folder, sort by creation date (newest first)
      if (a_is_note && b_is_note) {
        const a_path = unsorted[a].path || "";
        const b_path = unsorted[b].path || "";
        if (a_path.includes("Daily Notes") && b_path.includes("Daily Notes")) {
          const a_created = unsorted[a].created;
          const b_created = unsorted[b].created;
          if (a_created && b_created) {
            return new Date(b_created) - new Date(a_created);
          }
        }
      }

      //Regular expression that extracts any initial decimal number
      const aNum = parseFloat(a.match(/^\d+(\.\d+)?/));
      const bNum = parseFloat(b.match(/^\d+(\.\d+)?/));

      const a_is_num = !isNaN(aNum);
      const b_is_num = !isNaN(bNum);

      if (a_is_num && b_is_num && aNum != bNum) {
        return aNum - bNum; //Fast comparison between numbers
      }

      if (a.toLowerCase() > b.toLowerCase()) {
        return 1;
      }

      return -1;
    })
    .reduce((obj, key) => {
      obj[key] = unsorted[key];
      return obj;
    }, {});

  for (const key of Object.keys(orderedTree)) {
    if (orderedTree[key].isFolder) {
      orderedTree[key] = sortTree(orderedTree[key]);
    }
  }

  return orderedTree;
};

function getPermalinkMeta(note, key) {
  let permalink = "/";
  let parts = note.filePathStem.split("/");
  let name = parts[parts.length - 1];
  let noteIcon = process.env.NOTE_ICON_DEFAULT;
  let hide = false;
  let pinned = false;
  let folders = null;
  let created = null;
  let updated = null;
  let path = "";
  try {
    if (note.data.permalink) {
      permalink = note.data.permalink;
    }
    if (note.data.tags && note.data.tags.indexOf("gardenEntry") != -1) {
      permalink = "/";
    }    
    if (note.data.title) {
      name = note.data.title;
    }
    if (note.data.noteIcon) {
      noteIcon = note.data.noteIcon;
    }
    if (note.data.hide) {
      hide = note.data.hide;
    }
    if (note.data.pinned) {
      pinned = note.data.pinned;
    }
    if (note.data.created) {
      created = note.data.created;
    }
    if (note.data.updated) {
      updated = note.data.updated;
    }
    if (note.data["dg-path"]) {
      folders = note.data["dg-path"].split("/");
      path = note.data["dg-path"];
    } else {
      folders = note.filePathStem
        .split("notes/")[1]
        .split("/");
      path = folders.join("/");
    }
    folders[folders.length - 1]+= ".md";
  } catch {
    //ignore
  }

  return [{ permalink, name, noteIcon, hide, pinned, created, updated, path }, folders];
}

function assignNested(obj, keyPath, value) {
  lastKeyIndex = keyPath.length - 1;
  for (var i = 0; i < lastKeyIndex; ++i) {
    key = keyPath[i];
    if (!(key in obj)) {
      obj[key] = { isFolder: true };
    }
    obj = obj[key];
  }
  obj[keyPath[lastKeyIndex]] = value;
}

function getFileTree(data) {
  const tree = {};
  (data.collections.note || []).forEach((note) => {
    const [meta, folders] = getPermalinkMeta(note);
    assignNested(tree, folders, { isNote: true, ...meta });
  });
  const fileTree = sortTree(tree);
  return fileTree;
}

exports.getFileTree = getFileTree;
