function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use d3 to select the panel with id of `#sample-metadata`
  // Use `.html("") to clear any existing metadata

  var panel  = document.getElementById("sample-metadata");
  console.log(panel);
  panel.textContent = "";
  // Use `d3.json` to fetch the metadata for a sample
  d3.json("/metadata/" + sample).then(function(data) {
  console.log(data);
  panel.insertAdjacentHTML("beforeend", `<p> AGE : ${data.AGE} </p>`);
  panel.insertAdjacentHTML("beforeend", `<p> BBTYPE : ${data.BBTYPE} </p>`);
  panel.insertAdjacentHTML("beforeend", `<p> ETHNICITY : ${data.ETHNICITY} </p>`);
  panel.insertAdjacentHTML("beforeend", `<p> GENDER : ${data.GENDER} </p>`);
  panel.insertAdjacentHTML("beforeend", `<p> LOCATION : ${data.LOCATION} </p>`);
  panel.insertAdjacentHTML("beforeend", `<p> WFREQ : ${data.WFREQ} </p>`);
  panel.insertAdjacentHTML("beforeend", `<p> SAMPLE # : ${data.sample} </p>`);
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json("samples/" + sample).then(bubble);

    // @TODO: Build a Bubble Chart using the sample data
  function bubble(data) {
    console.log(data);
    var trace1 = {
      x: data.otu_ids,
      y: data.sample_values,
      text: data.otu_labels,
      mode: 'markers',
      marker: {
        size: data.sample_values
      }
    };
    
    var data = [trace1];
    
    var layout = {
      title: 'Bacterial Sample Scatter',
      showlegend: false,
      height: 600,
      width: 900
    };
    
    Plotly.newPlot('bubble', data, layout);
  }
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

  d3.json("samples/" + sample).then(pieChart);

  function pieChart(data) {
    var topValues = data.sample_values.slice(0,10)
    var topIds = data.otu_ids.slice(0,10)
    var data = [{
      values: topValues,
      labels: topIds,
      type: 'pie'
    }];
    
    var layout = {
      title: 'Top 10 Bacterial Varieties',
      height: 400,
      width: 500
    };
    
    Plotly.newPlot('pie', data, layout);

  }
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
