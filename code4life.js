'use strict'
/* global readline:false */
/* global print:false */
/* global printErr:false */
/**
 * Bring data on patient samples from the diagnosis machine to the laboratory with enough molecules to produce medicine!
 **/
/**
 * Global Variables
 */
let player
let enemy
let samples
let storage
const projects = []

const drPym = new FSMRobot()
/**
 * Science Project
 */
const projectCount = parseInt(readline())
for (let i = 0; i < projectCount; i++) {
  let inputs = readline().split(' ').map(parseInt)
  projects.push(inputs)
}

/**
 * Game Loop
 */
while (true) {
  /**
   * Read Robot DATA
   */
  player = new RobotData(readline())
  enemy = new RobotData(readline())
  /**
   * Molecules availables
   */
  storage = readline().split(' ').map(parseInt)
  /**
   * Samples availables
   */
  const sampleCount = parseInt(readline())
  samples = []
  for (let i = 0; i < sampleCount; i++) {
    samples.push(new SampleData(readline()))
  }
  const command = drPym.execute()
  print(command)
}

function RobotData (data) {
  const inputs = data.split(' ')
  this.target = inputs[0]
  this.eta = parseInt(inputs[1])
  this.score = parseInt(inputs[2])
  this.storage = inputs.slice(3, 8).map(parseInt) // [A, B, C, D, E]
  this.expertise = inputs.slice(8, 13).map(parseInt) // [A, B, C, D, E]
}
function SampleData (data) {
  const inputs = data.split(' ')
  this.sampleId = parseInt(inputs[0])
  this.carriedBy = parseInt(inputs[1])
  this.rank = parseInt(inputs[2])
  this.expertiseGain = parseInt(inputs[3])
  this.health = parseInt(inputs[4])
  this.cost = parseInt(inputs.slice(5, 10).map(parseInt)) // [A, B, C, D, E]
}
function FSMRobot () {
  let items = 0
  let molecules = 0
  let currentState = {
    run: function () {
      return 'GOTO SAMPLES'
    },
    checkTransition: function (fsm) {
      if (player.eta === 1) {
        return player.target
      }
    }
  }
  const states = {
    'MOVE': {
      run: function () {},
      checkTransition: function () {}
    },
    'SAMPLES': {
      run: function () {
        return 'WAIT'
      },
      checkTransition: function () {}
    },
    'DIAGNOSIS': {
      run: function () {
        return 'WAIT'
      },
      checkTransition: function () {}
    },
    'MOLECULES': {
      run: function () {
        return 'WAIT'
      },
      checkTransition: function () {}
    },
    'LABORATORY': {
      run: function () {
        return 'WAIT'
      },
      checkTransition: function () {}
    }
  }
  this.execute = function () {
    const command = currentState.run()
    const nextState = currentState.checkTransition()
    if (nextState) {
      currentState = states[nextState]
    }
    return command
  }
}
