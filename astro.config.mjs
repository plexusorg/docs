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
                    {label: "Downloads", link: "https://ci.plex.us.org/job/Plex/job/master/"},
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
                    {label: 'NickMiniMessage', link: '/modules/nickminimessage'},
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
                    {label: 'The Plex API', link: '/docs/create_module/api'},
                    {label: 'Build and install', link: '/docs/create_module/install'},
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
    adapter: cloudflare({
        imageService: "compile"
    }),
});