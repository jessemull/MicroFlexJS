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

// quantilestatistic.js

/*---------------------------------- Exports ---------------------------------*/

module.exports = QuantileStatistic;

/*------------------------------- Dependencies -------------------------------*/

var Well = require('../plate/well');
var WellSet = require('../plate/wellset');
var Plate = require('../plate/plate');
var Stack = require('../plate/stack');
var Validation = require('../util/validation');
var WellValidation = require('../util/wellvalidation');
var WellSetValidation = require('../util/wellsetvalidation');

/*-------------------------------- Constructor -------------------------------*/

/**
 * This class performs statistical operations on stacks, plates, well sets and
 * wells that require two argumets. To create a custom statistical operation
 * extend this class and override the calculate method using the appropriate
 * statistical operation.
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
 *    <th><div style="border-bottom: 1px solid black; padding-bottom: 2px;">Length of<br>Subset<div></th>
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
 * <span style="color: purple;">var</span> p = 0.25; <br>
 * Quantile.<span style="color: Sienna">wells</span>(array, p) <span style="color: purple;">  &nbsp=>&nbsp  </span> [ { well: 'A1', result: 1.25 }, { well: 'B2', result: 5.25 } ]; <br>
 *
 * <br>
 *
 * <span style="color: purple;">var</span> set = <span style="color: purple;">new</span> WellSet(wells, "Example Set"); <br>
 * <span style="color: purple;">var</span> p = 0.25; <br>
 * Quantile.<span style="color: Sienna">sets</span>(set, p) <span style="color: purple;">  &nbsp=>&nbsp  </span> [ { set: 'Example Set', result: [ { well: 'A1', result: 1.25 }, { well: 'B2', result: 5.25 } ] } ]; <br>
 *
 * <br>
 *
 * <span style="color: purple;">var</span> plate = <span style="color: purple;">new</span> Plate(rows, columns, wells, "Example Plate"); <br>
 * <span style="color: purple;">var</span> p = 0.25; <br>
 * Quantile.<span style="color: Sienna">plates</span>(plate, p) <span style="color: purple;">  &nbsp=>&nbsp  </span> [ { plate: 'Example Plate', result: [ { well: 'A1', result: 1.25 }, { well: 'B2', result: 5.25 } ] } ] <br>
 *
 * <br>
 *
 * <span style="color: purple;">var</span> stack = <span style="color: purple;">new</span> Stack(rows, columns, plates, "Example Stack"); <br>
 * <span style="color: purple;">var</span> p = 0.25; <br>
 * Quantile.<span style="color: Sienna">stacks</span>(stack, p) <span style="color: purple;">  &nbsp=>&nbsp  </span> [ { plate: 'Example Plate 1', result: [ { well: 'A1', result: 33 }, { well: 'B2', result: 18 } ] },<br>
 * <span style="margin-left: 195px;"></span>{ plate: 'Example Plate 2', result: [ { well: 'C3', result: 29 }, { well: 'D4', result: 12 } ] } ] <br>
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
 * <span style="color: purple;">var</span> p = 0.25; <br>
 * Quantile.<span style="color: Sienna">wellsAggregated</span>(array, p) <span style="color: purple;">  &nbsp=>&nbsp  </span> { wells: [ 'A1', 'B2' ], result: 2.25 } <br>
 *
 * <br>
 *
 * <span style="color: purple;">var</span> set1 = <span style="color: purple;">new</span> WellSet(wells1, "Example Set 1"); <br>
 * <span style="color: purple;">var</span> set2 = <span style="color: purple;">new</span> WellSet(wells2, "Example Set 2"); <br>
 * <span style="color: purple;">var</span> array = [set1, set2]; <br>
 * <span style="color: purple;">var</span> p = 0.25; <br>
 * Quantile.<span style="color: Sienna">setsAggregated</span>(array, p) <span style="color: purple;">  &nbsp=>&nbsp  </span> [ { set: 'Example Set 1', result: 5.5 }, { set: 'Example Set 2', result: 15.5 } ] <br>
 *
 * <br>
 *
 * <span style="color: purple;">var</span> plate1 = <span style="color: purple;">new</span> Plate(8, 12, set1, "Example Plate 1"); <br>
 * <span style="color: purple;">var</span> plate2 = <span style="color: purple;">new</span> Plate(8, 12, set2, "Example Plate 2"); <br>
 * <span style="color: purple;">var</span> array = [plate1, plate2]; <br>
 * <span style="color: purple;">var</span> p = 0.25; <br>
 * Quantile.<span style="color: Sienna">platesAggregated</span>(array, p) <span style="color: purple;">  &nbsp=>&nbsp  </span> [ { plate: 'Example Plate 1', result: 5.5 }, { plate: 'Example Plate 2', result: 15.5 } ] <br>
 *
 * <br>
 *
 * <span style="color: purple;">var</span> stack = <span style="color: purple;">new</span> Stack(rows, columns, plates, "Example Stack"); <br>
 * <span style="color: purple;">var</span> p = 0.25; <br>
 * Quantile.<span style="color: Sienna">stacksAggregated</span>(stack, p) <span style="color: purple;">  &nbsp=>&nbsp  </span> [ { stack: 'Example Stack', result: 10.5 } ] <br>
 *
 * <br>
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
function QuantileStatistic() {}

/*------------------------------ Well Functions ------------------------------*/

