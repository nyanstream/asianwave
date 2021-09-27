import esbuild from 'esbuild';
import sassPlugin from 'esbuild-plugin-sass';

await esbuild
    .build({
        entryPoints: ['src/index.ts'],
        format: 'esm',
        bundle: true,
        outdir: 'dist',
        loader: {
            '.html': 'text',
        },
        plugins: [sassPlugin()],
    })
    .catch(e => console.error(e.message));
