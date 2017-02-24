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

module.exports = Plate;

/*------------------------------- Dependencies -------------------------------*/

var Well = require('./well');
var WellSet = require('./wellset');
var WellGroup = require('./wellgroup');
var Validation = require('../util/validation');
var WellSetValidation = require('../util/wellsetvalidation');
var PlateValidation = require('../util/platevalidation');
var TypedHashSet = require('../util/typedhashset');

/*------------------------------- Local fields -------------------------------*/

/* Flags for standard plate types */

Plate.prototype.PLATE_6WELL = 0;
Plate.prototype.PLATE_12WELL = 1;
Plate.prototype.PLATE_24WELL = 2;
Plate.prototype.PLATE_48WELL = 3;
Plate.prototype.PLATE_96WELL = 4;
Plate.prototype.PLATE_384WELL = 5;
Plate.prototype.PLATE_1536WELL = 6;

/* Flags for standard row numbers */

Plate.prototype.ROWS_6WELL = 2;
Plate.prototype.ROWS_12WELL = 3;
Plate.prototype.ROWS_24WELL = 4;
Plate.prototype.ROWS_48WELL = 6;
Plate.prototype.ROWS_96WELL = 8;
Plate.prototype.ROWS_384WELL = 16;
Plate.prototype.ROWS_1536WELL = 32;

/* Flags for standard column numbers */

Plate.prototype.COLUMNS_6WELL = 3;
Plate.prototype.COLUMNS_12WELL = 4;
Plate.prototype.COLUMNS_24WELL = 6;
Plate.prototype.COLUMNS_48WELL = 8;
Plate.prototype.COLUMNS_96WELL = 12;
Plate.prototype.COLUMNS_384WELL = 24;
Plate.prototype.COLUMNS_1536WELL = 48;

/*-------------------------------- Constructor -------------------------------*/

