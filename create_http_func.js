#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dest = process.argv[2];
if (!dest) throw new Error(`Destination folder missing. Expected: create_http_func <dest>.`);
if (fs.existsSync(dest)) throw new Error(`Destination folder ${dest} already exists.`);
const orig = path.dirname(fileURLToPath(import.meta.url)) + '/function_template';
fs.cpSync(orig, dest, { recursive: true });
console.debug(`Created function from template: ${path.resolve(dest)}`);
