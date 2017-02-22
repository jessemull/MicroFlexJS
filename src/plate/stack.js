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

/*---------------------------------- Exports ---------------------------------*/

module.exports = Stack;

/*------------------------------- Dependencies -------------------------------*/

var Plate = require('./plate');
var Validation = require('../util/validation');
var WellSetValidation = require('../util/wellsetvalidation');
var PlateValidation = require('../util/platevalidation');
var TypedHashSet = require('../util/typedhashset');

/*-------------------------------- Constructor -------------------------------*/

/**
 * This class represents a plate stack, the preferred term in the natural sciences
 * for a collection of micro-plates. The plate stack is initialized using row and
 * column numbers. The plate constructor accepts a flag for plates with standard
 * dimensions:
 *
 * <table cellspacing="10px" style="text-align:left; margin: 20px;">
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 5px;">Plate Type<div></th>
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 5px;">Flag</div></th>
 *    <tr>
 *       <td>6-Well</td>
 *       <td>PLATE_6WELL</td>
 *    </tr>
 *    <tr>
 *       <td>12-Well</td>
 *       <td>PLATE_12WELL</td>
 *    </tr>
 *    <tr>
 *       <td>24-Well</td>
 *       <td>PLATE_24WELL</td>
 *    </tr>
 *    <tr>
 *       <td>48-Well</td>
 *       <td>PLATE_48WELL</td>
 *    </tr>
 *    <tr>
 *       <td>96-Well</td>
 *       <td>PLATE_96WELL</td>
 *    </tr>
 *    <tr>
 *       <td>384-Well</td>
 *       <td>PLATE_384WELL</td>
 *    </tr>
 *    <tr>
 *       <td>1536-Well</td>
 *       <td>PLATE_1536WELL</td>
 *    </tr>
 * </table>
 *
 * Each plate in the stack must adhere to the stack dimensions. Plates are housed
 * within an ordered set using the plate name as the key. Therefore, two plates with
 * the same name cannot be members of the same stack.
 *
 * <br><br>
 *
 * In addition to functions common to set data structures, the stack object can
 * partition plates into subsets using plate indices. Plates can be accessed by
 * name and the stack implementation includes an iterator which iterates over the
 * plates in the stack using a for...of loop.
 *
 * <br><br>
 *
 * The well set object constructor accepts arguments in the following formats:
 *
 * <table class="mytable" cellspacing="10px" style="text-align:left; margin: 20px;">
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 5px;">Arguments<div></th>
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 5px;">Example<div></th>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td><span style="color: purple;">Plate</span></td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td><span style="color: purple;">var</span> plate = <span style="color: purple;">new</span> <span style="color: chocolate;">Plate</span>(<span style="color: maroon;">Stack.PLATE_96WELL</span>)</td>
 *             </tr>
 *             <tr>
 *                <td><span style="color: purple;">var</span> stack = <span style="color: purple;">new</span> <span style="color: chocolate;">Stack</span>(<span style="color: maroon;">plate</span>)</td>
 *             </tr>
 *             <tr><td>&nbsp;</td></tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td><span style="color: purple;">Plate, Label</span></td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td><span style="color: purple;">var</span> plate = <span style="color: purple;">new</span> <span style="color: chocolate;">Plate</span>(<span style="color: maroon;">Stack.PLATE_96WELL</span>)</td>
 *             </tr>
 *             <tr>
 *                <td><span style="color: purple;">var</span> stack = <span style="color: purple;">new</span> <span style="color: chocolate;">Stack</span>(<span style="color: maroon;">plate, "Example Stack"</span>)</td>
 *             </tr>
 *             <tr><td>&nbsp;</td></tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td><span style="color: purple;">Plate Type</span></td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td><span style="color: purple;">var</span> stack = <span style="color: purple;">new</span> <span style="color: chocolate;">Stack</span>(<span style="color: maroon;">Stack.PLATE_96WELL</span>)</td>
 *             </tr>
 *             <tr><td>&nbsp;</td></tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td><span style="color: purple;">Plate Type, Label</span></td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td><span style="color: purple;">var</span> stack = <span style="color: purple;">new</span> <span style="color: chocolate;">Stack</span>(<span style="color: maroon;">Stack.PLATE_96WELL</span>, <span style="color: maroon;">"Example Set"</span>)</td>
 *             </tr>
 *             <tr><td>&nbsp;</td></tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td><span style="color: purple;">Plate Array</span></td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td><span style="color: purple;">var</span> array = [<span style="color: purple;">new</span> <span style="color: chocolate;">plate</span>(<span style="color: maroon;">Plate.PLATE_96WELL</span>), <span style="color: purple;">new</span> <span style="color: chocolate;">Plate</span>(<span style="color: maroon;">Plate.PLATE_96WELL</span>), <span style="color: purple;">new</span> <span style="color: chocolate;">Plate</span>(<span style="color: maroon;">Plate.PLATE_96WELL</span>)]</td>
 *             </tr>
 *             <tr>
 *                <td><span style="color: purple;">var</span> stack = <span style="color: purple;">new</span> <span style="color: chocolate;">Stack</span>(<span style="color: maroon;">array</span>)</td>
 *             </tr>
 *             <tr><td>&nbsp;</td></tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td><span style="color: purple;">Plate Array, Label</span></td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td><span style="color: purple;">var</span> array = [<span style="color: purple;">new</span> <span style="color: chocolate;">plate</span>(<span style="color: maroon;">Plate.PLATE_96WELL</span>), <span style="color: purple;">new</span> <span style="color: chocolate;">Plate</span>(<span style="color: maroon;">Plate.PLATE_96WELL</span>), <span style="color: purple;">new</span> <span style="color: chocolate;">Plate</span>(<span style="color: maroon;">Plate.PLATE_96WELL</span>)]</td>
 *             </tr>
 *             <tr>
 *                <td><span style="color: purple;">var</span> stack = <span style="color: purple;">new</span> <span style="color: chocolate;">Stack</span>(<span style="color: maroon;">array</span>, <span style="color: maroon;">"Example Stack"</span>)</td>
 *             </tr>
 *             <tr><td>&nbsp;</td></tr>
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
 *                <td><span style="color: purple;">var</span> stack = <span style="color: purple;">new</span> <span style="color: chocolate;">Stack</span>(<span style="color: maroon;">8</span>, <span style="color: maroon;">12</span>)</td>
 *             </tr>
 *             <tr><td>&nbsp;</td></tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td><span style="color: purple;">Row Number, Column Number, Label</span></td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td><span style="color: purple;">var</span> stack = <span style="color: purple;">new</span> <span style="color: chocolate;">Stack</span>(<span style="color: maroon;">8</span>, <span style="color: maroon;">12</span>, <span style="color: maroon;">"Example Stack"</span>)</td>
 *             </tr>
 *             <tr><td>&nbsp;</td></tr>
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
 * @param {(number|number|Plate|Plate[]|Stack)} var1 - plate type | stack row number | initial plate | initial plates | input stack
 * @param {(number|string)} var2 - plate column number | plate label
 * @param {string} var3 - plate label
 */
