'use strict'
/* global readline:false */
/* global print:false */
/**
 * Bring data on patient samples from the diagnosis machine to the laboratory with enough molecules to produce medicine!
 **/

function readline() { return ''}
function print(msg) {}

/**
 * Global Variables
 */
const projects = []
let maxID = -1

/**
 * Science Project
 */
const projectCount = parseInt(readline())
for (let i = 0; i < projectCount; i++) {
  let inputs = readline().split(' ').map(parseInt)
  projects.push(inputs)  
}
const drpym = new FSMRobot()
const player = new RobotData(0)
const enemy = new RobotData(1)
/**
 * Game Loop
 */
while (true) {  
    for (let i = 0; i < 2; i++) {
      const robot = i === 0 ? player : enemy
      const inputs = readline().split(' ')
      robot.target = inputs[0]
      robot.eta = parseInt(inputs[1])
      robot.score = parseInt(inputs[2])
      robot.storage[0] = parseInt(inputs[3])
      robot.storage[1] = parseInt(inputs[4])
      robot.storage[2] = parseInt(inputs[5])
      robot.storage[3] = parseInt(inputs[6])
      robot.storage[4] = parseInt(inputs[7])
      robot.expertise[0] = parseInt(inputs[8])
      robot.expertise[1] = parseInt(inputs[9])
      robot.expertise[2] = parseInt(inputs[10])
      robot.expertise[3] = parseInt(inputs[11])
      robot.expertise[4] = parseInt(inputs[12])
    }
    
    let inputs = readline().split(' ')
    let availableA = parseInt(inputs[0])
    let availableB = parseInt(inputs[1])
    let availableC = parseInt(inputs[2])
    let availableD = parseInt(inputs[3])
    let availableE = parseInt(inputs[4])
    let sampleCount = parseInt(readline())
    const samples = []
    for (let i = 0; i < sampleCount; i++) {
      const inputs = readline().split(' ')
      const sample = new SampleData(parseInt(inputs[0]), 
        parseInt(inputs[1]), parseInt(inputs[2]))
      sample.expertiseGain = inputs[3]
      sample.health = parseInt(inputs[4])
      sample.cost[0] = parseInt(inputs[5])
      sample.cost[1] = parseInt(inputs[6])
      sample.cost[2] = parseInt(inputs[7])
      sample.cost[3] = parseInt(inputs[8])
      sample.cost[4] = parseInt(inputs[9])
      sample.total = sample.cost.reduce((t, c) => t + c, 0)
      sample.ratio = sample.health / sample.total
      samples.push(sample)
      // if(sample.health < 0) printErr(sample.sampleId, sample.carriedBy, sample.health, sample.cost)
      if (sample.sampleId > maxID) maxID = sample.sampleId
    }
    
    // Write an action using print()
    // To debug: printErr('Debug messages...')
    print(drpym.execute(player, enemy, samples))
    
}

function RobotData (id) {
  this.id = id
  this.target = 'STARTER'
  this.eta = 0
  this.score = 0
  this.storage = [0, 0, 0, 0, 0] // [A, B, C, D, E]
  this.expertise = [0, 0, 0, 0, 0] // [A, B, C, D, E]  
}
function SampleData (id, playerId, rank) {
  this.sampleId = id
  this.carriedBy = playerId
  this.rank = rank
  this.expertiseGain = ''
  this.health = 0
  this.cost = [0, 0, 0, 0, 0] // [A, B, C, D, E]
  this.ratio = 0
  this.total = 0
}
function FSMRobot (id) {
  this.data = new RobotData(id)
  this.items = []
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
        printErr(fsm.items.length, diagnosed.sampleId, diagnosed.health)
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
  