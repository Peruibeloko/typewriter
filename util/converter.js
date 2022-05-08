import { marked } from 'marked';

export const printMarkdownToHTML = markdown => {
  const mdEscapedLineBreaks = markdown.replace(/\n/g, '\n\n');
  return marked(mdEscapedLineBreaks, {
    gfm: true
  });
};

export const sendParsedPost = (req, res) => {
  const { post, ...postInfo } = res.locals.doc;

  const response = {
    ...postInfo,
    content: printMarkdownToHTML(post)
  };

  res.send(response).end();
};
