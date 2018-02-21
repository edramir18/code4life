'use strict'
const RobotData = require('./robotdata')
const FSMRobot = function (id) {
  this.data = new RobotData(id)
  this.debug = function () {
    return this.data.debug()
  }
  this.action = {
    run: function (player, enemy, samples) {

    },
    validate: function (player, enemy, samples) {

    }
  }
  this.execute = function (player, enemy, samples) {
    const command = this.action.run(player, enemy, samples)
    this.action.validate()
    return command
  }
  this.moving = {
    run: function (player, enemy, samples) {

    },
    validate: function (player, enemy, samples) {

    }
  }
}

module.exports = FSMRobot
