import { useAppContext } from "@/context/AppContext";
import useResponsive from "@/hooks/useResponsive";
import { ACTIVITY_STATE } from "@/types/app";
import DrawingEditor from "../drawing/DrawingEditor";
import EditorComponent from "../editor/EditorComponent";
import { motion, AnimatePresence } from "framer-motion";

function WorkSpace() {
    const { viewHeight } = useResponsive();
    const { activityState } = useAppContext();

    // Animation variants for editors
    const variants = {
        initial: (direction) => ({
            opacity: 0,
            x: direction === "drawing" ? 60 : -60,
            scale: 0.96,
        }),
        animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
        exit: (direction) => ({
            opacity: 0,
            x: direction === "drawing" ? -60 : 60,
            scale: 0.96,
            transition: { duration: 0.4, ease: [0.7, 0.2, 0.3, 0.9] }
        }),
    };

    // Key is important for AnimatePresence transitions!
    const editorKey = activityState === ACTIVITY_STATE.DRAWING ? "drawing" : "editor";

    return (
        <div
            className="absolute left-0 top-0 w-full max-w-full flex-grow overflow-x-hidden md:static"
            style={{ height: viewHeight }}
        >
            <AnimatePresence mode="wait" initial={false}>
                {activityState === ACTIVITY_STATE.DRAWING ? (
                    <motion.div
                        key={editorKey}
                        custom="drawing"
                        variants={variants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="h-full w-full"
                    >
                        <DrawingEditor />
                    </motion.div>
                ) : (
                    <motion.div
                        key={editorKey}
                        custom="editor"
                        variants={variants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="h-full w-full"
                    >
                        <EditorComponent />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default WorkSpace;
