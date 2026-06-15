import React, { useEffect, useRef } from 'react'
import LineWaves from '../components/LineWaves'
import GradientText from '@/components/GradientText'
import { animateSlideUp } from '@/App';




const Landing = () => {
    const myRef = useRef(null);
    
    useEffect(() => {
      animateSlideUp(".heroText");
    }, []);
    return (
        <>
            <main className="h-screen bg-black w-full py-24 px-16 relative">
                <div className="absolute overflow-clip inset-0 z-10">
                    <LineWaves
                        speed={0.3}
                        innerLineCount={32}
                        outerLineCount={36}
                        warpIntensity={1}
                        rotation={-45}
                        edgeFadeWidth={0}
                        colorCycleSpeed={1}
                        brightness={0.2}
                        color1="#ff5eea"
                        color2="#ffffff"
                        color3="#da31a6"
                        enableMouseInteraction
                        mouseInfluence={1}
                    />
                </div>
                <div className="absolute inset-0 z-15 bg-linear-to-r from-black via-black/80 to-black/0 pointer-events-none"></div>
                <div className="absolute inset-0 z-20 flex justify-center items-center pointer-events-none p-20">
                    <div className="p-20 h-full w-full justify-center flex items-center gap-6">
                        <div className="flex items-start justify-start flex-col w-full h-full heroText">
                            <h1 className='text-6xl text-white'>Unleash your creativity with</h1>
                            <h1 className='text-8xl  '>
                                <GradientText
                                    colors={["#d8b9ff", "purple", "purple"]}
                                    animationSpeed={8}
                                    showBorder={false}
                                    className="custom-class"
                                >
                                    CodeCanvas
                                </GradientText>
                            </h1>
                            <div className="hidden lg:flex items-center gap-3 mt-8">
                                <p className="text-white">

                                    Design the way you think. CodeCanvas gives you a visual canvas to build interfaces by hand — placing elements, arranging layouts, and styling freely — then turns everything you've built into clean, production-ready React TSX. No handoff. No translation layer. Just your design, as real code.
                                </p>
                            </div>
                            <div className="hidden lg:flex items-center gap-3 py-16">
                                <a
                                    href="#signup"
                                    className="text-md font-semibold px-6 py-2.5 rounded-full bg-linear-to-r from-black/80 to-purple-400 text-white shadow-md shadow--300/40 hover:shadow--300/60 hover:scale-105 transition-all duration-300"
                                >
                                    Get Started Free
                                </a>
                                <a
                                    href="#login"
                                    className={`text-md font-medium px-8 py-2.5 rounded-full transition-all duration-300 bg-black/30 text-white`}
                                >
                                    Learn More
                                </a>

                            </div>
                        </div>
                        <div className="flex items-center justify-start flex-col w-full h-full ">
                        </div>
                    </div>
                </div>
            </main>
            <main className="bg-red-500 h-screen w-full"></main>
        </>
    )
}

export default Landing