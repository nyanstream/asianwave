import esbuild from 'esbuild';
import sassPlugin from 'esbuild-plugin-sass';
import svgPlugin from 'esbuild-plugin-svg';

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
        plugins: [sassPlugin(), svgPlugin()],
    })
    .catch(e => console.error(e.message));

const ResourcesToCopy = [
    ['public/manifest.json', DIST_PATH],
    ['public/pages', `${DIST_PATH}/pages`],
    ['public/assets/logo.png', `${DIST_PATH}/assets`],
    ['public/assets/icons', `${DIST_PATH}/assets/icons`],
];

for (let item of ResourcesToCopy) {
    await cpy(item[0], item[1]);
}
