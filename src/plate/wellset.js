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

 var Well = require('./well');
 var TypedHashSet = require('../util/typedhashset');
 var Validation = require('../util/validation');
 var WellValidation = require('../util/wellvalidation');
 var WellSetValidation = require('../util/wellsetvalidation');

/*---------------------------------- Exports ---------------------------------*/

module.exports = WellSet;

/*-------------------------------- Constructor -------------------------------*/

/**
 * This class represents a set of wells. A well set cannot contain duplicate wells.
 * However, the well set object does not enforce valid row or column numbers. This
 * logic is contained within the plate class, a specialized extension of the well
 * set.
 *
 * <br><br>
 *
 * Wells are housed within the object as an ordered set, and the add, remove and
 * contains functions exhibit log n time. Wells are ordered by well row and
 * column. In addition to functions common to set data structures, the well set
 * can partition wells into subsets using indices.
 *
 * <br><br>
 *
 * Wells can be accessed by row and column numbers or by well index strings. In
 * addition, the well set implementation includes an iterator which iterates over
 * the wells in the set using a for...of loop.
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
 *                <td><span style="color: purple;">No Arguments</span></td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td><span style="color: purple;">var</span> set = <span style="color: purple;">new</span> <span style="color: chocolate;">WellSet</span>()</td>
 *             </tr>
 *             <tr><td>&nbsp;</td></tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td><span style="color: purple;">Label</span></td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td><span style="color: purple;">var</span> set = <span style="color: purple;">new</span> <span style="color: chocolate;">WellSet</span>(<span style="color: maroon;">"Example WellSet"</span>)</td>
 *             </tr>
 *             <tr><td>&nbsp;</td></tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td><span style="color: purple;">Well</span></td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td><span style="color: purple;">var</span> well = <span style="color: purple;">new</span> <span style="color: chocolate;">Well</span>(<span style="color: maroon;">'A1'</span>)</td>
 *             </tr>
 *             <tr>
 *                <td><span style="color: purple;">var</span> set = <span style="color: purple;">new</span> <span style="color: chocolate;">WellSet</span>(<span style="color: maroon;">well</span>)</td>
 *             </tr>
 *             <tr><td>&nbsp;</td></tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td><span style="color: purple;">Well, Label</span></td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td><span style="color: purple;">var</span> well = <span style="color: purple;">new</span> <span style="color: chocolate;">Well</span>(<span style="color: maroon;">'A1'</span>)</td>
 *             </tr>
 *             <tr>
 *                <td><span style="color: purple;">var</span> set = <span style="color: purple;">new</span> <span style="color: chocolate;">WellSet</span>(<span style="color: maroon;">well</span>, <span style="color: maroon;">"Example WellSet"</span>)</td>
 *             </tr>
 *             <tr><td>&nbsp;</td></tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td><span style="color: purple;">Well Array</span></td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td><span style="color: purple;">var</span> array = [<span style="color: purple;">new</span> <span style="color: chocolate;">Well</span>(<span style="color: maroon;">'A1'</span>), <span style="color: purple;">new</span> <span style="color: chocolate;">Well</span>(<span style="color: maroon;">'B2'</span>), <span style="color: purple;">new</span> <span style="color: chocolate;">Well</span>(<span style="color: maroon;">'C5'</span>)]</td>
 *             </tr>
 *             <tr>
 *                <td><span style="color: purple;">var</span> set = <span style="color: purple;">new</span> <span style="color: chocolate;">WellSet</span>(<span style="color: maroon;">array</span>)</td>
 *             </tr>
 *             <tr><td>&nbsp;</td></tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td><span style="color: purple;">Well Array, Label</span></td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td><span style="color: purple;">var</span> array = [<span style="color: purple;">new</span> <span style="color: chocolate;">Well</span>(<span style="color: maroon;">'A1'</span>), <span style="color: purple;">new</span> <span style="color: chocolate;">Well</span>(<span style="color: maroon;">'B2'</span>), <span style="color: purple;">new</span> <span style="color: chocolate;">Well</span>(<span style="color: maroon;">'C5'</span>)]</td>
 *             </tr>
 *             <tr>
 *                <td><span style="color: purple;">var</span> set = <span style="color: purple;">new</span> <span style="color: chocolate;">WellSet</span>(<span style="color: maroon;">array</span>, <span style="color: maroon;">"Example WellSet"</span>)</td>
 *             </tr>
 *             <tr><td>&nbsp;</td></tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td><span style="color: purple;">WellSet</span></td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td><span style="color: purple;">var</span> array = [<span style="color: purple;">new</span> <span style="color: chocolate;">Well</span>(<span style="color: maroon;">'A1'</span>), <span style="color: purple;">new</span> <span style="color: chocolate;">Well</span>(<span style="color: maroon;">'B2'</span>), <span style="color: purple;">new</span> <span style="color: chocolate;">Well</span>(<span style="color: maroon;">'C5'</span>)]</td>
 *             </tr>
 *             <tr>
 *                <td><span style="color: purple;">var</span> set = <span style="color: purple;">new</span> WellSet(<span style="color: maroon;">array</span>)</td>
 *             </tr>
 *             <tr>
 *                <td><span style="color: purple;">var</span> set = <span style="color: purple;">new</span> <span style="color: chocolate;">WellSet</span>(<span style="color: maroon;">set</span>)</td>
 *             </tr>
 *             <tr><td>&nbsp;</td></tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td><span style="color: purple;">WellSet, Label</span></td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td><span style="color: purple;">var</span> array = [<span style="color: purple;">new</span> <span style="color: chocolate;">Well</span>(<span style="color: maroon;">'A1'</span>), <span style="color: purple;">new</span> <span style="color: chocolate;">Well</span>(<span style="color: maroon;">'B2'</span>), <span style="color: purple;">new</span> <span style="color: chocolate;">Well</span>(<span style="color: maroon;">'C5'</span>)]</td>
 *             </tr>
 *             <tr>
 *                <td><span style="color: purple;">var</span> set = <span style="color: purple;">new</span> WellSet(<span style="color: maroon;">array</span>)</td>
 *             </tr>
 *             <tr>
 *                <td><span style="color: purple;">var</span> set = <span style="color: purple;">new</span> <span style="color: chocolate;">WellSet</span>(<span style="color: maroon;">set</span>, <span style="color: maroon;">"Example WellSet"</span>)</td>
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
 * @param {(Well|Well[]|WellSet|string)} [var1] - initial wells | set label
 * @param {string} [label] - set label
 * @throws {TypeError} on invalid number of arguments
 */
