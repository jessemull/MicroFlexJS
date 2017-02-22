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

// shiftoperation.js

/*---------------------------------- Exports ---------------------------------*/

module.exports = ShiftOperation;

/*------------------------------- Dependencies -------------------------------*/

var Well = require('../plate/well');
var WellSet = require('../plate/wellset');
var Plate = require('../plate/plate');
var Stack = require('../plate/stack');
var Validation = require('../util/validation');
var WellValidation = require('../util/wellvalidation');
var WellSetValidation = require('../util/wellsetvalidation');

/*-------------------------------- Constructor -------------------------------*/

/**
 * This class performs mathematical shift operations for stacks, plates, wells
 * and well sets. To create a custom shift operation extend this class and
 * override the calculate methods using the appropriate operation. Shift operations
 * can also be performed on a subset of data by passing indices into the well
 * data array as arguments.
 *
 * <br><br>
 *
 * <b>Well Operation Example:</b>
 *
 * <br><br>
 *
 * <span style="color: purple;">var</span> leftShift = <span style="color: purple;">new</span> LeftShift();<br>
 * <span style="color: purple;">var</span> well = <span style="color: purple;">new</span> Well('A1', [1,2,3,4]);<br>
 * <span style="color: purple;">var</span> bits = 2;<br>
 * <pre style="margin: 0; display: inline;">leftShift.<span style="color: Sienna;">well</span>(well, bits) => Well {
 *                                  base: 26,
 *                                  row: 0,
 *                                  column: 1,
 *                                  data: [ 4, 8, 12, 16 ]
 *                               }</pre>
 *
 * <br><br>
 *
 * <b>Set Operation Example:</b>
 *
 * <br><br>
 *
 * <span style="color: purple;">var</span> leftShift = <span style="color: purple;">new</span> LeftShift();<br>
 * <span style="color: purple;">var</span> set = <span style="color: purple;">new</span> WellSet(wells, "Example Set");<br>
 * <span style="color: purple;">var</span> bits = 2;<br>
 * <pre style="margin: 0; display: inline;">leftShift.<span style="color: Sienna;">set</span>(set, bits); => WellSet {
 *                                 name: 'Result - Example Set',
 *                                 wells: TypedHashSet {
 *                                    values: {
 *                                       A1: Well { base: 26, row: 0, column: 1, data: [ 4, 8, 12, 16 ] },
 *                                       B2: Well { base: 26, row: 1, column: 2, data: [ 18, 20, 22, 24 ] }
 *                                    },
 *                                    type: 'Well'
 *                                 }
 *                              }</pre>
 *
 * <br><br>
 *
 * <b>Plate Operation Example:</b>
 *
 * <br><br>
 *
 * <span style="color: purple;">var</span> leftShift = <span style="color: purple;">new</span> LeftShift();<br>
 * <span style="color: purple;">var</span> plate = <span style="color: purple;">new</span> Plate(8, 12, set, "Example Plate");<br>
 * <span style="color: purple;">var</span> bits = 2;<br>
 * <pre style="margin: 0; display: inline;">leftShift.<span style="color: Sienna;">plate</span>(plate, bits); => WellSet {
 *                                     name: 'Result - Example Plate',
 *                                     wells: TypedHashSet {
 *                                        values: {
 *                                           A1: Well { base: 26, row: 0, column: 1, data: [ 4, 8, 12, 16 ] },
 *                                           B2: Well { base: 26, row: 1, column: 2, data: [ 18, 20, 22, 24 ] }
 *                                        },
 *                                        type: 'Well'
 *                                     }
 *                                  }</pre>
 *
 * <br><br>
 *
 * <b>Stack Operation Example:</b>
 *
 * <br><br>
 *
 * <span style="color: purple;">var</span> leftShift = <span style="color: purple;">new</span> LeftShift();<br>
 * <span style="color: purple;">var</span> stack = <span style="color: purple;">new</span> Stack(plates, "Example Stack");<br>
 * <span style="color: purple;">var</span> bits = 2;<br>
 * <pre style="margin: 0; display: inline;">leftShift.<span style="color: Sienna;">stack</span>(stack, bits); => [ WellSet {
 *                                       name: 'Result - Example Plate 1',
 *                                       wells: TypedHashSet {
 *                                          values: {
 *                                             A1: Well { base: 26, row: 0, column: 1, data: [ 4, 8, 12, 16 ] },
 *                                             B2: Well { base: 26, row: 1, column: 2, data: [ 18, 20, 22, 24 ] }
 *                                          },
 *                                          type: 'Well'
 *                                       }
 *                                    },
 *                                    WellSet {
 *                                       name: 'Result - Example Plate 2',
 *                                       wells: TypedHashSet {
 *                                          values: {
 *                                             A1: Well { base: 26, row: 0, column: 1, data: [ 41, 82, 12, 16 ] },
 *                                             B2: Well { base: 26, row: 1, column: 2, data: [ 44, 91, 42, 24 ] }
 *                                          },
 *                                          type: 'Well'
 *                                       }
 *                                    },
 *                                  ]</pre>
 *
 * <br><br>
 *
 * <b>MicroFlex Operators:</b>
 *
 * <table class="mytable" cellspacing="5px" border="0" style="text-align:left; margin: 20px;">
 *    <tr>
 *       <td>&raquo;&nbsp; Addition</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; AND</td>
 *    </tr>
 *    <tr>
 *      <td>&raquo;&nbsp; Compliment</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Decrement</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Division</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Increment</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Left Shift</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Modulus</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Multiplication</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; OR</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Right Shift Arithmetic</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Right Shift Logical</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Subtraction</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; XOR</td>
 *    </tr>
 * </table>
 *
 * @constructor
 * @memberof module:Operations
 * @author Jesse L. Mull
 * @version Updated February 17, 2016
 * @license Apache License 2.0
 * @see <a href="http://www.jessemull.com" target="_blank">http://www.jessemull.com</a><br>
 * @see <a href="mailto:hello@jessemull.com">hello@jessemull.com</a>
 */
