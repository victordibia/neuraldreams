import React from "react";
import { useEffect } from "react";

export default function LayerVizEx(props) {
  useEffect(() => {
    document.title = `Neural Dreams | Layer / Neuron Visualization`;
  }, []);

  return (
    <>
      <div className="flex pb10">
        <div className="flexfull">
          <div className="  mynotif positionrelative h100 lh10 p10 lightbluehightlight   ">
            Upload an image to search for similar images in our dataset
            (fashion200, conic200).
            <div className="mediumdesc">
              For the live search service below, an efficientnetB0 model (last
              layer) is used for feature extraction. FAISS is used for
              approximate nearest neighbour search.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
