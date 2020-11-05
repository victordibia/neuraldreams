import React from "react";
import { useEffect } from "react";
import ConfigView from "./configview/ConfigView";
import NeuronView from "./neuronview/NeuronView";

export default function ModelViz(props) {
  useEffect(() => {
    document.title = `Neural Dreams | Layer / Neuron Visualization`;
  }, []);

  return (
    <>
      <div className="flex pb10">
        <div className="flex5 mr10">
          <div className="  mynotif positionrelative h100 lh10 p10 lightbluehightlight   ">
            <div className="boldtext pb5 advancedoptionsbox">
              {" "}
              Optimization Based Feature Visualization{" "}
            </div>
            This demo allows you to explore visualizations of patterns learned
            by channels (groups of neurons) in each layer of a Convolutional
            Neural Network (pretrained on <strong> imagenet</strong>). To begin,{" "}
            <strong> click </strong> on a model, and a layer to view
            visualizations of selected channels in that layer.
          </div>
        </div>
        <div className="flex5">
          <div className="  mynotif positionrelative h100 lh10 p10 lightbluehightlight   ">
            <div className="boldtext pb5 advancedoptionsbox">
              {" "}
              What do these images mean?{" "}
            </div>
            These images/visualizations represent an{" "}
            <span className="italics">example</span> of what the given neurons
            in the pretrained model have{" "}
            <span className="italics"> learned to look for </span>. They are{" "}
            <span className="italics"> generated </span> using an iterative{" "}
            <a
              href="https://distill.pub/2017/feature-visualization/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              optimization
            </a>{" "}
            process which synthesizes input that causes the neurons to have high
            activation.
          </div>
        </div>
      </div>

      <ConfigView selections={props.selections}></ConfigView>
      <NeuronView selections={props.selections} />
    </>
  );
}
