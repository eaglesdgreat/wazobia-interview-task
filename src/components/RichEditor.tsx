import "styles/editor.scss";

import { Button, Toolbar } from './RichTextControls';
import { Editable, ReactEditor, Slate, useFocused, useSelected, useSlate, useSlateStatic, withReact, } from 'slate-react';
import { Editor, Element, Node, Range, Transforms, createEditor } from 'slate';
import { FC, useCallback, useContext, useMemo, useState } from 'react';
import { ImageElement, LinkElement, RichEditorProps, SlateElement, formatType } from 'types';
import {
  faAlignCenter,
  faAlignJustify,
  faAlignLeft,
  faAlignRight,
  faBold,
  faCode,
  faHeading,
  faImage,
  faItalic,
  faLink,
  faListOl,
  faListUl,
  faQuoteRight,
  faUnderline,
} from "@fortawesome/free-solid-svg-icons";
import isHotkey, { isKeyHotkey } from 'is-hotkey';

import { EmbedContext } from "context/embed";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Types } from "reducers/embed"
import { css } from '@emotion/css'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'
import { withHistory } from "slate-history";

const HOTKEY: { [keyName: string]: string } = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

const RichEditor: FC<RichEditorProps> = () => {
  const [showToolbar, setShowToolbar] = useState(false)
  const renderElements = useCallback((props: any) => <Elements {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  const editor = useMemo(() => withInLines(withEmbeds(withImages(withHistory(withReact(createEditor()))))), []);
  const { state, dispatch } = useContext(EmbedContext);

  const onChangeEditorValue = (val: Node[]) => {
    dispatch({
      type: Types.EditorText,
      payload: val,
    })
  }

  return (
    <Slate editor={editor} value={state.editor} onChange={onChangeEditorValue}>
      {showToolbar && <Toolbar className="editor__toolbar">
          <DropDownButton />
          <AddLinkButton />
          <InsertEmbedButton icon="image" />

          <BlockButton format="left" icon="align_left" />
          <BlockButton format="right" icon="align_right" />
          <BlockButton format="center" icon="align_center" />

          <MarkButton format="bold" icon="bold" />
          <MarkButton format="italic" icon="italic" />
          
          <BlockButton format="bulleted-list" icon="list_bulleted" />
          <BlockButton format="numbered-list" icon="list_numbered" />
          
          <BlockButton format="block-quote" icon="in_quotes" />
        </Toolbar>
      }
      <Editable
        className={!showToolbar ? "editor pad" : "editor"}
        renderElement={renderElements}
        renderLeaf={renderLeaf}
        placeholder={!showToolbar ? "Add Content" : ""}
        spellCheck
        autoFocus
        onMouseDown={() => {
          setShowToolbar(true)
        }}
        onKeyDown={(event) => {
          const { selection } = editor;

          for (const hotkey in HOTKEY) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault();
              const mark = HOTKEY[hotkey];
              toggleMark(editor, mark);
            }
          }

          if (selection && Range.isCollapsed(selection)) {
            const { nativeEvent } = event
            if (isKeyHotkey('left', nativeEvent)) {
              event.preventDefault()
              Transforms.move(editor, { unit: 'offset', reverse: true })
              return
            }
            if (isKeyHotkey('right', nativeEvent)) {
              event.preventDefault()
              Transforms.move(editor, { unit: 'offset' })
              return
            }
          }
        }}
      />
    </Slate>
  )
}

const DropDownButton = () => {
  return (
    <>
      <select className="editor__select">
        <option value="paragraph">Paragraph</option>
      </select>
    </>
  )
}

const MarkButton = ({ format, icon }: formatType) => {
  const editor = useSlate()
  
  let thisIcon = faBold;
  let name = ""
  if (icon === "italic") {
    thisIcon = faItalic;
    name = "editor__border";
  } else if (icon === "underlined") {
    thisIcon = faUnderline;
  } else if (icon === "code") {
    thisIcon = faCode
  }

  return (
    <Button
      active={isMarkActive(editor, format)}
      className={name}
      onMouseDown={(event: any) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <FontAwesomeIcon icon={thisIcon} />
    </Button>
  )
}

const isMarkActive = (editor: Editor, format: string) => {
  const marks: any = Editor.marks(editor);
  return marks ? marks[format] === true : false;
}

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}

