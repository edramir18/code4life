'use strict'
/* LOCATION
 * 0000 0 STARTER
 * 0001 1 SAMPLES
 * 0010 2 DIAGNOSIS
 * 0100 4 MOLECULES
 * 1000 8 LABORATORY
 */
const locations = {
  'STARTER': 0,
  'SAMPLES': 1,
  'DIAGNOSIS': 2,
  'MOLECULES': 4,
  'LABORATORY': 8
}
/* ROUTE COST
 * 0001  1 2
 * 0010  2 2
 * 0100  4 2
 * 1000  8 2
 * 0011  3 3
 * 0101  5 3
 * 1001  9 3
 * 0110  6 3
 * 1010 10 4
 * 1100 12 3
 */
const routes = {
  '1': 2,
  '2': 2,
  '4': 2,
  '8': 2,
  '3': 3,
  '5': 3,
  '9': 3,
  '6': 3,
  '10': 4,
  '12': 3
}
module.exports.routes = routes
module.exports.locations = locations
