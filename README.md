# typescript_forum
1. Download the files 
2. Open powershell and use 'cd' to go to the directory where the files are 
3. Enter the following lines:

npm i -g typescript
npm i express @types/express express-session@types/express-session
npm i -D ts-node nodemon
tsc --init
npm i ejs

4. if 'tsc --init' doesn't work, try 'npx tsc --init' 
5. Enter the following lines on powershell:
nodemon --watch '*.ts' --exec 'ts-node' index.ts