const BlockButton = ({ format, icon }: formatType) => {
  const editor = useSlate()

  let thisIcon = faHeading;
  let name = "";
  if (icon === "heading1") {
    thisIcon = faHeading;
  } else if (icon === "heading2") {
    thisIcon = faHeading;
  } else if (icon === "in_quotes") {
    thisIcon = faQuoteRight;
  } else if (icon === "list_numbered") {
    thisIcon = faListOl
  } else if (icon === "list_bulleted") {
    thisIcon = faListUl;
  } else if (icon === "align_center") {
    thisIcon = faAlignCenter
    name = "editor__border";
  } else if (icon === "align_left") {
    thisIcon = faAlignLeft
  } else if (icon === "align_right") {
    thisIcon = faAlignRight
  } else if (icon === "align_justify") {
    thisIcon = faAlignJustify
  }

  return (
    <Button
      active={isBlockActive(editor, format)}
      className={name}
      onMouseDown={(event: any) => {
        event.preventDefault();
        toggleBlock(editor, format)
      }}
    >
      <FontAwesomeIcon icon={thisIcon} />
    </Button>
  )
}

const isBlockActive = (editor: Editor, format: string, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n: Node) => !Editor.isEditor(n) && Element.isElement(n) && (n as any).type === format,
    })
  )

  return !!match;
}

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  )
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      LIST_TYPES.includes((n as any).type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })

  let newProperties: Partial<Element | SlateElement>
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    }
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
  }

  Transforms.setNodes<Element>(editor, newProperties as any)

  if (!isActive && isList) {
    const block = {type: format, children: []};
    Transforms.wrapNodes(editor, block);
  }
}

const withInLines = (editor: ReactEditor) => {
  const {
    insertData,
    insertText,
    isInline
  } = editor

  editor.isInline = element =>
    ['link', 'button', 'badge'].includes((element as any).type) || isInline(element)

  editor.insertText = text => {
    if (text && isUrl(text)) {
      wrapLink(editor, text)
    } else {
      insertText(text)
    }
  }

  editor.insertData = data => {
    const text = data.getData('text/plain')

    if (text && isUrl(text)) {
      wrapLink(editor, text)
    } else {
      insertData(data)
    }
  }

  return editor
}

const insertLink = (editor: Editor, url: string) => {
  if (editor.selection) {
    wrapLink(editor, url)
  }
}

const isLinkActive = (editor: Editor) => {
  const [link] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) && Element.isElement(n) && (n as any).type === 'link',
  })
  return !!link
}

const unwrapLink = (editor: Editor) => {
  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) && Element.isElement(n) && (n as any).type === 'link',
  })
}

const wrapLink = (editor: Editor, url: string) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor)
  }

  const { selection } = editor
  const isCollapsed = selection && Range.isCollapsed(selection)
  const link: LinkElement = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  }

  if (isCollapsed) {
    Transforms.insertNodes(editor, link)
  } else {
    Transforms.wrapNodes(editor, link, { split: true })
    Transforms.collapse(editor, { edge: 'end' })
  }
}

// Put this at the start and end of an inline component to work around this Chromium bug:
// https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
const InlineChromiumBugfix = () => (
  <span
    contentEditable={false}
    className={css`
      font-size: 0;
      cursor: pointer;
    `}
  >
    {String.fromCodePoint(160) /* Non-breaking space */}
  </span>
)

const AddLinkButton = () => {
  const editor = useSlate()
  return (
    <Button
      active={isLinkActive(editor)}
      onMouseDown={(event: any) => {
        event.preventDefault()
        const url = window.prompt('Enter the URL of the link:')
        if (!url) return
        insertLink(editor, url)
      }}
    >
      <FontAwesomeIcon icon={faLink} />
    </Button>
  )
}

/* const RemoveLinkButton = () => {
  const editor = useSlate()

  return (
    <Button
      active={isLinkActive(editor)}
      onMouseDown={(event: any) => {
        if (isLinkActive(editor)) {
          unwrapLink(editor)
        }
      }}
    >
      <FontAwesomeIcon icon={faLink} />
    </Button>
  )
} */

