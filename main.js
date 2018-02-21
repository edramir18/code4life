'use strict'
// const RobotData = require('./robotdata')
// const Sample = require('./sample')
// const conf = require('./configuration')
const FSMRobot = require('./fsmrobot')

const drpym = new FSMRobot(0)
console.log(drpym.execute())
console.log(drpym.debug())
