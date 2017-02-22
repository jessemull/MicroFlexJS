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

// wellvalidation.js

/*--------------------------------- Exports ----------------------------------*/

module.exports = new WellValidation();

/*-------------------------------- Constructor -------------------------------*/

/**
 * This class validates well objects and well object input.
 *
 * @constructor
 * @memberof module:Utilities
 * @author Jesse L. Mull
 * @version Updated February 17, 2016
 * @license Apache License 2.0
 * @see <a href="http://www.jessemull.com" target="_blank">http://www.jessemull.com</a><br>
 * @see <a href="mailto:hello@jessemull.com">hello@jessemull.com</a>
 */
function WellValidation() {
   this.base = 26;
};

/*---------------------- Functions for Validating Wells ----------------------*/

/**
 * Validates a well.
 * @param {Well} well - input well
 * @throws {TypeError} on invalid well input
 */
WellValidation.prototype.validateWell = function(well) {

   if(this.getType(well) != '[object Well]') {
      throw new TypeError("Object is not a well: " + well);
   }

   this.validateWellData(well.data);
   this.validateRowInteger(well.row);
   this.validateColumn(well.column);

}

/**
 * Validates a well data array.
 * @param {number[]} data - well data
 * @throws {TypeError} on invalid well data input
 */
WellValidation.prototype.validateWellData = function(data) {

   if(this.getType(data) != '[object Array]') {
      throw new TypeError("Invalid data. Data must be an array: " + data);
   }

   for(var i = 0; i < data.length; i++) {
      if(this.getType(data[i]) != '[object Number]') {
         throw new TypeError("Invalid data. Data array contains a non-numerical type: " + data);
      }
   }

}

/**
 * Validates and parses a well index.
 * @param {string} index - well index
 * @returns {Object} parsed row/column pair
 * @throws {TypeError} on invalid well index input
 */
WellValidation.prototype.validateWellIndex = function(index) {

   if(this.getType(index) != '[object String]') {
      throw new TypeError("Invalid index. Index must be a string: " + index);
   }

   var indexArray = index.match(/(^[a-zA-Z]+)([0-9]+$)/);
   var parsed = {};

   if(indexArray != null && indexArray.length === 3) {

      parsed.row = this.parseRow(indexArray[1]);
      parsed.column = parseFloat(indexArray[2]);

      if(parsed.column < 1) {
         throw new TypeError("Invalid index. Column must be greater than one: " + index);
      }

   } else {
      throw new TypeError("Invalid index. Index must match pattern [a-zA-Z]+[0-9]+: " + index);
   }

   return parsed;
}

/*----------------------- Functions for Validating Rows ----------------------*/

/**
 * Validates a row number or string.
 * @param {number|string} row - input row
 * @returns {number} the validated row number
 * @throws {TypeError} on invalid row input
 */
WellValidation.prototype.validateRow = function(row) {

   if(this.getType(row) === '[object Number]') {
      return this.validateRowInteger(row);
   }

   if(this.getType(row) === '[object String]') {
      return this.validateRowString(row);
   }

   throw new TypeError("The row value must be a well index string or a row number: " + row);
}

/**
 * Validates a well row index.
 * @param {number} row - row index
 * @throws {TypeError} on invalid row index input
 */
WellValidation.prototype.validateRowInteger = function(row) {

   if(this.getType(row) != '[object Number]') {
      throw new TypeError("Invalid row. Row must be a number: " + row);
   }

   if(row < 0) {
      throw new TypeError("Invalid row. Row must be positive: " + row);
   }

   return row;
}

/**
 * Validates a well row string.
 * @param {string} rowString - row string
 * @returns {number} the validated row number
 * @throws {TypeError} on invalid row string input
 */
WellValidation.prototype.validateRowString = function(rowString) {

   if(this.getType(rowString) != '[object String]') {
      throw new TypeError("Well index must be a string: " + rowString)
   }

   var parsed = this.parseRow(rowString);

   if(!parsed) {
      throw new TypeError("Invalid row string: " + rowString);
   }

   return parsed;
}

/**
 * Parses a row string and returns the corresponding row number.
 * @param {string}  rowString - row string
 * @returns {number} the row index as an integer
 * @throws {TypeError} on invalid row string input
 */
WellValidation.prototype.parseRow = function(rowString) {

   if(this.getType(rowString) != '[object String]') {
      throw new TypeError("The row must be a string: " + rowString);
   }

   var baseIndex = 1;
   var rowInt = rowString.charCodeAt(rowString.length - 1) - 65;

   for(var i = rowString.length - 2; i >= 0; i--) {
     rowInt += (rowString.charCodeAt(i) - 65 + 1) * Math.pow(26, baseIndex++);
   }

   return rowInt;
}

/*--------------------- Functions for Validating Columns ---------------------*/

/**
 * Validates a well column.
 * @param {column} column - input column
 * @throws {TypeError} on invalid column input
 */
WellValidation.prototype.validateColumn = function(column) {

   if(this.getType(column) != '[object Number]') {
      throw new TypeError("Invalid column. Column must be a number: " + column);
   }

   if(column < 1) {
      throw new TypeError("Invalid column. Column must be greater than zero: " + column);
   }
}

/*----------------------------- Helper Functions -----------------------------*/

/**
 * Returns a string containing the object or primitive type.
 * @param {(Object|number|string|boolean|symbol)} input to type
 * @returns {string} type of the input
 */
WellValidation.prototype.getType = function(input) {

   if(input === null) {
      return "[object Null]";
   }

   var toReturn = Object.prototype.toString.call(input);

   if(toReturn === '[object Object]') {
      toReturn = '[object ' + input.constructor.name + ']';
   }

   return toReturn;
}
