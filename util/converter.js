import { marked } from 'marked';

export const printMarkdownToHTML = markdown => {
  const mdEscapedLineBreaks = markdown.replace(/\n/g, '\n\n');
  return marked(mdEscapedLineBreaks, {
    gfm: true
  });
};

export const sendParsedPost = (req, res) => {
  const {
    post: { post: postContent, ...postInfo },
    prevPostId,
    nextPostId
  } = res.locals;

  const postObject = {
    ...postInfo,
    content: printMarkdownToHTML(postContent)
  };

  res.send({ postObject, prevPostId, nextPostId }).end();
};
