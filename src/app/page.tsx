import AnimatedWaveBackground from "@/components/ui/AnimatedWaveBackground";
import AnimatedWaveBackground2 from "@/components/ui/AnimatedWaveBackground2";
import WaveRibbonBackground from "@/components/ui/WaveRibbonBackground";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");
  return (
    <main className="bg-yellow-300 text-black">
      <AnimatedWaveBackground className="min-h-screen">
        <div className="flex flex-col items-center justify-center h-screen text-white">
          <h1 className="text-5xl font-bold">{t("title")}</h1>
          <p className="mt-4 text-xl">{t("description")}</p>
          <button className="mt-4 bg-white text-black py-2 px-4 rounded-md hover:bg-gray-200">
            {t("cta")}
          </button>
        </div>
      </AnimatedWaveBackground>
      <div className="flex">
        {/* <AnimatedWaveBackground2
          lineCount={40} // more lines = denser ribbon
          amplitude={70} // taller waves
          speed={0.015} // slower animation
          colorStops={["#4a90e2", "#5bc8d8", "#2a2a2a", "#a0a0a0"]}
          className="min-h-screen"
        >
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold text-gray-800">Your Title</h1>
          </div>
        </AnimatedWaveBackground2> */}
        <WaveRibbonBackground>
          <div className="flex flex-col items-center justify-center h-screen"></div>
        </WaveRibbonBackground>
        <WaveRibbonBackground className="scale-x-[-1]">
          <div className="flex flex-col items-center justify-center h-screen"></div>
        </WaveRibbonBackground>
      </div>
    </main>
  );
}
