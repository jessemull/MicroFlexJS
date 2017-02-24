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

// binaryoperation.js

/*---------------------------------- Exports ---------------------------------*/

module.exports = BinaryOperation;

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
 * This class performs mathematical operations with two arguments on integer
 * stacks, plates, wells and well sets. To create a custom mathematical operation
 * extend this class and override the calculate methods using the appropriate
 * operation.
 *
 * Operations can be performed on stacks, plates, sets or wells of uneven length
 * using standard or strict functions. Standard functions treat all values missing
 * from a data set as zeroes and combine all stacks, plates, sets and wells from
 * both input objects. Strict functions omit all values, stacks, plates, wells
 * and sets missing from one of the input objects:
 *
 * <table class="mytable" cellspacing="10px" style="text-align:left; margin: 20px;">
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 5px;">Operation<div></th>
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 5px;">Output</div></th>
 *    <tr>
 *       <td valign="top">
 *          <table>
 *             <tr>
 *                <td>Standard</td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table>
 *             <tr>
 *                <td>Treats missing values as zeroes</td>
 *             </tr>
 *             <tr>
 *                <td>Combines stacks, plates, sets, wells and values from both input objects</td>
 *             </tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td valign="top">
 *          <table>
 *             <tr>
 *                <td>Strict</td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table>
 *             <tr>
 *                <td>Omits all missing values</td>
 *             </tr>
 *              <tr>
 *                <td>Combines stacks, plates, sets, wells and values present in both input objects only</td>
 *             </tr>
 *          </table>
 *       </td>
 *    </tr>
 * </table>
 *
 * The functions within the MicroFlex library are designed to be flexible and classes
 * extending the math operation binary object support operations using two stacks,
 * plates, sets and well objects as input. In addition, they support operations using
 * a single stack, plate, set or well object and an array or constant, and also allow
 * the developer to limit the operation to a subset of data:
 *
 * <table class="mytable" cellspacing="10px" style="text-align:left; margin: 20px;">
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 5px; padding-top: 18px;">Input 1<br><div></th>
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 5px; padding-top: 18px;">Input 2</div></th>
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 2px;">Beginning<br>Index</div></th>
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 2px;">Ending<br>Index</div></th>
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 5px; padding-top: 18px;">Operation</div></th>
 *    <tr>
 *       <td>Well</td>
 *       <td>Well</td>
 *       <td>+/-</td>
 *       <td>+/-</td>
 *       <td>Performs the operation using the values in the two wells</td>
 *    </tr>
 *    <tr>
 *       <td>Well</td>
 *       <td>Array</td>
 *       <td>+/-</td>
 *       <td>+/-</td>
 *       <td>Performs the operation using the values in the array and the values in the well</td>
 *    </tr>
 *    <tr>
 *       <td>Well</td>
 *       <td>Constant</td>
 *       <td>+/-</td>
 *       <td>+/-</td>
 *       <td>Performs the operation using the constant value and each value in the well</td>
 *    </tr>

 *    <tr></tr>
 *    <tr></tr>

 *    <tr>
 *       <td>Set</td>
 *       <td>Set</td>
 *       <td>+/-</td>
 *       <td>+/-</td>
 *       <td>Performs the operation on the values in each matching pair of wells in the two sets</td>
 *    </tr>
 *    <tr>
 *       <td>Set</td>
 *       <td>Array</td>
 *       <td>+/-</td>
 *       <td>+/-</td>
 *       <td>Performs the operation using the values in the array and the values in each well of the set</td>
 *    </tr>
 *    <tr>
 *       <td>Set</td>
 *       <td>Constant</td>
 *       <td>+/-</td>
 *       <td>+/-</td>
 *       <td>Performs the operation using the constant and each value in each well of the set</td>
 *    </tr>

 *    <tr></tr>
 *    <tr></tr>

 *    <tr>
 *       <td>Plate</td>
 *       <td>Plate</td>
 *       <td>+/-</td>
 *       <td>+/-</td>
 *       <td>Performs the operation on the values in each matching pair of wells in the two plates</td>
 *    </tr>
 *    <tr>
 *       <td>Plate</td>
 *       <td>Array</td>
 *       <td>+/-</td>
 *       <td>+/-</td>
 *       <td>Performs the operation using the values in the array and the values in each well of the plate</td>
 *    </tr>
 *    <tr>
 *       <td>Plate</td>
 *       <td>Constant</td>
 *       <td>+/-</td>
 *       <td>+/-</td>
 *       <td>Performs the operation using the constant and each value in each well of the plate</td>
 *    </tr>
 *    <tr></tr>
 *    <tr></tr>
 *
 *    <tr>
 *       <td>Stack</td>
 *       <td>Stack</td>
 *       <td>+/-</td>
 *       <td>+/-</td>
 *       <td>Performs the operation on the values in each matching pair of wells in each matching plate in the stack</td>
 *    </tr>
 *    <tr>
 *       <td>Stack</td>
 *       <td>Array</td>
 *       <td>+/-</td>
 *       <td>+/-</td>
 *       <td>Performs the operation using the values in the array and the values in each well of each plate in the stack</td>
 *    </tr>
 *    <tr>
 *       <td>Stack</td>
 *       <td>Constant</td>
 *       <td>+/-</td>
 *       <td>+/-</td>
 *       <td>Performs the operation using the constant and each value in each well of each plate in the stack</td>
 *    </tr>
 * </table>
 *
 * <b>Well Operation Example:</b>
 *
 * <br><br>
 *
 * <span style="color: purple;">var</span> addition = <span style="color: purple;">new</span> Addition();<br>
 * <span style="color: purple;">var</span> well1 = <span style="color: purple;">new</span> Well('A1', [1,2,3,4]);<br>
 * <span style="color: purple;">var</span> well2 = <span style="color: purple;">new</span> Well('B2', [5,6,7,8]);<br>
 * <pre style="margin: 0; display: inline;">addition.<span style="color: Sienna;">wells</span>(well1, well2) => Well {
 *                                    base: 26,
 *                                    row: 0,
 *                                    column: 1,
 *                                    data: [ 6, 8, 10, 12 ]
 *                                 }</pre>
 *
 * <br><br>
 *
 * <b>Set Operation Example:</b>
 *
 * <br><br>
 *
 * <span style="color: purple;">var</span> addition = <span style="color: purple;">new</span> Addition();<br>
 * <span style="color: purple;">var</span> set1 = <span style="color: purple;">new</span> WellSet(wells1, "Example Set 1");<br>
 * <span style="color: purple;">var</span> set2 = <span style="color: purple;">new</span> WellSet(wells2, "Example Set 2");<br>
 * <pre style="margin: 0; display: inline;">addition.<span style="color: Sienna;">sets</span>(set1, set2); => WellSet {
 *                                  name: 'Result - Example Set 1, Example Set 2',
 *                                  wells: TypedHashSet {
 *                                     values: {
 *                                        A1: Well { base: 26, row: 0, column: 1, data: [ 10, 12, 14, 16 ] },
 *                                        B2: Well { base: 26, row: 1, column: 2, data: [ 18, 20, 22, 24 ] }
 *                                     },
 *                                     type: 'Well'
 *                                  }
 *                               }</pre>
 *
 * <br><br>
 *
 * <b>Plate Operation Example:</b>
 *
 * <br><br>
 *
 * <span style="color: purple;">var</span> addition = <span style="color: purple;">new</span> Addition();<br>
 * <span style="color: purple;">var</span> plate1 = <span style="color: purple;">new</span> Plate(8, 12, set1, "Example Plate 1");<br>
 * <span style="color: purple;">var</span> plate2 = <span style="color: purple;">new</span> Plate(8, 12, set2, "Example Plate 2");<br>
 * <pre style="margin: 0; display: inline;">addition.<span style="color: Sienna;">plates</span>(plate1, plate2); => WellSet {
 *                                        name: 'Result - Example Plate 1, Example Plate 2',
 *                                        wells: TypedHashSet {
 *                                           values: {
 *                                              A1: Well { base: 26, row: 0, column: 1, data: [ 10, 12, 14, 16 ] },
 *                                              B2: Well { base: 26, row: 1, column: 2, data: [ 18, 20, 22, 24 ] }
 *                                           },
 *                                           type: 'Well'
 *                                        }
 *                                     }</pre>
 *
 * <br><br>
 *
 * <b>Stack Operation Example:</b>
 *
 * <br><br>
 *
 * <span style="color: purple;">var</span> addition = <span style="color: purple;">new</span> Addition();<br>
 * <span style="color: purple;">var</span> stack1 = <span style="color: purple;">new</span> Stack(plates1, "Example Stack 1");<br>
 * <span style="color: purple;">var</span> stack2 = <span style="color: purple;">new</span> Stack(plates2, "Example Stack 2");<br>
 * <pre style="margin: 0; display: inline;">addition.<span style="color: Sienna;">stacks</span>(stack1, stack2); => [ WellSet {
 *                                          name: 'Result - Example Plate 1',
 *                                          wells: TypedHashSet {
 *                                             values: {
 *                                                A1: Well { base: 26, row: 0, column: 1, data: [ 10, 12, 14, 16 ] },
 *                                                B2: Well { base: 26, row: 1, column: 2, data: [ 18, 20, 22, 24 ] }
 *                                             },
 *                                             type: 'Well'
 *                                          }
 *                                       },
 *                                       WellSet {
 *                                          name: 'Result - Example Plate 2',
 *                                          wells: TypedHashSet {
 *                                             values: {
 *                                                A1: Well { base: 26, row: 0, column: 1, data: [ 14, 11, 55, 26 ] },
 *                                                B2: Well { base: 26, row: 1, column: 2, data: [ 44, 91, 42, 24 ] }
 *                                             },
 *                                             type: 'Well'
 *                                          }
 *                                       },
 *                                     ]</pre>
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
function BinaryOperation() {}

