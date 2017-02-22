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

// validation.js

/*--------------------------------- Exports ----------------------------------*/

module.exports = new Validation();

/*-------------------------------- Constructor -------------------------------*/

/**
 * This class validates array indices, numerical ranges, strings, integers, float
 * values and function argument lengths.
 *
 * @constructor
 * @memberof module:Utilities
 * @author Jesse L. Mull
 * @version Updated February 17, 2016
 * @license Apache License 2.0
 * @see <a href="http://www.jessemull.com" target="_blank">http://www.jessemull.com</a><br>
 * @see <a href="mailto:hello@jessemull.com">hello@jessemull.com</a>
 */
function Validation() {};

/*---------------- Functions for Validating Function Arguments ---------------*/

/**
 * Validates the number of arguments passed to a function.
 * @param {number} numArgs - number of input arguments
 * @param {number} argsLength - number of required arguments
 * @param {string} name - function name
 * @throws {TypeError} on invalid argument number
 */
Validation.prototype.validateArguments = function(numArgs, argsLength, name) {

   var argument = argsLength === 1 ? " argument." : " arguments.";

   if(numArgs != argsLength) {
      throw new TypeError("Function " + name + " requires " + argsLength + argument);
   }
}

/**
 * Validates the number of arguments passed to a function.
 * @param {number} numArgs - number of input arguments
 * @param {number} argsLength - maximum number of arguments
 * @param {string} name - function name
 * @throws {TypeError} on invalid argument number
 */
Validation.prototype.validateArgumentMaximum = function(numArgs, argsLength, name) {
   if(numArgs > argsLength) {
      throw new TypeError("Maximum number of arguments for " + name + " is " + maxLength);
   }
}

/**
 * Validates the number of arguments passed to a function.
 * @param {number} numArgs - number of input arguments
 * @param {number} argsLength - minimum number of arguments
 * @param {string} name - function name
 * @throws {TypeError} on invalid argument number
 */
Validation.prototype.validateArgumentMinimum = function(numArgs, argsLength, name) {
   if(numArgs < argsLength) {
      throw new TypeError("Minimum number of arguments for " + name + " is " + argsLength);
   }
}

/**
 * Validates the number of arguments passed to a function.
 * @param {number} numArgs - number of input arguments
 * @param {number} minLength - minimum number of arguments
 * @param {number} maxLength - maximum number of arguments
 * @param {string} name - function name
 * @throws {TypeError} on invalid argument number
 */
Validation.prototype.validateArgumentRange = function(numArgs, minLength, maxLength, name) {

   if(numArgs > maxLength) {
      throw new TypeError("Maximum number of arguments for " + name + " is " + maxLength);
   }

   if(numArgs < minLength) {
      throw new TypeError("Minimum number of arguments for " + name + " is " + minLength);
   }

}

/*--------------------- Functions for Validating Ranges ----------------------*/

/**
 * Validates a range of numbers.
 * @param {number} begin - beginning index
 * @param {number} end - ending index
 * @throws {TypeError} on invalid range
 */
Validation.prototype.validateRange = function(begin, end) {

   if(this.getType(begin) != '[object Number]') {
      throw new TypeError("Invalid range. Beginning index must be a number: " + begin);
   }

   if(this.getType(end) != '[object Number]') {
      throw new TypeError("Invalid range. Ending index must be a number: " + end);
   }

   if(begin > end) {
      throw new TypeError("Invalid range. Beginning index must be greater than ending index.");
   }

}

/**
 * Validates a positive range of numbers.
 * @param {number} begin - beginning index
 * @param {number} end - ending index
 * @throws {TypeError} on invalid range
 */
Validation.prototype.validatePositiveRange = function(begin, end) {

   this.validateRange(begin, end);

   if(begin < 0) {
      throw new TypeError("Invalid range. Beginning index must be positive: " + begin);
   }

   if(end < 0) {
      throw new TypeError("Invalid range. Ending index must be positive: " + end);
   }
}

/**
 * Validates array indices.
 * @param {number} begin - beginning index
 * @param {number} end - ending index
 * @param {number} length - maximum length of range
 * @throws {TypeError} on invalid range
 */
Validation.prototype.validateArrayRange = function(begin, end, length) {

   this.validatePositiveRange(begin, end);

   if(length < 0) {
      throw new TypeError("Invalid range. Length must be a positive value: " + length);
   }

   if(begin >= length) {
      throw new TypeError("Invalid range. Beginning index out of range: " + begin);
   }

   if(end >= length) {
      throw new TypeError("Invalid range. Ending index out of range: " + end);
   }

}

/*-------------------- Functions for Validating Integers ---------------------*/

/**
 * Validates positive numbers.
 * @param {number} number - input value
 * @throws {TypeError} on invalid value
 */
Validation.prototype.validatePositiveNumber = function(number) {
   if(number < 0) {
      throw new TypeError("Value must be positive: " + number);
   }
}

/**
 * Validates negative numbers.
 * @param {number} number - input value
 * @throws {TypeError} on invalid value
 */
Validation.prototype.validateNegativeNumber = function(number) {
   if(number > -1) {
      throw new TypeError("Value must be negative: " + number);
   }
}

/*--------------------- Functions for Validating Strings ---------------------*/

/**
 * Validates a string.
 * @param {string} string - input string
 * @throws {TypeError} on invalid string
 */
Validation.prototype.validateString = function(string) {
   if(this.getType(string) != '[object String]') {
      throw new TypeError("The label must be a string: " + string);
   }
}

/*------------------- Functions for Validating Object Types ------------------*/

/**
 * Returns a string containing the object or primitive type.
 * @param {(Object|number|string|boolean|symbol)} input - the input to type
 * @returns {string} the type of the input
 */
Validation.prototype.getType = function(input) {

   if(input === null) {
      return "[object Null]";
   }

   var toReturn = Object.prototype.toString.call(input);

   if(toReturn === '[object Object]') {
      toReturn = '[object ' + input.constructor.name + ']';
   }

   return toReturn;
}
