function car_pictogram(num_cars) {
            var svgDoc=d3.select("#visualization").append("svg").attr("viewBox","0 0 100 100")
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("class", "svgcontent");
            
            var cargroup = svgDoc.append("defs")
                .append("g")
                    .attr("id","carsvg")
                    .attr("transform", "scale(0.5)")
                    
                
            cargroup.append("path")
                    .attr("class", "carbody")
                    .attr("d","M31,11.9C27.3,8.3,26.4-0.5,15.6,0C5.9,0.5,5.8,12.3,5.8,12.3C0.1,13.6,0,14.6,0,16.9c0,3,2,3.6,2,3.6l4.5,0.2c0-2.2,1.8-4.2,4.1-4.2c2.3,0,4.1,1.9,4.1,3.9h7.4c0-2,1.8-4.1,4.1-4.1c2.3,0,4.1,2.1,4.1,4.1h4.2c0,0,4.2-0.3,4.2-4.1S35.5,13.1,31,11.9z M10,12.5c0,0,0.3-9.1,6.9-9.1c6.7,0,10,9.2,10,9.2L10,12.5z");
            
            var wheelgroup = cargroup.append("g")
                    .attr("id", "wheels")
                    .attr("class", "wheel");
            
            wheelgroup.append("circle")
                    .attr("cx", "10.6")
                    .attr("cy", "20.5")
                    .attr("r", "2.7");
            wheelgroup.append("circle")
                    .attr("cx", "26.1")
                    .attr("cy", "20.5")
                    .attr("r", "2.7");
            // //background rectangle
            // svgDoc.append("rect").attr("width",100).attr("height",100);
            
            //specify the number of columns and rows for pictogram layout
            var numCols = 3;
            var numRows = 2;
            
            //padding for the grid
            var xPadding = 10;
            var yPadding = 15;
            
            //horizontal and vertical spacing between the icons
            var hBuffer = 15;
            var wBuffer = 25;
            
            //generate a d3 range for the total number of required elements
            var myIndex=d3.range(num_cars);
 
            //create group element and create an svg <use> element for each icon
            svgDoc.append("g")
                .attr("id","pictoLayer")
                .selectAll("use")
                .data(myIndex)
                .enter()
                .append("use")
                    .attr("xlink:href","#carsvg")
                    .attr("id",function(d)    {
                        return "icon"+d;
                    })
                    .attr("x",function(d) {
                        var remainder=d % numCols;//calculates the x position (column number) using modulus
                        return xPadding+(remainder*wBuffer);//apply the buffer and return value
                    })
                      .attr("y",function(d) {
                        var whole=Math.floor(d/numCols)//calculates the y position (row number)
                        return yPadding+(whole*hBuffer);//apply the buffer and return the value
                    })
                    .classed("iconPlain",true);
}