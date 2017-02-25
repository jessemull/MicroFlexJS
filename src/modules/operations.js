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

/**
 * This module combines all math operator classes. See below for a list of operations
 * and links to their documentation.
 *
 * <br><br>
 *
 * All mathematical operators extend the binary, unary or shift operation classes.
 * To create a custom operation simply extend the appropriate class and override
 * the calculate functions with the desired mathematical operation.
 *
 * <br><br>
 *
 * <h4><b>Binary Operations</b></h4>
 *
 * The functions within the MicroFlex library are designed to be flexible and classes
 * extending the math operation binary object support operations using two stacks,
 * plates, sets and well objects as input. In addition, they support operations using
 * a single stack, plate, set or well object and an array or constant. Binary operations
 * can be limited to a subset of data by passing indices into the well data array.
 *
 * <br><br>
 *
 * Standard functions treat all values missing from either data set as zeroes and
 * combine all stacks, plates, sets and wells from  both input objects. Strict
 * functions omit all values, stacks, plates, wells and sets missing from one of
 * the input objects:
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
 *
 *    <tr></tr>
 *    <tr></tr>
 *
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
 *
 *    <tr></tr>
 *    <tr></tr>
 *
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
 * <b>Well Binary Operation Example:</b>
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
 * <b>Set Binary Operation Example:</b>
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
 * <b>Plate Binary Operation Example:</b>
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
 * <b>Stack Binary Operation Example:</b>
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
 * <h4><b>Unary Operations</b></h4>
 *
 * Unary operations take a single well, well set, plate or stack as input and
 * perform a mathematical operation on each well value or a subset of well values
 * using indices into the data array.
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
 * <h4><b>Shift Operations</b></h4>
 *
 * Shift operations take a single well, well set, plate or stack and the number of
 * bits to shift as input and perform a mathematical operation on each well value
 * or a subset of well values using indices into the data array.
 *
 * <br><br>
 *
 * <b>Well Shift Operation Example:</b>
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
 * <b>Set Shift Operation Example:</b>
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
 * <b>Plate Shift Operation Example:</b>
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
 * <b>Stack Shift Operation Example:</b>
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
 * @module Operations
 * @author Jesse L. Mull
 * @version Updated February 17, 2016
 * @license Apache License 2.0
 * @see <a href="http://www.jessemull.com" target="_blank">http://www.jessemull.com</a><br>
 * @see <a href="mailto:hello@jessemull.com">hello@jessemull.com</a>
 */
module.exports = {
   Addition: require('../math/addition'),
   AND: require('../math/and'),
   Compliment: require('../math/compliment'),
   Decrement: require('../math/decrement'),
   Division: require('../math/division'),
   Increment: require('../math/increment'),
   LeftShift: require('../math/leftshift'),
   Modulus: require('../math/modulus'),
   Multiplication: require('../math/multiplication'),
   OR: require('../math/or'),
   RightShiftArithmetic: require('../math/rightshiftarithmetic'),
   RightShiftLogical: require('../math/rightshiftlogical'),
   Subtraction: require('../math/subtraction'),
   XOR: require('../math/xor')
}
