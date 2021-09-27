import esbuild from 'esbuild';
import sassPlugin from 'esbuild-plugin-sass';

import del from 'del';
import cpy from 'cpy';

await del('dist', { force: true });

await esbuild
    .build({
        entryPoints: ['src/popup.ts', 'src/background.ts', 'src/options.ts'],
        target: 'esnext',
        format: 'esm',
        bundle: true,
        // minify: true,
        outdir: 'dist',
        loader: {
            '.html': 'text',
        },
        jsx: 'transform',
        jsxFactory: 'h',
        jsxFragment: 'Fragment',
        plugins: [sassPlugin()],
    })
    .catch(e => console.error(e.message));

await cpy('public/manifest.json', 'dist');
await cpy('public/pages', 'dist/pages');
await cpy('public/assets/icons', 'dist/assets/icons');
