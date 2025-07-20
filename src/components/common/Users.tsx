import { useAppContext } from "@/context/AppContext";
import { RemoteUser, USER_CONNECTION_STATUS } from "@/types/user";
import Avatar from "react-avatar";
import { AnimatePresence, motion } from "framer-motion";

// Parent (grid) stagger
const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

// Each user card
const userVariants = {
  initial: { opacity: 0, y: 32, scale: 0.88 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    background: [
      "linear-gradient(145deg, #262a38 70%, #228be6 100%)",
      "linear-gradient(145deg, #232429 90%, #262a38 100%)",
    ],
    transition: {
      duration: 0.55,
      ease: [0.24, 1, 0.32, 1],
      background: { duration: 1.5, ease: "linear" },
      type: "spring",
      stiffness: 440,
      damping: 36,
    },
  },
  exit: {
    opacity: 0,
    y: -22,
    scale: 0.85,
    transition: { duration: 0.22, ease: [0.32, 0, 0.67, 0] },
  },
};

// Avatar hover shimmer
const avatarHover = {
  scale: 1.09,
  boxShadow: "0 0 20px #228be6aa, 0 0 1px #fff",
  filter: "brightness(1.12) saturate(1.15)",
};

// Online indicator (dot) variants
const dotVariants = {
  online: {
    scale: [1, 1.45, 1.15, 1],
    boxShadow: [
      "0 0 0px 0px #22c55e70",
      "0 0 0px 6px #22c55e35",
      "0 0 0px 8px #22c55e15",
      "0 0 0px 0px #22c55e00",
    ],
    opacity: 1,
    transition: { repeat: Infinity, duration: 1.45, ease: "easeInOut" },
  },
  offline: {
    scale: 1,
    opacity: 0.5,
    boxShadow: "none",
    backgroundColor: "#6b7280",
    transition: { duration: 0.4 },
  },
};

function Users() {
  const { users } = useAppContext();

  return (
    <div className="flex min-h-[200px] flex-grow justify-center overflow-y-auto py-2">
      <motion.div
        className="flex h-full w-full flex-wrap items-start gap-x-3 gap-y-7"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        layout // enables springy grid reflows
      >
        <AnimatePresence>
          {users.map((user) => (
            <User key={user.socketId} user={user} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

const User = ({ user }: { user: RemoteUser }) => {
  const { username, status } = user;
  const title = `${username} - ${
    status === USER_CONNECTION_STATUS.ONLINE ? "online" : "offline"
  }`;

  return (
    <motion.div
      className="relative flex w-[110px] flex-col items-center gap-2 cursor-pointer select-none rounded-xl border border-dark bg-[#232429] p-2 shadow-md transition duration-150"
      title={title}
      variants={userVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={{
        scale: 1.06,
        boxShadow:
          "0 8px 28px 0 rgba(34,139,230,0.19), 0 0px 3px #228be6b0",
        borderColor: "#228be6",
        background:
          "linear-gradient(135deg, #232429 80%, #5C7CFA 100%)",
        transition: { type: "spring", stiffness: 320, damping: 22 },
      }}
      layout
    >
      <motion.div whileHover={avatarHover} className="transition">
        <Avatar
          name={username}
          size="54"
          round={"16px"}
          title={title}
          className="shadow"
        />
      </motion.div>
      <p className="line-clamp-2 max-w-full text-ellipsis break-words text-center font-semibold text-white/90">
        {username}
      </p>
      {/* Animated online/offline dot */}
      <motion.div
        className={`absolute right-3 top-2 h-3 w-3 rounded-full border-[2.5px] border-dark
          ${status === USER_CONNECTION_STATUS.ONLINE ? "bg-green-500" : "bg-gray-500"}
        `}
        variants={dotVariants}
        animate={status === USER_CONNECTION_STATUS.ONLINE ? "online" : "offline"}
        style={{
          zIndex: 1,
        }}
      />
      {/* Ripple effect for online */}
      {status === USER_CONNECTION_STATUS.ONLINE && (
        <motion.span
          className="absolute right-3 top-2 h-3 w-3 rounded-full"
          style={{ zIndex: 0 }}
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{
            scale: [1, 2.3],
            opacity: [0.6, 0],
            backgroundColor: "#22c55e",
          }}
          transition={{
            repeat: Infinity,
            repeatDelay: 0.4,
            duration: 1.6,
            ease: "easeOut",
          }}
        />
      )}
    </motion.div>
  );
};

export default Users;
