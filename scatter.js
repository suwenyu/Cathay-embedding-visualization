var step = 0           // What time point to show after loading?
// 351 samples, covering 7 seconds (20 sec per sample)
// Lets look at the first half
var n_steps = 4           // Length of data (in frames)
var realTime = 3500// Real duration

// var defaultStepText = "seconds"
// function getStepLabel(step) {
//     var seconds = Math.round(step * 20) / 1000
//     return String(seconds) + " " + defaultStepText }

// Animation/manipulation variables/functions
// Declared globally so they can be accessed later
var play
var stop
var forward1
var fps = 30;                   // These are only defaults, I'm not
                                // sure they're even used any more
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;
// var speedSelector = document.getElementById("speed")
var speedSelector = 4;
var requestId = 0;
var totalTime
var transition_time  = Math.floor(totalTime / n_steps)
var startTime = null
var deltaTime = null
var lastStep = null
var lastTime = null
var mousemode = true
var current_position = 0

// Setup settings for graphic
var canvas_width = 600;
var canvas_height = 400;
var padding = 30;  // for chart edges

var press_opacity = []

// Create scale functions
// For now, let axes scale themselves.
var xScale = d3.scale.linear()  // xScale is width of graphic
    .domain([-1.5, 1.5])
    .range([padding, canvas_width - padding * 2]); // output range

var yScale = d3.scale.linear()  // yScale is height of graphic
    .domain([-1.0, 1.0])
    .range([canvas_height - padding, padding]);  // remember y starts
                                                 // on top going down
                                                 // so we flip

var tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(function(d) {
        return "Customer ID" + ": " + d['name'] + "<br>";
    });
// var xAxis = d3.svg.axis()
//     .scale(xScale)
//     .orient("bottom")
//     .tickSize(-canvas_height);

// var yAxis = d3.svg.axis()
//     .scale(yScale)
//     .orient("left")
//     .tickSize(-canvas_width);

var colorScale = d3.scale.category10();
// Should manually override this.

// Define X axis
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .tickSize(-canvas_height);

// Define Y axis
var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .tickSize(-canvas_width);

console.log("Defined axes")

// Create SVG element
var svg = d3.select("#chart")  // This is where we put our vis
    .append("svg")
    .attr("width", canvas_width)
    .attr("height", canvas_height)

svg.call(tip);

