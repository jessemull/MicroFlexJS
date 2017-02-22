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

// increment.js

/*------------------------------- Dependencies -------------------------------*/

var UnaryOperation = require('./unaryoperation');

/*------------------------------- Constructor --------------------------------*/

/**
 * This class performs the increment operation for plate stacks, plates, wells
 * and well sets. Unary operations can also be performed on a subset of data
 * by passing indices into the well data array as arguments.
 *
 * <br><br>
 *
 * <b>Increment Operation Example:</b>
 *
 * <br><br>
 *
 * <span style="color: purple;">var</span> increment = <span style="color: purple;">new</span> Increment();<br>
 * <span style="color: purple;">var</span> well = <span style="color: purple;">new</span> Well('A1', [1, 2, 3, 4]);<br>
 * increment.<span style="color: Sienna;">well</span>(well) <span style="color: purple;">  &nbsp=>&nbsp  </span> Well { base: 26, row: 0, column: 1, data: [ 2, 3, 4, 5 ] }
 *
 * <br><br>
 *
 * <b>Well Unary Operation Example:</b>
 *
 * <br><br>
 *
 * <span style="color: purple;">var</span> increment = <span style="color: purple;">new</span> Increment();<br>
 * <span style="color: purple;">var</span> well = <span style="color: purple;">new</span> Well('A1', [1,2,3,4]);<br>
 * <pre style="margin: 0; display: inline;">increment.<span style="color: Sienna;">well</span>(well) => Well {
 *                            base: 26,
 *                            row: 0,
 *                            column: 1,
 *                            data: [ 2, 3, 4, 5 ]
 *                         }</pre>
 *
 * <br><br>
 *
 * <b>Set Unary Operation Example:</b>
 *
 * <br><br>
 *
 * <span style="color: purple;">var</span> increment = <span style="color: purple;">new</span> Increment();<br>
 * <span style="color: purple;">var</span> set = <span style="color: purple;">new</span> WellSet(wells, "Example Set");<br>
 * <pre style="margin: 0; display: inline;">increment.<span style="color: Sienna;">set</span>(set); => WellSet {
 *                           name: 'Result - Example Set',
 *                           wells: TypedHashSet {
 *                              values: {
 *                                 A1: Well { base: 26, row: 0, column: 1, data: [ 2, 3, 4, 5 ] },
 *                                 B2: Well { base: 26, row: 1, column: 2, data: [ 6, 7, 8, 9 ] }
 *                              },
 *                              type: 'Well'
 *                           }
 *                        }</pre>
 *
 * <br><br>
 *
 * <b>Plate Unary Operation Example:</b>
 *
 * <br><br>
 *
 * <span style="color: purple;">var</span> increment = <span style="color: purple;">new</span> Increment();<br>
 * <span style="color: purple;">var</span> plate = <span style="color: purple;">new</span> Plate(8, 12, set, "Example Plate");<br>
 * <pre style="margin: 0; display: inline;">increment.<span style="color: Sienna;">plate</span>(plate); => WellSet {
 *                               name: 'Result - Example Plate',
 *                               wells: TypedHashSet {
 *                                  values: {
 *                                     A1: Well { base: 26, row: 0, column: 1, data: [ 2, 3, 4, 5 ] },
 *                                     B2: Well { base: 26, row: 1, column: 2, data: [ 6, 7, 8, 9 ] }
 *                                  },
 *                                  type: 'Well'
 *                               }
 *                            }</pre>
 *
 * <br><br>
 *
 * <b>Stack Unary Operation Example:</b>
 *
 * <br><br>
 *
 * <span style="color: purple;">var</span> increment = <span style="color: purple;">new</span> Increment();<br>
 * <span style="color: purple;">var</span> stack = <span style="color: purple;">new</span> Stack(plates, "Example Stack");<br>
 * <pre style="margin: 0; display: inline;">increment.<span style="color: Sienna;">stack</span>(stack); => [ WellSet {
 *                                 name: 'Result - Example Plate 1',
 *                                 wells: TypedHashSet {
 *                                    values: {
 *                                       A1: Well { base: 26, row: 0, column: 1, data: [ 2, 3, 4, 5 ] },
 *                                       B2: Well { base: 26, row: 1, column: 2, data: [ 6, 7, 8, 9 ] }
 *                                    },
 *                                    type: 'Well'
 *                                 }
 *                              },
 *                              WellSet {
 *                                 name: 'Result - Example Plate 2',
 *                                 wells: TypedHashSet {
 *                                    values: {
 *                                       A1: Well { base: 26, row: 0, column: 1, data: [ 2, 3, 4, 5 ] },
 *                                       B2: Well { base: 26, row: 1, column: 2, data: [ 6, 7, 8, 9 ] }
 *                                    },
 *                                    type: 'Well'
 *                                 }
 *                              },
 *                            ]</pre>
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
 * @augments UnaryOperation
 * @see <a href="http://www.jessemull.com" target="_blank">http://www.jessemull.com</a><br>
 * @see <a href="mailto:hello@jessemull.com">hello@jessemull.com</a>
 */
function Increment() {
   UnaryOperation.call(this);
}

Increment.prototype = new UnaryOperation();
Increment.prototype.constructor = Increment;

/*---------------------------------- Exports ---------------------------------*/

module.exports = new Increment();

/*--------------------------- Calculate Functions ----------------------------*/

/**
 * Increments the values in the array.
 * @param {number[]} array - the input array
 * @returns {number[]} the result of the operation
 */
Increment.prototype.calculate = function(array) {

   var result = array.slice();

   for(var i = 0; i < array.length; i++) {
      result[i]++;
   }

   return result;

}

/**
 * Increments the values between the indices.
 * @param {number[]} array - the input array
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {number[]} the result of the operation
 */
Increment.prototype.calculateRange = function(array, begin, end) {

   var result = array.slice();

   for(var i = begin; i < end && i < result.length; i++) {
      result[i]++;
   }

   return result;
}
