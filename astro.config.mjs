// @ts-check
import {defineConfig} from 'astro/config';
import {viewTransitions} from "astro-vtbot/starlight-view-transitions";
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
    site: 'https://plex.us.org',
    integrations: [starlight({
        title: 'Plex',
        logo: {
            src: './src/assets/plexlogo.png',
        },
        favicon: './src/assets/favicon.ico',
        social: {
            github: 'https://github.com/plexusorg',
            discord: 'https://discord.plex.us.org',
        },
        sidebar: [
            {label: 'Introduction', link: '/docs/'},
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
                    {label: 'Command Blocker', link: '/config/commandblocker'},
                ]
            },
            {
                label: 'Modules',
                collapsed: true,
                items: [
                    {label: 'Introduction', link: '/modules'},
                    {label: 'BukkitTelnet', link: '/modules/bukkittelnet'},
                    {label: 'FalseOp', link: '/modules/falseop'},
                    {label: 'HTTPD', link: '/modules/httpd'},
                    {label: 'LibsDisguises', link: '/modules/libsdisguises'},
                    {label: 'NickMiniMessage', link: '/modules/nickminimessage'},
                    {label: 'NUSH', link: '/modules/nush'},
                ]
            },
            {label: 'Creating a Module', link: '/docs/create_module'},
            {label: 'Configuring Redis', link: '/docs/redis'},
        ],
        editLink: {
            baseUrl: 'https://github.com/plexusorg/docs/edit/master/',
        },
        head: [
            {
                tag: 'script',
                attrs: {
                    src: '/1742503883/js/script.js',
                    'data-domain': 'plex.us.org',
                    'data-api': '/1742503883/api/event',
                    defer: true,
                },
            },
        ],
        plugins: [viewTransitions()],
    }), sitemap()],
    output: 'server',
    adapter: cloudflare(),
});