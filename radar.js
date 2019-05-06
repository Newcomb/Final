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
  var d= dataCrunch(asthma1,asthmaC, fuel,lung,microsBig,microsBig1)
  drawRadar(d)
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
                              return [                {Axis:'Asthma Prevalence', Value:asthmaA[i],AdjustedValue:asthmaA[i]*10, TextValue: ""+(asthmaA[i]*100).toFixed(2)+"%"},
                              {Axis:'Coal Burned',Value:coalA[i], AdjustedValue:coalA[i]/500, TextValue:""+coalA[i]+" tn btu"},
                              {Axis:'Natural Gas Burned', Value:natGasA[i],AdjustedValue:natGasA[i]/900, TextValue: ""+natGasA[i]+" tn btu"},
                              {Axis:'Petroleum Burned', Value:petroleumA[i],AdjustedValue:petroleumA[i]/900, TextValue: ""+petroleumA[i]+" tn btu"},
                              {Axis:'Lung Cancer Prevalence', Value:lungA[i],AdjustedValue:(lungA[i]*1000), TextValue: ""+(lungA[i]*100).toFixed(3)+"%"},
                {Axis:'Asthma Prevalence', Value:asthmaA[i],AdjustedValue:asthmaA[i]*10, TextValue: ""+(asthmaA[i]*100).toFixed(2)+"%"},

                              //{Axis:'PollutionRating',Value:set[i],AdjustedValue:set[i]}
                            ]})

console.log('chart data',totalSplit)
return totalSplit
}