/**
 * Calculates the descriptive statistic for each well and returns the result. The
 * operation can be limited to a subset of data by passing indices into the well
 * data array.
 * @param {(Well|Well[])} wells - the input wells
 * @param {number} begin - the beginning index | the quantile or percentile
 * @param {number} end - the ending index
 * @param {number} p - the quantile or percentile
 * @returns {Object[]} the result
 */
QuantileStatistic.prototype.wells = function(wells, begin, end, p) {

   switch(arguments.length) {

      case 2: return this.calculateWells(wells, begin);

      case 4: return this.calculateWellsIndices(wells, begin, end, p);

      default: throw new TypeError("Invalid argument number: " + arguments.length);
   }

}

/**
 * Calculates the descriptive statistic for each well and returns the result.
 * @param {(Well|Well[])} wells - the input wells
 * @param {number} p - the quantile or percentile
 * @returns {Object[]} the result
 */
QuantileStatistic.prototype.calculateWells = function(wells, p) {

   Validation.validateArguments(arguments.length, QuantileStatistic.prototype.calculateWells.length, "QuantileStatistic.prototype.calculateWells");

   switch(Validation.getType(wells)) {

      case '[object Well]':  WellValidation.validateWell(wells);

                             var result = {};

                             result.well = wells.toString();
                             result.result = this.calculate(wells.getData(), p);

                             return [result];

      case '[object Array]': WellSetValidation.validateWellArray(wells);

                             var result = [];

                             for(var well of wells) {

                                var toAdd = {};

                                toAdd.well = well.toString();
                                toAdd.result = this.calculate(well.getData(), p);

                                result.push(toAdd);
                             }

                             return result;

      default: throw new TypeError("Invalid input type: " + wells);

   }

}

/**
 * Calculates the descriptive statistic for each well using the values between
 * the indices and returns the result.
 * @param {Well[]} wells - the input wells
 * @param {number} begin - the beginning index | the quantile or percentile
 * @param {number} end - the ending index
 * @param {number} p - the quantile or percentile
 * @returns {Object[]} the result
 */
QuantileStatistic.prototype.calculateWellsIndices = function(wells, begin, end, p) {

   Validation.validateArguments(arguments.length, QuantileStatistic.prototype.calculateWellsIndices.length, "QuantileStatistic.prototype.calculateWellsIndices");

   Validation.validatePositiveRange(begin, end);

   switch(Validation.getType(wells)) {

      case '[object Well]':  WellValidation.validateWell(wells);

                             var result = {};

                             result.well = wells.toString();
                             result.result = this.calculate(wells.getData().slice(begin, end), p);

                             return [result];

      case '[object Array]': WellSetValidation.validateWellArray(wells);

                             var result = [];

                             for(var well of wells) {

                                var toAdd = {};

                                toAdd.well = well.toString();
                                toAdd.result =this.calculate(well.getData().slice(begin, end), p);

                                result.push(toAdd);
                             }

                             return result;


      default: throw new TypeError("Invalid input type: " + wells);

   }

}

