import { marked } from 'marked';

marked.use({
  renderer: {
    blockquote(quote) {
      return `<blockquote>${quote}</blockquote>`;
    }
  }
});

export const printMarkdownToHTML = markdown => marked.parse(markdown);
