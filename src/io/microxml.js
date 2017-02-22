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

// microjson.js

/*---------------------------------- Exports ---------------------------------*/

module.exports = new MicroXML();

/*------------------------------- Dependencies -------------------------------*/

var Well = require('../plate/well');
var WellSet = require('../plate/wellset');
var WellGroup = require('../plate/wellgroup');
var Plate = require('../plate/plate');
var Stack = require('../plate/stack');
var Validation = require('../util/validation');
var WellValidation = require('../util/wellvalidation');
var WellSetValidation = require('../util/wellsetvalidation');
var PlateValidation = require('../util/platevalidation');

/*-------------------------------- Constructor -------------------------------*/

/**
 * This class formats stack, plate, well set and well objects into a condensed and
 * easy to read XML format. Wells, well groups and plates are housed within typed
 * hash set objects. This class converts the hash sets to simple objects which are
 * easier to read and parse.
 *
 * <br><br>
 *
 * <b>Examples of XML Output:</b>
 *
 * <br><br>
 *
 * <table class="mytable" cellspacing="10px" style="text-align:left; margin: 20px;">
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 5px; padding-top: 18px;"><b>Well</b><div></th>
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 5px; padding-top: 18px;"><b>Well Group</b><div></th>
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 5px; padding-top: 18px;"><b>Well Set</b><div></th>
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 5px; padding-top: 18px;"><b>Plate</b><div></th>
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 5px; padding-top: 18px;"><b>Stack</b></div></th>
 *    <tr>
 *       <td  style="font-size: 70%" valign="top">
 *          <table border="0">
 *             <tr>
 *                <td style="padding-top: 7px;">
 *                   <pre style="margin: 0; display: inline;">&lt;WELL&gt;
 *    &lt;INDEX&gt;A1&lt;/INDEX&gt;
 *    &lt;ROW&gt;0&lt;/ROW&gt;
 *    &lt;COLUMN&gt;1&lt;/COLUMN&gt;
 *    &lt;DATA&gt;
 *       &lt;VALUE&gt;1&lt;/VALUE&gt;
 *       &lt;VALUE&gt;2&lt;/VALUE&gt;
 *       &lt;VALUE&gt;3&lt;/VALUE&gt;
 *       &lt;VALUE&gt;4&lt;/VALUE&gt;
 *    &lt;/DATA&gt;
 * &lt;/WELL&gt;</pre>
 *                </td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td  style="font-size: 70%" valign="top">
 *          <table border="0">
 *             <tr>
 *                <td style="padding-top: 7px;">
 *                   <pre style="margin: 0; display: inline;">&lt;WELLGROUP&gt;
 *    &lt;LABEL&gt;Group&lt;/LABEL&gt;
 *    &lt;WELLS&gt;
 *       &lt;INDEX&gt;A1&lt;/INDEX&gt;
 *       &lt;INDEX&gt;B2&lt;/INDEX&gt;
 *       &lt;INDEX&gt;C5&lt;/INDEX&gt;
 *       &lt;INDEX&gt;D9&lt;/INDEX&gt;
 *    &lt;/WELLS&gt;
 * &lt;/WELLGROUP&gt;</pre>
 *                </td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td  style="font-size: 70%" valign="top">
 *          <table border="0">
 *             <tr>
 *                <td style="padding-top: 7px;">
 *                   <pre style="margin: 0; display: inline;">&lt;WELLSET&gt;
 *    &lt;LABEL&gt;Example Set&lt;/LABEL&gt;
 *    &lt;WELLS&gt;
 *       &lt;WELL&gt;
 *          &lt;INDEX&gt;A1&lt;/INDEX&gt;
 *          &lt;ROW&gt;0&lt;/ROW&gt;
 *          &lt;COLUMN&gt;1&lt;/COLUMN&gt;
 *          &lt;DATA&gt;
 *             &lt;VALUE&gt;1&lt;/VALUE&gt;
 *             &lt;VALUE&gt;2&lt;/VALUE&gt;
 *             &lt;VALUE&gt;3&lt;/VALUE&gt;
 *             &lt;VALUE&gt;4&lt;/VALUE&gt;
 *          &lt;/DATA&gt;
 *       &lt;/WELL&gt;
 *       &lt;WELL&gt;
 *          &lt;INDEX&gt;B2&lt;/INDEX&gt;
 *          &lt;ROW&gt;1&lt;/ROW&gt;
 *          &lt;COLUMN&gt;2&lt;/COLUMN&gt;
 *          &lt;DATA&gt;
 *             &lt;VALUE&gt;5&lt;/VALUE&gt;
 *             &lt;VALUE&gt;6&lt;/VALUE&gt;
 *             &lt;VALUE&gt;7&lt;/VALUE&gt;
 *             &lt;VALUE&gt;8&lt;/VALUE&gt;
 *          &lt;/DATA&gt;
 *       &lt;/WELL&gt;
 *    &lt;/WELLS&gt;
 * &lt;/WELLSET&gt;</pre>
 *                </td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td style="font-size: 70%" valign="top">
 *          <table>
 *             <tr>
 *                <td>
 *                   <pre style="margin: 0; display: inline;">&lt;PLATE&gt;
 *    &lt;LABEL&gt;Example Plate&lt;/LABEL&gt;
 *    &lt;ROWS&gt;8&lt;/ROWS&gt;
 *    &lt;COLUMNS&gt;12&lt;/COLUMNS&gt;
 *    &lt;DESCRIPTOR&gt;96-Well&lt;/DESCRIPTOR&gt;
 *    &lt;WELLGROUPS&gt;
 *       &lt;WELLGROUP&gt;
 *          &lt;LABEL&gt;Group&lt;/LABEL&gt;
 *          &lt;WELLS&gt;
 *             &lt;INDEX&gt;A1&lt;/INDEX&gt;
 *             &lt;INDEX&gt;B2&lt;/INDEX&gt;
 *          &lt;/WELLS&gt;
 *       &lt;/WELLGROUP&gt;
 *    &lt;/WELLGROUPS&gt;
 *    &lt;WELLS&gt;
 *       &lt;WELL&gt;
 *          &lt;INDEX&gt;A1&lt;/INDEX&gt;
 *          &lt;ROW&gt;0&lt;/ROW&gt;
 *          &lt;COLUMN&gt;1&lt;/COLUMN&gt;
 *          &lt;DATA&gt;
 *             &lt;VALUE&gt;1&lt;/VALUE&gt;
 *             &lt;VALUE&gt;2&lt;/VALUE&gt;
 *             &lt;VALUE&gt;3&lt;/VALUE&gt;
 *             &lt;VALUE&gt;4&lt;/VALUE&gt;
 *          &lt;/DATA&gt;
 *       &lt;/WELL&gt;
 *       &lt;WELL&gt;
 *          &lt;INDEX&gt;B2&lt;/INDEX&gt;
 *          &lt;ROW&gt;1&lt;/ROW&gt;
 *          &lt;COLUMN&gt;2&lt;/COLUMN&gt;
 *          &lt;DATA&gt;
 *             &lt;VALUE&gt;5&lt;/VALUE&gt;
 *             &lt;VALUE&gt;6&lt;/VALUE&gt;
 *             &lt;VALUE&gt;7&lt;/VALUE&gt;
 *             &lt;VALUE&gt;8&lt;/VALUE&gt;
 *          &lt;/DATA&gt;
 *       &lt;/WELL&gt;
 *    &lt;/WELLS&gt;
 * &lt;/PLATE&gt;</pre>
 *                </td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td style="font-size: 70%" valign="top">
 *          <table>
 *             <tr>
 *                <td style="padding-top: 7px;">
 *                   <pre style="margin: 0; display: inline;">&lt;STACK&gt;
 *    &lt;LABEL&gt;Test Stack&lt;/LABEL&gt;
 *    &lt;ROWS&gt;8&lt;/ROWS&gt;
 *    &lt;COLUMNS&gt;12&lt;/COLUMNS&gt;
 *    &lt;DESCRIPTOR&gt;96-Well&lt;/DESCRIPTOR&gt;
 *    &lt;PLATES&gt;
 *       &lt;PLATE&gt;
 *          &lt;LABEL&gt;Example Plate&lt;/LABEL&gt;
 *          &lt;ROWS&gt;8&lt;/ROWS&gt;
 *          &lt;COLUMNS&gt;12&lt;/COLUMNS&gt;
 *          &lt;DESCRIPTOR&gt;96-Well&lt;/DESCRIPTOR&gt;
 *          &lt;WELLGROUPS&gt;
 *             &lt;WELLGROUP&gt;
 *                &lt;LABEL&gt;Group&lt;/LABEL&gt;
 *                &lt;WELLS&gt;
 *                   &lt;INDEX&gt;A1&lt;/INDEX&gt;
 *                   &lt;INDEX&gt;B2&lt;/INDEX&gt;
 *                &lt;/WELLS&gt;
 *             &lt;/WELLGROUP&gt;
 *          &lt;/WELLGROUPS&gt;
 *          &lt;WELLS&gt;
 *             &lt;WELL&gt;
 *                &lt;INDEX&gt;A1&lt;/INDEX&gt;
 *                &lt;ROW&gt;0&lt;/ROW&gt;
 *                &lt;COLUMN&gt;1&lt;/COLUMN&gt;
 *                &lt;DATA&gt;
 *                   &lt;VALUE&gt;1&lt;/VALUE&gt;
 *                   &lt;VALUE&gt;2&lt;/VALUE&gt;
 *                   &lt;VALUE&gt;3&lt;/VALUE&gt;
 *                   &lt;VALUE&gt;4&lt;/VALUE&gt;
 *                &lt;/DATA&gt;
 *             &lt;/WELL&gt;
 *             &lt;WELL&gt;
 *                &lt;INDEX&gt;B2&lt;/INDEX&gt;
 *                &lt;ROW&gt;1&lt;/ROW&gt;
 *                &lt;COLUMN&gt;2&lt;/COLUMN&gt;
 *                &lt;DATA&gt;
 *                   &lt;VALUE&gt;5&lt;/VALUE&gt;
 *                   &lt;VALUE&gt;6&lt;/VALUE&gt;
 *                   &lt;VALUE&gt;7&lt;/VALUE&gt;
 *                   &lt;VALUE&gt;8&lt;/VALUE&gt;
 *                &lt;/DATA&gt;
 *             &lt;/WELL&gt;
 *          &lt;/WELLS&gt;
 *       &lt;/PLATE&gt;
 *       &lt;PLATE&gt;
 *          &lt;LABEL&gt;Example Plate 2&lt;/LABEL&gt;
 *          &lt;ROWS&gt;8&lt;/ROWS&gt;
 *          &lt;COLUMNS&gt;12&lt;/COLUMNS&gt;
 *          &lt;DESCRIPTOR&gt;96-Well&lt;/DESCRIPTOR&gt;
 *          &lt;WELLGROUPS&gt;
 *             &lt;WELLGROUP&gt;
 *                &lt;LABEL&gt;Group&lt;/LABEL&gt;
 *                &lt;WELLS&gt;
 *                   &lt;INDEX&gt;C5&lt;/INDEX&gt;
 *                   &lt;INDEX&gt;D9&lt;/INDEX&gt;
 *                &lt;/WELLS&gt;
 *             &lt;/WELLGROUP&gt;
 *          &lt;/WELLGROUPS&gt;
 *          &lt;WELLS&gt;
 *             &lt;WELL&gt;
 *                &lt;INDEX&gt;C5&lt;/INDEX&gt;
 *                &lt;ROW&gt;2&lt;/ROW&gt;
 *                &lt;COLUMN&gt;5&lt;/COLUMN&gt;
 *                &lt;DATA&gt;
 *                   &lt;VALUE&gt;9&lt;/VALUE&gt;
 *                   &lt;VALUE&gt;10&lt;/VALUE&gt;
 *                   &lt;VALUE&gt;11&lt;/VALUE&gt;
 *                   &lt;VALUE&gt;12&lt;/VALUE&gt;
 *                &lt;/DATA&gt;
 *             &lt;/WELL&gt;
 *             &lt;WELL&gt;
 *                &lt;INDEX&gt;D9&lt;/INDEX&gt;
 *                &lt;ROW&gt;3&lt;/ROW&gt;
 *                &lt;COLUMN&gt;9&lt;/COLUMN&gt;
 *                &lt;DATA&gt;
 *                   &lt;VALUE&gt;13&lt;/VALUE&gt;
 *                   &lt;VALUE&gt;14&lt;/VALUE&gt;
 *                   &lt;VALUE&gt;15&lt;/VALUE&gt;
 *                   &lt;VALUE&gt;16&lt;/VALUE&gt;
 *                &lt;/DATA&gt;
 *             &lt;/WELL&gt;
 *          &lt;/WELLS&gt;
 *       &lt;/PLATE&gt;
 *    &lt;/PLATES&gt;
 * &lt;/STACK&gt;</pre>
 *                </td>
 *             </tr>
 *          </table>
 *       </td>
 *    </tr>
 * </table>
 * @constructor
 * @memberof module:IO
 * @author Jesse L. Mull
 * @version Updated February 17, 2016
 * @license Apache License 2.0
 * @see <a href="http://www.jessemull.com" target="_blank">http://www.jessemull.com</a><br>
 * @see <a href="mailto:hello@jessemull.com">hello@jessemull.com</a>
 */
