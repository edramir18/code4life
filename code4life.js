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
<<<<<<< HEAD
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
=======
  let currentState = new MoveRobot(target)
  const states = {
    'MOVE': function () {
      return new MoveRobot(target)
    },
    'SAMPLES': function () {
      return new SamplesStation()
    },
    'DIAGNOSIS': function () {
      return new DiagnosisStation()
    },
    'MOLECULES': function () {
      return new MoleculesStation()
    },
    'LABORATORY': function () {
      return new LaboratoryStation()
>>>>>>> 7d6326899ea1f34746ffe2851b239d7067acf279
    }
  }
  this.execute = function () {
    const command = currentState.run()
    const nextState = currentState.checkTransition()
    if (nextState) {
      const destination = currentState.nextState()
      if (currentState.name === 'MOVE') {
        currentState = states[destination]()
      } else {
        target = destination
        currentState = states.MOVE()
      }
    }
    return command
  }
}
/**
 * Move State for FSM
 */
function MoveRobot (destination) {
  const command = `GOTO ${destination}`
  this.name = 'MOVE'
  this.run = function () {
    return command
  }
  this.checkTransition = function () {
    return player.eta === 1
  }
  this.nextState = function () {
    return player.target
  }
}
/**
 * Sample State for FSM
 */
function SamplesStation () {
  this.name = 'SAMPLES'
  const owned = samples.filter(s => s.carriedBy === 0)
  let items = 3 - owned.length
  const expertiseAvg = player.expertise.reduce((t, e) => t + e, 0) / 5
  this.run = function () {
    if (items === 0) return 'GOTO DIAGNOSIS'
    let rank = 1
    if (expertiseAvg > 1.5 && expertiseAvg < 3) {
      rank = 2
    } else if (expertiseAvg >= 3) {
      rank = 3
    }
    items--
    return `CONNECT ${rank}`
  }
  this.checkTransition = function () {
    return items === 0
  }
  this.nextState = function () {
    return 'DIAGNOSIS'
  }
}
/**
 * Diagnosis State for FSM
 */
function DiagnosisStation () {
  this.name = 'DIAGNOSIS'
  const owned = samples.filter(s => s.carriedBy === 0 && s.health < 0)
  this.run = function () {
    if (owned.length === 0) return 'GOTO MOLECULES'
    const trial = owned.shift()
    return `CONNECT ${trial.sampleId}`
  }
  this.checkTransition = function () {
    return owned.length === 0
  }
  this.nextState = function () {
    return 'MOLECULES'
  }
}
/**
 * Molecules State for FSM
 */
function MoleculesStation () {
  this.name = 'MOLECULES'
  const owned = samples.filter(s => s.carriedBy === 0 && s.health > 0)
  owned.forEach(s => {
    s.total = 0
    s.cost.forEach((c, i) => {
      s.cost[i] = (c - player.expertise[i]) > 0 ? (c - player.expertise[i]) : 0
      s.total += s.cost[i]
    })
  })
  const trials = owned.filter(s => s.total <= 10 && s.cost.every(c => c <= 5))
  const molecules = {
    singles: [
      {index: 0, value: 0},
      {index: 1, value: 0},
      {index: 2, value: 0},
      {index: 3, value: 0},
      {index: 4, value: 0}
    ],
    total: 0
  }
  if (trials.length > 0) {
    trials.sort((a, b) => a.total - b.total)
    const moleculeTotal = [0, 0, 0, 0, 0]
    const maxStorage = 10 - player.storage.reduce((t, c) => t + c, 0)
    while (trials.length > 0 && molecules.total + trials[0].total <= maxStorage) {
      let test = trials.shift()
      if (moleculeTotal.every((c, i) => c + test.cost[i] <= 5)) {
        moleculeTotal.forEach((c, i) => {
          const moleculeRequired = (test.cost[i] - player.storage[i]) > 0
            ? (test.cost[i] - player.storage[i]) : 0
          moleculeTotal[i] += moleculeRequired
          molecules.total += moleculeRequired
        })
      }
    }
    moleculeTotal.forEach((m, i) => {
      molecules.singles[i].value = m
    })
    molecules.singles.sort((a, b) => b.value - a.value)
    printErr(molecules.singles[0].value, molecules.singles[1].value, molecules.singles[2].value,
      molecules.singles[3].value, molecules.singles[4].value)
  }
  this.run = function () {
    let command = 'WAIT'
    if (molecules.total > 0) {
      for (let i = 0; i < molecules.singles.length; i++) {
        if (molecules.singles[i].value > 0 && storage[molecules.singles[i].index] > 0) {
          command = `CONNECT ${String.fromCharCode(molecules.singles[i].index + 65)}`
          molecules.singles[i].value--
          molecules.total--
          break
        }
      }
    }
    return command
  }
  this.checkTransition = function () {
    printErr(molecules.singles[0].value, molecules.singles[1].value, molecules.singles[2].value,
      molecules.singles[3].value, molecules.singles[4].value, molecules.total)
    return molecules.total === 0
  }
  this.nextState = function () {
    return 'LABORATORY'
  }
}
/**
 * Laboratory State for FSM
 */
function LaboratoryStation () {
  this.name = 'MOLECULES'
  const owned = samples.filter(s => s.carriedBy === 0 && s.health > 0)
  owned.forEach(s => {
    s.total = 0
    s.cost.forEach((c, i) => {
      s.cost[i] = (c - player.expertise[i]) > 0 ? (c - player.expertise[i]) : 0
      s.total += s.cost[i]
    })
  })
  const trials = owned.filter(s => s.total <= 10 && s.cost.every(c => c <= 5))
  const completed = []
  let incompleted = trials.length
  if (trials.length > 0) {
    trials.sort((a, b) => a.total - b.total)
    let maxStorage = player.storage.reduce((t, c) => t + c, 0)
    while (trials.length > 0 && maxStorage > 0) {
      let test = trials.shift()
      if (test.cost.every((c, i) => player.storage[i] - c >= 0)) {
        test.cost.forEach((c, i) => {
          player.storage[i] -= c
          maxStorage -= c
        })
        completed.push(test)
        incompleted--
      }
    }
  }
  this.run = function () {
    let command = 'WAIT'
    if (completed.length > 0) {
      command = `CONNECT ${completed[0].sampleId}`
      completed.shift()
    }
    return command
  }
  this.checkTransition = function () {
    return completed.length === 0
  }
  this.nextState = function () {
    if (incompleted > 0) return 'MOLECULES'
    return 'SAMPLES'
  }
}
