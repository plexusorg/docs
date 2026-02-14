// @ts-check
import {defineConfig} from 'astro/config';
import {viewTransitions} from "astro-vtbot/starlight-view-transitions";
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator'
import starlightUtils from "@lorenzo_lewis/starlight-utils";

// https://astro.build/config
export default defineConfig({
    site: 'https://plex.us.org',
    integrations: [starlight({
        title: 'Plex',
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
        }), starlightLinksValidator(), viewTransitions()],
    }), sitemap()],
});