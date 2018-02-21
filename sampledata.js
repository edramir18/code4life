'use strict'
// Copy from here
const SampleData = function (id) {
  this.sampleId = id
  this.carriedBy = 0
  this.rank = 0
  this.expertiseGain = ''
  this.health = 0
  this.cost = [0, 0, 0, 0, 0] // [A, B, C, D, E]
  this.ratio = 0
  this.total = 0
}
// Copy until here
module.exports = SampleData
