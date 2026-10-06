// Builds the configuration and message references from Plex's own default files in src/data/plex/.
// The YAML files supply every key, default, and type. config-docs.yml supplies only the words.
// Loading this module checks that the two agree and throws, which fails the build, when they drift.
import {isMap, isScalar, isSeq, parse, parseDocument, type Node as YamlNode} from 'yaml';
import docsSource from './config-docs.yml?raw';

const sources = import.meta.glob<string>('./plex/*.yml', {query: '?raw', import: 'default', eager: true});

export const CONFIG_FILES = ['config.yml', 'entities.yml', 'worlds.yml', 'toggles.yml', 'protection.yml'] as const;
export type ConfigFileName = (typeof CONFIG_FILES)[number];

export interface SettingDoc {
    description: string;
    accepts?: string;
    note?: string;
}

export interface LeafNode {
    kind: 'leaf';
    key: string;
    path: string;
    id: string;
    /** The value as the file writes it, for a scalar. A summary, for a list or a map. */
    display: string;
    /** For a list or a map: how many entries it has by default. */
    count?: number;
    /** For a list or a map: the default YAML block, dedented. */
    block?: string;
    accepts?: string;
    doc: SettingDoc;
}

export interface BranchNode {
    kind: 'branch';
    key: string;
    path: string;
    id: string;
    children: TreeNode[];
}

export type TreeNode = LeafNode | BranchNode;

export interface ConfigFile {
    name: ConfigFileName;
    nodes: TreeNode[];
    /** The parsed file, for pages that list entries such as protection presets. */
    data: Record<string, unknown>;
}

export interface Placeholder {
    name: string;
    description: string;
}

export interface Message {
    key: string;
    /** The value as the file writes it, quotes and escapes included. */
    value: string;
    placeholders: Placeholder[];
    note?: string;
}

export interface MessageGroup {
    title: string;
    messages: Message[];
}

function source(name: string): string {
    const text = sources[`./plex/${name}`];
    if (text === undefined) {
        throw new Error(`src/data/plex/${name} is missing. Copy it from Plex's server/src/main/resources folder.`);
    }
    return text.replace(/\r\n/g, '\n');
}

/** Turns a collection's source range into a block that starts at column zero. */
function block(text: string, node: YamlNode): string {
    const [start, end] = node.range!;
    const lines = text.slice(text.lastIndexOf('\n', start - 1) + 1, end).trimEnd().split('\n');
    const indent = Math.min(...lines.filter((line) => line.trim()).map((line) => line.match(/^ */)![0].length));
    return lines.map((line) => line.slice(indent)).join('\n');
}

/** A one-line form of a list or a map: its items or keys as the file writes them, cut short when long. */
function summary(text: string, node: YamlNode): {display: string; count?: number} {
    const items = isSeq(node)
        ? node.items.map((item) => (isScalar(item) ? text.slice(item.range![0], item.range![1]) : '…'))
        : isMap(node) ? node.items.map((pair) => String((pair.key as {value: unknown}).value)) : [];
    const [open, close] = isSeq(node) ? ['[', ']'] : ['{', '}'];
    let shown = items;
    while (shown.length > 1 && shown.join(', ').length > 44) {
        shown = shown.slice(0, -1);
    }
    if (items.length === 0) {
        return {display: `${open}${close}`};
    }
    if (shown.length === items.length) {
        return {display: `${open} ${shown.join(', ')} ${close}`};
    }
    return {display: `${open} ${shown.join(', ')}, … ${close}`, count: items.length};
}

function derivedAccepts(node: YamlNode): string | undefined {
    if (isSeq(node)) {
        return 'a list';
    }
    if (!isScalar(node)) {
        return undefined;
    }
    if (typeof node.value === 'boolean') {
        return '`true` or `false`';
    }
    if (typeof node.value === 'number') {
        return Number.isInteger(node.value) ? 'a whole number' : 'a number';
    }
    return undefined;
}

const docs = parse(docsSource) as Record<string, Record<string, SettingDoc>>;
const problems: string[] = [];
const configIds = new Set<string>();
const messageIds = new Set<string>();

function claimId(ids: Set<string>, id: string, where: string) {
    if (ids.has(id)) {
        problems.push(`${where}: the anchor #${id} is used twice`);
    }
    ids.add(id);
}