/**
 * Aggregates the data in each well, calculates the descriptive statistic and
 * returns the result. The operation can be limited to a subset of data by passing
 * indices into the well data array.
 * @param {Well[]} wells - the input wells
 * @param {number} begin - the beginning index | the quantile or percentile
 * @param {number} end - the ending index
 * @param {number} p - the quantile or percentile
 * @returns {Object[]} the result
 */
QuantileStatistic.prototype.wellsAggregated = function(wells, begin, end, p) {

   switch(arguments.length) {

      case 2: return this.calculateWellsAggregated(wells, begin);

      case 4: return this.calculateWellsIndicesAggregated(wells, begin, end, p);

      default: throw new TypeError("Invalid argument number: " + arguments.length);
   }

}

/**
 * Aggregates the well values for each well and calculates the descriptive statistic
 * using the aggregated data.
 * @param {Well[]} wells - the input wells
 * @param {number} p - the quantile or percentile
 * @returns {Object[]} the result
 */
QuantileStatistic.prototype.calculateWellsAggregated = function(wells, p) {
   Validation.validateArguments(arguments.length, QuantileStatistic.prototype.calculateWellsAggregated.length, "QuantileStatistic.prototype.calculateWellsAggregated");
   return this.calculateWellsIndicesAggregated(wells, 0, Infinity, p);
}

/**
 * Aggregates the well values between the indices for each well and calculates
 * the descriptive statistic using the aggregated data.
 * @param {Well[]} wells - the input wells
 * @param {number} begin - the beginning index | the quantile or percentile
 * @param {number} end - the ending index
 * @param {number} p - the quantile or percentile
 * @returns {Object[]} the result
 */
QuantileStatistic.prototype.calculateWellsIndicesAggregated = function(wells, begin, end, p) {

   Validation.validateArguments(arguments.length, QuantileStatistic.prototype.calculateWellsIndicesAggregated.length, "QuantileStatistic.prototype.calculateWellsIndicesAggregated");
   WellSetValidation.validateWellArray(wells);
   Validation.validatePositiveRange(begin, end);

   var aggregated = [];
   var indices = [];
   var result = {};

   for(var well of wells) {
      aggregated = aggregated.concat(well.getData().slice(begin, end));
      indices.push(well.toString());
   }

   result.wells = indices;
   result.result = this.calculate(aggregated, p);

   return result;
}

/*---------------------------- Well Set Functions ----------------------------*/

/**
 * Calculates the descriptive statistic for each well in the well set and returns
 * the result. The operation can be limited to a subset of data by passing indices
 * into the well data array.
 * @param {(WellSet|WellSet[])} sets - the input sets
 * @param {number} begin - the beginning index | the quantile or percentile
 * @param {number} end - the ending index
 * @param {number} p - the quantile or percentile
 * @returns {Object[]} the result
 */
QuantileStatistic.prototype.sets = function(sets, begin, end, p) {

   switch(arguments.length) {

      case 2: return this.calculateSets(sets, begin);

      case 4: return this.calculateSetsIndices(sets, begin, end, p);

      default: throw new TypeError("Invalid argument number: " + arguments.length);
   }

}


/**
 * Calculates the descriptive statistic for each well in the well set and returns
 * the result.
 * @param {(WellSet|WellSet[])} sets - the input sets
 * @param {number} p - the quantile or percentile
 * @returns {Object[]} the result
 */
