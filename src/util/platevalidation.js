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

// platevalidation.js

/*--------------------------------- Exports ----------------------------------*/

module.exports = new PlateValidation();

/*------------------------------- Dependencies -------------------------------*/

var Validation = require('./validation');
var WellValidation = require('./wellvalidation');

/*-------------------------------- Constructor -------------------------------*/

/**
 * This class validates plate objects and plate object input.
 *
 * @constructor
 * @memberof module:Utilities
 * @author Jesse L. Mull
 * @version Updated February 17, 2016
 * @license Apache License 2.0
 * @see <a href="http://www.jessemull.com" target="_blank">http://www.jessemull.com</a><br>
 * @see <a href="mailto:hello@jessemull.com">hello@jessemull.com</a>
 */
function PlateValidation() {

   /* Flags for standard plate types */

   this.PLATE_6WELL = 0;
   this.PLATE_12WELL = 1;
   this.PLATE_24WELL = 2;
   this.PLATE_48WELL = 3;
   this.PLATE_96WELL = 4;
   this.PLATE_384WELL = 5;
   this.PLATE_1536WELL = 6;
   this.PLATE_CUSTOM = -1;

   /* Flags for standard row numbers */

   this.ROWS_6WELL = 2;
   this.ROWS_12WELL = 3;
   this.ROWS_24WELL = 4;
   this.ROWS_48WELL = 6;
   this.ROWS_96WELL = 8;
   this.ROWS_384WELL = 16;
   this.ROWS_1536WELL = 32;

   /* Flags for standard column numbers */

   this.COLUMNS_6WELL = 3;
   this.COLUMNS_12WELL = 4;
   this.COLUMNS_24WELL = 6;
   this.COLUMNS_48WELL = 8;
   this.COLUMNS_96WELL = 12;
   this.COLUMNS_384WELL = 24;
   this.COLUMNS_1536WELL = 48;
};

/*------------------- Functions for Validating Plate Types -------------------*/

/**
 * Validates a plate type and returns the number of rows and columns.
 * @param {number} type - the plate type
 * @returns {Object} the parsed number of rows and columns
 * @throws {TypeError} on invalid plate type input
 */
PlateValidation.prototype.validatePlateType = function(type) {

   Validation.validateArguments(arguments.length, PlateValidation.prototype.validatePlateType.length, "PlateValidation.prototype.validatePlateType");

   if(this.getType(type) != '[object Number]') {
      throw new TypeError("The plate type must be a number: " + type);
   }

   var toReturn = {};

   switch(type) {

      case this.PLATE_6WELL:    toReturn.rows = this.ROWS_6WELL;
                                toReturn.columns = this.COLUMNS_6WELL;;
                                break;

      case this.PLATE_12WELL:   toReturn.rows = this.ROWS_12WELL;
                                toReturn.columns = this.COLUMNS_12WELL;;
                                break;

      case this.PLATE_24WELL:   toReturn.rows = this.ROWS_24WELL;
                                toReturn.columns = this.COLUMNS_24WELL;;
                                break;

      case this.PLATE_48WELL:   toReturn.rows = this.ROWS_48WELL;
                                toReturn.columns = this.COLUMNS_48WELL;;
                                break;

      case this.PLATE_96WELL:   toReturn.rows = this.ROWS_96WELL;
                                toReturn.columns = this.COLUMNS_96WELL;;
                                break;

      case this.PLATE_384WELL:  toReturn.rows = this.ROWS_384WELL;
                                toReturn.columns = this.COLUMNS_384WELL;;
                                break;

      case this.PLATE_1536WELL: toReturn.rows = this.ROWS_1536WELL;
                                toReturn.columns = this.COLUMNS_1536WELL;;
                                break;

      case this.PLATE_CUSTOM:   toReturn.rows = -1;
                                toReturn.columns = -1;
                                break;

      default: throw new TypeError("Invalid plate type: " + type);

   }

   return toReturn;
}

/**
 * Returns the plate type or -1 for custom dimensions.
 * @param {number} rows - the number of rows
 * @param {number} columns - the number of columns
 * @returns {number} the plate type
 */
