import SidebarButton from "@/components/sidebar/sidebar-views/SidebarButton";
import { useAppContext } from "@/context/AppContext";
import { useSocket } from "@/context/SocketContext";
import { useViews } from "@/context/ViewContext";
import useResponsive from "@/hooks/useResponsive";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import { ACTIVITY_STATE } from "@/types/app";
import { SocketEvent } from "@/types/socket";
import { VIEWS } from "@/types/view";
import { IoCodeSlash } from "react-icons/io5";
import { MdOutlineDraw } from "react-icons/md";
import cn from "classnames";
import { Tooltip } from "react-tooltip";
import React, { useState } from "react";
import { tooltipStyles } from "./tooltipStyles";
import { motion, AnimatePresence, Variants } from "framer-motion";

const buttonsOrder: VIEWS[] = [
  VIEWS.FILES,
  VIEWS.CHATS,
  VIEWS.COPILOT,
  VIEWS.RUN,
  VIEWS.CLIENTS,
  VIEWS.SETTINGS,
];

const sidebarVariants: Variants = {
  hidden: { opacity: 0, x: -48, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    x: -32,
    filter: "blur(8px)",
    transition: { duration: 0.3 },
  },
};

const buttonListVariants: Variants = {
  visible: {
    transition: { staggerChildren: 0.11 },
  },
};

const modeVariants: Variants = {
  pulse: {
    rotate: [0, 13, -11, 0],
    boxShadow: [
      "0 0 0px #228be6",
      "0 0 24px #228be6",
      "0 0 0px #228be6",
    ],
    backgroundColor: ["#3D404A", "#228be6", "#3D404A"],
    transition: { duration: 0.45 },
  },
  rest: { boxShadow: "0 0 0px #228be6", rotate: 0 },
};

const Sidebar: React.FC = () => {
  const {
    activeView,
    isSidebarOpen,
    viewComponents,
    viewIcons,
    setIsSidebarOpen,
  } = useViews();
  const { minHeightReached } = useResponsive();
  const { activityState, setActivityState } = useAppContext();
  const { socket } = useSocket();
  const { isMobile } = useWindowDimensions();

  const [showTooltip, setShowTooltip] = useState(true);
  const [modePulse, setModePulse] = useState(false);

  const changeState = () => {
    setShowTooltip(false);
    setModePulse(true);
    setTimeout(() => setModePulse(false), 460);

    if (activityState === ACTIVITY_STATE.CODING) {
      setActivityState(ACTIVITY_STATE.DRAWING);
      socket.emit(SocketEvent.REQUEST_DRAWING);
    } else {
      setActivityState(ACTIVITY_STATE.CODING);
    }

    if (isMobile) setIsSidebarOpen(false);
  };

  return (
    <aside className="flex w-full md:h-full md:max-h-full md:min-h-full md:w-auto">
      <AnimatePresence>
        {!minHeightReached && (
          <motion.div
            className={cn(
              "fixed bottom-0 left-0 z-50 flex h-[50px] w-full gap-3 self-end overflow-hidden border-t border-darkHover bg-dark/90 p-2 md:static md:h-full md:w-[54px] md:min-w-[54px] md:flex-col md:border-r md:border-t-0 md:p-2 md:pt-4"
            )}
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              background: "linear-gradient(135deg, #232429 82%, #364FC7 100%)",
              backdropFilter: "blur(10px)",
            }}
          >
            <motion.div
              variants={buttonListVariants}
              initial="hidden"
              animate="visible"
              className="flex gap-2 md:flex-col md:gap-2"
            >
              {buttonsOrder.map((view, i) => (
                <SidebarButton
                  key={view}
                  viewName={view}
                  icon={viewIcons[view]}
                  isActive={activeView === view}
                  index={i}
                />
              ))}

              <motion.div
                className="flex h-fit items-center justify-center"
                variants={buttonListVariants}
              >
                <motion.button
                  className="justify-center flex items-center rounded p-1.5 shadow-lg transition-colors duration-200 ease-in-out hover:bg-[#3D404A]"
                  onClick={changeState}
                  onMouseEnter={() => setShowTooltip(true)}
                  data-tooltip-id="activity-state-tooltip"
                  data-tooltip-content={
                    activityState === ACTIVITY_STATE.CODING
                      ? "Switch to Drawing Mode"
                      : "Switch to Coding Mode"
                  }
                  animate={modePulse ? "pulse" : "rest"}
                  variants={modeVariants}
                  whileHover={{
                    scale: 1.15,
                    boxShadow: "0 0 18px #228be6",
                  }}
                  whileTap={{ scale: 0.92 }}
                  style={{
                    background:
                      "linear-gradient(135deg,#25282e 70%,#228be6 100%)",
                  }}
                  type="button"
                >
                  {activityState === ACTIVITY_STATE.CODING ? (
                    <MdOutlineDraw size={28} />
                  ) : (
                    <IoCodeSlash size={28} />
                  )}
                </motion.button>
                {showTooltip && (
                  <Tooltip
                    id="activity-state-tooltip"
                    place="right"
                    offset={15}
                    className="!z-50"
                    style={tooltipStyles}
                    noArrow={false}
                    positionStrategy="fixed"
                    float={true}
                  />
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className="absolute left-0 top-0 z-20 w-full flex-col bg-dark md:static md:min-w-[300px]"
        style={isSidebarOpen ? {} : { display: "none" }}
      >
        {viewComponents[activeView]}
      </div>
    </aside>
  );
};

export default Sidebar;
