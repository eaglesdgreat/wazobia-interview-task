import { faImage, faShareNodes, faVideo } from "@fortawesome/free-solid-svg-icons";

import { FC } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IEmbedProps } from "types";
import { Link } from "react-router-dom";

const EmbedModal: FC<IEmbedProps> = ({show}) => {
  if (!show) return null;

  return (
    <>
      <div className="app__modal">
        <div className='app__modal--header'><p>Embeds</p></div>
        <Link to="/embed-content/image">
          <div className='app__flex app__modal--items'>
            <div className='app__flex app__modal--items__icon'>
              <FontAwesomeIcon icon={faImage} />
            </div>
            <div className='app__modal--items__text'>
              <span>Picture</span>
              <p>Jpeg, png</p>
            </div>
          </div>
        </Link>

        <Link to="/embed-content/video">
          <div className='app__flex app__modal--items'>
            <div className='app__flex app__modal--items__icon'>
              <FontAwesomeIcon icon={faVideo} />
            </div>
            <div className='app__modal--items__text'>
              <span>Video</span>
              <p>JW player, Youtube, Vimeo</p>
            </div>
          </div>
        </Link>

        <Link to="/embed-content/social">
          <div className='app__flex app__modal--items'>
            <div className='app__flex app__modal--items__icon'>
              <FontAwesomeIcon icon={faShareNodes} />
            </div>
            <div className='app__modal--items__text'>
              <span>Social</span>
              <p>Instagram, Twitter, TikTok, Snapchat, Facebook</p>
            </div>
          </div>
        </Link>
      </div>
    </>
  )
}

export default EmbedModal
