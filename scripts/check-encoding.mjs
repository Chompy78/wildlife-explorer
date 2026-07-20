import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const roots=['src','dist'];
const bad=['\u00f0','\u00e2\u20ac\u201d','\u00e2\u20ac\u201c','\u00e2\u00ac','\u00c3','\u00ef\u00bf\u00bd','\ufffd'];
const errors=[];
function walk(path){for(const name of readdirSync(path)){const full=join(path,name);const stat=statSync(full);if(stat.isDirectory())walk(full);else if(/\.(ts|tsx|js|css|html|json|md)$/.test(name)){const data=readFileSync(full);if(data[0]===0xef&&data[1]===0xbb&&data[2]===0xbf)errors.push(`${full}: UTF-8 BOM`);const text=data.toString('utf8');for(const marker of bad)if(text.includes(marker))errors.push(`${full}: suspicious encoding sequence`);}}}
for(const root of roots){try{walk(root);}catch{if(root==='src')errors.push('src folder missing');}}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}console.log('Encoding audit passed.');
