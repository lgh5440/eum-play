import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import Settings from './pages/Settings'
import Stopwatch from './pages/Stopwatch'
import Timer from './pages/Timer'
import RandomPick from './pages/RandomPick'
import PhotoGuess from './pages/PhotoGuess'
import Chosung from './pages/Chosung'
import Dice from './pages/Dice'
import Bingo from './pages/Bingo'
import WordRelay from './pages/WordRelay'
import SentenceMatch from './pages/SentenceMatch'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ErrorBoundary>
        <div className="min-h-screen">
          <Routes>
            <Route path="/"               element={<Home />} />
            <Route path="/settings"       element={<Settings />} />

            {/* 게임 */}
            <Route path="/stopwatch"      element={<Stopwatch />} />
            <Route path="/timer"          element={<Timer />} />
            <Route path="/random-pick"    element={<RandomPick />} />
            <Route path="/photo-guess"    element={<PhotoGuess />} />
            <Route path="/chosung"        element={<Chosung />} />
            <Route path="/dice"           element={<Dice />} />
            <Route path="/bingo"          element={<Bingo />} />
            <Route path="/word-relay"     element={<WordRelay />} />
            <Route path="/sentence-match" element={<SentenceMatch />} />

            {/* 그 외 → 홈 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
