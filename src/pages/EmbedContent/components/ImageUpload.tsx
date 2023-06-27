import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'

import { IImageProps } from "types"

const ImageUpload: FC<IImageProps> = ({ imageEmbedData, showUrl }) => {
  // const [currentImage, setCurrentImage] = useState<File>();
  const [currentImage, setCurrentImage] = useState<string>();
  // const [previewImage, setPreviewImage] = useState<string>("");
  const imageRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (showUrl) {
      imageEmbedData(currentImage)
    }
  }, [showUrl])

  const selectImage = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files as FileList;
    // setCurrentImage(selectedFiles?.[0]);
    setCurrentImage(URL.createObjectURL(selectedFiles?.[0]));
    // setPreviewImage(URL.createObjectURL(selectedFiles?.[0]));
  }

  const openFileSelection = () => {
    if (imageRef.current) imageRef.current.click();
  }

  return (
    <>
      <div className="embed__container--image">
        <h5>Upload Image</h5>

        <p>FILE UPLOAD</p>

        <div className="embed__container--image__upload">
          <button onClick={openFileSelection}>
            {currentImage ? 'Image Selected' : 'Import Image from Device'}
          </button>
          <input
            type="file"
            ref={imageRef}
            onChange={selectImage}
            accept="image/*"
          />
        </div>
      </div>
    </>
  )
}

export default ImageUpload;