/**
 * This class represents a microplate used by chemists, biologists, physicists
 * and many other natural science researchers. A microplate consists of a
 * rectangular grid of wells. Rows are assigned a letter starting with A and
 * working towards Z. Rows outside this range are identified by adding an
 * additional letter to the row index (A -> ... -> Z -> AA -> AB). Columns
 * are assigned integer values starting at zero working towards infinity.
 * The row and column indices uniquely identify a single well (A1, A2 etc). A
 * plate cannot contain duplicate wells or wells with invalid row or column
 * indices.
 *
 * <br><br>
 *
 * Example of a typical microplate layout:
 *
 * <table cellpadding="10px" border="1px" style="margin: 50px; text-align: center">
 *    <tr>
 *       <td></td>
 *       <td>1</td>
 *       <td>2</td>
 *       <td>3</td>
 *       <td>4</td>
 *       <td>5</td>
 *       <td>6</td>
 *       <td>7</td>
 *       <td>8</td>
 *       <td>9</td>
 *       <td>10</td>
 *       <td>11</td>
 *       <td>12</td>
 *    </tr>
 *    <tr>
 *       <td>A</td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *    </tr>
 *    <tr>
 *       <td>B</td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *    </tr>
 *    <tr>
 *       <td>C</td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *    </tr>
 *    <tr>
 *       <td>D</td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *    </tr>
 *    <tr>
 *       <td>E</td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *    </tr>
 *    <tr>
 *       <td>F</td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td
 *    </tr>
 *    <tr>
 *       <td>G</td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td
 *    </tr>
 *    <tr>
 *       <td>H</td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *       <td><div style="border-radius: 50%; border: 1px solid black; width: 20px; height: 20px;"></div></td>
 *    </tr>
 * </table>
 *
 * The plate constructor accepts a flag for plates with standard dimensions:
 *
 * <table class="mytable" cellspacing="10px" style="text-align:left; margin: 20px;">
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
 * Row and column numbers for plates with custom dimensions can be passed to the
 * plate constructor.
 *
 * The plate data is implemented as a set of wells and a set of subgroups.
 * Wells house the well ID and a list of values. Well subsets are used to
 * aggregate data for different experimental conditions or replicates.
 *
 * Descriptive statistics and mathematical operations between plate stacks,
 * plates, well sets and wells are performed using static methods housed within
 * the statistics and math packages respectively. Custom mathematical or statistical
 * calculations can be added by extending the Operation and DescriptiveStatistics
 * classes and overriding the calculate methods.
 *
 * <br><br>
 *
 * The plate class also implements a compareTo function for comparing plates and
 * a sort function for sorting plates within an array. Plates are ordered by label,
 * row number, column number, well number, greatest well and group number in that
 * order.
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
 *                <td><span style="color: purple;">var</span> plate = <span style="color: purple;">new</span> <span style="color: chocolate;">Plate</span>(<span style="color: maroon;">Plate.PLATE_96WELL</span>)</td>
 *             </tr>
 *             <tr>
 *                <td><span style="color: purple;">var</span> plate = <span style="color: purple;">new</span> <span style="color: chocolate;">Plate</span>(<span style="color: maroon;">plate</span>)</td>
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
 *                <td><span style="color: purple;">var</span> plate = <span style="color: purple;">new</span> <span style="color: chocolate;">Plate</span>(<span style="color: maroon;">Plate.PLATE_96WELL</span>)</td>
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
 *                <td><span style="color: purple;">var</span> plate = <span style="color: purple;">new</span> <span style="color: chocolate;">Plate</span>(<span style="color: maroon;">Plate.PLATE_96WELL</span>, <span style="color: maroon;">"Example Plate"</span>)</td>
 *             </tr>
 *             <tr><td>&nbsp;</td></tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td><span style="color: purple;">Plate Type, WellSet</span></td>
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
 *             <tr>
 *                <td><span style="color: purple;">var</span> plate = <span style="color: purple;">new</span> <span style="color: chocolate;">Plate</span>(<span style="color: maroon;">Plate.PLATE_96WELL</span>, <span style="color: maroon;">set</span>)</td>
 *             </tr>
 *             <tr><td>&nbsp;</td></tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td><span style="color: purple;">Plate Type, WellSet, Label</span></td>
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
 *             <tr>
 *                <td><span style="color: purple;">var</span> plate = <span style="color: purple;">new</span> <span style="color: chocolate;">Plate</span>(<span style="color: maroon;">Plate.PLATE_96WELL</span>, <span style="color: maroon;">set</span>, <span style="color: maroon;">"Example Plate"</span>)</td>
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
 *                <td><span style="color: purple;">var</span> plate = <span style="color: purple;">new</span> <span style="color: chocolate;">Plate</span>(<span style="color: maroon;">8</span>, <span style="color: maroon;">12</span>)</td>
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
 *                <td><span style="color: purple;">var</span> plate = <span style="color: purple;">new</span> <span style="color: chocolate;">Plate</span>(<span style="color: maroon;">8</span>, <span style="color: maroon;">12</span>, <span style="color: maroon;">"Example Plate"</span>)</td>
 *             </tr>
 *             <tr><td>&nbsp;</td></tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td><span style="color: purple;">Row Number, Column Number, WellSet</span></td>
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
 *             <tr>
 *                <td><span style="color: purple;">var</span> plate = <span style="color: purple;">new</span> <span style="color: chocolate;">Plate</span>(<span style="color: maroon;">8</span>, <span style="color: maroon;">12</span>, <span style="color: maroon;">set</span>)</td>
 *             </tr>
 *             <tr><td>&nbsp;</td></tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td><span style="color: purple;">Row Number, Column Number, WellSet, Label</span></td>
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
 *             <tr>
 *                <td><span style="color: purple;">var</span> plate = <span style="color: purple;">new</span> <span style="color: chocolate;">Plate</span>(<span style="color: maroon;">8</span>, <span style="color: maroon;">12</span>, <span style="color: maroon;">set</span>, <span style="color: maroon;">"Example Plate"</span>)</td>
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
 * @augments WellSet
 * @param {(number|Plate|number)} var1 - plate type flag | input plate | plate row number
 * @param {(number|WellSet|string)} var2 - plate column number| initial well set | plate label
 * @param {(WellSet|string)} [var3] - initial well set | plate label
 * @param {string} [var4] - plate label
 */
function Plate(var1, var2, var3, var4) {

   this.plateType = -1;                            // The plate type flag
   this.rows = null;                               // The number of plate rows
   this.columns = null;                            // The number of plate columns
   this.groups = new TypedHashSet("WellGroup");    // The plate well groups

   switch(arguments.length) {

      case 1: this.initializeOneArgument(var1);
              break;

      case 2: this.initializeTwoArguments(var1, var2);
              break;

      case 3: this.initializeThreeArguments(var1, var2, var3);
              break;

      case 4: this.initializeFourArguments(var1, var2, var3, var4);
              break;

      default: this.typeError();
   }
}

