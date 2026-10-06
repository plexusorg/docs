// @ts-check
import {defineConfig} from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator'
import starlightUtils from "@lorenzo_lewis/starlight-utils";

// https://astro.build/config
export default defineConfig({
    site: 'https://plex.us.org',
    integrations: [starlight({
        title: 'Plex Docs',
        logo: {
            src: './src/assets/plexlogo.png',
        },
        favicon: '/favicon.ico',
        social: [
            {icon: 'github', label: 'GitHub', href: 'https://github.com/plexusorg'},
            {icon: 'discord', label: 'Discord', href: 'https://discord.plex.us.org'},
        ],
        customCss: [
            './src/styles/custom.css',
        ],
        sidebar: [
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
        ],
        editLink: {
            baseUrl: 'https://github.com/plexusorg/docs/edit/master/',
        },
        head: [
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
        }), starlightLinksValidator()],
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