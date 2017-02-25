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
var WellSetValidation = require('../util/wellsetvalidation');
var PlateValidation = require('../util/platevalidation');
var TypedHashSet = require('../util/typedhashset');

/*--------------------------------- Exports ----------------------------------*/

module.exports = WellGroup;

/*------------------------------- Constructor --------------------------------*/

/**
 * This class houses a list of well indices associated with a plate object. It
 * represents a simplified version of the well set object. Unlike the well set
 * object, the well group object does not store wells or well data, only a list
 * of indices.
 *
 * <br><br>
 *
 * Well groups provide a means to retrieve and analyze well subsets
 * within a plate. A microplate experiment often contains control and experimental
 * wells. These subsets can be housed within various well groups to facilitate
 * statistical or mathematical operations.
 *
 * <br><br>
 *
 * Well groups do not enforce row and column numbers. This logic is housed within
 * the plate object. Well groups are compared using the group name, number of wells,
 * and greatest well index in that order. This class implements a compareTo method
 * for comparing two well group objects and functions for sorting well indices
 * and well groups.
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
 *                <td><span style="color: purple;">No Arguments</span></td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td><span style="color: purple;">var</span> group = <span style="color: purple;">new</span> <span style="color: chocolate;">WellGroup</span>()</td>
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
 *                <td><span style="color: purple;">var</span> group = <span style="color: purple;">new</span> <span style="color: chocolate;">WellGroup</span>(<span style="color: maroon;">"Example Group"</span>)</td>
 *             </tr>
 *             <tr><td>&nbsp;</td></tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td><span style="color: purple;">Index Array</span></td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td><span style="color: purple;">var</span> group = <span style="color: purple;">new</span> <span style="color: chocolate;">WellGroup</span>(<span style="color: maroon;">['A1, 'B2, 'C5']</span>)</td>
 *             </tr>
 *             <tr><td>&nbsp;</td></tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td><span style="color: purple;">Index Array, Label</span></td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td><span style="color: purple;">var</span> group = <span style="color: purple;">new</span> <span style="color: chocolate;">WellGroup</span>(<span style="color: maroon;">['A1, 'B2, 'C5']</span>, <span style="color: maroon;">"Example Group"</span>)</td>
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
 *                <td><span style="color: purple;">var</span> group = <span style="color: purple;">new</span> <span style="color: chocolate;">WellGroup</span>(<span style="color: maroon;">array</span>)</td>
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
 *                <td><span style="color: purple;">var</span> group = <span style="color: purple;">new</span> <span style="color: chocolate;">WellGroup</span>(<span style="color: maroon;">array</span>, <span style="color: maroon;">"Example Group"</span>)</td>
 *             </tr>
 *             <tr><td>&nbsp;</td></tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td><span style="color: purple;">WellGroup</span></td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td><span style="color: purple;">var</span> input = <span style="color: purple;">new</span> <span style="color: chocolate;">WellGroup</span>(<span style="color: maroon;">['A1, 'B2, 'C5']</span>)</td>
 *             </tr>
 *             <tr>
 *                <td><span style="color: purple;">var</span> group = <span style="color: purple;">new</span> <span style="color: chocolate;">WellGroup</span>(<span style="color: maroon;">input</span>)</td>
 *             </tr>
 *             <tr><td>&nbsp;</td></tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td><span style="color: purple;">WellGroup, Label</span></td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td><span style="color: purple;">var</span> input = <span style="color: purple;">new</span> <span style="color: chocolate;">WellGroup</span>(<span style="color: maroon;">['A1, 'B2, 'C5']</span>)</td>
 *             </tr>
 *             <tr>
 *                <td><span style="color: purple;">var</span> group = <span style="color: purple;">new</span> <span style="color: chocolate;">WellGroup</span>(<span style="color: maroon;">input</span>, <span style="color: maroon;">"Example Group"</span>)</td>
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
 *                <td><span style="color: purple;">var</span> group = <span style="color: purple;">new</span> <span style="color: chocolate;">WellGroup</span>(<span style="color: maroon;">set</span>)</td>
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
 *                <td><span style="color: purple;">var</span> group = <span style="color: purple;">new</span> <span style="color: chocolate;">WellGroup</span>(<span style="color: maroon;">set</span>, <span style="color: maroon;">"Example Group"</span>)</td>
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
 * @param {(string[]|Well[]|WellSet|WellGroup|string)} [wells] - well indices | group label
 * @param {string} [label] - group label
 * @throws {TypeError} on invalid number of arguments
 */