QuantileStatistic.prototype.calculateSets = function(sets, p) {

   Validation.validateArguments(arguments.length, QuantileStatistic.prototype.calculateSets.length, "QuantileStatistic.prototype.calculateSets");

   switch(Validation.getType(sets)) {

      case '[object WellSet]':  WellSetValidation.validateWellSet(sets);

                                var result = {};

                                result.set = sets.name;
                                result.result = this.wells(sets.toArray(), p);

                                return [result];

      case '[object Array]':    var result = [];

                                for(var set of sets) {

                                   WellSetValidation.validateWellSet(set);

                                   var setResult = {};

                                   setResult.set = set.name;
                                   setResult.result = this.wells(set.toArray(), p);

                                   result.push(setResult);

                                }

                                return result;

      default: throw new TypeError("Invalid input type: " + sets);

   }

}

/**
 * Calculates the descriptive statistic for each well in the well set using the
 * values between the indices and returns the result.
 * @param {(WellSet|WellSet[])} sets - the input sett
 * @param {number} begin - the beginning index | the quantile or percentile
 * @param {number} end - the ending index
 * @param {number} p - the quantile or percentile
 * @returns {Object[]} the result
 */
QuantileStatistic.prototype.calculateSetsIndices = function(sets, begin, end, p) {

   Validation.validateArguments(arguments.length, QuantileStatistic.prototype.calculateSetsIndices.length, "QuantileStatistic.prototype.calculateSetsIndices");
   Validation.validatePositiveRange(begin, end);

   switch(Validation.getType(sets)) {

      case '[object WellSet]':  WellSetValidation.validateWellSet(sets);

                                var result = {};

                                result.set = sets.name;
                                result.result = this.wells(sets.toArray(), begin, end, p);

                                return [result];

      case '[object Array]':    var result = [];

                                for(var set of sets) {

                                   WellSetValidation.validateWellSet(set);

                                   var setResult = {};

                                   setResult.set = set.name;
                                   setResult.result = this.wells(set.toArray(), begin, end, p);

                                   result.push(setResult);

                                }

                                return result;

      default: throw new TypeError("Invalid input type: " + sets);

   }

}

/**
 * Aggregates the data in each well set, calculates the descriptive statistic and
 * returns the result. The operation can be limited to a subset of data by passing
 * indices into the well data array.
 * @param {(WellSet|WellSet[])} sets - the input sets
 * @param {number} begin - the beginning index | the quantile or percentile
 * @param {number} end - the ending index
 * @param {number} p - the quantile or percentile
 * @returns {Object[]} the result
 */
QuantileStatistic.prototype.setsAggregated = function(sets, begin, end, p) {

   switch(arguments.length) {

      case 2: return this.calculateSetsAggregated(sets, begin);

      case 4: return this.calculateSetsIndicesAggregated(sets, begin, end, p);

      default: throw new TypeError("Invalid argument number: " + arguments.length);
   }

}

/**
 * Aggregates the data in each set, calculates the descriptive statistic and
 * returns the result.
 * @param {(WellSet|WellSet[])} sets - the input sets
 * @param {number} p - the quantile or percentile
 * @returns {Object[]} the result
 */
QuantileStatistic.prototype.calculateSetsAggregated = function(sets, p) {

   Validation.validateArguments(arguments.length, QuantileStatistic.prototype.calculateSetsAggregated.length, "QuantileStatistic.prototype.calculateSetsAggregated");

   switch(Validation.getType(sets)) {

      case '[object WellSet]': WellSetValidation.validateWellSet(sets);

                               var aggregated = [];
                               var result = {};

                               for(var well of sets) {
                                  aggregated = aggregated.concat(well.getData());
                               }

                               result.set = sets.name;
                               result.result = this.calculate(aggregated, p);

                               return [result];

      case '[object Array]':   var result = [];

                               for(var set of sets) {

                                  WellSetValidation.validateWellSet(set);

                                  var aggregated = [];
                                  var setResult = {};

                                  for(var well of set) {
                                     aggregated = aggregated.concat(well.getData());
                                  }

                                  setResult.set = set.name;
                                  setResult.result = this.calculate(aggregated, p);

                                  result.push(setResult);

                                }

                                return result;

      default: throw new TypeError("Invalid input type: " + sets);
   }

}

