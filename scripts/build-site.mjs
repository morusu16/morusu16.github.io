import {readFile,writeFile,mkdir,readdir,copyFile} from 'node:fs/promises';
import path from 'node:path';
import {validateProfile,revision} from './profile-schema.mjs';
const root=path.resolve(import.meta.dirname,'..'),source=path.join(root,'observatory'),out=path.join(root,'dist');
const profile=validateProfile(JSON.parse(await readFile(path.join(root,'profile.json'),'utf8')));
await mkdir(out,{recursive:true});
for(const entry of await readdir(source,{withFileTypes:true})){
  if(entry.isFile()&&/\.(html|css|js)$/.test(entry.name))await copyFile(path.join(source,entry.name),path.join(out,entry.name));
}
await mkdir(path.join(out,'assets'),{recursive:true});
for(const entry of await readdir(path.join(source,'assets'),{withFileTypes:true})){
  if(entry.isFile()&&/\.(png|jpe?g|webp|svg|avif)$/.test(entry.name))await copyFile(path.join(source,'assets',entry.name),path.join(out,'assets',entry.name));
}
const safe=JSON.stringify(profile).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
await writeFile(path.join(out,'profile.js'),`window.LAB_REVISION=${JSON.stringify(revision(profile))};\nwindow.LAB_PROFILE=${safe};\n`);
await writeFile(path.join(out,'profile.json'),JSON.stringify(profile,null,2)+'\n');
await writeFile(path.join(out,'.nojekyll'),'');
await writeFile(path.join(out,'robots.txt'),'User-agent: *\nDisallow: /owner.html\nDisallow: /qa-mobile.html\n');
console.log('Built public laboratory and owner editing page.');