/*------------------------------ Well Functions ------------------------------*/

/**
 * Performs the binary operation using two wells, a well and an array or a well
 * and a constant. Missing data points due to uneven array lengths are treated as
 * zeros. The operation can be restricted to a subset of data by passing a beginning
 * and ending index into the well data array,
 * @param {Well} var1 - the first input well
 * @param {(Well|number[]|number)} var2 - the second input well | the input array | constant
 * @param {number} var3 - the beginning index
 * @param {number} var4 - the ending index
 * @returns {Well} the result
 */
BinaryOperation.prototype.wells = function(var1, var2, var3, var4) {

   Validation.validateArgumentRange(arguments.length, 2, 4, "BinaryOperation.prototype.wells");

   if(Validation.getType(var1) != '[object Well]') {
      this.wellTypeError();
   }

   switch(arguments.length) {

      case 2: if(Validation.getType(var2) === '[object Well]') {
                 return this.wellsWell(var1, var2);
              }

              if(Validation.getType(var2) === '[object Number]') {
                 return this.wellsConstant(var1, var2);
              }

              if(Validation.getType(var2) === '[object Array]') {
                 return this.wellsArray(var1, var2);
              }

              this.wellTypeError();

      case 4: if(Validation.getType(var2) === '[object Well]' && Validation.getType(var3) === '[object Number]' && Validation.getType(var4) === '[object Number]') {
                 return this.wellsIndices(var1, var2, var3, var4);
              }

              if(Validation.getType(var2) === '[object Number]' && Validation.getType(var3) === '[object Number]' && Validation.getType(var4) === '[object Number]') {
                 return this.wellsConstantIndices(var1, var2, var3, var4);
              }

              if(Validation.getType(var2) === '[object Array]' && Validation.getType(var3) === '[object Number]' && Validation.getType(var4) === '[object Number]') {
                 return this.wellsArrayIndices(var1, var2, var3, var4);
              }

              this.wellTypeError();

      default: this.wellTypeError();

   }

}

/**
 * Performs the binary operation on two wells. Missing data points due to uneven
 * array lengths are treated as zeros.
 * @ignore
 * @param {Well} well1 - the first well
 * @param {Well} well2 - the second well
 * @returns {Well} the result of the operation
 */
BinaryOperation.prototype.wellsWell = function(well1, well2) {

   WellValidation.validateWell(well1);
   WellValidation.validateWell(well2);

   var result = this.calculate(well1.data, well2.data);
   return new Well(well1.toString(), result);
}

/**
 * Performs the binary operation on two wells using the values between the indices.
 * Missing data points due to uneven array lengths are treated as zeros.
 * @ignore
 * @param {Well} well1 - the first well
 * @param {Well} well2 - the second well
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {Well} the result of the operation
 */
BinaryOperation.prototype.wellsIndices = function(well1, well2, begin, end) {

   WellValidation.validateWell(well1);
   WellValidation.validateWell(well2);
   Validation.validatePositiveRange(begin, end);

   var result = this.calculateRange(well1.data, well2.data, begin, end);

   return new Well(well1.toString(), result);
}

/**
 * Performs the binary operation on a constant and each value in the well data
 * set. Missing data points due to uneven array lengths are treated as zeros.
 * @ignore
 * @param {Well} well1 - the input well
 * @param {number} constant - the constant
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {Well} the result of the operation
 */
BinaryOperation.prototype.wellsConstant = function(well, constant) {

   WellValidation.validateWell(well);

   var result = this.calculateConstant(well.data, constant);

   return new Well(well.toString(), result);
}

/**
 * Performs the binary operation on a constant and each value in the well data
 * set between the indices. Missing data points due to uneven array lengths are
 * treated as zeros.
 * @ignore
 * @param {Well} well - the input well
 * @param {number} constant - the constant
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {Well} the result of the operation
 */
BinaryOperation.prototype.wellsConstantIndices = function(well, constant, begin, end) {

   WellValidation.validateWell(well);
   Validation.validatePositiveRange(begin, end);

   var result = this.calculateConstantRange(well.data, constant, begin, end);

   return new Well(well.toString(), result);
}

/**
 * Performs the binary operation on a well and an array. Missing data points due
 * to uneven array lengths are treated as zeros.
 * @ignore
 * @param {Well} well - the input well
 * @param {number[]} array - the array
 * @returns {Well} the result of the operation
 */
BinaryOperation.prototype.wellsArray = function(well, array) {

   WellValidation.validateWell(well);
   WellValidation.validateWellData(array);

   var result = this.calculate(well.data, array);

   return new Well(well.toString(), result);
}

/**
 * Performs the binary operation on a well and an array using the values between
 * the indices. Missing data points due to uneven array lengths are treated as
 * zeros.
 * @ignore
 * @param {Well} well - the input well
 * @param {number[]} array - the array
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {Well} the result of the operation
 */
BinaryOperation.prototype.wellsArrayIndices = function(well, array, begin, end) {

   WellValidation.validateWell(well);
   WellValidation.validateWellData(array);

   var result = this.calculateRange(well.data, array, begin, end);

   return new Well(well.toString(), result);
}

/*-------------------------- Strict Well Functions ---------------------------*/

