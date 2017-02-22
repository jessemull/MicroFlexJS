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

// random.js

/*------------------------------- Dependencies -------------------------------*/

var Well = require('../plate/well');
var WellSet = require('../plate/wellset');
var WellGroup = require('../plate/wellgroup');
var Plate = require('../plate/plate');
var Validation = require('./validation');
var WellValidation = require('./wellvalidation');

/*--------------------------------- Exports ----------------------------------*/

module.exports = new Random();

/*-------------------------------- Constructor -------------------------------*/

/**
 * This class provides static utility helper methods for generating random wells,
 * well groups. well sets, plates and stacks. The random class can return random
 * instances of the following objects and primitives:
 *
 * <br>
 *
 * <table class="mytable" cellspacing="5px" border="0" style="text-align:left; margin: 20px;">
 *    <tr>
 *       <td>&raquo;&nbsp; Integers</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Float Arrays</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Integer Arrays</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Row Strings</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Well Indices</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Well Index Arrays</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Wells w/ Float Data</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Wells w/ Integer Data</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Well Arrays</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Well Sets</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Well Set Arrays</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Well Groups</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Well Group Arrays</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Plates</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Plate Arrays</td>
 *    </tr>
 * </table>
 *
 * @constructor
 * @memberof module:Utilities
 * @author Jesse L. Mull
 * @version Updated February 17, 2016
 * @license Apache License 2.0
 * @see <a href="http://www.jessemull.com" target="_blank">http://www.jessemull.com</a><br>
 * @see <a href="mailto:hello@jessemull.com">hello@jessemull.com</a>
 */
function Random() {
    this.alphas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
};

/*---------------- Functions for Random Well Indices and Data ----------------*/

/**
 * Returns a random integer between the minimum and maximum values.
 * @param {number} min - the minimum integer value
 * @param {number} max - the maximum integer value
 * @returns {number} the random integer value
 * @throws {TypeError} on invalid indices or ranges
 */
