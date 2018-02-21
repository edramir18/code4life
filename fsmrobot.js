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
      run: function (fsm, player, enemy, samples) {
        return `GOTO DIAGNOSIS`
      },
      validate: function (fsm, player, enemy, samples) {
        fsm.action = fsm.states['MOVING']
      }
    },
    'DIAGNOSIS': {
      run: function (fsm, player, enemy, samples) {
        return `GOTO MOLECULES`
      },
      validate: function (fsm, player, enemy, samples) {
        fsm.action = fsm.states['MOVING']
      }
    },
    'MOLECULES': {
      run: function (fsm, player, enemy, samples) {
        return `GOTO LABORATORY`
      },
      validate: function (fsm, player, enemy, samples) {
        fsm.action = fsm.states['MOVING']
      }
    },
    'LABORATORY': {
      run: function (fsm, player, enemy, samples) {
        return `GOTO SAMPLES`
      },
      validate: function (fsm, player, enemy, samples) {
        fsm.action = fsm.states['MOVING']
      }
    }
  }
}
// Copy until here
module.exports = FSMRobot
