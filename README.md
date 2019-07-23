# AstroStore
A personal bookmark manager built with React, Node, &amp; MongoDB.  

## Introduction
Firstly, this repo contains the app as hosted on Google's App Engine. Full development history can be found in 'OnMyMark'.  AstroStore differentiates itself from other bookmark managers with its simple, whimsical interface.  

I designed the app so I could access my bookmarks from any browser at any time, without depending one browser's proprietary sync tools.  The app doesn't require any information from users besides a unique username and password--which is encrypted and securely stored in a Mongo NoSQL database.  

## Upcoming Features & Fixes
- Allow rearrangement of collections and bookmarks.
- Allow users to delete their accounts and data.
- Night mode  

## Technologies
- React w/ React Hooks.
  - I initially built the app with class components, but updated it with hooks to improve data congruency between dropdowns, collection lists, and favorites list.  
- Node server w/ Express framework
- REST APIs
- MongoDB  
- Google Cloud App Engine  

## Design Credits
  - Buttons: react-awesome-button 
        https://github.com/rcaferati/react-awesome-button
  - Dialogs & Input Fields: Material UI 
        https://material-ui.com/
  - Icons: Purchased licenses through FlatIcon. 
        https://www.flaticon.com/packs/space-90
