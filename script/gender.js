// data from https://www.census.gov/data/tables/time-series/demo/voting-and-registration/voting-historical-time-series.html
let curr = "Male";
let color = '#DC3912';
generateBarchart('#barchart-element');



function generateBarchart(barchartId) {
    d3.csv("data/us-census-a1-voting-data-gender.csv").then(d => chart(d));

    function chart(csv) {
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
            var data = csv.filter(f => f.group === curr);
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


            svg.append("g").html("<g class=\"annotation\"><g>" +
                "<g class=\"annotation callout  \" transform=\"translate(900, 215)\"><g >" +
                "<path class=\"connector\" d=\"M0,0L0,-80\" stroke=\"black\" fill=\"none\"" +
                " style=\"stroke-dasharray: 3, 3;\"></path><path " +
                "d=\"M2.6-16,-4.25A4.25,4.25,0,1,1,-2.6-16,4.25A4.25,4.25,0,1,1,2.6-16," +
                "-4.25Z\" transform=\"translate(0, 0)\" fill=\"black\" stroke=\"black\"></path></g>" +
                "<g ></g><g transform=\"translate(0, -80)\"><g  transform=\"translate(-112.0, -80.3)\">" +
                "<rect width=\"112.0\" height=\"77.3\" x=\"0\" y=\"0\"fill=\"white\" fill-opacity=\"0\"></rect><text dx=\"0\" " +
                "y=\"20.4\" fill=\"black\"><tspan x=\"0\" dy=\"0.8em\">Men: 59.3%</tspan><tspan x=\"0\" " +
                "dy=\"1.2em\">number of</tspan><tspan x=\"0\" dy=\"1.2em\">Women: 63%</tspan></text><text " +
                "fill=\"black\" font-weight=\"bold\"><tspan x=\"0\" dy=\"0.8em\">Record Turnout" +
                "</tspan></text></g><path class=\"note-line\" d=\"M-112.0,0L0,0\" stroke=\"black\"></path></g>" +
                "</g></g></g>");
        }
        if(curr == "Male"){
            curr = "Female";
            color = '#12b5dc';
            generateBarchart('#barchart-element');
        }
        chart.update = update;
    }

    var select = d3.select("#group-selection")
        .on("change", function() {
            chart.update(this.value, 800)
        })
}
