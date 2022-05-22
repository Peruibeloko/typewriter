import { marked } from 'marked';

export const printMarkdownToHTML = markdown => marked.parse(markdown);
