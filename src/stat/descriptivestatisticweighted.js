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

// descriptivestatisticweighted.js

/*---------------------------------- Exports ---------------------------------*/

module.exports = DescriptiveStatisticWeighted;

/*------------------------------- Dependencies -------------------------------*/

var Well = require('../plate/well');
var WellSet = require('../plate/wellset');
var Plate = require('../plate/plate');
var Stack = require('../plate/stack');
var Validation = require('../util/validation');
var WellValidation = require('../util/wellvalidation');
var WellSetValidation = require('../util/wellsetvalidation');
var DescriptiveStatistic = require('./descriptivestatistic');

/*-------------------------------- Constructor -------------------------------*/

/**
 * This class performs statistical operations on stacks, plates, well sets and
 * wells. To create a custom statistical operation extend this class and override
 * the calculate method using the appropriate statistical operation.
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
function DescriptiveStatisticWeighted() {
   DescriptiveStatistic.call(this);
}

DescriptiveStatisticWeighted.prototype = new DescriptiveStatistic();
DescriptiveStatisticWeighted.prototype.constructor = DescriptiveStatisticWeighted;

/*------------------------------ Well Functions ------------------------------*/

/**
 * Calculates the descriptive statistic for each well and returns the result. The
 * operation can be limited to a subset of data by passing indices into the well
 * data array.
 * @param {(Well|Well[])} var1 - input wells
 * @param {number|number[]} var2 - the beginning index | weights
 * @param {number} var3 - the ending index
 * @param {number[]} var4 - weights
 * @returns {Object[]} the result
 */
DescriptiveStatisticWeighted.prototype.wells = function(var1, var2, var3, var4) {

   switch(arguments.length) {

      case 1: return this.calculateWells(var1);

      case 2: return this.calculateWellsWeighted(var1, var2);

      case 3: return this.calculateWellsIndices(var1, var2, var3);

      case 4: return this.calculateWellsIndicesWeighted(var1, var2, var3, var4);

      default: throw new TypeError("Invalid argument number: " + arguments.length);
   }

}

/**
 * Calculates the descriptive statistic for each well and returns the result.
 * @ignore
 * @param {(Well|Well[])} wells - the input wells
 * @param {number[]} weights - weights
 * @returns {Object[]} the result
 */
DescriptiveStatisticWeighted.prototype.calculateWellsWeighted = function(wells, weights) {

   Validation.validateArguments(arguments.length, DescriptiveStatisticWeighted.prototype.calculateWellsWeighted.length, "DescriptiveStatisticWeighted.prototype.calculateWellsWeighted");
   WellValidation.validateWellData(weights);

   switch(Validation.getType(wells)) {

      case '[object Well]':  WellValidation.validateWell(wells);

                             var result = {};

                             result.well = wells.toString();
                             result.result = this.calculate(this.applyWeights(wells.getData(), weights));

                             return [result];

      case '[object Array]': WellSetValidation.validateWellArray(wells);

                             var result = [];

                             for(var well of wells) {

                                var toAdd = {};

                                toAdd.well = well.toString();
                                toAdd.result = this.calculate(this.applyWeights(well.getData(), weights));

                                result.push(toAdd);
                             }

                             return result;

      default: throw new TypeError("Invalid input type: " + wells);

   }

}

/**
 * Calculates the descriptive statistic for each well using the values between
 * the indices and returns the result.
 * @ignore
 * @param {Well[]} wells - the input wells
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @param {number[]} weights - weights
 * @returns {Object[]} the result
 */
