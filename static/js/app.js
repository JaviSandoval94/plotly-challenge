// Declare initial function
function init() {
    // Populate dropdown option with all the individual ID's of the study subjects.
    d3.json("samples.json").then(function(data) {
        d3.select("#selDataset").selectAll("option")
            .data(data.names)
            .enter()
            .append("option")
            .html((d) => 
                `<option>${d}</option>`)
            // Create initial plot using the first study subject's ID.
            id = data.names[0];
            buildPlot(id);
    });
};

// Declare handler function to run when the dropdown value is changed.
function optionChanged(id) {
    buildPlot(id)
};

// Declare plotting function
function buildPlot(id){
    d3.json("samples.json").then(function(data) {
        // Get the index from the selected subject and use it to call the metadata and sample data from the JSON object.
        var index = data.names.indexOf(id);
        var meta = data.metadata[index];
        var sample = data.samples[index];
    
        // Collect information from the OTU samples found in the selected subject.
        var otuIds = sample.otu_ids;
        var otuLabels = sample.otu_labels;
        var sampleValues = sample.sample_values;
    
        // Collect metadata from the selected subject and save in an array
        var entries = Object.entries(meta);
        
        // Declare trace for the bar chart
        // x    :   Top 10 OTU sample values found in the selected subject.
        // y    :   Top 10 OTU ID
        // label:   OTU labels
        var barTrace = {
            x: sampleValues.slice(0,10).reverse(),
            y: otuIds.slice(0,10).reverse().map(otuId => "OTU " + otuId),
            text: otuLabels.slice(0,10).reverse(),
            type: 'bar',
            orientation: 'h'
        };

        // Declare trace for the bubble chart and create Plotly visualization in the "bubble" DOM
        // x    :   OTU sample values found in the selected subject.
        // y    :   OTU ID
        // label:   OTU labels
        var bubTrace = {
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: "markers",
            // Format markers' size and color accordingly to the sample value of each OTU.
            marker: {
                size: sampleValues.map(value => value * 0.75),
                color: otuIds
            }
        };
        // Declare bar chart layout (axes titles)
        var barLayout = {
            xaxis: {
                title:{
                    text: "Sample values"
                }
            },
            yaxis: {
                title:{
                    text: "OTU ID"
                }
            }
        };
        // Declare bubble chart layout (axes titles)
        var bubLayout = {
            xaxis: {
                title:{
                    text: "OTU ID"
                }
            },
            yaxis: {
                title:{
                    text: "Sample values"
                }
            }
        };

        // Plot the both traces in the corresponding DOM 
        var barData = [barTrace];
        var bubData = [bubTrace];
        
        Plotly.newPlot("bar", barData, barLayout);
        Plotly.newPlot("bubble", bubData, bubLayout)
         
        // Empty metadata box
        d3.select("#sample-metadata").html("")
        // Populate the box with the selected subjects' metadata
        d3.select("#sample-metadata").selectAll("p")
            .data(entries)
            .enter()
            .append("p")
            .html((d) => 
                `<p>${d[0]}: ${d[1]}</p>`)
    });
};

// Run initial function when the program starts
init();