/**
 * Performs the binary operation using two wells or a well and an array. Missing
 * data points due to uneven array lengths are omitted. The operation can be
 * restricted to a subset of data by passing a beginning and ending index into
 * the well data array,
 * @param {Well} var1 - the first input well
 * @param {(Well|number[])} var2 - the second input well | the input array
 * @param {number} var3 - the beginning index
 * @param {number} var4 - the ending index
 * @returns {Object} the result
 */
BinaryOperation.prototype.wellsStrict = function(var1, var2, var3, var4) {

   Validation.validateArgumentRange(arguments.length, 2, 4, "BinaryOperation.prototype.wells");

   if(Validation.getType(var1) != '[object Well]') {
      this.wellTypeError();
   }

   switch(arguments.length) {

      case 2: if(Validation.getType(var2) === '[object Well]') {
                 return this.wellsWellStrict(var1, var2);
              }

              if(Validation.getType(var2) === '[object Array]') {
                 return this.wellsArrayStrict(var1, var2);
              }

              this.wellTypeError();

      case 4: if(Validation.getType(var2) === '[object Well]' && Validation.getType(var3) === '[object Number]' && Validation.getType(var4) === '[object Number]') {
                 return this.wellsIndicesStrict(var1, var2, var3, var4);
              }

              if(Validation.getType(var2) === '[object Number]' && Validation.getType(var3) === '[object Number]' && Validation.getType(var4) === '[object Number]') {
                 return this.wellsConstantIndicesStrict(var1, var2, var3, var4);
              }

              if(Validation.getType(var2) === '[object Array]' && Validation.getType(var3) === '[object Number]' && Validation.getType(var4) === '[object Number]') {
                 return this.wellsArrayIndicesStrict(var1, var2, var3, var4);
              }

              this.wellTypeError();

      default: this.wellTypeError();

   }

}

/**
 * Performs the binary operation on two wells. Missing data points due to uneven
 * array lengths are omitted.
 * @ignore
 * @param {Well} well1 - the first well
 * @param {Well} well2 - the second well
 * @returns {Well} the result of the operation
 */
BinaryOperation.prototype.wellsWellStrict = function(well1, well2) {

   WellValidation.validateWell(well1);
   WellValidation.validateWell(well2);

   var index = well1.size() > well2.size() ? well2.size() : well1.size();
   var data1 = well1.getData().slice(0, index);
   var data2 = well2.getData().slice(0, index);

   var result = this.calculate(data1, data2);

   return new Well(well1.toString(), result);
}

/**
 * Performs the binary operation on two wells using the values between the indices.
 * Missing data points due to uneven array lengths are omitted.
 * @ignore
 * @param {Well} well1 - the first well
 * @param {Well} well2 - the second well
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {Well} the result of the operation
 */
BinaryOperation.prototype.wellsIndicesStrict = function(well1, well2, begin, end) {

   WellValidation.validateWell(well1);
   WellValidation.validateWell(well2);
   Validation.validatePositiveRange(begin, end);

   var index = well1.size() > well2.size() ? well2.size() : well1.size();

   if(begin >= index) {
      return new Well(well1.toString());
   }

   if(index < end) {
      end = index;
   }

   var data1 = well1.getData().slice(begin, end);
   var data2 = well2.getData().slice(begin, end);
   var result = this.calculate(data1, data2);

   return new Well(well1.toString(), result);
}

/**
 * Performs the binary operation on a constant and each value in the well data
 * set between the indices. Missing data points due to uneven array lengths are
 * treated as zeros.
 * @ignore
 * @param {Well} well - the input well
 * @param {number} constant - the constant
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {Well} the result of the operation
 */
BinaryOperation.prototype.wellsConstantIndicesStrict = function(well, constant, begin, end) {

   WellValidation.validateWell(well);
   Validation.validatePositiveRange(begin, end);

   var result = this.calculateConstant(well.getData().slice(begin, end), constant);

   return new Well(well.toString(), result);
}

/**
 * Performs the binary operation on a well and an array. Missing data points due
 * to uneven array lengths are omitted.
 * @ignore
 * @param {Well} well - the input well
 * @param {number[]} array - the array
 * @returns {Well} the result of the operation
 */
BinaryOperation.prototype.wellsArrayStrict = function(well, array) {

   WellValidation.validateWell(well);
   WellValidation.validateWellData(array);

   var index = well.size() > array.length ? array.length : well.size();
   var data1 = well.getData().slice(0, index);
   var data2 = array.slice(0, index);
   var result = this.calculate(data1, data2);

   return new Well(well.toString(), result);
}

/**
 * Performs the binary operation on a well and an array using the values between
 * the indices. Missing data points due to uneven array lengths are omitted.
 * @ignore
 * @param {Well} well - the input well
 * @param {number[]} array - the array
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {Well} the result of the operation
 */
BinaryOperation.prototype.wellsArrayIndicesStrict = function(well, array, begin, end) {

   WellValidation.validateWell(well);
   WellValidation.validateWellData(array);
   Validation.validatePositiveRange(begin, end);

   var index = well.size() > array.length ? array.length : well.size();

   if(begin >= index) {
      return new Well(well.toString());
   }

   if(index < end) {
      end = index;
   }

   var data1 = well.getData().slice(begin, end);
   var data2 = array.slice(begin, end);
   var result = this.calculate(data1, data2);

   return new Well(well.toString(), result);
}

BinaryOperation.prototype.wellTypeError = function() {
   throw new TypeError("Constructor accepts the following combinations of arguments: " + "\n" +
                       "  -> Well - first input well, Well - second input well" + "\n" +
                       "  -> Well - first input well, Well - second input well, number - beginning index, number - ending index" + "\n" +
                       "  -> Well - input well, number - constant value to add" + "\n" +
                       "  -> Well - input well, number - constant value to add, number - the beginning index. number - the ending index" + "\n" +
                       "  -> Well - the input well, number[] - the input array, " + "\n" +
                       "  -> Well - the input well, number[] - the input array, number - the beginning index, number - the ending index" + "\n");
}

/*------------------------------ Set Functions -------------------------------*/

/**
 * Performs the binary operation using two well sets, a well set and an array or
 * a well set and a constant. Missing data points due to uneven array lengths are
 * treated as  zeros. The operation can be restricted to a subset of data by
 * passing a beginning and ending index into a well data array,
 * @param {WellSet} var1 - the first input set
 * @param {(WellSet|number[]|number)} var2 - the second input set | the input array | constant
 * @param {number} var3 - the beginning index
 * @param {number} var4 - the ending index
 * @returns {WellSet} the result
 */
BinaryOperation.prototype.sets = function(var1, var2, var3, var4) {

   Validation.validateArgumentRange(arguments.length, 2, 4, "BinaryOperation.prototype.sets");

   if(Validation.getType(var1) != '[object WellSet]') {
      this.setTypeError();
   }

   switch(arguments.length) {

      case 2: if(Validation.getType(var2) === '[object WellSet]') {
                 return this.setsSet(var1, var2);
              }

              if(Validation.getType(var2) === '[object Number]') {
                 return this.setsConstant(var1, var2);
              }

              if(Validation.getType(var2) === '[object Array]') {
                 return this.setsArray(var1, var2);
              }

              this.setTypeError();

      case 4: if(Validation.getType(var2) === '[object WellSet]' && Validation.getType(var3) === '[object Number]' && Validation.getType(var4) === '[object Number]') {
                 return this.setsIndices(var1, var2, var3, var4);
              }

              if(Validation.getType(var2) === '[object Number]' && Validation.getType(var3) === '[object Number]' && Validation.getType(var4) === '[object Number]') {
                 return this.setsConstantIndices(var1, var2, var3, var4);
              }

              if(Validation.getType(var2) === '[object Array]' && Validation.getType(var3) === '[object Number]' && Validation.getType(var4) === '[object Number]') {
                 return this.setsArrayIndices(var1, var2, var3, var4);
              }

              this.setTypeError();

      default: this.setTypeError();

   }

}

