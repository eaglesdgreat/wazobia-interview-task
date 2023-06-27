import { ChangeEvent, FC, useEffect, useState } from 'react';
import { IEmbedSocialProps, ISocialProps } from "types"

const SocialLink: FC<ISocialProps> = ({ socialEmbedData, showUrl }) => {
  const [form, setForm] = useState<IEmbedSocialProps>({ social: "", url: "", code: "", disable: false })

  useEffect(() => {
    if (showUrl) {
      socialEmbedData({ url: form.url, code: form.code })
    }
  }, [showUrl])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setForm({ ...form, [name]: value })
  }

  const callback = () => {
    setForm({ ...form, disable: !form.disable })
  }

  return (
    <>
      <div className="embed__container--video">
        <div className='embed__container--video__input'>
          <label>SOCIAL MEDIA PLATFORM</label>
          <select
            name='social'
            value={form.social}
            onChange={handleChange}
          >
            <option value="facebook">Facebook</option>
            {/* <option value="twitter">Twitter</option> */}
          </select>
        </div>

        <div className='embed__container--video__input'>
          <label>URL</label>
          <input name='url' value={form.url} onChange={handleChange} />
        </div>

        <div className='embed__container--video__input'>
          <label>CODE</label>
          <input name='code' value={form.code} onChange={handleChange} />
        </div>

        <div className='embed__container--video__caption'>
          <label>Disable caption</label>
          
          <label className="embed__container--video__caption--toggle">
            <input type="checkbox" defaultChecked={form.disable} onClick={callback} />
            <span />
          </label>
        
        </div>
      </div>
    </>
  )
}

export default SocialLink;