/**
 * Aggregates the data in each set using the values between the indices, calculates
 * the descriptive statistic and returns the result.
 * @param {(WellSet|WellSet[])} sets - the input sets
 * @param {number} begin - the beginning index | the quantile or percentile
 * @param {number} end - the ending index
 * @param {number} p - the quantile or percentile
 * @returns {Object[]} the result
 */
QuantileStatistic.prototype.calculateSetsIndicesAggregated = function(sets, begin, end, p) {

   Validation.validateArguments(arguments.length, QuantileStatistic.prototype.calculateSetsIndicesAggregated.length, "QuantileStatistic.prototype.calculateSetsIndicesAggregated");
   Validation.validatePositiveRange(begin, end);

   switch(Validation.getType(sets)) {

      case '[object WellSet]': WellSetValidation.validateWellSet(sets);

                               var aggregated = [];
                               var result = {};

                               for(var well of sets) {
                                  aggregated = aggregated.concat(well.getData().slice(begin, end));
                               }

                               result.set = sets.name;
                               result.result = this.calculate(aggregated, p);

                               return [result];

      case '[object Array]':   var result = [];

                               for(var set of sets) {

                                  WellSetValidation.validateWellSet(set);

                                  var aggregated = [];
                                  var setResult = {};

                                  for(var well of set) {
                                     aggregated = aggregated.concat(well.getData().slice(begin, end));
                                  }

                                  setResult.set = set.name;
                                  setResult.result = this.calculate(aggregated, p);

                                  result.push(setResult);

                                }

                                return result;

      default: throw new TypeError("Invalid input type: " + sets);
   }
}

/*----------------------------- Plate Functions ------------------------------*/

/**
 * Calculates the descriptive statistic for each well in the plate and returns
 * the result. The operation can be limited to a subset of data by passing indices
 * into the well data array.
 * @param {(Plate|Plate[])} plates - the input plates
 * @param {number} begin - the beginning index | the quantile or percentile
 * @param {number} end - the ending index
 * @param {number} p - the quantile or percentile
 * @returns {Object[]} the result
 */
QuantileStatistic.prototype.plates = function(plates, begin, end, p) {

   switch(arguments.length) {

      case 2: return this.calculatePlates(plates, begin);

      case 4: return this.calculatePlatesIndices(plates, begin, end, p);

      default: throw new TypeError("Invalid argument number: " + arguments.length);
   }

}


/**
 * Calculates the descriptive statistic for each well in the plate and returns
 * the result.
 * @param {(Plate|Plate[])} plates - the input plates
 * @param {number} p - the quantile or percentile
 * @returns {Object[]} the result
 */
QuantileStatistic.prototype.calculatePlates = function(plates, p) {

   Validation.validateArguments(arguments.length, QuantileStatistic.prototype.calculatePlates.length, "QuantileStatistic.prototype.calculatePlates");

   switch(Validation.getType(plates)) {

      case '[object Plate]': WellSetValidation.validatePlate(plates);

                             var result = {};

                             result.plate = plates.name;
                             result.result = this.wells(plates.toArray(), p);

                             return [result];

      case '[object Array]': var result = [];

                             for(var plate of plates) {

                                WellSetValidation.validatePlate(plate);

                                var plateResult = {};

                                plateResult.plate = plate.name;
                                plateResult.result = this.wells(plate.toArray(), p);

                                result.push(plateResult);

                             }

                             return result;

      default: throw new TypeError("Invalid input type: " + plates);

   }

}

/**
 * Calculates the descriptive statistic for each well in the plate using the values
 * between the indices and returns the result.
 * @param {(Plate|Plate[])} plates - the input plates
 * @param {number} begin - the beginning index | the quantile or percentile
 * @param {number} end - the ending index
 * @param {number} p - the quantile or percentile
 * @returns {Object[]} the result
 */
