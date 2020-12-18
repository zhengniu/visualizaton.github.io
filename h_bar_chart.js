function barChart(a,b) {

  var height = b,
       width= a,
       yValue= function(d) { return d[0]; },
       xValue = function(d) { return d[1]; };
 
  var margin = {top: 5, right: 10, bottom: 10, left: 10},
      yScale= d3.scale.ordinal(),
      xScale = d3.scale.linear(),
      yAxis = d3.svg.axis(),
      xAxis = d3.svg.axis();
 var tooltip = d3.select("body").append("div").attr("class", "toolTip");
  function chart(selection) {
    selection.each(function(data) {
		console.log(data);
		
      // Convert to standard data representation greedily;
      // this is needed for nondeterministic accessors.
/*       data = data.map(function(d, i) {
		console.log(d, i);
		
		return [yValue.call(data, d, i), xValue.call(data, d, i)];

      }); */
	  var output_data=[]
	  for (i=0; i<data.length; i++){
		  var keys=Object.keys(data[i]);
		  console.log(keys[0], typeof(keys[0]), keys[1]);
		 
		  output_data.push([data[i][keys[0]],data[i][keys[1]]]);
	  }
	  console.log("After: ", output_data);
      // Update the x scale.
      var xMax = d3.max(output_data, function(d) { console.log(d);return +d[1]; } );
	  console.log("xMax", xMax);
      var xMin = 0;
      yScale.rangeRoundBands([margin.left , height - margin.left - margin.right], .1)
          .domain(output_data.map(function(d) { return d[0]; }));
  
      // Update the y scale.
      xScale
          .range([margin.left, width-margin.right])
          //.domain(d3.extent(output_data, function(d) { return d[1]; }));
		  .domain([xMin,xMax]);
  
      // Update the x axis.
      var  yAxis = d3.svg.axis()
          .scale(yScale)
          .orient("right");

      // Update the y axis.
      var xAxis = d3.svg.axis()
          .scale(xScale)
          .orient("top");
		  //.ticks(8);
  
      // Update the inner dimensions
      var g = d3.select(this).append("g")
          .attr("transform", "translate(" + margin.right + "," + margin.top*3 + ")");
  
      
  		
      g.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(-"+  margin.top +", "+  margin.top +")")
          .call(xAxis)
       ;

      g.selectAll(".bar")
          .data(output_data)
        .enter().append("rect")
          .attr("class", "bar")
		  .attr("transform", "translate(-"+  margin.top +", 0)")
          .attr("y", function(d) { return yScale(d[0]); })
          .attr("height", yScale.rangeBand())
          .attr("x", function(d) {  console.log(d, d[0], d[1], xScale(d[0]) , xScale(d[1]) ); return xScale(0); })
          .attr("width", function(d) { return Math.abs( xScale(0) - xScale(d[1]) ) })
          .on("mousemove", function(d){
            tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html((d[0]) + "<br>" + " : " + (d[1]));
        })
    		.on("mouseout", function(d){ tooltip.style("display", "none");});;
          
      console.log("yScale.range()[1]-margin.top ", yScale.range(), yScale.range()[1]-margin.top);   
	  g.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate("+  margin.top +","+  -margin.top +")")
		  
          .call(yAxis)  .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("");

    });
  }

  chart.x = function(_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };

  chart.y = function(_) {
    if (!arguments.length) return xValue;
    yValue = _;
    return chart;
  };

  chart.width  = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  return chart;
}