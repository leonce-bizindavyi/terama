import Home from "@/components/Home/Home"
import Title from "@/components/Title"
import Link from "next/link"
import React from "react"

function HomePage({ videos }) {
  return (
    <>
      <Title title={`TeramaFlix`} />
      <Home videos={videos} />
      <Link href="/downloads">
        Aller à la page des téléchargements
      </Link>
    </>
  )
}


export default HomePage
export async function getServerSideProps() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts/slides/0/10`)
  const data = await response.json()
  return {
    props: {
      videos: data
    }
  }
}