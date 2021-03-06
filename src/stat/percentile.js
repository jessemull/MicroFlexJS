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

// percentile.js

/*------------------------------- Dependencies -------------------------------*/

var QuantileStatistic = require('./quantilestatistic');

/*------------------------------- Constructor --------------------------------*/

/**
 * This class calculates and returns the p-th percentile for the data set. The
 * percentile, p, must be a value between 1 and 100. The p-th percentile is a value
 * such that at most (100 * p) percent of the measurements are less than this value
 * and at most 100 * (1 - p) percent are greater.
 *
 * <br><br>
 *
 * From wikipedia: a percentile (or a centile) is a measure used in statistics
 * indicating the value below which a given percentage of observations in a group
 * of observations fall. For example, the 20th percentile is the value (or score)
 * below which 20% of the observations may be found. The term percentile and the
 * related term percentile rank are often used in the reporting of scores from
 * norm-referenced tests. For example, if a score is at the 86th percentile, where
 * 86 is the percentile rank, it is equal to the value below which 86% of the
 * observations may be found (carefully contrast with in the 86th percentile,
 * which means the score is at or below the value of which 86% of the observations
 * may be found - every score is in the 100th percentile). The 25th percentile is
 * also known as the first quartile (Q1), the 50th percentile as the median or
 * second quartile (Q2), and the 75th percentile as the third quartile (Q3).
 * In general, percentiles and quartiles are specific types of quantiles.
 *
 * <br><br>
 *
 * <a href="https://en.wikipedia.org/wiki/Percentile" target="_blank">https://en.wikipedia.org/wiki/Percentile</a>
 *
 * <br><br>
 *
 * <b>Example:</b>
 *
 * <br><br>
 *
 * <span style="color: purple;">var</span> percentile = <span style="color: purple;">new</span> Percentile();<br>
 * <span style="color: purple;">var</span> array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];<br>
 * <span style="color: purple;">var</span> percentile = 25;<br>
 * percentile.<span style="color: Sienna;">calculate</span>(array, percentile) <span style="color: purple;">  &nbsp=>&nbsp  </span> 2.75;
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
 * <b>Standard Operation Examples:</b>
 *
 * <br><br>
 *
 * <span style="color: purple;">var</span> well1 = <span style="color: purple;">new</span> Well('A1', [1, 2, 3, 4, 5]); <br>
 * <span style="color: purple;">var</span> well2 = <span style="color: purple;">new</span> Well('B2', [6, 7, 8, 9, 10]); <br>
 * <span style="color: purple;">var</span> array = [well1, well2]; <br>
 * Mean.<span style="color: Sienna">wells</span>(array) <span style="color: purple;">  &nbsp=>&nbsp  </span> [ { well: 'A1', result: 3 }, { well: 'B2', result: 8 } ]; <br>
 *
 * <br>
 *
 * <span style="color: purple;">var</span> set = <span style="color: purple;">new</span> WellSet(wells, "Example Set"); <br>
 * Mean.<span style="color: Sienna">sets</span>(set) <span style="color: purple;">  &nbsp=>&nbsp  </span> [ { set: 'Example Set', result: [ { well: 'A1', result: 3 }, { well: 'B2', result: 8 } ] } ]; <br>
 *
 * <br>
 *
 * <span style="color: purple;">var</span> plate = <span style="color: purple;">new</span> Plate(rows, columns, wells, "Example Plate"); <br>
 * Mean.<span style="color: Sienna">plates</span>(plate) <span style="color: purple;">  &nbsp=>&nbsp  </span> [ { plate: 'Example Plate', result: [ { well: 'A1', result: 3 }, { well: 'B2', result: 8 } ] } ] <br>
 *
 * <br>
 *
 * <span style="color: purple;">var</span> stack = <span style="color: purple;">new</span> Stack(rows, columns, plates, "Example Stack"); <br>
 * Mean.<span style="color: Sienna">stacks</span>(stack) <span style="color: purple;">  &nbsp=>&nbsp  </span> [ { plate: 'Example Plate 1', result: [ { well: 'A1', result: 33 }, { well: 'B2', result: 18 } ] },<br>
 * <span style="margin-left: 160px;"></span>{ plate: 'Example Plate 2', result: [ { well: 'C3', result: 29 }, { well: 'D4', result: 12 } ] } ] <br>
 *
 * <br>
 *
 * <b>Aggregated Operation Examples:</b>
 *
 * <br><br>
 *
 * <span style="color: purple;">var</span> well1 = <span style="color: purple;">new</span> Well('A1', [1, 2, 3, 4, 5]); <br>
 * <span style="color: purple;">var</span> well2 = <span style="color: purple;">new</span> Well('B2', [6, 7, 8, 9, 10]); <br>
 * <span style="color: purple;">var</span> array = [well1, well2]; <br>
 * Mean.<span style="color: Sienna">wellsAggregated</span>(array) <span style="color: purple;">  &nbsp=>&nbsp  </span> { wells: [ 'A1', 'B2' ], result: 5.5 } <br>
 *
 * <br>
 *
 * <span style="color: purple;">var</span> set1 = <span style="color: purple;">new</span> WellSet(wells1, "Example Set 1"); <br>
 * <span style="color: purple;">var</span> set2 = <span style="color: purple;">new</span> WellSet(wells2, "Example Set 2"); <br>
 * <span style="color: purple;">var</span> array = [set1, set2]; <br>
 * Mean.<span style="color: Sienna">setsAggregated</span>(array) <span style="color: purple;">  &nbsp=>&nbsp  </span> [ { set: 'Example Set 1', result: 5.5 }, { set: 'Example Set 2', result: 15.5 } ] <br>
 *
 * <br>
 *
 * <span style="color: purple;">var</span> plate1 = <span style="color: purple;">new</span> Plate(8, 12, set1, "Example Plate 1"); <br>
 * <span style="color: purple;">var</span> plate2 = <span style="color: purple;">new</span> Plate(8, 12, set2, "Example Plate 2"); <br>
 * <span style="color: purple;">var</span> array = [plate1, plate2]; <br>
 * Mean.<span style="color: Sienna">platesAggregated</span>(array) <span style="color: purple;">  &nbsp=>&nbsp  </span> [ { plate: 'Example Plate 1', result: 5.5 }, { plate: 'Example Plate 2', result: 15.5 } ] <br>
 *
 * <br>
 *
 * <span style="color: purple;">var</span> stack = <span style="color: purple;">new</span> Stack(rows, columns, plates, "Example Stack"); <br>
 * Mean.<span style="color: Sienna">stacksAggregated</span>(stack) <span style="color: purple;">  &nbsp=>&nbsp  </span> [ { stack: 'Example Stack', result: 10.5 } ] <br>
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
 * @augments QuantileStatistic
 * @see <a href="http://www.jessemull.com" target="_blank">http://www.jessemull.com</a><br>
 * @see <a href="mailto:hello@jessemull.com">hello@jessemull.com</a>
 */
function Percentile() {
   QuantileStatistic.call(this);
}

Percentile.prototype = new QuantileStatistic();
Percentile.prototype.constructor = Percentile;

/*---------------------------------- Exports ---------------------------------*/

module.exports = new Percentile();

/*---------------------------- Calculate Function ----------------------------*/

/**
 * Returns the data set percentile.
 * @param {number[]} data - the data set
 * @param {number} percentile - the percentile
 * @returns {number} the result
 */
Percentile.prototype.calculate = function(data, percentile) {

   if(percentile < 0 || percentile > 100) {
      return NaN;
   }

   var n = data.length;

 	if(n === 1) {
 		return data[0];
 	}

   data.sort(function(a, b){return a-b});

   var pos = (percentile * (n + 1)) / 100.0;

   if(pos < 1) {
  	   return data[0];
   }

   if(pos >= n) {
  	   return data[data.length - 1];
   }

   if(pos === Math.floor(pos) && isFinite(pos)) {
  	   return data[pos - 1];
   }

   var lowerIndex = Math.floor(pos) - 1;
   var upperIndex = lowerIndex + 1;

   var lower = data[lowerIndex];
   var upper = data[upperIndex];
   var d = pos - 1 - lowerIndex;

   return (upper - lower) * d + lower;
}
