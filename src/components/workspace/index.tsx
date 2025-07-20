import { useAppContext } from "@/context/AppContext";
import useResponsive from "@/hooks/useResponsive";
import { ACTIVITY_STATE } from "@/types/app";
import DrawingEditor from "../drawing/DrawingEditor";
import EditorComponent from "../editor/EditorComponent";
import { motion, AnimatePresence, Variants } from "framer-motion";

type Direction = "drawing" | "editor";

// Animation variants for editors
const variants: Variants = {
  initial: (direction: Direction) => ({
    opacity: 0,
    x: direction === "drawing" ? 60 : -60,
    scale: 0.96,
  }),
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.5,
     
      ease: "easeInOut" , // Cubic bezier is valid for Framer Motion, but not typed. See note below!
    },
  },
  exit: (direction: Direction) => ({
    opacity: 0,
    x: direction === "drawing" ? -60 : 60,
    scale: 0.96,
    transition: {
      duration: 0.4,
      
      ease: "easeInOut", // Cubic bezier is valid for Framer Motion, but not typed. See note below!
    },
  }),
};

function WorkSpace() {
  const { viewHeight } = useResponsive();
  const { activityState } = useAppContext();

  // Key is important for AnimatePresence transitions!
  const editorKey = activityState === ACTIVITY_STATE.DRAWING ? "drawing" : "editor";
  const direction: Direction = activityState === ACTIVITY_STATE.DRAWING ? "drawing" : "editor";

  return (
    <div
      className="absolute left-0 top-0 w-full max-w-full flex-grow overflow-x-hidden md:static"
      style={{ height: viewHeight }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {activityState === ACTIVITY_STATE.DRAWING ? (
          <motion.div
            key={editorKey}
            custom={direction}
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
            custom={direction}
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
