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

module.exports = new MicroJSON();

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
 * easy to read JSON format. The MicroJSON.stringify and MicroJSON.parse functions
 * mirror JSON.stringify and JSON.parse, accepting replacer/space and reviver
 * arguments. Wells, well groups and plates are housed within typed hash set objects.
 * This class converts the hash sets to simple objects which are easier to read
 * and parse.
 *
 * <br><br>
 *
 * <b>Comparison of JSON Output:</b>
 *
 * <br><br>
 *
 * <table class="mytable" cellspacing="10px" style="text-align:left; margin: 20px;">
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 5px; padding-top: 18px;"><b>Object</b><div></th>
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 5px; padding-top: 18px;"><b>Console.log</b><div></th>
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 5px; padding-top: 18px;"><b>JSON.stringify</b><div></th>
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 5px; padding-top: 18px;"><b>MicroJSON.stringify</b></div></th>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td><b>Well</b></td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td  style="font-size: 70%" valign="top">
 *          <table border="0">
 *             <tr>
 *                <td style="padding-top: 7px;">
 *                   <pre style="margin: 0; display: inline;">Well {
 *    base: 26,
 *    row: 0,
 *    column: 1,
 *    data: [ 1, 2, 3, 4 ]
 * }</pre>
 *                </td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td style="font-size: 70%" valign="top">
 *          <table>
 *             <tr>
 *                <td>
 *                   <pre style="margin: 0; display: inline;">{
 *    "base": 26,
 *    "row": 0,
 *    "column": 1,
 *    "data": [ 1, 2, 3, 4]
 * }</pre>
 *                </td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td style="font-size: 70%" valign="top">
 *          <table>
 *             <tr>
 *                <td style="padding-top: 7px;">
 *                   <pre style="margin: 0; display: inline;">{
 *    "type": "Well",
 *    "index": "A1",
 *    "row": 0,
 *    "column": 1,
 *    "data": [ 1, 2, 3, 4]
 * }</pre>
 *                </td>
 *             </tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <div style="border-bottom: 1px solid black; margin-bottom: 10px;"><div>
 *                <td><b>Well Group</b></td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td  style="font-size: 70%" valign="top">
 *          <table border="0">
 *             <tr>
 *                <div style="border-bottom: 1px solid black; margin-bottom: 10px;"><div>
 *                <td style="padding-top: 7px;">
 *                   <pre style="margin: 0; display: inline;">WellGroup {
 *    groupName: 'Example Group',
 *    wells: TypedHashSet {
 *       values: {
 *          A1: 'A1',
 *          B2: 'B2',
 *          C5: 'C5',
 *          D9: 'D9'
 *       },
 *       type: 'String'
 *    }
 * }</pre>
 *                </td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td style="font-size: 70%" valign="top">
 *          <table>
 *             <tr>
 *                <div style="border-bottom: 1px solid black; margin-bottom: 10px;"><div>
 *                <td>
 *                   <pre style="margin: 0; display: inline;">{
 *    "groupName": "Example Group",
 *    "wells": {
 *       "values": {
 *          "A1": "A1",
 *          "B2": "B2",
 *          "C5": "C5",
 *          "D9": "D9"
 *       },
 *       "type": "String"
 *    }
 * }</pre>
 *                </td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td style="font-size: 70%" valign="top">
 *          <table>
 *             <tr>
 *                <div style="border-bottom: 1px solid black; margin-bottom: 10px;"><div>
 *                <td style="padding-top: 7px;">
 *                   <pre style="margin: 0; display: inline;">{
 *    "type": "WellGroup",
 *    "label": "Example Group",
 *    "wells": [ "A1", "B2", "C5", "D9" ]
 * }</pre>
 *                </td>
 *             </tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <div style="border-bottom: 1px solid black; margin-bottom: 10px;"><div>
 *                <td><b>Well Set</b></td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td style="font-size: 70%" valign="top">
 *          <table border="0">
 *             <tr>
 *                <div style="border-bottom: 1px solid black; margin-bottom: 10px;"><div>
 *                <td style="padding-top: 7px;">
 *                   <pre style="margin: 0; display: inline;">WellSet {
 *    name: 'Example Set',
 *    wells: TypedHashSet {
 *       values: {
 *          A1: Well {
 *             base: 26,
 *             row: 0,
 *             column: 1,
 *             data: [ 1, 2, 3, 4 ] },
 *          B2: Well {
 *             base: 26,
 *             row: 1,
 *             column: 2,
 *             data: [ 5, 6, 7, 8 ]
 *          }
 *       },
 *       type: 'Well'
 *    }
 * }</pre>
 *                </td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td style="font-size: 70%" valign="top">
 *          <table>
 *             <tr>
 *                <div style="border-bottom: 1px solid black; margin-bottom: 10px;"><div>
 *                <td style="padding-top: 7px;">
 *                   <pre style="margin: 0; display: inline;">{
 *    "name": "Example Set",
 *    "wells": {
 *       "values": {
 *          "A1": {
 *             "base": 26,
 *             "row": 0,
 *             "column": 1,
 *             "data": [ 1, 2, 3, 4 ]
 *          },
 *          "B2": {
 *             "base": 26,
 *             "row": 1,
 *             "column": 2,
 *             "data": [ 5, 6, 7, 8 ]
 *          }
 *       },
 *       "type": "Well"
 *    }
 * }</pre>
 *                </td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td style="font-size: 70%" valign="top">
 *          <table>
 *             <tr>
 *                <div style="border-bottom: 1px solid black; margin-bottom: 10px;"><div>
 *                <td style="padding-top: 7px;">
 *                   <pre style="margin: 0; display: inline;">{
 *    "type": "WellSet",
 *    "label": "Example Set",
 *    "wells": {
 *       "A1": {
 *          "row": 0,
 *          "column": 1,
 *          "data": [ 1, 2, 3, 4 ]
 *       },
 *       "B2": {
 *          "row": 1,
 *          "column": 2,
 *          "data": [ 5, 6, 7, 8 ]
 *       }
 *    }
 * }</pre>
 *                </td>
 *             </tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <div style="border-bottom: 1px solid black; margin-bottom: 10px;"><div>
 *                <td><b>Plate</b></td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td style="font-size: 70%" valign="top">
 *          <table border="0">
 *             <tr>
 *                <div style="border-bottom: 1px solid black; margin-bottom: 10px;"><div>
 *                <td style="padding-top: 7px;">
 *                   <pre style="margin: 0; display: inline;">Plate {
 *    plateType: 4,
 *    rows: 8,
 *    columns: 12,
 *    groups: TypedHashSet {
 *       values: {
 *          group: WellGroup {
 *             groupName: 'Example Group',
 *             wells: TypedHashSet {
 *                values: {
 *                   A1: 'A1',
 *                   B2: 'B2'
 *                },
 *                type: 'String'
 *             }
 *          }
 *       },
 *       type: 'WellGroup'
 *    },
 *    name: 'Example Plate',
 *    wells: TypedHashSet {
 *       values: {
 *          A1: Well {
 *             base: 26,
 *             row: 0,
 *             column: 1,
 *             data: [ 1, 2, 3, 4 ]
 *          },
 *          B2: Well {
 *             base: 26,
 *             row: 1,
 *             column: 2,
 *             data: [ 5, 6, 7, 8 ]
 *          },
 *          C5: Well {
 *             base: 26,
 *             row: 2,
 *             column: 5,
 *             data: [ 9, 10, 11, 12 ]
 *          }
 *       },
 *       type: 'Well'
 *    }
 * }</pre>
 *                </td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td style="font-size: 70%" valign="top">
 *          <table>
 *             <tr>
 *                <div style="border-bottom: 1px solid black; margin-bottom: 10px;"><div>
 *                <td style="padding-top: 7px;">
 *                   <pre style="margin: 0; display: inline;">{
 *    "plateType": 4,
 *    "rows": 8,
 *    "columns": 12,
 *    "groups": {
 *       "values": {
 *          group: {
 *             "groupName": "Example Group",
 *             "wells": {
 *                "values": {
 *                   "A1": "A1",
 *                   "B2": "B2"
 *                },
 *                "type": "String"
 *             }
 *          }
 *       },
 *       "type": "WellGroup"
 *    },
 *    "name": "Example Plate",
 *    "wells": {
 *       "values": {
 *          "A1": {
 *             "base": 26,
 *             "row": 0,
 *             "column": 1,
 *             "data": [ 1, 2, 3, 4 ]
 *          },
 *          "B2": {
 *             "base": 26,
 *             "row": 1,
 *             "column": 2,
 *             "data": [ 5, 6, 7, 8 ]
 *          },
 *          "C5": {
 *             "base": 26,
 *             "row": 2,
 *             "column": 5,
 *             "data": [ 9, 10, 11, 12 ]
 *          }
 *       },
 *       "type": "Well"
 *    }
 * }</pre>
 *                </td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td style="font-size: 70%" valign="top">
 *          <table>
 *             <tr>
 *                <div style="border-bottom: 1px solid black; margin-bottom: 10px;"><div>
 *                <td style="padding-top: 7px;">
 *                   <pre style="margin: 0; display: inline;">{
 *    "type": "Plate",
 *    "label": "Example Plate",
 *    "rows": 8,
 *    "columns": 12,
 *    "descriptor": "96-Well",
 *    "groups": {
 *       "Example Group": [ "A1", "B2" ]
 *    },
 *    "wells": {
 *       "A1": {
 *          "row": 0,
 *          "column": 1,
 *          "data": [ 1, 2, 3, 4 ]
 *       },
 *       "B2": {
 *          "row": 1,
 *          "column": 2,
 *          "data": [ 5, 6, 7, 8 ]
 *       },
 *       "C5": {
 *          "row": 2,
 *          "column": 5,
 *          "data": [ 9, 10, 11, 12 ]
 *       }
 *    }
 * }</pre>
 *                </td>
 *             </tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <div style="border-bottom: 1px solid black; margin-bottom: 10px;"><div>
 *                <td><b>Stack</b></td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td style="font-size: 70%" valign="top">
 *          <table border="0">
 *             <tr>
 *                <div style="border-bottom: 1px solid black; margin-bottom: 10px;"><div>
 *                <td style="padding-top: 7px;">
 *                   <pre style="margin: 0; display: inline;">Stack {
 *    plateType: 4,
 *    rows: 8,
 *    columns: 12,
 *    name: 'Test Stack',
 *    plates: TypedHashSet {
 *       values: {
 * 	    Plate {
 * 	       plateType: 4,
 * 	       rows: 8,
 * 	       columns: 12,
 * 	       groups: TypedHashSet {
 * 	          values: {
 * 		     group: WellGroup {
 * 		        groupName: 'Example Group',
 * 		        wells: TypedHashSet {
 * 		           values: {
 * 		              A1: 'A1',
 * 		              B2: 'B2'
 * 		           },
 * 		           type: 'String'
 * 		        }
 * 		     }
 * 	          },
 * 	          type: 'WellGroup'
 * 	       },
 * 	       name: 'Example Plate 1',
 * 	       wells: TypedHashSet {
 * 	          values: {
 * 		     A1: Well {
 * 		        base: 26,
 * 		        row: 0,
 * 		        column: 1,
 * 		        data: [ 1, 2, 3, 4 ]
 * 		     },
 * 		     B2: Well {
 * 		        base: 26,
 * 		        row: 1,
 * 		        column: 2,
 * 		        data: [ 5, 6, 7, 8 ]
 * 		     },
 * 		     C5: Well {
 * 		        base: 26,
 * 		        row: 2,
 * 		        column: 5,
 * 		        data: [ 9, 10, 11, 12 ]
 * 		     }
 * 	          },
 * 	          type: 'Well'
 * 	       }
 * 	    },
 * 	    Plate {
 * 	       plateType: 4,
 * 	       rows: 8,
 * 	       columns: 12,
 * 	       groups: TypedHashSet {
 * 	          values: {
 * 		     group: WellGroup {
 * 		        groupName: 'Example Group',
 * 		        wells: TypedHashSet {
 * 		           values: {
 * 		              B2: 'B2',
 * 		              C5: 'C5'
 * 		           },
 * 		           type: 'String'
 * 		        }
 * 		     }
 * 	          },
 * 	          type: 'WellGroup'
 * 	       },
 * 	       name: 'Example Plate 1',
 * 	       wells: TypedHashSet {
 * 	          values: {
 * 		     A1: Well {
 * 		        base: 26,
 * 		        row: 0,
 * 		        column: 1,
 * 		        data: [ 13, 14, 15, 16 ]
 * 		     },
 * 		     B2: Well {
 * 		        base: 26,
 * 		        row: 1,
 * 		        column: 2,
 * 		        data: [ 17, 18, 19, 20 ]
 * 		     },
 * 		     C5: Well {
 * 		        base: 26,
 * 		        row: 2,
 * 		        column: 5,
 * 		        data: [ 21, 22, 23, 24 ]
 * 		     }
 * 	          },
 * 	          type: 'Well'
 * 	       }
 * 	    }
 *       },
 *       type: 'Plate'
 *    }
 * }</pre>
 *                </td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td style="font-size: 70%" valign="top">
 *          <table>
 *             <tr>
 *                <div style="border-bottom: 1px solid black; margin-bottom: 10px;"><div>
 *                <td style="padding-top: 7px;">
 *                   <pre style="margin: 0; display: inline;">{
 *    "plateType": 4,
 *    "rows": 8,
 *    "columns": 12,
 *    "name": "Test Stack",
 *    "plates": {
 *       "values": {
 *          "plateType": 4,
 *          "rows": 8,
 *          "columns": 12,
 *          "groups": {
 *             "values": {
 *                "group": {
 *                   "groupName": "Example Group",
 *                   "wells": {
 *                     "values": {
 *                         "A1": "A1",
 *                         "B2": "B2"
 *                      },
 *                      "type": "String"
 *                   }
 *                }
 *             },
 *             "type": "WellGroup"
 *          },
 *          "name": "Example Plate 1",
 *          "wells": {
 *             "values": {
 *                "A1": {
 *                   "base": 26,
 *                   "row": 0,
 *                   "column": 1,
 *                   "data": [ 1, 2, 3, 4 ]
 *                },
 *                "B2": {
 *                   "base": 26,
 *                   "row": 1,
 *                   "column": 2,
 *                   "data": [ 5, 6, 7, 8 ]
 *                }
 *             },
 *             "type": "Well"
 *          }
 *       },
 *       {
 *          "plateType": 4,
 *          "rows": 8,
 *          "columns": 12,
 *          "groups": {
 *             "values": {
 *                "group": {
 *                   "groupName": "Example Group",
 *                   "wells": {
 *                      "values": {
 *                         "A1": "A1",
 *                         "B2": "B2"
 *                      },
 *                      "type": "String"
 *                   }
 *                }
 *             },
 *             "type": "WellGroup"
 *          },
 *          "name": "Example Plate 1",
 *          "wells": {
 *             "values": {
 *                "A1": {
 *                   "base": 26,
 *                   "row": 0,
 *                   "column": 1,
 *                   "data": [ 9, 10, 11, 12 ]
 *                },
 *                "B2": {
 *                   "base": 26,
 *                   "row": 1,
 *                   "column": 2,
 *                   "data": [ 13, 14, 15, 16 ]
 *                }
 *             },
 *             "type": "Well"
 *          }
 *       },
 *       "type": "Plate"
 *    }
 * }</pre>
 *                </td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td style="font-size: 70%" valign="top">
 *          <table>
 *             <tr>
 *                <div style="border-bottom: 1px solid black; margin-bottom: 10px;"><div>
 *                <td style="padding-top: 7px;">
 *                   <pre style="margin: 0; display: inline;">{
 *    "type": "Stack",
 *    "label": "Test Stack",
 *    "rows": 8,
 *    "columns": 12,
 *    "descriptor": "96-Well",
 *    "plates": {
 *       "Example Plate 1": {
 *          "label": "Example Plate 1",
 *          "groups": {
 *             "Example Group": [ "A1", "B2" ]
 *          },
 *          "wells": {
 *             "A1": {
 *                "row": 0,
 *                "column": 1,
 *                "data": [ 1, 2, 3, 4 ]
 *             },
 *             "B2": {
 *                "row": 1,
 *                "column": 2,
 *                "data": [ 5, 6, 7, 8 ]
 *             }
 *          }
 *       },
 *       "Example Plate 2": {
 *          "label": "Example Plate 2",
 *          "groups": {
 *             "Example Group": [ "C5", "D9" ]
 *          },
 *          "wells": {
 *             "C5": {
 *                "row": 2,
 *                "column": 5,
 *                "data": [ 9, 10, 11, 12 ]
 *             },
 *             "D9": {
 *                "row": 3,
 *                "column": 9,
 *                "data": [ 13, 14, 15, 16 ]
 *             }
 *          }
 *       }
 *    }
 * }</pre>
 *                </td>
 *             </tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td valign="top">
 *          <table>
 *             <tr>
 *                <div style="border-bottom: 1px solid black; margin-bottom: 10px;"><div>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table>
 *             <tr>
 *                <div style="border-bottom: 1px solid black; margin-bottom: 10px;"><div>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table>
 *             <tr>
 *                <div style="border-bottom: 1px solid black; margin-bottom: 10px;"><div>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table>
 *             <tr>
 *                <div style="border-bottom: 1px solid black; margin-bottom: 10px;"><div>
 *             </tr>
 *          </table>
 *       <td>
 *    </tr>
 * </table>
 *
 * @constructor
 * @memberof module:IO
 * @author Jesse L. Mull
 * @version Updated February 17, 2016
 * @license Apache License 2.0
 * @see <a href="http://www.jessemull.com" target="_blank">http://www.jessemull.com</a><br>
 * @see <a href="mailto:hello@jessemull.com">hello@jessemull.com</a>
 */