function WellSet(var1, var2) {

   this.name = "WellSet";                    // The well set label
   this.wells = new TypedHashSet("Well");    // The wells in the set

   switch(arguments.length) {

      case 0: break;

      case 1: if(Validation.getType(var1) === '[object Well]' || Validation.getType(var1) === '[object Array]') {
                 this.add(var1);
              } else if(Validation.getType(var1) === '[object WellSet]') {
                 this.add(var1);
                 Validation.validateString(var1.name);
                 this.name = var1.name;
              } else if(Validation.getType(var1) === '[object String]') {
                 this.name = var1;
              } else {
                 this.typeError();
              }

              break;

      case 2: if((Validation.getType(var1) === '[object Well]' || Validation.getType(var1) === '[object Array]' ||
                  Validation.getType(var1) === '[object WellSet]') && Validation.getType(var2) === '[object String]') {
                 this.add(var1);
                 Validation.validateString(var2);
                 this.name = var2;
              } else {
                 this.typeError();
              }
              break;

      default: typeError();
   }

}

/*----------------------- Constructor Helper Functions -----------------------*/

/**
 * Throws an error when the set constructor receives invalid input parameters.
 * @ignore
 * @throws {TypeError} when the function is called
 */
 WellSet.prototype.typeError = function() {
    throw new TypeError("Well set constructor accepts the following combinations of arguments: " + "\n" +
                        "  -> No arguments" + "\n" +
                        "  -> Well - initial well" + "\n" +
                        "  -> Well[] - initial wells" + "\n" +
                        "  -> WellSet - well set to clone" + "\n" +
                        "  -> string - the well set label" + "\n" +
                        "  -> Well - initial well, string - the well set label" + "\n" +
                        "  -> Well[] - initial wells, string - the well set label" + "\n" +
                        "  -> WellSet - well set to clone, string - the well set label" + "\n");
}

/*------------------------ Functions for Adding Wells ------------------------*/

