import { useNavigate } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import { MdWifiOff } from "react-icons/md";

function ConnectionStatusPage() {
    return (
        <div className="flex h-screen min-h-screen flex-col items-center justify-center gap-6 px-4 text-center bg-[#181A20]">
            <ConnectionError />
        </div>
    );
}

const errorBoxVariants: Variants = {
    initial: { opacity: 0, scale: 0.93, y: 40 },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.65,
            // @ts-ignore
            ease: [0.16, 1, 0.3, 1]
        }
    },
};

const iconVariants: Variants = {
    initial: { scale: 0.8, rotate: 0 },
    animate: {
        scale: [0.8, 1.2, 1],
        rotate: [0, -7, 7, -7, 0],
        transition: { duration: 1.2, type: "spring", repeat: Infinity, repeatDelay: 2 }
    }
};

const ConnectionError = () => {
    const navigate = useNavigate();
    const reloadPage = () => window.location.reload();
    const gotoHomePage = () => navigate("/");

    return (
        <motion.div
            variants={errorBoxVariants}
            initial="initial"
            animate="animate"
            className="flex flex-col items-center gap-4 bg-[#22252e] rounded-2xl shadow-xl p-8"
        >
            <motion.div
                variants={iconVariants}
                initial="initial"
                animate="animate"
                className="mb-2"
            >
                <MdWifiOff className="text-red-400" size={70} />
            </motion.div>
            <span className="whitespace-break-spaces text-lg font-semibold text-slate-200">
                Oops! Something went wrong. Please try again
            </span>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
                <motion.button
                    whileHover={{ scale: 1.07, boxShadow: "0 2px 18px #22d3ee80" }}
                    whileTap={{ scale: 0.97 }}
                    className="mr-4 rounded-md bg-primary px-8 py-2 font-bold text-black shadow"
                    onClick={reloadPage}
                    type="button"
                >
                    Try Again
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.07, boxShadow: "0 2px 18px #a3e63599" }}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-md bg-primary px-8 py-2 font-bold text-black shadow"
                    onClick={gotoHomePage}
                    type="button"
                >
                    Go to HomePage
                </motion.button>
            </div>
        </motion.div>
    );
};

export default ConnectionStatusPage;
