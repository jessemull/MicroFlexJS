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

// subtraction.js

/*------------------------------- Dependencies -------------------------------*/

var BinaryOperation = require('./binaryoperation');

/*------------------------------- Constructor --------------------------------*/

/**
 * This class performs subtraction operations for stacks, plates, wells and well sets.
 *
 * <br><br>
 *
 * <b>Example:</b>
 *
 * <br><br>
 *
 * <span style="color: purple;">var</span> subtraction = <span style="color: purple;">new</span> Subtraction();<br>
 * <span style="color: purple;">var</span> well1 = <span style="color: purple;">new</span> Well('A1', [2, 5, 13, 9]);<br>
 * <span style="color: purple;">var</span> well2 = <span style="color: purple;">new</span> Well('A1', [1, 3, 7, 12]);<br>
 * subtraction.<span style="color: Sienna;">wells</span>(well1, well2) <span style="color: purple;">  &nbsp=>&nbsp  </span> Well { base: 26, row: 0, column: 1, data: [ 1, 2, 6, -3 ] }
 *
 * <br><br>
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
 * a single stack, plate, set or well object and a collection, array or constant, and
 * also allow the developer to limit the operation to a subset of data:
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
 *       <td>Collection</td>
 *       <td>+/-</td>
 *       <td>+/-</td>
 *       <td>Performs the operation using the values in the collection and the values in the well</td>
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
 *       <td>Collection</td>
 *       <td>+/-</td>
 *       <td>+/-</td>
 *       <td>Performs the operation using the values in the collection and the values in each well of the set</td>
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
 *       <td>Collection</td>
 *       <td>+/-</td>
 *       <td>+/-</td>
 *       <td>Performs the operation using the values in the collection and the values in each well of the plate</td>
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
 *       <td>Collection</td>
 *       <td>+/-</td>
 *       <td>+/-</td>
 *       <td>Performs the operation using the values in the collection and the values in each well of each plate in the stack</td>
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
 * @augments BinaryOperation
 * @see <a href="http://www.jessemull.com" target="_blank">http://www.jessemull.com</a><br>
 * @see <a href="mailto:hello@jessemull.com">hello@jessemull.com</a>
 */
function Subtraction() {
   BinaryOperation.call(this);
}

Subtraction.prototype = new BinaryOperation();
Subtraction.prototype.constructor = Subtraction;

/*---------------------------------- Exports ---------------------------------*/

module.exports = new Subtraction();

/*--------------------------- Calculate Functions ----------------------------*/

/**
 * Performs subtraction on two arrays and returns the result.
 * @param {number[]} array1 - the first array
 * @param {number[]} array2 - the second array
 * @returns {number[]} the result of the operation
 */
Subtraction.prototype.calculate = function(array1, array2) {

   var result = [];

   var longer = array1.length >= array2.length ? array1 : array2;
   var shorter = array1.length < array2.length ? array1 : array2;

   for(var i = 0; i < shorter.length; i++) {
      result.push(array1[i] - array2[i]);
   }

   for(var i = shorter.length; i < longer.length; i++) {
      result.push(longer[i]);
   }

   return result;
}

/**
 * Performs subtraction on two arrays using the values between the indices
 * and returns the result.
 * @param {number[]} array1 - the first array
 * @param {number[]} array2 - the second array
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {number[]} the result of the operation
 */
Subtraction.prototype.calculateRange = function(array1, array2, begin, end) {

   var result = [];

   var sliced1 = array1.slice(begin, end);
   var sliced2 = array2.slice(begin, end);

   var longer = sliced1.length >= sliced2.length ? sliced1 : sliced2;
   var shorter = sliced1.length < sliced2.length ? sliced1 : sliced2;

   for(var i = 0; i < shorter.length; i++) {
      result.push(sliced1[i] - sliced2[i]);
   }

   for(var i = shorter.length; i < longer.length; i++) {
      result.push(longer[i]);
   }

   return result;
}

/**
 * Performs subtraction on each value in the array and a constant.
 * @param {number[]} array - the input array
 * @param {number} constant - the constant
 * @returns {number[]} the result of the operation
 */
Subtraction.prototype.calculateConstant = function(array, constant) {

   var result = [];

   for(var i = 0; i < array.length; i++) {
      result.push(array[i] - constant);
   }

   return result;
}

/**
 * Performs subtraction on each value in the array between the indices
 * and a constant.
 * @param {number[]} array - the input array
 * @param {number} constant - the constant
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {number[]} the result of the operation
 */
Subtraction.prototype.calculateConstantRange = function(array, constant, begin, end) {

   var result = array.slice();

   if(begin > result.length) {
      return [];
   }

   if(result.length < end) {
      end = result.length;
   }

   for(var i = begin; i < end; i++) {
      result[i] = result[i] - constant;
   }

   return result;
}