/**
 * Adds wells to the set if they are not already present. Returns false if the set
 * remains unchanged. The preferential use of this function when adding wells is
 * recommended in order to avoid errors and maintain data integrity.
 * @param {(Well|Well[]|WellSet)} input - input well | input well array | input well set
 * @returns {boolean} true if this set is changed as a result of the call
 * @throws {TypeError} on invalid well input
 */
WellSet.prototype.add = function(input) {

   Validation.validateArguments(arguments.length, WellSet.prototype.add.length, "WellSet.prototype.add");

   switch(Validation.getType(input)) {

      case '[object Well]':    WellValidation.validateWell(input);
                               return this.addWell(input);

      case '[object Array]':   WellSetValidation.validateWellArray(input);
                               return this.addArray(input);

      case '[object WellSet]': WellSetValidation.validateWellSet(input);
                               return this.addSet(input);

      case '[object Plate]':   WellSetValidation.validatePlate(input);
                               return this.addSet(input.toArray());

      default:                 throw new TypeError("Invalid input type: " + input);
   }
}

/**
 * Adds a well to the set if it is not present. If the well is already present
 * the set remains unchanged and the function returns false. To avoid errors and
 * maintain data integrity use the add function to add wells to the set.
 * @ignore
 * @param {Well} well - input well
 * @returns {boolean} true if this set is changed as a result of the call
 */
WellSet.prototype.addWell = function(well) {
   var toAdd = new Well(well);
   return this.wells.add(well);
}

/**
 * For each well in the array this functions adds the well if it is not already
 * present in the set. Returns false if the set remains unchanged. To avoid errors
 * and maintain data integrity use the add function to add wells to the set.
 * @ignore
 * @param {Well[]} array - input well array
 * @returns {boolean} true if this set is changed as a result of the call
 */
WellSet.prototype.addArray = function(array) {

   var bool = false;

   for(var well of array) {

         var toAdd = new Well(well);

         if(this.wells.add(toAdd)) {
            bool = true;
         }

   }

   return bool;
}

/**
 * For each well in the well set this functions adds the well if it is not already
 * present in the set. Returns false if the set remains unchanged. To avoid errors
 * and maintain data integrity use the add function to add wells to the set.
 * @ignore
 * @param {WellSet} set - input set
 * @returns {boolean} true if this set is changed as a result of the call
 */
WellSet.prototype.addSet = function(set) {

   var bool = false;

   for(var well of set) {

         var toAdd = new Well(well);

         if(this.wells.add(toAdd)) {
            bool = true;
         }

   }

   return bool;
}

/*----------------------- Functions for Removing Wells -----------------------*/

/**
 * Removes wells from the set if they are present. Returns false if the set remains
 * unchanged.
 * @param {(Well|Well[]|WellSet|string|string[])} input1 - input well | input well array | input well set | well index or delimiter separated list of wells | array of well indices
 * @param {string} [input2] - the list delimiter
 * @returns {boolean} true if this set is changed as a result of the call
 * @throws {TypeError} on invalid well input
 */
WellSet.prototype.remove = function(input1, input2) {

   if(arguments.length === 1) {

      switch(Validation.getType(input1)) {

         case '[object Well]':    WellValidation.validateWell(input1);
                                  return this.wells.remove(input1);

         case '[object String]':  WellValidation.validateWellIndex(input1);
                                  return this.wells.remove(input1);

         case '[object Array]':   WellSetValidation.validateWellOrIndexArray(input1);
                                  return this.wells.removeAll(input1);

         case '[object WellSet]': WellSetValidation.validateWellSet(input1);
                                  return this.wells.removeAll(input1.toArray());

         case '[object Plate]':   WellSetValidation.validatePlate(input1);
                                  return this.wells.removeAll(input1.toArray());

         default:                 throw new TypeError("Invalid input type: " + input1);
      }

   } else if(arguments.length === 2 && Validation.getType(input1) === '[object String]' && Validation.getType(input2) === '[object String]') {

      var split = input1.split(input2);

      for(var i = 0; i < split.length; i++) {
         split[i] = split[i].trim();
         WellValidation.validateWellIndex(split[i]);
      }

      return this.wells.removeAll(split);

   } else {

      throw new TypeError("Invalid input parameters: " + arguments);

   }
}

