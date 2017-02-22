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

// typedhashset.js

/*--------------------------------- Exports ----------------------------------*/

module.exports = TypedHashSet;

/*------------------------------- Dependencies -------------------------------*/

var HashSet = require('./hashset');

/*------------------------------- Constructor --------------------------------*/

/**
 * This class implements a typed set data structure. The set is implemented using a
 * simple Javascript object containing key-value pairs. Javascript object property
 * keys must be strings. Therefore, any objects added to the set must have a unique
 * string value provided by the object's toString function. A for...of loop can be
 * used to iterate over the set.
 *
 * <br><br>
 *
 * The set type is passed as a string parameter to the conslructor and enforced
 * by comparing the type string of the set input to the value returned by
 * Object.prototype.toString.call for objects and Object.prototype.constructor.name
 * for primitive values.
 *
 * <br>
 *
 * @constructor
 * @memberof module:Utilities
 * @author Jesse L. Mull
 * @version Updated February 17, 2016
 * @license Apache License 2.0
 * @see <a href="http://www.jessemull.com" target="_blank">http://www.jessemull.com</a><br>
 * @see <a href="mailto:hello@jessemull.com">hello@jessemull.com</a>
 * @param {string} type - the set type
 * @throws {TypeError} on invalid type string input
 */
function TypedHashSet(type) {

   if(arguments.length != 1) {
      throw new TypeError("The constructor requires a single argument.");
   }

   if(this.getType(type) != '[object String]') {
      throw new TypeError("The type parameter must be a string.");
   }

   HashSet.call(this);
   this.type = type;
}

TypedHashSet.prototype = new HashSet();
TypedHashSet.prototype.constructor = TypedHashSet;

/*------------------------ Functions for adding data -------------------------*/

/**
 * Adds an object to the set if it is not present. If the object is already
 * present the set remains unchanged and the function returns false.
 * @param {Object} value - the value
 * @returns {boolean} true if this set is changed as a result of the call
 * @augments HashSet.prototype.add
 * @throws {TypeError} on invalid input type
 */
TypedHashSet.prototype.add = function(value) {

   if(arguments.length != 1) {
      throw new TypeError("Function requires a single argument.");
   }

   if(value.constructor.name != this.type) {
      throw new TypeError("Invalid input value: " + value + ". Input value must be of the type: " + this.type + ".");
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
 * @param {Object[]} array - the array of values
 * @returns {boolean} true if this set is changed as a result of the call
 * @augments HashSet.prototype.addAll
 * @throws {TypeError} on invalid input type
 */
TypedHashSet.prototype.addAll = function(array) {

   if(arguments.length != 1) {
      throw new TypeError("Function requires a single argument.");
   }

   if(this.getType(array) != '[object Array]') {
      throw new TypeError("Input must be an array.");
   }

   for(var value of array) {
      if(value.constructor.name != this.type) {
         throw new TypeError("Invalid input value: " + value + ". Input value must be of the type: " + this.type + ".");
      }
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
 * @param {Object|string} value - the value
 * @returns {boolean} true if the set contains the value
 * @augments HashSet.prototype.contains
 * @throws {TypeError} on invalid input type
 */
TypedHashSet.prototype.contains = function(value) {

   if(arguments.length != 1) {
      throw new TypeError("Function requires a single argument.");
   }

   if(value.constructor.name != this.type && this.getType(value) != '[object String]') {
      throw new TypeError("Invalid input value: " + value + ". Input value must be a string or an object of type: " + this.type + ".");
   }

   return this.values[value] != undefined;
}

/**
 * Returns true if the set contains all of the values in the array.
 * @param {Object[]|string[]} array - the array of values
 * @returns {boolean} true if the set contains all the values in the array
 * @augments HashSet.prototype.containsAll
 * @throws {TypeError} on invalid input type
 */
TypedHashSet.prototype.containsAll = function(array) {

   if(arguments.length != 1) {
      throw new TypeError("Function requires a single argument.");
   }

   if(this.getType(array) != '[object Array]') {
      throw new TypeError("Input must be an array.");
   }

   for(var value of array) {
      if(value.constructor.name != this.type && this.getType(value) != '[object String]') {
         throw new TypeError("Invalid input value: " + value + ". Input value must be a string or an object of type: " + this.type + ".");
      }
   }

   for(var value of array) {
      if(this.values[value] === undefined) {
         return false;
      };
   }

   return true;
}

/*----------------------- Functions for removing data ------------------------*/

/**
 * Removes the value from the set.
 * @param {Object|string} value - the value
 * @returns {boolean} true if this set is changed as a result of the call
 * @augments HashSet.prototype.remove
 * @throws {TypeError} on invalid input type
 */
TypedHashSet.prototype.remove = function(value) {

   if(arguments.length != 1) {
      throw new TypeError("Function requires a single argument.");
   }

   if(value.constructor.name != this.type && this.getType(value) != '[object String]') {
      throw new TypeError("Invalid input value: " + value + ". Input value must be a string or an object of type: " + this.type + ".");
   }

   if(this.values[value] != undefined) {
      delete this.values[value];
      return true;
   }

   return false;
}

/**
 * For each value in the array this functions remove the value if it is present
 * in the set. Returns false if the set remains unchanged.
 * @param {Object[]|string[]} array - the array of values
 * @returns {boolean} true if this set is changed as a result of the call
 * @augments HashSet.prototype.removeAll
 * @throws {TypeError} on invalid input type
 */
TypedHashSet.prototype.removeAll = function(array) {

   if(arguments.length != 1) {
      throw new TypeError("Function requires a single argument.");
   }

   if(this.getType(array) != '[object Array]') {
      throw new TypeError("Input must be an array.");
   }

   for(var value of array) {
      if(value.constructor.name != this.type && this.getType(value) != '[object String]') {
         throw new TypeError("Invalid input value: " + value + ". Input value must be a string or an object of type: " + this.type + ".");
      }
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

/*----------------------- Functions for retaining data -----------------------*/

/**
 * Retains the input value if it is present. Clears the set and returns false if
 * the input value is absent.
 * @param {Object|string} value - the value
 * @returns {boolean} true if the value was retained
 * @augments HashSet.prototype.add
 * @throws {TypeError} on invalid input type
 */
TypedHashSet.prototype.retain = function(value) {

   if(arguments.length != 1) {
      throw new TypeError("Function requires a single argument.");
   }

   if(value.constructor.name != this.type && this.getType(value) != '[object String]') {
      throw new TypeError("Invalid input value: " + value + ". Input value must be a string or an object of type: " + this.type + ".");
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
 * in the set. Returns true if all values in the input array are retained.
 * @param {Object[]|string[]} array - the array of values
 * @returns {boolean} true if the values in the array were retained
 * @augments HashSet.prototype.add
 * @throws {TypeError} on invalid input type
 */
TypedHashSet.prototype.retainAll = function(array) {

   if(arguments.length != 1) {
      throw new TypeError("Function requires a single argument.");
   }

   if(this.getType(array) != '[object Array]') {
      throw new TypeError("Input must be an array.");
   }

   for(var value of array) {
      if(value.constructor.name != this.type && this.getType(value) != '[object String]') {
         throw new TypeError("Invalid input value: " + value + ". Input value must be a string or an object of type: " + this.type + ".");
      }
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