function MicroXML() {

   this.labelRegex = /(<LABEL>)(.*)(<\/LABEL>)/i;
   this.rowRegex = /(<ROW>)(.*)(<\/ROW>)/i;
   this.rowsRegex = /(<ROWS>)(.*)(<\/ROWS>)/i;
   this.columnRegex = /(<COLUMN>)(.*)(<\/COLUMN>)/i;
   this.columnsRegex = /(<COLUMNS>)(.*)(<\/COLUMNS>)/i;
   this.wellsRegex = /(<WELLS>)([\s\S]*)(<\/WELLS>)/i;
   this.dataRegex = /(<DATA>)([\s\S]*)(<\/DATA>)/i;
   this.valueRegex = /(<VALUE>)(.*)(<\/VALUE>)/i;
   this.indexRegex = /(<INDEX>)(.*)(<\/INDEX>)/i;
   this.groupsRegex = /(<WELLGROUPS>)([\s\S]*)(<\/WELLGROUPS>)/i;
   this.platesRegex = /(<PLATES>)([\s\S]*)(<\/PLATES>)/i;
   this.globalWellRegex = /<WELL>([\s\S]*?)<\/WELL>/gi;
   this.globalValueRegex = /<VALUE>.*<\/VALUE>/gi;
   this.globalIndexRegex = /<INDEX>.*<\/INDEX>/gi;
   this.globalPlateRegex = /<PLATE>([\s\S]*?)<\/PLATE>/gi;
   this.globalGroupsRegex = /<WELLGROUP>([\s\S]*?)<\/WELLGROUP>/gi;

}