function MicroJSON() {}

/**
 * Formats a well, well set, well group, plate or stack as a JSON string.
 * @param {(Well|WellSet|WellGroup|Plate|Stack)} input - the input object
 * @param {Object} replacer - the replacement function or array of replacement number/strings
 * @param {(number|string)} space - number of spaces or string delimiter for formatting
 * @returns {string} the JSON formatted string
 */
 MicroJSON.prototype.stringify = function(input, replacer, space) {

    Validation.validateArgumentRange(arguments.length, 1, 3, "MicroJSON.prototype.stringify");

    switch(Validation.getType(input)) {

      case '[object Well]': return this.stringifyWell(input, replacer, space);

      case '[object WellSet]': return this.stringifyWellSet(input, replacer, space);

      case '[object WellGroup]': return this.stringifyWellGroup(input, replacer, space);

      case '[object Plate]': return this.stringifyPlate(input, replacer, space);

      case '[object Stack]': return this.stringifyStack(input, replacer, space);

      default: throw new TypeError("Invalid input type: " + input);
   }

}

/**
 * Formats a well as a JSON string.
 * @ignore
 * @param {Well} well - the input well
 * @param {Object} replacer - the replacement function or array of replacement number/strings
 * @param {(number|string)} space - numbers of spaces or string delimiter for formatting
 * @returns {string} the JSON formatted string
 */
