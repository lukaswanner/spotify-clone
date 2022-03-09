import { signOut, useSession } from 'next-auth/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { useEffect, useState } from 'react'
import { shuffle } from 'lodash'
import { useRecoilValue, useRecoilState } from 'recoil'
import { playlistIdState, playlistState} from '../atoms/playlistAtom'
import useSpotify from '../hooks/useSpotify'
import Songs from './Songs'

const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-green-500',
  'from-red-500',
  'from-yellow-500',
  'from-pink-500',
  'from-purple-500',
]

export default function Center() {
  const { data: session } = useSession()
  const spotifyApi = useSpotify()
  const [color, setColor] = useState(null)
  const playlistId = useRecoilValue(playlistIdState)
  const [playlist, setPlaylist] = useRecoilState(playlistState)

  useEffect(() => {
    setColor(shuffle(colors).pop())
  }, [playlistId])

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body)
      })
      .catch((error) => console.log('Something went wrong!', error))
  }, [spotifyApi, playlistId])

  console.log('current playlist:', playlist)
  return (
    <div className="h-screen flex-grow overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          className="flex items-center space-x-3 rounded-full bg-black p-1 pr-2 text-white opacity-90 hover:opacity-80"
          onClick={signOut}
        >
          <img
            className="h-10 w-10 rounded-full "
            //hier noch standard img hinzufügen
            src={session?.user.image}
            alt="user profile img"
          />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      <section
        className={`flex h-80 items-end space-x-7 bg-gradient-to-b ${color} to-black p-8 text-white`}
      >
        <img
          className="h-44 w-44 shadow-2xl"
          src={playlist?.images?.[0]?.url}
          alt="playlistcover img"
        />
        <div>
          <p>PLAYLIST</p>
          <h2 className="text-2xl font-bold md:text-3xl xl:text-5xl">
            {playlist?.name}
          </h2>
        </div>
      </section>

      <section>
        <Songs />
      </section>
    </div>
  )
}
