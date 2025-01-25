'use client';

import { useState } from 'react';
import useSWR from 'swr';

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

interface Voice {
  ShortName: string;
  LocalName: string;
  Language: string;
  Gender: string;
}

interface VoicesResponse {
  voices: Voice[];
}

const fetcher = (url: string) => fetch(url, {
  
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  },
}).then((res) => {
  if (!res.ok) {
    throw new Error('API request failed');
  }
  return res.json();
});

export default function TextToSpeech() {
  const { data, isLoading } = useSWR<VoicesResponse>('/api/voices', fetcher);
  const [error, setError] = useState('');

  const [text, setText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [speed, setSpeed] = useState(1.2);
  const [audioUrl, setAudioUrl] = useState('');
  const [converting, setConverting] = useState(false);


  // 从voices数据中提取唯一的语言列表
  const languages = data?.voices 
    ? [...new Set(data.voices.map(voice => voice.language))]
    : [];

  // 根据选择的语言筛选性别
  const genders = data?.voices && selectedLanguage
    ? [...new Set(data.voices
        .filter(voice => voice.language === selectedLanguage)
        .map(voice => voice.gender))]
    : [];

  // 根据选择的语言和性别筛选可用的声音
  const availableVoices = data?.voices && selectedLanguage && selectedGender
    ? data.voices.filter(
        voice => 
          voice.language === selectedLanguage && 
          voice.gender === selectedGender
      )
    : [];

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    setSelectedGender('');
    setSelectedVoice('');
  };

  const handleGenderChange = (value: string) => {
    setSelectedGender(value);
    setSelectedVoice('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || !selectedVoice) return;

    try {
      setConverting(true);
      const response = await fetch('/api/audio/speech', {
        method: 'POST',
        
        headers: {
          'Content-Type': 'application/json',
           'Authorization': `Bearer ${apiKey}`
        },
        
        body: JSON.stringify({
          "input": text,
          "model": 'tts-1',
          "voice": selectedVoice,
          "speed": speed
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.text();
  console.error('API Error:', response.status, errorData);
        throw new Error('转换请求失败');
      }
  
      // 获取音频数据并创建 Blob URL
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
    } catch (err) {
      console.error('转换失败:', err);
    } finally {
      setConverting(false);
    }
  };

  if (error) {
    return <div className="text-red-500">加载失败: {error.message}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Text Input */}
        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
            输入文字 (最多4096字符)
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            maxLength={4096}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-4">
          {/* Language Select */}
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
              选择语言
            </label>
            <select
              id="language"
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="">请选择语言...</option>
              {languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>

          {/* Gender Select */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
              选择男女声
            </label>
            <select
              id="gender"
              value={selectedGender}
              onChange={(e) => handleGenderChange(e.target.value)}
              disabled={!selectedLanguage || isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">请选择男女声...</option>
              {genders.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
          </div>

          {/* Voice Select */}
          <div>
            <label htmlFor="voice" className="block text-sm font-medium text-gray-700 mb-2">
              选择声音
            </label>
            <select
              id="voice"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              disabled={!selectedGender || isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">请选择声音...</option>
              {availableVoices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name}
                </option>
              ))}
            </select>
          </div>

          {/* Speed Input */}
          <div>
            <label htmlFor="speed" className="block text-sm font-medium text-gray-700 mb-2">
              语速 (0.25 - 4.0)
            </label>
            <input
              type="number"
              id="speed"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              min={0.25}
              max={4.0}
              step={0.1}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={converting || !text || !selectedVoice}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {converting ? '转换中...' : '转换'}
          </button>
        </div>
      </form>
      {error && (
  <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
    {error}
  </div>
)}

      {/* Audio Player */}
      {audioUrl && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">转换结果</h2>
          <div className="space-y-4">
            <audio controls src={audioUrl} className="w-full" />
            <div className="flex justify-center">
              <a
                href={audioUrl}
                download="tts-output.mp3"
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                下载MP3
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}