const InsertEmbedButton = ({ icon }: { icon: string }) => {
  const editor = useSlateStatic() as ReactEditor

  let thisIcon = faImage;
  let name = "editor__border"

  if (icon === "image") {
    thisIcon = faImage
    name = "editor__border";
  }

  return (
    <Button
      className={name}
      onMouseDown={(event: any) => {
        event.preventDefault()
        const url = window.prompt('Enter the URL of the image:')
        if (url && !isImageUrl(url)) {
          alert('URL is not an image')
          return
        }
        url && insertImage(editor, url)
      }}
    >
      <FontAwesomeIcon icon={thisIcon} />
    </Button>
  )
}

const isImageUrl = (url: string) => {
  if (!url) return false
  if (!isUrl(url)) return false
  const ext = new URL(url).pathname.split('.').pop() as any
  return imageExtensions.includes(ext)
}

const withImages = (editor: ReactEditor) => {
  const { insertData, isVoid } = editor

  editor.isVoid = element => {
    return (element as any).type === 'image' ? true : isVoid(element)
  }

  editor.insertData = (data: any) => {
    const text = data.getData('text/plain')
    const { files } = data

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader()
        const [mime] = file.type.split('/')

        if (mime === 'image') {
          reader.addEventListener('load', () => {
            const url = reader.result
            insertImage(editor, url)
          })

          reader.readAsDataURL(file)
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text)
    } else {
      insertData(data)
    }
  }

  return editor
}

const insertImage = (editor: ReactEditor, url: any) => {
  if (!url) return;

  const text = { text: '' }
  const image: ImageElement = { type: 'image', url, children: [text] }
  Transforms.insertNodes(editor, image)
}

const withEmbeds = (editor: ReactEditor) => {
  const { isVoid } = editor
  editor.isVoid = element => ((element as any).type === 'video' ? true : isVoid(element))
  return editor
}

const Elements = ({ attributes, children, element }: {attributes: any; children: any; element: any}) => {
  const style = { textAlign: element.align }

  switch (element.type) {
    case 'link':
      return <LinkComponent {...{ attributes, children, element }} />
    case 'video':
      return <VideoElement {...{ attributes, children, element }} />
    case 'image':
      return <Image {...{ attributes, children, element }} />
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      )
    case 'bulleted-list':
      return (
        <ul style={{ ...style, paddingLeft: '18px' }} {...attributes}>
          {children}
        </ul>
      )
    case 'heading-one':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      )
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      )
    case 'numbered-list':
      return (
        <ol style={{ ...style, paddingLeft: '18px' }} {...attributes}>
          {children}
        </ol>
      )
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      )
  }
}

const LinkComponent = ({ attributes, children, element }: {attributes: any; children: any; element: any}) => {
  const selected = useSelected()

  return (
    <>
      <div
        dangerouslySetInnerHTML={{ __html: element.code }}
        className={css`
          position: relative;
          border-radius: 4px;
          padding: 15px 0;
        `}
      ></div>
    </>
  )
}

const VideoElement = ({ attributes, children, element }: {attributes: any; children: any; element: any}) => {
  const { url } = element
  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <div
          className={css`
            position: relative;
            border-radius: 4px;
          `}
        >
          <iframe
            src={url}
            title={url}
            aria-label="video"
            className={css`
              /* position: absolute; */
              top: 0;
              left: 0;
              padding: 15px 0;
              width: 41em;
              height: 22em;
              border: none
            `}
          />
        </div>
      </div>
      {children}
    </div>
  )
}

const Image = ({ attributes, children, element }: {attributes: any; children: any; element: any}) => {
  const selected = useSelected()
  const focused = useFocused()
  return (
    <div {...attributes}>
      {children}
      <div
        contentEditable={false}
        className={css`
          position: relative;
          margin: 15px 0;
          padding-bottom: 56.25%; /* 16:9 ratio */
          height: 0;
          overflow: hidden;
          width: 41em;
          height: 20.5em;
        `}
      >
        <img
          src={element.url}
          alt={element.url}
          className={css`
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 4px;
            box-shadow: ${selected && focused ? '0 0 0 3px transparent' : 'none'};
          `}
        />
      </div>
    </div>
  )
}

const Leaf = ({ attributes, children, leaf }: { attributes: any; children: any; leaf: any }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.code) {
    children = <code>{children}</code>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
}

export default RichEditor;
