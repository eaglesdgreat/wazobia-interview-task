import { ChangeEvent, FC, useEffect, useState } from 'react';

import { IEmbedVideoProps } from "types"

interface IProps {
  videoEmbedData: (data: any) => void;
  showUrl: boolean
}

const VideoUpload: FC<IProps> = ({ videoEmbedData, showUrl }) => {
  const [form, setForm] = useState<IEmbedVideoProps>({ channel: "", url: "" })

  useEffect(() => {
    if (showUrl) {
      videoEmbedData(form.url)
    }
  }, [showUrl])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setForm({ ...form, [name]: value })
  }

  return (
    <>
      <div className="embed__container--video">
        <div className='embed__container--video__input'>
          <label>VIDEO PROVIDER</label>
          <select
            name='channel'
            value={form.channel}
            onChange={handleChange}
          >
            <option value="youtube">Youtube</option>
            <option value="netflix">Netflix</option>
          </select>
        </div>

        <div className='embed__container--video__input'>
          <label>URL</label>
          <input name='url' value={form.url} onChange={handleChange} />
        </div>
      </div>
    </>
  )
}

export default VideoUpload;
