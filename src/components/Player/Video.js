import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePeriod } from '../Hooks/usePeriod'
import { useState,useEffect } from 'react'

function Video({ video }) {
  const [online, setOnline] = useState(true);
  const period = usePeriod(video.Created_at)
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [profBlobUrl, setProfBlobUrl] = useState(null);

  useEffect(()=>{
    const handleOnlineStatusChange = () =>{
      setOnline(navigator.onLine);
    };
    window.addEventListener('online',handleOnlineStatusChange);
    window.addEventListener('offline',handleOnlineStatusChange);
    setOnline(navigator.onLine);
    return () =>{
      window.removeEventListener('online' ,handleOnlineStatusChange);
      window.removeEventListener('offline',handleOnlineStatusChange);
    }

  },[]);
  useEffect(() => {
    const getThumbnailFromCache = async () => {
      try {
        const cache = await caches.open('downloaded-videos-cache');
        const response = await cache.match(`/Thumbnails/${video.Image}`);
        if (response) {
          const blob = await response.blob();
          setThumbnailUrl(URL.createObjectURL(blob));
        }
      } catch (error) {
        console.error('Error fetching thumbnail from cache:', error);
      }
    };

    if (!online && video && video.Image) {
      getThumbnailFromCache();
    }
    const fetchProfile = async (photo) => {
      try {
        if (photo && !online) {
          const cache = await caches.open('mon-site-logo')
          const response = await cache.match(`/Thumbnails/${photo}`);
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          setProfBlobUrl(blobUrl);
        } else {
          const cache = await caches.open('mon-site-logo');
          const response =await cache.match('/img/logo.png');
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          setProfBlobUrl(blobUrl);
        }
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };
    fetchProfile(video.Photo)
  }, [online, video]);
  return (
    <>
      <div className="lg:h-[115px]   sm:h-[450px] w-full  overflow-hidden flex lg:flex-row flex-col lg:justify-center lg:items-start lg:space-x-2">
        <div className="imagevideo h-[200px] w-full md:h-[100%] lg:w-[45%]  lg:rounded overflow-hidden">
  
          {
            video.Short == 1 ?
              <Link href={`/short`} style={{ textDecolation: "none" }}>
                <Image src={thumbnailUrl ?  `${thumbnailUrl}` :`${process.env.NEXT_PUBLIC_URL}/Thumbnails/${video.Image}`}
                  width={800} height={800}
                  className="w-[100%]  h-[100%] object-fit" alt="videos"
                  priority={true} placeholder='blur'
                  blurDataURL="data:image/png;base64,...(base64-encoded image data)" />
              </Link>
              :
              <Link href={`/Watch?v=${video.uniid}`} style={{ textDecolation: "none" }}>
                <Image src={thumbnailUrl ?  `${thumbnailUrl}` :`${process.env.NEXT_PUBLIC_URL}/Thumbnails/${video.Image}`}
                  width={800} height={800}
                  className="w-[100%]  h-[100%] object-fit" alt="videos"
                  priority={true} placeholder='blur'
                  blurDataURL="data:image/png;base64,...(base64-encoded image data)" />
              </Link>
          }
        </div>
        <div className="descriptionV flex flex-col  space-y-1 pl-2 lg:p-3 lg:h-[100%] h-[20%] w-full bg-gray-100 lg:w-[60%] lg:rounded">
          <Link href={`/profile?c=${video.uniid}`}>
            <div className="videoName font-semibold lg:text-[18px] text-[18px]">{video.Title}</div>
            <div className="profilChannel  flex justify-start items-center space-x-2  cursor-pointer ">
              {
                video.Photo?
                  <Image width={500} height={500} alt='profile'
                    className=" w-10  h-10 my-1 ml-15 rounded-full "
                    src={online || !profBlobUrl ? `${process.env.NEXT_PUBLIC_URL}/Thumbnails/${video.Photo}`: profBlobUrl}
                    priority={true} placeholder='blur'
                    blurDataURL="data:image/png;base64,...(base64-encoded image data)" />
                  :
                  <Image width={500} height={500} alt='profile'
                    className=" w-10  h-10 my-1 ml-15 rounded-full "
                    src={online || !profBlobUrl ?`/img/logo.png`:profBlobUrl}
                    priority={true} placeholder='blur'
                    blurDataURL="data:image/png;base64,...(base64-encoded image data)" />
              }
              <div className="flex flex-col  space-y-2">
                <div className="right-5">
                  <div className="text-md text-slate-900 opacity-90  font-bold">{video.PageName}</div>
                  <span className="text-xs text-slate-900 opacity-70 font-semibold">{video.Views} Views  {period}</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Video

