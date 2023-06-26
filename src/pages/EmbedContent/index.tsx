import "styles/embed.scss";

import { useContext, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';

import { EmbedContext } from "context/embed";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ImageUpload from "./components/ImageUpload";
import SocialLink from "./components/SocialLink";
import { Types } from "reducers/embed"
import VideoUpload from "./components/VideoUpload";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const EmbedContent = () => {
  const [showUrl, setShowUrl] = useState(false)
  const { state, dispatch } = useContext(EmbedContext);

  const { type } = useParams();
  const navigate = useNavigate();

  const backToHome = () => navigate(-1)

  const getEmbedData = (data: any) => {
      const defaultPayload = { type: "paragraph", children: [{ text: "" }] };
      const youtubeRegex = /^(?:(?:https?:)?\/\/)?(?:(?:www|m)\.)?(?:(?:youtube\.com|youtu.be))(?:\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(?:\S+)?$/

      if (type === 'image' && data) {
      const imgPayload = { type: 'image', url: data, children: [{ text: '' }] }
      
      dispatch({
        type: Types.EditorText,
        payload: [ ...state.editor, imgPayload, defaultPayload],
      })

      return backToHome()
    }

    if (type === 'video' && data) {
      const matches = data.match(youtubeRegex)
      const [_, videoId] = matches;
      
      const videoUrl = `https://www.youtube.com/embed/${videoId}`
      const videoPayload = { type: 'video', url: videoUrl, children: [{ text: '' }] }

      dispatch({
        type: Types.EditorText,
        payload: [ ...state.editor, videoPayload, defaultPayload],
      })

      return backToHome()
    }

    if (type === 'social' && data.url) {
      dispatch({
        type: Types.Video,
        payload: data
      })
      return backToHome()
    }
    alert("error no file found!")
  }

  const handleSubmit = () => {
    setShowUrl(!showUrl)
  }

  return (
    <>
      <div className='app__flex embed'>
        <div className="embed__container">
          <div className="embed__container--header">
            <span>Embed</span>
            <button onClick={backToHome}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
          {type === "image" && <ImageUpload showUrl={showUrl} imageEmbedData={getEmbedData} />}
          {type === "video" && <VideoUpload showUrl={showUrl} videoEmbedData={getEmbedData} />}
          {type === "social" && <SocialLink showUrl={showUrl} socialEmbedData={getEmbedData} />}
          <div className="embed__container--submit">
            <button className="embed__container--submit__success" onClick={handleSubmit}>Embed</button>
            <button className="embed__container--submit__cancel" onClick={backToHome}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default EmbedContent;