Plate.prototype = new WellSet();
Plate.prototype.constructor = Plate;

/*----------------------- Constructor Helper Functions -----------------------*/

/**
 * Initializes a plate using one argument.
 * @ignore
 * @param {number|number|Plate} var1 - plate type | row number | input plate
 * @throws {TypeError} on invalid plate input
 */
Plate.prototype.initializeOneArgument = function(var1) {

   if(Validation.getType(var1) === '[object Number]') {

      var parsed = PlateValidation.validatePlateType(var1);

      this.rows = parsed.rows;
      this.columns = parsed.columns;
      this.plateType = var1;

      WellSet.call(this, "Plate");

      return;
   }

   if(Validation.getType(var1) === '[object Plate]') {

      WellSetValidation.validatePlate(var1);

      this.rows = var1.rows;
      this.columns = var1.columns;
      this.plateType = var1.plateType;
      this.groups.addAll(var1.groups.toArray());

      WellSet.call(this, var1.wells.toArray(), var1.name);

      return;
   }

   this.typeError();

}

/**
 * Initializes a plate using two arguments.
 * @ignore
 * @param {(number|number)} var1 - plate type | row number
 * @param {(number|WellSet|string)} var2 - column number | initial well set | plate label
 * @throws {TypeError} on invalid plate input
 */
Plate.prototype.initializeTwoArguments = function(var1, var2) {

   if(Validation.getType(var1) === '[object Number]' && Validation.getType(var2) === '[object String]') {

      var parsed = PlateValidation.validatePlateType(var1);
      Validation.validateString(var2);

      this.rows = parsed.rows;
      this.columns = parsed.columns;
      this.plateType = var1;

      WellSet.call(this, var2);

      return;
   }

   if(Validation.getType(var1) === '[object Number]' && Validation.getType(var2) === '[object WellSet]') {

      var parsed = PlateValidation.validatePlateType(var1);

      this.rows = parsed.rows;
      this.columns = parsed.columns;
      this.plateType = var1;

      WellSet.call(this, var2);

      return;
   }

   if(Validation.getType(var1) === '[object Number]' && Validation.getType(var2) === '[object Number]') {

      Validation.validatePositiveNumber(var1);
      Validation.validatePositiveNumber(var2);

      this.plateType = PlateValidation.plateType(var1, var2);
      this.rows = var1;
      this.columns = var2;

      WellSet.call(this, "Plate");

      return;
   }

   this.typeError();
}

/**
 * Initializes a plate using three arguments.
 * @ignore
 * @param {(number|number)} var1 - plate type | row number
 * @param {(number|WellSet|string)} var2 -  column number | initial well set | plate label
 * @param {(WellSet|string)} var3 - initial well set | plate label
 * @throws {TypeError} on invalid plate input
 */
Plate.prototype.initializeThreeArguments = function(var1, var2, var3) {

   if(Validation.getType(var1) === '[object Number]' && Validation.getType(var2) === '[object WellSet]' && Validation.getType(var3) === '[object String]') {

      var parsed = PlateValidation.validatePlateType(var1);
      Validation.validateString(var3);

      this.rows = parsed.rows;
      this.columns = parsed.columns;
      this.plateType = var1;

      WellSet.call(this, var2, var3);

      return;
   }

   if(Validation.getType(var1) === '[object Number]' && Validation.getType(var2) === '[object Number]' && Validation.getType(var3) === '[object String]') {

      Validation.validatePositiveNumber(var1);
      Validation.validatePositiveNumber(var2);
      Validation.validateString(var3);

      this.plateType = PlateValidation.plateType(var1, var2);
      this.rows = var1;
      this.columns = var2;

      WellSet.call(this, var3);

      return;
   }

   if(Validation.getType(var1) === '[object Number]' && Validation.getType(var2) === '[object Number]' && Validation.getType(var3) === '[object WellSet]') {

      Validation.validatePositiveNumber(var1);
      Validation.validatePositiveNumber(var2);

      this.plateType = PlateValidation.plateType(var1, var2);
      this.rows = var1;
      this.columns = var2;

      WellSet.call(this, var3);

      return;
   }

   this.typeError();
}

