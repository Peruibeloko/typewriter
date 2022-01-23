import { marked } from 'marked';

const rules = {
  paragraph: src => src
};

export const parseMarkdown = post => {
  const newPost = post.replace(/\n/g, '\\\n');
  marked.use({ renderer: rules });
  return marked(newPost);
};
