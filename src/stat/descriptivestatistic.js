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

// descriptivestatistic.js

/*---------------------------------- Exports ---------------------------------*/

module.exports = DescriptiveStatistic;

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
 * wells. To create a custom statistical operation extend this class and override
 * the calculate method using the appropriate statistical operation.
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
function DescriptiveStatistic() {}

/*------------------------------ Well Functions ------------------------------*/

/**
 * Calculates the descriptive statistic for each well and returns the result. The
 * operation can be limited to a subset of data by passing indices into the well
 * data array.
 * @param {(Well|Well[])} wells - the input wells
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {Object[]} the result
 */
DescriptiveStatistic.prototype.wells = function(wells, begin, end) {

   switch(arguments.length) {

      case 1: return this.calculateWells(wells);

      case 3: return this.calculateWellsIndices(wells, begin, end);

      default: throw new TypeError("Invalid argument number: " + arguments.length);
   }

}

/**
 * Calculates the descriptive statistic for each well and returns the result.
 * @ignore
 * @param {(Well|Well[])} wells - the input wells
 * @returns {Object[]} the result
 */
DescriptiveStatistic.prototype.calculateWells = function(wells) {

   Validation.validateArguments(arguments.length, DescriptiveStatistic.prototype.calculateWells.length, "DescriptiveStatistic.prototype.calculateWells");

   switch(Validation.getType(wells)) {

      case '[object Well]':  WellValidation.validateWell(wells);

                             var result = {};

                             result.well = wells.toString();
                             result.result = this.calculate(wells.getData());

                             return [result];

      case '[object Array]': WellSetValidation.validateWellArray(wells);

                             var result = [];

                             for(var well of wells) {

                                var toAdd = {};

                                toAdd.well = well.toString();
                                toAdd.result = this.calculate(well.getData());

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
 * @returns {Object[]} the result
 */
DescriptiveStatistic.prototype.calculateWellsIndices = function(wells, begin, end) {

   Validation.validateArguments(arguments.length, DescriptiveStatistic.prototype.calculateWellsIndices.length, "DescriptiveStatistic.prototype.calculateWellsIndices");

   Validation.validatePositiveRange(begin, end);

   switch(Validation.getType(wells)) {

      case '[object Well]':  WellValidation.validateWell(wells);

                             var result = {};

                             result.well = wells.toString();
                             result.result = this.calculate(wells.getData().slice(begin, end));

                             return [result];

      case '[object Array]': WellSetValidation.validateWellArray(wells);

                             var result = [];

                             for(var well of wells) {

                                var toAdd = {};

                                toAdd.well = well.toString();
                                toAdd.result =this.calculate(well.getData().slice(begin, end));

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
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {Object[]} the result
 */
DescriptiveStatistic.prototype.wellsAggregated = function(wells, begin, end) {

   switch(arguments.length) {

      case 1: return this.calculateWellsAggregated(wells);

      case 3: return this.calculateWellsIndicesAggregated(wells, begin, end);

      default: throw new TypeError("Invalid argument number: " + arguments.length);
   }

}

/**
 * Aggregates the well values for each well and calculates the descriptive statistic
 * using the aggregated data.
 * @ignore
 * @param {Well[]} wells - the input wells
 * @returns {Object[]} the result
 */
DescriptiveStatistic.prototype.calculateWellsAggregated = function(wells) {
   Validation.validateArguments(arguments.length, DescriptiveStatistic.prototype.calculateWellsAggregated.length, "DescriptiveStatistic.prototype.calculateWellsAggregated");
   return this.calculateWellsIndicesAggregated(wells, 0, Infinity);
}

/**
 * Aggregates the well values between the indices for each well and calculates
 * the descriptive statistic using the aggregated data.
 * @ignore
 * @param {Well[]} wells - the input wells
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {Object[]} the result
 */
DescriptiveStatistic.prototype.calculateWellsIndicesAggregated = function(wells, begin, end) {

   Validation.validateArguments(arguments.length, DescriptiveStatistic.prototype.calculateWellsIndicesAggregated.length, "DescriptiveStatistic.prototype.calculateWellsIndicesAggregated");
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
   result.result = this.calculate(aggregated);

   return result;
}

/*---------------------------- Well Set Functions ----------------------------*/

/**
 * Calculates the descriptive statistic for each well in the well set and returns
 * the result. The operation can be limited to a subset of data by passing indices
 * into the well data array.
 * @param {(WellSet|WellSet[])} sets - the input sets
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {Object[]} the result
 */
DescriptiveStatistic.prototype.sets = function(sets, begin, end) {

   switch(arguments.length) {

      case 1: return this.calculateSets(sets);

      case 3: return this.calculateSetsIndices(sets, begin, end);

      default: throw new TypeError("Invalid argument number: " + arguments.length);
   }

}


/**
 * Calculates the descriptive statistic for each well in the well set and returns
 * the result.
 * @ignore
 * @param {(WellSet|WellSet[])} sets - the input sets
 * @returns {Object[]} the result
 */
DescriptiveStatistic.prototype.calculateSets = function(sets) {

   Validation.validateArguments(arguments.length, DescriptiveStatistic.prototype.calculateSets.length, "DescriptiveStatistic.prototype.calculateSets");

   switch(Validation.getType(sets)) {

      case '[object WellSet]':  WellSetValidation.validateWellSet(sets);

                                var result = {};

                                result.set = sets.name;
                                result.result = this.wells(sets.toArray());

                                return [result];

      case '[object Array]':    var result = [];

                                for(var set of sets) {

                                   WellSetValidation.validateWellSet(set);

                                   var setResult = {};

                                   setResult.set = set.name;
                                   setResult.result = this.wells(set.toArray());

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
 * @returns {Object[]} the result
 */
DescriptiveStatistic.prototype.calculateSetsIndices = function(sets, begin, end) {

   Validation.validateArguments(arguments.length, DescriptiveStatistic.prototype.calculateSetsIndices.length, "DescriptiveStatistic.prototype.calculateSetsIndices");
   Validation.validatePositiveRange(begin, end);

   switch(Validation.getType(sets)) {

      case '[object WellSet]':  WellSetValidation.validateWellSet(sets);

                                var result = {};

                                result.set = sets.name;
                                result.result = this.wells(sets.toArray(), begin, end);

                                return [result];

      case '[object Array]':    var result = [];

                                for(var set of sets) {

                                   WellSetValidation.validateWellSet(set);

                                   var setResult = {};

                                   setResult.set = set.name;
                                   setResult.result = this.wells(set.toArray(), begin, end);

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
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {Object[]} the result
 */
DescriptiveStatistic.prototype.setsAggregated = function(sets, begin, end) {

   switch(arguments.length) {

      case 1: return this.calculateSetsAggregated(sets);

      case 3: return this.calculateSetsIndicesAggregated(sets, begin, end);

      default: throw new TypeError("Invalid argument number: " + arguments.length);
   }

}

/**
 * Aggregates the data in each set, calculates the descriptive statistic and
 * returns the result.
 * @ignore
 * @param {(WellSet|WellSet[])} sets - the input sets
 * @returns {Object[]} the result
 */
DescriptiveStatistic.prototype.calculateSetsAggregated = function(sets) {

   Validation.validateArguments(arguments.length, DescriptiveStatistic.prototype.calculateSetsAggregated.length, "DescriptiveStatistic.prototype.calculateSetsAggregated");

   switch(Validation.getType(sets)) {

      case '[object WellSet]': WellSetValidation.validateWellSet(sets);

                               var aggregated = [];
                               var result = {};

                               for(var well of sets) {
                                  aggregated = aggregated.concat(well.getData());
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
                                     aggregated = aggregated.concat(well.getData());
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
 * @returns {Object[]} the result
 */
DescriptiveStatistic.prototype.calculateSetsIndicesAggregated = function(sets, begin, end) {

   Validation.validateArguments(arguments.length, DescriptiveStatistic.prototype.calculateSetsIndicesAggregated.length, "DescriptiveStatistic.prototype.calculateSetsIndicesAggregated");
   Validation.validatePositiveRange(begin, end);

   switch(Validation.getType(sets)) {

      case '[object WellSet]': WellSetValidation.validateWellSet(sets);

                               var aggregated = [];
                               var result = {};

                               for(var well of sets) {
                                  aggregated = aggregated.concat(well.getData().slice(begin, end));
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
                                     aggregated = aggregated.concat(well.getData().slice(begin, end));
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
 * @param {(Plate|Plate[])} plates - the input plates
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {Object[]} the result
 */
DescriptiveStatistic.prototype.plates = function(plates, begin, end) {

   switch(arguments.length) {

      case 1: return this.calculatePlates(plates);

      case 3: return this.calculatePlatesIndices(plates, begin, end);

      default: throw new TypeError("Invalid argument number: " + arguments.length);
   }

}


/**
 * Calculates the descriptive statistic for each well in the plate and returns
 * the result.
 * @ignore
 * @param {(Plate|Plate[])} plates - the input plates
 * @returns {Object[]} the result
 */
DescriptiveStatistic.prototype.calculatePlates = function(plates) {

   Validation.validateArguments(arguments.length, DescriptiveStatistic.prototype.calculatePlates.length, "DescriptiveStatistic.prototype.calculatePlates");

   switch(Validation.getType(plates)) {

      case '[object Plate]': WellSetValidation.validatePlate(plates);

                             var result = {};

                             result.plate = plates.name;
                             result.result = this.wells(plates.toArray());

                             return [result];

      case '[object Array]': var result = [];

                             for(var plate of plates) {

                                WellSetValidation.validatePlate(plate);

                                var plateResult = {};

                                plateResult.plate = plate.name;
                                plateResult.result = this.wells(plate.toArray());

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
 * @returns {Object[]} the result
 */
DescriptiveStatistic.prototype.calculatePlatesIndices = function(plates, begin, end) {

   Validation.validateArguments(arguments.length, DescriptiveStatistic.prototype.calculatePlatesIndices.length, "DescriptiveStatistic.prototype.calculatePlatesIndices");
   Validation.validatePositiveRange(begin, end);

   switch(Validation.getType(plates)) {

      case '[object Plate]':  WellSetValidation.validatePlate(plates);

                                var result = {};

                                result.plate = plates.name;
                                result.result = this.wells(plates.toArray(), begin, end);

                                return [result];

      case '[object Array]':    var result = [];

                                for(var plate of plates) {

                                   WellSetValidation.validatePlate(plate);

                                   var plateResult = {};

                                   plateResult.plate = plate.name;
                                   plateResult.result = this.wells(plate.toArray(), begin, end);

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
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {Object[]} the result
 */
DescriptiveStatistic.prototype.platesAggregated = function(plates, begin, end) {

   switch(arguments.length) {

      case 1: return this.calculatePlatesAggregated(plates);

      case 3: return this.calculatePlatesIndicesAggregated(plates, begin, end);

      default: throw new TypeError("Invalid argument number: " + arguments.length);
   }

}

/**
 * Aggregates the data in each plate, calculates the descriptive statistic and
 * returns the result.
 * @ignore
 * @param {(Plate|Plate[])} plates - the input plates
 * @returns {Object[]} the result
 */
DescriptiveStatistic.prototype.calculatePlatesAggregated = function(plates) {

   Validation.validateArguments(arguments.length, DescriptiveStatistic.prototype.calculatePlatesAggregated.length, "DescriptiveStatistic.prototype.calculatePlatesAggregated");

   switch(Validation.getType(plates)) {

      case '[object Plate]': WellSetValidation.validatePlate(plates);

                               var aggregated = [];
                               var result = {};

                               for(var well of plates) {
                                  aggregated = aggregated.concat(well.getData());
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
                                     aggregated = aggregated.concat(well.getData());
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
 * @returns {Object[]} the result
 */
DescriptiveStatistic.prototype.calculatePlatesIndicesAggregated = function(plates, begin, end) {

   Validation.validateArguments(arguments.length, DescriptiveStatistic.prototype.calculatePlatesIndicesAggregated.length, "DescriptiveStatistic.prototype.calculatePlatesIndicesAggregated");
   Validation.validatePositiveRange(begin, end);

   switch(Validation.getType(plates)) {

      case '[object Plate]': WellSetValidation.validatePlate(plates);

                               var aggregated = [];
                               var result = {};

                               for(var well of plates) {
                                  aggregated = aggregated.concat(well.getData().slice(begin, end));
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
                                     aggregated = aggregated.concat(well.getData().slice(begin, end));
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
 * @param {(Stack|Stack[])} stacks - the input stacks
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {Object[]} the result
 */
DescriptiveStatistic.prototype.stacks = function(stacks, begin, end) {

   switch(arguments.length) {

      case 1: return this.calculateStacks(stacks);

      case 3: return this.calculateStacksIndices(stacks, begin, end);

      default: throw new TypeError("Invalid argument number: " + arguments.length);
   }

}

/**
 * Calculates the descriptive statistic for each well in the stack and returns
 * the result.
 * @ignore
 * @param {(Stack|Stack[])} stacks - the input stacks
 * @returns {Object[]} the result
 */
DescriptiveStatistic.prototype.calculateStacks = function(stacks) {

   Validation.validateArguments(arguments.length, DescriptiveStatistic.prototype.calculateStacks.length, "DescriptiveStatistic.prototype.calculateStacks");

   switch(Validation.getType(stacks)) {

      case '[object Stack]': WellSetValidation.validateStack(stacks);

                             var result = {};

                             result.stack = stacks.name;
                             result.result = this.plates(stacks.toArray());

                             return [result];

      case '[object Array]': var result = [];

                             for(var stack of stacks) {

                                WellSetValidation.validateStack(stack);

                                var stackResult = {};

                                stackResult.stack = stack.name;
                                stackResult.result = this.plates(stack.toArray());

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
 * @returns {Object[]} the result
 */
DescriptiveStatistic.prototype.calculateStacksIndices = function(stacks, begin, end) {

   Validation.validateArguments(arguments.length, DescriptiveStatistic.prototype.calculateStacksIndices.length, "DescriptiveStatistic.prototype.calculateStacksIndices");
   Validation.validatePositiveRange(begin, end);

   switch(Validation.getType(stacks)) {

      case '[object Stack]':    WellSetValidation.validateStack(stacks);

                                var result = {};

                                result.stack = stacks.name;
                                result.result = this.plates(stacks.toArray(), begin, end);

                                return [result];

      case '[object Array]':    var result = [];

                                for(var stack of stacks) {

                                   WellSetValidation.validateStack(stack);

                                   var stackResult = {};

                                   stackResult.stack = stack.name;
                                   stackResult.result = this.plates(stack.toArray(), begin, end);

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
 * @param {number} begin - the beginning index
 * @param {number} end - the ending index
 * @returns {Object[]} the result
 */
DescriptiveStatistic.prototype.stacksAggregated = function(stacks, begin, end) {

   switch(arguments.length) {

      case 1: return this.calculateStacksAggregated(stacks);

      case 3: return this.calculateStacksIndicesAggregated(stacks, begin, end);

      default: throw new TypeError("Invalid argument number: " + arguments.length);
   }

}

/**
 * Aggregates the data in each stack, calculates the descriptive statistic and
 * returns the result.
 * @ignore
 * @param {(Stack|Stack[])} stacks - the input stacks
 * @returns {Object[]} the result
 */
DescriptiveStatistic.prototype.calculateStacksAggregated = function(stacks) {

   Validation.validateArguments(arguments.length, DescriptiveStatistic.prototype.calculateStacksAggregated.length, "DescriptiveStatistic.prototype.calculateStacksAggregated");

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
                               result.result = this.calculate(aggregated);

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
 * @returns {Object[]} the result
 */
DescriptiveStatistic.prototype.calculateStacksIndicesAggregated = function(stacks, begin, end) {

   Validation.validateArguments(arguments.length, DescriptiveStatistic.prototype.calculateStacksIndicesAggregated.length, "DescriptiveStatistic.prototype.calculateStacksIndicesAggregated");
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
                               result.result = this.calculate(aggregated);

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
                                  stackResult.result = this.calculate(aggregated);

                                  result.push(stackResult);

                                }

                                return result;

      default: throw new TypeError("Invalid input type: " + stacks);
   }
}

/**
 * Performs the statistical operation on the input array. Override this function
 * to create a custom statistical operation.
 * @param {number[]} data - the input array
 * @returns {number} the result
 */
DescriptiveStatistic.prototype.calculate = function(data) {}
