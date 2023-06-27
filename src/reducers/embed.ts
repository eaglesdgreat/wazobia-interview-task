import { IEmbedContextProps, socialType } from "types";

import { Node } from 'slate';

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      }
};

export enum Types {
  Image = 'URL_IMAGE',
  Video = 'URL_VIDEO',
  Social = 'SOCIAL_LINK',
  EditorText = 'EDITOR_TEXT',
}

type EmbedPayload = {
  [Types.Image] : string
  [Types.Video] : string
  [Types.Social]: socialType
  [Types.EditorText]: Node[]
}

export type EmbedActions = ActionMap<EmbedPayload>[keyof ActionMap<EmbedPayload>];

export const embedReducer = (state: IEmbedContextProps, action: EmbedActions) => {
  switch (action.type) {
    case Types.Image:
      return { ...state, image: action.payload };
    case Types.Video:
      return { ...state, video: action.payload };
    case Types.Social:
      return { ...state, socialLink: action.payload };
    case Types.EditorText:
        return { ...state, editor: action.payload };
    default:
      return state;
  }
}
