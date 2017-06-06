EEA Web Form Build Info
========================

---------------------------------
Getting Started / Serup
---------------------------------
- cd /dev directory
- (once only) npm install


---------------------------------
Repackage .js ([webFormName].webform.js) and .css ([webFormName].webform.css)  files
---------------------------------
- npm run build 
  look in directory dev/dist for minified versions of [webFormName].webform.js and [webFormName].webform.css

---------------------------------
Deploy  .js ([webFormName].webform.js) and .css ([webFormName].webform.css)  files
---------------------------------
- npm run deploy
  *overwrites  [webFormName].webform.min.js and [webFormName].webform.min.css

---------------------------------
Repackage all including Components
---------------------------------
- npm run buildall 
  look in directory dev/dist for minified versions of [webFormName].webform.js and [webFormName].webform.css and in dev/dist/assets for Components

  