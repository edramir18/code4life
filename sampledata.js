'use strict'
// Copy from here
const SampleData = function (id, playerId, rank) {
  this.sampleId = id
  this.carriedBy = playerId
  this.rank = rank
  this.expertiseGain = ''
  this.health = -1
  this.cost = [-1, -1, -1, -1, -1] // [A, B, C, D, E]
  this.ratio = 0
  this.total = 0
  this.debug = function () {
    return `${this.sampleId} ${this.carriedBy} ${this.rank} ${this.expertiseGain} ` +
      `${this.health} [${this.cost}]`
  }
}
// Copy until here
module.exports = SampleData
