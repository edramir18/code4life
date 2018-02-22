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
header('Round 0', '#', 30)
console.log(drpym.debug())
console.log(lex.debug())
const id = setInterval(main, 500)
let iter = 0
const maxIteration = 20

function main () {
  header(`Round ${++iter}`, '#', 30)
  if (iter === maxIteration) clearInterval(id)
  header(`Player`, '-', 30)
  let clons = samples.map(s => s.clone())
  console.time('execute')
  let pCommand = drpym.execute(player, enemy, clons)
  console.timeEnd('execute')
  console.log(pCommand)
  execute(pCommand, player)
  console.log(drpym.debug())
  drpym.items.forEach(s => console.log(s.debug()))

  header(`Enemy`, '-', 30)
  clons = samples.map(s => s.clone())
  console.time('execute')
  let eCommand = lex.execute(enemy, player, clons)
  console.timeEnd('execute')
  console.log(eCommand)
  execute(eCommand, enemy)
  console.log(lex.debug())
  lex.items.forEach(s => console.log(s.debug()))
  header(`Samples`, '-', 30)
  samples.forEach(s => console.log(s.debug()))
}

function execute (command, data) {
  let [prefix, suffix] = command.split(' ')
  switch (prefix) {
    case 'GOTO':
      movePlayer(suffix, data)
      break
    case 'CONNECT':
      if (data.target === 'SAMPLES') {
        samples.push(generateSample(Number(suffix), data))
      } else if (data.target === 'DIAGNOSIS') {
        evaluateSample(Number(suffix), data)
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
  return new SampleData(++maxID, player.id, rank)
}

function evaluateSample (id, player) {
  const sample = samples.find(s => s.sampleId === id)
  if (sample.health < 0) {
    sample.health = randomMinMax(1, 10)
  } else if (sample.carriedBy < 0) {
    sample.carriedBy = player.id
  } else {
    sample.carriedBy = -1
  }
}

function randomMinMax (min, max) {
  return min + random(max - min)
}

function random (n) {
  return Math.floor(Math.random() * n)
}

function header (msg, filler, width) {
  const n = Math.floor((width - msg.length - 2) / 2)
  console.log(`${filler.repeat(n)} ${msg} ${filler.repeat(width - n)}`)
}
