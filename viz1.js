var script_link = "https://script.google.com/macros/s/AKfycby17aem6lduZFLG9QXfrOt9-4T_GRogRwk_0sJeLdSdifK8_xE/exec?"
var topics = "id=1Vk-yzLQ6M7Rg2_oI0IYWGgg9vEjs-Jj23a85yLdEVGc&sheet=Sheet1"
var events = "id=1vA74CvpA_2WTAuFABXvg21QDVSg66QDWI8_lX4H5vX4&sheet=Sheet1"
var formats = "id=1UrHfTyP15Uf6fZ1BQhSOml2J4Ri3UjvxFJPcGzNvFQY&sheet=Sheet1"

var counts = [];
var ideaTypes = ["Topics", "Events", "Formats"];

d3.json(script_link + topics, function(error, json) {
	if (error) return console.warn(error);
	data = json;
	counts.push(data.Sheet1.length);
	
	d3.json(script_link + events, function(error, json) {
		if (error) return console.warn(error);
		data2 = json;
		counts.push(data2.Sheet1.length);
		
		d3.json(script_link + formats, function(error, json) {
			if (error) return console.warn(error);
			data3 = json;
			counts.push(data3.Sheet1.length);
			
			//width and height
			var w = 200;
			var h = 300;
			var topSpace = 20;
			var cushion = 50;
			var barPadding = 1;
			
			//data
			var dataset = counts;
			
			//scales
			var y = d3.scale.linear()
				.range([h - topSpace, 0])
				.domain([d3.max(dataset, function (d) {return d;}), 0]);
				
			//create svg
			var svg = d3.select("div#barchart")
				.append("svg")
				.attr("width", w)
				.attr("height", h + cushion);
			
			//bars
			svg.selectAll("rect")
				.data(dataset)
				.enter()
				.append("rect")
				.attr("x", function (d, i){
					return i * (w/dataset.length);
				})
				.attr("y", function(d){
					return h - (y(d));
				})
				.attr("width", w / dataset.length - barPadding)
				.attr("height", function (d){
					return y(d);
				})
				.attr("fill", function(d){
					return "rgb(0,10, " + (d * 30) + ")";
				})
				//event listener for highlighting bars
				.on("mouseover", function (d, i) {
					d3.select(this)
						.attr("fill", "rgb(230,140,18)");
					svg.append("text")
						.attr("id", "tooltip")
						.attr("x", w/2)
						.attr("y", h + cushion - 12)
						.attr("text-anchor", "middle")
						.attr("font-family", "serif")
						.attr("font-weight", "bold")
						.attr("fill", "grey")
						.attr("font-size", "55px")
						.text(ideaTypes[i]);
				})
				.on("mouseout", function (d) {
					d3.select(this)
						.transition()
						.duration(250)
						.attr("fill", function(d){
							return "rgb(0,0, " + (d * 10) + ")";
						});
					d3.select("#tooltip").remove();
				});
				
			//animating bars to correct height
//			svg.selectAll("rect")
//				.transition()
//				.duration(2000)
//				.ease("elastic")
//				.attr("height", function (d){
//					return y(d);
//				});
			
			//labels on bars
			svg.selectAll("text")
				.data(dataset)
				.enter()
				.append("text")
				.text(function(d){
					return d;
				})
				.attr("x", function(d, i){
					return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2; //x position is set to the left of each bar plus half the bar width 
				})
				.attr("y", function (d) {
					return h - (y(d)) - 10;
				})
			   .attr("font-family", "serif")
			   .attr("font-weight", "bold")
			   .attr("font-size", "15px")
			   .attr("fill", "grey")
			   .attr("text-anchor", "middle");
			
		})
	})
})