Random.prototype.getInt = function(min, max) {

   Validation.validateArguments(arguments.length, Random.prototype.getInt.length,
                                "Random.prototype.getInt");
   Validation.validateRange(min, max);

   min = Math.ceil(min);
   max = Math.floor(max);

   return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Returns a random row string with a length between the minimum and maximum values.
 * @param {number} minLength - the minimum row string length
 * @param {number} maxLength - the maximum row string length
 * @returns {string} the random row string
 * @throws {TypeError} on invalid indices or ranges
 */
Random.prototype.getRow = function(minLength, maxLength) {

   Validation.validateArguments(arguments.length, Random.prototype.getRow.length,
                                "Random.prototype.getRow");
   Validation.validatePositiveRange(minLength, maxLength);

   var length = this.getInt(minLength, maxLength);
   var letters = "";

   for(var i = 0; i < length; i++) {
      var index = this.getInt(0, this.alphas.length);
      letters += this.alphas.charAt(index);
   }

   return letters;
}

/**
 * Returns a random well index with a row and column between the minimum
 * and maximum values.
 * @param {number} minRowLength - the minimum row string length
 * @param {number} maxRowLength - the maximum row string length
 * @param {number} minColumn - the minimum column index
 * @param {number} maxColumn - the maximum column index
 * @returns {string} the random well index
 * @throws {TypeError} on invalid indices or ranges
 */
Random.prototype.getIndex = function(minRowLength, maxRowLength, minColumn, maxColumn) {

   // Validate column function enforces values greater than one

   Validation.validateArguments(arguments.length, Random.prototype.getIndex.length,
                                "Random.prototype.getIndex");
   Validation.validatePositiveRange(minRowLength, maxRowLength);
   Validation.validatePositiveRange(minColumn, maxColumn);
   WellValidation.validateColumn(minColumn);
   WellValidation.validateColumn(minRowLength);

   var length = this.getInt(minRowLength, maxRowLength);
   var letters = "";

   for(var i = 0; i < length; i++) {
      var index = this.getInt(0, this.alphas.length);
      letters += this.alphas.charAt(index);
   }

   return letters + this.getInt(minColumn, maxColumn);
}

/**
 * Returns an array of random well indices.
 * @param {number} minRow - minimum row index
 * @param {number} maxRow - maximum row index
 * @param {number} minColumn - minimum column index
 * @param {number} maxColumn - maximum column index
 * @param {number} minLength - minimum array length
 * @param {number} maxLength - maximum array length
 * @returns {string[]} the array of random well indices
 * @throws {TypeError} on invalid indices or ranges
 */
Random.prototype.getWellIndexArray = function(minRow, maxRow, minColumn, maxColumn,
                                              minLength, maxLength) {
   var array = this.getWellSet(0, 0, 0, 0, minRow, maxRow, minColumn, maxColumn,
                               minLength, maxLength, "WellSet");
   return array.toStringArray();
}

/**
 * Returns an array containing random numbers between the maximum and minimum values.
 * @param {number} min - the minimum value
 * @param {number} max - the maximum value
 * @param {number} length - the array length
 * @returns {number[]} the array of random numbers
 * @throws {TypeError} on invalid indices or ranges
 */
Random.prototype.getNumberArray = function(min, max, length) {

   // Validate column enforces a value greater than one

   Validation.validateArguments(arguments.length, Random.prototype.getNumberArray.length,
                                "Random.prototype.getNumberArray");
   Validation.validateRange(min, max);
   WellValidation.validateColumn(length);

   var array = [];

   for(var i = 0; i < length; i++) {
      array.push((Math.random() * (max - min)) + min);
   }

   return array;
}

/**
 * Returns an array containing random integers between the minimum and maximum values.
 * @param {number} min - the minimum value
 * @param {number} max - the maximum value
 * @param {number} length - the array length
 * @returns {number[]} the array of random integers
 * @throws {TypeError} on invalid indices or ranges
 */
Random.prototype.getIntegerArray = function(min, max, length) {

   // Validate column enforces a value greater than one

   Validation.validateArguments(arguments.length, Random.prototype.getNumberArray.length,
                                "Random.prototype.getNumberArray");
   Validation.validateRange(min, max);
   WellValidation.validateColumn(length);

   var array = [];

   for(var i = 0; i < length; i++) {
      array.push(this.getInt(min, max));
   }

   return array;
}

/**
 * Returns an array containing random numbers between the minimum and maximum values.
 * @param {number} min - the minimum value
 * @param {number} max - the maximum value
 * @param {number} minLength - the minimum array length
 * @param {number} maxLength - the maximum array length
 * @returns {number[]} the array of random numbers
 * @throws {TypeError} on invalid indices or ranges
 */
Random.prototype.getNumberArrayLength = function(min, max, minLength, maxLength) {

   Validation.validateArguments(arguments.length, Random.prototype.getNumberArrayLength.length,
                                "Random.prototype.getNumberArrayLength");
   Validation.validateRange(min, max);
   Validation.validatePositiveRange(minLength, maxLength);

   var array = [];
   var length = this.getInt(minLength, maxLength);

   for(var i = 0; i < length; i++) {
      array.push((Math.random() * (max - min)) + min);
   }

   return array;
}

/**
 * Returns an array containing random integers between the minimum and maximum values.
 * @param {number} min - the minimum value
 * @param {number} max - the maximum value
 * @param {number} minLength - the minimum array length
 * @param {number} maxLength - the maximum array length
 * @returns {number[]} the array of random integers
 * @throws {TypeError} on invalid indices or ranges
 */
Random.prototype.getIntegerArrayLength = function(min, max, minLength, maxLength) {

   Validation.validateArguments(arguments.length, Random.prototype.getNumberArrayLength.length,
                                "Random.prototype.getNumberArrayLength");
   Validation.validateRange(min, max);
   Validation.validatePositiveRange(minLength, maxLength);

   var array = [];
   var length = this.getInt(minLength, maxLength);

   for(var i = 0; i < length; i++) {
      array.push(this.getInt(min, max));
   }

   return array;
}

/*------------------------ Functions for Random Wells ------------------------*/

/**
 * Returns a random well.
 * @param {number} minValue - minimum data set value
 * @param {number} maxValue - maximum data set value
 * @param {number} minLength - minimum data set length
 * @param {number} maxLength - maximum data set length
 * @param {number} minRow - minimum row index
 * @param {number} maxRow - maximum row index
 * @param {number} minColumn - minimum column index
 * @param {number} maxColumn - maximum column index
 * @returns {Well} the random well
 * @throws {TypeError} on invalid indices, ranges or labels
 */
Random.prototype.getWell = function(minValue, maxValue, minLength, maxLength, minRow,
                                    maxRow, minColumn, maxColumn) {

   Validation.validateArguments(arguments.length, Random.prototype.getWell.length,
                                "Random.prototype.getWell");
   Validation.validateRange(minValue, maxValue);
   Validation.validatePositiveRange(minLength, maxLength);
   Validation.validatePositiveRange(minRow, maxRow);
   Validation.validatePositiveRange(minColumn, maxColumn);
   WellValidation.validateColumn(minColumn);
   WellValidation.validateColumn(maxColumn);

   var array = this.getNumberArrayLength(minValue, maxValue, minLength, maxLength);
   var row = this.getInt(minRow, maxRow);
   var column = this.getInt(minColumn, maxColumn);

   return new Well(row, column, array);
}

/**
 * Returns a random well with integer values.
 * @param {number} minValue - minimum data set value
 * @param {number} maxValue - maximum data set value
 * @param {number} minLength - minimum data set length
 * @param {number} maxLength - maximum data set length
 * @param {number} minRow - minimum row index
 * @param {number} maxRow - maximum row index
 * @param {number} minColumn - minimum column index
 * @param {number} maxColumn - maximum column index
 * @returns {Well} the random well
 * @throws {TypeError} on invalid indices, ranges or labels
 */
Random.prototype.getIntegerWell = function(minValue, maxValue, minLength, maxLength, minRow,
                                    maxRow, minColumn, maxColumn) {

   Validation.validateArguments(arguments.length, Random.prototype.getWell.length,
                                "Random.prototype.getWell");
   Validation.validateRange(minValue, maxValue);
   Validation.validatePositiveRange(minLength, maxLength);
   Validation.validatePositiveRange(minRow, maxRow);
   Validation.validatePositiveRange(minColumn, maxColumn);
   WellValidation.validateColumn(minColumn);
   WellValidation.validateColumn(maxColumn);

   var array = this.getIntegerArrayLength(minValue, maxValue, minLength, maxLength);
   var row = this.getInt(minRow, maxRow);
   var column = this.getInt(minColumn, maxColumn);

   return new Well(row, column, array);
}

/**
 * Returns an array of random wells.
 * @param {number} minValue - minimum data set value
 * @param {number} maxValue - maximum data set value
 * @param {number} minLength - minimum data set length
 * @param {number} maxLength - maximum data set length
 * @param {number} minRow - minimum row index
 * @param {number} maxRow - maximum row index
 * @param {number} minColumn - minimum column index
 * @param {number} maxColumn - maximum column index
 * @param {number} minArrayLength - the minimum array length
 * @param {number} maxArrayLength - the maximum array length
 * @returns {Well[]} the array of random wells
 * @throws {TypeError} on invalid indices, ranges or labels
 */
Random.prototype.getWellArray = function(minValue, maxValue, minLength, maxLength,
                                         minRow, maxRow, minColumn, maxColumn,
                                         minArrayLength, maxArrayLength) {

   Validation.validateArguments(arguments.length, Random.prototype.getWellArray.length,
                                "Random.prototype.getWellArray");
   Validation.validateRange(minValue, maxValue);
   Validation.validatePositiveRange(minLength, maxLength);
   Validation.validatePositiveRange(minRow, maxRow);
   Validation.validatePositiveRange(minColumn, maxColumn);
   Validation.validatePositiveRange(minArrayLength, maxArrayLength);
   WellValidation.validateColumn(minColumn);
   WellValidation.validateColumn(maxColumn);

   var toReturn = [];
   var indices = [];
   var length = this.getInt(minArrayLength, maxArrayLength);

   while(toReturn.length < length) {

      var well = this.getWell(minValue, maxValue, minLength, maxLength, minRow,
                              maxRow, minColumn, maxColumn);

      if(indices.indexOf(well.toString()) < 0) {
         toReturn.push(well);
         indices.push(well.toString());
      }

   }

   return toReturn.sort(Well.prototype.sort);
}

/*--------------------- Functions for Random Well Groups ---------------------*/

/**
 * Returns a random group.
 * @param {number} minRow - minimum row index
 * @param {number} maxRow - maximum row index
 * @param {number} minColumn - minimum column index
 * @param {number} maxColumn - maximum column index
 * @param {number} minGroupLength - the minimum group length
 * @param {number} maxGroupLength - the maximum group length
 * @param {string} label - the group label
 * @returns {WellGroup} the random group
 * @throws {TypeError} on invalid indices, ranges or labels
 */
Random.prototype.getGroup = function(minRow, maxRow, minColumn, maxColumn, minGroupLength,
                                     maxGroupLength, label) {

   Validation.validatePositiveRange(minColumn, maxColumn);
   Validation.validatePositiveRange(minRow, maxRow);
   Validation.validatePositiveRange(minGroupLength, maxGroupLength);
   WellValidation.validateColumn(minColumn);
   Validation.validateString(label);

   var groupLength = this.getInt(minGroupLength, maxGroupLength);
   var indices = this.getWellIndexArray(minRow, maxRow, minColumn, maxColumn,
                                        minGroupLength, maxGroupLength);

   return new WellGroup(indices, label);
}

/**
 * Returns a random array of groups.
 * @param {number} minRow - minimum row index
 * @param {number} maxRow - maximum row index
 * @param {number} minColumn - minimum column index
 * @param {number} maxColumn - maximum column index
 * @param {number} minGroupLength - the minimum group length
 * @param {number} maxGroupLength - the maximum group length
 * @param {number} minGroupNumber - the minimum group number
 * @param {number} maxGroupNumber - the maximum group number
 * @returns {WellGroup[]} the random groups array
 * @throws {TypeError} on invalid indices, ranges or labels
 */
Random.prototype.getGroups = function(minRow, maxRow, minColumn, maxColumn, minGroupLength,
                                      maxGroupLength, minGroupNumber, maxGroupNumber) {

   Validation.validatePositiveRange(minGroupNumber, maxGroupNumber);

   var groupNumber = this.getInt(minGroupNumber, maxGroupNumber);
   var groups = [];

   for(var i = 0; i < groupNumber; i++) {
      groups.push(this.getGroup(minRow, maxRow, minColumn, maxColumn, minGroupLength, maxGroupLength, "Group" + i));
   }

   return groups;
}

/*---------------------- Functions for Random Well Sets ----------------------*/

/**
 * Returns a random well set.
 * @param {number} minValue - minimum data set value
 * @param {number} maxValue - maximum data set value
 * @param {number} minLength - minimum data set length
 * @param {number} maxLength - maximum data set length
 * @param {number} minRow - minimum row index
 * @param {number} maxRow - maximum row index
 * @param {number} minColumn - minimum column index
 * @param {number} maxColumn - maximum column index
 * @param {number} minWellNumber - minimum well number
 * @param {number} maxWellNumber - maximum well number
 * @param {string} label - the well set label
 * @returns {WellSet} the random well set
 * @throws {TypeError} on invalid indices, ranges or labels
 */
Random.prototype.getWellSet = function(minValue, maxValue, minLength, maxLength, minRow,
                                       maxRow, minColumn, maxColumn, minWellNumber,
                                       maxWellNumber, label) {

   Validation.validateString(label);

   var array = this.getWellArray(minValue, maxValue, minLength, maxLength, minRow, maxRow,
                                 minColumn, maxColumn, minWellNumber, maxWellNumber);

   return new WellSet(array, label);
}

/**
 * Returns a random well set.
 * @param {number} minValue - minimum data set value
 * @param {number} maxValue - maximum data set value
 * @param {number} minLength - minimum data set length
 * @param {number} maxLength - maximum data set length
 * @param {number} minRow - minimum row index
 * @param {number} maxRow - maximum row index
 * @param {number} minColumn - minimum column index
 * @param {number} maxColumn - maximum column index
 * @param {number} minWellNumber - minimum well number
 * @param {number} maxWellNumber - maximum well number
 * @param {number} minSetNumber - minimum well set number
 * @param {number} maxSetNumber - maximum set number
 * @param {string} label - the well set label
 * @returns {WellSet[]} the array of random well sets
 * @throws {TypeError} on invalid indices, ranges or labels
 */
Random.prototype.getWellSetArray = function(minValue, maxValue, minLength, maxLength, minRow,
                                       maxRow, minColumn, maxColumn, minWellNumber,
                                       maxWellNumber, minSetNumber, maxSetNumber, label) {

   Validation.validatePositiveRange(minSetNumber, maxSetNumber);

   var setNumber = this.getInt(minSetNumber, maxSetNumber);
   var toReturn = [];

   for(var i = 0; i < setNumber; i++) {

      var array = this.getWellArray(minValue, maxValue, minLength, maxLength, minRow, maxRow,
                                    minColumn, maxColumn, minWellNumber, maxWellNumber);

      toReturn.push(new WellSet(array, label + i));
   }

   return toReturn;
}

/*------------------------ Functions for Random Plates -----------------------*/

/**
 * Returns a random plate.
 * @param {number} minValue - minimum data set value
 * @param {number} maxValue - maximum data set value
 * @param {number} minLength - minimum data set length
 * @param {number} maxLength - maximum data set length
 * @param {number} minRow - minimum row index
 * @param {number} maxRow - maximum row index
 * @param {number} minColumn - minimum column index
 * @param {number} maxColumn - maximum column index
 * @param {number} minSetLength - the minimum set length
 * @param {number} maxSetLength - the maximum set length
 * @param {number} minGroupLength - the minimum group length
 * @param {number} maxGroupLength - the maximum group length
 * @param {number} minGroupNumber - the minimum group number
 * @param {number} maxGroupNumber - the maximum group number
 * @param {string} label - the plate label
 * @returns {Plate} the random plate
 * @throws {TypeError} on invalid indices, ranges or labels
 */
Random.prototype.getPlate = function(minValue, maxValue, minLength, maxLength,
                                     minRow, maxRow, minColumn, maxColumn, minSetLength,
                                     maxSetLength, minGroupLength, maxGroupLength,
                                     minGroupNumber, maxGroupNumber, label) {

   Validation.validateString(label);
   Validation.validatePositiveRange(minRow, maxRow);
   Validation.validatePositiveRange(minColumn, maxColumn);
   WellValidation.validateColumn(minColumn);

   var rows = this.getInt(minRow, maxRow);
   var columns = this.getInt(minColumn, maxColumn);

   if(maxSetLength > rows * columns) {
      throw new TypeError("Maximum set length must be less than the possible number of plate wells: " + maxSetLength);
   }

   if(maxGroupLength > rows * columns) {
      throw new TypeError("Maximum group length must be less than the possible number of plate wells: " + maxGroupLength);
   }

   var set = this.getWellSet(minValue, maxValue, minLength, maxLength, 0, rows,
                             1, columns, minSetLength, maxSetLength, "Wells");

   var groups = this.getGroups(0, rows, 1, columns, minGroupLength, maxGroupLength, minGroupNumber, maxGroupNumber);

   var plate = new Plate(rows, columns, set, label);
   plate.addGroups(groups);

   return plate;
}

/**
 * Returns an array of random plates.
 * @param {number} minValue - minimum data set value
 * @param {number} maxValue - maximum data set value
 * @param {number} minLength - minimum data set length
 * @param {number} maxLength - maximum data set length
 * @param {number} minRow - minimum row index
 * @param {number} maxRow - maximum row index
 * @param {number} minColumn - minimum column index
 * @param {number} maxColumn - maximum column index
 * @param {number} minSetLength - the minimum set length
 * @param {number} maxSetLength - the maximum set length
 * @param {number} minGroupLength - the minimum group length
 * @param {number} maxGroupLength - the maximum group length
 * @param {number} minGroupNumber - the minimum group number
 * @param {number} maxGroupNumber - the maximum group number
 * @param {number} minPlateNumber - the minimum plate number
 * @param {number} maxPlateNumber - the maximum plate number
 * @param {string} label - the plate label
 * @returns {Plate[]} the array of random plates
 * @throws {TypeError} on invalid indices, ranges or labels
 */
Random.prototype.getPlateArray = function(minValue, maxValue, minLength, maxLength,
                                          minRow, maxRow, minColumn, maxColumn, minSetLength,
                                          maxSetLength, minGroupLength, maxGroupLength,
                                          minGroupNumber, maxGroupNumber, minPlateNumber,
                                          maxPlateNumber, label) {

   Validation.validatePositiveRange(minPlateNumber, maxPlateNumber);

   var plateNumber = this.getInt(minPlateNumber, maxPlateNumber);
   var toReturn = [];

   for(var i = 0; i < plateNumber; i++) {
      toReturn.push(this.getPlate(minValue, maxValue, minLength, maxLength, minRow,
                                  maxRow, minColumn, maxColumn, minSetLength, maxSetLength,
                                  minGroupLength, maxGroupLength, minGroupNumber,
                                  maxGroupNumber, label + i));
   }

   return toReturn;
}