/**
 * Clears the wells from the set.
 */
WellSet.prototype.clear = function() {
   this.wells.clear();
}

/*----------------------- Functions for Retaining Wells ----------------------*/

/**
 * Retains the input wells. Return true if all the input wells were retained. The
 * preferential use of this function for well retention is recommended in order to
 * avoid errors and maintain data integrity.
 * @param {(Well|Well[]|WellSet|string|string[])} input1 - input well | input well array | input well set | well index or delimiter separated list of wells | array of well indices
 * @param {string} [input2] - list delimiter
 * @returns {boolean} true if all wells were retained
 * @throws {TypeError} on invalid well input
 */
WellSet.prototype.retain = function(input1, input2) {

   if(arguments.length === 1) {

      switch(Validation.getType(input1)) {

         case '[object Well]':    WellValidation.validateWell(input1);
                                  return this.wells.retain(input1);

         case '[object String]':  WellValidation.validateWellIndex(input1);
                                  return this.wells.retain(input1);

         case '[object Array]':   WellSetValidation.validateWellOrIndexArray(input1);
                                  return this.wells.retainAll(input1);

         case '[object WellSet]': WellSetValidation.validateWellSet(input1);
                                  return this.wells.retainAll(input1.toArray());

         case '[object Plate]':   WellSetValidation.validatePlate(input1);
                                  return this.wells.retainAll(input1.toArray());

         default:                 throw new TypeError("Invalid input type: " + input1);
      }

   } else if(arguments.length === 2 && Validation.getType(input1) === '[object String]' && Validation.getType(input2) === '[object String]') {

      var split = input1.split(input2);

      for(var i = 0; i < split.length; i++) {
         split[i] = split[i].trim();
         WellValidation.validateWellIndex(split[i]);
      }

      return this.wells.retainAll(split);

   } else {

      throw new TypeError("Invalid input parameters: " + arguments);

   }
}

/*------------------------- Functions for Well Lookup ------------------------*/

/**
 * Returns true if the input wells exist in the well set.
 * @param {(Well|Well[]|WellSet|string|string[])} input1 - input well | input well array | input well set | well index or delimiter separated list of wells | array of well indices
 * @param {string} [input2] - list delimiter
 * @returns {boolean} true if the input wells exist in the well sets
 * @throws {TypeError} on invalid well input
 */
WellSet.prototype.contains = function(input1, input2) {

   if(arguments.length === 1) {

      switch(Validation.getType(input1)) {

         case '[object Well]':    WellValidation.validateWell(input1);
                                  return this.wells.contains(input1);

         case '[object String]':  WellValidation.validateWellIndex(input1);
                                  return this.wells.contains(input1);

         case '[object Array]':   WellSetValidation.validateWellOrIndexArray(input1);
                                  return this.wells.containsAll(input1);

         case '[object WellSet]': WellSetValidation.validateWellSet(input1);
                                  return this.wells.containsAll(input1.toArray());

         case '[object Plate]':   WellSetValidation.validatePlate(input1);
                                  return this.wells.containsAll(input1.toArray());

         default:                 throw new TypeError("Invalid input type: " + input1);
      }

   } else if(arguments.length === 2 && Validation.getType(input1) === '[object String]' && Validation.getType(input2) === '[object String]') {

      var split = input1.split(input2);

      for(var i = 0; i < split.length; i++) {
         split[i] = split[i].trim();
         WellValidation.validateWellIndex(split[i]);
      }

      return this.wells.containsAll(split);

   } else {

      throw new TypeError("Invalid input parameters: " + arguments);

   }

}

/*----------------------- Functions for Well Retrieval -----------------------*/

/**
 * Returns the wells if they exist in the set. The preferential use of this
 * function for well retrieval is recommended in order to avoid errors and
 * maintain data integrity.
 * @param {(Well|Well[]|WellSet|string|string[])} input1 - input well | input well array | input well set | well index or delimiter separated list of wells | array of well indices
 * @param {string} [input2] - list delimiter
 * @returns {(Well|Well[])} wells that exist in the set
 * @throws {TypeError} on invalid well or well index input
 */
