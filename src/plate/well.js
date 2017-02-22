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

/*------------------------------- Dependencies -------------------------------*/

var Validation = require('../util/validation');
var WellValidation = require('../util/wellvalidation');

/*--------------------------------- Exports ----------------------------------*/

module.exports = Well;

/*------------------------------- Constructor --------------------------------*/

/**
 * This class represents a well within a microplate. It contains the the logic to
 * convert row letters to integers and vice-versa, enforces the correct format for
 * well IDs, and holds an array of data set values.
 *
 * <br><br>
 *
 * Plate, well set, and well group objects cannot contain duplicate wells. However,
 * the well object does not check for wells outside a specified range. This logic
 * is housed within the well set, plate and stack objects. Wells are compared using
 * row and column numbers in that order. This class implements a compareTo method
 * for comparing two well objects and a sort method for sorting well objects
 * contained within an array.
 *
 * <br><br>
 *
 * The well object constructor accepts arguments in the following formats:
 *
 * <table class="mytable" cellspacing="10px" style="text-align:left; margin: 20px;">
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 5px;">Arguments<div></th>
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 5px;">Example<div></th>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td><span style="color: purple;">Well Index</span></td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td><span style="color: purple;">var</span> well = <span style="color: purple;">new</span> <span style="color: chocolate;">Well</span>(<span style="color: maroon;">'A1'</span>)</td>
 *             </tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td><span style="color: purple;">Well Index, Data Array</span></td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td><span style="color: purple;">var</span> well = <span style="color: purple;">new</span> <span style="color: chocolate;">Well</span>(<span style="color: maroon;">'A1'</span>, <span style="color: maroon;">[1, 2, 3, 4]</span>)</td>
 *             </tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td><span style="color: purple;">Row Number, Column Number</span></td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td><span style="color: purple;">var</span> well = <span style="color: purple;">new</span> <span style="color: chocolate;">Well</span>(<span style="color: maroon;">0</span>, <span style="color: maroon;">1</span>)</td>
 *             </tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td><span style="color: purple;">Row Number, Column Number, Data Array</span></td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td><span style="color: purple;">var</span> well = <span style="color: purple;">new</span> <span style="color: chocolate;">Well</span>(<span style="color: maroon;">0</span>, <span style="color: maroon;">1</span>, <span style="color: maroon;">[1, 2, 3, 4]</span>)</td>
 *             </tr>
 *          </table>
 *       </td>
 *    </tr>
 * </table>
 *
 * @constructor
 * @memberof module:Microplate
 * @author Jesse L. Mull
 * @version Updated February 17, 2016
 * @license Apache License 2.0
 * @see <a href="http://www.jessemull.com" target="_blank">http://www.jessemull.com</a><br>
 * @see <a href="mailto:hello@jessemull.com">hello@jessemull.com</a>
 * @param {(string|number|Well)} var1 - well index | row number | well to clone
 * @param {(number|number[])} var2 - column number | data array
 * @param {number[]} var3 - data array
 */
function Well(var1, var2, var3) {

   this.base = 26;           // The number of possible alphanumeric characters
   this.row = null;          // The row index
   this.column = null;       // The column index
   this.data = [];           // The well data set

   // Check size of arguments array and validate parameter types

   switch(arguments.length) {

      case 1: if(Validation.getType(var1) === '[object String]') {
                 this.initializeIndex(var1);
              } else if(Validation.getType(var1) === '[object Well]') {
                 this.initializeWell(var1);
              } else {
                 this.typeError();
              }

              break;

      case 2: if(Validation.getType(var1) === '[object Number]' && Validation.getType(var2) === '[object Number]') {
                 this.initializeRowColumn(var1, var2);
              } else if(Validation.getType(var1) === '[object String]' && Validation.getType(var2) === '[object Array]') {
                 this.initializeIndexData(var1, var2);
              } else {
                 this.typeError();
              }

              break;

      case 3: if(Validation.getType(var1) === '[object Number]' && Validation.getType(var2) === '[object Number]' && Validation.getType(var3) === '[object Array]') {
                 this.initializeRowColumnData(var1, var2, var3);
              } else {
                 this.typeError();
              }

              break;

      default: this.typeError();
   }

}

/*----------------------- Constructor Helper Functions -----------------------*/