MicroJSON.prototype.stringifyWell = function(well, replacer, space) {

   WellValidation.validateWell(well);

   var formatted = {};

   formatted.type = "Well";
   formatted.index = well.toString();
   formatted.row = well.row;
   formatted.column = well.column;
   formatted.data = well.data;

   return JSON.stringify(formatted, replacer, space);
}

/**
 * Formats a well set as a JSON string.
 * @ignore
 * @param {WellSet} set - the input set
 * @param {Object} replacer - the replacement function or array of replacement number/strings
 * @param {(number|string)} space - numbers of spaces or string delimiter for formatting
 * @returns {string} the JSON formatted string
 */
MicroJSON.prototype.stringifyWellSet = function(set, replacer, space) {

   WellSetValidation.validateWellSet(set);

   var formatted = {};

   formatted.type = "WellSet";
   formatted.label = set.name;
   formatted.wells = {};

   for(var well of set) {

      var formattedWell = {};

      formattedWell.row = well.row;
      formattedWell.column = well.column;
      formattedWell.data = well.data;

      formatted.wells[well.toString()] = formattedWell;
   }

   return JSON.stringify(formatted, replacer, space);
}

/**
 * Formats a well group as a JSON string.
 * @ignore
 * @param {WellGroup} group - the input group
 * @param {Object} replacer - the replacement function or array of replacement number/strings
 * @param {(number|string)} space - numbers of spaces or string delimiter for formatting
 * @returns {string} the JSON formatted string
 */
