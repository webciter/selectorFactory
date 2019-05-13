(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define('SelectorFactory', [], function () {
      return (root['SelectorFactory'] = factory());
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require('element-functions-get_css_rules'));
  } else {
    root['SelectorFactory'] = factory();
  }
}(this, function () {

/* selectorFactory.js 1.0.0
 * Copyright © 2019 David Clews
 * MIT Licence.
 */
/**
 * Description
 *
 * @module SelectorFactory
 */
var SelectorFactory = {
  version: '1.0.0'
};

(function (window, document, SelectorFactory) {
    'use strict';
  
    var count = 0, /* the number of selectors created */
          prefix = "_sf"

    ;
  
    /* base62
     * 
     * Convert string to base 64 and reverse
     */
    var base62 = {
    charset: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      .split(''),
    /* encode
     * @param {string} The string to encode to base 62
     * @return {string}
     */
    encode: integer => {
      if (integer === 0) {
        return 0;
      }
      let s = [];
      while (integer > 0) {
        s = [base62.charset[integer % 62], ...s];
        integer = Math.floor(integer / 62);
      }
      return s.join('');
    },
    /* decode
     * @param {string} The string to decode from base 62
     * @return {string}
     */
    decode: chars => chars.split('').reverse().reduce((prev, curr, i) =>
      prev + (base62.charset.indexOf(curr) * (62 ** i)), 0)
    };

  
  /*
   * combine
   * 
   * Combines a group of selectors by extracting the rules.
   * 
   * @param {array} selectors The selectors to combine
   * @returns {promise}
   */
  SelectorFactory.combine = function(selectors = []){
      
        return new Promise(function(resolve, reject){
            

            if(selectors.length < 2){
                throw "You must select at lease two selectors";
            }

            let combinedRules = [];

            for(
                    let i = 0;
                    i<selectors.length;
                    i++){

                /* extract the rules into an array */
                let element = document.createElement("div");
                let selectorName = selectors[i].slice(1);
                let regex = /{(.*)}/

                /* switch on the class or id selector */
                if(selectors[i].charAt(0) === "."){
                    element.classList.add(selectorName);
                }else if(selectors[i].charAt(0) === "#"){
                    element.id = selectors[i];
                }else{
                    /* others are general such as tag selectors */

                }

                /* get the rules from the selector */
                let m;
                if ( m = element.getCSSRules(selectorName)[0].match(regex)) {
                    if(m.length === 2){
                        combinedRules.push(m[1]);
                    }else{
                        throw "Invalid Array length for selector pattern match.";
                    }
                }else{
                    throw "Invalid Data extracted from selector `"+selectors[i]+"`";
                }

            }

            /* increment for name creation */
            count++;

            /* create the name */
            var newSelectorName = nameCreator(selectors);
            
            assignSelector(newSelectorName, combinedRules.join(""));
            resolve({newSelectorName: newSelectorName});
        });

  }
  
  /* 
   * nameCreator
   * 
   * Creates a name based on the selectors that have been combined
   * 
   * @param {array} selectors The selectors to combine
   * @return {string} The class selector name
   */
  let nameCreator = function(selectors = []){
      return "."+prefix+base62.encode(count);
  }
  
  /*
   * assignSelector
   * 
   * Assigns the selector to the document
   * 
   * @param {string} selectorName
   * @param {string} selectorRules
   * @return {Promise}
   */
  let assignSelector = function(selectorName, selectorRules){
      
      /* assign the rules to the first style sheet tag */
      let styleSheetElements = document.getElementsByTagName("style");
      var textNode = document.createTextNode(selectorName+"{"+selectorRules+"}"); // assuming text node creation like this is faster
      styleSheetElements[0].appendChild(textNode);
  }
  
}(window, document, SelectorFactory));

return SelectorFactory;

})); 