var drawRadar = function(data){


var allScale = [['100','180','180','2%','.02%'],['200','360','360','4%','.04%'],['300','540','540','6%','.06%'],
['400','720','720','8%','.08%'],['500','900','900','10%','.10%']]

  console.log(data);
  var screen={
  width : 1000,
  height : 1000
};


var margins = {
  top:10,
  bottom:200,
  left:10,
  right:100
};

var  colorScale = d3.scaleOrdinal(d3.schemeSet1)

var height = screen.width - margins.top - margins.bottom;
var width = screen.width - margins.left - margins.right;

var radius = 600/2-6

var fullCircle = 2 * Math.PI;

var dScale = d3.scaleLinear().domain([0,1]).range([0,radius])

var rScale = d3.scaleLinear().domain([0,5]).range([0,fullCircle])

var line = d3.lineRadial().angle(function(d,i){return rScale(i%5)})
                          .radius(function(d,i){return dScale(d.AdjustedValue)})
                          //.curve(d3.basisClosed)


var svg = d3.select('svg')
          .attr('width',screen.width)
          .attr('height',screen.height)
          .attr("transform", "translate(" + width /40 + "," + height /100+ ")");

console.log('slice',dScale.ticks(5).slice(1));

var circleG = svg.append('g').classed("r-axis",true);

var zAxis = circleG.append("g")
    .attr("class", "a axis")
  .selectAll("g")
    .data(data[0])
  .enter().append("g").attr("transform", "translate(" + width /2 + "," + height / 2 + ")")

  zAxis.append("line")
  .attr('y1',0)
  .attr('x1',0)
  .attr("x2", function(d, i){ return radius * Math.cos((fullCircle/5*i - Math.PI/2)); })
  .attr("y2", function(d, i){ return radius * Math.sin((fullCircle/5*i - Math.PI/2)); })
  .attr('stroke-dasharray',10)
    .attr('stroke','black')

var labels = zAxis.append("text")
.attr("x", function(d, i){if(i==0) {return (radius) * Math.cos((fullCircle/5*i - Math.PI/2))}
                          if (i==1){return (radius-350) * Math.cos((fullCircle/5*i - Math.PI/2))}
                        if (i==2){return (radius-450) * Math.cos((fullCircle/5*i - Math.PI/2))}
                      if (i==3){return (radius-150) * Math.cos((fullCircle/5*i - Math.PI/2))}
                    if (i==4){return (radius-150) * Math.cos((fullCircle/5*i - Math.PI/2))}
                  if (i==5){return (radius) * Math.cos((fullCircle/5*i - Math.PI/2))}})
.attr("y", function(d, i){if(i==0) {return (radius+50) * Math.sin((fullCircle/5*i - Math.PI/2))}
                          if (i==1){return (radius+800) * Math.sin((fullCircle/5*i - Math.PI/2))}
                        if (i==2){return (radius+150) * Math.sin((fullCircle/5*i - Math.PI/2))}
                      if (i==3){return (radius+150) * Math.sin((fullCircle/5*i - Math.PI/2))}
                    if (i==4){return (radius+800) * Math.sin((fullCircle/5*i - Math.PI/2))}
                  if (i==5){return (radius+50) * Math.sin((fullCircle/5*i - Math.PI/2))}})
.text(function(d,i){return d.Axis})    .attr('font-size','25px')
 .attr("transform", function(d,i){if (i==0){return "translate("+-80+")"}
              if (i==1){return "rotate("+70+")"}
            if (i==2){return "rotate("+-35+")"}
          if (i==3){return "rotate("+35+")"}
        if (i==4){return "rotate("+-70+")"}
      if (i==5){return "translate("+-80+")"}})





allScale.forEach(function(d,i){console.log(d,i)
      zAxis.append('text')
      .attr('x',function(db, ib){ return (radius/5 * (i+.8)) * Math.cos((fullCircle/5*ib - Math.PI/2)); })
      .attr('y',function(db, ib){ return (radius/5 * (i+.8)) * Math.sin((fullCircle/5*ib - Math.PI/2)); })
      .text(function(db,ib){return d[ib]})
      .attr('font-size','18px')
    })




var outerCircle = circleG.append('circle').attr('r',radius)
                          .attr("transform", "translate(" + width /2 + "," + height / 2+ ")")
                          .attr('stroke','black')
                          .attr('fill','none')          .attr('opacity',.6);

var legCircle1 = circleG.append('circle').attr('r',radius/5)
                          .attr("transform", "translate(" + width /2 + "," + height / 2 + ")")
                          .attr('stroke','black')
                          .attr('fill','none')
                          .attr('stroke-dasharray',10)          .attr('opacity',.6);

var legCircle2 = circleG.append('circle').attr('r',radius/5 *2)
                          .attr("transform", "translate(" + width /2 + "," + height /2+ ")")
                          .attr('stroke','black')
                          .attr('fill','none')
                          .attr('stroke-dasharray',10)          .attr('opacity',.6);

var legCircle3 = circleG.append('circle').attr('r',radius/5*3)
                      .attr("transform", "translate(" + width /2 + "," + height /2 + ")")
                      .attr('stroke','black')
                      .attr('fill','none')
                      .attr('stroke-dasharray',10)          .attr('opacity',.6);

var legCircle4 = circleG.append('circle').attr('r',radius/5*4)
                          .attr("transform", "translate(" + width /2 + "," + height / 2 + ")")
                          .attr('stroke','black')
                          .attr('fill','none')
                          .attr('stroke-dasharray',10)          .attr('opacity',.6);



var centerPoint = circleG.append('circle').attr('r',5)
                          .attr("transform", "translate(" + width /2 + "," + height / 2 + ")")
                          .attr('stroke','black')
                          .attr('fill','black');

var plot = svg.append('g')
            .attr('width',width)
            .attr('height',height)
            .attr("transform", "translate(" + width /2 + "," + height / 2 + ")");


data.forEach(function(d,i){
                  plot.append('path')
                  .datum(d)
                  .attr('opacity',.6)
                  .attr('fill',colorScale(i))
                  .attr('stroke','black')
                  .attr('d',line)})



var scales = svg.append("g")
    .attr("class", "a axis")
  .selectAll("g")
    .data(data[0])
  .enter().append("g").attr("transform", "translate(" + width /2+ "," + height / 2 + ")")


allScale.forEach(function(d,i){console.log(d,i)
      scales.append('text')
      .attr('x',function(db, ib){ return (radius/5 * (i+.8)) * Math.cos((fullCircle/5*ib - Math.PI/2)); })
      .attr('y',function(db, ib){ return (radius/5 * (i+.8)) * Math.sin((fullCircle/5*ib - Math.PI/2)); })
      .text(function(db,ib){return d[ib]})
      .attr('font-size','18px').attr('opacity',.4)
      .attr('pointer-events','none')
    })


    data.forEach(function(d,i){console.log(d,i)
        plot.selectAll('circle1').data(d).enter().append('circle')
          .attr('r',5)
          .attr('cx',function(db, ib){ return (radius * ((db.AdjustedValue)) * Math.cos((fullCircle/5*ib - Math.PI/2))) })
          .attr('cy',function(db, ib){ return (radius * ((db.AdjustedValue)) * Math.sin((fullCircle/5* ib - Math.PI/2))) })
          .attr('fill',function(){return colorScale(i)})
          .on('mouseover',function(db,ib){
var tooltipRec = plot.append('rect')
.attr('height',75)
.attr('width',100)
.style("opacity", 0)
.classed("tooltip",true)
.attr('fill','black')
.style("border", "solid")
.style("border-width", "2px")
.style("border-radius", "5px")
.style("padding", "5px")
  .attr("x", (d3.mouse(this)[0]+20) + "px")
  .attr("y", (d3.mouse(this)[1])-20 + "px")
.style("opacity", 1)
.attr('stroke','white')
.style('position','absolute')

var  tooltipText1 = plot.append('text').classed('tooltip',true).text(db.Axis +': ').style('position','absolute')
  .attr("x", (d3.mouse(this)[0]+23) + "px")
  .attr("y", (d3.mouse(this)[1])+17 + "px")
  .attr('fill','white')
  var  tooltipText2 = plot.append('text').classed('tooltip',true).text(db.TextValue).style('position','absolute')
    .attr("x", (d3.mouse(this)[0]+23) + "px")
    .attr("y", (d3.mouse(this)[1])+35 + "px")
    .attr('fill','white')
d3.select(this)
.style("stroke", "black")

          })
          .on('mouseout', function(){
            d3.selectAll('.tooltip').remove()
            d3.select(this).style('stroke','none')
          })

        })

}