MicroJSON.prototype.stringifyWellGroup = function(group, replacer, space) {

   WellSetValidation.validateGroup(group);

   var formatted = {};

   formatted.type = "WellGroup";
   formatted.label = group.groupName;
   formatted.wells = group.toArray();

   return JSON.stringify(formatted, replacer, space);
}

/**
 * Formats a plate as a JSON string.
 * @ignore
 * @param {Plate} plate - the input plate
 * @param {Object} replacer - the replacement function or array of replacement number/strings
 * @param {(number|string)} space - numbers of spaces or string delimiter for formatting
 * @returns {string} the JSON formatted string
 */
MicroJSON.prototype.stringifyPlate = function(plate, replacer, space) {

   WellSetValidation.validatePlate(plate);

   var formatted = {};

   formatted.type = "Plate";
   formatted.label = plate.name;
   formatted.rows = plate.rows;
   formatted.columns = plate.columns;
   formatted.descriptor = this.descriptor(plate.plateType, plate.rows, plate.columns);

   formatted.groups = {};

   for(var group of plate.allGroupsToArray()) {
      formatted.groups[group.groupName] = group.toArray();
   }

   formatted.wells = {};

   for(var well of plate) {

      var formattedWell = {};

      formattedWell.row = well.row;
      formattedWell.column = well.column;
      formattedWell.data = well.data;

      formatted.wells[well.toString()] = formattedWell;
   }

   return JSON.stringify(formatted, replacer, space);
}

