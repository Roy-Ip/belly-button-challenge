// Define the URL from which JSON data will be fetched
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";



// Fetch data from the URL using d3.json and initialize the web page with the fetched data
d3.json(url).then(function(data) {
    console.log(data);
    init(data);
  });



// Initialization function to set up the web page with fetched data
function init(data) {

  // Select the dropdown menu element
  let dropdownMenu = d3.select("#selDataset");
  // Get the sample names from the fetched data
  let names = data.names;

  // Populate the dropdown menu with options based on sample names
  names.forEach((id) => {
    dropdownMenu.append("option").text(id).property("value", id);
  });

  // Select the data of the first sample and initialize charts and metadata display
  let firstChartSample = data.samples[0];
  let firstMetaDataSample = data.metadata[0];
  BarChart(firstChartSample);         // Create bar chart
  BubbleChart(firstChartSample);      // Create bubble chart
  MetaData(firstMetaDataSample);      // Display metadata   
  GaugeChart(firstMetaDataSample)     // Create gauge chart
}



// Function to handle the dropdown selection change event
function optionChanged(selectedValue) {

  // Find the selected sample's data and metadata
  d3.json(url).then((data) => {
    let selectedSample = data.samples.find((sample) => sample.id == selectedValue);
    let selectedMetadata = data.metadata.find((sample) => sample.id == selectedValue);
    
    // Update charts and metadata display based on the selected sample
    BarChart(selectedSample);
    BubbleChart(selectedSample);
    MetaData(selectedMetadata);
    GaugeChart(selectedMetadata)
  });
}



// Create Bar Chart with the selected sample data
function BarChart(selectedSample) {
  // Set up the data for the Bar Chart
  let barData = [{
    x: selectedSample.sample_values.slice(0,10).reverse(),
    y: selectedSample.otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse(),
    text: selectedSample.otu_labels.slice(0,10).reverse(),
    type: "bar",
    orientation: "h"
  }];

  // Set up the layout
  let layout = {
    title: "Top Ten OTUs",
    xaxis: { title: "Count of OTUs" }
  };

  // Call Plotly to plot the Bubble Chart
  Plotly.newPlot("bar", barData, layout);
}



// Create Bubble Chart with the selected sample data
function BubbleChart(selectedSample) {
  
  // Set up the data for the Bubble Chart
  let bubbleData = [{
    x: selectedSample.otu_ids,
    y: selectedSample.sample_values,
    text: selectedSample.otu_labels,
    mode: "markers",
    marker: {
      size: selectedSample.sample_values,
      color: selectedSample.otu_ids,
      colorscale: "Earth"
    }
  }];
  
  // Set up the layout
  let layout = {
    title: "All OTUs by ID",
    xaxis: { title: "OTU ID" },
    yaxis: { title: "Count of OTUs" }
  };

  // Call Plotly to plot the Bubble Chart
  Plotly.newPlot("bubble", bubbleData, layout);
}



// Create MetaData with the selected sample data
function MetaData(selectedMetadata) {
  console.log("Selected Metadata:", selectedMetadata); 

  let sampleSelect = d3.select("#sample-metadata");

  let metadataHTML = '';

    for (let property in selectedMetadata) {
      metadataHTML += `<div>${property}: ${selectedMetadata[property]}</div>`;
      console.log(`${property}: ${selectedMetadata[property]}`);}

  sampleSelect.html(metadataHTML);
}



// Create Gauge Chart with the selected sample data
function GaugeChart(selectedMetadata) {
  let wfreq = selectedMetadata.wfreq;
    
  // Set up the data for the Gauge Chart
  let gaugeData = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: wfreq,
      title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 9] },
        bar: { color: "blue" },
        steps: [
          { range: [0, 1], color: "rgb(242, 244, 244)" },
          { range: [1, 2], color: "rgb(229, 232, 232)" },
          { range: [2, 3], color: "rgb(204, 209, 209)" },
          { range: [3, 4], color: "rgb(178, 186, 187)" },
          { range: [4, 5], color: "rgb(153, 163, 164)" },
          { range: [5, 6], color: "rgb(127, 140, 141)" },
          { range: [6, 7], color: "rgb(112, 123, 124)" },
          { range: [7, 8], color: "rgb(97, 106, 107)" },
          { range: [8, 9], color: "rgb(81, 90, 90)" },
          { range: [9, 10], color: "rgb(66, 73, 73)" }
        ],
      }
    }
  ];
  
  // Set up the layout
  let layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
  
  // Call Plotly to plot the gauge chart
  Plotly.newPlot("gauge", gaugeData, layout);
}