QuantileStatistic.prototype.calculatePlatesIndices = function(plates, begin, end, p) {

   Validation.validateArguments(arguments.length, QuantileStatistic.prototype.calculatePlatesIndices.length, "QuantileStatistic.prototype.calculatePlatesIndices");
   Validation.validatePositiveRange(begin, end);

   switch(Validation.getType(plates)) {

      case '[object Plate]':  WellSetValidation.validatePlate(plates);

                                var result = {};

                                result.plate = plates.name;
                                result.result = this.wells(plates.toArray(), begin, end, p);

                                return [result];

      case '[object Array]':    var result = [];

                                for(var plate of plates) {

                                   WellSetValidation.validatePlate(plate);

                                   var plateResult = {};

                                   plateResult.plate = plate.name;
                                   plateResult.result = this.wells(plate.toArray(), begin, end, p);

                                   result.push(plateResult);

                                }

                                return result;

      default: throw new TypeError("Invalid input type: " + plates);

   }

}

/**
 * Aggregates the data in each plate, calculates the descriptive statistic and
 * returns the result. The operation can be limited to a subset of data by passing
 * indices into the well data array.
 * @param {(Plate|Plate[])} plates - the input plates
 * @param {number} begin - the beginning index | the quantile or percentile
 * @param {number} end - the ending index
 * @param {number} p - the quantile or percentile
 * @returns {Object[]} the result
 */
QuantileStatistic.prototype.platesAggregated = function(plates, begin, end, p) {

   switch(arguments.length) {

      case 2: return this.calculatePlatesAggregated(plates, begin);

      case 4: return this.calculatePlatesIndicesAggregated(plates, begin, end, p);

      default: throw new TypeError("Invalid argument number: " + arguments.length);
   }

}

/**
 * Aggregates the data in each plate, calculates the descriptive statistic and
 * returns the result.
 * @param {(Plate|Plate[])} plates - the input plates
 * @param {number} p - the quantile or percentile
 * @returns {Object[]} the result
 */
QuantileStatistic.prototype.calculatePlatesAggregated = function(plates, p) {

   Validation.validateArguments(arguments.length, QuantileStatistic.prototype.calculatePlatesAggregated.length, "QuantileStatistic.prototype.calculatePlatesAggregated");

   switch(Validation.getType(plates)) {

      case '[object Plate]': WellSetValidation.validatePlate(plates);

                               var aggregated = [];
                               var result = {};

                               for(var well of plates) {
                                  aggregated = aggregated.concat(well.getData());
                               }

                               result.plate = plates.name;
                               result.result = this.calculate(aggregated, p);

                               return [result];

      case '[object Array]':   var result = [];

                               for(var plate of plates) {

                                  WellSetValidation.validatePlate(plate);

                                  var aggregated = [];
                                  var plateResult = {};

                                  for(var well of plate) {
                                     aggregated = aggregated.concat(well.getData());
                                  }

                                  plateResult.plate = plate.name;
                                  plateResult.result = this.calculate(aggregated, p);

                                  result.push(plateResult);

                                }

                                return result;

      default: throw new TypeError("Invalid input type: " + plates);
   }

}

/**
 * Aggregates the data in each plate using the values between the indices, calculates
 * the descriptive statistic and returns the result.
 * @param {(Plate|Plate[])} plates - the input plates
 * @param {number} begin - the beginning index | the quantile or percentile
 * @param {number} end - the ending index
 * @param {number} p - the quantile or percentile
 * @returns {Object[]} the result
 */
QuantileStatistic.prototype.calculatePlatesIndicesAggregated = function(plates, begin, end, p) {

   Validation.validateArguments(arguments.length, QuantileStatistic.prototype.calculatePlatesIndicesAggregated.length, "QuantileStatistic.prototype.calculatePlatesIndicesAggregated");
   Validation.validatePositiveRange(begin, end);

   switch(Validation.getType(plates)) {

      case '[object Plate]': WellSetValidation.validatePlate(plates);

                               var aggregated = [];
                               var result = {};

                               for(var well of plates) {
                                  aggregated = aggregated.concat(well.getData().slice(begin, end));
                               }

                               result.plate = plates.name;
                               result.result = this.calculate(aggregated, p);

                               return [result];

      case '[object Array]':   var result = [];

                               for(var plate of plates) {

                                  WellSetValidation.validatePlate(plate);

                                  var aggregated = [];
                                  var plateResult = {};

                                  for(var well of plate) {
                                     aggregated = aggregated.concat(well.getData().slice(begin, end));
                                  }

                                  plateResult.plate = plate.name;
                                  plateResult.result = this.calculate(aggregated, p);

                                  result.push(plateResult);

                                }

                                return result;

      default: throw new TypeError("Invalid input type: " + plates);
   }
}

