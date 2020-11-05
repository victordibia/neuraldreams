/**
 * @license
 * Copyright 2019 Fast Forward Labs.
 * Written by / Contact : https://github.com/victordibia
 * NeuralQA - NeuralQA: Question Answering on Large Datasets with BERT.
 * Licensed under the MIT License (the "License");
 * =============================================================================
 */

import React, { useEffect, useRef } from "react";
import "./configview.css";
import {
  abbreviateString,
  makeFriendly,
  getElement,
  blueColor,
  greyColor,
  checkInView,
} from "../../helperfunctions/HelperFunctions";
import { Tooltip } from "carbon-components-react";
import { drawLines } from "../../helperfunctions/DrawLine";

function drawArcLines(model, layer, layers, lineHolder) {
  const layerBox = getElement("layerscrollbox");
  const modelBox = getElement("modelscrollbox");
  const elementOffset = -1 * modelBox.offsetTop - 30;

  // only draw lines if the model and the layer are visible
  const modelVisible = checkInView(
    modelBox,
    getElement("modelimg" + model),
    true,
    -80,
    elementOffset
  );

  const lineParams = [];
  for (const i in layers) {
    const currentLayerBox = getElement("layerimg" + i);
    const layerVisible = checkInView(
      layerBox,
      currentLayerBox,
      true,
      -80,
      elementOffset
    );
    if (layerVisible && modelVisible) {
      const isPrima = String(layer) === String(i);
      lineParams.push({
        startElement: getElement("modelimg" + model),
        endElement: currentLayerBox,
        color: isPrima ? blueColor : greyColor,
        endSocket: isPrima ? "top" : "left",
        endPlugSize: 2,
        size: isPrima ? 2.5 : 1.5,
      });
    }
  }
  drawLines(lineHolder, lineParams);
}