WellSet.prototype.get = function(input1, input2) {

   if(arguments.length === 1) {

      switch(Validation.getType(input1)) {

         case '[object Well]':    WellValidation.validateWell(input1);
                                  return this.getWell(input1);

         case '[object String]':  WellValidation.validateWellIndex(input1);
                                  return this.getWell(input1);

         case '[object Array]':   WellSetValidation.validateWellOrIndexArray(input1);
                                  return this.getArray(input1);

         case '[object WellSet]': WellSetValidation.validateWellSet(input1);
                                  return this.getSet(input1);

         case '[object Plate]':   WellSetValidation.validatePlate(input1);
                                  return this.getArray(input1.toArray());

         default:      throw new TypeError("Invalid input type: " + input1);
      }

   } else if(arguments.length === 2 && Validation.getType(input1) === '[object String]' && Validation.getType(input2) === '[object String]') {

      return this.getList(input1, input2);

   } else {

      throw new TypeError("Invalid input parameters: " + arguments);

   }

}

/**
 * Returns the well if it exists in the set. To avoid errors and maintain data
 * integrity use the get function for well retrieval.
 * @ignore
 * @param {(Well|string)} well - the well | the well index
 * @returns {Well} the well if it exists in the set
 */
WellSet.prototype.getWell = function(well) {
   if(this.wells.contains(well)) {
      return this.wells.values[well];
   };
}

/**
 * Returns the wells that exist in the set. To avoid errors and maintain data
 * integrity use the get function for well retrieval.
 * @ignore
 * @param {(Well[]|string[])} array - array of wells | array of well indices
 * @returns {Well[]} the wells that exist in the set
 */
WellSet.prototype.getArray = function(array) {

   var toReturn = [];

   for(var well of array) {
      if(this.wells.contains(well)) {
         toReturn.push(this.wells.values[well]);
      }
   }

   return toReturn.sort(Well.prototype.sort);
}

/**
 * Returns the wells that exist in the set. To avoid errors and maintain data
 * integrity use the get function for well retrieval.
 * @ignore
 * @param {WellSet} set - the well set
 * @returns {Well[]} the wells that exist in the set
 */
WellSet.prototype.getSet = function(set) {

   var toReturn = [];

   for(var well of set) {
      if(this.wells.contains(well)) {
         toReturn.push(this.wells.values[well]);
      }
   }

   return toReturn.sort(Well.prototype.sort);
}

/**
 * Returns the wells that exist in the set. To avoid errors and maintain data
 * integrity use the get function for well retrieval.
 * @ignore
 * @param {string} list - delimiter separated list of well indices
 * @param {string} delimiter - list delimiter
 * @returns {Well[]} the wells that exist in the set
 */
WellSet.prototype.getList = function(list, delimiter) {

   var toReturn = [];
   var split = list.split(delimiter);

   for(var well of split) {

      var trimmed = well.trim();

      if(this.wells.contains(trimmed)) {
         toReturn.push(this.wells.values[trimmed]);
      }
   }

   return toReturn.sort(Well.prototype.sort);
}

/**
 * Returns the greatest well in this set less than or equal to the given well, or
 * null if there is no such well.
 * @param {(Well|string)} well - input well | well index
 * @returns {Well} the greatest well in this set less than or equal to the input well
 * @throws {TypeError} on invalid well input
 */
WellSet.prototype.floor = function(well) {

   Validation.validateArguments(arguments.length, WellSet.prototype.floor.length, "WellSet.prototype.floor");

   var values = this.toArray();

   try {
      var wellObject = new Well(well);
   } catch(err) {
      throw new TypeError("Invalid well or index: " + well);
   }

   if(values.length === 0 || values[0].compareTo(wellObject) > 0) {
      return null;
   }

   for(var i = 0; i < values.length; i++) {

      if(values[i].compareTo(wellObject) === 0) {
         return values[i];
      }

      if(values[i].compareTo(well) > 0) {
         return values[i - 1];
      }

   }

   return values[values.length - 1];
}


/**
 * Returns the least well in this set greater than or equal to the given
 * well, or null if there is no such well.
 * @param {(Well|string)} well - input well | well index
 * @returns {Well} the least well in this set greater than or equal to the input well
 * @throws {TypeError} on invalid well input
 */