function WellGroup(wells, label) {

   this.groupName = "Group";
   this.wells = new TypedHashSet("String");

   if(arguments.length === 0) {
      return;
   }

   if(arguments.length < 1 || arguments.length > 2) {
      this.typeError();
   }

   switch(Validation.getType(wells)) {

      case '[object Array]':     this.addArray(wells);
                                 break;

      case '[object WellSet]':   this.addSet(wells);
                                 this.groupName = wells.name;
                                 break;

      case '[object WellGroup]': this.addGroup(wells);
                                 this.groupName = wells.groupName;
                                 break;

      case '[object String]':    this.groupName = wells;
                                 break;

      default: this.typeError();

   }

   if(arguments.length === 2) {
      Validation.validateString(label);
      this.groupName = label;
   }

}

/**
 * Throws an error when the well constructor receives invalid input parameters.
 * @ignore
 * @throws {TypeError} when function is called
 */
 WellGroup.prototype.typeError = function() {
    throw new TypeError("Well group constructor accepts the following combinations of arguments: " + "\n" +
                        "  -> Well[] - initial indices" + "\n" +
                        "  -> String[] - initial indices" + "\n" +
                        "  -> WellSet - initial indices" + "\n" +
                        "  -> WellGroup - initial indices" + "\n" +
                        "  -> Well[] - initial indices, String - label" + "\n" +
                        "  -> String[] - initial indices, String - label" + "\n" +
                        "  -> WellSet - initial indices, String - label" + "\n" +
                        "  -> WellGroup - initial indices, String - label" + "\n");
}

/**
 * Adds a well to the group.
 * @param {(Well|string)} well - input well | index
 * @throws {TypeError} on invalid well input
 */
WellGroup.prototype.add = function(well) {

   Validation.validateArguments(arguments.length, WellGroup.prototype.add.length, "WellGroup.protoype.add");

   switch(Validation.getType(well)) {

      case '[object Well]':   WellValidation.validateWellIndex(well.toString());
                              this.wells.add(well.toString());
                              break;

      case '[object String]': WellValidation.validateWellIndex(well);
                              this.wells.add(well);
                              break;

      default: throw new TypeError("Input must be a string or well object: " + well);

   }

}

/**
 * Adds an array of wells or well indices to the group.
 * @param {(Well[]|string[])} wells - input wells | well indices
 * @throws {TypeError} on invalid well/index input
 */
WellGroup.prototype.addArray = function(wells) {

   Validation.validateArguments(arguments.length, WellGroup.prototype.addArray.length, "WellGroup.protoype.addArray");
   WellSetValidation.validateWellOrIndexArray(wells);

   for(var well of wells) {
      this.add(well);
   }

}

/**
 * Adds a well set to the group.
 * @param {WellSet} set - input well set
 * @throws {TypeError} on invalid well set input
 */
WellGroup.prototype.addSet = function(set) {

   Validation.validateArguments(arguments.length, WellGroup.prototype.addSet.length, "WellGroup.protoype.addSet");
   WellSetValidation.validateWellSet(set);

   for(var well of set) {
      this.add(well);
   }

}

/**
 * Adds another well group to the group.
 * @param {WellGroup} group - input well group
 * @throws {TypeError} on invalid well group input
 */
WellGroup.prototype.addGroup = function(group) {

   Validation.validateArguments(arguments.length, WellGroup.prototype.addGroup.length, "WellGroup.protoype.addGroup");
   WellSetValidation.validateGroup(group);

   if(Validation.getType(group) != '[object WellGroup]') {
      throw new TypeError("Input must be a well group: " + group);
   }

   this.addArray(group.toArray());

}

/**
 * Removes a well from the group.
 * @param {(Well|string)} well - well or well index
 * @throws {TypeError} on invalid well or well index input
 */
WellGroup.prototype.remove = function(well) {

   Validation.validateArguments(arguments.length, WellGroup.prototype.remove.length, "WellGroup.protoype.remove");

   switch(Validation.getType(well)) {

      case '[object Well]':   WellValidation.validateWellIndex(well.toString());
                              this.wells.remove(well.toString());
                              break;

      case '[object String]': WellValidation.validateWellIndex(well);
                              this.wells.remove(well);
                              break;

      default: throw new TypeError("Input must be a string or well object: " + well);

   }

}

/**
 * Removes an array from the group.
 * @param {(Well[]|string[])} wells - input wells | input indices
 * @throws {TypeError} on invalid well/index input
 */
WellGroup.prototype.removeArray = function(wells) {

   Validation.validateArguments(arguments.length, WellGroup.prototype.removeArray.length, "WellGroup.protoype.removeArray");
   WellSetValidation.validateWellOrIndexArray(wells);

   if(Validation.getType(wells) != '[object Array]') {
      throw new TypeError("Input must be an array: " + wells);
   }

   for(var well of wells) {
      this.remove(well);
   }

}

