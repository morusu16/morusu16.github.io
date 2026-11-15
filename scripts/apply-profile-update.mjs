import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {validateUpdate} from './profile-schema.mjs';
const event=JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH,'utf8'));
const current=JSON.parse(await readFile('profile.json','utf8'));
const next=validateUpdate(event,current,process.env.GITHUB_ACTOR);
await writeFile('profile.json',JSON.stringify(next,null,2)+'\n');
const run=(...args)=>execFileSync('git',args,{stdio:'inherit'});
const changed=execFileSync('git',['diff','--name-only','--','profile.json'],{encoding:'utf8'}).trim();
if(changed){
  run('config','user.name','github-actions[bot]');
  run('config','user.email','41898282+github-actions[bot]@users.noreply.github.com');
  run('add','--','profile.json');
  run('commit','-m','Update laboratory profile from owner-approved request #'+event.issue.number);
  run('push','origin','HEAD:main');
}
console.log('Owner-approved profile validated and saved.');
