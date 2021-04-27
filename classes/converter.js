class Converter {
  constructor() {
    this.marked = require('marked');
    this.renderer = {
      paragraph: this.paragraph
    };
    this.marked.use({ renderer: this.renderer });
  }

  parseMarkdown(post) {
    return this.marked(post);
  }

  paragraph(text) {
    console.log(text);
    return text;
  }
}

module.exports = Converter;