/**
 * Formats a well, well set, well group, plate or stack as an XML string.
 * @param {(Well|WellSet|WellGroup|Plate|Stack)} input - the input object
 * @returns {string} the XML formatted string
 */
 MicroXML.prototype.stringify = function(input) {

    Validation.validateArgumentRange(arguments.length, 1, 3, "MicroXML.prototype.stringify");

    switch(Validation.getType(input)) {

      case '[object Well]': return this.stringifyWell(input, "");

      case '[object WellSet]': return this.stringifyWellSet(input, "");

      case '[object WellGroup]': return this.stringifyWellGroup(input, "");

      case '[object Plate]': return this.stringifyPlate(input, "");

      case '[object Stack]': return this.stringifyStack(input, "");

      default: throw new TypeError("Invalid input type: " + input);
   }

}

/**
 * Formats a well as an XML string.
 * @ignore
 * @param {Well} well - the input well
 * @returns {string} the XML formatted string
 */
MicroXML.prototype.stringifyWell = function(well, indent) {

   WellValidation.validateWell(well);

   var formatted = "";

   formatted += indent + "<WELL>" + "\n";
   formatted += indent + "   <INDEX>" + well.toString() + "</INDEX>" + "\n";
   formatted += indent + "   <ROW>" + well.row + "</ROW>" +  "\n";
   formatted += indent + "   <COLUMN>" + well.column + "</COLUMN>" +  "\n";
   formatted += indent + "   <DATA>" + "\n";

   for(var value of well) {
      formatted += indent + "      <VALUE>" + value + "</VALUE>" +"\n";
   }

   formatted += indent + "   </DATA>" + "\n";
   formatted += indent + "</WELL>" + "\n";

   return formatted;
}