/**
 * Throws an error when the well constructor receives invalid input parameters.
 * @ignore
 * @throws {TypeError} when function is called
 */
 Well.prototype.typeError = function() {
    throw new TypeError("Well constructor accepts the following combinations of arguments: " + "\n" +
                        "  -> string - the well index" + "\n" +
                        "  -> Well - the well to clone" + "\n" +
                        "  -> string - the well index, number[] - the initial data set" + "\n" +
                        "  -> number - row index, number - column index" + "\n" +
                        "  -> number - row index, number - column index, number[] the initial data set (e.g. 0, 1, [1.0, 2.0...])" + "\n");
}

/**
 * Constructor helper function. Initializes the row and column using a well index
 * string.
 * @ignore
 * @param {string} index - well index
 */
Well.prototype.initializeIndex = function(index) {

   var parsed = WellValidation.validateWellIndex(index);

   this.row = parsed.row;
   this.column = parsed.column;
}

 /**
  * Constructor helper function. Initializes the row, column and data array using
  * an input well.
  * @ignore
  * @param {Well} well - input well
  */
Well.prototype.initializeWell = function(well) {

   WellValidation.validateWell(well);

   this.row = well.row;
   this.column = well.column;
   this.data = well.data;

}

/**
 * Constructor helper function. Initializes the row, column and data array using
 * a well index and input data.
 * @ignore
 * @param  {string} index - well index
 * @param  {number[]} data - input data
 */
Well.prototype.initializeIndexData = function(index, data) {

   WellValidation.validateWellData(data);
   var parsed = WellValidation.validateWellIndex(index);

   this.row = parsed.row;
   this.column = parsed.column;
   this.data = data;
}

/**
 * Constructor helper function. Initializes the row and column using row and column
 * numbers.
 * @ignore
 * @param {number} row - row number
 * @param {number} column - column number
 */
Well.prototype.initializeRowColumn = function(row, column) {

   WellValidation.validateRowInteger(row);
   WellValidation.validateColumn(column);

   this.row = row;
   this.column = column;
}

/**
 * Constructor helper function. Initializes the row, column and data array using
 * a row number, column number and input data.
 * @ignore
 * @param {number} row - well row
 * @param {number} column - well column
 * @param {number[]} data - input data
 */
Well.prototype.initializeRowColumnData = function(row, column, data) {

   WellValidation.validateRowInteger(row);
   WellValidation.validateColumn(column);
   WellValidation.validateWellData(data);

   this.row = row;
   this.column = column;
   this.data = data;
}

/*------------------------ Functions for adding data -------------------------*/

/**
 * Adds data to the data set. The preferential use of this function when adding
 * data is recommended in order to avoid errors and maintain data integrity.
 * @param {(number|number[]|Well)} data - input data
 * @throws {TypeError} on invalid input data
 */
Well.prototype.add = function(input) {

   Validation.validateArguments(arguments.length, Well.prototype.add.length, "Well.prototype.add");

   switch(Validation.getType(input)) {

      case '[object Number]': this.addDataPoint(input);
                              break;

      case '[object Array]':  this.addArray(input);
                              break;

      case '[object Well]':   this.addWell(input);
                              break;

      default:                throw new TypeError("Invalid input type: " + input);
   }

}

/**
 * Adds a data point. To avoid errors and maintain data integrity use the add
 * function to add data to the data set.
 * @ignore
 * @param {number} datum - input data
 * @throws {TypeError} on invalid input data
 */
Well.prototype.addDataPoint = function(datum) {
   this.data.push(datum);
}

/**
 * Adds the array values. To avoid errors and maintain data integrity use the add
 * function to add data to the data set.
 * @ignore
 * @param {number[]} data - input data
 * @throws {TypeError} on invalid input data
 */
Well.prototype.addArray = function(array) {
   WellValidation.validateWellData(array);
   this.data = this.data.concat(array);
}

/**
 * Adds the well values. To avoid errors and maintain data integrity use the add
 * function to add data to the data set.
 * @ignore
 * @param {Well} well - input data
 * @throws {TypeError} on invalid input data
 */
Well.prototype.addWell = function(well) {
   WellValidation.validateWell(well);
   this.data = this.data.concat(well.data);
}

/*----------------------- Functions for removing data ------------------------*/

/**
 * Removes data from the data set. The preferential use of this function when
 * removing data is recommended in order to avoid errors and maintain data integrity.
 * @param {(number|number[]|Well)} data - input data
 * @throws {TypeError} on invalid input data
 */
Well.prototype.remove = function(input) {

   Validation.validateArguments(arguments.length, Well.prototype.remove.length, "Well.prototype.remove");

   switch(Validation.getType(input)) {

      case '[object Number]': this.removeDataPoint(input);
                              break;

      case '[object Array]':  this.removeArray(input);
                              break;

      case '[object Well]':   this.removeWell(input);
                              break;

      default:                throw new TypeError("Invalid input type: " + input);
   }

}

