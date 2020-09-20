# NODEJS AND NPM

## NODE.JS

# run js file
node server.js

# -----------
# node interactive (shell)
# -----------

# prepares the terminal to use node code. (js is compiled to machine code)
node
# exits to command prompt
process.exit(0)
# displays global object (methods, etc)
global

# -----------
# NPM
# -----------

# sets up 'package.json' file.
npm init
# installs all modules listed as dependencies in 'package.json'.
npm install
# install package and save as dependency in 'package.json' file.
npm install package_name --save
# install package globally
npm install package_name -g
# install package as dev-dependency
npm install package_name --save-dev
# start server (runs 'start' property of 'scripts' object, or `node server.js`)
npm start
# update package.json
npm update

# -----------
# INSTALL BABEL (AND CONFIGURE)
# -----------

npm install -g babel-cli # global
npm add babel-preset-react # local
npm add babel-preset-env # local

# ---------------
# TRANSPILE WITH BABEL
# ---------------

# takes source code, transpiles it to an output file.
# babel, source, output, presets_used, watches_for_changes
babel src/app.js --out-file=public/scripts/app.js --presets=env,react --watch

# -----------
# CREATE REACT APP
# -----------

# initialize app
npx create-react-app app_name

# ------------
# NODE.JS (conda)
# ------------

# create an environment for nodejs projects.
conda create --name mynodeenv
# start my node.js environment.
conda activate name_of_environment
# install nodejs (10.4) into conda env
conda install -c conda-forge nodejs

# ------------
# create react app (DEPRECATED)
# ------------

# globally install create-react-app
npm i -g create-react-app
# initialize react app
create-react-app app_name
# DEPRECATED *************