WellSet.prototype.ceiling = function(well) {

   Validation.validateArguments(arguments.length, WellSet.prototype.ceiling.length, "WellSet.prototype.ceiling");

   var values = this.toArray();

   try {
      var wellObject = new Well(well);
   } catch(err) {
      throw new TypeError("Invalid well or index: " + well);
   }

   if(values.length === 0) {
      return null;
   }

   if(values[0].compareTo(wellObject) > 0) {
      return values[0];
   }

   for(var i = 0; i < values.length; i++) {

      if(values[i].compareTo(well) >= 0) {
         return values[i];
      }

   }

   return null;
}

/**
 * Returns the greatest well in this set less than the given well, or null if
 * there is no such well.
 * @param {(Well|string)} well - input well | well index
 * @returns {Well} the greatest well in this set less than the input well
 * @throws {TypeError} on invalid well input
 */
WellSet.prototype.lower = function(well) {

   Validation.validateArguments(arguments.length, WellSet.prototype.lower.length, "WellSet.prototype.lower");

   var values = this.toArray();

   try {
      var wellObject = new Well(well);
   } catch(err) {
      throw new TypeError("Invalid well or index: " + well);
   }

   if(values.length === 0 || values[0].compareTo(wellObject) >= 0) {
      return null;
   }

   for(var i = 0; i < values.length; i++) {

      if(values[i].compareTo(well) >= 0) {
         return values[i - 1];
      }

   }

   return values[values.length - 1];
}

/**
 * Returns the least well in this set greater than the given well, or null if
 * there is no such well.
 * @param {(Well|string)} well - input well | well index
 * @returns {Well} the least well in this set greater than the input well
 * @throws {TypeError} on invalid well input
 */
WellSet.prototype.higher = function(well) {

   Validation.validateArguments(arguments.length, WellSet.prototype.higher.length, "WellSet.prototype.higher");

   var values = this.toArray();

   try {
      var wellObject = new Well(well);
   } catch(err) {
      throw new TypeError("Invalid well or index: " + well);
   }

   if(values.length === 0) {
      return null;
   }

   if(values[0].compareTo(wellObject) > 0) {
      return values[0];
   }

   for(var i = 0; i < values.length; i++) {

      if(values[i].compareTo(well) > 0) {
         return values[i];
      }

   }

   return null;
}

/**
 * Returns an array of the portion of this set whose wells are greater than or equal
 * to the index, well or well index.
 * @param {(number|Well|String)} index | input well | well index
 * @returns {WellSet} the tail set
 * @throws {TypeError} on invalid well input
 */
WellSet.prototype.tailSet = function(well) {
   Validation.validateArguments(arguments.length, WellSet.prototype.tailSet.length, "WellSet.prototype.tailSet");
   return this.subSet(well, this.size());
}

/**
 * Returns an array of the portion of this set whose wells are less than or equal
 * to the index, well or well index.
 * @param {(number|Well|String)} index | input well | well index
 * @returns {WellSet} the head set
 * @throws {TypeError} on invalid well input
 */
WellSet.prototype.headSet = function(well) {
   Validation.validateArguments(arguments.length, WellSet.prototype.headSet.length, "WellSet.prototype.headSet");
   return this.subSet(0, well);
}

/**
 * Returns the first well in the set.
 * @returns {Well} the first well in the set or null if the set is empty
 */
WellSet.prototype.first = function() {
   return this.wells.size() > 0 ? this.toArray()[0] : null;
}

/**
 * Returns the last well in the set.
 * @returns {Well} the last well in the set or null if the set is empty
 */
WellSet.prototype.last = function() {
   var array = this.toArray();
   return array.length > 0 ? array[array.length - 1] : null;
}

/**
 * Returns all wells in the set with the given row.
 * @param {number|string} row - input row | row index
 * @returns {Well[]} the wells in the set with the given row
 * @throws {TypeError} on invalid row or row index input
 */
WellSet.prototype.getRow = function(row) {

   Validation.validateArguments(arguments.length, WellSet.prototype.getRow.length, "WellSet.prototype.getRow");
   row = WellValidation.validateRow(row);

   var toReturn = [];

   for(var well of this.wells) {
      if(well.row === row) {
         toReturn.push(well);
      }
   }

   return toReturn.sort(Well.prototype.sort);
}

