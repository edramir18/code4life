'use strict';
/* global readline:false */
/* global print:false */
/**
 * Bring data on patient samples from the diagnosis machine to the laboratory with enough molecules to produce medicine!
 **/
let projectCount = parseInt(readline());
for (let i = 0; i < projectCount; i++) {
let inputs = readline().split(' ');
let a = parseInt(inputs[0]);
let b = parseInt(inputs[1]);
let c = parseInt(inputs[2]);
let d = parseInt(inputs[3]);
let e = parseInt(inputs[4]);
}
const skynet = new FSM();
const player = new Robot(0);
const enemy = new Robot(1);
let maxID = 0;
// game loop
while (true) {  
    for (let i = 0; i < 2; i++) {
      const robot = i === 0 ? player : enemy;
      const inputs = readline().split(' ');
      robot.target = inputs[0];
      robot.eta = parseInt(inputs[1]);
      robot.score = parseInt(inputs[2]);
      robot.storage[0] = parseInt(inputs[3]);
      robot.storage[1] = parseInt(inputs[4]);
      robot.storage[2] = parseInt(inputs[5]);
      robot.storage[3] = parseInt(inputs[6]);
      robot.storage[4] = parseInt(inputs[7]);
      robot.expertiseA = parseInt(inputs[8]);
      robot.expertiseB = parseInt(inputs[9]);
      robot.expertiseC = parseInt(inputs[10]);
      robot.expertiseD = parseInt(inputs[11]);
      robot.expertiseE = parseInt(inputs[12]);
    }
    
    let inputs = readline().split(' ');
    let availableA = parseInt(inputs[0]);
    let availableB = parseInt(inputs[1]);
    let availableC = parseInt(inputs[2]);
    let availableD = parseInt(inputs[3]);
    let availableE = parseInt(inputs[4]);
    let sampleCount = parseInt(readline());
    const samples = [];
    for (let i = 0; i < sampleCount; i++) {
      const inputs = readline().split(' ');
      const sample = new Sample(parseInt(inputs[0]));
      sample.carriedBy = parseInt(inputs[1]);
      sample.rank = parseInt(inputs[2]);
      sample.expertiseGain = inputs[3];
      sample.health = parseInt(inputs[4]);
      sample.cost[0] = parseInt(inputs[5]);
      sample.cost[1] = parseInt(inputs[6]);
      sample.cost[2] = parseInt(inputs[7]);
      sample.cost[3] = parseInt(inputs[8]);
      sample.cost[4] = parseInt(inputs[9]);
      sample.total = sample.cost.reduce((t, c) => t + c, 0)
      sample.ratio = sample.health / sample.total;
      samples.push(sample);
      if (sample.sampleId > maxID) maxID = sample.sampleId
    }
    
    // Write an action using print()
    // To debug: printErr('Debug messages...');
    print(skynet.run(player, enemy, samples));
    
}

  /*
  * Robot Class
  *
  */
function Robot(id) {
  this.id = id;
  this.target = '';
  this.eta = 0;
  this.score = 0;
  this.storage = [0, 0, 0, 0, 0]; // [A, B, C, D, E]
  this.expertiseA = 0;
  this.expertiseB = 0;
  this.expertiseC = 0;
  this.expertiseD = 0;
  this.expertiseE = 0;
  this.checkMolecules= function (sample) {
    return sample.cost.every((c, i) => c<=this.storage[i]);
  };
}
function Sample(id) {
  this.sampleId = id;
  this.carriedBy = 0;
  this.rank = 0;
  this.expertiseGain = '';
  this.health = 0;
  this.cost = [0, 0, 0, 0, 0]; // [A, B, C, D, E]
  this.ratio = 0;
  this.total = 0;
  
}
function FSM (){
    this.target = '';
    this.data = [];
    this.lastID = -1;
    this.research = []
    this.start = function(player, enemy, samples) {
        this.target = 'SAMPLES';
        this.run = this.moving;
        return `GOTO SAMPLES`;
    };
    this. moving = function (player, enemy, samples) {
      if(player.target === this.target) {
          let targetState;
          switch(this.target) {
            case 'SAMPLES':
                  this.run = this.samples;
                  break;
            case 'DIAGNOSIS':
                  this.run = this.diagnosis;
                  break;
            case 'MOLECULES':
                  this.run = this.molecules;
                  break;    
            case 'LABORATORY':
                  this.run = this.laboratory;
                  break;
          }
          return this.run(player, enemy, samples);
      } else {
          return `GOTO ${this.target}`;
      }
    };
    this.samples = function(player, enemy, samples) {
        const owned = samples.filter(s => s.carriedBy === 0)
        if(this.research.length === 0) {
            this.research.push(2)
            return 'CONNECT 2';
        } else {
            this.research[0]= owned[0].sampleId
            this.run = this.moving;
            this.target = 'DIAGNOSIS';
            return 'GOTO DIAGNOSIS';
        }
    };
    this.diagnosis = function (player, enemy, samples) {
        if(this.research.length > 0) {
            const id = this.research.shift();
            this.lastID = id;
            return `CONNECT ${id}`;
        }
        /*if(this.lastID >= 0) {
            
        }*/
        const last = this.lastID;
        this.lastID = -1;
        this.run = this.moving;
        this.target = 'MOLECULES';
        return 'GOTO MOLECULES';
      /*
      const owned = samples.filter(s => s.carriedBy === 0);
      let frees = samples.filter(s => s.carriedBy === -1 && s.total <= 10);
      if(!owned || owned.length < 1) {
        const max = frees.reduce((obj, s) => s.ratio > obj.ratio ? s : obj, {ratio:0});
        const id = max.sampleId;
        this.data.push(max);
        return `CONNECT ${id}`;
      } else {
        this.run = this.moving;
        this.target = 'MOLECULES';
        return 'GOTO MOLECULES';
      }*/
      
    };
    this.molecules = function (player, enemy, samples) {
      let owned = samples.filter(s => s.carriedBy === 0);
      let molecule = 64;
      let total = 0;
      let move = false;
      function checkMolecule(c, i) {
          molecule++;
          total++;
          return c === player.storage[i];
      }
      for(let i=0; i< owned.length; i++) {
          molecule = 64;
          move = owned[i].cost.every(checkMolecule) || move;
          if(!move || total === 10) {
              break;
          }
      }
      if(move) {
        this.run = this.moving;
        this.target = 'LABORATORY';
        return 'GOTO LABORATORY';
      } else {
          return `CONNECT ${String.fromCharCode(molecule)}`;
      }
    };
    this.laboratory = function (player, enemy, samples) {
        let owned = samples.filter(s => s.carriedBy === 0);
      if(owned && owned.length > 0) {
          if(player.checkMolecules(owned[0])) {
            const sample  = owned.shift();
            return `CONNECT ${sample.sampleId}`;        
          } else {
            this.run = this.moving;
            this.target = 'MOLECULES';
            return 'GOTO MOLECULES';  
          }
      } else {
          this.run = this.moving;
          this.target = 'SAMPLES';
          return 'GOTO SAMPLES'; 
      }
    };
    this.run = this.start;
}
  