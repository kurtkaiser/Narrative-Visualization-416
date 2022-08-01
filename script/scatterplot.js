// data from https://www.census.gov/data/tables/time-series/demo/voting-and-registration/voting-historical-time-series.html
generateBarchart('#barchart-element');

function generateBarchart(barchartId) {
    d3.csv("data/us-census-a1-voting-data-age-group.csv").then(d => chart(d));


    function chart(csv) {

        const pageWidth = 1000;
        const pageHeight = 600;
        const margin = 15;
        const marginSide = 50;
        const labelPadding = 35;
        const yLabel = 'Portion of the Group That Voted';
        const xLabel = 'Year';
        const colors = ['#3366CC','#DC3912', '#FF9900', '#109618', '#990099', '#3B3EAC', '#0099C6',
            '#DD4477', '#66AA00', '#B82E2E', '#316395', '#994499', '#22AA99', '#AAAA11', '#6633CC',
            '#E67300', '#8B0707', '#329262', '#5574A6', '#3B3EAC',];

        const svg = d3.select(barchartId)
            .append("svg")
            .attr("width", pageWidth)
            .attr("height", pageHeight);

        svg.style("display", "block")
            .style("margin", "auto")

        const width = svg.attr("width") - marginSide;
        const height = svg.attr("height") - margin - margin;

        d3.select("#chart-section").style("display", "block")
            .style("margin", "auto")

        var xBand = d3.scaleBand()
            .range([marginSide, width - marginSide])


        var yBand = d3.scaleLinear()
            .range([height - margin, margin])

        var xAxis = g => g
            .attr("transform", "translate(0," + (height - margin) + ")")
            .call(d3.axisBottom(xBand).tickFormat(function(d) {
                return d;
            }).tickSizeOuter(0));

        var yAxis = g => g
            .attr("transform", "translate(" + marginSide + ",0)")
            .call(d3.axisLeft(yBand).tickFormat(d3.format("~s")))

        svg.append("g").attr("class", "x-axis")
        svg.append("g").attr("class", "y-axis")

        update(2000)

        function update(speed) {
            var data = csv;//.filter(f => f.group === group);
            yBand.domain([0, 100])

            svg.selectAll(".y-axis").transition().duration(speed)
                .call(yAxis);

            svg.selectAll(".y-axis").call(yAxis)
                .append('text')
                .attr('class', 'axis-label')
                .attr('fill', 'black')
                .attr('y', -labelPadding)
                .attr('x', height / -2)
                .attr('transform', 'rotate(-90)')
                .attr('text-anchor', 'middle')
                .text(yLabel);

            xBand.domain(data.map(function(d) {
                return d.year;
            }));

            svg.selectAll(".x-axis").transition().duration(speed)
                .call(xAxis);

            svg.selectAll(".x-axis").call(xAxis)
                .append('text')
                .attr('class', 'axis-label')
                .attr('y', labelPadding)
                .attr('x', width / 2)
                .attr('fill', 'black')
                .text(xLabel);

            var tooltip = d3.select(barchartId).append("div")
                .attr("class", "tooltipcharts")
                .style("opacity", 0);

            var showTooltip = function(d) {
                var html = "<center>Year: " + d.year + "  |  Group: " + d.group + " |  Voting:" + d.amount + "%</center>";
                console.log(html)
                tooltip.html(html)
                    .transition()
                    .duration(200) // ms
                    .style("opacity", .9)
            };

            var hideTooltip = function(d) {
                tooltip.transition()
                    .duration(10000) // ms
                    .style("opacity", 0);
            };

            var bar = svg.selectAll(".bar")
                .data(data, d => d.year)

            let groupColors = {};
            bar.exit().remove();
            bar.enter().append("g")
                .attr("class", "circle")
                .attr("transform", "translate(22,2)")
                .selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .on('mouseover', showTooltip)
                .on('mouseout', hideTooltip)
                .style("fill", function(d){
                    if(!groupColors.hasOwnProperty(d.group)){
                        groupColors[d.group] = colors.pop();
                    }
                    return groupColors[d.group];
                })
                .attr("y", d => height - 15)
                .attr("x", d => {
                    return xBand(d.year)
                })
                .attr("cx", function(d) {
                    return xBand(d.year)
                })
                .attr("cy", function(d) {
                    return yBand(d.amount);
                })
                .attr("r", function(d) {
                return d3.sum([4,4]);
            });
        }
        chart.update = update;
    }

}