/**
 * Initializes a plate using four arguments.
 * @ignore
 * @param {number} var1 - row number
 * @param {number} var2 - column number
 * @param {WellSet} var3 - initial well set
 * @param {string} var4 - plate label
 * @throws {TypeError} on invalid plate input
 */
Plate.prototype.initializeFourArguments = function(var1, var2, var3, var4) {

   if(Validation.getType(var1) === '[object Number]' && Validation.getType(var2) === '[object Number]' &&
      Validation.getType(var3) === '[object WellSet]' && Validation.getType(var4) === '[object String]') {

         Validation.validatePositiveNumber(var1);
         Validation.validatePositiveNumber(var2);
         Validation.validateString(var4);

         this.plateType = PlateValidation.plateType(var1, var2);
         this.rows = var1;
         this.columns = var2;

         WellSet.call(this, var3, var4);

         return;
   }

   this.typeError();
}

/**
 * Throws an error when the plate constructor receives invalid input parameters.
 * @ignore
 * @throws {TypeError} when the function is called
 */
Plate.prototype.typeError = function() {
   throw new TypeError("Well plate constructor accepts the following combinations of arguments: " + "\n" +
                       "  -> Plate - plate to clone" + "\n" +
                       "  -> number - plate type" + "\n" +
                       "  -> number - plate type, string - plate label" + "\n" +
                       "  -> number - plate type, WellSet - initial data set" + "\n" +
                       "  -> number - plate type, WellSet - initial data set, string - plate label" + "\n" +
                       "  -> number - row number, number - column number" + "\n" +
                       "  -> number - row number, number - column number, string - plate label" + "\n" +
                       "  -> number - row number, number - column number, WellSet - initial data set" + "\n" +
                       "  -> number - row number, number - column number, WellSet - initial data set, string - plate label" + "\n");
}

/*----------------------------- Group Functions ------------------------------*/

/**
 * Adds the well groups if they are not already present in the set.
 * @param {(WellGroup|WellGroup[])} groups - input group | input group array
 * @returns {boolean} true if all input groups are added to the set
 * @throws {TypeError} on invalid group input
 */
Plate.prototype.addGroups = function(groups) {

   Validation.validateArguments(arguments.length, Plate.prototype.addGroups.length, "Plate.prototype.addGroups");

   switch(Validation.getType(groups)) {

      case "[object Array]":     PlateValidation.validateGroupArray(groups, this.rows, this.columns);
                                 return this.groups.addAll(groups);

      case "[object WellGroup]": PlateValidation.validateGroup(groups, this.rows, this.columns);
                                 return this.groups.add(groups);

      default: throw new TypeError("Invalid input parameter: " + groups);

   }

}

/**
 * Removes the well groups if they exist in the set.
 * @param {(WellGroup|WellGroup[])} groups - input groups
 * @returns {boolean} true if all input groups are removed successfully
 * @throws {TypeError} on invalid plate input
 */
Plate.prototype.removeGroups = function(groups) {

   Validation.validateArguments(arguments.length, Plate.prototype.removeGroups.length, "Plate.prototype.removeGroups");

   switch(Validation.getType(groups)) {

      case "[object Array]":     return this.groups.removeAll(groups);

      case "[object WellGroup]": return this.groups.remove(groups);

      default: throw new TypeError("Invalid input parameter: " + groups);

   }

}

/**
 * Removes groups with the input names.
 * @param {(string|string[])} names - input group | input group array
 * @returns {boolean} true if all the input groups are removed successfully
 * @throws {TypeError} on invalid group input
 */
Plate.prototype.removeGroupNames = function(names) {

   Validation.validateArguments(arguments.length, Plate.prototype.removeGroupNames.length, "Plate.prototype.removeGroupNames");

   var toRemove = [];

   switch(Validation.getType(names)) {

      case "[object Array]":  for(var group of this.groups) {
                                 if(names.indexOf(group.groupName) > -1) {
                                    toRemove.push(group);
                                 }
                              }

                              break;

      case "[object String]": for(var group of this.groups) {
                                 if(group.groupName === names) {
                                    toRemove.push(group);
                                 }
                              }

                              break;

      default: throw new TypeError("Invalid input parameter: " + groups);

   }

   return this.groups.removeAll(toRemove);
}

/**
 * Clears the well groups.
 */
Plate.prototype.clearGroups = function() {
   this.groups.clear();
}