/**
 * Formats a well set as an XML string.
 * @ignore
 * @param {WellSet} set - the input set
 * @returns {string} the XML formatted string
 */
MicroXML.prototype.stringifyWellSet = function(set, indent) {

   WellSetValidation.validateWellSet(set);

   var formatted = "";

   formatted += indent + "<WELLSET>" + "\n";
   formatted += indent + "   <LABEL>" +set.name + "</LABEL>" + "\n";
   formatted += indent + "   <WELLS>" + "\n";

   for(var well of set) {
      formatted += indent + this.stringifyWell(well, indent + "      ");
   }

   formatted += indent + "   </WELLS>" + "\n";
   formatted += indent + "</WELLSET>" + "\n";

   return formatted;
}

/**
 * Formats a well group as an XML string.
 * @ignore
 * @param {WellGroup} group - the input group
 * @returns {string} the XML formatted string
 */
MicroXML.prototype.stringifyWellGroup = function(group, indent) {

   WellSetValidation.validateGroup(group);

   var formatted = "";

   formatted += indent + "<WELLGROUP>" + "\n";
   formatted += indent + "   <LABEL>" + group.groupName + "</LABEL>" + "\n";
   formatted += indent + "   <WELLS>" + "\n";

   for(var index of group.toArray()) {
      formatted += indent + "      <INDEX>" + index + "</INDEX>" +"\n";
   }

   formatted += indent + "   </WELLS>" + "\n";
   formatted += indent + "</WELLGROUP>" + "\n";

   return formatted;
}