/**
 * Formats a stack as a JSON string.
 * @ignore
 * @param {Stack} stack - the input stack
 * @param {Object} replacer - the replacement function or array of replacement number/strings
 * @param {(number|string)} space - numbers of spaces or string delimiter for formatting
 * @returns {string} the JSON formatted string
 */
MicroJSON.prototype.stringifyStack = function(stack, replacer, space) {

   WellSetValidation.validateStack(stack);

   var formatted = {};

   formatted.type = "Stack";
   formatted.label = stack.name;
   formatted.rows = stack.rows;
   formatted.columns = stack.columns;
   formatted.descriptor = this.descriptor(stack.plateType, stack.rows, stack.columns);

   formatted.plates = {};

   for(var plate of stack) {

      formattedPlate = {};
      formattedPlate.label = plate.name;
      formattedPlate.groups = {};

      for(var group of plate.allGroupsToArray()) {
         formattedPlate.groups[group.groupName] = group.toArray();
      }

      formattedPlate.wells = {};

      for(var well of plate) {

         var formattedWell = {};

         formattedWell.row = well.row;
         formattedWell.column = well.column;
         formattedWell.data = well.data;

         formattedPlate.wells[well.toString()] = formattedWell;
      }

      formatted.plates[plate.name] = formattedPlate;
   }

   return JSON.stringify(formatted, replacer, space);

}

