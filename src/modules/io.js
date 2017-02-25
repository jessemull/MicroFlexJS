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
 * This module combines the MicroJSON and MicroXML classes.
 *
 * In order to prevent duplicate values, wells and plates are stored in typed
 * hash sets. The IO classes convert the hash sets to a more condensed, user-friendly
 * format while adding an object description and type to the JSON or XML
 * output. The stringify and parse MicroJSON functions mirror the JSON.stringify
 * and JSON.parse functions, accepting replacer, space number and reviver function
 * arguments.
 *
 * <br><br>
 *
 * The examples below compare the output of console.log, JSON.stringify,
 * MicroJSON.stringify and MicroXML.stringify functions.
 *
 * <br><br>
 *
 * <b>Examples of JSON Output:</b>
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
 * <br>
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
 *
 * @module IO
 * @author Jesse L. Mull
 * @version Updated February 17, 2016
 * @license Apache License 2.0
 * @see <a href="http://www.jessemull.com" target="_blank">http://www.jessemull.com</a><br>
 * @see <a href="mailto:hello@jessemull.com">hello@jessemull.com</a>
 */
module.exports = {
   MicroJSON: require('../io/microjson'),
   MicroXML: require('../io/microxml'),
}