function Stack(var1, var2, var3, var4) {

   this.plateType = -1;                            // The plate type flag
   this.rows = null;                               // The number of plate rows
   this.columns = null;                            // The number of plate columns
   this.name = "Stack";                            // The stack label
   this.plates = new TypedHashSet("Plate");        // The plates

   switch(arguments.length) {

      case 1: this.initializeOneArgument(var1);
              break;

      case 2: this.initializeTwoArguments(var1, var2);
              break;

      case 3: this.initializeThreeArguments(var1, var2, var3);
              break;

      default: this.typeError();
   }
}

/*----------------------- Constructor Helper Functions -----------------------*/

/**
 * Initializes a stack using one argument.
 * @ignore
 * @param {(number|number|Plate|Plate[]|Stack)} var1 - plate type | stack row number | initial plate | initial plates | input stack
 * @throws {TypeError} on invalid plate input
 */
Stack.prototype.initializeOneArgument = function(var1) {

   var type = Validation.getType(var1);

   if(type === '[object Number]') {

      var parsed = PlateValidation.validatePlateType(var1);

      this.rows = parsed.rows;
      this.columns = parsed.columns;
      this.plateType = var1;

      return;
   }

   if(type === '[object Plate]') {

      WellSetValidation.validatePlate(var1);

      this.rows = var1.rows;
      this.columns = var1.columns;
      this.plateType = var1.plateType;

      this.plates.add(var1);

      return;
   }

   if(type === '[object Array]') {

      PlateValidation.validatePlateArray(var1, var1[0].rows, var1[0].columns);

      this.rows = var1[0].rows;
      this.columns = var1[0].columns;
      this.plateType = var1[0].plateType;

      for(var plate of var1) {
         this.plates.add(plate);
      }

      return;
   }

   if(type === '[object Stack]') {

      PlateValidation.validateStack(var1, var1.rows, var1.columns);

      this.rows = var1.rows;
      this.columns = var1.columns;
      this.plateType = var1.plateType;
      this.name = var1.name;

      for(var plate of var1) {
         this.plates.add(plate);
      }

      return;
   }

   this.typeError();

}

