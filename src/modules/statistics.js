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
 * This module combines all statistics classes.
 * @module Statistics
 * @author Jesse L. Mull
 * @version Updated February 17, 2016
 * @license Apache License 2.0
 * @see <a href="http://www.jessemull.com" target="_blank">http://www.jessemull.com</a><br>
 * @see <a href="mailto:hello@jessemull.com">hello@jessemull.com</a>
 */
module.exports = {
   Bins: require('../stat/bins'),
   CentralMoment: require('../stat/centralmoment'),
   Chunk: require('../stat/chunk'),
   CoefficientOfVariation: require('../stat/coefficientofvariation'),
   ContraharmonicMean: require('../stat/contraharmonicmean'),
   CumulativeProduct: require('../stat/cumulativeproduct'),
   CumulativeSum: require('../stat/cumulativesum'),
   Differences: require('../stat/differences'),
   EqualBins: require('../stat/equalbins'),
   GeometricMean: require('../stat/geometricmean'),
   HarmonicMean: require('../stat/harmonicmean'),
   InterquartileRange: require('../stat/interquartilerange'),
   Kurtosis: require('../stat/kurtosis'),
   Max: require('../stat/max'),
   Mean: require('../stat/mean'),
   MeanDeviation: require('../stat/meandeviation'),
   Median: require('../stat/median'),
   MedianDeviation: require('../stat/mediandeviation'),
   Min: require('../stat/min'),
   Mode: require('../stat/mode'),
   N: require('../stat/n'),
   Percentile: require('../stat/percentile'),
   PopulationStandardDeviation: require('../stat/populationstandarddeviation'),
   PopulationVariance: require('../stat/populationvariance'),
   PowerDeviation: require('../stat/powerdeviation'),
   Product: require('../stat/product'),
   Quantile: require('../stat/quantile'),
   QuartileDeviation: require('../stat/quartiledeviation'),
   Quartiles: require('../stat/quartiles'),
   QuartileSkewness: require('../stat/quartileskewness'),
   RandomSample: require('../stat/randomsample'),
   Range: require('../stat/range'),
   SampleStandardDeviation: require('../stat/samplestandarddeviation'),
   SampleVariance: require('../stat/samplevariance'),
   Shuffle: require('../stat/shuffle'),
   Skewness: require('../stat/skewness'),
   StandardError: require('../stat/standarderror'),
   Sum: require('../stat/sum'),
   SumOfSquares: require('../stat/sumofsquares'),
}
