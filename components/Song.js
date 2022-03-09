import useSpotify from '../hooks/useSpotify'
import { milisecondsToMinutesAndSeconds } from '../lib/time'

function Song({ order, track }) {
  const spotifyApi = useSpotify()
  const { track: song } = track
  return (
    <div className="grid cursor-pointer grid-cols-2 rounded-lg py-4 px-5 text-gray-500 hover:bg-gray-900">
      <div className="flex items-center space-x-4 ">
        <p>{order + 1}</p>
        <img
          className="h-10 w-10"
          src={song?.album.images[0]?.url}
          alt="song cover img"
        />
        <div>
          <p className="w-36 truncate text-white lg:w-64">{song?.name}</p>
          <p className="w-40"> {song?.artists[0].name}</p>
        </div>
      </div>

      <div className="ml-auto flex items-center justify-between md:ml-0">
        <p className="hidden w-40 md:inline">{song?.album.name}</p>
        <p>{milisecondsToMinutesAndSeconds(song?.duration_ms)}</p>
      </div>
    </div>
  )
}

export default Song
