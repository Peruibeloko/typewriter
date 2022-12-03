import { marked } from 'marked';

export const printMarkdownToHTML = (markdown: string) => marked.parse(markdown);
