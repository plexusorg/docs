// @ts-check
import {defineConfig} from 'astro/config';
import starlight from '@astrojs/starlight';
import { viewTransitions } from "astro-vtbot/starlight-view-transitions";

import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://plex.us.org',

  integrations: [starlight({
      title: 'Plex',
      logo: {
          src: './src/assets/plexlogo.png',
      },
      social: {
          github: 'https://github.com/plexusorg',
          discord: 'https://discord.plex.us.org',
      },
      sidebar: [
          {label: 'Introduction', link: '/plex/'},
          {label: 'Versions', link: '/plex/versions'},
          {label: 'Compiling', link: '/plex/compiling'},
          {label: 'Permissions', link: '/plex/permissions'},
          {
              label: 'Configuration files',
              collapsed: true,
              items: [
                  {label: 'Configuration', link: 'config/config'},
                  {label: 'Indefinite Bans', link: 'config/indefinitebans'},
                  {label: 'Messages', link: 'config/messages'},
                  {label: 'Command Blocker', link: 'config/commandblocker'},
              ]
          },
          {
              label: 'Modules',
              collapsed: true,
              items: [
                  {label: 'Introduction', link: 'modules'},
                  {label: 'BukkitTelnet', link: 'modules/bukkittelnet'},
                  {label: 'FalseOp', link: 'modules/falseop'},
                  {label: 'HTTPD', link: 'modules/httpd'},
                  {label: 'LibsDisguises', link: 'modules/libsdisguises'},
                  {label: 'NickMiniMessage', link: 'modules/nickminimessage'},
                  {label: 'NUSH', link: 'modules/nush'},
              ]
          },
          {label: 'Creating a Module', link: '/plex/create_module'},
          {label: 'Configuring Redis', link: '/plex/redis'},
      ],
      editLink: {
          baseUrl: 'https://github.com/plexusorg/docs/edit/master/',
      },
      plugins: [viewTransitions()],
  }), sitemap()],
  output: 'server',
  adapter: cloudflare(),
});