/**
 * Formats a plate as an XML string.
 * @ignore
 * @param {Plate} plate - the input plate
 * @returns {string} the XML formatted string
 */
MicroXML.prototype.stringifyPlate = function(plate, indent) {

   WellSetValidation.validatePlate(plate);

   var formatted = "";

   formatted += indent + "<PLATE>" + "\n";
   formatted += indent + "   <LABEL>" + plate.name + "</LABEL>" + "\n";
   formatted += indent + "   <ROWS>" + plate.rows + "</ROWS>" + "\n";
   formatted += indent + "   <COLUMNS>" + plate.columns + "</COLUMNS>" + "\n";
   formatted += indent + "   <DESCRIPTOR>" + this.descriptor(plate.plateType, plate.rows, plate.columns) + "</DESCRIPTOR>" + "\n";
   formatted += indent + "   <WELLGROUPS>" + "\n";

   for(var group of plate.allGroupsToArray()) {
      formatted += this.stringifyWellGroup(group, indent + "      ");
   }

   formatted += indent + "   </WELLGROUPS>" + "\n";
   formatted += indent + "   <WELLS>" + "\n";

   for(var well of plate) {
      formatted += this.stringifyWell(well, indent + "      ");
   }

   formatted += indent + "   </WELLS>" + "\n";
   formatted += indent + "</PLATE>" + "\n";

   return formatted;
}

/**
 * Formats a stack as an XML string.
 * @ignore
 * @param {Stack} stack - the input stack
 * @returns {string} the XML formatted string
 */
MicroXML.prototype.stringifyStack = function(stack, indent) {

   WellSetValidation.validateStack(stack);

   var formatted = "";

   formatted += indent + "<STACK>" + "\n";
   formatted += indent + "   <LABEL>" + stack.name + "</LABEL>" + "\n";
   formatted += indent + "   <ROWS>" + stack.rows + "</ROWS>" + "\n";
   formatted += indent + "   <COLUMNS>" + stack.columns + "</COLUMNS>" + "\n";
   formatted += indent + "   <DESCRIPTOR>" + this.descriptor(stack.plateType, stack.rows, stack.columns) + "</DESCRIPTOR>" + "\n";
   formatted += indent + "   <PLATES>" + "\n";

   for(var plate of stack) {
      formatted += indent + this.stringifyPlate(plate, indent + "      ");
   }

   formatted += indent + "   </PLATES>" + "\n";
   formatted += indent + "</STACK>" + "\n";

   return formatted;
}

/**
 * Parses a well, well set, well group, plate or stack XML string.
 * @param {string} input - the XML formatted string
 * @returns {(Well|WellSet|WellGroup|Plate|Stack)} the parsed object
 */
 MicroXML.prototype.parse = function(input) {

    Validation.validateArguments(arguments.length, MicroXML.prototype.parse.length, "MicroXML.prototype.parse");

    if(Validation.getType(input) != '[object String]') {
      throw new TypeError("Input must be a string: " + input);
    }

    var split = input.split("\n");

    switch(split[0].trim()) {

      case '<WELL>':      return this.parseWell(input);

      case '<WELLSET>':   return this.parseWellSet(input);

      case '<WELLGROUP>': return this.parseWellGroup(input);

      case '<PLATE>':     return this.parsePlate(input);

      case '<STACK>':     return this.parseStack(input);

      default: throw new TypeError("Invalid XML string: " + parsed.type);
   }

}

/**
 * Converts an XML parsed well into a well object.
 * @ignore
 * @param {Object} input - the XML parsed well
 * @returns {Well} the well object
 */
