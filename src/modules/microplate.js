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
 * This module combines the well, well group, well set, plate and stack classes.
 *
 * <br><br>
 *
 * <h4><b>Quick Reference</b></h4>
 *
 * <table class="mytable" cellspacing="10px" style="text-align:left; margin: 20px;">
 *    <th style="width: 10%;"><div style="border-bottom: 1px solid black; padding-bottom: 5px; padding-top: 18px;">Class<div></th>
 *    <th style="width: 15%;"><div style="border-bottom: 1px solid black; padding-bottom: 5px; padding-top: 18px;">Fields<div></th>
 *    <th style="width: 75%;"><div style="border-bottom: 1px solid black; padding-bottom: 5px; padding-top: 18px;">Description<div></th>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td>Well</td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td>
 *                   Data Array<br>
 *                   Row Index<br>
 *                   Column Index
 *                </td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table>
 *             <tr>
 *                <td>The well is the fundamental unit of a microplate. It is defined by a row and column index and holds experimental results for a given experiment.</td>
 *             </tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td>Well Group</td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td>
 *                   Well Index Hash Set<br>
 *                   Label
 *                </td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table>
 *             <tr>
 *                <td>Well groups contain a list of well indices used for grouping experimental plate data.</td>
 *             </tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td>WellSet</td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td>
 *                   Well Hash Set<br>
 *                   Label
 *                </td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table>
 *             <tr>
 *                <td>A well set contains a collection of plate wells without enforcing maximum column or row indices.</td>
 *             </tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td>Plate</td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td>
 *                   Well Hash Set<br>
 *                   Well Group Hash Set<br>
 *                   Row Number<br>
 *                   Column Number<br>
 *                   Plate Type<br>
 *                   Label
 *                </td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table>
 *             <tr>
 *                <td>Plates consist of wells arrayed in rows and columns. Plate well groups partition the plate data into subsets for data analysis.</td>
 *             </tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td>Stack</td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td>
 *                   Plate Hash Set<br>
 *                   Row Number<br>
 *                   Column Number<br>
 *                   Plate Type<br>
 *                   Label
 *                </td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table>
 *             <tr>
 *                <td>A collection of plate objects.</td>
 *             </tr>
 *          </table>
 *       </td>
 *    </tr>
 * </table>
 *
 * <h4><b>Plates</b></h4>
 *
 * A microplate consists of a rectangular grid of wells. Rows are assigned a
 * letter starting with A and working towards Z. Rows outside this range are
 * identified by adding an additional letter to the row index (A -> ... -> Z ->
 * AA -> AB). Columns are assigned integer values starting at zero working towards
 * infinity. The row and column indices uniquely identify a single well (A1, A2 etc).
 * A plate cannot contain duplicate wells or wells with rows or columns outside
 * the valid range.
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
 * <h4><b>Wells</b></h4>
 *
 * A plate consists of wells arranged in rows and columns. The well class contains
 * the logic to convert row letters to integers and vice-versa, enforces the correct
 * format for well IDs, and holds an array of data set values. the well object
 * does not check for wells outside a specified range. Wells are compared using
 * row then column number. The well iterator iterates over the values in the data
 * array.
 *
 * <br><br>
 *
 * <h4><b>WellSets</b></h4>
 *
 * A well set holds wells without specifying maximum row and column indices. A set
 * cannot contain duplicate wells. Wells are housed in an ordered set. The add,
 * remove and contains functions exhibit log n time. Wells are ordered by well row
 * and column. In addition to functions common to set data structures, the well set
 * can partition wells into subsets using indices.
 *
 * <br><br>
 *
 * Wells in the set can be accessed by row and column numbers or by well index
 * strings. In addition, the well set implementation includes an iterator which
 * iterates over the wells in the set using a for...of loop.
 *
 * <br><br>
 *
 * <h4><b>Well Groups</b></h4>
 *
 * Well groups house a list of well indices associated with a plate object. It
 * represents a simplified version of the well set. Unlike the well set object,
 * the well group object does not store wells or well data, only a list of indices.
 *
 * <br><br>
 *
 * Well groups provide a means to retrieve and analyze well subsets within a plate.
 * A microplate experiment often contains control and experimental wells. These
 * subsets can be housed within various well groups to facilitate statistical or
 * mathematical operations.
 *
 * <br><br>
 *
 * Well groups are compared using the group name, number of wells, and greatest well
 * index in that order.
 *
 * <br><br>
 *
 * <h4><b>Stacks</b></h4>
 *
 * A plate stack is the preferred term in the natural sciences for a collection
 * of micro-plates. The plate stack is initialized using row and column numbers.
 * or a flag for plates with standard dimensions (see the plate class). Plates
 * are stored in an ordered hash set with the plate label as a key. This means a
 * stack cannot contain two plates with the same label.
 *
 * @module Microplate
 * @author Jesse L. Mull
 * @version Updated February 17, 2016
 * @license Apache License 2.0
 * @see <a href="http://www.jessemull.com" target="_blank">http://www.jessemull.com</a><br>
 * @see <a href="mailto:hello@jessemull.com">hello@jessemull.com</a>
 */
module.exports = {
   Well: require('../plate/well'),
   WellGroup: require('../plate/wellgroup'),
   WellSet: require('../plate/wellset'),
   Plate: require('../plate/plate'),
   Stack: require('../plate/stack')
}
