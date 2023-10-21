
import { marked } from 'marked';
import traverse from 'traverse';

export const md2json = (mdContent) => {
  const aligned = getAlignedContent(mdContent);
  const json = marked.lexer(aligned);
  let currentHeading;
  let rootHeading;
  let headings = [];
  const output = [];

  json.forEach((item) => {
    if (item.type === 'heading') {
      if (item.depth === 1) {
        rootHeading = { name: item.text, content: [] };
        headings = [rootHeading];
        output.push(rootHeading);
        currentHeading = rootHeading;
      } else {
        headings = headings.slice(0, item.depth - 1);
        let newHeading = { name: item.text, content: [] };
        headings.push(newHeading);
        let parent = headings[item.depth - 2];
        if (!parent.content) {
          parent.content = [];
        }
        parent.content.push(newHeading);
        currentHeading = newHeading;
      }
    } else {
      if (!currentHeading) {
        rootHeading = { name: 'default', content: [] };
        currentHeading = rootHeading;
        output.push(rootHeading);
      }
      if (item.raw) {
        currentHeading.raw = (currentHeading.raw || '') + item.raw;
      }
    }
  });

  return output;
};













function getAlignedContent(mdContent) {
  const headings = mdContent.match(/(?:\r\n)#.*$/mg);
  if (!headings) {
    return mdContent.trim();
  }
  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i].trim();
    const propHeading = new RegExp('(?:\r\n){2}' + heading + '.*$', 'mg');
    if (!mdContent.match(propHeading)) {
      const wrongHeading = new RegExp('(?:\r\n)' + heading + '.*$', 'mg');
      mdContent = mdContent.replace(wrongHeading, '\r\n\r\n' + heading);
    }
  }
  return mdContent;
}

function getParentHeading(headings, item, result) {
  let parent;
  const index = item.depth - 1;
  const currentHeading = headings[index];
  if (currentHeading) {
    headings.splice(index, headings.length - index);
  }
  headings.push(item.text);
  for (let i = 0; i < index; i++) {
    parent = !parent ? result[headings[i]] : parent[headings[i]];
  }
  return {
    headings: headings,
    parent: parent,
  };
}

function toMd(jsonObject) {
  let mdText = '';
  traverse(jsonObject).reduce((acc, value) => {
    mdText += (this.isLeaf && this.key === 'raw') ? value : getHash(this.level) + ' ' + this.key + '\n\n';
    return;
  });
  return mdText;
}
export { toMd };

function getHash(level) {
  let hash = '';
  for (let i = 0; i < level; i++) {
    hash += '#';
  }
  return hash;
}
