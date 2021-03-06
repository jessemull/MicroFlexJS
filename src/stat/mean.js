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

// mean.js

/*------------------------------- Dependencies -------------------------------*/

var DescriptiveStatisticWeighted = require('./descriptivestatisticweighted');

/*------------------------------- Constructor --------------------------------*/

/**
 * This class calculates and returns the mean of a data set.
 *
 * <br><br>
 *
 * <b>Example:</b>
 *
 * <br><br>
 *
 * <span style="color: purple;">var</span> mean = <span style="color: purple;">new</span> Mean();<br>
 * <span style="color: purple;">var</span> array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];<br>
 * mean.<span style="color: Sienna;">calculate</span>(array) <span style="color: purple;">  &nbsp=>&nbsp  </span> 5.5;
 *
 * <br><br>
 *
 * From wikipedia: a weight function is a mathematical device used when performing
 * a sum, integral, or average to give some elements more "weight" or influence on
 * the result than other elements in the same set. In statistics a weighted function
 * is often used to correct bias. The weighted statistic class implements a weighted
 * function by accepting an array of values as weights. The values in each well of
 * the stack, plate, set or well are multiplied by the values within the weights
 * array prior to the statistical calculation.
 *
 * <br><br>
 *
 * Statistical operations can be performed using standard or aggregated functions.
 * Standard functions calculate the desired statistic for each well in the stack,
 * plate or set. Aggregated functions aggregate the values from all wells in the
 * stack, plate or set and perform the statistical operation on the aggregated
 * values. Both standard and aggregated functions can be performed on a subset of
 * data by passing indices into the well data set as arguments.
 *
 * <br><br>
 *
 * The methods within the MicroFlex library are meant to be flexible and the
 * descriptive statistic object supports operations using a single stack, plate,
 * set or well as well as arrays of stacks, plates, sets or wells. In case of the
 * latter a result for each stack, plate, set or well is returned.
 *
 * <table class="mytable" cellspacing="10px" style="text-align:left; margin: 20px;">
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 5px; padding-top: 18px;">Operation<div></th>
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 2px;">Beginning<br>Index<div></th>
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 2px;">Ending<br>Index<div></th>
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 5px; padding-top: 18px;">Input/Output</div></th>
 *    <tr>
 *       <td>
 *          <table>
 *             <tr>
 *                <td>Standard</td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table border="0">
 *             <tr>
 *                <td>+/-</td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table>
 *             <tr>
 *                <td>+/-</td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table>
 *             <tr>
 *                <td>Accepts a single well, set, plate or stack as input</td>
 *             </tr>
 *             <tr>
 *                <td>Calculates the statistic for each well in a well, set, plate or stack</td>
 *             </tr>
 *          </table>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td valign="top">
 *          <table>
 *             <tr>
 *                <td>Aggregated</td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table>
 *             <tr>
 *                <td>+/-</td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table>
 *             <tr>
 *                <td>+/-</td>
 *             </tr>
 *          </table>
 *       </td>
 *       <td valign="top">
 *          <table>
 *             <tr>
 *                <td>Accepts a single well/set/plate/stack or an array of wells/sets/plates/stacks as input</td>
 *             </tr>
 *              <tr>
 *                <td>Aggregates the data from all the wells in a well/set/plate/stack and calculates the statistic using the aggregated data</td>
 *             </tr>
 *          </table>
 *       </td>
 *    </tr>
 * </table>
 *
 *
 * <b>Standard Operation Examples:</b>
 *
 * <br><br>
 *
 * <span style="color: purple;">var</span> well1 = <span style="color: purple;">new</span> Well('A1', [1, 2, 3, 4, 5]); <br>
 * <span style="color: purple;">var</span> well2 = <span style="color: purple;">new</span> Well('B2', [6, 7, 8, 9, 10]); <br>
 * <span style="color: purple;">var</span> weights = [0.2, 0.4, 0.6, 0.8, 1.0]; <br>
 * <span style="color: purple;">var</span> array = [well1, well2]; <br>
 * Mean.<span style="color: Sienna">wells</span>(array, weights) <span style="color: purple;">  &nbsp=>&nbsp  </span> [ { well: 'A1', result: 2.2 }, { well: 'B2', result: 5.2 } ]; <br>
 *
 * <br>
 *
 * <span style="color: purple;">var</span> set = <span style="color: purple;">new</span> WellSet(wells, "Example Set"); <br>
 * <span style="color: purple;">var</span> weights = [0.2, 0.4, 0.6, 0.8, 1.0]; <br>
 * Mean.<span style="color: Sienna">sets</span>(set, weights) <span style="color: purple;">  &nbsp=>&nbsp  </span> [ { set: 'Example Set', result: [ { well: 'A1', result: 2.2 }, { well: 'B2', result: 5.2 } ] } ]; <br>
 *
 * <br>
 *
 * <span style="color: purple;">var</span> plate = <span style="color: purple;">new</span> Plate(rows, columns, wells, "Example Plate"); <br>
 * <span style="color: purple;">var</span> weights = [0.2, 0.4, 0.6, 0.8, 1.0]; <br>
 * Mean.<span style="color: Sienna">plates</span>(plate, weights) <span style="color: purple;">  &nbsp=>&nbsp  </span> [ { plate: 'Example Plate', result: [ { well: 'A1', result: 2.2 }, { well: 'B2', result: 5.2 } ] } ] <br>
 *
 * <br>
 *
 * <span style="color: purple;">var</span> stack = <span style="color: purple;">new</span> Stack(rows, columns, plates, "Example Stack"); <br>
 * <span style="color: purple;">var</span> weights = [0.2, 0.4, 0.6, 0.8, 1.0]; <br>
 * Mean.<span style="color: Sienna">stacks</span>(stack, weights) <span style="color: purple;">  &nbsp=>&nbsp  </span> [ { plate: 'Example Plate 1', result: [ { well: 'A1', result: 2.2 }, { well: 'B2', result: 5.2 } ] },<br>
 * <span style="margin-left: 219px;"></span>{ plate: 'Example Plate 2', result: [ { well: 'C3', result: 6.9 }, { well: 'D4', result: 7.3 } ] } ] <br>
 *
 * <br>
 *
 * <b>Aggregated Operation Examples:</b>
 *
 * <br><br>
 *
 * <span style="color: purple;">var</span> well1 = <span style="color: purple;">new</span> Well('A1', [1, 2, 3, 4, 5]); <br>
 * <span style="color: purple;">var</span> well2 = <span style="color: purple;">new</span> Well('B2', [6, 7, 8, 9, 10]); <br>
 * <span style="color: purple;">var</span> weights = [0.2, 0.4, 0.6, 0.8, 1.0]; <br>
 * <span style="color: purple;">var</span> array = [well1, well2]; <br>
 * Mean.<span style="color: Sienna">wellsAggregated</span>(array, weights) <span style="color: purple;">  &nbsp=>&nbsp  </span> { wells: [ 'A1', 'B2' ], result: 3.7 } <br>
 *
 * <br>
 *
 * <span style="color: purple;">var</span> set1 = <span style="color: purple;">new</span> WellSet(wells1, "Example Set 1"); <br>
 * <span style="color: purple;">var</span> set2 = <span style="color: purple;">new</span> WellSet(wells2, "Example Set 2"); <br>
 * <span style="color: purple;">var</span> weights = [0.2, 0.4, 0.6, 0.8, 1.0]; <br>
 * <span style="color: purple;">var</span> array = [set1, set2]; <br>
 * Mean.<span style="color: Sienna">setsAggregated</span>(array, weights) <span style="color: purple;">  &nbsp=>&nbsp  </span> [ { set: 'Example Set 1', result: 3.7 }, { set: 'Example Set 2', result: 9.65 } ] <br>
 *
 * <br>
 *
 * <span style="color: purple;">var</span> plate1 = <span style="color: purple;">new</span> Plate(8, 12, set1, "Example Plate 1"); <br>
 * <span style="color: purple;">var</span> plate2 = <span style="color: purple;">new</span> Plate(8, 12, set2, "Example Plate 2"); <br>
 * <span style="color: purple;">var</span> weights = [0.2, 0.4, 0.6, 0.8, 1.0]; <br>
 * <span style="color: purple;">var</span> array = [plate1, plate2]; <br>
 * Mean.<span style="color: Sienna">platesAggregated</span>(array, weights) <span style="color: purple;">  &nbsp=>&nbsp  </span> [ { plate: 'Example Plate 1', result: 3.7 }, { plate: 'Example Plate 2', result: 9.65 } ] <br>
 *
 * <br>
 *
 * <span style="color: purple;">var</span> stack = <span style="color: purple;">new</span> Stack(rows, columns, plates, "Example Stack"); <br>
 * <span style="color: purple;">var</span> weights = [0.2, 0.4, 0.6, 0.8, 1.0]; <br>
 * Mean.<span style="color: Sienna">stacksAggregated</span>(stack, weights) <span style="color: purple;">  &nbsp=>&nbsp  </span> [ { stack: 'Example Stack', result: 10.5 } ] <br>
 *
 * <br>
 *
 * <b>MicroFlex Statistical Operations:</b>
 *
 * <table class="mytable" cellspacing="5px" border="0" style="text-align:left; margin: 20px;">
 *    <tr>
 *       <td>&raquo;&nbsp; Bins</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Central Moment</td>
 *    </tr>
 *    <tr>
 *      <td>&raquo;&nbsp; Chunk</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Coefficient of Variation</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Contra-harmonic Mean</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Cumulative Product</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Cumulative Sum</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Differences</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Equal Binning</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Geometric Mean</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Harmonic Mean</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Interquartile Range</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Kurtosis</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Maximum</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Mean</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Mean Deviation</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Median</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Median Deviation</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Minimum</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Mode</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; N</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Percentile</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Population Standard Deviation</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Population Variance</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Power Deviation</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Product</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Quantile</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Quartile Deviation</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Quartiles</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Quartile Skewness</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Random Sample</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Range</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Root Mean Square</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Sample Standard Deviation</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Sample Variance</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Shuffle</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Skewness</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Standard Error</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Sum</td>
 *    </tr>
 *    <tr>
 *       <td>&raquo;&nbsp; Sum of Squares</td>
 *    </tr>
 * </table>
 *
 * @constructor
 * @memberof module:Statistics
 * @author Jesse L. Mull
 * @version Updated February 17, 2016
 * @license Apache License 2.0
 * @see <a href="http://www.jessemull.com" target="_blank">http://www.jessemull.com</a><br>
 * @see <a href="mailto:hello@jessemull.com">hello@jessemull.com</a>
 */
function Mean() {
   DescriptiveStatisticWeighted.call(this);
}

Mean.prototype = new DescriptiveStatisticWeighted();
Mean.prototype.constructor = Mean;

/*---------------------------------- Exports ---------------------------------*/

module.exports = new Mean();

/*---------------------------- Calculate Function ----------------------------*/

/**
 * Calculates and returns the mean of the data set.
 * @param {number[]} data - the data set
 * @returns {number} the mean
 */
Mean.prototype.calculate = function(data) {

   var sum = 0;

   for(var value of data) {
      sum += value;
   }

   return sum / data.length;
}