PlateValidation.prototype.plateType = function(rows, columns) {

   Validation.validateArguments(arguments.length, PlateValidation.prototype.plateType.length, "PlateValidation.prototype.plateType");

   if(rows === this.ROWS_6WELL && columns === this.COLUMNS_6WELL) {
      return this.PLATE_6WELL;
   }

   if(rows === this.ROWS_12WELL && columns === this.COLUMNS_12WELL) {
      return this.PLATE_12WELL;
   }

   if(rows === this.ROWS_24WELL && columns === this.COLUMNS_24WELL) {
      return this.PLATE_24WELL;
   }

   if(rows === this.ROWS_48WELL && columns === this.COLUMNS_48WELL) {
      return this.PLATE_48WELL;
   }

   if(rows === this.ROWS_96WELL && columns === this.COLUMNS_96WELL) {
      return this.PLATE_96WELL;
   }

   if(rows === this.ROWS_384WELL && columns === this.COLUMNS_384WELL) {
      return this.PLATE_384WELL;
   }

   if(rows === this.ROWS_1536WELL && columns === this.COLUMNS_1536WELL) {
      return this.PLATE_1536WELL;
   }

   return -1;
}

/*---------------------- Functions for Validating Wells ----------------------*/

/**
 * Validates a well. Enforces valid row and column indices.
 * @param {Well} well - the well
 * @param {number} rows - the maximum valid row number
 * @param {number} columns - the maximum valid column number
 * @throws {TypeError} on invalid well input
 */
PlateValidation.prototype.validateWell = function(well, rows, columns) {

   Validation.validateArguments(arguments.length, PlateValidation.prototype.validateWell.length, "PlateValidation.prototype.validateWell");

   if(this.getType(well) != '[object Well]') {
      throw new TypeError("The input value must be a well object: " + well);
   }

   if(this.getType(rows) != '[object Number]') {
      throw new TypeError("The row number must be a numerical type: " + rows);
   }

   if(this.getType(columns) != '[object Number]') {
      throw new TypeError("The column number must be a numerical type: " + columns);
   }

   WellValidation.validateWell(well);

   if(well.row > rows) {
      throw new TypeError("Row index out of range: " + well.toString());
   }

   if(well.column > columns) {
      throw new TypeError("Column index out of range: " + well.toString());
   }

}

/**
 * Validates an array of wells. Enforces valid row and column indices.
 * @param {Well[]} array - the array of wells
 * @param {number} rows - the maximum valid row number
 * @param {number} columns - the maximum valid column number
 * @throws {TypeError} on invalid well input
 */
PlateValidation.prototype.validateWellArray = function(array, rows, columns) {

   Validation.validateArguments(arguments.length, PlateValidation.prototype.validateWellArray.length, "PlateValidation.prototype.vaidateWellArray");

   if(this.getType(array) != '[object Array]') {
      throw new TypeError("Object is not an array: " + array);
   }

   for(var well of array) {
      this.validateWell(well, rows, columns);
   }

}

/*------------------- Functions for Validating Well Groups -------------------*/

/**
 * Validates a well group. Enforces valid row and column indices.
 * @param {WellGroup} group - the group
 * @param {number} rows - the maximum valid row number
 * @param {number} columns - the maximum valid column number
 * @throws {TypeError} on invalid well group input
 */
PlateValidation.prototype.validateGroup = function(group, rows, columns) {

   Validation.validateArguments(arguments.length, PlateValidation.prototype.validateGroup.length, "PlateValidation.prototype.validateGroup");

   if(this.getType(group) != '[object WellGroup]') {
      throw new TypeError("The group must be a well group object: " + group);
   }

   if(this.getType(group.groupName) != '[object String]') {
      throw new TypeError("The group label must be a string: " + group.name);
   }

   if(this.getType(group.wells) != '[object TypedHashSet]' || group.wells.type != 'String') {
      throw new TypeError("The group wells must be a typed set of index strings: " + group.wells);
   }

   for(var well of group) {

      var parsed = WellValidation.validateWellIndex(well);

      if(arguments.length > 1) {

         if(parsed.row > rows) {
            throw new TypeError("Row index out of range: " + well.toString());
         }

         if(parsed.column > columns) {
            throw new TypeError("Column index out of range: " + well.toString());
         }
      }

   }

}

