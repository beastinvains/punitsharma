import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PixelSnow from '../components/snowbg';

export default function Layout() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }} >
  <PixelSnow 
    color="#ffffff"
    flakeSize={0.01}
    minFlakeSize={1.25}
    pixelResolution={200}
    speed={1.25}
    density={0.3}
    direction={125}
    brightness={1}
    depthFade={8}
    farPlane={20}
    gamma={0.4545}
    variant="snowflake"
    className=' -z-10 bg-slate-950'
/>
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <Outlet />
      </main>
      <footer className="mx-auto w-full max-w-6xl px-4 pb-8 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Your Portfolio
      </footer>
    </div>
</div>

  )
}

