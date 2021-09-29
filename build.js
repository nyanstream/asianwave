import esbuild from 'esbuild';
import sassPlugin from 'esbuild-plugin-sass';

import del from 'del';
import cpy from 'cpy';

const SRC_PATH = 'src';
const DIST_PATH = 'dist';

await del(DIST_PATH, { force: true });

await esbuild
    .build({
        entryPoints: [`${SRC_PATH}/popup.ts`, `${SRC_PATH}/background.ts`, `${SRC_PATH}/options.ts`],
        target: 'esnext',
        format: 'esm',
        bundle: true,
        // minify: true,
        outdir: DIST_PATH,
        loader: {
            '.html': 'text',
        },
        jsx: 'transform',
        jsxFactory: 'h',
        jsxFragment: 'Fragment',
        plugins: [sassPlugin()],
    })
    .catch(e => console.error(e.message));

await cpy('public/manifest.json', DIST_PATH);
await cpy('public/pages', `${DIST_PATH}/pages`);
await cpy('public/assets/icons', `${DIST_PATH}/assets/icons`);
