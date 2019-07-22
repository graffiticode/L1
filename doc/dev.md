## Adding a Function to a Language

### Steps

* Edit ./src/lexicon.js
  * Copy the definition of an existing function name that takes the same number of arguments (e.g. add takes two.)
  * Edit the property name ("add") and the "name" (e.g. "ADD").
* Edit ./src/compile.js
  * Search for the definition of 'table', or the occurance of an existing name (e.g. "ADD".)
  * Copy a row from the table and modify the node name ("ADD") and the function it points to (e.g. "add".)
  * Search for an existing implementation function (e.g. "function add"), copy it and edit the name to
  match the name in the table and the body to implement the intended behavior.
* Edit ./src/viewer.js (optional)
  * If the effect of the new function can be seen in the form view, than edit the viewer code to render
  those effects.
