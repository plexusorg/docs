// A docs page has a Markdown copy when its entry has a body. The 404 page and StarlightPage routes,
// such as /downloads, have an empty body.
export const hasMarkdownCopy = (entry: {body?: string}) => Boolean(entry.body?.trim());

// The landing page has the id "index" in the collection and the empty id in route data. Its copy is /index.md.
const isLanding = (id: string) => id === '' || id === 'index';

export const pagePath = (id: string) => isLanding(id) ? '/' : `/${id}/`;

export const markdownPath = (id: string) => `/${isLanding(id) ? 'index' : id}.md`;
