// @ts-check
import {defineConfig} from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator'
import starlightUtils from "@lorenzo_lewis/starlight-utils";
import starlightLlmsTxt from 'starlight-llms-txt';
import permissionChips from './src/plugins/permission-chips.mjs';

const sidebar = [
    {
        label: "leadingNavLinks",
        items: [
            {label: "Javadocs", link: "/javadoc"},
            {label: "Downloads", link: "/downloads"},
        ]
    },
    {label: 'Introduction', link: '/docs'},
    {label: 'Versions', link: '/docs/versions'},
    {label: 'Compiling', link: '/docs/compiling'},
    {label: 'Permissions', link: '/docs/permissions'},
    {
        label: 'Configuration files',
        collapsed: true,
        items: [
            {label: 'Configuration', link: '/config/config'},
            {label: 'Indefinite Bans', link: '/config/indefinitebans'},
            {label: 'Messages', link: '/config/messages'},
        ]
    },
    {
        label: 'Modules',
        collapsed: true,
        items: [
            {label: 'Introduction', link: '/modules'},
            {label: 'FalseOp', link: '/modules/falseop'},
            {label: 'Guilds', link: '/modules/guilds'},
            {label: 'HTTPD', link: '/modules/httpd'},
            {label: 'LibsDisguises', link: '/modules/libsdisguises'},
            {label: 'MiniMessageExtensions', link: '/modules/minimessageextensions'},
            {label: 'NUSH', link: '/modules/nush'},
            {label: 'TFMExtras', link: '/modules/tfmextras'},
        ]
    },
    {
        label: 'Creating a Module',
        collapsed: true,
        items: [
            {label: 'Introduction', link: '/docs/create_module'},
            {label: 'Project setup', link: '/docs/create_module/setup'},
            {label: 'Commands', link: '/docs/create_module/commands'},
            {label: 'Listeners', link: '/docs/create_module/listeners'},
            {label: 'Configuration and messages', link: '/docs/create_module/configuration'},
            {label: 'Libraries and storage', link: '/docs/create_module/libraries'},
            {label: 'Build and install', link: '/docs/create_module/install'},
        ]
    },
    {
        label: 'Plex API',
        collapsed: true,
        items: [
            {label: 'Overview', link: '/api'},
            {label: 'Players', link: '/api/players'},
            {label: 'Punishments', link: '/api/punishments'},
            {label: 'Messages and logging', link: '/api/messages'},
            {label: 'Commands and configuration', link: '/api/commands-and-configuration'},
            {label: 'Storage', link: '/api/storage'},
            {label: 'Notes, rollback, and modules', link: '/api/notes-rollback-modules'},
            {label: 'Events', link: '/api/events'},
        ]
    },
    {label: 'Configuring Redis', link: '/docs/redis'},
];

// The docs page ids in sidebar order, after the landing page. The header links are not docs pages.
const pageOrder = ['index', ...sidebar
    .filter((entry) => entry.label !== 'leadingNavLinks')
    .flatMap((entry) => 'items' in entry ? entry.items : [entry])
    .map((entry) => entry.link.slice(1))];

// https://astro.build/config
export default defineConfig({
    site: 'https://plex.us.org',
    integrations: [permissionChips(), starlight({
        title: 'Plex Docs',
        favicon: '/favicon.svg',
        social: [
            {icon: 'github', label: 'GitHub', href: 'https://github.com/plexusorg'},
            {icon: 'discord', label: 'Discord', href: 'https://discord.plex.us.org'},
        ],
        components: {
            SiteTitle: './src/components/overrides/SiteTitle.astro',
            TableOfContents: './src/components/overrides/TableOfContents.astro',
            MobileTableOfContents: './src/components/overrides/MobileTableOfContents.astro',
        },
        customCss: [
            '@fontsource-variable/archivo/wdth.css',
            '@fontsource-variable/archivo/wdth-italic.css',
            '@fontsource-variable/jetbrains-mono/wght.css',
            './src/styles/custom.css',
        ],
        expressiveCode: {
            styleOverrides: {borderRadius: '6px'},
        },
        sidebar,
        lastUpdated: true,
        routeMiddleware: './src/components/qol/route-data.ts',
        editLink: {
            baseUrl: 'https://github.com/plexusorg/docs/edit/master/',
        },
        head: [
            // Starlight writes the other Open Graph and Twitter tags, including twitter:card.
            {tag: 'link', attrs: {rel: 'icon', href: '/favicon.ico', sizes: '32x32'}},
            {tag: 'meta', attrs: {property: 'og:image', content: 'https://plex.us.org/og.png'}},
            {tag: 'meta', attrs: {property: 'og:image:width', content: '1280'}},
            {tag: 'meta', attrs: {property: 'og:image:height', content: '640'}},
            {tag: 'meta', attrs: {property: 'og:image:alt', content: 'Plex: The core for free-OP and anarchy servers'}},
            {tag: 'meta', attrs: {name: 'twitter:image', content: 'https://plex.us.org/og.png'}},
            {tag: 'meta', attrs: {name: 'twitter:image:alt', content: 'Plex: The core for free-OP and anarchy servers'}},
            {
                tag: 'script',
                attrs: {
                    src: 'https://plex.us.org/1742503883/js/script.js',
                    async: true,
                },
            },
            {
                tag: 'script',
                content: 'window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()',
            },
        ],
        plugins: [starlightUtils({
            navLinks: {
                leading: {useSidebarLabelled: "leadingNavLinks"}
            }
        }), starlightLinksValidator({
            // Server-rendered pages: the validator only knows the prerendered docs pages.
            exclude: ['/downloads', '/downloads/**'],
        }), starlightLlmsTxt({
            projectName: 'Plex',
            description: 'Plex is the core plugin for free-OP and anarchy Minecraft servers. It works with any '
                + 'Vault-compatible permissions plugin and stores player data in SQLite, MariaDB, or PostgreSQL. '
                + 'Modules add optional features.',
            details: 'Every page has a Markdown copy at its URL with `.md` added, for example `/docs/compiling.md`.',
            promote: pageOrder,
            exclude: ['404'],
            customSets: [
                {
                    label: 'Plex API',
                    paths: ['api/**'],
                    description: 'The API that modules and plugins use for players, punishments, messages, storage, and more',
                },
                {
                    label: 'Module development',
                    paths: ['docs/create_module/**'],
                    description: 'How to build, configure, and install a Plex module',
                },
            ],
        })],
    }), sitemap()],
    vite: {
        plugins: [{
            // The worker bundle pulls in Starlight's Tabs, Steps and FileTree through the content collection,
            // but it only renders the download pages. satteri has no build that runs in workerd, so the worker
            // gets a stub. Node prerenders the docs pages with the real satteri.
            name: 'stub-satteri-in-worker',
            enforce: 'pre',
            applyToEnvironment: (environment) => environment.name === 'ssr',
            resolveId: (id) => id === 'satteri' ? '\0satteri-stub' : null,
            load: (id) => id === '\0satteri-stub'
                ? 'export function htmlToHast() { throw new Error("satteri is not available in the worker"); }'
                : null,
        }],
    },
    adapter: cloudflare({
        imageService: "compile",
        prerenderEnvironment: "node"
    }),
});