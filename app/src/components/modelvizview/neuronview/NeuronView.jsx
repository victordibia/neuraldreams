import React from "react";
import { useEffect } from "react";
import "./neuronview.css";

export default function NeuronView(props) {
  const selections = props.selections;
  const config = selections.config;
  const models = selections.models;
  const model = models[config.getter.selectedModel];
  const layers = models[config.getter.selectedModel].layers;

  const selectedLayerIndex =
    config.getter.selectedLayer >= layers.length
      ? 0
      : config.getter.selectedLayer;

  const neurons =
    selections.neurons[model.name][layers[selectedLayerIndex].name];

  useEffect(() => {}, []);

  const neuronImagelIst = neurons.map((data, index) => {
    // https://convnetplayground.fastforwardlabs.com/assets/models/mobilenetv2/Conv1/1.jpg
    let imagePath =
      selections.basePath +
      "/assets/models/" +
      model.name +
      "/" +
      layers[selectedLayerIndex].name +
      "/" +
      data +
      ".jpg";

    return (
      <div
        key={data + "fullbox" + index}
        className="iblock datasetfullbox mr10 clickable mb10 "
      >
        <div className="smalldesc pb5"> {"Channel " + data} </div>

        <img
          id={"neuronimg" + index}
          onClick={() => selections.config.setter.selectedNeuron(index)}
          src={imagePath}
          alt=""
          className={
            "datasetbox rad2 " +
            (String(config.getter.selectedNeuron) === String(index)
              ? "active"
              : "")
          }
          indexvalue={index}
        />
      </div>
    );
  });

  const mainImagePath =
    selections.basePath +
    "/assets/models/" +
    model.name +
    "/" +
    layers[selectedLayerIndex].name +
    "/" +
    (neurons[config.getter.selectedNeuron] || "0") +
    ".jpg";

  const mainImage = (
    <div className="mr10 mb5  floatleft iblock">
      <img
        id={"mainimage"}
        src={mainImagePath}
        alt=""
        className={"datasetbox rad2 mainneuron "}
      />
      <div className="greyhighlight mt5 p10 ">
        <div className="smalldesc underline mb3 pb5">
          {" "}
          <span className="boldtext">{model.name}</span> |{" "}
          {layers[selectedLayerIndex].name}{" "}
        </div>
        <div className="boldtext pt5">
          {" "}
          Channel {neurons[config.getter.selectedNeuron] || 0}{" "}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="p10 mt10">
        {mainImage}
        {neuronImagelIst}
      </div>
      <br />
      <br />
      <br />
    </>
  );
}
