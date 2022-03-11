import Head from 'next/head'
import Sidebar from '../components/Sidebar'
import Center from '../components/Center'
import Player from '../components/Player'
import { getSession } from 'next-auth/react'
const Home = () => {
  return (
    <>
      <Head>
        <title>Spotify 2.0</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <div className="h-screen overflow-hidden bg-black ">
        <main className="flex">
          <Sidebar />
          <Center />
        </main>
      </div>
      <div className="sticky bottom-0">
        <Player />
      </div>
    </>
  )
}

//3:45:04

export const getServerSideProps = async (context) => {
  const session = await getSession(context)

  return {
    props: {
      session,
    },
  }
}

export default Home
