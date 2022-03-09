import Head from 'next/head'
import Sidebar from '../components/Sidebar'
import Center from '../components/Center'
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
      <div> {/* PLAYER */}</div>
    </>
  )
}

//2:26:09

export const getServerSideProps = async (context) => {
  const session = await getSession(context)

  return {
    props: {
      session,
    },
  }
}

export default Home
