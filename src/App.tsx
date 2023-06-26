import "styles/style.scss";

import { useContext, useState } from "react";

import { EmbedContext } from "context/embed";
import EmbedModal from './components/EmbedModal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RichEditor from "components/RichEditor"
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [showEmbed, setShowEmbed] = useState(false);
  const { state } = useContext(EmbedContext);
  const show = (state.editor[0] as any).children[0].text;

  const showEmbedModal = () => {
    setShowEmbed(!showEmbed)
  }

  return (
    <div className="app">
      <div className="app__flex app__flex--padding">
        <div className="app__container">
          <hr />
          <div className="app__container--items">
            <h1>Add post title</h1>
            <RichEditor />
            {show &&
              <button className="app__embed" onClick={showEmbedModal}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            }
            <EmbedModal show={showEmbed} />
          </div>
        </div>
        <div className="app__flex app__bottom">
          0/1000 words
        </div>
        <div className="app__flex app__btn">
          <button className="app__btn--item">
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
