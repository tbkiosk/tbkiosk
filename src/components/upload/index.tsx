import { forwardRef, useState } from 'react'
import Image from 'next/image'
import { toast } from 'react-toastify'
import COS from 'cos-js-sdk-v5'
import STS from 'qcloud-cos-sts'
import cl from 'classnames'

import request from '@/utils/request'
import { TENCENT_COS_TEMP_BUCKET, TENCENT_COS_REGION, TENCENT_COS_CDN_DOMAIN } from '@/constants/cos'

import { Loading } from '../loading'

import type { ResponseBase } from '@/types/response'

type UploadProps = {
  className?: string
  id: string
  maxSize?: number
  value: string | undefined
  onChange: (newValue: string) => void
}

export const Upload = forwardRef<HTMLInputElement, UploadProps>(({ className, id, maxSize = 2 * 1024 * 1024, onChange, value }, ref) => {
  const [uploading, setUploading] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget?.files?.[0]
    if (!file) return
    if (file.size > maxSize) {
      toast.error(`Image should not be larger than ${maxSize / 1024 / 1024}MB`)
      return
    }

    setUploading(true)

    const fileNameArray = file.name.split('.')
    const extension = fileNameArray.at(-1)
    const fileName = fileNameArray.slice(0, fileNameArray.length - 1).join('')

    if (!extension || !fileName) {
      toast.error('Invalid file name')
      setUploading(false)
      return
    }

    if (['jpg', 'jpeg', 'png'].indexOf(extension) < 0) {
      toast.error('Not supported image type')
      setUploading(false)
      return
    }

    const cos = new COS({
      getAuthorization: async (options, callback) => {
        const res = await request<ResponseBase<STS.CredentialData>>(`/api/cos/credentials/${TENCENT_COS_TEMP_BUCKET}`)

        const data = res?.data?.data
        if (!data) {
          toast.error('No credentials received')
          return
        }

        callback({
          TmpSecretId: data.credentials.tmpSecretId,
          TmpSecretKey: data.credentials.tmpSecretKey,
          SecurityToken: data.credentials.sessionToken,
          StartTime: data.startTime,
          ExpiredTime: data.expiredTime,
        })
      },
    })

    cos.uploadFile(
      {
        Bucket: TENCENT_COS_TEMP_BUCKET,
        Region: TENCENT_COS_REGION,
        Key: `${fileName}-${+new Date()}.${extension}`, // make upload file exclusive
        Body: file,
        onProgress: progressData => progressData,
      },
      (err, data) => {
        if (err) {
          toast.error(err.message || 'No credentials received')
          setUploading(false)
          return
        }

        const imgUrl = `https://${TENCENT_COS_CDN_DOMAIN}/${data.Location.split('/').slice(1).join('')}`
        onChange(imgUrl)
        setUploading(false)
      }
    )
  }

  return (
    <div className="flex shrink-0 justify-center items-center">
      <label
        className={cl([
          'flex flex-col w-[7.5rem] max-w-[7.5rem] min-h-[2.625rem] font-bold border border-black cursor-pointer overflow-hidden',
          value && !uploading ? 'h-[7.5rem] p-2 bg-[#e3e3e4] rounded-lg' : 'px-8 py-2 rounded-3xl',
          'transition-colors hover:bg-[#e3e3e4]',
          className,
        ])}
        htmlFor={id}
      >
        <Loading isLoading={uploading}>
          <>
            {value ? (
              <Image
                alt=""
                className="h-full w-full object-contain cursor-pointer transition hover:opacity-70 hover:scale-105"
                height={128}
                src={value}
                width={128}
              />
            ) : (
              'Upload'
            )}
          </>
        </Loading>
      </label>
      <input
        accept="image/png, image/jpeg"
        className="hidden"
        disabled={uploading}
        id={id}
        onChange={handleChange}
        ref={ref}
        type="file"
      />
    </div>
  )
})

Upload.displayName = 'Upload'