d3.json('scatter_test.json', function(json) {
    var dataset = json;
    console.log("Data loaded")

    //Create Circles
    svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")  // Add circle svg
        .classed("dot", true)
        .attr("cx", function(d) {
            return xScale(d.path[step][0]);  // Circle's X
        })
        .attr("cy", function(d) {  // Circle's Y
            return yScale(d.path[step][1]);
        })
        .attr("r", 5)  // radius
        // .style("fill", function(d) { return colorScale(d.condition); } )
        .style("fill", function(d){
            // console.log(d.color[step]);
            return d.color[step];
        })
        .style("opacity", .7 )
        .attr("data-legend",function(d) { return d.color[step]})
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);
    // var stepText = svg.append('text')
        // .text("0 " + defaultStepText)
        // .attr("x", xScale(-1.4))
        // .attr("y", yScale(0))

    console.log("Circles created");

    // var color = d3.scale.category10();
    // var legend = svg.selectAll(".legend")
    //     .data(dataset)
    //     .enter().append("g")
    //     .classed("legend", true)
    //     .attr("transform", function(d, i) {
    //         // console.log(d);
    //         return "translate(0," + i * 20 + ")";
    //     });
    // legend.append("rect")
    //     .data(dataset,function(d) { 
    //         return d.key})
    //     .attr("x", canvas_width - 10)
    //     .attr("width", 12)
    //     .attr("height", 12)
    //     .style("fill",function(d) { 
    //         console.log(d);
    //         return d.value});
    // console.log(canvas_width);

    legend = svg.append("g")
        .attr("class","legend")
        .attr("transform","translate(" + canvas_width*1.1+ "," + canvas_height*0.1 + ")")
        .style("font-size","20px")
        .call(d3.legend)
    // Add to X axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (canvas_height - padding) +")")
        .call(xAxis);

    // svg.selectAll('text')
    //     .on('click',function (type) {

    //         d3.selectAll(".dot")
    //             .filter(function(d){
    //                 console.log(type.key)
    //                 console.log(d['color'][current_position])
    //                 // console.log(d.key == type.key);
    //                 return d['color'][current_position] == type.key;
    //             })
    //             .style("opacity", 0.1)
    //         // console.log(type);
    //         // console.log(d3.selectAll(".dot").attr("data-legend"));
    //     });



    // svg.append('text')
    //     .text('Happy')
    //     .attr('x', xScale(-1))
    //     .attr('y', yScale(1.5))
    //     .attr('text-anchor', 'middle');
    // svg.append('text')
    //     .text('Sad')
    //     .attr('x', xScale(1))
    //     .attr('y', yScale(1.5))
    //     .attr('text-anchor', 'middle');

    // Add to Y axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + padding +",0)")
        .call(yAxis);

    var minX = xScale.range()[0]
    var maxX = xScale.range()[1]
    var minY = yScale.range()[1]
    var maxY = yScale.range()[0]

    var lastStep = null

    svg.selectAll(".legend-circle")
        .on('click',function (type) {
            
            console.log(press_opacity);

            var index = press_opacity.indexOf(type.key)
            if (index < 0){
                press_opacity.push(type.key);
                
                // console.log(type.key);
                d3.select(this)
                    .style("opacity", 0.1);
                d3.selectAll(".dot")
                    .filter(function(d){
                        // console.log(press_opacity);
                        return d.color[current_position] == type.key;
                    })
                    .style("opacity", 0.1);
                d3.selectAll(".legend-text")
                    .filter(function(d){
                        // console.log(d.key == type.key);
                        return d.key == type.key;
                    })
                    .style("opacity", 0.1)
                
            }
            else{
                d3.select(this)
                    .style("opacity", 0.7);
                d3.selectAll(".dot")
                    .filter(function(d){
                        console.log(d.color[current_position] == type.key);
                        return d.color[current_position] == type.key;
                    })
                    .style("opacity", 0.7);
                d3.selectAll(".legend-text")
                    .filter(function(d){
                        return d.key == type.key;
                    })
                    .style("opacity", 0.7)
                press_opacity.splice(index, 1);
            }
        });

        svg.selectAll(".legend-text")
        .on('click',function (type) {
            
            console.log(press_opacity);

            var index = press_opacity.indexOf(type.key)
            if (index < 0){
                press_opacity.push(type.key);
                
                // console.log(type.key);
                d3.select(this)
                    .style("opacity", 0.1);
                d3.selectAll(".dot")
                    .filter(function(d){
                        // console.log(press_opacity);
                        return d.color[current_position] == type.key;
                    })
                    .style("opacity", 0.1);
                d3.selectAll(".legend-circle")
                    .filter(function(d){
                        // console.log(d.key == type.key);
                        return d.key == type.key;
                    })
                    .style("opacity", 0.1)
                
            }
            else{
                d3.select(this)
                    .style("opacity", 0.7);
                d3.selectAll(".dot")
                    .filter(function(d){
                        // console.log(press_opacity);
                        return d.color[current_position] == type.key;
                    })
                    .style("opacity", 0.7);
                d3.selectAll(".legend-circle")
                    .filter(function(d){
                        return d.key == type.key;
                    })
                    .style("opacity", 0.7)
                press_opacity.splice(index, 1);
            }
        });

    // Interaction
    // svg.on('mousemove', function(){
    //     if (mousemode){
    //         yClick = (d3.mouse(this)[1] - minY) / maxY
    //         if (yClick > .9){
    //             xClick = (d3.mouse(this)[0] - minX) / maxX
    //             step = Math.round(xClick * n_steps)
    //             if (step > n_steps) step = n_steps
    //             if (step < 0) step = 0
    //             transition_time = 50
    //             if (step != lastStep){
    //                 drawStep(step)
    //                 last_step = step
    //             }
    //         }
    //     }
    // })

    function doStep(timestamp) {
        // if (!startTime) startTime = timestamp;
        var timestamp = timestamp || Date.now()
        deltaTime = Date.now() - startTime
        // console.log(deltaTime)
        var progress = deltaTime / totalTime;
        // console.log(progress)
        step = Math.round(n_steps*progress)
        // console.log(step);
        if (step != lastStep){
            // transition_time = timestamp - lastTime
            drawStep(step)
            lastStep = step
            lastTime = timestamp
        }
        if ((progress < 1) & (step < n_steps)) {
            requestId = window.requestAnimationFrame(doStep);
        }
        else{
            stop()
        }
    }

    drawStep = function(step) {
        svg.selectAll("circle")
            .data(dataset)  // Update with new data
            .transition()  // Transition from old to new
            .duration(transition_time)  // Length of animation
            .ease('linear')
            .attr("cx", function(d) {
                return xScale(d.path[step][0]);  // Circle's X
            })
            .attr("cy", function(d) {  // Circle's Y
                return yScale(d.path[step][1]);
            })
            .style("fill", function(d){
                // console.log(d.color[step]);
                return d.color[step];
            })
            // .filter(function(d){
            //     // console.log(d.key == type.key);
            //     return d.key == type.key;
            // })
            // .style("opacity",0.1)


        // stepText.text(getStepLabel(step))
    }
    play = function () {
        mousemode=false
        // var slowBy = Number(speedSelector.value)
        var slowBy = Number(speedSelector)
        if (isNaN(slowBy)){
            alert("Please enter a valid number.")
            return (-1)
        }
        totalTime = realTime * slowBy
        startTime = Date.now()
        transition_time = Math.floor(totalTime / n_steps)
        requestId = window.requestAnimationFrame(doStep); 
    }
    play1month = function(value) {
        // var slowBy = Number(speedSelector.value)
        var slowBy = Number(speedSelector)
        if (isNaN(slowBy)){
            alert("Please enter a valid number.")
            return (-1)
        }
        step = value;
        // console.log(step);
        if (step != lastStep){
            transition_time = 1000
            // transition_time = timestamp - lastTime
            drawStep(step);
            lastStep = step;
        }


        // totalTime = realTime * slowBy
        // startTime = Date.now()
        // transition_time = Math.floor(totalTime / 2)
        // // transition_time = Math.floor(totalTime/ 4 )
        // requestId = window.requestAnimationFrame(doStep);

    }
    playmoremonth = async function(last)
    {
        d3.selectAll(".dot")
        .style("opacity", 0.7);

        transition_time = 1000;
        pos = []
        i = current_position;
        if (current_position <= last){
            drawStep(current_position+1);
            for(i = current_position+2 ; i <= last; i++){
                pos.push(i)
            }
        }
        else{
            drawStep(current_position-1);
            for(i = current_position-2 ; i >= last; i--){
                pos.push(i)
            }
        }
        // console.log(pos);
        console.log(last, current_position);

        
        

        var offset = 0;
        
            (pos).forEach(function(i){

                setTimeout(function(){
                    transition_time = 1000;
                // console.log(i);
                drawStep(i);
                }, 1000+offset);
                offset+=1000
            });
        
        d3.selectAll(".dot")
            .filter(function(d){
                // console.log(press_opacity);
                if(press_opacity.indexOf(d.color[last])==-1){
                    // console.log('Hello')
                    return false;
                }
                else{
                    return true;
                }
            })
            .style("opacity", 0.1);
        // console.log(pos);
        // // console.log(start, last);
        // function myLoop () {
        // setTimeout(function () {
        //     transition_time = 1000;
        //     drawStep(i)
        //     console.log(i);
        //     i++;
        //     if (i <= last) {
        //         myLoop();
        //     }
        // }, 1500)
        // }
        // myLoop();
        current_position = last;
    }


    stop = function()
    {
        cancelAnimationFrame(requestId)
        mousemode=true
    }
});
