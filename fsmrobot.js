'use strict'
const RobotData = require('./robotdata')
// Copy from here
const FSMRobot = function (id) {
  this.data = new RobotData(id)
  this.items = []
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
        const owned = samples.filter(s => s.carriedBy === player.id)
        fsm.items = owned
        if (!owned || owned.length < 3) {
          return 'CONNECT 2'
        }
        return 'GOTO DIAGNOSIS'
      },
      validate: function (fsm, player, enemy, samples) {
        if (fsm.items.length === 3) {
          fsm.action = fsm.states['MOVING']
        }
      }
    },
    'DIAGNOSIS': {
      run: function (fsm, player, enemy, samples) {
        if (fsm.items.length === 0) return 'GOTO SAMPLES'
        const diagnosed = samples.find(s => s.sampleId === fsm.items[0].sampleId)
        if (diagnosed.health < 0) {
          fsm.items.shift()
          diagnosed.health = 0
          fsm.items.push(diagnosed)
          return `CONNECT ${diagnosed.sampleId}`
        } else {
          fsm.items = samples.filter(s => s.carriedBy === player.id)
          return `GOTO MOLECULES`
        }
      },
      validate: function (fsm, player, enemy, samples) {
        if (fsm.items.length === 0 || fsm.items.every(s => s.health > 0)) {
          fsm.action = fsm.states['MOVING']
        }
      }
    },
    'MOLECULES': {
      run: function (fsm, player, enemy, samples) {
        return `GOTO LABORATORY`
      },
      validate: function (fsm, player, enemy, samples) {
        if (fsm.items.length === 0) {
          fsm.action = fsm.states['MOVING']
        }
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
