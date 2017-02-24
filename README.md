## MicroFlex

Microplate assays produce semi-structured data in a variety of formats. Due to recent advances in high throughput biology, data from a single experiment can exceed billions or even trillions of data points. Combining, normalizing time, money and resources.

Introducing MicroFlex, the world's first microplate library designed for bioscience data processing and software development. MicroFlex saves you time and money by simplifying code and eliminating errors in data handling.

### Installation:

Node.js, browserify, and webpack users can install via npm:  
npm install --save-dev microflex  

### Quick Start:

##### [Quick Start Tutorial](http://www.jessemull.com)

### Documentation:

##### [JSDoc Documentation](http://www.jessemull.com/microflexjs/index.html)

### Usage:

**var MicroFlex = require('microflex');**

**var Microplate = MicroFlex.Microplate;**  
var Well = Microplate.Well;  
var WellGroup = Microplate.WellGroup;  
var WellSet = Microplate.WellSet;  
var Plate = Microplate.Plate;  
var Stack = Microplate.Stack;  
...  

**var Operators = MicroFlex.Operators;**  
var Addition = Operators.Addition;  
var LeftShift = Operators.LeftShift;  
...  

**var Statistics = MicroFlex.Statistics;**  
var Mean = Statistics.Mean;  
var Kurtosis = Statistics.Kurtosis;  
...  

**var IO = MicroFlex.IO;**  
var MicroJSON = IO.MicroJSON;  
var MicroXML = IO.MicroXML;  
...  

**var Utilities =MicroFlex.Utilities;**  
var WellValidation = Utilities.WellValidation;  
var TypedHashSet = Utilities.TypedHashSet;  
...  

### Features:

#### MicroFlex.Microplate

Well-based data structures

* Wells
* WellSets
* Plates
* Stacks

#### MicroFlex.Operators

Mathematical operators for wells, sets, plates and stacks

* Addition
* Decrement
* Division
* Increment
* Modulus
* Multiplication
* Subtraction
* AND
* OR
* XOR
* Compliment
* Left Shift
* Right Shift Arithmetic
* Right Shift Logical

#### MicroFlex.IO

Condensed, efficient and easy to read input/output

* JSON
* XML

#### MicroFlex.Utilities

Helper functions for testing and validation

* Random well, well set, plate and stack objects
* Validation for all microplate types
* Hash set and typed hash set implementations

#### MicroFlex.Statistics

Descriptive statistics

* Bins
* Central Moment
* Chunk
* Coefficient of Variation
* Contra-harmonic Mean
* Cumulative Product
* Cumulative Sum
* Differences
* Equal Binning
* Geometric Mean
* Harmonic Mean
* Interquartile Range
* Kurtosis
* Maximum
* Mean
* Mean Deviation
* Median
* Median Deviation
* Minimum
* Mode
* N
* Percentile
* Population Standard Deviation
* Population Variance
* Power Deviation
* Product
* Quantile
* Quartile Deviation
* Quartiles
* Quartile Skewness
* Random Sample
* Range
* Root Mean Square
* Sample Standard Deviation
* Sample Variance
* Shuffle
* Skewness
* Standard Error
* Sum
* Sum of Squares