/**
 * Returns all wells in the set with the given column.
 * @param {number} column - input column
 * @returns {Well[]} the wells in the set with the given column
 * @throws {TypeError} on invalid column input
 */
WellSet.prototype.getColumn = function(column) {

   Validation.validateArguments(arguments.length, WellSet.prototype.getColumn.length, "WellSet.prototype.getColumn");
   WellValidation.validateColumn(column);

   var toReturn = [];

   for(var well of this.wells) {
      if(well.column === column) {
         toReturn.push(well);
      }
   }

   return toReturn.sort(Well.prototype.sort);


}

/**
 * Returns the wells between the beginning and ending indices.
 * @param {(number|string|Well)} begin - beginning index | beginning well index | beginning well
 * @param {(number|string|Well)} end - ending index | ending well index | ending well
 * @returns {Well[]} the well array containing the subset of wells
 * @throws {TypeError} on invalid well input or indices
 */
WellSet.prototype.subArray = function(begin, end) {

   Validation.validateArguments(arguments.length, WellSet.prototype.subArray.length, "WellSet.prototype.subArray");
   var array = this.toArray();
   var startIndex = 0;
   var endIndex = array.length - 1;

   switch(Validation.getType(begin)) {

      case '[object Well]':    WellValidation.validateWell(begin);
                               var index = array.indexOf(this.ceiling(begin));

                               if(index < 0) {

                                  if(begin.compareTo(array[array.length - 1]) > 0) {
                                     return [];
                                  }

                               } else {
                                  startIndex = index;
                               }

                               break;

      case '[object String]':  WellValidation.validateWellIndex(begin);
                               begin = new Well(begin);

                               var index = array.indexOf(this.ceiling(begin));

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

      case '[object Well]':    WellValidation.validateWell(end);

                               var index = array.indexOf(this.floor(end));

                               if(index < 0) {

                                  if(end.compareTo(array[0]) < 0) {
                                     return [];
                                  }

                               } else {
                                  endIndex = index;
                               }

                               break;

      case '[object String]':  WellValidation.validateWellIndex(end);
                               end = new Well(end);

                               var index = array.indexOf(this.floor(end));

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
 * Returns a well set with the wells between the beginning and ending indices.
 * @param {(number|string|Well)} begin - beginning index | beginning well index | beginning well
 * @param {(number|string|Well)} end - ending index | ending well index | ending well
 * @returns {WellSet} the well set containing the subarray of wells
 * @throws {TypeError} on invalid well input or indices
 */
WellSet.prototype.subSet = function(begin, end) {

   Validation.validateArguments(arguments.length, WellSet.prototype.subSet.length, "WellSet.prototype.subSet");
   var array = this.subArray(begin, end);

   return new WellSet(array, this.name);
}


/**
 * Returns a sorted array containing the wells in the set.
 * @returns {Well[]} sorted well array
 */
WellSet.prototype.toArray = function() {
   var array = this.wells.toArray();
   return array.sort(Well.prototype.sort);
}

/**
 * Returns a sorted array containing the well indices in the set.
 * @returns {string[]} sorted well indices
 */
WellSet.prototype.toStringArray = function() {

   var array = this.toArray();

   for(var i = 0; i < array.length; i++) {
      array[i] = array[i].toString();
   }

   return array;
}

/**
 * Returns a type hash set containing the wells in the set.
 * @returns {TypedHashSet} typed set of wells
 */
WellSet.prototype.toSet = function() {
   return this.wells;
}

/*--------------------------- Additional Functions ---------------------------*/

WellSet.prototype[Symbol.iterator] = function() {
   return this.wells[Symbol.iterator]();
}

/**
 * Sets the label.
 * @param {string} label -  the new label
 * @throws {TypeError} on invalid label input
 */
WellSet.prototype.setLabel = function(label) {
   Validation.validateString(label);
   this.name = label;
}
/**
 * Returns the set label.
 * @returns {string} the set label
 */
WellSet.prototype.label = function() {
   return this.name;
}

/**
 * Returns the size of the set.
 * @returns {number} the set size
 */
WellSet.prototype.size = function() {
   return this.wells.size();
}

/**
 * Returns true if the set is empty.
 * @returns {boolean} true if the set is empty
 */
WellSet.prototype.isEmpty = function() {
   return this.wells.isEmpty();
}
