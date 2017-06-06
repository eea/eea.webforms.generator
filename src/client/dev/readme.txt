EEA Web Form Build Info
========================

---------------------------------
Getting Started / Setup
---------------------------------
- cd /dev directory
- *(once only) npm install



*********************************
 Test Info
**********************************
---------------------------------
Lint test
---------------------------------
- npm run lint 

---------------------------------
WCAG-2 accessibility test
---------------------------------
- *(once only) edit URL_TO_TEST variable in dev/test.js file  
- npm test
  


*********************************
 BUILD Info
**********************************
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