function ShiftOperation() {}

/*------------------------------ Well Functions ------------------------------*/

/**
 * Performs the shift operation on a well. Missing data points due to uneven array
 * lengths are treated as zeros. The operation can be restricted to a subset of
 * data by passing a beginning and ending index into the well data array,
 * @param {Well} well - the input well
 * @param {number} n - the number of bits to shift
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {Well} the result of the shift operation
 */
ShiftOperation.prototype.well = function(well, n, begin, end) {

   switch(arguments.length) {

      case 2: WellValidation.validateWell(well);

              if(Validation.getType(n) != '[object Number]') {
                 throw new TypeError("Number of bits to shift must be a number: " + n);
              }

              var result = this.calculate(well.getData(), n);
              return new Well(well.toString(), result);

      case 4: WellValidation.validateWell(well);

              if(Validation.getType(n) != '[object Number]') {
                 throw new TypeError("Number of bits to shift must be a number: " + n);
              }

              Validation.validatePositiveRange(begin, end);

              var result = this.calculateRange(well.getData(), n, begin, end);
              return new Well(well.toString(), result);

      default: throw new TypeError("Invalid argument number: " + arguments.length);

   }

}

/**
 * Performs the shift operation on a well set. Missing data points due to uneven
 * array lengths are treated as zeros. The operation can be restricted to a subset
 * of data by passing a beginning and ending index into the well data array,
 * @param {WellSet} set - the input set
 * @param {number} n - the number of bits to shift
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {WellSet} the result of the shift operation
 */
ShiftOperation.prototype.set = function(set, n, begin, end) {

   switch(arguments.length) {

      case 2: WellSetValidation.validateWellSet(set);

              if(Validation.getType(n) != '[object Number]') {
                 throw new TypeError("Number of bits to shift must be a number: " + n);
              }

              var result = new WellSet("Result - " + set.name);

              for(var well of set) {
                 result.add(this.well(well, n));
              }

              return result;

      case 4: WellSetValidation.validateWellSet(set);
              Validation.validatePositiveRange(begin, end);

              if(Validation.getType(n) != '[object Number]') {
                 throw new TypeError("Number of bits to shift must be a number: " + n);
              }

              var result = new WellSet("Result - " + set.name);

              for(var well of set) {
                 result.add(this.well(well, n, begin, end));
              }

              return result;

      default: throw new TypeError("Invalid argument number: " + arguments.length);

   }

}

/**
 * Performs the shift operation on a plate. Missing data points due to uneven
 * array lengths are treated as zeros. The operation can be restricted to a subset
 * of data by passing a beginning and ending index into the well data array,
 * @param {Plate} well - the input plate
 * @param {number} n - the number of bits to shift
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {Plate} the result of the shift operation
 */
ShiftOperation.prototype.plate = function(plate, n, begin, end) {

   switch(arguments.length) {

      case 2: WellSetValidation.validatePlate(plate);

              if(Validation.getType(n) != '[object Number]') {
                 throw new TypeError("Number of bits to shift must be a number: " + n);
              }

              var result = new WellSet("Result - " + plate.name);

              for(var well of plate) {
                 result.add(this.well(well, n));
              }

              return result;

      case 4: WellSetValidation.validatePlate(plate);
              Validation.validatePositiveRange(begin, end);

              if(Validation.getType(n) != '[object Number]') {
                 throw new TypeError("Number of bits to shift must be a number: " + n);
              }

              var result = new WellSet("Result - " + plate.name);

              for(var well of plate) {
                 result.add(this.well(well, n, begin, end));
              }

              return result;

      default: throw new TypeError("Invalid argument number: " + arguments.length);

   }

}

/**
 * Performs the shift operation on a stack. Missing data points due to uneven
 * array lengths are treated as zeros. The operation can be restricted to a subset
 * of data by passing a beginning and ending index into the well data array,
 * @param {Stack} stack - the input stack
 * @param {number} n - the number of bits to shift
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {Plate[]} the result of the shift operation
 */
