# selectorFactory
Combine class and id selector rule to create a new class selector.

A simple module to combine two or more selectors into a single selector and return the selector of the new class. This could be used to reduce the amount of classes applied to a element, or to create a random class name on each page load to make it more difficult for aggregators.

<h2>Require</h2>

<pre>
window.selectorFactory = require("selector_factory");
</pre>

<h2>Installation</h2>

<pre>
npm i selector_factory
</pre>

Combine
<pre>
window.selectorFactory.combine([".text-primary",".bg-primary"]).then(function(data){
   data.newSelectorName; // holds the newly created class name
});  
</pre>
