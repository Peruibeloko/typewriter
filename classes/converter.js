export default class Converter {
  constructor() {
    this.marked = require('marked');
    this.renderer = {
      paragraph: this.paragraph
    };
    this.marked.use({ renderer: this.renderer });
  }

  parseMarkdown(post) {
    const newPost = post.replace(/\n/g, '\\\n');
    return this.marked(newPost);
  }

  paragraph(src) {
    return src;
  }
}