/**
 * Returns true if the well groups exist.
 * @param {(WellGroup|WellGroup[])} groups - input group | input group array
 * @returns {boolean} true if the plate contains all the input groups
 * @throws {TypeError} on invalid group input
 */
Plate.prototype.containsGroups = function(groups) {

   Validation.validateArguments(arguments.length, Plate.prototype.containsGroups.length, "Plate.prototype.containsGroups");

   switch(Validation.getType(groups)) {

      case "[object Array]":     return this.groups.containsAll(groups);

      case "[object WellGroup]": return this.groups.contains(groups);

      default: throw new TypeError("Invalid input parameter: " + groups);

   }

}

/**
 * Returns true if the plate contains all the groups with the input names.
 * @param {(string|string[])} names - input group | input group array
 * @returns {boolean} true if the plate contains groups with the input names
 * @throws {TypeError} on invalid group input
 */
Plate.prototype.containsGroupNames = function(names) {

   Validation.validateArguments(arguments.length, Plate.prototype.removeGroupNames.length, "Plate.prototype.GroupNames");

   switch(Validation.getType(names)) {

      case "[object Array]":  var array = names.slice();

                              for(var group of this.groups) {

                                 var index = array.indexOf(group.groupName);

                                 if(index > -1) {
                                    array.splice(index, 1);
                                 }

                              }

                              return array.length === 0;

      case "[object String]": for(var group of this.groups) {

                                 if(group.groupName === names) {
                                    return true;
                                 }

                              }

                              return false;

      default: throw new TypeError("Invalid input parameter: " + groups);

   }
}

/**
 * Returns an array holding the input groups if they exist in the plate.
 * @param {(WellGroup|WellGroup[])} input - input group | input group array
 * @returns {WellGroup[]} array of well groups
 * @throws {TypeError} on invalid group input
 */
Plate.prototype.groupsToArray = function(input) {

   var toReturn = [];

   switch(Validation.getType(input)) {

      case '[object WellGroup]': if(this.groups.values[input] != undefined) {
                                    toReturn.push(this.groups.values[input]);
                                 }

                                 break;

      case '[object Array]':     for(var group of input) {

                                    if(Validation.getType(group) != '[object WellGroup]') {
                                       throw new TypeError("Input groups must be well group objects: " + group);
                                    }

                                    if(this.groups.values[group] != undefined) {
                                       toReturn.push(this.groups.values[group]);
                                    }

                                 }

                                 break;

      default: throw new TypeError("Invalid input parameter: " + input);

   }

   return toReturn.sort(WellGroup.prototype.sort);
}

/**
 * Returns an array holding the groups with the input names if they exist.
 * @param {(WellGroup|WellGroup[])} input - input group | input group array
 * @returns {WellGroup[]} array of groups
 * @throws {TypeError} on invalid group input
 */
Plate.prototype.groupNamesToArray = function(input) {

   var toReturn = [];

   switch(Validation.getType(input)) {

      case '[object String]':    for(var group of this.groups) {
                                    if(group.groupName === input) {
                                       toReturn.push(group);
                                    }
                                 }

                                 break;

      case '[object Array]':     for(var group of this.groups) {
                                    if(input.indexOf(group.groupName) > -1) {
                                       toReturn.push(group);
                                    }
                                 }

                                 break;

      default: throw new TypeError("Invalid input parameter: " + input);

   }

   return toReturn.sort(WellGroup.prototype.sort);
}

/**
 * Returns an array of arrays holding the well indices of the input groups if
 * they exist.
 * @param {(WellGroup|WellGroup[])} input - input group | input group array
 * @returns {Object} the array of arrays holding the plate group well indices
 * @throws {TypeError} on invalid group input
 */
Plate.prototype.groupsToString = function(input) {

   var toReturn = [];

   switch(Validation.getType(input)) {

      case '[object WellGroup]': if(this.groups.values[input] != undefined) {

                                    var group = this.groups.values[input];
                                    var toAdd = {};

                                    toAdd.name = group.groupName;
                                    toAdd.wells = group.toArray();
                                    toReturn.push(toAdd);
                                 }

                                 break;

      case '[object Array]':     for(var group of input) {

                                    var type = Validation.getType(group);

                                    if(Validation.getType(group) != '[object WellGroup]') {
                                       throw new TypeError("Input groups must be well group objects: " + group);
                                    }

                                    if(this.groups.values[group] != undefined) {

                                       var value = this.groups.values[group];
                                       var toAdd = {};

                                       toAdd.name = value.groupName;
                                       toAdd.wells = value.toArray();
                                       toReturn.push(toAdd);
                                    }

                                 }

                                 break;

      default: throw new TypeError("Invalid input parameter: " + input);

   }

   return toReturn;
}

