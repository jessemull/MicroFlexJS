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
 * This module combines the utility classes.
 *
 * Utilities include hash sets and typed hash sets as well as static functions
 * for validating function arguments, wells, well groups, well sets, plates and stacks.
 * The random class generates random well-based data sets and input.
 *
 * <br><br>
 *
 * <h4><b>Random Utility</b></h4>
 *
 * <table class="mytable" cellspacing="10px" style="text-align:left; margin: 20px;">
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 5px;">Output<div></th>
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 5px;">Function</div></th>
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 5px;">Description</div></th>
 *    <tr>
 *       <td>Number</td>
 *       <td>
 *          Random.getInt<br>
 *          Random.getNumberArray<br>
 *          Random.getIntegerArray<br>
 *          Random.getNumberArrayLength<br>
 *          Random.getIntegerArrayLength
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *       <td>
 *          Returns a random Integer<br>
 *          Returns an array of random floats<br>
 *          Returns an array of random Integers<br>
 *          Returns an array of random floats with the specified length<br>
 *          Returns an array of random integers with the specified length<br>
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>Well Index</td>
 *       <td>
 *          Random.getRow<br>
 *          Random.getIndex<br>
 *          Random.getIndexArray
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *       <td>
 *          Returns a random row string<br>
 *          Returns a random well index string<br>
 *          Returns an array of random well index strings<br>
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>Well</td>
 *       <td>
 *          Random.getWell<br>
 *          Random.getIntegerWell<br>
 *          Random.getWellArray
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *       <td>
 *          Returns a random well<br>
 *          Returns a random well of integers<br>
 *          Returns an array of random wells
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>Well Group</td>
 *       <td>
 *          Random.getGroup<br>
 *          Random.getGroups
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *       <td>
 *          Returns a random well group<br>
 *          Returns an array of random well groups
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>WellSet</td>
 *       <td>
 *          Random.getWellSet<br>
 *          Random.getWellSetArray
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *       <td>
 *          Returns a random well set<br>
 *          Returns an array of random well sets
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>Plate</td>
 *       <td>
 *          Random.getPlate<br>
 *          Random.getPlateArray
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *       <td>
 *          Returns a random Plate<br>
 *          Returns an array of random plates
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *    </tr>
 * </table>
 *
 * <br><br>
 *
 * <h4><b>Hash Set Utilities</b></h4>
 *
 * Hash sets are implemented using a simple Javascript object containing key-value
 * pairs. Javascript object property keys must be strings. Therefore, any objects
 * added to the set must have a unique string value provided by the object's
 * toString function. A for...of loop can be used to iterate over the set.
 *
 * <br><br>
 *
 * For typed sets the type is passed as a string parameter to the conslructor and
 * enforced by comparing the type string of the set input to the value returned by
 * Object.prototype.toString.call or Object.prototype.constructor.name for objects
 * and primitive values respectively.
 *
 * <br><br>
 *
 * <h4><b>Validation Utilities</b></h4>
 *
 * <table class="mytable" cellspacing="10px" style="text-align:left; margin: 20px;">
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 5px;">Input<div></th>
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 5px;">Class.function</div></th>
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 5px;">Description</div></th>
 *    <tr>
 *       <td>Indices</td>
 *       <td>
 *          Validation.validateRange<br>
 *          Validation.validatePositiveRange<br>
 *          Validation.validateArrayRange
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *       <td>
 *          Validates a set of beginning and ending indices<br>
 *          Validates a set of positive indices<br>
 *          Checks that the indices fall within the array
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>Numbers</td>
 *       <td>
 *          Validation.validatePositiveNumber<br>
 *          Validation.validateNegativeNumber<br>
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *          WellValidation.validateWellData
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *       <td>
 *          Validates a positive number<br>
 *          Validates a negative number<br>
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *          Validates an array of numbers
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>String</td>
 *       <td>
 *          Validation.validateString
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *       <td>
 *          Validates a string primitive
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>Well</td>
 *       <td>
 *          WellValidation.validateWell<br>
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *          WellSetValidation.validateWellArray<br>
 *          WellSetValidation.validateWellOrIndexArray<br>
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *          PlateValidation.validateWell<br>
 *          PlateValidation.validateWellArray
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *       <td>
 *          Validates a well<br>
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *          Validates an array of wells<br>
 *          Validates a mixed array of wells and well indices<br>
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *          Validates a well enforcing row and column numbers<br>
 *          Validates an array of wells enforcing row and column numbers
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>Well Group</td>
 *       <td>
 *          WellSetValidation.validateGroup<br>
 *          WellSetValidation.validateGroupArray<br>
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *          PlateValidation.validateGroup<br>
 *          PlateValidation.validateGroupArray
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *       <td>
 *          Validates a well group<br>
 *          Validates an array of well groups<br>
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *          Validates a well group enforcing row and column numbers<br>
 *          Validates an array of well groups enforcing row and column numbers
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>WellSet</td>
 *       <td>
 *           WellSetValidation.validateWellSet<br>
 *           <hr style="margin: 3px; visibility:hidden;"/>
 *           PlateValidation.validateWellSet<br>
 *           PlateValidation.validateWellSetArray
 *           <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *       <td>
 *          Validates a well set<br>
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *          Validates a well set enforcing row and column numbers<br>
 *          Validates an array of well sets enforcing row and column numbers
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>Plate</td>
 *       <td>
 *           WellSetValidation.validatePlate<br>
 *           <hr style="margin: 3px; visibility:hidden;"/>
 *           PlateValidation.validatePlate<br>
 *           PlateValidation.prototype.validatePlateArray
 *           <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *       <td>
 *          Validates a plate<br>
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *          Validates a plate enforcing row and column numbers<br>
 *          Validates an array of plates enforcing row and column numbers
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>Stack</td>
 *       <td>
 *          WellSetValidation.validateStack<br>
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *          PlateValidation.validateStack
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *       <td>
 *          Validates a stack<br>
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *          Validates a stack enforcing row and column numbers
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>Well Indices</td>
 *       <td>
 *          WellValidation.validateWellIndex<br>
 *          WellValidation.validateRow<br>
 *          WellValidation.validateRowInteger<br>
 *          WellValidation.validateRowString<br>
 *          WellValidation.parseRow<br>
 *          WellValidation.validateColumn
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *       <td>
 *          Validates a well index string (e.g. A1)<br>
 *          Validates a row number or string<br>
 *          Validates a row number<br>
 *          Validates a row string<br>
 *          Parses the row string and returns the row number<br>
 *          Validates a column number
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>Plate Type Flag</td>
 *       <td>
 *          PlateValidation.validatePlateType<br>
 *          PlateValidation.plateType
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *       <td>
 *          Validates the plate type flag<br>
 *          Parses the plate type and returns the row and column number
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>Function Arguments</td>
 *       <td>
 *          Validation.validateArguments<br>
 *          Validation.validateArgumentMaximum<br>
 *          Validation.validateArgumentMinimum<br>
 *          Validation.validateArgumentRange
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *       <td>
 *          Validates an exact number of function arguments<br>
 *          Enforces a maximum number of function arguments<br>
 *          Enforces a minimum number of function arguments<br>
 *          Checks if function argument number is within the valid range
 *          <hr style="margin: 3px; visibility:hidden;"/>
 *       </td>
 *    </tr>
 * </table>
 *
 * @module Utilities
 * @author Jesse L. Mull
 * @version Updated February 17, 2016
 * @license Apache License 2.0
 * @see <a href="http://www.jessemull.com" target="_blank">http://www.jessemull.com</a><br>
 * @see <a href="mailto:hello@jessemull.com">hello@jessemull.com</a>
 */
module.exports = {
   HashSet: require('../util/hashset'),
   PlateValidation: require('../util/platevalidation'),
   Random: require('../util/random'),
   TypedHashSet: require('../util/typedhashset'),
   Validation: require('../util/validation'),
   WellSetValidation: require('../util/wellsetvalidation'),
   WellValidation: require('../util/wellvalidation')
}
