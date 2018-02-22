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
          return 'GOTO MOLECULES'
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
  this.sortItems = function () {
    const arr = [
      {
        item: this.items[0],
        exp: this.items[0].cost.reduce((t, c, i) => t + (c - this.data.expertise[i]), 0)
      },
      {
        item: this.items[1],
        exp: this.items[1].cost.reduce((t, c, i) => t + (c - this.data.expertise[i]), 0)
      },
      {
        item: this.items[2],
        exp: this.items[2].cost.reduce((t, c, i) => t + (c - this.data.expertise[i]), 0)
      }
    ]
    arr.sort((a, b) => a.exp - b.exp)
    if ((arr[0].exp + arr[1].exp + arr[2].exp) <= 10) {
      return arr.map(c => c.item)
    } else if ((arr[0].exp + arr[1].exp) <= 10) {
      return arr.map(c => c.item)
    } else if ((arr[0].exp + arr[1].exp) <= 10) {
      return [this.items[0], this.items[1], this.items[2]]
    } else if ((arr[0].exp + arr[1].exp) <= 10) {
    }
  }
}
// Copy until here
module.exports = FSMRobot
