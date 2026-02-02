import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const mode = process.env.ROBOTS_ENV || process.env.NODE_ENV || 'production';
const isDev = ['dev', 'development', 'staging'].includes(mode.toLowerCase());
const fileName = isDev ? 'robots-dev.txt' : 'robots.txt';

const source = path.resolve(root, 'seo', fileName);
const destination = path.resolve(root, 'public', 'robots.txt');

await mkdir(path.dirname(destination), { recursive: true });
await copyFile(source, destination);

console.log(`[copy-robots] ${fileName} -> public/robots.txt`);