/*----------------------------- Stack Functions ------------------------------*/

/**
 * Calculates the descriptive statistic for each well in the stack and returns
 * the result. The operation can be limited to a subset of data by passing indices
 * into the well data array.
 * @param {(Stack|Stack[])} stacks - the input stacks
 * @param {number} begin - the beginning index | the quantile or percentile
 * @param {number} end - the ending index
 * @param {number} p - the quantile or percentile
 * @returns {Object[]} the result
 */
QuantileStatistic.prototype.stacks = function(stacks, begin, end, p) {

   switch(arguments.length) {

      case 2: return this.calculateStacks(stacks, begin);

      case 4: return this.calculateStacksIndices(stacks, begin, end, p);

      default: throw new TypeError("Invalid argument number: " + arguments.length);
   }

}

/**
 * Calculates the descriptive statistic for each well in the stack and returns
 * the result.
 * @param {(Stack|Stack[])} stacks - the input stacks
 * @param {number} p - the quantile or percentile
 * @returns {Object[]} the result
 */
QuantileStatistic.prototype.calculateStacks = function(stacks, p) {

   Validation.validateArguments(arguments.length, QuantileStatistic.prototype.calculateStacks.length, "QuantileStatistic.prototype.calculateStacks");

   switch(Validation.getType(stacks)) {

      case '[object Stack]': WellSetValidation.validateStack(stacks);

                             var result = {};

                             result.stack = stacks.name;
                             result.result = this.plates(stacks.toArray(), p);

                             return [result];

      case '[object Array]': var result = [];

                             for(var stack of stacks) {

                                WellSetValidation.validateStack(stack);

                                var stackResult = {};

                                stackResult.stack = stack.name;
                                stackResult.result = this.plates(stack.toArray(), p);

                                result.push(stackResult);

                             }

                             return result;

      default: throw new TypeError("Invalid input type: " + stacks);

   }

}

/**
 * Calculates the descriptive statistic for each well in the stack using the values
 * between the indices and returns the result.
 * @param {(Stack|Stack[])} stacks - the input stacks
 * @param {number} begin - the beginning index | the quantile or percentile
 * @param {number} end - the ending index
 * @param {number} p - the quantile or percentile
 * @returns {Object[]} the result
 */
QuantileStatistic.prototype.calculateStacksIndices = function(stacks, begin, end, p) {

   Validation.validateArguments(arguments.length, QuantileStatistic.prototype.calculateStacksIndices.length, "QuantileStatistic.prototype.calculateStacksIndices");
   Validation.validatePositiveRange(begin, end);

   switch(Validation.getType(stacks)) {

      case '[object Stack]':    WellSetValidation.validateStack(stacks);

                                var result = {};

                                result.stack = stacks.name;
                                result.result = this.plates(stacks.toArray(), begin, end, p);

                                return [result];

      case '[object Array]':    var result = [];

                                for(var stack of stacks) {

                                   WellSetValidation.validateStack(stack);

                                   var stackResult = {};

                                   stackResult.stack = stack.name;
                                   stackResult.result = this.plates(stack.toArray(), begin, end, p);

                                   result.push(stackResult);

                                }

                                return result;

      default: throw new TypeError("Invalid input type: " + stacks);

   }

}

