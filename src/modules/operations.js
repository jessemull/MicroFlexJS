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
 * This module combines all math operator classes.
 * @module Operations
 * @author Jesse L. Mull
 * @version Updated February 17, 2016
 * @license Apache License 2.0
 * @see <a href="http://www.jessemull.com" target="_blank">http://www.jessemull.com</a><br>
 * @see <a href="mailto:hello@jessemull.com">hello@jessemull.com</a>
 */
module.exports = {
   Addition: require('../math/addition'),
   AND: require('../math/and'),
   Compliment: require('../math/compliment'),
   Decrement: require('../math/decrement'),
   Division: require('../math/division'),
   Increment: require('../math/increment'),
   LeftShift: require('../math/leftshift'),
   Modulus: require('../math/modulus'),
   Multiplication: require('../math/multiplication'),
   OR: require('../math/or'),
   RightShiftArithmetic: require('../math/rightshiftarithmetic'),
   RightShiftLogical: require('../math/rightshiftlogical'),
   Subtraction: require('../math/subtraction'),
   XOR: require('../math/xor')
}