ShiftOperation.prototype.stack = function(stack, n, begin, end) {

   switch(arguments.length) {

      case 2: WellSetValidation.validateStack(stack);

              if(Validation.getType(n) != '[object Number]') {
                 throw new TypeError("Number of bits to shift must be a number: " + n);
              }

              var result = [];

              for(var plate of stack) {
                 result.push(this.plate(plate, n));
              }

              return result;

      case 4: WellSetValidation.validateStack(stack);
              Validation.validatePositiveRange(begin, end);

              if(Validation.getType(n) != '[object Number]') {
                 throw new TypeError("Number of bits to shift must be a number: " + n);
              }

              var result = [];

              for(var plate of stack) {
                 result.push(this.plate(plate, n, begin, end));
              }

              return result;

      default: throw new TypeError("Invalid argument number: " + arguments.length);

   }

}

/**
 * Performs the shift operation on a well. Missing data points due to uneven array
 * lengths are omitted. The operation can be restricted to a subset of data by
 * passing a beginning and ending index into the well data array,
 * @param {Well} well - the input well
 * @param {number} n - the number of bits to shift
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {Well} the result of the shift operation
 */
ShiftOperation.prototype.wellStrict = function(well, n, begin, end) {

   Validation.validateArguments(arguments.length, ShiftOperation.prototype.wellStrict.length, "ShiftOperation.prototype.wellStrict");

   WellValidation.validateWell(well);
   Validation.validatePositiveRange(begin, end);

   if(Validation.getType(n) != '[object Number]') {
      throw new TypeError("Number of bits to shift must be a number: " + n);
   }

   var array = well.getData().slice(begin, end);
   var result = this.calculate(array, n);

   return new Well(well.toString(), result);

}

/**
 * Performs the shift operation on a well set. Missing data points due to uneven
 * array lengths are omitted. The operation can be restricted to a subset of data
 * by passing a beginning and ending index into the well data array,
 * @param {WellSet} set - the input set
 * @param {number} n - the number of bits to shift
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {WellSet} the result of the shift operation
 */
ShiftOperation.prototype.setStrict = function(set, n, begin, end) {

   Validation.validateArguments(arguments.length, ShiftOperation.prototype.setStrict.length, "ShiftOperation.prototype.setStrict");

   WellSetValidation.validateWellSet(set);
   Validation.validatePositiveRange(begin, end);

   if(Validation.getType(n) != '[object Number]') {
      throw new TypeError("Number of bits to shift must be a number: " + n);
   }

   var result = new WellSet("Result - " + set.name);

   for(var well of set) {
      result.add(this.wellStrict(well, n, begin, end));
   }

   return result;
}

/**
 * Performs the shift operation on a plate. Missing data points due to uneven
 * array lengths are omitted. The operation can be restricted to a subset
 * of data by passing a beginning and ending index into the well data array,
 * @param {Plate} well - the input plate
 * @param {number} n - the number of bits to shift
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {Plate} the result of the shift operation
 */
ShiftOperation.prototype.plateStrict = function(plate, n, begin, end) {

   Validation.validateArguments(arguments.length, ShiftOperation.prototype.plateStrict.length, "ShiftOperation.prototype.plateStrict");

   WellSetValidation.validatePlate(plate);
   Validation.validatePositiveRange(begin, end);

   if(Validation.getType(n) != '[object Number]') {
      throw new TypeError("Number of bits to shift must be a number: " + n);
   }

   var result = new WellSet("Result - " + plate.name);

   for(var well of plate) {
      result.add(this.wellStrict(well, n, begin, end));
   }

   return result;
}

/**
 * Performs the shift operation on a stack. Missing data points due to uneven
 * array lengths are omitted. The operation can be restricted to a subset of data
 * by passing a beginning and ending index into the well data array,
 * @param {Stack} stack - the input stack
 * @param {number} n - the number of bits to shift
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {Plate[]} the result of the shift operation
 */
ShiftOperation.prototype.stackStrict = function(stack, n, begin, end) {

   Validation.validateArguments(arguments.length, ShiftOperation.prototype.stackStrict.length, "ShiftOperation.prototype.stackStrict");

   WellSetValidation.validateStack(stack);
   Validation.validatePositiveRange(begin, end);

   if(Validation.getType(n) != '[object Number]') {
      throw new TypeError("Number of bits to shift must be a number: " + n);
   }

   var result = [];

   for(var plate of stack) {
      result.push(this.plateStrict(plate, n, begin, end));
   }

   return result;
}

/**
 * Performs the shift operation on the array and returns the result.
 * @param {number[]} array1 - the array
 * @param {number} n - the number of bits to shift
 * @returns {number[]} the result of the operation
 */
ShiftOperation.prototype.calculate = function(array, n) {}

/**
 * Performs the shift operation on the array using the values between the indices
 * and returns the result.
 * @param {number[]} array1 - the array
 * @param {number} n - the number of bits to shift
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {number[]} the result of the operation
 */
ShiftOperation.prototype.calculateRange = function(array, n, begin, end) {}