/**
 * Returns an array of arrays holding the well indices of the groups with the
 * input names if they exist.
 * @param {(string|string[])} input - input group | input group array
 * @returns {Object} the array of arrays holding the plate group well indices
 * @throws {TypeError} on invalid group input
 */
Plate.prototype.groupNamesToString = function(input) {

   var toReturn = [];

   switch(Validation.getType(input)) {

      case '[object String]':    for(var group of this.groups) {

                                    if(group.groupName === input) {

                                       var toAdd = {};

                                       toAdd.name = group.groupName;
                                       toAdd.wells = group.toArray();
                                       toReturn.push(toAdd);

                                    }
                                 }

                                 break;

      case '[object Array]':     for(var group of this.groups) {

                                    if(input.indexOf(group.groupName) > -1) {

                                       var toAdd = {};

                                       toAdd.name = group.groupName;
                                       toAdd.wells = group.toArray();
                                       toReturn.push(toAdd);
                                    }

                                 }

                                 break;

      default: throw new TypeError("Invalid input parameter: " + input);

   }

   return toReturn;
}

/**
 * Returns an array holding the plate data for the input groups if they exist.
 * @param {(WellGroup|WellGroup[])} input - input group | input group array
 * @returns {WellSet[]} well set array containing the plate data for the input groups
 * @throws {TypeError} on invalid group input
 */
Plate.prototype.groupsToWellSet = function(input) {

   var toReturn = [];

   switch(Validation.getType(input)) {

      case '[object WellGroup]': if(this.groups.values[input] != undefined) {

                                    var indices = this.groups.values[input].toArray();
                                    var wells = this.get(indices);

                                    toReturn.push(new WellSet(wells, this.groups.values[input].groupName));
                                 }

                                 break;

      case '[object Array]':     for(var group of input) {

                                    var type = Validation.getType(group);

                                    if(Validation.getType(group) != '[object WellGroup]') {
                                       throw new TypeError("Input groups must be well group objects: " + group);
                                    }

                                    if(this.groups.values[group] != undefined) {

                                       var indices = this.groups.values[group].toArray();
                                       var wells = this.get(indices);

                                       toReturn.push(new WellSet(wells, this.groups.values[group].groupName));
                                    }

                                 }

                                 break;

      default: throw new TypeError("Invalid input parameter: " + input);
   }

   return toReturn;
}

/**
 * Returns an array holding the plate data for the plate groups with the input
 * names if they exist.
 * @param {(string|string[])} input - input group name | array of input group names
 * @returns {WellSet[]} well set array containing the plate data for the input groups
 * @throws {TypeError} on invalid group input
 */
Plate.prototype.groupNamesToWellSet = function(input) {

   var toReturn = [];

   switch(Validation.getType(input)) {

      case '[object String]':   for(var group of this.groups) {
                                    if(group.groupName === input) {
                                       var wells = this.get(group.toArray());
                                       toReturn.push(new WellSet(wells, group.groupName));
                                    }
                                 }

                                 break;

      case '[object Array]':     for(var group of this.groups) {
                                    if(input.indexOf(group.groupName) > -1) {
                                       var wells = this.get(group.toArray());
                                       toReturn.push(new WellSet(wells, group.groupName));
                                    }
                                 }

                                 break;

      default: throw new TypeError("Invalid input parameter: " + input);
   }

   return toReturn;
}

/**
 * Returns an array holding all the plate's well group objects.
 * @returns {WellGroup[]} the array of groups
 */
Plate.prototype.allGroupsToArray = function() {
   var array = this.groups.toArray();
   return array.sort();
}

/**
 * Returns an array of arrays holding the well indices for all plate groups.
 * @returns {Object} the array of arrays holding all plate group well indices
 */
Plate.prototype.allGroupsToString = function() {

   var array = [];

   for(var group of this.groups) {

      var toAdd = {};

      toAdd.name = group.groupName;
      toAdd.wells = group.toArray();
      array.push(toAdd);
   }

   return array;
}

/**
 * Returns an array containing the plate data for all plate groups.
 * @returns {WellSet[]} well set array containing the plate data for all plate groups
 */