/**
 * Initializes a stack using two arguments.
 * @ignore
 * @param {(number|number|Plate|Plate[])} var1 - plate type | stack row number | initial plate | initial plates
 * @param {(number|string)} var2 - stack column number | stack label
 * @throws {TypeError} on invalid plate input
 */
Stack.prototype.initializeTwoArguments = function(var1, var2) {

   var type1 = Validation.getType(var1);
   var type2 = Validation.getType(var2);

   if(type1 === '[object Plate]' && type2 === '[object String]') {

      WellSetValidation.validatePlate(var1);

      this.plateType = var1.plateType;
      this.rows = var1.rows;
      this.columns = var1.columns;
      this.name = var2;

      this.plates.add(var1);

      return;
   }

   if(type1 === '[object Array]' && type2 === '[object String]') {

      PlateValidation.validatePlateArray(var1, var1[0].rows, var1[0].columns);

      this.rows = var1[0].rows;
      this.columns = var1[0].columns;
      this.plateType = var1[0].plateType;
      this.name = var2;

      for(var plate of var1) {
         this.plates.add(plate);
      }

      return;
   }

   if(type1 === '[object Number]' && type2 === '[object String]') {

      var parsed = PlateValidation.validatePlateType(var1);

      this.rows = parsed.rows;
      this.columns = parsed.columns;
      this.plateType = var1;
      this.name = var2;

      return;
   }

   if(type1 === '[object Number]' && type2 === '[object Number]') {

      Validation.validatePositiveNumber(var1);
      Validation.validatePositiveNumber(var2);

      this.plateType = PlateValidation.plateType(var1, var2);
      this.rows = var1;
      this.columns = var2;

      return;
   }


   this.typeError();

}

/**
 * Initializes a stack using two arguments.
 * @ignore
 * @param {number} var1 - stack row number
 * @param {number} - var2 - stack column number
 * @param {string} - var3 - stack label
 * @throws {TypeError} on invalid plate input
 */
Stack.prototype.initializeThreeArguments = function(var1, var2, var3) {

   if(Validation.getType(var1) === '[object Number]' &&
      Validation.getType(var2) === '[object Number]' &&
      Validation.getType(var3) === '[object String]') {

      Validation.validatePositiveNumber(var1);
      Validation.validatePositiveNumber(var2);

      this.plateType = PlateValidation.plateType(var1, var2);
      this.rows = var1;
      this.columns = var2;
      this.name = var3;

      return;
   }

   this.typeError();

}

/**
 * Throws an error when the plate constructor receives invalid input parameters.
 * @ignore
 * @throws {TypeError} when function is called
 */
Stack.prototype.typeError = function() {
   throw new TypeError("Stack constructor accepts the following combinations of arguments: " + "\n" +
                       "  -> Stack - stack to clone" + "\n" +
                       "  -> number - plate type" + "\n" +
                       "  -> number - plate type, string - stack label" + "\n" +
                       "  -> Plate - initial plate" + "\n" +
                       "  -> Plate - initial plate, string - stack label" + "\n" +
                       "  -> Plate[] - initial plates" + "\n" +
                       "  -> Plate[] - initial plates, string - stack label" + "\n" +
                       "  -> number - row number, number - column number" + "\n" +
                       "  -> number - row number, number - column number, string - stack label" + "\n");
}

/*----------------------- Functions for Adding Plates ------------------------*/

/**
 * Adds plates to the stack if they are not already present. Returns false if the
 * stack remains unchanged. The preferential use of this function when adding
 * plates is recommended in order to avoid errors and maintain data integrity.
 * @param {(Plate|Plate[]|Stack)} input - input plate | input plate array | input stack
 * @returns {boolean} true if this stack is changed as a result of the call
 * @throws {TypeError} on invalid plate input
 */
Stack.prototype.add = function(input) {

   Validation.validateArguments(arguments.length, Stack.prototype.add.length, "Stack.prototype.add");

   switch(Validation.getType(input)) {

      case '[object Plate]': PlateValidation.validatePlate(input, this.rows, this.columns);
                             return this.addPlate(input);

      case '[object Array]': PlateValidation.validatePlateArray(input, this.rows, this.columns);
                             return this.addArray(input);

      case '[object Stack]': PlateValidation.validateStack(input, this.rows, this.columns);
                             return this.addStack(input);

      default:               throw new TypeError("Invalid input type: " + input);
   }
}

