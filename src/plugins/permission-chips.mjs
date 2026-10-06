// An Astro integration that turns inline code holding only a permission node, such as `plex.ban`, into a chip with a
// copy button, on every Markdown and MDX page. Code inside code blocks, links, headings, and buttons stays as it is.
// It adds a Sätteri HAST plugin to the Markdown processor, the chip styles, and one delegated click handler.
import {fileURLToPath} from 'node:url';

const PERMISSION = /^plex(\.[a-z0-9_-]+)+$/;
const SKIP = new Set(['pre', 'a', 'button', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

const svg = (className, strokeWidth, children) => ({
    type: 'element',
    tagName: 'svg',
    properties: {
        class: className, width: '13', height: '13', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
        'stroke-width': strokeWidth, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true',
    },
    children,
});

function chip(permission) {
    return {
        type: 'element',
        tagName: 'span',
        properties: {class: 'perm-chip not-content'},
        children: [
            {type: 'element', tagName: 'code', properties: {}, children: [{type: 'text', value: permission}]},
            {
                type: 'element',
                tagName: 'button',
                properties: {type: 'button', class: 'perm-copy', 'data-permission': permission, 'aria-label': `Copy ${permission}`},
                children: [
                    svg('perm-icon-copy', '2', [
                        {type: 'element', tagName: 'rect', properties: {x: '9', y: '9', width: '11', height: '11', rx: '2'}, children: []},
                        {type: 'element', tagName: 'path', properties: {d: 'M5 15V5a1 1 0 0 1 1-1h10'}, children: []},
                    ]),
                    svg('perm-icon-done', '2.25', [
                        {type: 'element', tagName: 'path', properties: {d: 'M5 12.5l4.5 4.5L19 7.5'}, children: []},
                    ]),
                    {type: 'element', tagName: 'span', properties: {class: 'perm-copied', 'aria-hidden': 'true'},
                        children: [{type: 'text', value: 'Copied'}]},
                ],
            },
        ],
    };
}

function insideSkipped(node, ctx) {
    for (let parent = ctx.parent(node); parent; parent = ctx.parent(parent)) {
        if (parent.type === 'element' && SKIP.has(parent.tagName)) {
            return true;
        }
    }
    return false;
}

/** The Sätteri HAST plugin. Exported for use without the integration. */
export const permissionChipsHastPlugin = {
    name: 'plex-permission-chips',
    element: {
        filter: ['code'],
        visit(node, ctx) {
            const [text] = node.children;
            if (node.children.length !== 1 || text.type !== 'text' || !PERMISSION.test(text.value) || insideSkipped(node, ctx)) {
                return;
            }
            return chip(text.value);
        },
    },
};

const path = (file) => JSON.stringify(fileURLToPath(new URL(file, import.meta.url)).replace(/\\/g, '/'));

export default function permissionChips() {
    return {
        name: 'plex-permission-chips',
        hooks: {
            'astro:config:setup': ({config, injectScript}) => {
                const plugins = config.markdown?.processor?.options?.hastPlugins;
                if (!Array.isArray(plugins)) {
                    throw new Error('plex-permission-chips needs the Sätteri Markdown processor, which Astro uses by default.');
                }
                plugins.push(permissionChipsHastPlugin);
                injectScript('page-ssr', `import ${path('./permission-chips.css')};`);
                injectScript('page', `import ${path('./permission-chips-client.js')};`);
            },
        },
    };
}