Plate.prototype.allGroupsToWellSet = function() {

   var array = [];

   for(var group of this.groups) {
      var indices = group.toArray();
      var set = new WellSet(this.get(indices), group.groupName);
      array.push(set);
   }

   return array;
}

/**
 * Returns an array holding the group names.
 * @returns {string[]} array holding the group names
 */
Plate.prototype.groupNames = function() {

   var toReturn = [];

   for(var group of this.groups) {
      toReturn.push(group.groupName);
   }

   return toReturn.sort();
}

/*------------------------------ Well Functions ------------------------------*/

/**
 * Adds wells to the plate if they are not already present.
 * @param {(Well|Well[]|WellSet)} input - input well | input well array | input well set
 * @returns {boolean} true if this plate is changed as a result of the call
 * @throws {TypeError} on invalid well input
 */
Plate.prototype.add = function(input) {

   Validation.validateArguments(arguments.length, Plate.prototype.add.length, "Plate.prototype.add");

   switch(Validation.getType(input)) {

      case '[object Well]':    PlateValidation.validateWell(input, this.rows, this.columns);
                               return this.addWell(input);

      case '[object Array]':   PlateValidation.validateWellArray(input, this.rows, this.columns);
                               return this.addArray(input);

      case '[object WellSet]': PlateValidation.validateWellSet(input, this.rows, this.columns);
                               return this.addSet(input);

      case '[object Plate]':   PlateValidation.validateWellSet(input, this.rows, this.columns);
                               return this.addSet(input.toArray());

      default:                 throw new TypeError("Invalid input type: " + input);

   }

}

/**
 * Returns the number of plate rows.
 * @returns {number} row number
 */
Plate.prototype.rowNumber = function() {
   return this.rows;
}

/**
 * Returns the number of plate columns.
 * @returns {number} column number
 */
Plate.prototype.columnNumber = function() {
   return this.columns;
}

/**
 * Returns the plate type.
 * @returns {number} plate type
 */
Plate.prototype.type = function() {
   return this.plateType;
}

/**
 * Returns the plate label.
 * @returns {string} plate name
 */
Plate.prototype.toString = function() {
   return JSON.stringify(this);
}

/**
 * Compares two plates. Plates are compared using the name, rows, columns, size,
 * greatest well index and groups size in that order.
 * @param {Plate} plate - plate for comparison
 * @return {number} 0 if plates are equal, -1 if the input plate is greater, 1 if the input plate is lesser
 */
Plate.prototype.compareTo = function(plate) {

   Validation.validateArguments(arguments.length, Plate.prototype.compareTo.length, "Plate.protoype.compareTo");
   WellSetValidation.validatePlate(plate);

   if(plate.name > this.name) {
      return -1;
   }

   if(plate.name < this.name) {
      return 1;
   }

   if(plate.rows > this.rows) {
      return -1;
   }

   if(plate.rows < this.rows) {
      return 1;
   }

   if(plate.columns > this.columns) {
      return -1;
   }

   if(plate.columns < this.columns) {
      return 1;
   }

   if(plate.size() > this.size()) {
      return -1;
   }

   if(plate.size() < this.size()) {
      return 1;
   }

   var inputArray = plate.wells.toArray();
   var thisArray = this.wells.toArray();

   for(var i = 0; i < inputArray.length && i < thisArray.length; i++) {

      if(inputArray[i].compareTo(thisArray[i]) != 0) {

         if(inputArray[i].compareTo(thisArray[i]) > 0) {
            return -1;
         } else {
            return 1;
         }

      }

   }

   if(plate.groups.size() > this.groups.size()) {
      return -1;
   }

   if(plate.groups.size() < this.groups.size()) {
      return 1;
   }

   return 0;
}

/**
 * Sorts plates using the name, rows, columns, size, greatest well index and
 * groups size in that order.
 * @param {Plate} plate1 - first plate
 * @param {Plate} plate2 - second plate
 * @return {Number} 0 if plates are equal, -1 if plate1 is greater than plate2, 1 if plate1 is less than plate2
 */
Plate.prototype.sort = function(plate1, plate2) {

   Validation.validateArguments(arguments.length, Plate.prototype.sort.length, "Plate.protoype.sort");
   WellSetValidation.validatePlate(plate1);
   WellSetValidation.validatePlate(plate2);

   return plate1.compareTo(plate2);
}
