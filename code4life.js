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
  storage = readline().split(' ').map(i => parseInt(i))
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
  printErr(data)
  const inputs = data.split(' ')
  this.target = inputs[0]
  this.eta = parseInt(inputs[1])
  this.score = parseInt(inputs[2])
  this.storage = inputs.slice(3, 8).map(i => parseInt(i)) // [A, B, C, D, E]
  this.expertise = inputs.slice(8, 13).map(i => parseInt(i)) // [A, B, C, D, E]
}
function SampleData (data) {
  printErr(data)
  const inputs = data.split(' ')
  this.sampleId = parseInt(inputs[0])
  this.carriedBy = parseInt(inputs[1])
  this.rank = parseInt(inputs[2])
  this.expertiseGain = inputs[3]
  this.health = parseInt(inputs[4])
  this.cost = inputs.slice(5, 10).map(i => parseInt(i)) // [A, B, C, D, E]
  this.total = 0
  this.current = 0
}
function FSMRobot () {
  let target = 'SAMPLES'
  let items = 0
  let tester = []
  let molecules = 0
  let currentState = {
    run: function () {
      return 'GOTO SAMPLES'
    },
    checkTransition: function () {
      return 'MOVE'
    }
  }
  const states = {
    'MOVE': {
      run: function () {
        if (player.eta === 2) {
          switch (player.target) {
            case 'DIAGNOSIS':
              tester = samples.filter(s => s.carriedBy === 0 && s.health < 0)
              break
            case 'MOLECULES':
              tester = samples.filter(s => s.carriedBy === 0 &&
                s.cost.every((c, i) => c - player.expertise[i] <= 5))
              tester.forEach(s => {
                s.cost.forEach((c, i) => {
                  s.cost[i] = (c - player.expertise[i]) < 0 ? 0 : c - player.expertise[i]
                  s.total += s.cost[i]
                })
              })
              molecules = player.storage.reduce((t, c) => c + t, 0)
              break
            case 'LABORATORY':
              tester = samples.filter(s => s.carriedBy === 0 &&
                s.cost.every((c, i) => c - player.expertise[i] <= player.storage[i]))
              tester = tester.filter(s => s.cost.every((c, i) => {
                if (player.storage[i] >= c - player.expertise[i]) {
                  player.storage[i] -= c - player.expertise[i]
                  return true
                }
                return false
              }))
              break
            default:
              tester = samples.filter(s => s.carriedBy === 0)
          }
        }
        return `GOTO ${target}`
      },
      checkTransition: function () {
        if (player.eta === 1) {
          return player.target
        }
      }
    },
    'SAMPLES': {
      run: function () {
        let command = 'GOTO DIAGNOSIS'
        if (items < 3) {
          items++
          command = 'CONNECT 2'
        }
        return command
      },
      checkTransition: function () {
        if (items === 3) {
          target = 'DIAGNOSIS'
          return 'MOVE'
        }
      }
    },
    'DIAGNOSIS': {
      run: function () {
        let command = 'GOTO MOLECULES'
        if (tester.length > 0) {
          const undiagnosed = tester.shift()
          command = `CONNECT ${undiagnosed.sampleId}`
        }
        return command
      },
      checkTransition: function () {
        if (tester.length === 0) {
          target = 'MOLECULES'
          return 'MOVE'
        }
      }
    },
    'MOLECULES': {
      run: function () {
        let command = 'GOTO LABORATORY'
        for (let i = 0; i < tester.length && molecules < 10; i++) {
          printErr(tester[i].sampleId, tester[i].current, tester[i].total, tester[i].cost)
          let molecule = 64
          const completed = tester[i].cost.every((c, i) => {
            molecule++
            return c <= player.storage[i]
          })
          if (completed === false) {
            if (storage[molecule - 65] > 0) {
              tester[i].current++
              molecules++
              command = `CONNECT ${String.fromCharCode(molecule)}`
            } else {
              command = 'WAIT'
            }
            break
          }
        }
        return command
      },
      checkTransition: function () {
        // const owned = samples.filter(s => s.carriedBy === 0)
        if (tester.length > 0 && tester[0].total === tester[0].current) {
          target = 'LABORATORY'
          return 'MOVE'
        }
        if (molecules === 10 || tester.length === 0) {
          target = 'LABORATORY'
          return 'MOVE'
        }
      }
    },
    'LABORATORY': {
      run: function () {
        let command = 'GOTO SAMPLES'
        if (tester.length > 0) {
          molecules -= tester[0].total
          command = `CONNECT ${tester[0].sampleId}`
          tester.shift()
        }
        return command
      },
      checkTransition: function () {
        if (tester.length === 0) {
          const owned = samples.filter(s => s.carriedBy === 0 &&
            s.cost.every((c, i) => c - player.expertise[i] <= 5))
          if (owned.length > 0) {
            target = 'MOLECULES'
          } else {
            target = 'SAMPLES'
          }
          return 'MOVE'
        }
      }
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