/**
 * Performs the binary operation on two well sets. Missing data points due to
 * uneven array lengths are treated as zeros.
 * @ignore
 * @param {WellSet} set1 - the first set
 * @param {WellSet} set2 - the second set
 * @returns {WellSet} the result of the operation
 */
BinaryOperation.prototype.setsSet = function(set1, set2) {

   WellSetValidation.validateWellSet(set1);
   WellSetValidation.validateWellSet(set2);

   var result = new WellSet("Result - " + set1.name + ", " + set2.name);

   for(var well1 of set1) {

      if(set2.contains(well1)) {
         result.add(this.wellsWell(well1, set2.get(well1)));
      } else {
         result.add(new Well(well1));
      }

   }

   for(var well2 of set2) {

      if(!set1.contains(well2)) {
         result.add(new Well(well2));
      }

   }

   return result;
}

/**
 * Performs the binary operation on two well sets using the values between the
 * indices. Missing data points due to uneven array lengths are treated as zeros.
 * @ignore
 * @param {WellSet} set1 - the first set
 * @param {WellSet} set2 - the second set
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {WellSet} the result of the operation
 */
BinaryOperation.prototype.setsIndices = function(set1, set2, begin, end) {

   WellSetValidation.validateWellSet(set1);
   WellSetValidation.validateWellSet(set2);
   Validation.validatePositiveRange(begin, end);

   var result = new WellSet("Result - " + set1.name + ", " + set2.name);

   for(var well1 of set1) {

      if(set2.contains(well1)) {
         result.add(this.wellsIndices(well1, set2.get(well1), begin, end));
      } else {
         var toAdd = well1.getData();
         result.add(new Well(well1.toString(), toAdd));
      }

   }

   for(var well2 of set2) {

      if(!set1.contains(well2)) {
         var toAdd = well2.getData();
         result.add(new Well(well2.toString(), toAdd));
      }

   }

   return result;
}

/**
 * Performs the binary operation on a constant and each value in the well
 * set. Missing data points due to uneven array lengths are treated as zeros.
 * @ignore
 * @param {WellSet} set1 - the input set
 * @param {number} constant - the constant
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {WellSet} the result of the operation
 */
BinaryOperation.prototype.setsConstant = function(set, constant) {

   WellSetValidation.validateWellSet(set);

   var result = new WellSet("Result - " + set.name + ", " + constant);

   for(var well of set) {
      result.add(this.wellsConstant(well, constant));
   }

   return result;
}

/**
 * Performs the binary operation on a constant and each value in the well set
 * between the indices. Missing data points due to uneven array lengths are
 * treated as zeros.
 * @ignore
 * @param {WellSet} set - the input set
 * @param {number} constant - the constant
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {WellSet} the result of the operation
 */
BinaryOperation.prototype.setsConstantIndices = function(set, constant, begin, end) {

   WellSetValidation.validateWellSet(set);
   Validation.validatePositiveRange(begin, end);

   var result = new WellSet("Result - " + set.name + ", " + constant);

   for(var well of set) {
      result.add(this.wellsConstantIndices(well, constant, begin, end));
   }

   return result;
}

/**
 * Performs the binary operation on a well set and an array. Missing data points
 * due to uneven array lengths are treated as zeros.
 * @ignore
 * @param {WellSet} set - the input set
 * @param {number[]} array - the array
 * @returns {WellSet} the result of the operation
 */
BinaryOperation.prototype.setsArray = function(set, array) {

   WellSetValidation.validateWellSet(set);
   WellValidation.validateWellData(array);

   var result = new WellSet("Result - " + set.name + ", Array");

   for(var well of set) {
      result.add(this.wellsArray(well, array));
   }

   return result;
}

/**
 * Performs the binary operation on a well set and an array using the values
 * between the indices. Missing data points due to uneven array lengths are
 * treated as zeros.
 * @ignore
 * @param {WellSet} set - the input set
 * @param {number[]} array - the array
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {WellSet} the result of the operation
 */
BinaryOperation.prototype.setsArrayIndices = function(set, array, begin, end) {

   WellSetValidation.validateWellSet(set);
   WellValidation.validateWellData(array);
   Validation.validatePositiveRange(begin, end);

   var result = new WellSet("Result - " + set.name + ", Array");

   for(var well of set) {
      result.add(this.wellsArrayIndices(well, array, begin, end));
   }

   return result;
}

/*-------------------------- Strict Set Functions ---------------------------*/

/**
 * Performs the binary operation using two well sets or a well set and an array.
 * Missing data points due to uneven array lengths are omitted. The operation can
 * be restricted to a subset of data by passing a beginning and ending index into
 * the set data array,
 * @param {WellSet} var1 - the first input set
 * @param {(WellSet|number[])} var2 - the second input set | the input array
 * @param {number} var3 - the beginning index
 * @param {number} var4 - the ending index
 * @returns {WellSet} the result
 */
BinaryOperation.prototype.setsStrict = function(var1, var2, var3, var4) {

   Validation.validateArgumentRange(arguments.length, 2, 4, "BinaryOperation.prototype.sets");

   if(Validation.getType(var1) != '[object WellSet]') {
      this.setTypeError();
   }

   switch(arguments.length) {

      case 2: if(Validation.getType(var2) === '[object WellSet]') {
                 return this.setsSetStrict(var1, var2);
              }

              if(Validation.getType(var2) === '[object Array]') {
                 return this.setsArrayStrict(var1, var2);
              }

              this.setTypeError();

      case 4: if(Validation.getType(var2) === '[object WellSet]' && Validation.getType(var3) === '[object Number]' && Validation.getType(var4) === '[object Number]') {
                 return this.setsIndicesStrict(var1, var2, var3, var4);
              }

              if(Validation.getType(var2) === '[object Number]' && Validation.getType(var3) === '[object Number]' && Validation.getType(var4) === '[object Number]') {
                 return this.setsConstantIndicesStrict(var1, var2, var3, var4);
              }

              if(Validation.getType(var2) === '[object Array]' && Validation.getType(var3) === '[object Number]' && Validation.getType(var4) === '[object Number]') {
                 return this.setsArrayIndicesStrict(var1, var2, var3, var4);
              }

              this.setTypeError();

      default: this.setTypeError();

   }

}

/**
 * Performs the binary operation on two well sets. Missing data points due to
 * uneven array lengths are omitted.
 * @ignore
 * @param {WellSet} set1 - the first set
 * @param {WellSet} set2 - the second set
 * @returns {WellSet} the result of the operation
 */
BinaryOperation.prototype.setsSetStrict = function(set1, set2) {

   WellSetValidation.validateWellSet(set1);
   WellSetValidation.validateWellSet(set2);

   var retained1 = new WellSet(set1);
   var retained2 = new WellSet(set2);

   retained1.retain(retained2);
   retained2.retain(retained1);

   var result = new WellSet("Result - " + set1.name + ", " + set2.name);

   for(var well1 of retained1) {
      result.add(this.wellsWellStrict(well1, retained2.get(well1)));
   }

   return result;
}

/**
 * Performs the binary operation on two well sets using the values between the
 * indices. Missing data points due to uneven array lengths are omitted.
 * @ignore
 * @param {WellSet} set1 - the first set
 * @param {WellSet} set2 - the second set
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {WellSet} the result of the operation
 */