function buildConfig(name: ConfigFileName): ConfigFile {
    const text = source(name);
    const document = parseDocument(text);
    const fileDocs = docs[name] ?? {};
    const used = new Set<string>();
    const prefix = name === 'config.yml' ? '' : `${name.replace(/\.yml$/, '')}-`;

    const walk = (node: YamlNode, parents: string[]): TreeNode[] => {
        if (!isMap(node)) {
            return [];
        }
        return node.items.map((pair) => {
            const key = String((pair.key as {value: unknown}).value);
            const value = pair.value as YamlNode;
            const path = [...parents, key].join('.');
            const id = prefix + [...parents, key].join('-');
            claimId(configIds, id, `${name} ${path}`);
            const doc = fileDocs[path];
            if (!doc && isMap(value) && value.items.length > 0) {
                return {kind: 'branch', key, path, id, children: walk(value, [...parents, key])};
            }
            if (!doc) {
                problems.push(`${name}: the setting "${path}" has no description in src/data/config-docs.yml`);
            } else if (typeof doc.description !== 'string' || doc.description.trim() === '') {
                problems.push(`${name}: the entry "${path}" in src/data/config-docs.yml has no description text`);
            }
            used.add(path);
            const leaf: LeafNode = {
                kind: 'leaf',
                key,
                path,
                id,
                display: '',
                accepts: doc?.accepts ?? derivedAccepts(value),
                doc: doc ?? {description: ''},
            };
            if (isScalar(value)) {
                leaf.display = text.slice(value.range![0], value.range![1]);
            } else {
                Object.assign(leaf, summary(text, value), {block: block(text, value)});
            }
            return leaf;
        });
    };

    const nodes = walk(document.contents as YamlNode, []);
    for (const path of Object.keys(fileDocs)) {
        if (!used.has(path)) {
            problems.push(`${name}: src/data/config-docs.yml describes "${path}", but the file has no such setting`);
        }
    }
    return {name, nodes, data: document.toJS() as Record<string, unknown>};
}

for (const name of Object.keys(docs)) {
    if (!(CONFIG_FILES as readonly string[]).includes(name)) {
        problems.push(`src/data/config-docs.yml has a section for ${name}, which is not a reference file`);
    }
}

export const configFiles = Object.fromEntries(CONFIG_FILES.map((name) => [name, buildConfig(name)])) as Record<ConfigFileName, ConfigFile>;

const pages = import.meta.glob<string>('../content/docs/config/{config,messages}.mdx', {query: '?raw', import: 'default', eager: true});

function page(name: string): string {
    const text = pages[`../content/docs/config/${name}.mdx`];
    if (text === undefined) {
        throw new Error(`src/content/docs/config/${name}.mdx is missing`);
    }
    return text;
}

/**
 * The configuration page places each top-level key under its own heading with <ConfigTree file="..." keys="..." />.
 * Every top-level key of every file must appear in exactly one ConfigTree, so a new key in Plex fails the build
 * until the page gives it a place.
 */
function checkConfigPlacement() {
    const placed = new Map<string, number>();
    for (const match of page('config').matchAll(/<ConfigTree\s+file="([^"]+)"\s+keys="([^"]+)"\s*\/>/g)) {
        const file = configFiles[match[1] as ConfigFileName];
        if (!file) {
            problems.push(`config.mdx: <ConfigTree file="${match[1]}"> names no reference file`);
            continue;
        }
        for (const key of match[2].split(/\s+/)) {
            if (!file.nodes.some((node) => node.key === key)) {
                problems.push(`config.mdx: ${match[1]} has no top-level key "${key}"`);
            }
            placed.set(`${match[1]} ${key}`, (placed.get(`${match[1]} ${key}`) ?? 0) + 1);
        }
    }
    for (const name of CONFIG_FILES) {
        for (const node of configFiles[name].nodes) {
            const count = placed.get(`${name} ${node.key}`) ?? 0;
            if (count !== 1) {
                problems.push(`config.mdx: the ${name} key "${node.key}" appears in ${count} ConfigTree sections, `
                    + 'not 1. Add it to the keys of one <ConfigTree> under a heading');
            }
        }
    }
}

checkConfigPlacement();

