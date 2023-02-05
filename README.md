# hackuci-2023
epic webreg schedule generatr

instructions for ryan to start the server because he is dummy
 - install poetry
 - run poetry install
 - C:\Users\zyrat\AppData\Roaming\Python\Scripts\poetry 
 - make surepoetry virtual environment selected in vscode (run `poetry env info` to check what virtualenv poetry created) in web directory
 - create a new terminal window to activate it
 - run `uvicorn main:app` to run the web server

part2
 - run meilisearch command in readme in web directory

part3
 - run npm install in frontend directory (optional)
 - run "npm run start" in frontend directory


docker
 - open web directory
 - `docker build . -t web`
 - `docker run --net=host web`
 - run meilisearch command
