import { Header } from '@/components/Header'
import { VideoView } from '@/components/VideoView'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-3">
      <Header />
      <VideoView />
    </main>
  )
}