BinaryOperation.prototype.setsIndicesStrict = function(set1, set2, begin, end) {

   WellSetValidation.validateWellSet(set1);
   WellSetValidation.validateWellSet(set2);

   var retained1 = new WellSet(set1);
   var retained2 = new WellSet(set2);

   retained1.retain(retained2);
   retained2.retain(retained1);

   var result = new WellSet("Result - " + set1.name + ", " + set2.name);

   for(var well1 of retained1) {
      result.add(this.wellsIndicesStrict(well1, retained2.get(well1), begin, end));
   }

   return result;
}

/**
 * Performs the binary operation on a constant and each value in the well set
 * between the indices. Missing data points due to uneven array lengths are
 * omitted.
 * @ignore
 * @param {WellSet} set - the input set
 * @param {number} constant - the constant
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {WellSet} the result of the operation
 */
BinaryOperation.prototype.setsConstantIndicesStrict = function(set, constant, begin, end) {

   WellSetValidation.validateWellSet(set);
   Validation.validatePositiveRange(begin, end);

   var result = new WellSet("Result - " + set.name + ", " + constant);

   for(var well of set) {
      result.add(this.wellsConstantIndicesStrict(well, constant, begin, end));
   }

   return result;
}

/**
 * Performs the binary operation on a well set and an array. Missing data points
 * due to uneven array lengths are omitted.
 * @ignore
 * @param {WellSet} set - the input set
 * @param {number[]} array - the array
 * @returns {WellSet} the result of the operation
 */
BinaryOperation.prototype.setsArrayStrict = function(set, array) {

   WellSetValidation.validateWellSet(set);
   WellValidation.validateWellData(array);

   var result = new WellSet("Result - " + set.name + ", Array");

   for(var well of set) {
      result.add(this.wellsArrayStrict(well, array));
   }

   return result;
}

/**
 * Performs the binary operation on a well set and an array using the values
 * between the indices. Missing data points due to uneven array lengths are
 * omitted.
 * @ignore
 * @param {WellSet} set - the input set
 * @param {number[]} array - the array
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {WellSet} the result of the operation
 */
BinaryOperation.prototype.setsArrayIndicesStrict = function(set, array, begin, end) {

   WellSetValidation.validateWellSet(set);
   WellValidation.validateWellData(array);
   Validation.validatePositiveRange(begin, end);

   var result = new WellSet("Result - " + set.name + ", Array");

   for(var well of set) {
      result.add(this.wellsArrayIndicesStrict(well, array, begin, end));
   }

   return result;
}

BinaryOperation.prototype.setTypeError = function() {
   throw new TypeError("Constructor accepts the following combinations of arguments: " + "\n" +
                       "  -> WellSet - first input set, WellSet - second input set" + "\n" +
                       "  -> WellSet - first input set, WellSet - second input set, number - beginning index, number - ending index" + "\n" +
                       "  -> WellSet - input set, number - constant value to add" + "\n" +
                       "  -> WellSet - input set, number - constant value to add, number - the beginning index. number - the ending index" + "\n" +
                       "  -> WellSet - the input set, number[] - the input array, " + "\n" +
                       "  -> WellSet - the input set, number[] - the input array, number - the beginning index, number - the ending index" + "\n");
}

/*----------------------------- Plate Functions ------------------------------*/

/**
 * Performs the binary operation using two plates, a plate and an array or
 * a plate and a constant. Missing data points due to uneven array lengths are
 * treated as  zeros. The operation can be restricted to a subset of data by
 * passing a beginning and ending index into a well data array,
 * @param {Plate} var1 - the first input plate
 * @param {(Plate|number[]|number)} var2 - the second input plate | the input array | constant
 * @param {number} var3 - the beginning index
 * @param {number} var4 - the ending index
 * @returns {WellSet} the result
 */
BinaryOperation.prototype.plates = function(var1, var2, var3, var4) {

   Validation.validateArgumentRange(arguments.length, 2, 4, "BinaryOperation.prototype.plates");

   if(Validation.getType(var1) != '[object Plate]') {
      this.plateTypeError();
   }

   switch(arguments.length) {

      case 2: if(Validation.getType(var2) === '[object Plate]') {
                 return this.platesPlate(var1, var2);
              }

              if(Validation.getType(var2) === '[object Number]') {
                 return this.platesConstant(var1, var2);
              }

              if(Validation.getType(var2) === '[object Array]') {
                 return this.platesArray(var1, var2);
              }

              this.plateTypeError();

      case 4: if(Validation.getType(var2) === '[object Plate]' && Validation.getType(var3) === '[object Number]' && Validation.getType(var4) === '[object Number]') {
                 return this.platesIndices(var1, var2, var3, var4);
              }

              if(Validation.getType(var2) === '[object Number]' && Validation.getType(var3) === '[object Number]' && Validation.getType(var4) === '[object Number]') {
                 return this.platesConstantIndices(var1, var2, var3, var4);
              }

              if(Validation.getType(var2) === '[object Array]' && Validation.getType(var3) === '[object Number]' && Validation.getType(var4) === '[object Number]') {
                 return this.platesArrayIndices(var1, var2, var3, var4);
              }

              this.plateTypeError();

      default: this.plateTypeError();

   }

}

/**
 * Performs the binary operation on two plates. Missing data points due to
 * uneven array lengths are treated as zeros.
 * @ignore
 * @param {Plate} plate1 - the first plate
 * @param {Plate} plate2 - the second plate
 * @returns {WellSet} the result of the operation
 */
BinaryOperation.prototype.platesPlate = function(plate1, plate2) {

   WellSetValidation.validatePlate(plate1);
   WellSetValidation.validatePlate(plate2);

   var result = new WellSet("Result - " + plate1.name + ", " + plate2.name);

   for(var well1 of plate1) {

      if(plate2.contains(well1)) {
         result.add(this.wellsWell(well1, plate2.get(well1)));
      } else {
         result.add(well1);
      }

   }

   for(var well2 of plate2) {

      if(!plate1.contains(well2)) {
         result.add(well2);
      }

   }

   return result;
}

/**
 * Performs the binary operation on two plates using the values between the
 * indices. Missing data points due to uneven array lengths are treated as zeros.
 * @ignore
 * @param {Plate} plate1 - the first plate
 * @param {Plate} plate2 - the second plate
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {WellSet} the result of the operation
 */
BinaryOperation.prototype.platesIndices = function(plate1, plate2, begin, end) {

   WellSetValidation.validatePlate(plate1);
   WellSetValidation.validatePlate(plate2);
   Validation.validatePositiveRange(begin, end);

   var result = new WellSet("Result - " + plate1.name + ", " + plate2.name);

   for(var well1 of plate1) {

      if(plate2.contains(well1)) {
         result.add(this.wellsIndices(well1, plate2.get(well1), begin, end));
      } else {
         var toAdd = well1.getData();
         result.add(new Well(well1.toString(), toAdd));
      }

   }

   for(var well2 of plate2) {

      if(!plate1.contains(well2)) {
         var toAdd = well2.getData();
         result.add(new Well(well2.toString(), toAdd));
      }

   }

   return result;
}

/**
 * Performs the binary operation on a constant and each value in the well
 * plate. Missing data points due to uneven array lengths are treated as zeros.
 * @ignore
 * @param {Plate} plate1 - the input plate
 * @param {number} constant - the constant
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {WellSet} the result of the operation
 */
