import TextToSpeech from '../components/TextToSpeech'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">文字转语音</h1>
        <TextToSpeech />
      </div>
    </main>
  )
}