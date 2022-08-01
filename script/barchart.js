// data from https://www.census.gov/data/tables/time-series/demo/voting-and-registration/voting-historical-time-series.html
generateBarchart('#barchart-element');

function generateBarchart(barchartId) {
    document.selectpresidentialElections
    d3.csv("data/us-census-a1-voting-data-race.csv").then(d => chart(d));
    let color = "steelblue";

    function chart(csv) {
        let presidentElection = document.getElementById("presidentialElections");
        const group = [...new Set(csv.map(d => d.group))];
        const pageWidth = 1000;
        const pageHeight = 600;
        const margin = 15;
        const marginSide = 50;
        const labelPadding = 35;
        const yLabel = 'Portion of the Group That Voted';
        const xLabel = 'Year';

        const svg = d3.select(barchartId)
            .append("svg")
            .attr("width", pageWidth)
            .attr("height", pageHeight);

        svg.style("display", "block")
            .style("margin", "auto")

        const width = svg.attr("width") - marginSide;
        const height = svg.attr("height") - margin - margin;

        var options = d3.select("#group-selection").selectAll("option")
            .data(group)
            .enter().append("option")
            .text(function(d) {
                return d;
            });

        d3.select("#group-selection").style("display", "block")
            .style("margin", "auto")

        var xBand = d3.scaleBand()
            .range([marginSide, width - marginSide])
            .padding(0.15)

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

        update(d3.select("#group-selection").property("value"), 2000)

        function update(group, speed) {
            var data = csv.filter(function(f) {
                console.log(presidentElection);
                if (f.group === group){
                    if(presidentElection && f.year % 4 == 0){
                        return true;
                    } else if(!presidentElection && !(f.year % 4 ==0) ) {
                        color = "crimson";
                        return true;
                    }
                }
            });
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
                tooltip.html(html)
                    .transition()
                    .duration(200) // ms
                    .style("opacity", .9)
            };



            var hideTooltip = function(d) {
                tooltip.transition()
                    .duration(1000) // ms
                    .style("opacity", 0);
            };

            var bar = svg.selectAll(".bar")
                .data(data, d => d.year)

            bar.exit().remove();
            bar.enter().append("rect")
                .on('mouseover', showTooltip)
                .on('mouseout', hideTooltip)
                .attr("class", "bar")
                .attr("fill", color)
                .attr("width", xBand.bandwidth())
                .merge(bar)
                .attr("y", d => height - margin)
                .attr("x", d => {
                    return xBand(d.year)
                })
                .transition().duration(speed)
                .attr("y", d => yBand(d.amount))
                .attr("height", function(d) {
                    return yBand(0) - yBand(d.amount);
                });
            svg.append("g")
                .html("<g class=\"annotation\"><g><g " +
                    "transform=\"translate(232, 490)\"><g ><path " +
                    "d=\"M0,0L200,-150\" stroke=\"black\" fill=\"none\" style=\"stroke-dasharray: 2, 2;\"></path> <path" +
                    " class=\"dot\" d=\"M5.0e-16," +"-8.5A8.5,8.5,0,1,1,-5.2e-16," + "8.5A8.5,8.5,0,1,1,5.2e-16," +
                    "-8.5\" transform=\"translate(0, 0)\" fill=\"yellow\" stroke=\"black\"></path>" +
                    "</g><g></g><g transform=\"translate(200, -150)\"><g transform=\"translate(0, -80.3)\">" +
                    "<rect width=\"110\" height=\"77.3\" x=\"0\" y=\"0\"fill=\"white\" fill-opacity=\"0\"></rect><text dx=\"0\" " +
                    "y=\"20.3671875\" fill=\"black\"><tspan x=\"0\" dy=\"0.8em\">The late 1980s marked the start of a </tspan><tspan x=\"0\" " +
                    "dy=\"1.2em\">sparatic deline in voter particpation.</tspan><tspan x=\"0\" dy=\"1.2em\"></tspan></text><text " +
                    "fill=\"black\" font-weight=\"bold\"><tspan x=\"0\"dy=\"0.8em\">Sharp Decline</tspan></text></g><path d=\"M0,0L112.078125,0\" " +
                    "stroke=\"black\"></path></g></g></g></g>");
        }
        chart.update = update;
    }

    var select = d3.select("#group-selection")
        .on("change", function() {
            chart.update(this.value, 800)
        })
}