/**
 * Parses a well, well set, well group, plate or stack JSON string.
 * @param {string} input - the JSON formatted string
 * @param {Object} reviver - the reviver function or array of reviver number/strings
 * @returns {(Well|WellSet|WellGroup|Plate|Stack)} the parsed object
 */
 MicroJSON.prototype.parse = function(input, reviver) {

    Validation.validateArgumentRange(arguments.length, 1, 2, "MicroJSON.prototype.stringify");

    if(Validation.getType(input) != '[object String]') {
      throw new TypeError("Input must be a string: " + input);
   }

    var parsed = JSON.parse(input, reviver);

    switch(parsed.type) {

      case 'Well':      return this.parseWell(parsed);

      case 'WellSet':   return this.parseWellSet(parsed);

      case 'WellGroup': return this.parseWellGroup(parsed);

      case 'Plate':     return this.parsePlate(parsed);

      case 'Stack':     return this.parseStack(parsed);

      default: throw new TypeError("Invalid JSON string: " + parsed.type);
   }

}

/**
 * Converts a JSON parsed well into a well object.
 * @ignore
 * @param {Object} input - the JSON parsed well
 * @returns {Well} the well object
 */
MicroJSON.prototype.parseWell = function(input) {
   return new Well(input.row, input.column, input.data);
}

