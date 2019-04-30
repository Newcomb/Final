var asthmaP1 = d3.csv('asthma2017.csv')
var asthmaP2 = d3.csv('asthma2013.csv')
var fuelP = d3.csv('fuelUsage.csv')
var microsP = d3.csv('pollution2018.csv')
var microsP1 = d3.csv('pollution2013.csv')
var lungP = d3.csv('lung.csv')

Promise.all([asthmaP1,asthmaP2,fuelP,microsP,lungP,microsP1]).then(function(values){

  var asthma1 = values[0]
  var asthma2 = values[1]
  asthmaC = []
  asthma1.forEach(function(a){asthma2.forEach(function(d){if (a.Location == d.Location) {asthmaC.push({Location: a.Location, AsthmaRate: a.AsthmaRate-d.AsthmaRate})}})})
//console.log('Asthma Changes from 13-18',asthmaC)
  var fuel = values[2]
  var microsBig = values[3]
  var microsBig1 = values[5]
  var lung = values[4].map(function(d){return {Area: d.Area, CancerType: d.CancerType, Percent: d.CaseCount/d.Population}})
  console.log('lung cancer rates',lung)
  dataCrunch(asthma1,asthmaC, fuel,lung,microsBig,microsBig1)

}
)


var dataCrunch = function(asthma,asthmaC ,fuel, lung, microsBig,microsBig1){

//  console.log(microsBig)
var pollution =   []
microsBig.forEach(function(d){microsBig1.forEach(function(a){if (d.StateName == a.StateName) {pollution.push({StateName: d.StateName, FirstVal:parseFloat(d.Value),Value: d.Value-a.Value})}})})
console.log('Pollution in 13 and change in 18', pollution)
var pollutionC = []
var pollution1 = []
pollution.forEach(function(d){
  if (d.FirstVal >= 7.9){pollution1.push({State: d.StateName, Value: parseFloat(d.Value)})}
})
//  console.log(microSplit1)
var pollution2 = []
pollution.forEach(function(d){
  if (d.FirstVal < 6.8 || d.FirstVal >= 7.9){}
  else{pollution2.push({State: d.StateName, Value: parseFloat(d.Value)})}
})
//console.log(microSplit2)
var pollution3 = []
pollution.forEach(function(d){
  if (d.FirstVal <= 6.7){pollution3.push({State: d.StateName, Value: parseFloat(d.Value)})}
})
//console.log(microSplit3)
pollutionC.push(pollution1,pollution2,pollution3)
console.log('pollution change for all states from 13-18',pollutionC)

  var micros =[]
  var microSplit1 = []
  microsBig.forEach(function(d){
    if (d.Value >= 7.9){microSplit1.push({State: d.StateName, Value: parseFloat(d.Value)})}
  })
//  console.log(microSplit1)
  var microSplit2 = []
  microsBig.forEach(function(d){
    if (d.Value < 6.8 || d.Value >= 7.9){}
    else{microSplit2.push({State: d.StateName, Value: parseFloat(d.Value)})}
  })
  //console.log(microSplit2)
  var microSplit3 = []
  microsBig.forEach(function(d){
    if (d.Value <= 6.7){microSplit3.push({State: d.StateName, Value: parseFloat(d.Value)})}
  })
//console.log(microSplit3)
micros.push(microSplit1,microSplit2,microSplit3)
//console.log(micros)
micros.forEach(function(d){d.forEach(function(v){lung.forEach(function(l){
  if (v.State == l.Area){v.LungCancer = l.Percent}
})})})
//console.log(micros)
micros.forEach(function(d){d.forEach(function(v){fuel.forEach(function(f){
  if (v.State == f.State){v.Coal = parseFloat(f.Coal);v.NaturalGas = parseFloat(f.NaturalGas);v.Petroleum = parseFloat(f.Petroleum)}
})})})
//console.log(micros)
micros.forEach(function(d){d.forEach(function(v){asthma.forEach(function(a){
  if (v.State == a.Location){v.Asthma = parseFloat(a.AsthmaRate)}
})})})
console.log('Data for all states in 18 in their split',micros)


total = 0
tally = 0
pollution= []
var pollution = micros.map(function(d){return d.map(function(l){return (l.Value)})})
var pollutionA = pollution.map(function(d){return d3.median(d)})
var pollutionCN = pollutionC.map(function(d){return d.map(function(l){return (l.Value)})})
var pollutionCA = pollutionCN.map(function(d){return d3.median(d)})
console.log('pollution change over time',pollutionCA)
var asthma = micros.map(function(d){return d.map(function(l){return (l.Asthma)})})
var asthmaA = asthma.map(function(d){return d3.median(d)})
console.log('asthma median per split',asthmaA)
var coal = micros.map(function(d){return d.map(function(l){return (l.Coal)})})
var coalA = coal.map(function(d){return d3.median(d)})
console.log('median coal used per split',coalA)
var natGas = micros.map(function(d){return d.map(function(l){return (l.NaturalGas)})})
var natGasA = natGas.map(function(d){return d3.median(d)})
console.log('median natural gas used per split',natGasA)
var petroleum = micros.map(function(d){return d.map(function(l){return (l.Petroleum)})})
var petroleumA = petroleum.map(function(d){return d3.median(d)})
console.log('median petroleum used per split',petroleumA)
var lung = micros.map(function(d){return d.map(function(l){return (l.LungCancer)})})
var lungA = lung.map(function(d){return d3.median(d)})
console.log('median percent lung cancer per split',lungA)

var set = [7.9,6.8,6.7]
var totalSplit = micros.map(function(d,i){
                              return [{Set: i},
                              {Axis:'Coal',Value:coalA[i]},
                              {Axis:'NatGas', Value:natGasA[i]},
                              {Axis:'Petroleum', Value:petroleumA[i]},
                              {Axis:'Asthma', Value:asthmaA[i]},
                              {Axis:'LungCancer', Value:lungA[i]},
                              {Axis:'PollutionRating',Value:set[i]}]})

console.log(totalSplit)
}



var drawRadar = function(data){
  var screen={
  width : 800,
  height : 800
};


var margins = {
  top:10,
  bottom:200,
  left:10,
  right:100
};
var height = screen.width - margins.top - margins.bottom;
var width = screen.width - margins.left - margins.right;

var svg = d3.select('svg')
          .attr('width',screen.width)
          .attr('height',screen.height);

var plot = svg.append('g')
            .attr('width',width)
            .attr('height',height);

}
