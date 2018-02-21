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
for (let i = 0; i < 4; i++) {
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
      if (data.target === suffix) {
        --data.eta
      } else {
        data.eta = conf.routes[conf.locations[suffix] + conf.locations[data.target]] - 1
        data.target = suffix
      }
  }
}
