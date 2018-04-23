// d3.legend.js 
// (C) 2012 ziggy.jonsson.nyc@gmail.com
// MIT licence

(function() {
    var press_opacity = [];
d3.legend = function(g) {
  g.each(function() {
    var g= d3.select(this),
        items = {},
        svg = d3.select(g.property("nearestViewportElement")),
        legendPadding = g.attr("data-style-padding") || 5,
        lb = g.selectAll(".legend-box").data([true]),
        li = g.selectAll(".legend-items").data([true])
    lb.enter().append("rect").classed("legend-box",true)
    li.enter().append("g").classed("legend-items",true)

    svg.selectAll("[data-legend]").each(function() {
        var self = d3.select(this)
        items[self.attr("data-legend")] = {
          pos : self.attr("data-legend-pos") || this.getBBox().y,
          condition : self.attr("data-legend-condition") != undefined ? self.attr("data-legend-condition") : self.style("fill") != 'none' ? self.style("fill") : self.style("stroke") 
        }
      })

    items = d3.entries(items).sort(function(a,b) { return a.value.pos-b.value.pos})

    li.select("legend")
        .data(items, function (d) {return d.key})


    li.selectAll("text")
        .data(items,function(d) { return d.key})
        .call(function(d) { d.enter().append("text").classed("legend-text", true)})
        .call(function(d) { d.exit().remove()})
        .attr("y",function(d,i) { return i+"em"})
        .attr("x","1em")
        .text(function(d) {

            // if (d.key == red){
            //     txt['key'] = 'danger';
            // }
            
            // console.log((d));
            // if(d.key == "red"){
            //     d.key = "danger"
            // }
            // else if(d.key == "orange"){
            //     d.key = "warning"
            // }
            // else{
            //     d.key = "safe"
            // }
            ;return d.key})
        .on('click',function (type) {
            var index = press_opacity.indexOf(type.key)
            if (index < 0){
                // console.log(type.key);
                d3.select(this)
                    .style("opacity", 0.1);
                d3.selectAll(".dot")
                    .filter(function(d) {
                        console.log(d);
                        console.log(type)
                        // console.log(d["condition"] == type.key);
                        return d["condition"] == type.key;
                    })
                    .style("opacity", 0.1)
                d3.selectAll(".legend-circle")
                    .filter(function(d){
                        // console.log(d.key == type.key);
                        return d.key == type.key;
                    })
                    .style("opacity", 0.1)
                press_opacity.push(type.key);
            }
            else{
                d3.select(this)
                    .style("opacity", 0.7);
                d3.selectAll(".dot")
                    .filter(function(d){
                        return d["condition"] == type.key;
                    })
                    .style("opacity", 0.7);
                d3.selectAll(".legend-circle")
                    .filter(function(d){
                        return d.key == type.key;
                    })
                    .style("opacity", 0.7)
                press_opacity.splice(index, 1);
            }
            // console.log(press_opacity);
        })
    
    li.selectAll("circle")
        .data(items,function(d) { return d.key})
        .call(function(d) { d.enter().append("circle").classed("legend-circle", true)})
        .call(function(d) { d.exit().remove()})
        .attr("cy",function(d,i) { return i-0.25+"em"})
        .attr("cx",0)
        .attr("r","0.4em")
        .style("fill",function(d) { return d.value.condition})
        .on('click',function (type) {
            var index = press_opacity.indexOf(type.key)
            if (index < 0){
                // console.log(type.key);
                d3.select(this)
                    .style("opacity", 0.1);
                d3.selectAll(".dot")
                    .filter(function(d) {
                        // console.log(d);
                        // console.log(d["condition"] == type.key);
                        return d["condition"] == type.key;
                    })
                    .style("opacity", 0.1)
                d3.selectAll(".legend-text")
                    .filter(function(d){
                        // console.log(d.key == type.key);
                        return d.key == type.key;
                    })
                    .style("opacity", 0.1)
                press_opacity.push(type.key);
            }
            else{
                d3.select(this)
                    .style("opacity", 0.7);
                d3.selectAll(".dot")
                    .filter(function(d){
                        return d["condition"] == type.key;
                    })
                    .style("opacity", 0.7);
                d3.selectAll(".legend-text")
                    .filter(function(d){
                        return d.key == type.key;
                    })
                    .style("opacity", 0.7)
                press_opacity.splice(index, 1);
            }
            // console.log(press_opacity);
        })
  })
  return g
}
})()