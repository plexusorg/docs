import {defineRouteMiddleware} from '@astrojs/starlight/route-data';
import {hasMarkdownCopy, markdownPath} from './markdown-path';

// Point to the Markdown copy of each docs page.
export const onRequest = defineRouteMiddleware((context) => {
    const {starlightRoute} = context.locals;
    if (!hasMarkdownCopy(starlightRoute.entry)) {
        return;
    }
    starlightRoute.head.push({
        tag: 'link',
        attrs: {rel: 'alternate', type: 'text/markdown', href: markdownPath(starlightRoute.id)},
    });
});
