'use strict'
const RobotData = require('./robotdata')
const SampleData = require('./sampledata')
const conf = require('./configuration')
const FSMRobot = require('./fsmrobot')

const drpym = new FSMRobot(0)
const lex = new FSMRobot(1)
const player = new RobotData(0)
const enemy = new RobotData(1)
const samples = []
let maxID = -1
console.log(drpym.debug())
console.log(lex.debug())

const id = setInterval(main, 1000)
let iter = 0
const maxIteration = 10

function main () {
  if (++iter === maxIteration) clearInterval(id)
  console.time('execute')
  let pCommand = drpym.execute(player, enemy, [])
  console.timeEnd('execute')
  execute(pCommand, player)
  console.time('execute')
  let eCommand = lex.execute(enemy, player, [])
  console.timeEnd('execute')
  execute(eCommand, enemy)
  console.log(pCommand)
  console.log(eCommand)
  console.log(drpym.debug())
  console.log(lex.debug())
  samples.forEach(s => console.log(s.debug()))
  console.log(`${'#'.repeat(10)} Round ${iter} ${'#'.repeat(10)}`)
}

function execute (command, data) {
  let [prefix, suffix] = command.split(' ')
  switch (prefix) {
    case 'GOTO':
      movePlayer(suffix, data)
      break
    case 'CONNECT':
      if (data.target === 'SAMPLES') {
        samples.push(generateSample(suffix, data))
      } else if (data.target === 'DIAGNOSIS') {

      } else if (data.target === 'MOLECULES') {

      } else if (data.target === 'LABORATORY') {

      }
      break
  }
}

function movePlayer (target, player) {
  if (player.target === target) {
    --player.eta
  } else {
    player.eta = conf.routes[conf.locations[target] + conf.locations[player.target]] - 1
    player.target = target
  }
}

function generateSample (rank, player) {
  return new SampleData(player.id, ++maxID, rank)
}

function random (min, max) {
  return min + random(max - min)
}

function random (n) {
  return Math.floor(Math.random() * n)
}