/**
 * Removes a data point. To avoid errors and maintain data integrity use the
 * remove function to remove data from the data set.
 * @ignore
 * @param {number} datum - input data
 */
Well.prototype.removeDataPoint = function(datum) {

   var index = this.data.indexOf(datum);

   if(index > -1) {
      this.data.splice(index, 1);
   }

}

/**
 * Removes the array values. To avoid errors and maintain data integrity use the
 * remove function to remove data from the data set.
 * @ignore
 * @param {number[]} array - input data
 * @throws {TypeError} on invalid input data
 */
Well.prototype.removeArray = function(array) {

   WellValidation.validateWellData(array);

   for(var i in array) {
      this.removeDataPoint(array[i]);
   }

}

/**
 * Removes the well values. To avoid errors and maintain data integrity use the
 * remove function to remove data from the data set.
 * @ignore
 * @param {Well} well - input data
 * @throws {TypeError} on invalid input data
 */
Well.prototype.removeWell = function(well) {

   WellValidation.validateWell(well);

   for(var i in well.data) {
      this.removeDataPoint(well.data[i]);
   }
}

/**
 * Removes the range of values.
 * @param {number} begin - beginning index
 * @param {number} length - length of subset
 * @throws {TypeError} on invalid input data
 */
Well.prototype.removeRange = function(begin, length) {

   Validation.validateArguments(arguments.length, Well.prototype.removeRange.length, "Well.prototype.removeRange");
   Validation.validateArrayRange(begin, begin + length, this.data.length);

   this.data.splice(begin, length);
}

/**
 * Clears the data set.
 */
 Well.prototype.clear = function() {
    this.data = [];
}

/*----------------------- Functions for retaining data -----------------------*/

/**
 * Retains data from the data set. The data array is traversed using the input
 * in order to maintain the data set array order.  The preferential use of this
 * function when retaining data is recommended in order to avoid errors and maintain
 * data integrity.
 * @param {(number|number[]|Well)} data - input data
 * @throws {TypeError} on invalid input data
 */
Well.prototype.retain = function(input) {

   Validation.validateArguments(arguments.length, Well.prototype.retain.length, "Well.prototype.retain");

   switch(Validation.getType(input)) {

      case '[object Number]': this.retainDataPoint(input);
                              break;

      case '[object Array]':  this.retainArray(input);
                              break;

      case '[object Well]':   this.retainWell(input);
                              break;

      default:                throw new TypeError("Invalid input type: " + input);
   }

}

/**
 * Retains a data point. To avoid errors and maintain data integrity use the
 * retain function to retain data in the data set.
 * @ignore
 * @param {number} datum - input data
 */
Well.prototype.retainDataPoint = function(datum) {

   var index = this.data.indexOf(datum);

   if(index > -1) {
      this.data = this.data.splice(index, 1);
   } else {
      this.data = [];
   }

}

/**
 * Retains the array values. To avoid errors and maintain data integrity use the
 * retain function to retain data in the data set.
 * @ignore
 * @param {number[]} input - input data
 * @throws {TypeError} on invalid input data
 */
Well.prototype.retainArray = function(input) {

   WellValidation.validateWellData(input);

   var toRetain = [];
   var array = input.slice();

   for(var i in this.data) {

      var index = array.indexOf(this.data[i]);

      if(index > -1) {
         toRetain.push(this.data[i]);
         array.splice(index, 1);
      }
   }

   this.data = toRetain;
}

/**
 * Retains the well values. To avoid errors and maintain data integrity use the
 * retain function to retain data in the data set.
 * @ignore
 * @param {Well} well - input data
 * @throws {TypeError} on invalid input data
 */
Well.prototype.retainWell = function(well) {

   WellValidation.validateWell(well);

   var toRetain = [];
   var array = well.data.slice();

   for(var i in this.data) {

      var index = array.indexOf(this.data[i]);

      if(index > -1) {
         toRetain.push(this.data[i]);
         array.splice(index, 1);
      }

   }

   this.data = toRetain;
}

/**
 * Retains the range of values.
 * @param {number} begin - beginning index
 * @param {number} end - ending index
 * @throws {TypeError} on invalid input data
 */
Well.prototype.retainRange = function(begin, end) {

   Validation.validateArguments(arguments.length, Well.prototype.retainRange.length, "Well.prototype.retainRange");
   Validation.validateArrayRange(begin, end, this.data.length);

   this.data = this.data.slice(begin, end);
}

