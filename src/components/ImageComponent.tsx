import React, { useState } from "react";
import { handleNewImageUrl } from "../funcs/async/ImgFunctions";
import { OriginalGame } from "../types/types";

interface ImageComponentProps {
  game: OriginalGame;
  setGame: React.Dispatch<React.SetStateAction<OriginalGame>>;
  fieldName: string;
  src: string;
  setCarouselImagesSrc?: React.Dispatch<
    React.SetStateAction<{ key: string; value: string }[]>
  >;
}

export default function ImageComponent({
  game,
  setGame,
  fieldName,
  src,
  setCarouselImagesSrc,
}: ImageComponentProps) {
  const [imgSrc, setImgSrc] = useState(src);

  const handleImgError = async (fieldName: string) => {
    const url = await handleNewImageUrl(game, fieldName);

    console.log(url);
    setGame({ ...game, [fieldName]: url });
    setImgSrc(url);
    setCarouselImagesSrc?.((prevSrcs) =>
      prevSrcs.map((prevSrc) =>
        prevSrc.key === fieldName ? { ...prevSrc, value: url } : prevSrc
      )
    );
  };

  return (
    <img
      src={imgSrc}
      onError={() => handleImgError(fieldName)}
      alt=""
      draggable="false"
      loading="lazy"
      style={{ aspectRatio: 16 / 9 }}
    />
  );
}
