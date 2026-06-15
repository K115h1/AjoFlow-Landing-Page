import { Route, Routes } from 'react-router'
// import Landing from './pages/Landing'
// import Navbar from './components/Navbar'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const App = () => {
  return (
    <>
    {/* <Navbar/> */}
      <Routes>
        {/* <Route path='/' element={<Landing/>}/> */}
      </Routes>
    </>
  )
}

gsap.registerPlugin(ScrollTrigger);

export function animateSlideUp(
  target: string | Element | Element[],
  options?: { duration?: number; distance?: number; delay?: number; stagger?: number }
) {
  const { duration = 0.8, distance = 40, delay = 0, stagger = 0.15 } = options ?? {};

  gsap.fromTo(
    target,
    { y: distance, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration,
      delay,
      ease: "power3.out",
      stagger,
      fillOpacity: 0,
      scrollTrigger: {
        trigger: typeof target === "string" ? target : (target as Element[])[0] ?? target,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    }
  );
}

export default App