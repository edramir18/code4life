'use strict'
const RobotData = require('./robotdata')
// const Sample = require('./sample')
const conf = require('./configuration')
const FSMRobot = require('./fsmrobot')

const drpym = new FSMRobot(0)
const lex = new FSMRobot(1)
const player = new RobotData(0)
const enemy = new RobotData(1)
console.log(drpym.debug())
console.log(lex.debug())
for (let i = 0; i < 20; i++) {
  console.time('execute')
  let pCommand = drpym.execute(player, enemy, [])
  console.timeEnd('execute')
  console.time('execute')
  let eCommand = lex.execute(enemy, player, [])
  console.timeEnd('execute')

  execute(pCommand, player)
  execute(eCommand, enemy)
  console.log(pCommand)
  console.log(eCommand)
  console.log(drpym.debug())
  console.log(lex.debug())
  console.log(`${'#'.repeat(10)} Round ${i + 1} ${'#'.repeat(10)}`)
}

function execute (command, data) {
  let [prefix, suffix] = command.split(' ')
  switch (prefix) {
    case 'GOTO':
      movePlayer(suffix, data)
      break
    case 'CONNECT':
      if (data.target === 'SAMPLES') {
        generateSample(suffix, data)
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

}