/*------------------------ Functions for data lookup -------------------------*/

/**
 * Returns true if the data set contains the input values.
 * @param {(number|number[]|Well)} data - input data
 * @returns {boolean} true if the data set contains the input values
 */
Well.prototype.contains = function(input) {

   Validation.validateArguments(arguments.length, Well.prototype.contains.length, "Well.prototype.contains");

   switch(Validation.getType(input)) {

      case '[object Number]':  return this.containsDataPoint(input);

      case '[object Array]':   return this.containsArray(input);

      case '[object Well]':    return this.containsWell(input);

      default:                 return false;
   }

}

/**
 * Returns true if the data set contains the input value.
 * @ignore
 * @param {number} datum - input data
 * @returns {boolean} true if the data set contains the input value
 */
Well.prototype.containsDataPoint = function(datum) {
   return this.data.indexOf(datum) > -1;
}

/**
 * Returns true if the data set contains the array values.
 * @ignore
 * @param {number[]} array - input data
 * @returns {boolean} true if the data set contains the array values
 */
Well.prototype.containsArray = function(array) {

   var copy = this.data.slice();

   for(var value of array) {

      var index = copy.indexOf(value);

      if(index > -1) {
         copy.splice(index, 1);
      } else {
         return false;
      }
   }

   return true;
}

/**
 * Returns true if the data set contains the well values.
 * @ignore
 * @param {Well} well - input data
 * @returns {boolean} true if the data set contains the well values
 */
Well.prototype.containsWell = function(well) {

   var copy = this.data.slice();

   for(var value of well.data) {

      var index = copy.indexOf(value);

      if(index > -1) {
         copy.splice(index, 1);
      } else {
         return false;
      }
   }

   return true;
}

/*--------------------------- Additional functions ---------------------------*/

/**
 * Returns the row index as a string.
 * @returns {string} row string
 */
Well.prototype.rowString = function() {

   var rowInt = this.row;
   var rowString = "";

   while (rowInt >=  0) {
      rowString = String.fromCharCode((rowInt % this.base + 65)) + rowString;
      rowInt = (rowInt  / this.base) - 1;
   }

   return rowString;
}

/**
 * Returns the well index as a string.
 * @returns {string} well index string
 */
Well.prototype.toString = function() {
   return this.rowString() + this.column;
}

/**
 * Returns the size of the data set.
 * @returns {number} size of the data set
 */
Well.prototype.size = function() {
   return this.data.length;
}

/**
 * Returns the data set array.
 * @returns {number[]} data set
 */
Well.prototype.getData = function() {
   return this.data;
}

/**
 * Returns true if the data set is empty.
 * @returns {boolean} true if the data set is empty
 */
Well.prototype.isEmpty = function() {
   return this.data.length === 0;
}

/**
 * Returns the index of the input value;
 * @param {number} number - input number
 * @returns {number} the index or -1 if the number is not in the data set
 */
Well.prototype.indexOf = function(number) {
   Validation.validateArguments(arguments.length, Well.prototype.indexOf.length, "Well.protoype.indexOf");
   return this.data.indexOf(number);
}

/**
 * Compares two wells.
 * @param {Well} well - the well for comparison
 * @returns {number} 0 if wells are equal, -1 if the input well is greater, 1 if the input well is lesser
 * @throws {TypeError} on invalid well input
 */
Well.prototype.compareTo = function(well) {

   Validation.validateArguments(arguments.length, Well.prototype.compareTo.length, "Well.protoype.compareTo");
   WellValidation.validateWell(well);

   if(well.row > this.row) {
      return -1;
   }

   if(well.row < this.row) {
      return 1;
   }

   if(well.column > this.column) {
      return -1;
   }

   if(well.column < this.column) {
      return 1;
   }

   return 0;
}

/**
 * Sorts wells by well row and column.
 * @param {Well} well1 - the first well
 * @param {Well} well2 - the second well
 * @returns {number} 0 if wells are equal, -1 if well1 is greater than well2, 1 if well1 is less than well2
 * @throws {TypeError} on invalid well input
 */
Well.prototype.sort = function(well1, well2) {

   Validation.validateArguments(arguments.length, Well.prototype.sort.length, "Well.protoype.sort");
   WellValidation.validateWell(well1);
   WellValidation.validateWell(well2);

   return well1.compareTo(well2);
}

Well.prototype[Symbol.iterator] = function() {
   return this.data[Symbol.iterator]();
}
