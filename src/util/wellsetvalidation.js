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

// wellsetvalidation.js

/*------------------------------- Dependencies -------------------------------*/

var Validation = require('./validation');
var WellValidation = require('./wellvalidation');

/*--------------------------------- Exports ----------------------------------*/

module.exports = new WellSetValidation();

/*-------------------------------- Constructor -------------------------------*/

/**
 * This class validates well set objects and well set object input.
 *
 * @constructor
 * @memberof module:Utilities
 * @author Jesse L. Mull
 * @version Updated February 17, 2016
 * @license Apache License 2.0
 * @see <a href="http://www.jessemull.com" target="_blank">http://www.jessemull.com</a><br>
 * @see <a href="mailto:hello@jessemull.com">hello@jessemull.com</a>
 */
function WellSetValidation() {};

/*---------------------- Functions for Validating Wells ----------------------*/

/**
 * Validates an array of wells.
 * @param {Well[]} array - array of wells
 * @throws {TypeError} on invalid well input
 */
WellSetValidation.prototype.validateWellArray = function(array) {

   Validation.validateArguments(arguments.length, WellSetValidation.prototype.validateWellArray.length, "WellSetValidation.prototype.validateWellArray");

   if(this.getType(array) != '[object Array]') {
      throw new TypeError("Object is not an array: " + array);
   }

   for(var well of array) {
      WellValidation.validateWell(well);
   }

}

/**
 * Validates an array containing string or well values.
 * @param {(Well[]|string[])} array - array of strings/wells
 * @throws {TypeError} on invalid array input
 */
WellSetValidation.prototype.validateWellOrIndexArray = function(array) {

   Validation.validateArguments(arguments.length, WellSetValidation.prototype.validateWellOrIndexArray.length, "WellSetValidation.prototype.validateWellOrIndexArray");

   if(this.getType(array) != '[object Array]') {
      throw new TypeError("Object is not an array: " + array);
   }

   for(var i = 0; i < array.length; i++) {

      switch(this.getType(array[i])) {

         case '[object Well]':   WellValidation.validateWell(array[i]);
                                 break;

         case '[object String]': WellValidation.validateWellIndex(array[i]);
                                 break;

         default:                throw new TypeError("Invalid well or index: " + array[i]);
      }

   }

}

/*------------------- Functions for Validating Well Groups -------------------*/

/**
 * Validates a group without enforcing row or column indices.
 * @param {WellGroup} group - input group
 * @throws {TypeError} on invalid group input
 */
WellSetValidation.prototype.validateGroup = function(group) {

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
      WellValidation.validateWellIndex(well);
   }

}

/**
 * Validates an array of well groups without enforcing row or column indices.
 * @param {WellGroup[]} array - array of groups
 * @throws {TypeError} on invalid group input
 */
WellSetValidation.prototype.validateGroupArray = function(array) {

   if(this.getType(array) != '[object Array]') {
      throw new TypeError("The well must of a well object: " + well);
   }

   for(var group of array) {
      this.validateGroup(group);
   }

}

/*-------------------- Functions for Validating Well Sets---------------------*/

/**
 * Validates a well set.
 * @param {WellSet} set - input well set
 * @throws {TypeError} on invalid well set input
 */
WellSetValidation.prototype.validateWellSet = function(set) {

   Validation.validateArguments(arguments.length, WellSetValidation.prototype.validateWellSet.length, "WellSetValidation.prototype.validateWellSet");

   if(this.getType(set) != '[object WellSet]') {
      throw new TypeError("Object is not a well set: " + set);
   }

   if(this.getType(set.wells) != '[object TypedHashSet]' || set.wells.type != 'Well') {
      throw new TypeError("Invalid well set. The wells property must be a typed hash set of Wells: " + set.wells);
   }

   if(this.getType(set.name) != '[object String]') {
      throw new TypeError("Invalid well set. The set label must be a string: " + set.name);
   }

   for(var well of set) {
      WellValidation.validateWell(well);
   }
}

/*---------------------- Functions for Validating Plates ---------------------*/

/**
 * Validates a plate without enforcing row or column indices.
 * @param {Plate} plate - input plate
 * @throws {TypeError} on invalid plate input
 */
WellSetValidation.prototype.validatePlate = function(plate) {

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

   if(this.getType(plate.plateType) != '[object Number]' || plate.plateType < -1 || plate.plateType > 6) {
      throw new TypeError("Invalid plate type: " + plate.plateType);
   }

   Validation.validateString(plate.name);

   for(var well of plate) {
      WellValidation.validateWell(well);
   }

   var groupsArray = plate.groups.toArray();
   this.validateGroupArray(groupsArray);
}

/*---------------------- Functions for Validating Stacks ---------------------*/

/**
 * Validates a stack without enforcing row or column indices.
 * @param {Stack} stack - input stack
 * @throws {TypeError} on invalid stack input
 */
WellSetValidation.prototype.validateStack = function(stack) {

   Validation.validateArguments(arguments.length, WellSetValidation.prototype.validateStack.length, "WellSetValidation.prototype.validateStack");

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
      this.validatePlate(plate);
   }

}

/*----------------------------- Helper Functions -----------------------------*/

/**
 * Returns a string containing the object or primitive type.
 * @param {(Object|number|string|boolean|symbol)} input - the input to type
 * @returns {string} the type of the input
 */
WellSetValidation.prototype.getType = function(input) {

   if(input === null) {
      return "[object Null]";
   }

   var toReturn = Object.prototype.toString.call(input);

   if(toReturn === '[object Object]') {
      toReturn = '[object ' + input.constructor.name + ']';
   }

   return toReturn;
}
