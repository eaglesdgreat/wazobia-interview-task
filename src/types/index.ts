import { Descendant, Node } from 'slate'

export type formatType = { format: string, icon: string };

export type OrNull<T> = T | null

export type socialType = { url: string, code: string }

export type EmptyText = {
  text: string
}

export type ImageElement = {
  type: 'image'
  url: string
  children: EmptyText[]
}

export type LinkElement = { type: 'link'; url: string; children: Descendant[] }

export type VideoElement = { type: 'video'; url: string; children: EmptyText[] }

export interface SlateElement {
  type: string
  align: string;
  children: Node[]
}

export interface RichEditorProps {
  existingBody?: string;
}

export interface BaseProps {
  className: string;
  [key: string]: unknown;
}

export interface IEmbedProps {
  show: boolean
}

export interface IEmbedVideoProps {
  channel: string
  url: string
}

export interface IEmbedSocialProps {
  social: string
  url: string
  code: string
  disable: boolean
}

export interface IEmbedContextProps {
  video: string
  socialLink: socialType
  image: string
  editor: Node[]
}

export interface IImageProps {
  imageEmbedData: (data: any) => void;
  showUrl: boolean
}

export interface ISocialProps {
  socialEmbedData: (data: any) => void;
  showUrl: boolean
}

export interface IVideoProps {
  videoEmbedData: (data: any) => void;
  showUrl: boolean
}