/**
 * Adds a plate to the stack if it is not present. If the plate is already present
 * the stack remains unchanged and the function returns false. To avoid errors and
 * maintain data integrity use the add function to add plates to the set.
 * @ignore
 * @param {Plate} plate - input plate
 * @returns {boolean} true if this stack is changed as a result of the call
 */
Stack.prototype.addPlate = function(plate) {
   var toAdd = new Plate(plate);
   return this.plates.add(toAdd);
}

/**
 * For each well in the array this functions adds the plate if it is not already
 * present in the stack. Returns false if the stack remains unchanged. To avoid
 * errors and maintain data integrity use the add function to add wells to the
 * set.
 * @ignore
 * @param {Plate[]} array - input plate array
 * @returns {boolean} true if this stack is changed as a result of the call
 */
Stack.prototype.addArray = function(array) {

   var bool = false;

   for(var plate of array) {

         var toAdd = new Plate(plate);

         if(this.plates.add(toAdd)) {
            bool = true;
         }

   }

   return bool;
}

/**
 * For each plate in the stack this functions adds the plate if it is not already
 * present in the stack. Returns false if the stack remains unchanged. To avoid
 * errors and maintain data integrity use the add function to add plate to the
 * stack.
 * @ignore
 * @param {Stack} stack - input stack
 * @returns {boolean} true if this stack is changed as a result of the call
 */
Stack.prototype.addStack = function(stack) {

   var bool = false;

   for(var plate of stack) {

         var toAdd = new Plate(plate);

         if(this.plates.add(toAdd)) {
            bool = true;
         }

   }

   return bool;
}

/*----------------------- Functions for Removing Plates ----------------------*/

/**
 * Removes the plates from the stack if they are present. Returns false if the
 * stack remains unchanged.
 * @param {(Plate|Plate[]|Stack)} input - input plate | input plate array | input stack
 * @returns {boolean} true if this stack is changed as a result of the call
 * @throws {TypeError} on invalid plate input
 */
Stack.prototype.remove = function(input) {

   Validation.validateArguments(arguments.length, Stack.prototype.remove.length, "Stack.prototype.remove");

   switch(Validation.getType(input)) {

      case '[object Plate]':   PlateValidation.validatePlate(input, this.rows, this.columns);
                               return this.plates.remove(input);

      case '[object Array]':   PlateValidation.validatePlateArray(input, this.rows, this.columns);
                               return this.plates.removeAll(input);

      case '[object Stack]':   PlateValidation.validateStack(input, this.rows, this.columns);
                               return this.plates.removeAll(input.toArray());

      default:                 throw new TypeError("Invalid input type: " + input);

   }

}

/**
 * Removes plates with the input names from the stack if they are present. Returns
 * false if the stack remains unchanged.
 * @param {(string|string[])} names - input name | array of input names
 * @returns {boolean} true if this stack is changed as a result of the call
 * @throws {TypeError} on invalid plate input
 */
Stack.prototype.removeNames = function(names) {

   Validation.validateArguments(arguments.length, Stack.prototype.removeNames.length, "Stack.prototype.removeNames");

   var toRemove = [];

   switch(Validation.getType(names)) {

      case '[object Array]':  for(var plate of this.plates) {
                                 if(names.indexOf(plate.name) > -1) {
                                    toRemove.push(plate);
                                 }
                              }

                              break;

      case '[object String]': for(var plate of this.plates) {
                                 if(plate.name === names) {
                                    toRemove.push(plate);
                                 }
                              }

                              break;

      default:                throw new TypeError("Invalid input type: " + input1);

   }

   return this.plates.removeAll(toRemove);
}

/**
 * Clears the plates from the stack.
 */
Stack.prototype.clear = function() {
   this.plates.clear();
}

/*---------------------- Functions for Retaining Plates ----------------------*/

/**
 * Retains the plates in the stack if they are present. Returns false if the stack
 * remains unchanged.
 * @param {(Plate|Plate[]|Stack)} input - input plate | input plate array | input stack
 * @returns {boolean} true if this stack is changed as a result of the call
 * @throws {TypeError} on invalid plate input
 */
