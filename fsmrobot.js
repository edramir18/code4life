'use strict'
const RobotData = require('./robotdata')
// Copy from here
const FSMRobot = function (id) {
  this.data = new RobotData(id)
  this.debug = function () {
    return this.data.debug()
  }
  this.action = {
    run: function (fsm, player, enemy, samples) {
      // fsm.data.target = 'SAMPLES'
      return 'GOTO SAMPLES'
    },
    validate: function (fsm, player, enemy, samples) {
      fsm.action = fsm.states['MOVING']
    }
  }
  this.execute = function (player, enemy, samples) {
    const command = this.action.run(this, player, enemy, samples)
    this.action.validate(this, player, enemy, samples)
    return command
  }
  this.states = {
    'MOVING': {
      run: function (fsm, player, enemy, samples) {
        return `GOTO ${player.target}`
      },
      validate: function (fsm, player, enemy, samples) {
        if (player.eta === 1) {
          fsm.data.target = player.target
          fsm.action = fsm.states[player.target]
        }
      }
    },
    'SAMPLES': {
      run: function (player, enemy, samples) {
        return `TO DO`
      },
      validate: function (player, enemy, samples) {
        if (player.eta === 1) {
          this.target = player.target
          this.action = this.samples[player.target]
        }
      }
    }
  }
}
// Copy until here
module.exports = FSMRobot
