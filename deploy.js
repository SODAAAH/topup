import { execSync } from 'child_process';
import fs from 'fs';

console.log('Building production bundle...');
execSync('npm run build', { stdio: 'inherit' });

console.log('Running test verification...');
execSync('npm test', { stdio: 'inherit' });

console.log('Deploying to GitHub gh-pages branch...');
execSync('powershell -Command "Push-Location dist; git init; git branch -M gh-pages; git add -A; git commit -m \'deploy: production web build\'; git remote add origin https://github.com/SODAAAH/topup.git; git push -f origin gh-pages; Pop-Location; Remove-Item -Recurse -Force dist/.git"', { stdio: 'inherit' });

console.log('Deployment complete: https://sodaaah.github.io/topup/');