BinaryOperation.prototype.platesConstant = function(plate, constant) {

   WellSetValidation.validatePlate(plate);

   var result = new WellSet("Result - " + plate.name + ", " + constant);

   for(var well of plate) {
      result.add(this.wellsConstant(well, constant));
   }

   return result;
}

/**
 * Performs the binary operation on a constant and each value in the plate
 * between the indices. Missing data points due to uneven array lengths are
 * treated as zeros.
 * @ignore
 * @param {Plate} plate - the input plate
 * @param {number} constant - the constant
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {WellSet} the result of the operation
 */
BinaryOperation.prototype.platesConstantIndices = function(plate, constant, begin, end) {

   WellSetValidation.validatePlate(plate);
   Validation.validatePositiveRange(begin, end);

   var result = new WellSet("Result - " + plate.name + ", " + constant);

   for(var well of plate) {
      result.add(this.wellsConstantIndices(well, constant, begin, end));
   }

   return result;
}

/**
 * Performs the binary operation on a plate and an array. Missing data points
 * due to uneven array lengths are treated as zeros.
 * @ignore
 * @param {Plate} plate - the input plate
 * @param {number[]} array - the array
 * @returns {WellSet} the result of the operation
 */
BinaryOperation.prototype.platesArray = function(plate, array) {

   WellSetValidation.validatePlate(plate);
   WellValidation.validateWellData(array);

   var result = new WellSet("Result - " + plate.name + ", Array");

   for(var well of plate) {
      result.add(this.wellsArray(well, array));
   }

   return result;
}

/**
 * Performs the binary operation on a plate and an array using the values
 * between the indices. Missing data points due to uneven array lengths are
 * treated as zeros.
 * @ignore
 * @param {Plate} plate - the input plate
 * @param {number[]} array - the array
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {WellSet} the result of the operation
 */
BinaryOperation.prototype.platesArrayIndices = function(plate, array, begin, end) {

   WellSetValidation.validatePlate(plate);
   WellValidation.validateWellData(array);
   Validation.validatePositiveRange(begin, end);

   var result = new WellSet("Result - " + plate.name + ", Array");

   for(var well of plate) {
      result.add(this.wellsArrayIndices(well, array, begin, end));
   }

   return result;
}

/*-------------------------- Strict Plate Functions ---------------------------*/

/**
 * Performs the binary operation using two plates or a plate and an array.
 * Missing data points due to uneven array lengths are omitted. The operation can
 * be restricted to a subplate of data by passing a beginning and ending index into
 * the plate data array,
 * @param {Plate} var1 - the first input plate
 * @param {(Plate|number[])} var2 - the second input plate | the input array
 * @param {number} var3 - the beginning index
 * @param {number} var4 - the ending index
 * @returns {Object} the result
 */
BinaryOperation.prototype.platesStrict = function(var1, var2, var3, var4) {

   Validation.validateArgumentRange(arguments.length, 2, 4, "BinaryOperation.prototype.plates");

   if(Validation.getType(var1) != '[object Plate]') {
      this.plateTypeError();
   }

   switch(arguments.length) {

      case 2: if(Validation.getType(var2) === '[object Plate]') {
                 return this.platesPlateStrict(var1, var2);
              }

              if(Validation.getType(var2) === '[object Array]') {
                 return this.platesArrayStrict(var1, var2);
              }

              this.plateTypeError();

      case 4: if(Validation.getType(var2) === '[object Plate]' && Validation.getType(var3) === '[object Number]' && Validation.getType(var4) === '[object Number]') {
                 return this.platesIndicesStrict(var1, var2, var3, var4);
              }

              if(Validation.getType(var2) === '[object Number]' && Validation.getType(var3) === '[object Number]' && Validation.getType(var4) === '[object Number]') {
                 return this.platesConstantIndicesStrict(var1, var2, var3, var4);
              }

              if(Validation.getType(var2) === '[object Array]' && Validation.getType(var3) === '[object Number]' && Validation.getType(var4) === '[object Number]') {
                 return this.platesArrayIndicesStrict(var1, var2, var3, var4);
              }

              this.plateTypeError();

      default: this.plateTypeError();

   }

}

/**
 * Performs the binary operation on two plates. Missing data points due to
 * uneven array lengths are omitted.
 * @ignore
 * @param {Plate} plate1 - the first plate
 * @param {Plate} plate2 - the second plate
 * @returns {WellSet} the result of the operation
 */
BinaryOperation.prototype.platesPlateStrict = function(plate1, plate2) {

   WellSetValidation.validatePlate(plate1);
   WellSetValidation.validatePlate(plate2);

   var retained1 = new Plate(plate1);
   var retained2 = new Plate(plate2);

   retained1.retain(retained2);
   retained2.retain(retained1);

   var result = new WellSet("Result - " + plate1.name + ", " + plate2.name);

   for(var well1 of retained1) {
      result.add(this.wellsWellStrict(well1, retained2.get(well1)));
   }

   return result;

}

/**
 * Performs the binary operation on two plates using the values between the
 * indices. Missing data points due to uneven array lengths are omitted.
 * @ignore
 * @param {Plate} plate1 - the first plate
 * @param {Plate} plate2 - the second plate
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {WellSet} the result of the operation
 */
BinaryOperation.prototype.platesIndicesStrict = function(plate1, plate2, begin, end) {

   WellSetValidation.validatePlate(plate1);
   WellSetValidation.validatePlate(plate2);
   Validation.validatePositiveRange(begin, end);

   var retained1 = new Plate(plate1);
   var retained2 = new Plate(plate2);

   retained1.retain(retained2);
   retained2.retain(retained1);

   var result = new WellSet("Result - " + plate1.name + ", " + plate2.name);

   for(var well1 of retained1) {
      result.add(this.wellsIndicesStrict(well1, retained2.get(well1), begin, end));
   }

   return result;
}

/**
 * Performs the binary operation on a constant and each value in the plate
 * between the indices. Missing data points due to uneven array lengths are
 * omitted.
 * @ignore
 * @param {Plate} plate - the input plate
 * @param {number} constant - the constant
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {WellSet} the result of the operation
 */
BinaryOperation.prototype.platesConstantIndicesStrict = function(plate, constant, begin, end) {

   WellSetValidation.validatePlate(plate);
   Validation.validatePositiveRange(begin, end);

   var result = new WellSet("Result - " + plate.name + ", " + constant);

   for(var well of plate) {
      result.add(this.wellsConstantIndicesStrict(well, constant, begin, end));
   }

   return result;
}

/**
 * Performs the binary operation on a plate and an array. Missing data points
 * due to uneven array lengths are omitted.
 * @ignore
 * @param {Plate} plate - the input plate
 * @param {number[]} array - the array
 * @returns {WellSet} the result of the operation
 */
BinaryOperation.prototype.platesArrayStrict = function(plate, array) {

   WellSetValidation.validatePlate(plate);
   WellValidation.validateWellData(array);

   var result = new WellSet("Result - " + plate.name + ", Array");

   for(var well of plate) {
      result.add(this.wellsArrayStrict(well, array));
   }

   return result;
}

/**
 * Performs the binary operation on a plate and an array using the values
 * between the indices. Missing data points due to uneven array lengths are
 * omitted.
 * @ignore
 * @param {Plate} plate - the input plate
 * @param {number[]} array - the array
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {WellSet} the result of the operation
 */
BinaryOperation.prototype.platesArrayIndicesStrict = function(plate, array, begin, end) {

   WellSetValidation.validatePlate(plate);
   WellValidation.validateWellData(array);
   Validation.validatePositiveRange(begin, end);

   var result = new WellSet("Result - " + plate.name + ", Array");

   for(var well of plate) {
      result.add(this.wellsArrayIndicesStrict(well, array, begin, end));
   }

   return result;
}

