import { useSession } from 'next-auth/react'
import { useRecoilState } from 'recoil'
import useSpotify from '../hooks/useSpotify'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import useSongInfo from '../hooks/useSongInfo'
import { useEffect, useState, useCallback } from 'react'
import { HeartIcon, VolumeUpIcon as VolumenDownIcon } from '@heroicons/react/outline'
import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  VolumeUpIcon,
  SwitchHorizontalIcon,
  RewindIcon,
} from '@heroicons/react/solid'
import { debounce } from 'lodash'

function Player() {
  const spotifyApi = useSpotify()
  const { data: session } = useSession()
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
  const [volume, setVolume] = useState(50)

  const songInfo = useSongInfo()

  const fetchCurrentSong = async () => {
    if (!songInfo) {
      const playingTrack = await spotifyApi.getMyCurrentPlayingTrack()
      setCurrentTrackId(playingTrack.body?.item?.id)
      const playingState = await spotifyApi.getMyCurrentPlaybackState()
      setIsPlaying(playingState.body?.is_playing)
    }
  }

  const handlePlayPause = async () => {
    const playBackState = await spotifyApi.getMyCurrentPlaybackState()
    if (playBackState.body?.is_playing) {
      await spotifyApi.pause()
      setIsPlaying(false)
    } else {
      await spotifyApi.play()
      setIsPlaying(true)
    }
  }

  const getDeviceActive = async () => {
    const active = (await spotifyApi.getMyDevices()).body.devices.length > 0
    return active
  }

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong()
      setVolume(50)
    }
  }, [currentTrackId, spotifyApi, session])

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debounceAdjustVolume(volume)
    }
  }, [volume])

  const debounceAdjustVolume = useCallback(
    debounce(async (volume) => {
      if (await getDeviceActive()) {
        try {
          await spotifyApi.setVolume(volume)
        } catch (error) {
          console.error('Cant set volume on your device')
        }
      }
    }, 500),
    []
  )

  return (
    <div className="grid h-24 grid-cols-3 bg-gradient-to-b from-black to-gray-900 px-2 text-xs text-white md:px-8 md:text-base">
      <div className="flex items-center space-x-4 ">
        <img
          className="hidden h-10 w-10 md:inline"
          src={songInfo?.album?.images?.[0]?.url}
          alt="Song Image Cover"
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon className="button" onClick={() => spotifyApi.skipToPrevious()} />
        {isPlaying ? (
          <PauseIcon className="button h-10 w-10" onClick={handlePlayPause} />
        ) : (
          <PlayIcon className="button h-10 w-10" onClick={handlePlayPause} />
        )}

        <FastForwardIcon className="button" onClick={() => spotifyApi.skipToNext()} />
        <ReplyIcon className="button" />
      </div>

      <div className="flex items-center justify-end space-x-3 pr-5 md:space-x-4">
        <VolumenDownIcon onClick={() => volume > 0 && setVolume(volume - 10)} className="button" />
        <input
          className="w-14 md:w-28"
          type="range"
          value={volume}
          min={0}
          max={100}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <VolumeUpIcon onClick={() => volume < 100 && setVolume(volume + 10)} className="button" />
      </div>
    </div>
  )
}

export default Player
