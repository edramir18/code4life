'use strict'
// Copy from here
const RobotData = function (id) {
  this.id = id
  this.target = 'STARTER'
  this.eta = 0
  this.score = 0
  this.storage = [0, 0, 0, 0, 0] // [A, B, C, D, E]
  this.expertise = [0, 0, 0, 0, 0] // [A, B, C, D, E]
  this.debug = function () {
    return `${this.id} ${this.target} ${this.eta} ${this.score} ` +
    `[${this.storage}] [${this.expertise}]`
  }
}
// Copy until here
module.exports = RobotData