/**
 * Removes a well set from the group.
 * @param {WellSet} set - well or well index
 * @throws {TypeError} on invalid well set input
 */
WellGroup.prototype.removeSet = function(set) {

   Validation.validateArguments(arguments.length, WellGroup.prototype.removeSet.length, "WellGroup.protoype.removeSet");
   WellSetValidation.validateWellSet(set);

   if(Validation.getType(set) != '[object WellSet]') {
      throw new TypeError("Input must be a well set: " + set);
   }

   for(var well of set) {
      this.remove(well);
   }

}

/**
 * Removes another well group from this group.
 * @param {WellGroup} group - input well group
 * @throws {TypeError} on invalid well group input
 */
WellGroup.prototype.removeGroup = function(group) {

   Validation.validateArguments(arguments.length, WellGroup.prototype.addGroup.length, "WellGroup.protoype.addGroup");
   WellSetValidation.validateGroup(group);

   if(Validation.getType(group) != '[object WellGroup]') {
      throw new TypeError("Input must be a well group: " + group);
   }

   this.removeArray(group.toArray());

}

/**
 * Clears the well group.
 */
WellGroup.prototype.clear = function() {
   this.wells.clear();
}

/**
 * Returns the group label.
 * @returns {string} group label
 */
WellGroup.prototype.label = function() {
   return this.groupName;
}

/**
 * Returns the size of the well group.
 * @returns {number} size of the well group
 */
WellGroup.prototype.size = function() {
   return this.wells.size();
}

/**
 * Returns an array holding the well group indices.
 * @returns {string[]} array of well indices
 */
WellGroup.prototype.toArray = function() {
   var array = this.wells.toArray();
   return array.sort(this.sortIndices);
}

/**
 * Compares two well groups using the group name, number of wells and greatest
 * well index in that order.
 * @param {WellGroup} group - well group for comparison
 * @return {number} 0 if groups are equal, -1 if the input group is greater, 1 if the input group is lesser
 * @throws {TypeError} on invalid well group input
 */
WellGroup.prototype.compareTo = function(group) {

   WellSetValidation.validateGroup(group);

   if(group.groupName > this.groupName) {
      return -1;
   }

   if(group.groupName < this.groupName) {
      return 1;
   }

   if(group.wells.size() > this.wells.size()) {
      return -1;
   }

   if(group.wells.size() < this. wells.size()) {
      return 1;
   }

   var inputArray = group.toArray();
   var thisArray = this.toArray();

   if(inputArray.length > thisArray.length) {
      return -1;
   }

   if(inputArray.length < this.Array.length) {
      return 1;
   }

   for(var i = 0; i < thisArray.length; i++) {

      var sort = this.sortIndices(inputArray[i], thisArray[i]);

      if(sort === 1) {
         return -1;
      }

      if(sort === -1) {
         return 1;
      }

   }

   return 0;
}

/**
 * Sorts well groups using the group name, number of wells and greatest well
 * index in that order.
 * @param {WellGroup} group1 - first group
 * @param {WellGroup} group2 - second group
 * @return {number} 0 if groups are equal, -1 if group1 is greater than group2, 1 if group1 is less than group2
 * @throws {TypeError} on invalid well group input
 */
WellGroup.prototype.sort = function(group1, group2) {

   Validation.validateArguments(arguments.length, WellGroup.prototype.sort.length, "WellGroup.protoype.sort");
   WellSetValidation.validateGroup(group1);
   WellSetValidation.validateGroup(group2);

   return group1.compareTo(group2);
}

/**
 * Sorts well indices.
 * @param {string} index1 - first well
 * @param {string} index2 - second well
 * @return {Number} 0 if indices are equal, -1 if the index1 is greater than index2, 1 if index1 is less than index2
 * @throws {TypeError} on invalid well index input
 */
WellGroup.prototype.sortIndices = function(index1, index2) {

   Validation.validateArguments(arguments.length, WellGroup.prototype.sortIndices.length, "WellGroup.protoype.sortIndices");
   var parsed1 = WellValidation.validateWellIndex(index1);
   var parsed2 = WellValidation.validateWellIndex(index2);

   if(parsed2.row > parsed1.row) {
      return -1;
   }

   if(parsed2.row < parsed1.row) {
      return 1;
   }

   if(parsed2.column > parsed1.column) {
      return -1;
   }

   if(parsed2.column < parsed1.column) {
      return 1;
   }

   return 0;

}

/**
 * Returns a JSON string for the group. This allows a unique value to be passed
 * to a typed hashset preventing duplicate groups in a plate.
 * @returns {string} well group JSON string
 */
WellGroup.prototype.toString = function() {
   return JSON.stringify(this);
}

WellGroup.prototype[Symbol.iterator] = function() {
   return this.wells[Symbol.iterator]();
}
