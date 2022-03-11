import { useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import spotifyApi from '../lib/spotify'

function useSpotify() {
  const { data: session } = useSession()

  useEffect(() => {
    if (session !== undefined) {
      if (
        session.error === 'RefreshAccessTokenError' ||
        new Date(session.expires).valueOf() < Date.now()
      ) {
        signIn()
      } else {
        spotifyApi.setAccessToken(session.user.accessToken)
      }
    }
  }, [session])

  return spotifyApi
}

export default useSpotify