const PLACEHOLDER = /^<([a-z0-9_]+)>\s*-\s*(.+)$/i;
const KEY = /^([A-Za-z0-9_]+):/;

/**
 * Reads messages.yml line by line for its comments, and through the YAML parser for its values.
 * A blank line starts a new group. A comment that opens a group and is not a placeholder line is the group title.
 * Above a key, "# <name> - text" lines are its placeholders, and other comment lines are its note.
 */
function buildMessages(): MessageGroup[] {
    const text = source('messages.yml');
    const document = parseDocument(text);
    const values = new Map<string, string>();
    if (isMap(document.contents)) {
        for (const pair of document.contents.items) {
            const value = pair.value as YamlNode;
            values.set(String((pair.key as {value: unknown}).value), text.slice(value.range![0], value.range![1]));
        }
    }

    const groups: MessageGroup[] = [];
    const seen = new Set<string>();
    let comments: string[] = [];
    let afterBlank = true;
    let current: MessageGroup | undefined;

    for (const line of text.split('\n')) {
        if (line.trim() === '') {
            comments = [];
            afterBlank = true;
            continue;
        }
        if (line.startsWith('#')) {
            comments.push(line.replace(/^#\s?/, '').trim());
            continue;
        }
        const match = line.match(KEY);
        if (!match) {
            continue;
        }
        const key = match[1];
        if (afterBlank || !current) {
            const titleLines: string[] = [];
            while (comments.length > 0 && !PLACEHOLDER.test(comments[0])) {
                titleLines.push(comments.shift()!);
            }
            const title = titleLines.join(' ') || 'General';
            current = {title, messages: []};
            groups.push(current);
        }
        const placeholders: Placeholder[] = [];
        const note: string[] = [];
        for (const comment of comments) {
            const placeholder = comment.match(PLACEHOLDER);
            if (placeholder) {
                placeholders.push({name: placeholder[1], description: placeholder[2]});
            } else {
                note.push(comment);
            }
        }
        const value = values.get(key);
        if (value === undefined) {
            problems.push(`messages.yml: the line for "${key}" is not a top-level message`);
        }
        claimId(messageIds, key, `messages.yml ${key}`);
        current.messages.push({key, value: value ?? '', placeholders, note: note.join(' ') || undefined});
        seen.add(key);
        comments = [];
        afterBlank = false;
    }

    for (const key of values.keys()) {
        if (!seen.has(key)) {
            problems.push(`messages.yml: the message "${key}" was not found by the line reader`);
        }
    }
    return groups;
}

export const messageGroups = buildMessages();

// The messages page places each group under its own heading with <MessageList group="..." />, like the config page.
{
    const placed = [...page('messages').matchAll(/<MessageList\s+group="([^"]+)"\s*\/>/g)].map((match) => match[1]);
    for (const title of placed) {
        if (!messageGroups.some((group) => group.title === title)) {
            problems.push(`messages.mdx: messages.yml has no group "${title}"`);
        }
    }
    for (const group of messageGroups) {
        const count = placed.filter((title) => title === group.title).length;
        if (count !== 1) {
            problems.push(`messages.mdx: the messages.yml group "${group.title}" appears in ${count} MessageList `
                + 'sections, not 1. Add <MessageList group="..." /> under a heading');
        }
    }
}

if (problems.length > 0) {
    throw new Error(`The configuration reference does not match Plex's default files:\n  - ${problems.join('\n  - ')}\n`
        + 'Update src/data/config-docs.yml, or copy the current files from Plex\'s server/src/main/resources folder.');
}

const escape = (text: string) =>
    text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Renders the inline markdown that config-docs.yml uses: `code`, [text](url), and **bold**. */
export function inline(text: string): string {
    const code: string[] = [];
    const html = escape(text.replace(/`([^`]+)`/g, (_, c: string) => `\u0000${code.push(c) - 1}\u0000`))
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    return html.replace(/\u0000(\d+)\u0000/g, (_, i: string) => `<code>${escape(code[Number(i)])}</code>`);
}

/** Splits text into paragraphs on blank lines and renders each one. */
export function paragraphs(text: string): string {
    return text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map((p) => `<p>${inline(p.replace(/\s*\n\s*/g, ' '))}</p>`).join('');
}
