<div class="modal-body">
   <div class="work-gr">

      <h2 class="title1 modal-title"><b>MicroFlex</b></h2>

      <p>Microplate assays produce semi-structured data in a variety of formats.
         Due to recent advances in high throughput biology, data from a single
         experiment can exceed billions or even trillions of data points. Combining,
         normalizing and analyzing this data requires a significant investment in
         time, money and resources.
      </p>

      <p>Introducing MicroFlex, the world's first microplate library designed for
         bioscience data processing and software development. MicroFlex saves you
         time and money by simplifying code and eliminating errors in data handling.
      </p>

      <h3><b>Installation:</b></h3>
      <p>Node.js, browserify, and webpack users can install via npm:</p>
      <p>npm install --save-dev microflex</p>

      <h3><b>Quick Start:</b></h3>
      <h4><a href="http://www.jessemull.com" target="_blank">Quick Start Tutorial</a></h4>

      <h3><b>Documentation:</b></h3>
      <h4><a href="http://www.jessemull.com/microflexjs/index.html" target="_blank">JSDoc Documentation</a></h4>

      <h3><b>Usage:</b></h3>

      <p><b><span style="color: purple;">var</span> MicroFlex = <span style="color: chocolate;">require</span>('<span style="color: firebrick;">microflex</span>');</b>
      <br><b><span style="color: purple;">var</span> Microplate = <span style="color: chocolate;">MicroFlex</span>.<span style="color: firebrick;">Microplate</span>;</b>
      <br>var Well = Microplate.Well;
      <br>var WellGroup = Microplate.WellGroup;
      <br>var WellSet = Microplate.WellSet;
      <br>var Plate = Microplate.Plate;
      <br>var Stack = Microplate.Stack;
      <br>...</p>

      <p><b><span style="color: purple;">var</span> MicroFlex = <span style="color: chocolate;">require</span>('<span style="color: firebrick;">microflex</span>');</b>
      <br><b><span style="color: purple;">var</span> Operators = <span style="color: chocolate;">MicroFlex</span>.<span style="color: firebrick;">Operators</span>;</b>
      <br>var Addition = Operators.Addition;
      <br>var LeftShift = Operators.LeftShift;
      <br>...</p>

      <p><b><span style="color: purple;">var</span> MicroFlex = <span style="color: chocolate;">require</span>('<span style="color: firebrick;">microflex</span>');</b>
      <br><b><span style="color: purple;">var</span> Statistics = <span style="color: chocolate;">MicroFlex</span>.<span style="color: firebrick;">Statistics</span>;</b>
      <br>var Mean = Statistics.Mean;
      <br>var Kurtosis = Statistics.Kurtosis;
      <br>...</p>

      <p><b><span style="color: purple;">var</span> MicroFlex = <span style="color: chocolate;">require</span>('<span style="color: firebrick;">microflex</span>');</b>
      <br><b><span style="color: purple;">var</span> IO = <span style="color: chocolate;">MicroFlex</span>.<span style="color: firebrick;">IO</span>;</b>
      <br>var MicroJSON = IO.MicroJSON;
      <br>var MicroXML = IO.MicroXML;
      <br>...</p>

      <p><b><span style="color: purple;">var</span> MicroFlex = <span style="color: chocolate;">require</span>('<span style="color: firebrick;">microflex</span>');</b>
      <br><b><span style="color: purple;">var</span> Utilities = <span style="color: chocolate;">MicroFlex</span>.<span style="color: firebrick;">Utilities</span>;</b>
      <br>var WellValidation = Utilities.WellValidation;
      <br>var TypedHashSet = Utilities.TypedHashSet;
      <br>...</p>

      <h3><b>Features:</b></h3>
      <p>
      <h3 style="margin-bottom: 0px; padding-bottom: 0px;">MicroFlex.Microplate</h3>
      Well-based data structures</p>
      <ul>
         <li>Wells</li>
         <li>WellSets</li>
         <li>Plates</li>
         <li>Stacks</li>
      </ul>

      <h3 style="margin-bottom: 0px; padding-bottom: 0px;">MicroFlex.Operators</h3>
      <p>Mathematical operators for wells, sets, plates and stacks</p>
      <ul>
         <li>Addition</li>
         <li>Decrement</li>
         <li>Division</li>
         <li>Increment</li>
         <li>Modulus</li>
         <li>Multiplication</li>
         <li>Subtraction</li>
         <li>AND</li>
         <li>OR</li>
         <li>XOR</li>
         <li>Compliment</li>
         <li>Left Shift</li>
         <li>Right Shift Arithmetic</li>
         <li>Right Shift Logical</li>
      </ul>

      <h3 style="margin-bottom: 0px; padding-bottom: 0px;">MicroFlex.IO</h3>
      <p>Condensed, efficient and easy to read input/output</p>
      <ul>
         <li>JSON</li>
         <li>XML</li>
      </ul>

      <h3 style="margin-bottom: 0px; padding-bottom: 0px;">MicroFlex.Utilities</h3>
      <p>Helper functions for testing and validation</p>
      <ul>
         <li style="margin-bottom: 5px;">Random well, well set, plate and stack objects</li>
         <li style="margin-bottom: 5px;">Validation for all microplate types</li>
         <li style="margin-bottom: 5px;">Hash set and typed hash set implementations</li>
      </ul>


      <h3 style="margin-bottom: 0px; padding-bottom: 0px;">MicroFlex.Statistics</h3>
      <p>Descriptive statistics</p>
      <ul>
         <li>Bins</li>
         <li>Central Moment</li>
         <li>Chunk</li>
         <li>Coefficient of Variation</li>
         <li>Contra-harmonic Mean</li>
         <li>Cumulative Product</li>
         <li>Cumulative Sum</li>
         <li>Differences</li>
         <li>Equal Binning</li>
         <li>Geometric Mean</li>
         <li>Harmonic Mean</li>
         <li>Interquartile Range</li>
         <li>Kurtosis</li>
         <li>Maximum</li>
         <li>Mean</li>
         <li>Mean Deviation</li>
         <li>Median</li>
         <li>Median Deviation</li>
         <li>Minimum</li>
         <li>Mode</li>
         <li>N</li>
         <li>Percentile</li>
         <li>Population Standard Deviation</li>
         <li>Population Variance</li>
         <li>Power Deviation</li>
         <li>Product</li>
         <li>Quantile</li>
         <li>Quartile Deviation</li>
         <li>Quartiles</li>
         <li>Quartile Skewness</li>
         <li>Random Sample</li>
         <li>Range</li>
         <li>Root Mean Square</li>
         <li>Sample Standard Deviation</li>
         <li>Sample Variance</li>
         <li>Shuffle</li>
         <li>Skewness</li>
         <li>Standard Error</li>
         <li>Sum</li>
         <li>Sum of Squares</li>
      </ul>
   </div>
</div>