DescriptiveStatisticWeighted.prototype.calculateWellsIndicesWeighted = function(wells, begin, end, weights) {

   Validation.validateArguments(arguments.length, DescriptiveStatisticWeighted.prototype.calculateWellsIndicesWeighted.length, "DescriptiveStatisticWeighted.prototype.calculateWellsIndicesWeighted");
   WellValidation.validateWellData(weights);
   Validation.validatePositiveRange(begin, end);

   switch(Validation.getType(wells)) {

      case '[object Well]':  WellValidation.validateWell(wells);

                             var result = {};

                             result.well = wells.toString();
                             result.result = this.calculate(this.applyWeights(wells.getData().slice(begin, end), weights));

                             return [result];

      case '[object Array]': WellSetValidation.validateWellArray(wells);

                             var result = [];

                             for(var well of wells) {

                                var toAdd = {};

                                toAdd.well = well.toString();
                                toAdd.result =this.calculate(this.applyWeights(well.getData().slice(begin, end), weights));

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
 * @param {(Well|Well[]|number[])} var1 - input wells
 * @param {number|number[]} var2 - the beginning index | weights
 * @param {number} var3 - the ending index
 * @param {number[]} var4 - weights
 * @returns {Object[]} the result
 */
DescriptiveStatisticWeighted.prototype.wellsAggregated = function(var1, var2, var3, var4) {

   switch(arguments.length) {

      case 1: return this.calculateWellsAggregated(var1);

      case 2: return this.calculateWellsAggregatedWeighted(var1, var2);

      case 3: return this.calculateWellsIndicesAggregated(var1, var2, var3);

      case 4: return this.calculateWellsIndicesAggregatedWeighted(var1, var2, var3, var4);

      default: throw new TypeError("Invalid argument number: " + arguments.length);
   }

}

/**
 * Aggregates the well values for each well and calculates the descriptive statistic
 * using the aggregated data.
 * @ignore
 * @param {Well[]} wells - the input wells
 * @param {number[]} weights - weights
 * @returns {Object[]} the result
 */
DescriptiveStatisticWeighted.prototype.calculateWellsAggregatedWeighted = function(wells, weights) {

   Validation.validateArguments(arguments.length, DescriptiveStatisticWeighted.prototype.calculateWellsAggregatedWeighted.length, "DescriptiveStatisticWeighted.prototype.calculateWellsAggregatedWeighted");
   WellSetValidation.validateWellArray(wells);
   WellValidation.validateWellData(weights);

   var aggregated = [];
   var indices = [];
   var result = {};

   for(var well of wells) {
      aggregated = aggregated.concat(this.applyWeights(well.getData(), weights));
      indices.push(well.toString());
   }

   result.wells = indices;
   result.result = this.calculate(aggregated);

   return result;
}

/**
 * Aggregates the well values between the indices for each well and calculates
 * the descriptive statistic using the aggregated data.
 * @ignore
 * @param {Well[]} wells - the input wells
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @param {number[]} weights - weights
 * @returns {Object[]} the result
 */
DescriptiveStatisticWeighted.prototype.calculateWellsIndicesAggregatedWeighted = function(wells, begin, end, weights) {

   Validation.validateArguments(arguments.length, DescriptiveStatisticWeighted.prototype.calculateWellsIndicesAggregatedWeighted.length, "DescriptiveStatisticWeighted.prototype.calculateWellsIndicesAggregatedWeighted");
   WellSetValidation.validateWellArray(wells);
   Validation.validatePositiveRange(begin, end);
   WellValidation.validateWellData(weights);

   var aggregated = [];
   var indices = [];
   var result = {};

   for(var well of wells) {
      aggregated = aggregated.concat(this.applyWeights(well.getData().slice(begin, end), weights));
      indices.push(well.toString());
   }

   result.wells = indices;
   result.result = this.calculate(aggregated);

   return result;
}

/*---------------------------- Well Set Functions ----------------------------*/

/**
 * Calculates the descriptive statistic for each well in the well set and returns
 * the result. The operation can be limited to a subset of data by passing indices
 * into the well data array.
 * @param {(WellSet|WellSet[]|number[])} var1 - input well sets
 * @param {number|number[]} var2 - the beginning index | weights
 * @param {number} var3 - the ending index
 * @param {number[]} var4 - weights
 * @returns {Object[]} the result
 */
DescriptiveStatisticWeighted.prototype.sets = function(var1, var2, var3, var4) {

   switch(arguments.length) {

      case 1: return this.calculateSets(var1);

      case 2: return this.calculateSetsWeighted(var1, var2);

      case 3: return this.calculateSetsIndices(var1, var2, var3);

      case 4: return this.calculateSetsIndicesWeighted(var1, var2, var3, var4);

      default: throw new TypeError("Invalid argument number: " + arguments.length);
   }

}


/**
 * Calculates the descriptive statistic for each well in the well set and returns
 * the result.
 * @ignore
 * @param {(WellSet|WellSet[])} sets - the input sets
 * @param {number[]} weights - weights
 * @returns {Object[]} the result
 */
DescriptiveStatisticWeighted.prototype.calculateSetsWeighted = function(sets, weights) {

   Validation.validateArguments(arguments.length, DescriptiveStatisticWeighted.prototype.calculateSetsWeighted.length, "DescriptiveStatisticWeighted.prototype.calculateSetsWeighted");
   WellValidation.validateWellData(weights);

   switch(Validation.getType(sets)) {

      case '[object WellSet]':  WellSetValidation.validateWellSet(sets);

                                var result = {};

                                result.set = sets.name;
                                result.result = this.wells(sets.toArray(), weights);

                                return [result];

      case '[object Array]':    var result = [];

                                for(var set of sets) {

                                   WellSetValidation.validateWellSet(set);

                                   var setResult = {};

                                   setResult.set = set.name;
                                   setResult.result = this.wells(set.toArray(), weights);

                                   result.push(setResult);

                                }

                                return result;

      default: throw new TypeError("Invalid input type: " + sets);

   }

}

/**
 * Calculates the descriptive statistic for each well in the well set using the
 * values between the indices and returns the result.
 * @ignore
 * @param {(WellSet|WellSet[])} sets - the input sett
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @param {number[]} weights - weights
 * @returns {Object[]} the result
 */
DescriptiveStatisticWeighted.prototype.calculateSetsIndicesWeighted = function(sets, begin, end, weights) {

   Validation.validateArguments(arguments.length, DescriptiveStatisticWeighted.prototype.calculateSetsIndicesWeighted.length, "DescriptiveStatisticWeighted.prototype.calculateSetsIndicesWeighted");
   Validation.validatePositiveRange(begin, end);
   WellValidation.validateWellData(weights);

   switch(Validation.getType(sets)) {

      case '[object WellSet]':  WellSetValidation.validateWellSet(sets);

                                var result = {};

                                result.set = sets.name;
                                result.result = this.wells(sets.toArray(), begin, end, weights);

                                return [result];

      case '[object Array]':    var result = [];

                                for(var set of sets) {

                                   WellSetValidation.validateWellSet(set);

                                   var setResult = {};

                                   setResult.set = set.name;
                                   setResult.result = this.wells(set.toArray(), begin, end, weights);

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
 * @param {(WellSet|WellSet[]|number[])} var1 - input well sets
 * @param {number|number[]} var2 - the beginning index | weights
 * @param {number} var3 - the ending index
 * @param {number[]} var4 - weights
 * @returns {Object[]} the result
 */
DescriptiveStatisticWeighted.prototype.setsAggregated = function(var1, var2, var3, var4) {

   switch(arguments.length) {

      case 1: return this.calculateSetsAggregated(var1);

      case 2: return this.calculateSetsAggregatedWeighted(var1, var2);

      case 3: return this.calculateSetsIndicesAggregated(var1, var2, var3);

      case 4: return this.calculateSetsIndicesAggregatedWeighted(var1, var2, var3, var4);

      default: throw new TypeError("Invalid argument number: " + arguments.length);
   }

}

/**
 * Aggregates the data in each set, calculates the descriptive statistic and
 * returns the result.
 * @ignore
 * @param {(WellSet|WellSet[])} sets - the input sets
 * @param {number[]} weights - weights
 * @returns {Object[]} the result
 */
DescriptiveStatisticWeighted.prototype.calculateSetsAggregatedWeighted = function(sets, weights) {

   Validation.validateArguments(arguments.length, DescriptiveStatisticWeighted.prototype.calculateSetsAggregatedWeighted.length, "DescriptiveStatisticWeighted.prototype.calculateSetsAggregatedWeighted");
   WellValidation.validateWellData(weights);

   switch(Validation.getType(sets)) {

      case '[object WellSet]': WellSetValidation.validateWellSet(sets);

                               var aggregated = [];
                               var result = {};

                               for(var well of sets) {
                                  aggregated = aggregated.concat(this.applyWeights(well.getData(), weights));
                               }

                               result.set = sets.name;
                               result.result = this.calculate(aggregated);

                               return [result];

      case '[object Array]':   var result = [];

                               for(var set of sets) {

                                  WellSetValidation.validateWellSet(set);

                                  var aggregated = [];
                                  var setResult = {};

                                  for(var well of set) {
                                     aggregated = aggregated.concat(this.applyWeights(well.getData(), weights));
                                  }

                                  setResult.set = set.name;
                                  setResult.result = this.calculate(aggregated);

                                  result.push(setResult);

                                }

                                return result;

      default: throw new TypeError("Invalid input type: " + sets);
   }

}

/**
 * Aggregates the data in each set using the values between the indices, calculates
 * the descriptive statistic and returns the result.
 * @ignore
 * @param {(WellSet|WellSet[])} sets - the input sets
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @param {number[]} weights - weights
 * @returns {Object[]} the result
 */
DescriptiveStatisticWeighted.prototype.calculateSetsIndicesAggregatedWeighted = function(sets, begin, end, weights) {

   Validation.validateArguments(arguments.length, DescriptiveStatisticWeighted.prototype.calculateSetsIndicesAggregatedWeighted.length, "DescriptiveStatisticWeighted.prototype.calculateSetsIndicesAggregatedWeighted");
   Validation.validatePositiveRange(begin, end);
   WellValidation.validateWellData(weights);

   switch(Validation.getType(sets)) {

      case '[object WellSet]': WellSetValidation.validateWellSet(sets);

                               var aggregated = [];
                               var result = {};

                               for(var well of sets) {
                                  aggregated = aggregated.concat(this.applyWeights(well.getData().slice(begin, end), weights));
                               }

                               result.set = sets.name;
                               result.result = this.calculate(aggregated);

                               return [result];

      case '[object Array]':   var result = [];

                               for(var set of sets) {

                                  WellSetValidation.validateWellSet(set);

                                  var aggregated = [];
                                  var setResult = {};

                                  for(var well of set) {
                                     aggregated = aggregated.concat(this.applyWeights(well.getData().slice(begin, end), weights));
                                  }

                                  setResult.set = set.name;
                                  setResult.result = this.calculate(aggregated);

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
 * @param {(Plate|Plate[]|number[])} var1 - input plates
 * @param {number|number[]} var2 - the beginning index | weights
 * @param {number} var3 - the ending index
 * @param {number[]} var4 - weights
 * @returns {Object[]} the result
 */
DescriptiveStatisticWeighted.prototype.plates = function(var1, var2, var3, var4) {

   switch(arguments.length) {

      case 1: return this.calculatePlates(var1);

      case 2: return this.calculatePlatesWeighted(var1, var2);

      case 3: return this.calculatePlatesIndices(var1, var2, var3);

      case 4: return this.calculatePlatesIndicesWeighted(var1, var2, var3, var4);

      default: throw new TypeError("Invalid argument number: " + arguments.length);
   }

}


/**
 * Calculates the descriptive statistic for each well in the plate and returns
 * the result.
 * @ignore
 * @param {(Plate|Plate[])} plates - the input plates
 * @param {number[]} weights - weights
 * @returns {Object[]} the result
 */
DescriptiveStatisticWeighted.prototype.calculatePlatesWeighted = function(plates, weights) {

   Validation.validateArguments(arguments.length, DescriptiveStatisticWeighted.prototype.calculatePlatesWeighted.length, "DescriptiveStatisticWeighted.prototype.calculatePlatesWeighted");
   WellValidation.validateWellData(weights);

   switch(Validation.getType(plates)) {

      case '[object Plate]': WellSetValidation.validatePlate(plates);

                             var result = {};

                             result.plate = plates.name;
                             result.result = this.wells(plates.toArray(), weights);

                             return [result];

      case '[object Array]': var result = [];

                             for(var plate of plates) {

                                WellSetValidation.validatePlate(plate);

                                var plateResult = {};

                                plateResult.plate = plate.name;
                                plateResult.result = this.wells(plate.toArray(), weights);

                                result.push(plateResult);

                             }

                             return result;

      default: throw new TypeError("Invalid input type: " + plates);

   }

}

/**
 * Calculates the descriptive statistic for each well in the plate using the values
 * between the indices and returns the result.
 * @ignore
 * @param {(Plate|Plate[])} plates - the input plates
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @param {number[]} weights - weights
 * @returns {Object[]} the result
 */
DescriptiveStatisticWeighted.prototype.calculatePlatesIndicesWeighted = function(plates, begin, end, weights) {

   Validation.validateArguments(arguments.length, DescriptiveStatisticWeighted.prototype.calculatePlatesIndicesWeighted.length, "DescriptiveStatisticWeighted.prototype.calculatePlatesIndicesWeighted");
   Validation.validatePositiveRange(begin, end);
   WellValidation.validateWellData(weights);

   switch(Validation.getType(plates)) {

      case '[object Plate]':  WellSetValidation.validatePlate(plates);

                                var result = {};

                                result.plate = plates.name;
                                result.result = this.wells(plates.toArray(), begin, end, weights);

                                return [result];

      case '[object Array]':    var result = [];

                                for(var plate of plates) {

                                   WellSetValidation.validatePlate(plate);

                                   var plateResult = {};

                                   plateResult.plate = plate.name;
                                   plateResult.result = this.wells(plate.toArray(), begin, end, weights);

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
 * @param {(Plate|Plate[]|number[])} var1 - input plates
 * @param {number|number[]} var2 - the beginning index | weights
 * @param {number} var3 - the ending index
 * @param {number[]} var4 - weights
 * @returns {Object[]} the result
 */
DescriptiveStatisticWeighted.prototype.platesAggregated = function(var1, var2, var3, var4) {

   switch(arguments.length) {

      case 1: return this.calculatePlatesAggregated(var1);

      case 2: return this.calculatePlatesAggregatedWeighted(var1, var2);

      case 3: return this.calculatePlatesIndicesAggregated(var1, var2, var3);

      case 4: return this.calculatePlatesIndicesAggregatedWeighted(var1, var2, var3, var4);

      default: throw new TypeError("Invalid argument number: " + arguments.length);
   }

}

/**
 * Aggregates the data in each plate, calculates the descriptive statistic and
 * returns the result.
 * @ignore
 * @param {(Plate|Plate[])} plates - the input plates
 * @param {number[]} weights - weights
 * @returns {Object[]} the result
 */
DescriptiveStatisticWeighted.prototype.calculatePlatesAggregatedWeighted = function(plates, weights) {

   Validation.validateArguments(arguments.length, DescriptiveStatisticWeighted.prototype.calculatePlatesAggregatedWeighted.length, "DescriptiveStatisticWeighted.prototype.calculatePlatesAggregatedWeighted");
   WellValidation.validateWellData(weights);

   switch(Validation.getType(plates)) {

      case '[object Plate]': WellSetValidation.validatePlate(plates);

                               var aggregated = [];
                               var result = {};

                               for(var well of plates) {
                                  aggregated = aggregated.concat(this.applyWeights(well.getData(), weights));
                               }

                               result.plate = plates.name;
                               result.result = this.calculate(aggregated);

                               return [result];

      case '[object Array]':   var result = [];

                               for(var plate of plates) {

                                  WellSetValidation.validatePlate(plate);

                                  var aggregated = [];
                                  var plateResult = {};

                                  for(var well of plate) {
                                     aggregated = aggregated.concat(this.applyWeights(well.getData(), weights));
                                  }

                                  plateResult.plate = plate.name;
                                  plateResult.result = this.calculate(aggregated);

                                  result.push(plateResult);

                                }

                                return result;

      default: throw new TypeError("Invalid input type: " + plates);
   }

}

/**
 * Aggregates the data in each plate using the values between the indices, calculates
 * the descriptive statistic and returns the result.
 * @ignore
 * @param {(Plate|Plate[])} plates - the input plates
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @param {number[]} weights - weights
 * @returns {Object[]} the result
 */
DescriptiveStatisticWeighted.prototype.calculatePlatesIndicesAggregatedWeighted = function(plates, begin, end, weights) {

   Validation.validateArguments(arguments.length, DescriptiveStatisticWeighted.prototype.calculatePlatesIndicesAggregatedWeighted.length, "DescriptiveStatisticWeighted.prototype.calculatePlatesIndicesAggregatedWeighted");
   Validation.validatePositiveRange(begin, end);
   WellValidation.validateWellData(weights);

   switch(Validation.getType(plates)) {

      case '[object Plate]': WellSetValidation.validatePlate(plates);

                               var aggregated = [];
                               var result = {};

                               for(var well of plates) {
                                  aggregated = aggregated.concat(this.applyWeights(well.getData().slice(begin, end), weights));
                               }

                               result.plate = plates.name;
                               result.result = this.calculate(aggregated);

                               return [result];

      case '[object Array]':   var result = [];

                               for(var plate of plates) {

                                  WellSetValidation.validatePlate(plate);

                                  var aggregated = [];
                                  var plateResult = {};

                                  for(var well of plate) {
                                     aggregated = aggregated.concat(this.applyWeights(well.getData().slice(begin, end), weights));
                                  }

                                  plateResult.plate = plate.name;
                                  plateResult.result = this.calculate(aggregated);

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
 * @param {(Stack|Stack[]|number[])} var1 - input stacks
 * @param {number|number[]} var2 - the beginning index | weights
 * @param {number} var3 - the ending index
 * @param {number[]} var4 - weights
 * @returns {Object[]} the result
 */
DescriptiveStatisticWeighted.prototype.stacks = function(var1, var2, var3, var4) {

   switch(arguments.length) {

      case 1: return this.calculateStacks(var1);

      case 2: return this.calculateStackWeighted(var1, var2);

      case 3: return this.calculateStacksIndices(var1, var2, var3);

      case 4: return this.calculateStacksIndicesWeighted(var1, var2, var3, var4);

      default: throw new TypeError("Invalid argument number: " + arguments.length);
   }

}

/**
 * Calculates the descriptive statistic for each well in the stack and returns
 * the result.
 * @ignore
 * @param {(Stack|Stack[])} stacks - the input stacks
 * @param {number[]} weights - weights
 * @returns {Object[]} the result
 */
DescriptiveStatisticWeighted.prototype.calculateStacksWeighted = function(stacks, weights) {

   Validation.validateArguments(arguments.length, DescriptiveStatisticWeighted.prototype.calculateStacksWeighted.length, "DescriptiveStatisticWeighted.prototype.calculateStacksWeighted");
   WellValidation.validateWellData(weights);

   switch(Validation.getType(stacks)) {

      case '[object Stack]': WellSetValidation.validateStack(stacks);

                             var result = {};

                             result.stack = stacks.name;
                             result.result = this.plates(stacks.toArray(), weights);

                             return [result];

      case '[object Array]': var result = [];

                             for(var stack of stacks) {

                                WellSetValidation.validateStack(stack);

                                var stackResult = {};

                                stackResult.stack = stack.name;
                                stackResult.result = this.plates(stack.toArray(), weights);

                                result.push(stackResult);

                             }

                             return result;

      default: throw new TypeError("Invalid input type: " + stacks);

   }

}

/**
 * Calculates the descriptive statistic for each well in the stack using the values
 * between the indices and returns the result.
 * @ignore
 * @param {(Stack|Stack[])} stacks - the input stacks
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @param {number[]} weights - weights
 * @returns {Object[]} the result
 */
DescriptiveStatisticWeighted.prototype.calculateStacksIndicesWeighted = function(stacks, begin, end, weights) {

   Validation.validateArguments(arguments.length, DescriptiveStatisticWeighted.prototype.calculateStacksIndicesWeighted.length, "DescriptiveStatisticWeighted.prototype.calculateStacksIndicesWeighted");
   Validation.validatePositiveRange(begin, end);
   WellValidation.validateWellData(weights);

   switch(Validation.getType(stacks)) {

      case '[object Stack]':    WellSetValidation.validateStack(stacks);

                                var result = {};

                                result.stack = stacks.name;
                                result.result = this.plates(stacks.toArray(), begin, end, weights);

                                return [result];

      case '[object Array]':    var result = [];

                                for(var stack of stacks) {

                                   WellSetValidation.validateStack(stack);

                                   var stackResult = {};

                                   stackResult.stack = stack.name;
                                   stackResult.result = this.plates(stack.toArray(), begin, end, weights);

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
 * @param {(Stack|Stack[]|number[])} var1 - input stacks
 * @param {number|number[]} var2 - the beginning index | weights
 * @param {number} var3 - the ending index
 * @param {number[]} var4 - weights
 * @returns {Object[]} the result
 */
DescriptiveStatisticWeighted.prototype.stacksAggregated = function(var1, var2, var3, var4) {

   switch(arguments.length) {

      case 1: return this.calculateStacksAggregated(var1);

      case 2: return this.calculateStackAggregatedWeighted(var1, var2);

      case 3: return this.calculateStacksIndicesAggregated(var1, var2, var3);

      case 4: return this.calculateStacksIndicesAggregated(var1, var2, var3, var4);

      default: throw new TypeError("Invalid argument number: " + arguments.length);
   }

}

/**
 * Aggregates the data in each stack, calculates the descriptive statistic and
 * returns the result.
 * @ignore
 * @param {(Stack|Stack[])} stacks - the input stacks
 * @param {number[]} weights - weights
 * @returns {Object[]} the result
 */
DescriptiveStatisticWeighted.prototype.calculateStacksAggregatedWeighted = function(stacks, weights) {

   Validation.validateArguments(arguments.length, DescriptiveStatisticWeighted.prototype.calculateStacksAggregatedWeighted.length, "DescriptiveStatisticWeighted.prototype.calculateStacksAggregatedWeighted");
   WellValidation.validateWellData(weights);

   switch(Validation.getType(stacks)) {

      case '[object Stack]':   WellSetValidation.validateStack(stacks);

                               var aggregated = [];
                               var result = {};

                               for(var plate of stacks) {

                                  for(var well of plate) {
                                     aggregated = aggregated.concat(this.applyWeights(well.getData(), weights));
                                  }

                               }

                               result.stack = stacks.name;
                               result.result = this.calculate(aggregated);

                               return [result];

      case '[object Array]':   var result = [];

                               for(var stack of stacks) {

                                  WellSetValidation.validateStack(stack);

                                  var aggregated = [];
                                  var stackResult = {};

                                  for(var plate of stack) {

                                     for(var well of plate) {
                                        aggregated = aggregated.concat(this.applyWeights(well.getData(), weights));
                                     }

                                  }

                                  stackResult.stack = stack.name;
                                  stackResult.result = this.calculate(aggregated);

                                  result.push(stackResult);

                                }

                                return result;

      default: throw new TypeError("Invalid input type: " + stacks);
   }

}

/**
 * Aggregates the data in each stack using the values between the indices, calculates
 * the descriptive statistic and returns the result.
 * @ignore
 * @param {(Stack|Stack[])} stacks - the input stacks
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @param {number[]} weights - weights
 * @returns {Object[]} the result
 */
DescriptiveStatisticWeighted.prototype.calculateStacksIndicesAggregatedWeighted = function(stacks, begin, end, weights) {

   Validation.validateArguments(arguments.length, DescriptiveStatisticWeighted.prototype.calculateStacksIndicesAggregatedWeighted.length, "DescriptiveStatisticWeighted.prototype.calculateStacksIndicesAggregatedWeighted");
   Validation.validatePositiveRange(begin, end);
   WellValidation.validateWellData(weights);

   switch(Validation.getType(stacks)) {

      case '[object Stack]':   WellSetValidation.validateStack(stacks);

                               var aggregated = [];
                               var result = {};

                               for(var plate of stacks) {

                                  for(var well of plate) {
                                     aggregated = aggregated.concat(this.applyWeights(well.getData().slice(begin, end), weights));
                                  }

                               }

                               result.stack = stacks.name;
                               result.result = this.calculate(aggregated);

                               return [result];

      case '[object Array]':   var result = [];

                               for(var stack of stacks) {

                                  WellSetValidation.validateStack(stack);

                                  var aggregated = [];
                                  var stackResult = {};

                                  for(var plate of stack) {

                                     for(var well of plate) {
                                        aggregated = aggregated.concat(this.applyWeights(well.getData().slice(begin, end), weights));
                                     }

                                  }

                                  stackResult.stack = stack.name;
                                  stackResult.result = this.calculate(aggregated);

                                  result.push(stackResult);

                                }

                                return result;

      default: throw new TypeError("Invalid input type: " + stacks);
   }
}

/**
 * Applies weights to a data set and returns the result.
 * @ignore
 * @param {number[]} data - the data set
 * @param {number[]} weights - the weights
 * @returns {number[]} the weighted data set
 */
DescriptiveStatisticWeighted.prototype.applyWeights = function(data, weights) {

   Validation.validateArguments(arguments.length, DescriptiveStatisticWeighted.prototype.applyWeights.length, "DescriptiveStatisticWeighted.prototype.applyWeights");
   WellValidation.validateWellData(data);
   WellValidation.validateWellData(weights);

   var weighted = data.slice();

   for(var i = 0; i < data.length && i < weights.length; i++) {
      weighted[i] = data[i] * weights[i];
   }

   return weighted;
}

/**
 * Performs the statistical operation on the input array. Override this function
 * to create a custom statistical operation.
 * @param {number[]} data - the input array
 * @returns {number} the result
 */
DescriptiveStatisticWeighted.prototype.calculate = function(data) {}
