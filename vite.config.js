
import path from 'path'
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

import { config as dotenvconf } from "dotenv"
dotenvconf()

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      // these are the aliases and paths to them
      $src: path.resolve('./src'),
      $routes: path.resolve('./src/routes'),
      $instill: path.resolve('./src/routes/instill'),
      // '$plasmid': process.env.PUBLIC_LOCAL == 'local' ? path.resolve('./src/plasmid') : path.resolve('./node_modules/plasmid'), // dynamic linked
      // '$plasmid': path.resolve('./node_modules/plasmid'), // dynamic linked
      // '$instill-helpers': process.env.PUBLIC_LOCAL == 'local' ? path.resolve('./src/plasmid/modules/instill-helpers') : path.resolve('./node_modules/plasmid/modules/instill-helpers'), // dynamic linked
      $plasmid: path.resolve('./node_modules/plasmid'), // git linked
      // $plasmid: process.env.PUBLIC_LOCAL == 'local' ? path.resolve('./src/plasmid') : path.resolve('./node_modules/plasmid'), // dynamic linked
      // '$plasmid': path.resolve('./src/plasmid'), // local linked
      // $modules: path.resolve('./node_modules'),
    }
  },
});