Stack.prototype.retain = function(input) {

   Validation.validateArguments(arguments.length, Stack.prototype.retain.length, "Stack.prototype.retain");

   switch(Validation.getType(input)) {

      case '[object Plate]':   PlateValidation.validatePlate(input, this.rows, this.columns);
                               return this.plates.retain(input);

      case '[object Array]':   PlateValidation.validatePlateArray(input, this.rows, this.columns);
                               return this.plates.retainAll(input);

      case '[object Stack]':   PlateValidation.validateStack(input, this.rows, this.columns);
                               return this.plates.retainAll(input.toArray());

      default:                 throw new TypeError("Invalid input type: " + input);

   }

}

/**
 * Retains the plates in the stack if they are present. Returns false if the
 * stack remains unchanged.
 * @param {(string|string[])} names - input name | input name array
 * @returns {boolean} true if this stack is changed as a result of the call
 * @throws {TypeError} on invalid plate input
 */
Stack.prototype.retainNames = function(names) {

   Validation.validateArguments(arguments.length, Stack.prototype.retainNames.length, "Stack.prototype.retainNames");

   var toRetain = [];

   switch(Validation.getType(names)) {

      case '[object Array]':  for(var plate of this.plates) {
                                 if(names.indexOf(plate.name) > -1) {
                                    toRetain.push(plate);
                                 }
                              }

                              break;

      case '[object String]': for(var plate of this.plates) {
                                 if(plate.name === names) {
                                    toRetain.push(plate);
                                 }
                              }

                              break;

      default:                throw new TypeError("Invalid input type: " + names);

   }

   return this.plates.retainAll(toRetain);
}

/*------------------------ Functions for Plate Lookup ------------------------*/

/**
 * Returns true if the stack contains all the input plates.
 * @param {(Plate|Plate[]|Stack)} input - input plate | input plate array | input stack
 * @returns {boolean} true if the stack contains all the input plates
 * @throws {TypeError} on invalid plate input
 */
Stack.prototype.contains = function(input) {

   Validation.validateArguments(arguments.length, Stack.prototype.contains.length, "Stack.prototype.contains");

   switch(Validation.getType(input)) {

      case '[object Plate]':   PlateValidation.validatePlate(input, input.rows, input.columns);
                               return this.plates.contains(input);

      case '[object Array]':   PlateValidation.validatePlateArray(input, input[0].rows, input[0].columns);
                               return this.plates.containsAll(input);

      case '[object Stack]':   PlateValidation.validateStack(input, input.rows, input.columns);
                               return this.plates.containsAll(input.toArray());

      default:                 throw new TypeError("Invalid input type: " + input);

   }

}

/**
 * Returns true if the stack contains the plates with the input names.
 * @param {(string|string[])} names - input name | input name array
 * @returns {boolean} true if the stack contains plates with all the input names
 * @throws {TypeError} on invalid plate input
 */
Stack.prototype.containsNames = function(names) {

   Validation.validateArguments(arguments.length, Stack.prototype.containsNames.length, "Stack.prototype.containsNames");

   switch(Validation.getType(names)) {

      case "[object Array]":  var array = names.slice();

                              for(var plate of this.plates) {

                                 var index = array.indexOf(plate.name);

                                 if(index > -1) {
                                    array.splice(index, 1);
                                 }

                              }

                              return array.length === 0;

      case "[object String]": for(var plate of this.plates) {

                                 if(plate.name === names) {
                                    return true;
                                 }

                              }

                              return false;

      default: throw new TypeError("Invalid input parameter: " + names);

   }
}

/*----------------------- Functions for Plate Retrieval ----------------------*/

/**
 * Returns the plates if they exist in the set. The preferential use of this
 * function for plate retrieval is recommended in order to avoid errors and
 * maintain data integrity.
 * @param {(Plate|Plate[]|Stack)} input - input plate | input plate array | input stack
 * @returns {Plate[]} the plates that exist in the stack
 * @throws {TypeError} on invalid plate input
 */
Stack.prototype.get = function(input) {

   Validation.validateArguments(arguments.length, Stack.prototype.get.length, "Stack.prototype.get");

   switch(Validation.getType(input)) {

      case '[object Plate]': PlateValidation.validatePlate(input, this.rows, this.columns);
                             return this.getPlate(input);

      case '[object Array]': PlateValidation.validatePlateArray(input, this.rows, this.columns);
                             return this.getArray(input);

      case '[object Stack]': PlateValidation.validateStack(input, this.rows, this.columns);
                             return this.getStack(input);

      default:      throw new TypeError("Invalid input type: " + input);
   }

}

