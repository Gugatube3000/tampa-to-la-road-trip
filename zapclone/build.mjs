/* Empacota o app em um único arquivo HTML autossuficiente.
   Uso: node build.mjs [saida.html]
   Sem argumento, escreve zapclone-standalone.html ao lado dos fontes. */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const read = (f) => readFileSync(resolve(here, f), 'utf8');

const html = read('index.html');
const css = read('styles.css');
const js = [read('data.js'), read('app.js')].join('\n\n');

// pega só o miolo do <body>: o hospedeiro (artifact) fornece o esqueleto
const body = html.slice(html.indexOf('<body>') + 6, html.lastIndexOf('</body>')).trim();
const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? 'ZapClone';
const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
const boot = html.match(/<script>\n\/\* define o tema[\s\S]*?<\/script>/)?.[0] ?? '';

const out = `<title>${title}</title>
<meta name="description" content="${desc}">
${boot}
<style>
${css}
</style>

${body.replace(/\n?<script src="[^"]+"><\/script>/g, '')}

<script>
${js}
</script>
`;

const dest = resolve(here, process.argv[2] ?? 'zapclone-standalone.html');
writeFileSync(dest, out, 'utf8');
console.log(`${dest} — ${(Buffer.byteLength(out) / 1024).toFixed(1)} kB`);