BinaryOperation.prototype.plateTypeError = function() {
   throw new TypeError("Constructor accepts the following combinations of arguments: " + "\n" +
                       "  -> Plate - first input plate, Plate - second input plate" + "\n" +
                       "  -> Plate - first input plate, Plate - second input plate, number - beginning index, number - ending index" + "\n" +
                       "  -> Plate - input plate, number - constant value to add" + "\n" +
                       "  -> Plate - input plate, number - constant value to add, number - the beginning index. number - the ending index" + "\n" +
                       "  -> Plate - the input plate, number[] - the input array, " + "\n" +
                       "  -> Plate - the input plate, number[] - the input array, number - the beginning index, number - the ending index" + "\n");
}

/*----------------------------- Stack Functions ------------------------------*/

/**
 * Performs the binary operation using two stacks, a stack and an array or
 * a stack and a constant. Missing data points due to uneven array lengths are
 * treated as  zeros. The operation can be restricted to a subset of data by
 * passing a beginning and ending index into a well data array,
 * @param {Stack} var1 - the first input stack
 * @param {(Stack|number[]|number)} var2 - the second input stack | the input array | constant
 * @param {number} var3 - the beginning index
 * @param {number} var4 - the ending index
 * @returns {Object} the result
 */
BinaryOperation.prototype.stacks = function(var1, var2, var3, var4) {

   Validation.validateArgumentRange(arguments.length, 2, 4, "BinaryOperation.prototype.stacks");

   if(Validation.getType(var1) != '[object Stack]') {
      this.stackTypeError();
   }

   switch(arguments.length) {

      case 2: if(Validation.getType(var2) === '[object Stack]') {
                 return this.stacksStack(var1, var2);
              }

              if(Validation.getType(var2) === '[object Number]') {
                 return this.stacksConstant(var1, var2);
              }

              if(Validation.getType(var2) === '[object Array]') {
                 return this.stacksArray(var1, var2);
              }

              this.stackTypeError();

      case 4: if(Validation.getType(var2) === '[object Stack]' && Validation.getType(var3) === '[object Number]' && Validation.getType(var4) === '[object Number]') {
                 return this.stacksIndices(var1, var2, var3, var4);
              }

              if(Validation.getType(var2) === '[object Number]' && Validation.getType(var3) === '[object Number]' && Validation.getType(var4) === '[object Number]') {
                 return this.stacksConstantIndices(var1, var2, var3, var4);
              }

              if(Validation.getType(var2) === '[object Array]' && Validation.getType(var3) === '[object Number]' && Validation.getType(var4) === '[object Number]') {
                 return this.stacksArrayIndices(var1, var2, var3, var4);
              }

              this.stackTypeError();

      default: this.stackTypeError();

   }

}

/**
 * Performs the binary operation on two stacks. Missing data points due to
 * uneven array lengths are treated as zeros.
 * @ignore
 * @param {Stack} stack1 - the first stack
 * @param {Stack} stack2 - the second stack
 * @returns {Plate[]} the result of the operation
 */
BinaryOperation.prototype.stacksStack = function(stack1, stack2) {

   WellSetValidation.validateStack(stack1);
   WellSetValidation.validateStack(stack2);

   var result = [];

   for(var plate1 of stack1) {

      if(stack2.containsNames(plate1.name)) {
         result.push(this.platesPlate(plate1, stack2.getNames(plate1.name)[0]));
      } else {
         result.push(new WellSet(plate1.toArray(), plate1.name));
      }

   }

   for(var plate2 of stack2) {

      if(!stack1.containsNames(plate2.name)) {
         result.push(new WellSet(plate2.toArray(), plate2.name));
      }

   }

   return result;
}

/**
 * Performs the binary operation on two stacks using the values between the
 * indices. Missing data points due to uneven array lengths are treated as zeros.
 * @ignore
 * @param {Stack} stack1 - the first stack
 * @param {Stack} stack2 - the second stack
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {Plate[]} the result of the operation
 */
BinaryOperation.prototype.stacksIndices = function(stack1, stack2, begin, end) {

   WellSetValidation.validateStack(stack1);
   WellSetValidation.validateStack(stack2);
   Validation.validatePositiveRange(begin, end);

   var result = [];

   for(var plate1 of stack1) {

      if(stack2.containsNames(plate1.name)) {
         result.push(this.platesIndices(plate1, stack2.getNames(plate1.name)[0], begin, end));
      } else {
         result.push(new WellSet(plate1.toArray(), plate1.name));
      }

   }

   for(var plate2 of stack2) {

      if(!stack1.containsNames(plate2.name)) {
         result.push(new WellSet(plate2.toArray(), plate2.name));
      }

   }

   return result;
}

/**
 * Performs the binary operation on a constant and each value in the well
 * stack. Missing data points due to uneven array lengths are treated as zeros.
 * @ignore
 * @param {Stack} stack1 - the input stack
 * @param {number} constant - the constant
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {Plate[]} the result of the operation
 */
BinaryOperation.prototype.stacksConstant = function(stack, constant) {

   WellSetValidation.validateStack(stack);

   var result = [];

   for(var plate of stack) {
      result.push(this.platesConstant(plate, constant));
   }

   return result;
}

/**
 * Performs the binary operation on a constant and each value in the stack
 * between the indices. Missing data points due to uneven array lengths are
 * treated as zeros.
 * @ignore
 * @param {Stack} stack - the input stack
 * @param {number} constant - the constant
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {Plate[]} the result of the operation
 */
BinaryOperation.prototype.stacksConstantIndices = function(stack, constant, begin, end) {

   WellSetValidation.validateStack(stack);
   Validation.validatePositiveRange(begin, end);

   var result = [];

   for(var plate of stack) {
      result.push(this.platesConstantIndices(plate, constant, begin, end));
   }

   return result;
}

/**
 * Performs the binary operation on a stack and an array. Missing data points
 * due to uneven array lengths are treated as zeros.
 * @ignore
 * @param {Stack} stack - the input stack
 * @param {number[]} array - the array
 * @returns {Plate[]} the result of the operation
 */
BinaryOperation.prototype.stacksArray = function(stack, array) {

   WellSetValidation.validateStack(stack);
   WellValidation.validateWellData(array);

   var result = [];

   for(var plate of stack) {

      var plateResult = new WellSet("Result - " + plate.name + ", Array");

      for(var well of plate) {
         plateResult.add(this.wellsArray(well, array));
      }

      result.push(plateResult);
   }

   return result;
}

/**
 * Performs the binary operation on a stack and an array using the values
 * between the indices. Missing data points due to uneven array lengths are
 * treated as zeros.
 * @ignore
 * @param {Stack} stack - the input stack
 * @param {number[]} array - the array
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {Plate[]} the result of the operation
 */
BinaryOperation.prototype.stacksArrayIndices = function(stack, array, begin, end) {

   WellSetValidation.validateStack(stack);
   WellValidation.validateWellData(array);
   Validation.validatePositiveRange(begin, end);

   var result = [];

   for(var plate of stack) {

      var plateResult = new WellSet("Result - " + plate.name + ", Array");

      for(var well of plate) {
         plateResult.add(this.wellsArrayIndices(well, array, begin, end));
      }

      result.push(plateResult);
   }

   return result;
}

/*-------------------------- Strict Stack Functions ---------------------------*/

