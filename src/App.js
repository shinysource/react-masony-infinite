import React, { useState, useCallback, useEffect } from "react";
import Gallery from "react-photo-gallery";
import ImageViewer from "react-simple-image-viewer";

import FirstLoading from "./components/loading/FirstLoading";

import { loadPhotos } from "./services/api";

const App = () => {
  const [imageObjects, setImageObjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const imageUrls = React.memo(
    imageObjects.map((image) => image.src),
    [imageObjects]
  );

  const fetchImages = useCallback(() => {
    setIsLoading(true);
    loadPhotos(pageNumber)
      .then((response) => {
        const responseImages = response.data;
        const result = responseImages.map((image) => ({
          src: image.urls.regular,
          width: image.width,
          height: image.height,
        }));

        setImageObjects((imageObjects) => [...imageObjects, ...result]);
        setIsFirstLoading(false);
        setIsLoading(false);
      })
      .catch((e) => {
        setError(e);
      });
  }, [pageNumber]);

  const handleScroll = React.useCallback(() => {
    if (
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.offsetHeight
    ) {
      setPageNumber(pageNumber + 1);
    }
  }, [pageNumber]);

  const handleOpenLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const handleCloseLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  useEffect(() => {
    fetchImages();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchImages, handleScroll]);

  return (
    <div>
      <>
        {error ? (
          <ErrorMessage />
        ) : (
          <>
            {isFirstLoading ? (
              <FirstLoading />
            ) : (
              imageObjects.length && (
                <Gallery photos={imageObjects} onClick={handleOpenLightbox} />
              )
            )}
            {isLoading && <div>Loading new images...</div>}
            {viewerIsOpen && (
              <ImageViewer
                src={imageUrls}
                currentIndex={currentImage}
                onClose={handleCloseLightbox}
                disableScroll
                backgroundStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.9)",
                }}
                closeOnClickOutside
              />
            )}
          </>
        )}
      </>
    </div>
  );
};

const ErrorMessage = () => {
  <div>
    <div className="">API Error</div>
    <div className>
      Looks like there's an error fetching images from the Unsplash API. This is
      likely due to exceeding their free API limit. <br />
      Please{" "}
      <a href={"https://github.com/rajrajhans/react-infinite-scroll-demo"}>
        clone the repo
      </a>{" "}
      and try locally using your own API keys or come back in 60 minutes.
    </div>
  </div>;
};

export default App;