/**
 * Returns the plate if it exists in the stack. To avoid errors and maintain data
 * integrity use the get function for plate retrieval.
 * @ignore
 * @param {Plate} plate - input plate
 * @returns {Plate} the plate if it exists in the stack
 */
Stack.prototype.getPlate = function(plate) {
   if(this.plates.contains(plate)) {
      return this.plates.values[plate];
   } else {
      return [];
   }
}

/**
 * Returns the plates that exist in the stack. To avoid errors and maintain data
 * integrity use the get function for plate retrieval.
 * @ignore
 * @param {Plate[]} array - input plate array
 * @returns {Plate[]} the plates that exist in the stack
 */
Stack.prototype.getArray = function(array) {

   var toReturn = [];

   for(var plate of array) {
      if(this.plates.contains(plate)) {
         toReturn.push(this.plates.values[plate]);
      }
   }

   return toReturn.sort(Plate.prototype.sort);
}

/**
 * Returns the plates that exist in the stack. To avoid errors and maintain data
 * integrity use the get function for plate retrieval.
 * @ignore
 * @param {Stack} stack - input stack
 * @returns {Plate[]} the plates that exist in the stack
 */
Stack.prototype.getStack = function(stack) {

   var toReturn = [];

   for(var plate of stack) {
      if(this.plates.contains(plate)) {
         toReturn.push(this.plates.values[plate]);
      }
   }

   return toReturn.sort(Plate.prototype.sort);
}

/**
 * Returns the plates with the plate names if they exist in the stack.
 * @param {(string|string[])} names - input name | input name array
 * @returns {Plate[]} the plates that exist in the stack
 * @throws {TypeError} on invalid plate input
 */
Stack.prototype.getNames = function(names) {

   Validation.validateArguments(arguments.length, Stack.prototype.getNames.length, "Stack.prototype.getNames");

   var toReturn = [];

   switch(Validation.getType(names)) {

      case '[object Array]':  for(var plate of this.plates) {
                                 if(names.indexOf(plate.name) > -1) {
                                    toReturn.push(plate);
                                 }
                              }

                              break;

      case '[object String]': for(var plate of this.plates) {
                                 if(plate.name === names) {
                                    toReturn.push(plate);
                                 }
                              }

                              break;

      default:                throw new TypeError("Invalid input type: " + names);

   }

   return toReturn;
}

/**
 * Returns the greatest plate in this stack less than or equal to the given plate,
 * or null if there is no such plate.
 * @param {Plate} plate - input plate
 * @returns {Plate} the greatest plate in this stack less than or equal to the input plate
 * @throws {TypeError} on invalid plate input
 */
Stack.prototype.floor = function(plate) {

   Validation.validateArguments(arguments.length, Stack.prototype.floor.length, "Stack.prototype.floor");
   WellSetValidation.validatePlate(plate);

   var values = this.toArray();

   if(values.length === 0 || values[0].compareTo(plate) > 0) {
      return null;
   }

   for(var i = 0; i < values.length; i++) {

      if(values[i].compareTo(plate) === 0) {
         return values[i];
      }

      if(values[i].compareTo(plate) > 0) {
         return values[i - 1];
      }

   }

   return values[values.length - 1];
}

/**
 * Returns the least plate in this stack greater than or equal to the given
 * plate, or null if there is no such plate.
 * @param {Plate} plate - input plate
 * @returns {Plate} the least plate in this stack greater than or equal to the input plate
 * @throws {TypeError} on invalid plate input
 */
Stack.prototype.ceiling = function(plate) {

   Validation.validateArguments(arguments.length, Stack.prototype.ceiling.length, "Stack.prototype.ceiling");
   WellSetValidation.validatePlate(plate);

   var values = this.toArray();

   if(values.length === 0) {
      return null;
   }

   if(values[0].compareTo(plate) > 0) {
      return values[0];
   }

   for(var i = 0; i < values.length; i++) {

      if(values[i].compareTo(plate) >= 0) {
         return values[i];
      }

   }

   return null;
}

/**
 * Returns an array of the portion of this stack whose plates are greater than or
 * equal to the plate, index or plate name.
 * @param {(Plate|number|string)} plate - input plate | input plate index | input plate name
 * @returns {Stack} the tail stack
 * @throws {TypeError} on invalid plate input
 */
Stack.prototype.tailStack = function(plate) {
   Validation.validateArguments(arguments.length, Stack.prototype.tailStack.length, "Stack.prototype.tailStack");
   return this.subStack(plate, this.size());
}

