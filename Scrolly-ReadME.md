### Changes to the way scrollytelling code works

1. Set up npm and webpack, will serve the bundle directly. 
2. You might have to do npm install and then do npm run devSetUp on the code/ScrollyTelling folder
3. Using python httpserver, you will need to rerun 'npm run devSetUp' after every javascript change. Alternative, 'npm start' will set up a local server and all changes are synced in realtime.


Why the npm+webpack setup?

- Dependencies become much easier to include
- Avoiding conflicts in global namespace by separating files into different modules
- Ease of dependecy management within the project