/**
 * Aggregates the data in each stack, calculates the descriptive statistic and
 * returns the result. The operation can be limited to a subset of data by passing
 * indices into the well data array.
 * @param {(Stack|Stack[])} stacks - the input stacks
 * @param {number} begin - the beginning index | the quantile or percentile
 * @param {number} end - the ending index
 * @param {number} p - the quantile or percentile
 * @returns {Object[]} the result
 */
QuantileStatistic.prototype.stacksAggregated = function(stacks, begin, end, p) {

   switch(arguments.length) {

      case 2: return this.calculateStacksAggregated(stacks, begin);

      case 4: return this.calculateStacksIndicesAggregated(stacks, begin, end, p);

      default: throw new TypeError("Invalid argument number: " + arguments.length);
   }

}

/**
 * Aggregates the data in each stack, calculates the descriptive statistic and
 * returns the result.
 * @param {(Stack|Stack[])} stacks - the input stacks
 * @param {number} p - the quantile or percentile
 * @returns {Object[]} the result
 */
QuantileStatistic.prototype.calculateStacksAggregated = function(stacks, p) {

   Validation.validateArguments(arguments.length, QuantileStatistic.prototype.calculateStacksAggregated.length, "QuantileStatistic.prototype.calculateStacksAggregated");

   switch(Validation.getType(stacks)) {

      case '[object Stack]':   WellSetValidation.validateStack(stacks);

                               var aggregated = [];
                               var result = {};

                               for(var plate of stacks) {

                                  for(var well of plate) {
                                     aggregated = aggregated.concat(well.getData());
                                  }

                               }

                               result.stack = stacks.name;
                               result.result = this.calculate(aggregated, p);

                               return [result];

      case '[object Array]':   var result = [];

                               for(var stack of stacks) {

                                  WellSetValidation.validateStack(stack);

                                  var aggregated = [];
                                  var stackResult = {};

                                  for(var plate of stack) {

                                     for(var well of plate) {
                                        aggregated = aggregated.concat(well.getData());
                                     }

                                  }

                                  stackResult.stack = stack.name;
                                  stackResult.result = this.calculate(aggregated, p);

                                  result.push(stackResult);

                                }

                                return result;

      default: throw new TypeError("Invalid input type: " + stacks);
   }

}

/**
 * Aggregates the data in each stack using the values between the indices, calculates
 * the descriptive statistic and returns the result.
 * @param {(Stack|Stack[])} stacks - the input stacks
 * @param {number} begin - the beginning index | the quantile or percentile
 * @param {number} end - the ending index
 * @param {number} p - the quantile or percentile
 * @returns {Object[]} the result
 */
QuantileStatistic.prototype.calculateStacksIndicesAggregated = function(stacks, begin, end, p) {

   Validation.validateArguments(arguments.length, QuantileStatistic.prototype.calculateStacksIndicesAggregated.length, "QuantileStatistic.prototype.calculateStacksIndicesAggregated");
   Validation.validatePositiveRange(begin, end);

   switch(Validation.getType(stacks)) {

      case '[object Stack]':   WellSetValidation.validateStack(stacks);

                               var aggregated = [];
                               var result = {};

                               for(var plate of stacks) {

                                  for(var well of plate) {
                                     aggregated = aggregated.concat(well.getData().slice(begin, end));
                                  }

                               }

                               result.stack = stacks.name;
                               result.result = this.calculate(aggregated, p);

                               return [result];

      case '[object Array]':   var result = [];

                               for(var stack of stacks) {

                                  WellSetValidation.validateStack(stack);

                                  var aggregated = [];
                                  var stackResult = {};

                                  for(var plate of stack) {

                                     for(var well of plate) {
                                        aggregated = aggregated.concat(well.getData().slice(begin, end));
                                     }

                                  }

                                  stackResult.stack = stack.name;
                                  stackResult.result = this.calculate(aggregated, p);

                                  result.push(stackResult);

                                }

                                return result;

      default: throw new TypeError("Invalid input type: " + stacks);
   }
}

/**
 * Performs the statistical operation on the data array.
 * @param {number[]} the input array
 * @returns {number} the result
 */
QuantileStatistic.prototype.calculate = function(data, p) {}