MicroXML.prototype.parseWell = function(input) {

   var row = Number.parseInt(this.extractTagValue(input, this.rowRegex));
   var column = Number.parseInt(this.extractTagValue(input, this.columnRegex));
   var data = this.extractTagValue(input, this.dataRegex);

   var values = [];

   var result;

   while(result = this.globalValueRegex.exec(data)) {
      var value = this.extractTagValue(result[0], this.valueRegex);
      values.push(Number.parseFloat(value));
   }

   return new Well(row, column, values);
}

/**
 * Converts an XML parsed well set into a well object.
 * @ignore
 * @param {Object} input - the XML parsed well set
 * @returns {WellSet} the well set object
 */
MicroXML.prototype.parseWellSet = function(input) {

   var label = this.extractTagValue(input, this.labelRegex);
   var wells = this.extractTagValue(input, this.wellsRegex);

   var set = new WellSet(label);

   var result;

   while(result = this.globalWellRegex.exec(wells)) {
      var well = this.parseWell(result[0]);
      set.add(well);
   }

   return set;
}

/**
 * Converts an XML parsed well group into a well group object.
 * @ignore
 * @param {Object} input - the XML parsed well group
 * @returns {WellGroup} the well group object
 */
MicroXML.prototype.parseWellGroup = function(input) {

   var label = this.extractTagValue(input, this.labelRegex);
   var wells = this.extractTagValue(input, this.wellsRegex);

   var indices = [];

   var result;

   while(result = this.globalIndexRegex.exec(wells)) {
      var index = this.extractTagValue(result[0], this.indexRegex);
      indices.push(index);
   }

   return new WellGroup(indices, label);
}

/**
 * Converts an XML parsed plate into a plate object.
 * @ignore
 * @param {Object} input - the XML parsed plate
 * @returns {Plate} the plate object
 */
MicroXML.prototype.parsePlate = function(input) {

   var label = this.extractTagValue(input, this.labelRegex);
   var rows = Number.parseInt(this.extractTagValue(input, this.rowsRegex));
   var columns = Number.parseInt(this.extractTagValue(input, this.columnsRegex));
   var wells = this.extractTagValue(input, this.wellsRegex);
   var groups = this.extractTagValue(input, this.groupsRegex);

   var plate = new Plate(rows, columns, label);

   var result;

   while(result = this.globalGroupsRegex.exec(groups)) {
      var group = this.parseWellGroup(result[0]);
      plate.addGroups(group);
   }

   while(result = this.globalWellRegex.exec(wells)) {
      var well = this.parseWell(result[0]);
      plate.add(well);
   }

   return plate;
}

/**
 * Converts an XML parsed stack into a stack object.
 * @ignore
 * @param {Object} input - the XML parsed stack
 * @returns {Stack} the stack object
 */
MicroXML.prototype.parseStack = function(input) {

   var label = this.extractTagValue(input, this.labelRegex);
   var rows = Number.parseInt(this.extractTagValue(input, this.rowsRegex));
   var columns = Number.parseInt(this.extractTagValue(input, this.columnsRegex));
   var plates = this.extractTagValue(input, this.platesRegex);

   var stack = new Stack(rows, columns, label);

   var result;

   while(result = this.globalPlateRegex.exec(plates)) {
      var plate = this.parsePlate(result[0]);
      stack.add(plate);
   }

   return stack;
}

/**
 * Extracts an XML tag value if the regex matches the tag.
 * @ignore
 * @param {string} input - the input string containing the XML tag/value
 * @param {Regex} regex - the regex object for matching the tag
 * @returns {string} the extracted value
 */
MicroXML.prototype.extractTagValue = function(input, regex) {

   var matches = input.match(regex);

   if(matches.length != 4) {
      throw new TypeError("Invalid XML string: " + input);
   }

   return matches[2];
}

/**
 * Returns a descriptor of the plate type.
 * @ignore
 * @param {number} type - the plate type flag
 * @returns {string} the plate type descriptor
 */
MicroXML.prototype.descriptor = function(type, rows, columns) {

   switch(type) {

      case PlateValidation.PLATE_6WELL:    return "6-Well";

      case PlateValidation.PLATE_12WELL:   return "12-Well";

      case PlateValidation.PLATE_24WELL:   return "24-Well";

      case PlateValidation.PLATE_48WELL:   return "48-Well";

      case PlateValidation.PLATE_96WELL:   return "96-Well";

      case PlateValidation.PLATE_384WELL:  return "384-Well";

      case PlateValidation.PLATE_1536WELL: return "1536-Well";

      default:                             return "Custom Plate " + rows + "x" + columns;

   }

}