/**
 * Validates an array of well groups. Enforces valid column and row numbers.
 * @param {WellGroup[]} array - the array of groups
 * @param {number} rows - the maximum valid row number
 * @param {number} columns - the maximum valid column number
 * @throws {TypeError} on invalid well group input
 */
PlateValidation.prototype.validateGroupArray = function(array, rows, columns) {

   Validation.validateArguments(arguments.length, PlateValidation.prototype.validateGroupArray.length, "PlateValidation.prototype.validateGroupArray");

   if(this.getType(array) != '[object Array]') {
      throw new TypeError("The group must be a group object: " + array);
   }

   if(this.getType(rows) != '[object Number]') {
      throw new TypeError("The row number must be a numerical type: " + rows);
   }

   if(this.getType(columns) != '[object Number]') {
      throw new TypeError("The column number must be a numerical type: " + columns);
   }

   for(var group of array) {
      this.validateGroup(group, rows, columns);
   }

}

/*-------------------- Functions for Validating Well Sets --------------------*/

/**
 * Validates a well set. Enforces valid row and column indices.
 * @param {WellSet} set - the well set
 * @param {number} rows - the maximum valid row number
 * @param {number} columns - the maximum valid column number
 * @throws {TypeError} on invalid well set input
 */
PlateValidation.prototype.validateWellSet = function(set, rows, columns) {

   Validation.validateArguments(arguments.length, PlateValidation.prototype.validateWellSet.length, "PlateValidation.prototype.validateWellSet");

   if(this.getType(set) != '[object WellSet]' && this.getType(set) != '[object Plate]') {
      throw new TypeError("Object is not a well set: " + set);
   }

   if(this.getType(set.wells) != '[object TypedHashSet]' || set.wells.type != 'Well') {
      throw new TypeError("Invalid well set. The wells property must be a typed hash set of wells: " + set.wells);
   }

   if(this.getType(set.name) != '[object String]') {
      throw new TypeError("Invalid well set. The set label must be a string: " + set.name);
   }

   for(var well of set) {
      this.validateWell(well, rows, columns);
   }

}

/**
 * Validates an array of well sets. Enforces valid row and column indices.
 * @param {WellSet[]} array - the array of well sets
 * @param {number} rows - the maximum valid row number
 * @param {number} columns - the maximum valid column number
 * @throws {TypeError} on invalid well set input
 */
PlateValidation.prototype.validateWellSetArray = function(array, rows, columns) {

   Validation.validateArguments(arguments.length, PlateValidation.prototype.validateWellSetArray.length, "PlateValidation.prototype.validateWellSetArray");

   if(this.getType(array) != '[object Array]') {
      throw new TypeError("The well set array must be an array object: " + plates);
   }

   for(var set of array) {
      this.validateWellSet(set, rows, columns);
   }

}

/*---------------------- Functions for Validating Plates ---------------------*/

/**
 * Validates a plate. Enforces valid row and column indices.
 * @param {Plate} plate - the plate
 * @param {number} rows - the maximum valid row number
 * @param {number} columns - the maximum valid column number
 * @throws {TypeError} on invalid plate input
 */
