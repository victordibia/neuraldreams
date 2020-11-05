/**
 * @license
 * Copyright 2019 Fast Forward Labs.
 * Written by Victor Dibia / Contact : https://github.com/victordibia
 * CaseQA - CaseQA: Question Answering on Large Datasets with BERT.
 * Licensed under the MIT License (the "License");
 * =============================================================================
 */

import React, { useEffect, useState } from "react";
import { Route, HashRouter } from "react-router-dom";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import LayerVizEx from "./layervizex/LayerVizEx";
import { createBrowserHistory } from "history";

const history = createBrowserHistory({
  basename: "", // The base URL of the app (see below)
  forceRefresh: false, // Set true to force full page refreshes
  keyLength: 6, // The length of location.key
  // A function to use to confirm navigation with the user (see below)
  getUserConfirmation: (message, callback) => callback(window.confirm(message)),
});

history.listen((location) => {
  // console.log(location.pathname, location.hash)
});

let linkHolder = {};

function updateLh(location) {
  if (location.hash in linkHolder) {
    linkHolder[location.hash] = linkHolder[location.hash] + 1;
  } else {
    linkHolder[location.hash] = 0;
  }
}

history.listen((location) => {
  updateLh(location);
});

export default function Main() {
  const modelViewDetails = require("../assets/semsearch/details.json");
  const datasetViewDetails = require("../assets/semsearch/datasetdictionary.json");
  const topSimilar = 10;

  //   specify state values and setters
  const [selectedDataset, setSelectedDataset] = useState(0);
  const [selectedModel, setSelectedModel] = useState(3);
  const [selectedDistanceMetric, setSelectedDistanceMetric] = useState(0);
  const [selectedLayer, setSelectedLayer] = useState(7);
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [similarDrawer, setSimilarDrawer] = useState(true);
  const [advancedDrawer, setAdvancedDrawer] = useState(true);

  useEffect(() => {
    document.title = `ConvNet Playground | Semantic Search Explorer`;
    updateLh(window.location);
  }, []);

  const datasetInfo = modelViewDetails["datasets"][selectedDataset];
  const datasetContent = datasetViewDetails.classes[datasetInfo.name];

  const selections = {
    dataset: modelViewDetails.datasets[selectedDataset],
    model: modelViewDetails.models[selectedModel],
    layer: modelViewDetails.models[selectedModel].layers[selectedLayer],
    metric: modelViewDetails.metrics[selectedDistanceMetric],
    topSimilar: topSimilar,
    basePath: process.env.PUBLIC_URL,
    show: {
      getter: {
        similarDrawer: similarDrawer,
        advanced: showAdvanced,
        advancedDrawer: advancedDrawer,
      },
      setter: {
        similarDrawer: setSimilarDrawer,
        advancedDrawer: setAdvancedDrawer,
        advanced: setShowAdvanced,
      },
    },
    dictionary:
      datasetViewDetails.dictionary[
        modelViewDetails.datasets[selectedDataset].name
      ],
    config: {
      getter: {
        selectedDataset: selectedDataset,
        selectedModel: selectedModel,
        selectedDistanceMetric: selectedDistanceMetric,
        selectedLayer: selectedLayer,
      },
      setter: {
        selectedDataset: setSelectedDataset,
        selectedModel: setSelectedModel,
        selectedDistanceMetric: setSelectedDistanceMetric,
        selectedLayer: setSelectedLayer,
      },
    },
    classlist: datasetViewDetails.classlist,
    classes: datasetViewDetails.classes,
  };

  return (
    <HashRouter>
      <div>
        <Header></Header>
        <main className="container-fluid p10">
          <Route
            exact
            path="/"
            render={(props) => (
              <LayerVizEx
                {...props}
                selections={selections}
                datasetInfo={datasetInfo}
                datasetContent={datasetContent}
                modelViewDetails={modelViewDetails}
              />
            )}
          />
        </main>
      </div>

      <div id="footer">
        <Footer />
      </div>
    </HashRouter>
  );
}
