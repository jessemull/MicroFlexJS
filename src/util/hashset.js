/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

"use strict";

// hashset.js

/*--------------------------------- Exports ----------------------------------*/

module.exports = HashSet;

/*------------------------------- Constructor --------------------------------*/

/**
 * This class implements a set data structure. The set is implemented using a
 * simple Javascript object containing key-value pairs. Javascript object property
 * keys must be strings. Therefore, any objects added to the set must have a unique
 * string value provided by the object's toString function. A for...of loop can
 * be used to iterate over the set.
 *
 * @constructor
 * @memberof module:Utilities
 * @author Jesse L. Mull
 * @version Updated February 17, 2016
 * @license Apache License 2.0
 * @see <a href="http://www.jessemull.com" target="_blank">http://www.jessemull.com</a><br>
 * @see <a href="mailto:hello@jessemull.com">hello@jessemull.com</a>
 */
function HashSet() {
   this.values = {};
}

/*------------------------ Functions for adding data -------------------------*/

/**
 * Adds an object to the set if it is not present. If the object is already
 * present the set remains unchanged and the function returns false.
 * @param {Object} value - the value
 * @returns {boolean} true if this set is changed as a result of the call
 */
HashSet.prototype.add = function(value) {

   if(arguments.length != 1) {
      throw new TypeError("Function requires a single argument.");
   }

   if(this.values[value] === undefined) {
      this.values[value] = value;
      return true;
   }

   return false;
}

/**
 * For each value in the array this functions adds the value if it is not already
 * present in the set. Returns false if the set remains unchanged.
 * @param {Object} value - the array of values
 * @returns {boolean} true if this set is changed as a result of the call
 * @throws {TypeError} if the input object is not an array
 */
HashSet.prototype.addAll = function(array) {

   if(arguments.length != 1) {
      throw new TypeError("Function requires a single argument.");
   }

   if(this.getType(array) != '[object Array]') {
      throw new TypeError("Input must be an array.");
   }

   var bool = false;

   for(var value of array) {

      if(this.values[value] === undefined) {
         this.values[value] = value;
         bool = true;
      }

   }

   return bool;
}

/*------------------------ Functions for data lookup -------------------------*/

/**
 * Returns true if the set contains the value.
 * @param {Object} value - the value
 * @returns {boolean} true if the set contains the value
 */
HashSet.prototype.contains = function(value) {

   if(arguments.length != 1) {
      throw new TypeError("Function requires a single argument.");
   }

   return this.values[value] != undefined;
}

/**
 * Returns true if the set contains all of the values in the array.
 * @param {Object[]} array - the array of values
 * @returns {boolean} true if the set contains all the values in the array
 * @throws {TypeError} if the input object is not an array
 */
HashSet.prototype.containsAll = function(array) {

   if(arguments.length != 1) {
      throw new TypeError("Function requires a single argument.");
   }

   if(this.getType(array) != '[object Array]') {
      throw new TypeError("Input must be an array.");
   }

   for(var value in array) {
      if(this.values[value] === undefined) {
         return false;
      };
   }

   return true;
}

/**
 * Returns true if the set is empty.
 * @returns {boolean} true if the set is empty
 */
HashSet.prototype.isEmpty = function() {
   return Object.keys(this.values).length === 0;
}

/*----------------------- Functions for removing data ------------------------*/

/**
 * Removes the value from the set.
 * @param {Object} value - the value
 * @returns {boolean} true if this set is changed as a result of the call
 */
HashSet.prototype.remove = function(value) {

   if(arguments.length != 1) {
      throw new TypeError("Function requires a single argument.");
   }

   if(this.values[value] != undefined) {
      delete this.values[value];
      return true;
   }

   return false;
}

/**
 * For each value in the array this functions removes the value if it is present
 * in the set. Returns false if the set remains unchanged.
 * @param {Object} value - the array of values
 * @returns {boolean} true if this set is changed as a result of the call
 * @throws {TypeError} if the input object is not an array
 */
HashSet.prototype.removeAll = function(array) {

   if(arguments.length != 1) {
      throw new TypeError("Function requires a single argument.");
   }

   if(this.getType(array) != '[object Array]') {
      throw new TypeError("Input must be an array.");
   }

   var bool = false;

   for(var value of array) {

      if(this.values[value] != undefined) {
         delete this.values[value];
         bool = true;
      }

   }

   return bool;
}

/**
 * Clears the set.
 */
HashSet.prototype.clear = function() {
   this.values = {};
}

/*----------------------- Functions for retaining data -----------------------*/

/**
 * Retains the input value if it is present. Clears the set and returns false if
 * the input value is absent.
 * @param {Object} value - the array of values
 * @returns {boolean} true if the value was retained
 */
HashSet.prototype.retain = function(value) {

   if(arguments.length != 1) {
      throw new TypeError("Function requires a single argument.");
   }

   var retained = {};
   var bool = false;

   if(this.values[value] != undefined) {
      retained[value] = this.values[value];
      bool = true;
   }

   this.values = retained;

   return bool;
}

/**
 * For each value in the array this functions retains the value if it is present
 * in the set. Returns false if the set remains unchanged.
 * @param {Object} value - the array of values
 * @returns {boolean} true if this set is changed as a result of the call
 * @throws {TypeError} if the input object is not an array
 */
HashSet.prototype.retainAll = function(array) {

   if(arguments.length != 1) {
      throw new TypeError("Function requires a single argument.");
   }

   if(this.getType(array) != '[object Array]') {
      throw new TypeError("Input must be an array.");
   }

   var bool = false;
   var retained = {};

   for(var value of array) {

      if(this.values[value] != undefined) {
         retained[value] = this.values[value];
         bool = true;
      }

   }

   this.values = retained;

   return bool;
}

/*--------------------------- Additional functions ---------------------------*/

/**
 * Returns the set values as an array.
 * @returns {Object[]} array containing the set values
 */
HashSet.prototype.toArray = function() {

   var array = [];

   for(var value in this.values) {
      array.push(this.values[value]);
   }

   return array;
}

/**
 * Returns the iterator for the objects in the set.
 * @ignore
 */
HashSet.prototype[Symbol.iterator] = function() {

   let index = 0;
   let keys = Object.keys(this.values);

   return {
      next: () => {
          let value = this.values[keys[index]];
          let done = index >= keys.length;
          index++;
          return { value, done };
      }
  };

}

/**
 * Returns the size of the set.
 * @return {number} the set size
 */
HashSet.prototype.size = function() {
   return Object.keys(this.values).length;
}

/**
 * Returns a string containing the object or primitive type.
 * @ignore
 * @param {(Object|number|string|boolean|symbol)} the input to type
 * @returns {string} the type of the input
 */
HashSet.prototype.getType = function(input) {

   if(input === null) {
      return "[object Null]";
   }

   var toReturn = Object.prototype.toString.call(input);

   if(toReturn === '[object Object]') {
      toReturn = '[object ' + input.constructor.name + ']';
   }

   return toReturn;
}
