import { marked } from 'marked';

export const printMarkdownToHTML = markdown => {
  const mdEscapedLineBreaks = markdown.replace(/\n/g, '\n\n');
  return marked(mdEscapedLineBreaks, {
    gfm: true
  });
};