PlateValidation.prototype.validatePlate = function(plate, rows, columns) {

   Validation.validateArguments(arguments.length, PlateValidation.prototype.validatePlate.length, "PlateValidation.prototype.validatePlate");

   if(this.getType(plate) != '[object Plate]') {
      throw new TypeError("The input value must be a plate object: " + plate);
   }

   if(this.getType(plate.groups) != '[object TypedHashSet]' || plate.groups.type != 'WellGroup') {
      throw new TypeError("Invalid group set. The groups property must be a typed hash set of well groups: " + plate.groups);
   }

   if(this.getType(plate.plateType) != '[object Number]') {
      throw new TypeError("Invalid plate type. The plate type must be a number: " + plate.plateType);
   }

   if(this.getType(plate.rows) != '[object Number]') {
      throw new TypeError("Invalid row number. The row number must be a numerical type: " + plate.rows);
   }

   if(this.getType(plate.columns) != '[object Number]') {
      throw new TypeError("Invalid column number. The column number must be a numerical type: " + plate.columns);
   }

   if(plate.rows != rows) {
      throw new TypeError("Plate is outside the valid row number: " + plate);
   }

   if(plate.columns != columns) {
      throw new TypeError("Plate is outside the valid column number: " + plate);
   }

   this.validatePlateType(plate.plateType);
   Validation.validatePositiveNumber(rows);
   Validation.validatePositiveNumber(columns);
   Validation.validateString(plate.name);
   this.validateWellSet(plate, rows, columns);

   var groupsArray = plate.groups.toArray();
   this.validateGroupArray(groupsArray, rows, columns);
}

/**
 * Validates an array of plates. Enforces valid row and column indices.
 * @param {Plate[]} array - the array of plates
 * @param {number} rows - the maximum valid row number
 * @param {number} columns - the maximum valid column number
 * @throws {TypeError} on invalid plate input
 */
PlateValidation.prototype.validatePlateArray = function(array, rows, columns) {

   Validation.validateArguments(arguments.length, PlateValidation.prototype.validatePlateArray.length, "PlateValidation.prototype.validatePlateArray");

   if(this.getType(array) != '[object Array]') {
      throw new TypeError("The plate array must be an array object: " + array);
   }

   if(this.getType(rows) != '[object Number]') {
      throw new TypeError("Invalid input plate. Plate row number must be a numerical type: " + rows);
   }

   if(this.getType(columns) != '[object Number]') {
      throw new TypeError("Invalid input plate. Plate column number must be a numerical type: " + columns);
   }

   for(var plate of array) {
      this.validatePlate(plate, rows, columns);
   }

}

/*---------------------- Functions for Validating Stacks ---------------------*/

/**
 * Validates a stack. Enforces valid row and column indices.
 * @param {Stack} stack - the stack
 * @param {number} rows - the maximum valid row number
 * @param {number} columns - the maximum valid column number
 * @throws {TypeError} on invalid plate input
 */
PlateValidation.prototype.validateStack = function(stack, rows, columns) {

   Validation.validateArguments(arguments.length, PlateValidation.prototype.validateStack.length, "PlateValidation.prototype.validateStack");

   if(this.getType(stack) != '[object Stack]') {
      throw new TypeError("The input stack must be a stack object: " + stack);
   }

   if(this.getType(stack.rows) != '[object Number]') {
      throw new TypeError("Invalid input stack. Stack row number must be a numerical type: " + stack.rows);
   }

   if(this.getType(stack.columns) != '[object Number]') {
      throw new TypeError("Invalid input stack. Stack column number must be a numerical type: " + stack.columns);
   }

   if(this.getType(stack.plateType) != '[object Number]') {
      throw new TypeError("Invalid input stack. Stack plate type must be a numerical type: " + stack.plateType);
   }

   if(this.getType(stack.name) != '[object String]') {
      throw new TypeError("Invalid input stack. Stack name must be a string: " + stack.name);
   }

   if(this.getType(stack.plates) != '[object TypedHashSet]' || stack.plates.type != 'Plate') {
      throw new TypeError("Invalid input stack. Stack plates property must be a typed hash set of type plate: " + stack.plates);
   }

   for(var plate of stack) {
      this.validatePlate(plate, rows, columns);
   }

}

/*----------------------------- Helper Functions -----------------------------*/

/**
 * Returns a string containing the object or primitive type.
 * @param {(Object|number|string|boolean|symbol)} input - the input to type
 * @returns {string} the type of the input
 */
PlateValidation.prototype.getType = function(input) {

   if(input === null) {
      return "[object Null]";
   }

   var toReturn = Object.prototype.toString.call(input);

   if(toReturn === '[object Object]') {
      toReturn = '[object ' + input.constructor.name + ']';
   }

   return toReturn;
}