/**
 * Returns an array of the portion of this stack whose plates are less than or
 * equal to the plate, index or plate name.
 * @param {(Plate|number|string)} plate - input plate | input plate index | input plate name
 * @returns {Stack} the head stack
 * @throws {TypeError} on invalid plate input
 */
Stack.prototype.headStack = function(plate) {
   Validation.validateArguments(arguments.length, Stack.prototype.headStack.length, "Stack.prototype.headStack");
   return this.subStack(0, plate);
}

/**
 * Returns the greatest plate in this stack less than the given plate, or null if
 * there is no such plate.
 * @param {Plate} plate - input plate
 * @returns {Plate} the greatest plate in this stack less than the input plate
 * @throws {TypeError} on invalid plate input
 */
Stack.prototype.lower = function(plate) {

   Validation.validateArguments(arguments.length, Stack.prototype.lower.length, "Stack.prototype.lower");
   WellSetValidation.validatePlate(plate);

   var values = this.toArray();


   if(values.length === 0 || values[0].compareTo(plate) >= 0) {
      return null;
   }

   for(var i = 0; i < values.length; i++) {

      if(values[i].compareTo(plate) >= 0) {
         return values[i - 1];
      }

   }

   return values[values.length - 1];
}

/**
 * Returns the greatest plate in this stack less than the plate with the input name,
 * or null if there is no such plate.
 * @param {string} name - input plate name
 * @returns {Plate} the greatest plate in this stack less than the input plate
 * @throws {TypeError} on invalid plate input
 */
Stack.prototype.lowerName = function(name) {

   Validation.validateArguments(arguments.length, Stack.prototype.lowerName.length, "Stack.prototype.lowerName");
   Validation.validateString(plate);

   var values = this.toArray();

   if(values[0].name === name) {
      return null;
   }

   for(var i = 1; i < values.length; i++) {

      if(values[i].name === name) {
         return values[i - 1];
      }

   }

   return null;
}

/**
 * Returns the least plate in this stack greater than the given plate, or null if
 * there is no such plate.
 * @param {Plate} plate - input plate
 * @returns {Plate} the least plate in this stack greater than the input plate
 * @throws {TypeError} on invalid plate input
 */
Stack.prototype.higher = function(plate) {

   Validation.validateArguments(arguments.length, Stack.prototype.higher.length, "Stack.prototype.higher");
   WellSetValidation.validatePlate(plate);

   var values = this.toArray();

   if(values.length === 0) {
      return null;
   }

   if(values[0].compareTo(plate) > 0) {
      return values[0];
   }

   for(var i = 0; i < values.length; i++) {

      if(values[i].compareTo(plate) > 0) {
         return values[i];
      }

   }

   return null;
}

/**
 * Returns the least plate in this stack greater than the plate with the input name,
 * or null if there is no such plate.
 * @param {string} name - input plate name
 * @returns {Plate} the least plate in this stack greater than the input plate
 * @throws {TypeError} on invalid plate input
 */
Stack.prototype.higherName = function(name) {

   Validation.validateArguments(arguments.length, Stack.prototype.lower.length, "Stack.prototype.lower");
   Validation.validateString(plate);

   var values = this.toArray();

   if(values[values.length - 1].name === name) {
      return null;
   }

   for(var i = 0; i < values.length - 1; i++) {

      if(values[i].name === name) {
         return values[i + 1];
      }

   }

   return null;
}

/**
 * Returns the first plate in the stack.
 * @returns {Plate} the first plate in the stack or null if the stack is empty
 */
Stack.prototype.first = function() {
   return this.plates.size() > 0 ? this.toArray()[0] : null;
}

/**
 * Returns the last plate in the stack.
 * @returns {Plate} the last plate in the stack or null if the stack is empty
 */
Stack.prototype.last = function() {
   var array = this.toArray();
   return array.length > 0 ? array[array.length - 1] : null;
}

/**
 * Returns the plates between the beginning and ending indices.
 * @param {(number|string|Plate)} begin - beginning index | beginning plate name | beginning plate
 * @param {(number|string|Plate)} end - ending index | ending plate name | ending plate
 * @returns {Plate[]} the plate array containing the subset of plates
 * @throws {TypeError} on invalid plate input
 */
