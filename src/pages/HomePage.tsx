import illustration from "../assets/illustration.svg"
import FormComponent from "@/components/forms/FormComponent"
// import Footer from "@/components/common/Footer";

function HomePage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-16">
            <div className="my-12 flex h-full min-w-full flex-col items-center justify-evenly sm:flex-row sm:pt-0">
                <div className="flex w-full justify-center sm:w-1/2 sm:pl-4">
                    <img
                        src={illustration}
                        alt="Code Sync Illustration"
                        className="mx-auto w-[250px] sm:w-[400px] glow-pulse"
                    />
                </div>
                <div className="flex w-full items-center justify-center sm:w-1/2 glow-pulse">
                    <FormComponent />
                </div>
            </div>
            {/* <Footer /> */}
            <style jsx global>{`
                @keyframes glowPulse {
                  0%, 100% {
                    filter: drop-shadow(0 0 0px #71c7ec) drop-shadow(0 0 2px #71c7ec);
                  }
                  50% {
                    filter: drop-shadow(0 0 18px #71c7ec) drop-shadow(0 0 38px #71c7ec);
                  }
                }
                .glow-pulse {
                  animation: glowPulse 8s ease-in-out infinite;
                  will-change: filter;
                  transition: filter 0.3s;
                }
            `}</style>
        </div>
    )
}

export default HomePage
