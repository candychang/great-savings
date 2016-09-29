(function() {

// Localize jQuery variable
var jQuery;

/******** Load jQuery if not present *********/
if (window.jQuery === undefined || window.jQuery.fn.jquery !== '1.4.2') {
    var script_tag = document.createElement('script');
    script_tag.setAttribute("type","text/javascript");
    script_tag.setAttribute("src",
        "https://code.jquery.com/jquery-3.1.1.min.js");
    script_tag.setAttribute("integrity", "sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=");
    script_tag.setAttribute("crossorigin", "anonymous");
    if (script_tag.readyState) {
      script_tag.onreadystatechange = function () { // For old versions of IE
          if (this.readyState == 'complete' || this.readyState == 'loaded') {
              scriptLoadHandler();
          }
      };
    } else {
      script_tag.onload = scriptLoadHandler;
    }
    // Try to find the head, otherwise default to the documentElement
    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
    
    
} else {
    // The jQuery version on the window is the one we want to use
    jQuery = window.jQuery;
    main();
}



/******** Called once jQuery has loaded ******/
function scriptLoadHandler() {
    // Restore $ and window.jQuery to their previous values and store the
    // new jQuery in our local jQuery variable
    jQuery = window.jQuery.noConflict(true);
    // Call our main function
    main(); 
}

function find_heights(last_year, this_year) {
    if (last_year >= this_year && last_year != 0) {
        return {last_year: "height:100%",
                this_year: "height:" + (Math.round((this_year / last_year) * 100)).toString() + "%"
        }
    } else if (this_year > last_year) {
        return {last_year: "height:" + (Math.round((last_year / this_year) * 100)).toString() + "%",
                this_year: "height:100%"
        }
    } else {
        return {last_year: "height:0%",
                this_year: "height:0%"
        }
    }
}


function create_content(data) {
	
	var content = {
		car: {
			main_phrase: "",
			explanation: ""
		},
		
		tree: {
			main_phrase: "",
			explanation: "",
		},
		
		carbon: {
			main_phrase: "",
			explanation: ""
		}
	};
	
	/** creating car written content **/
	var num_saved = data.car_saved_nrg;
    num_saved = (num_saved < 10) ? toWords(Math.round(num_saved)) : num_saved;
    content.car.main_phrase = "take " + num_saved + " cars off the road";
    content.car.explanation = "offset the energy consumption of " + num_saved + " average-sized cars for one month";
 
	/** creating tree written content **/
    num_saved = data.tree_saved_nrg;
    num_saved = (num_saved < 10) ? toWords(Math.round(num_saved)) : num_saved;
    content.tree.main_phrase = "do the work of " + num_saved + " trees";
    content.tree.explanation = "match the effect of planting " + num_saved + " trees this month";

	/** creating carbon written content **/
	num_saved = data["carbon_saved_nrg"];
    num_saved = (num_saved < 10) ? toWords(Math.round(num_saved)) : num_saved;
    content.carbon.main_phrase = "reduce your carbon footprint by " + num_saved + " pounds";
    content.carbon.explanation = "reduce carbon emissions by " + num_saved + " pounds this month";
    
    return content;
}

function widgetCallback(data) {
    var usage = data.energy_info.usage;
    var savings = data.energy_info.savings;
            
    var last_year_nrg = usage.last_year["kwh"];
    var this_year_nrg = usage.last_month["kwh"];
    
    var heights = find_heights(last_year_nrg, this_year_nrg);
    
    return {
        
        last_year_date: usage.last_year["date"],
        this_year_date: usage.last_month["date"],
    
        last_year_nrg: last_year_nrg,
        this_year_nrg: this_year_nrg,
    
        last_year_height: heights["last_year"],
        this_year_height: heights["this_year"],
        
        car_saved_nrg: savings["car"],
        tree_saved_nrg: savings["tree"],
        carbon_saved_nrg: savings["carbon"]
    }
}

function getSampleData() {
    return widgetCallback(
        {"energy_info": {
            "savings": {
                "car": 6,
                "tree": 20,
                "carbon": 246.34
            },
            "usage": {
                "last_month": {
                    "date": "January 2014",
                    "kwh": 573,
                },
                "last_year": {
                    "date": "January 2013",
                    "kwh": 791
                }
            }
        } 
    });
}


/******** Our main function ********/
function main() { 
    jQuery(document).ready(function($) { 

        var last_year_nrg;
        var this_year_nrg;
        
        var car_saved_nrg;
        var tree_saved_nrg;
        var carbon_saved_nrg;
        
        var context = getSampleData();

        var content = create_content(context);
        
        
		Handlebars.registerHelper('span', function(kwh, options) {
        	var attrs = [];
        
        	for (var prop in options.hash) {
            	attrs.push(
                	Handlebars.escapeExpression(prop) + '="'
                	+ Handlebars.escapeExpression(options.hash[prop]) + '"');
        	}
        
        	return new Handlebars.SafeString(
              
            	"<span " + attrs.join(" ") + ">" + Handlebars.escapeExpression(kwh) + " kwh" + "</span>"
        	);
        });
        
        
        var updateHTML = function(unit, context, content) {
        	/******* Load HTML *******/
        	switch(unit) {
        		case "car":
        			context.main_phrase = content.car.main_phrase;
        			context.explanation = content.car.explanation;
        			break;
        		case "tree":
        			context.main_phrase = content.tree.main_phrase;
        			context.explanation = content.tree.explanation;
        			break;
        		case "carbon":
        			context.main_phrase = content.carbon.main_phrase;
        			context.explanation = content.carbon.explanation;
        			break;
        	};
        	
	        var source   = $("#widget-template").html();
	        var template = Handlebars.compile(source);
	        var html_source   = template(context);
	        $('#savings-widget').html(html_source);
			
			switch(unit) {
				case "car":
					car_pictogram(context.car_saved_nrg);
					break;
				case "tree":
					tree_pictogram(context.tree_saved_nrg);
					break;
				case "carbon":
					carbon_chart(context.last_year_nrg, context.this_year_nrg);
					d3.select("circle").transition().style("r", "10");
					break;
			}
	        
        }
        
        
        $(document).on( "click", "#carbutton", function() { updateHTML("car", context, content);});
        $(document).on( "click", "#treebutton", function() { updateHTML("tree", context, content);});
        $(document).on( "click", "#carbonbutton", function() {updateHTML("carbon", context, content);});

		
		updateHTML("car", context, content);
		
		
		

});        
}
})();