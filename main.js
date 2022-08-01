var margin = 50,
    height = 200,
    width = 200,
    svg = d3.select('svg');

var dataset = [4, 8, 15, 16, 23, 42];
var gBars = svg.append("g")
    .attr("transform", "translate(" + 50 + "," + 50 + ")");

var gYAxis = svg.append("g")
    .attr("transform", "translate(" + 50 + "," + 50 + ")");

var xYAxis = svg.append("g")
    .attr("transform", "translate(" + 50 + "," + 250 + ")");

var xScale = d3.scaleBand()
    .domain(d3.range(dataset.length))
    .range([0, width])

var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset)])
    .range([0, height]);

var yAxisScale = d3.scaleLinear()
    .domain([0, d3.max(dataset)])
    .range([height, 0]);

var xAxis = d3.axisBottom().scale(xScale);
var yAxis = d3.axisLeft().scale(yAxisScale);



gYAxis.call(yAxis);

xYAxis.call(xAxis);

gBars.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
        return xScale(i);
    })
    .attr("y", function(d) {
        return height - yScale(d);
    })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) {
        return yScale(d);
    });


