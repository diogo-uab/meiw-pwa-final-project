import MarkdownIt from 'markdown-it';

export const MARKDOWN_CLASS_SHEET = {
  h1: 'text-5xl md:text-6xl font-bold mb-10 border-b pb-4',
  h2: 'text-4xl font-bold mb-8 border-b pb-2',
  h3: 'text-2xl font-bold mb-6',
  h4: 'text-xl font-bold mb-5',
  h5: 'text-lg font-bold mb-5',
  h6: 'font-bold mb-4',
  ul: 'list-inside ml-4 list-disc mb-4',
  ol: 'list-inside ml-4 list-decimal mb-4',
  li: '[&_ul]:!mb-0',
  p: 'mb-4 [&_a]:text-primary [&_a]:underline [&_img]:my-6 [&_code]:p-1 [&_code]:bg-slate-100 [&_code]:rounded-md',
  hr: 'my-6',
  table: 'table-auto border rounded-md my-5',
  thead: 'bg-slate-100',
  th: 'border px-4 py-2',
  td: 'border px-4 py-2',
  blockquote: 'px-4 py-4 mb-4 bg-slate-100 rounded-md border-l-4 border-l-slate-400 [&_p]:m-0',
};

const parseBlock: Parameters<MarkdownIt['core']['ruler']['push']>[1] = (state) => {
  for (const token of state.tokens) {
    if (!(/_open$/.test(token.type) || ['hr', 'code'].includes(token.type))) continue;

    const classes = MARKDOWN_CLASS_SHEET[token.tag as keyof typeof MARKDOWN_CLASS_SHEET] || '';
    if (!classes) continue;
    if (token.attrGet('class')) {
      token.attrJoin('class', ` ${classes}`)
    } else {
      token.attrPush(['class', classes])
    }
  }
};

export const markdownItStylePlugin = (md: MarkdownIt) =>
  md.core.ruler.push('markdown-it-style-plugin', parseBlock);
