import { useChatRoom } from "@/context/ChatContext";
import { useViews } from "@/context/ViewContext";
import { VIEWS } from "@/types/view";
import { useState } from "react";
import { Tooltip } from "react-tooltip";
import { buttonStyles, tooltipStyles } from "../tooltipStyles";
import { motion } from "framer-motion";

interface ViewButtonProps {
  viewName: VIEWS;
  icon: JSX.Element;
  isActive: boolean;  // <-- add this prop!
  index: number;      // <-- optional, if you use it for mapping order
}

const buttonVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  hover: {
    scale: 1.15,
    boxShadow: "0px 6px 20px rgba(34, 139, 230, 0.4)",
  },
  tap: {
  scale: 0.9,
  rotate: -6,
  transition: { type: 'spring' as const, stiffness: 400, damping: 20 },
},

};

const ViewButton = ({ viewName, icon, isActive }: ViewButtonProps) => {
  const { activeView, setActiveView, isSidebarOpen, setIsSidebarOpen } = useViews();
  const { isNewMessage } = useChatRoom();
  const [showTooltip, setShowTooltip] = useState(true);

  const handleViewClick = (viewName: VIEWS) => {
    if (viewName === activeView) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsSidebarOpen(true);
      setActiveView(viewName);
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <motion.button
        onClick={() => handleViewClick(viewName)}
        onMouseEnter={() => setShowTooltip(true)}
        className={`
          ${buttonStyles.base} ${buttonStyles.hover} relative z-10
          ${isActive ? "bg-[#232429] shadow-lg" : ""}
        `}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
        {...(showTooltip && {
          "data-tooltip-id": `tooltip-${viewName}`,
          "data-tooltip-content": viewName,
        })}
        type="button"
        aria-pressed={isActive}
        aria-label={viewName}
      >
        <div className="flex items-center justify-center">{icon}</div>
        {/* New message dot */}
        {viewName === VIEWS.CHATS && isNewMessage && (
          <div className="absolute right-0 top-0 h-3 w-3 rounded-full bg-primary" />
        )}
      </motion.button>

      {showTooltip && (
        <Tooltip
          id={`tooltip-${viewName}`}
          place="right"
          offset={25}
          className="!z-50"
          style={tooltipStyles}
          noArrow={false}
          positionStrategy="fixed"
          float={true}
        />
      )}
    </div>
  );
};

export default ViewButton;