export default function ConfigView(props) {
  const selections = props.selections;
  const show = selections.show;
  const config = selections.config;
  const models = selections.models;
  const model = models[config.getter.selectedModel];
  const layers = models[config.getter.selectedModel].layers;
  const selectedLayer = layers[config.getter.selectedLayer];

  const lineHolder = useRef([]);
  const isScrolling = useRef(null);
  const selectedModelRef = useRef(config.getter.selectedModel);
  const selectedLayerRef = useRef(config.getter.selectedLayer);
  const laysersRef = useRef(layers);

  function removeLines() {
    lineHolder.current.forEach(function (each) {
      each.line.remove();
    });
    lineHolder.current = [];
  }

  useEffect(() => {
    function scrollEndedHandler() {
      window.clearTimeout(isScrolling.current);
      isScrolling.current = setTimeout(function () {
        removeLines();
        drawArcLines(
          selectedModelRef.current,
          selectedLayerRef.current,
          laysersRef.current,
          lineHolder.current
        );
      }, 200);
    }
    const layerBox = getElement("layerscrollbox");
    const modelBox = getElement("modelscrollbox");

    // console.log("adding listeners");
    window.addEventListener("resize", scrollEndedHandler);
    modelBox.addEventListener("scroll", scrollEndedHandler, false);
    layerBox.addEventListener("scroll", scrollEndedHandler, false);

    layerBox.scrollTo({
      top: 100,
      left: 0,
      behavior: "smooth",
    });

    return function cleanup() {
      removeLines();
      window.removeEventListener("resize", scrollEndedHandler);
      modelBox.removeEventListener("scroll", scrollEndedHandler, false);
      layerBox.removeEventListener("scroll", scrollEndedHandler, false);
    };
  }, []);

  useEffect(() => {
    selectedModelRef.current = config.getter.selectedModel;
    selectedLayerRef.current = config.getter.selectedLayer;
    laysersRef.current = layers;
    drawArcLines(
      config.getter.selectedModel,
      config.getter.selectedLayer,
      layers,
      lineHolder.current
    );

    return function cleanup() {
      removeLines();
    };
  }, [
    config.getter.selectedModel,
    config.getter.selectedLayer,
    layers,
    show.getter.advancedDrawer,
  ]);

  let modelImageList = models.map((mdata, index) => {
    let imagePath =
      selections.basePath +
      "/assets/models/" +
      models[index].name +
      "/" +
      models[index].layers[models[index].layers.length - 1].name +
      "/0.jpg";

    return (
      <div
        id={"modelimgbox" + index}
        key={mdata.name + "fullbox" + index}
        className="iblock datasetfullbox mr10 clickable mb10 "
      >
        <div className="datasettitles">
          {" "}
          {abbreviateString(mdata.name.toUpperCase(), 9)}
        </div>
        <div className="smalldesc pb5">
          {makeFriendly(mdata["modelparameters"])} params.{" "}
        </div>
        <img
          id={"modelimg" + index}
          onClick={() => config.setter.selectedModel(index)}
          src={imagePath}
          alt=""
          className={
            "datasetbox rad2 " +
            (String(config.getter.selectedModel) === String(index)
              ? "active"
              : "")
          }
          indexvalue={index}
        />
      </div>
    );
  });

  let layerImageList = layers.map((ldata, index) => {
    let imagePath =
      selections.basePath +
      "/assets/models/" +
      model.name +
      "/" +
      layers[index].name +
      "/0.jpg";

    return (
      <div
        key={ldata + "fullbox" + index}
        className="iblock datasetfullbox mr10 clickable mb10 "
      >
        <div className="datasettitles"> {"layer " + ldata.layer_index} </div>
        {/* {abbreviateString(ldata.name, 11).toLowerCase()}  */}
        <div className="smalldesc pb5">
          {" "}
          {makeFriendly(ldata.modelparameters)} params
        </div>
        <img
          id={"layerimg" + index}
          onClick={() => selections.config.setter.selectedLayer(index)}
          src={imagePath}
          alt=""
          className={
            "datasetbox rad2 " +
            (String(config.getter.selectedLayer) === String(index)
              ? "active"
              : "")
          }
          indexvalue={index}
        />
      </div>
    );
  });

  return (
    <div className="mt10">
      <div className={" " + (show.getter.advanced ? "" : " displaynone")}>
        {/* config panel and content */}
        <div
          onClick={() =>
            show.setter.advancedDrawer(!show.getter.advancedDrawer)
          }
          className="unselectable mt10 p10 clickable darkborderbottom flex greymoreinfo"
        >
          <div className="iblock flexfull minwidth485">
            <strong>
              {" "}
              {!show.getter.advancedDrawer && <span>&#x25BC; </span>}{" "}
              {show.getter.advancedDrawer && <span>&#x25B2; </span>}{" "}
            </strong>{" "}
            <strong> Advanced Options</strong>
          </div>
        </div>

        {/* Configuration drawer */}
        {
          <div
            style={{ zIndex: 500 }}
            className={
              "flex  modelconfigdiv p10 " +
              (show.getter.advancedDrawer ? "" : " displaynone")
            }
          >
            <div style={{ zIndex: 100 }} className="mr10 flex4">
              <div className=" pb10 sectiontitle"> Model </div>
              <div className="horrule mb10"></div>
              <div
                id="modelscrollbox"
                className="datasetselectdiv scrollwindow layerwindow"
              >
                {modelImageList}
              </div>
              <div className="flex flexwrap pr10">
                <div className="  mr10 ">
                  <div className=" iblock boldtext datasetdescription  p10 greyhighlight">
                    {model.name.toUpperCase()}
                  </div>
                </div>
                <div className="flexfull ">
                  <div className="smalldesc pt4">
                    {" "}
                    <strong>
                      {" "}
                      {makeFriendly(model.modelparameters)} Parameters{" "}
                    </strong>{" "}
                  </div>
                  <div className="smalldesc pt3">
                    {" "}
                    {model.numlayers} layers{" "}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ zIndex: 100 }} className="flex6 pr10 ">
              <div className="pb8 sectiontitle ">
                <div className="iblock">Layer</div>

                <div className="iblock ">
                  <Tooltip direction="left" triggerText="">
                    <div className="wscore">
                      We construct{" "}
                      <span className="italics">intermediate models</span> from
                      the main model at each of these layers. Each intermediate
                      model has less parameters than the full model and is used
                      for feature extraction.
                      {/* <div class="bx--tooltip__footer">
                                                <a hid="#" class="bx--link">Learn More</a>
                                                <button onClick={this.toggleSemanticModal.bind(this)} class="bx--btn bx--btn--primary bx--btn--sm" type="button">More Info</button>
                                            </div> */}
                    </div>
                  </Tooltip>
                </div>
              </div>
              <div className="horrule mb10"></div>
              <div
                id="layerscrollbox"
                className="scrollwindow layerwindow  mr10"
              >
                <div className="windowcontent"> {layerImageList} </div>
              </div>
              <div className="flex flexwrap pr10">
                <div className="  mr10 ">
                  <div className=" iblock boldtext datasetdescription  p10 greyhighlight">
                    {" LAYER " + selectedLayer.layer_index}
                  </div>
                </div>
                <div className="flexfull ">
                  <div className="smalldesc pt4">
                    {" "}
                    <strong>Type: {selectedLayer.type} </strong> |{" "}
                    <span className="smalldesc">
                      {" "}
                      {selectedLayer.name.toUpperCase()}{" "}
                    </span>{" "}
                  </div>
                  <div className="smalldesc pt3">
                    {" "}
                    {makeFriendly(selectedLayer.modelparameters)} model
                    parameters{" "}
                  </div>
                </div>
              </div>
            </div>

            <div className="horrule mb10"></div>
          </div>
        }
      </div>
    </div>
  );
}
