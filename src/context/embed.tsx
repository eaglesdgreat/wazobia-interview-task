import { Dispatch, FC, ReactElement, createContext, useReducer } from "react";
import { EmbedActions, embedReducer } from "reducers/embed";

import { IEmbedContextProps } from "types";

interface IProps {
  children: ReactElement;
}

const initialState = {
  video: "",
  socialLink: { code: "", url: "" },
  image: "",
  editor: [
    {
      type: "paragraph",
      children: [{text: ""}],
    }
  ]
}

// Creating context
export const EmbedContext = createContext<{state: IEmbedContextProps, dispatch: Dispatch<EmbedActions>}>({
  state: initialState,
  dispatch: () => null,
});

const EmbedProvider: FC<IProps> = ({ children }): ReactElement => {
  const [state, dispatch] = useReducer(embedReducer, initialState);

  const context = { state, dispatch };

  return <EmbedContext.Provider value={context}>{children}</EmbedContext.Provider>;
}

export default EmbedProvider;
