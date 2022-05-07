import { marked } from 'marked';

export const printMarkdownToHTML = markdown => {
  const mdEscapedLineBreaks = markdown.replace(/\n/g, '\n\n');
  return marked(mdEscapedLineBreaks, {
    gfm: true
  });
};

export const sendParsedPost = (req, res) => {
  const { doc } = res.locals;

  const response = {
    ...doc,
    post: printMarkdownToHTML(doc.post)
  };

  res.send(response).end();
};
