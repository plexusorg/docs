import mdxServer from '@astrojs/mdx/server.js';
import type {APIRoute, GetStaticPaths} from 'astro';
import {experimental_AstroContainer} from 'astro/container';
import {getCollection, render} from 'astro:content';
import type {Element, ElementContent, Root} from 'hast';
import {defaultHandlers} from 'hast-util-to-mdast';
import {select, selectAll} from 'hast-util-select';
import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import {unified} from 'unified';
import {remove} from 'unist-util-remove';
import {hasMarkdownCopy, markdownPath, pagePath} from '../components/qol/markdown-path';

// Every docs page as Markdown, at its URL with `.md` added: /docs/compiling/ is /docs/compiling.md.
// The route renders the page body with the container API and converts the HTML to Markdown.
export const prerender = true;

const container = await experimental_AstroContainer.create({
    renderers: [{name: 'astro:jsx', ssr: mdxServer}],
});

const element = (tagName: string, children: ElementContent[], properties: Element['properties'] = {}): Element =>
    ({type: 'element', tagName, properties, children});
const text = (value: string): ElementContent => ({type: 'text', value});
const textOf = (node: ElementContent | Root | undefined): string =>
    !node ? '' : node.type === 'text' ? node.value : 'children' in node ? node.children.map(textOf).join('') : '';
// A pre without a code element holds a literal value, such as a list default in the config reference.
const isLiteralBlock = (node: Element) => node.tagName === 'pre' && !select('code', node);

const toMarkdown = unified()
    .use(rehypeParse, {fragment: true})
    .use(function codeBlocks() {
        return (tree: Root) => {
            // Expressive Code wraps each block in a frame with a title, a copy button, and one element per line.
            // Replace the frame with a plain pre > code that carries the language and the title.
            for (const frame of selectAll('.expressive-code', tree)) {
                const pre = select('pre', frame);
                if (!pre) {
                    continue;
                }
                const language = String(pre.properties.dataLanguage ?? '');
                const lines = selectAll('.ec-line', pre).map((line) => textOf(line).replace(/\n$/, ''));
                const title = textOf(select('figcaption .title', frame)).trim();
                const className = language && language !== 'plaintext' ? [`language-${language}`] : [];
                frame.tagName = 'pre';
                frame.properties = title ? {dataMeta: `title="${title}"`} : {};
                frame.children = [element('code', [text(lines.join('\n'))], {className})];
            }
        };
    })
    .use(function referenceLists() {
        return (tree: Root) => {
            // The config and message references show each entry as a row with its key, its default, and a panel.
            // Write each entry as a heading with its full key, then its default, then the panel text.
            for (const list of selectAll('[data-ref]', tree)) {
                const out: ElementContent[] = [];
                for (const item of selectAll('[data-ref-item]', list)) {
                    const label = String(select('a.ref-anchor', item)?.properties.ariaLabel ?? '');
                    const key = label.replace(/^Link to /, '') || textOf(select('.ref-key', item)).trim();
                    out.push(element('h4', [element('code', [text(key)])]));

                    const value = select('.ref-value', item);
                    const body = select('.ref-panel', item) ?? select('.ref-message-body', item);
                    const details = (body?.children ?? []).filter((child): child is Element =>
                        child.type === 'element' && child !== value);
                    // A panel with a literal default block shows the full value itself.
                    if (value && !details.some((child) => selectAll('pre', child).some(isLiteralBlock) || isLiteralBlock(child))) {
                        out.push(element('p', [text('Default: '), element('code', [text(textOf(value))])]));
                    }
                    for (const child of details) {
                        if (child.tagName === 'ul' && child.properties.ariaLabel) {
                            out.push(element('p', [text(`${child.properties.ariaLabel}:`)]));
                        }
                        for (const block of [child, ...selectAll('pre', child)].filter(isLiteralBlock)) {
                            block.children = [element('code', [text(textOf(block))], {className: ['language-yaml']})];
                        }
                        out.push(child);
                    }
                }
                list.tagName = 'div';
                list.properties = {};
                list.children = out;
            }
        };
    })
    .use(function tabs() {
        return (tree: Root) => {
            // Write tabs as a list: each item holds the tab label, then the panel.
            for (const instance of selectAll('starlight-tabs', tree)) {
                const labels = selectAll('[role="tab"]', instance).map((tab) => textOf(tab).trim());
                const panels = selectAll('[role="tabpanel"]', instance);
                instance.tagName = 'ul';
                instance.properties = {};
                instance.children = panels.map((panel, index) =>
                    element('li', [element('p', [text(labels[index] ?? '')]), ...panel.children]));
            }
        };
    })
    .use(function linkLists() {
        return (tree: Root) => {
            // A nav of entry links, such as "Start here" on the landing page, holds a title and a line of text in
            // each link. Write it as a list: the title as the link, then the text.
            for (const nav of selectAll('nav', tree)) {
                const links = nav.children.filter((child): child is Element => child.type === 'element' && child.tagName === 'a');
                nav.tagName = 'ul';
                nav.properties = {};
                nav.children = links.map((link) => {
                    const [title, ...rest] = link.children.filter((child) => child.type === 'element');
                    if (!title || rest.length === 0) {
                        return element('li', [link]);
                    }
                    link.children = [text(textOf(title).trim())];
                    return element('li', [link, text(`: ${rest.map((part) => textOf(part).trim()).join(' ')}`)]);
                });
            }
        };
    })
    .use(function asides() {
        return (tree: Root) => {
            for (const aside of selectAll('aside.starlight-aside', tree)) {
                aside.tagName = 'blockquote';
            }
        };
    })
    .use(function removeDecoration() {
        return (tree: Root) => {
            // Icons, buttons, scripts, heading links, and filter controls carry no text for a reader.
            const decoration = new Set<unknown>(selectAll(
                'svg, button, script, style, link, .sl-anchor-link, a.ref-anchor, [data-ref-tools], .sr-only',
                tree,
            ));
            remove(tree, (node) => node.type === 'comment' || decoration.has(node));
        };
    })
    .use(rehypeRemark, {
        handlers: {
            // Keep the code block title as the fence meta: ```yaml title="module.yml".
            pre(state, node) {
                const code = defaultHandlers.pre(state, node);
                const meta = node.properties.dataMeta;
                return typeof meta === 'string' ? {...code, meta} : code;
            },
        },
    })
    .use(remarkGfm)
    .use(remarkStringify, {bullet: '-', rule: '-'});

export const getStaticPaths = (async () => {
    const docs = await getCollection('docs', (entry) => hasMarkdownCopy(entry) && !entry.data.draft);
    return docs.map((entry) => ({params: {slug: markdownPath(entry.id).slice(1, -'.md'.length)}, props: {entry}}));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async (context) => {
    const {entry} = context.props as Awaited<ReturnType<typeof getStaticPaths>>[number]['props'];
    const {Content} = await render(entry);
    const html = await container.renderToString(Content, context);
    const body = String(await toMarkdown.process(html)).trim();
    const head = [`# ${entry.data.title}`];
    if (entry.data.description) {
        head.push(`> ${entry.data.description}`);
    }
    head.push(`Source: ${new URL(pagePath(entry.id), context.site)}`);
    return new Response(`${head.join('\n\n')}\n\n${body}\n`, {
        headers: {'Content-Type': 'text/markdown; charset=utf-8'},
    });
};