/**
 * Performs the binary operation using two stacks or a stack and an array.
 * Missing data points due to uneven array lengths are omitted. The operation can
 * be restricted to a substack of data by passing a beginning and ending index into
 * the stack data array,
 * @param {Stack} var1 - the first input stack
 * @param {(Stack|number[])} var2 - the second input stack | the input array
 * @param {number} var3 - the beginning index
 * @param {number} var4 - the ending index
 * @returns {Object} the result
 */
BinaryOperation.prototype.stacksStrict = function(var1, var2, var3, var4) {

   Validation.validateArgumentRange(arguments.length, 2, 4, "BinaryOperation.prototype.stacks");

   if(Validation.getType(var1) != '[object Stack]') {
      this.stackTypeError();
   }

   switch(arguments.length) {

      case 2: if(Validation.getType(var2) === '[object Stack]') {
                 return this.stacksStackStrict(var1, var2);
              }

              if(Validation.getType(var2) === '[object Array]') {
                 return this.stacksArrayStrict(var1, var2);
              }

              this.stackTypeError();

      case 4: if(Validation.getType(var2) === '[object Stack]' && Validation.getType(var3) === '[object Number]' && Validation.getType(var4) === '[object Number]') {
                 return this.stacksIndicesStrict(var1, var2, var3, var4);
              }

              if(Validation.getType(var2) === '[object Number]' && Validation.getType(var3) === '[object Number]' && Validation.getType(var4) === '[object Number]') {
                 return this.stacksConstantIndicesStrict(var1, var2, var3, var4);
              }

              if(Validation.getType(var2) === '[object Array]' && Validation.getType(var3) === '[object Number]' && Validation.getType(var4) === '[object Number]') {
                 return this.stacksArrayIndicesStrict(var1, var2, var3, var4);
              }

              this.stackTypeError();

      default: this.stackTypeError();

   }

}

/**
 * Performs the binary operation on two stacks. Missing data points due to
 * uneven array lengths are omitted.
 * @ignore
 * @param {Stack} stack1 - the first stack
 * @param {Stack} stack2 - the second stack
 * @returns {Plate[]} the result of the operation
 */
BinaryOperation.prototype.stacksStackStrict = function(stack1, stack2) {

   WellSetValidation.validateStack(stack1);
   WellSetValidation.validateStack(stack2);

   var retained1 = new Stack(stack1);
   var retained2 = new Stack(stack2);

   retained1.retainNames(retained2.toNameArray());
   retained2.retainNames(retained1.toNameArray());

   var result = [];

   for(var plate of retained1) {
      result.push(this.platesPlateStrict(plate, stack2.getNames(plate.name)[0]));
   }

   return result.sort(WellSet.prototype.sort);

}

/**
 * Performs the binary operation on two stacks using the values between the
 * indices. Missing data points due to uneven array lengths are omitted.
 * @ignore
 * @param {Stack} stack1 - the first stack
 * @param {Stack} stack2 - the second stack
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {Plate[]} the result of the operation
 */
BinaryOperation.prototype.stacksIndicesStrict = function(stack1, stack2, begin, end) {

   WellSetValidation.validateStack(stack1);
   WellSetValidation.validateStack(stack2);
   Validation.validatePositiveRange(begin, end);

   var retained1 = new Stack(stack1);
   var retained2 = new Stack(stack2);

   retained1.retainNames(retained2.toNameArray());
   retained2.retainNames(retained1.toNameArray());

   var result = [];

   for(var plate of retained1) {
      result.push(this.platesIndicesStrict(plate, stack2.getNames(plate.name)[0], begin, end));
   }

   return result.sort(WellSet.prototype.sort);
}

/**
 * Performs the binary operation on a constant and each value in the stack
 * between the indices. Missing data points due to uneven array lengths are
 * omitted.
 * @ignore
 * @param {Stack} stack - the input stack
 * @param {number} constant - the constant
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {Plate[]} the result of the operation
 */
BinaryOperation.prototype.stacksConstantIndicesStrict = function(stack, constant, begin, end) {

   WellSetValidation.validateStack(stack);
   Validation.validatePositiveRange(begin, end);

   var result = [];

   for(var plate of stack) {
      result.push(this.platesConstantIndicesStrict(plate, constant, begin, end));
   }

   return result;
}

/**
 * Performs the binary operation on a stack and an array. Missing data points
 * due to uneven array lengths are omitted.
 * @ignore
 * @param {Stack} stack - the input stack
 * @param {number[]} array - the array
 * @returns {Plate[]} the result of the operation
 */
BinaryOperation.prototype.stacksArrayStrict = function(stack, array) {

   WellSetValidation.validateStack(stack);
   WellValidation.validateWellData(array);

   var result = [];

   for(var plate of stack) {

      var plateResult = new WellSet("Result - " + plate.name + ", Array");

      for(var well of plate) {
         plateResult.add(this.wellsArrayStrict(well, array));
      }

      result.push(plateResult);
   }

   return result;
}

/**
 * Performs the binary operation on a stack and an array using the values
 * between the indices. Missing data points due to uneven array lengths are
 * omitted.
 * @ignore
 * @param {Stack} stack - the input stack
 * @param {number[]} array - the array
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {Plate[]} the result of the operation
 */
BinaryOperation.prototype.stacksArrayIndicesStrict = function(stack, array, begin, end) {

   WellSetValidation.validateStack(stack);
   WellValidation.validateWellData(array);
   Validation.validatePositiveRange(begin, end);

   var result = [];

   for(var plate of stack) {

      var plateResult = new WellSet("Result - " + plate.name + ", Array");

      for(var well of plate) {
         plateResult.add(this.wellsArrayIndicesStrict(well, array, begin, end));
      }

      result.push(plateResult);
   }

   return result;
}

BinaryOperation.prototype.stackTypeError = function() {
   throw new TypeError("Constructor accepts the following combinations of arguments: " + "\n" +
                       "  -> Stack - first input stack, Stack - second input stack" + "\n" +
                       "  -> Stack - first input stack, Stack - second input stack, number - beginning index, number - ending index" + "\n" +
                       "  -> Stack - input stack, number - constant value to add" + "\n" +
                       "  -> Stack - input stack, number - constant value to add, number - the beginning index. number - the ending index" + "\n" +
                       "  -> Stack - the input stack, number[] - the input array, " + "\n" +
                       "  -> Stack - the input stack, number[] - the input array, number - the beginning index, number - the ending index" + "\n");
}

/*-------------------- Unimplemented Calculate Functions ---------------------*/

/**
 * Performs the binary operation on two arrays and returns the result.
 * @param {number[]} array1 - the first array
 * @param {number[]} array2 - the second array
 * @returns {number[]} the result of the operation
 */
BinaryOperation.prototype.calculate = function(array1, array2) {}

/**
 * Performs the binary operation on two arrays using the values between the indices
 * and returns the result.
 * @param {number[]} array1 - the first array
 * @param {number[]} array2 - the second array
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {number[]} the result of the operation
 */
BinaryOperation.prototype.calculateRange = function(array1, array2, begin, end) {}

/**
 * Performs the binary operation on each value in the array and a constant.
 * @param {number[]} array - the input array
 * @param {number} constant - the constant
 * @returns {number[]} the result of the operation
 */
BinaryOperation.prototype.calculateConstant = function(array, constant) {}

/**
 * Performs the binary operation on each value in the array between the indices
 * and a constant.
 * @param {number[]} array - the input array
 * @param {number} constant - the constant
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {number[]} the result of the operation
 */
BinaryOperation.prototype.calculateConstantRange = function(array, constant, begin, end) {}