Stack.prototype.subArray = function(begin, end) {

   Validation.validateArguments(arguments.length, Stack.prototype.subArray.length, "Stack.prototype.subArray");

   var array = this.toArray();
   var startIndex = 0;
   var endIndex = array.length - 1;

   switch(Validation.getType(begin)) {

      case '[object Plate]':   WellSetValidation.validatePlate(begin);
                               var index = array.indexOf(this.ceiling(begin));

                               if(index < 0) {

                                  if(begin.compareTo(array[array.length - 1]) > 0) {
                                     return [];
                                  }

                               } else {
                                  startIndex = index;
                               }

                               break;

      case '[object String]':  begin = this.getNames(begin);

                               if(begin.length === 0) {
                                  return [];
                               }

                               var index = array.indexOf(this.ceiling(begin[0]));

                               if(index < 0) {

                                  if(begin.compareTo(array[array.length - 1]) > 0) {
                                     return [];
                                  }

                               } else {
                                  startIndex = index;
                               }

                               break;

      case '[object Number]':  if(begin > 0) {
                                  startIndex = begin;
                               }

                               break;

      default: throw new TypeError("Invalid parameter type: " + begin);

   }

   switch(Validation.getType(end)) {

      case '[object Plate]':   WellSetValidation.validatePlate(end);
                               var index = array.indexOf(this.floor(end));

                               if(index < 0) {

                                  if(end.compareTo(array[0]) < 0) {
                                     return [];
                                  }

                               } else {
                                  endIndex = index;
                               }

                               break;

      case '[object String]':  end = this.getNames(end);

                               if(end.length === 0) {
                                  return [];
                               }

                               var index = array.indexOf(this.floor(end[0]));

                               if(index < 0) {

                                  if(end.compareTo(array[0]) < 0) {
                                     return [];
                                  }

                               } else {
                                  endIndex = index;
                               }

                               break;

      case '[object Number]':  if(end < array.length) {
                                  endIndex = end;
                               }

                               break;

      default: throw new TypeError("Invalid parameter type: " + end);

   }

   if(startIndex < 0 || endIndex < 0 || begin >= array.length || end < 0) {
      return [];
   }

   return array.splice(startIndex, endIndex - startIndex + 1);
}

/**
 * Returns a stack with the plates between the beginning and ending indices.
 * @param {(number|string|Plate)} begin - beginning index | beginning plate name | beginning plate
 * @param {(number|string|Plate)} end - ending index | ending plate name | ending plate
 * @returns {Stack} the plate stack containing the subset of plates
 * @throws {TypeError} on invalid plate input
 */
Stack.prototype.subStack = function(begin, end) {

   Validation.validateArguments(arguments.length, Stack.prototype.subStack.length, "Stack.prototype.subStack");
   var array = this.subArray(begin, end);

   return new Stack(array, this.name);
}

/*--------------------------- Additional Functions ---------------------------*/

Stack.prototype[Symbol.iterator] = function() {
   return this.plates[Symbol.iterator]();
}

/**
 * Returns the number of rows in the stack.
 * @returns {number} the rows in the stack
 */
Stack.prototype.rowNumber = function() {
   return this.rows;
}

/**
 * Returns the number of columns in the stack.
 * @returns {number} the columns in the stack
 */
Stack.prototype.columnNumber = function() {
   return this.columns;
}

/**
 * Returns the plate type flag.
 * @returns {number} the plate type flag
 */
Stack.prototype.type = function() {
   return this.plateType;
}

/**
 * Sets the stack label.
 * @param {string} the new stack label
 */
Stack.prototype.setLabel = function(label) {
   this.name = label;
}

/**
 * Returns the stack label
 * @returns {string} the stack label
 */
Stack.prototype.label = function() {
   return this.name;
}

/**
 * Returns the size of the stack.
 * @returns {number} the stack size
 */
Stack.prototype.size = function() {
   return this.plates.size();
}

/**
 * Returns true if the stack is empty.
 * @returns {boolean} true if the stack is empty
 */
Stack.prototype.isEmpty = function() {
   return this.plates.size() === 0;
}

/**
 * Returns a sorted array containing the plates in the stack.
 * @returns {Plate[]} a sorted array containing the plates in the stack
 */
Stack.prototype.toArray = function() {
   var array = this.plates.toArray();
   return array.sort(Plate.prototype.sort);
}

/**
 * Returns a type hash set containing the plates in the stack.
 * @returns {TypedHashSet} typed set containing the stack plates
 */
Stack.prototype.toSet = function() {
   return this.plates;
}

/**
 * Returns an array holding the plate names.
 * @returns {string[]} an array containing the stack plate names
 */
Stack.prototype.toNameArray = function() {

   var names = [];

   for(var plate of this.plates) {
      names.push(plate.name);
   }

   return names;
}
