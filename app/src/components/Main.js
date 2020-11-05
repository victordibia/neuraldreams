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
import ModelViz from "./modelviz/ModelViz";
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
  const modelDetails = require("../assets/modelviz/model_details.json");

  //   specify state values and setters
  const [selectedModel, setSelectedModel] = useState(3);
  const [selectedLayer, setSelectedLayer] = useState(7);
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [similarDrawer, setSimilarDrawer] = useState(true);
  const [advancedDrawer, setAdvancedDrawer] = useState(true);

  useEffect(() => {
    document.title = `Neural Dreams | Model Visualization`;
    updateLh(window.location);
  }, []);

  const selections = {
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
    config: {
      getter: {
        selectedModel: selectedModel,
        selectedLayer: selectedLayer,
      },
      setter: {
        selectedModel: setSelectedModel,
        selectedLayer: setSelectedLayer,
      },
    },
    models: modelDetails["models"],
  };

  return (
    <HashRouter>
      <div>
        <Header></Header>
        <main className="container-fluid p10">
          <Route
            exact
            path="/"
            render={(props) => <ModelViz {...props} selections={selections} />}
          />
        </main>
      </div>

      <div id="footer">
        <Footer />
      </div>
    </HashRouter>
  );
}
