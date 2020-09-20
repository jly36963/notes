// -----------
// create react app
// -----------

// -----------
//  initialize app (NPM)
// -----------

//  sets up 'package.json' file.
'npm init'
//  installs all modules listed as dependencies in 'package.json'.
'npm install'
//  install package and save as dependency in 'package.json' file.
'npm install package_name --save'
//  install package globally
'npm install package_name -g'
//  install package as dev - dependency
'npm install package_name--save -dev'
//  start server(runs 'start' property of 'scripts' object, or`node server.js`)
'npm start'
//  update package.json
'npm update'

// -----------
// initialize app (CRA)
// -----------

// initialize app
'npx create-react-app my-app-name'

// -----------
// use / build
// -----------

// package.json
  // scripts
    // npm start -- start app (using 'react-scripts start') (CRA server + hot reloader)
    // npm run build -- create production version in '/build' directory
  // proxy -- proxy for MERN in dev 
    // CRA uses port 3000
    // Express uses port 5000 (at least I use port 5000)
    // CRA server and Express server can't use the same port
    // proxy front-end requests from 3000 to 5000
`
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "proxy": "http://localhost:5000"
}
`

// -----------
//
// -----------


// -----------
//
// -----------


// -----------
//
// -----------


// -----------
//
// -----------


// -----------
//
// -----------


// -----------
//
// -----------


// -----------
//
// -----------


// -----------
//
// -----------


// -----------
//
// -----------


// -----------
//
// -----------


// -----------
//
// -----------


// -----------
//
// -----------


// -----------
//
// -----------


// -----------
//
// -----------


// -----------
//
// -----------


// -----------
//
// -----------


// -----------
//
// -----------


// -----------
//
// -----------


// -----------
//
// -----------


// -----------
//
// -----------


// -----------
//
// -----------


// -----------
//
// -----------


// -----------
//
// -----------