/**
 * Converts a JSON parsed well set into a well object.
 * @ignore
 * @param {Object} input - the JSON parsed well set
 * @returns {WellSet} the well set object
 */
MicroJSON.prototype.parseWellSet = function(input) {

   var set = new WellSet(input.label);

   for(var well in input.wells) {
      var nextWell = input.wells[well];
      set.add(new Well(nextWell.row, nextWell.column, nextWell.data));
   }

   return set;
}

/**
 * Converts a JSON parsed well group into a well group object.
 * @ignore
 * @param {Object} input - the JSON parsed well group
 * @returns {WellGroup} the well group object
 */
MicroJSON.prototype.parseWellGroup = function(input) {
   return new WellGroup(input.wells, input.label);
}

/**
 * Converts a JSON parsed plate into a plate object.
 * @ignore
 * @param {Object} input - the JSON parsed plate
 * @returns {Plate} the plate object
 */
MicroJSON.prototype.parsePlate = function(input) {

   var plate = new Plate(input.rows, input.columns, input.label);

   for(var group in input.groups) {
      var nextGroup = input.groups[group];
      plate.addGroups(new WellGroup(nextGroup, group));
   }

   for(var well in input.wells) {
      var nextWell = input.wells[well];
      plate.add(new Well(nextWell.row, nextWell.column, nextWell.data));
   }

   return plate;
}

/**
 * Converts a JSON parsed stack into a stack object.
 * @ignore
 * @param {Object} input - the JSON parsed stack
 * @returns {Stack} the stack object
 */
MicroJSON.prototype.parseStack = function(input) {

   var stack = new Stack(input.rows, input.columns, input.label);

   for(var plate in input.plates) {

      var nextPlate = input.plates[plate];
      var toAdd = new Plate(stack.rows, stack.columns, nextPlate.label);

      for(var group in input.plates[plate].groups) {
         var nextGroup = nextPlate.groups[group];
         toAdd.addGroups(new WellGroup(nextGroup, group));
      }

      for(var well in input.plates[plate].wells) {
         var nextWell = nextPlate.wells[well];
         toAdd.add(new Well(nextWell.row, nextWell.column, nextWell.data));
      }

      stack.add(toAdd);

   }

   return stack;

}

/**
 * Returns a descriptor of the plate type.
 * @ignore
 * @param {number} type - the plate type flag
 * @returns {string} the plate type descriptor
 */
MicroJSON.prototype.descriptor = function(type, rows, columns) {

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
