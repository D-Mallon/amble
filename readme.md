# README
## Explanation of Folder Structure
- backend contains all of the django files, most of these can be ignored but settings.py and urls.py are important
- settings.py points to the frontend folder for the static files, its responsible for the database connection, and it contains the secret key
- urls.py contains the urls for the backend api and routes the frontend urls to the relevant views (www.webapp.com/home -> frontend/index.html)
- dist contains build files and can be completely ignored (it might not appear if hidden files are not beign shown in vscode)
- django-env contains the virtual enviroment, vscode might autodetect this and ask to create the environment
    * if it does say yes
    * if not more details below
- the html folder contains the base html file for the frontend, the node_modules folder contains all of the frontend dependencies
- react allows us to change the contents of base.html with JavaScript meaning we do not need to add html elements to base.html manually
- the public folder contains statically served files, the scripts folder contains simple python files for grabbing data and testing
- the src folder is where the magic happens, these are all of the react files (.jsx files are just .js files with a different extension)
- main.jsx renders the react app to the user -> App.jsx is the main component that contains all of the other components
- think of this like a hierarchy, main.jsx is the parent of App.jsx which is the parent of all of the other components
- the css files are used to style the components, each new feature will have its own component (and probably its own css file)
- .eslintrc.cjs and .gitattributes are configuration files which can be ignored
- anything contained in the .gitignore file will not be pushed to github
- db.sqlite3 is a database file created by django which allows the frontend to interact with the database (unsure of the details)
- manage.py is a django file which allows us to run the server and perform other tasks
- package-lock.json and package.json contain the frontend dependencies, they should update automatically as new dependencies are added
- i am the readme.md file, if Finbar has done a good job I should explain everything you need to know
- requirements.txt contains the environment dependencies, this is used to create the virtual environment (hopefully vscode does this for you)
- vite.config.js is a configuration file for vite, it can be ignored