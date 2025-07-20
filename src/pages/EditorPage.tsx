import SplitterComponent from "@/components/SplitterComponent";
import ConnectionStatusPage from "@/components/connection/ConnectionStatusPage";
import Sidebar from "@/components/sidebar/Sidebar";
import WorkSpace from "@/components/workspace";
import { useAppContext } from "@/context/AppContext";
import { useSocket } from "@/context/SocketContext";
import useFullScreen from "@/hooks/useFullScreen";
import useUserActivity from "@/hooks/useUserActivity";
import { SocketEvent } from "@/types/socket";
import { USER_STATUS } from "@/types/user";
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

function EditorPage() {
    useUserActivity();
    useFullScreen();
    const navigate = useNavigate();
    const { roomId } = useParams();
    const { status, setCurrentUser, currentUser } = useAppContext();
    const { socket } = useSocket();
    const location = useLocation();

    useEffect(() => {
        if (currentUser.username.length > 0) return;
        const username = location.state?.username;
        if (username === undefined) {
            navigate("/", { state: { roomId } });
        } else if (roomId) {
            const user = { username, roomId };
            setCurrentUser(user);
            socket.emit(SocketEvent.JOIN_REQUEST, user);
        }
    }, [
        currentUser.username,
        location.state?.username,
        navigate,
        roomId,
        setCurrentUser,
        socket,
    ]);

    if (status === USER_STATUS.CONNECTION_FAILED) {
        return <ConnectionStatusPage />;
    }

    // Animation variants: Only allowed values for transition!
    const splitterVariants = {
        hidden: { opacity: 0, y: 32, scale: 0.98 },
        // Removed "ease", as it causes TS errors
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55 } },
    };
    const sidebarVariants = {
        hidden: { opacity: 0, x: -32 },
        visible: { opacity: 1, x: 0, transition: { delay: 0.12, duration: 0.48 } },
    };
    const workspaceVariants = {
        hidden: { opacity: 0, x: 32 },
        visible: { opacity: 1, x: 0, transition: { delay: 0.22, duration: 0.56 } },
    };

    return (
        <motion.div
            className="h-full w-full bg-gradient-to-br from-[#f0f4ff] via-white to-[#e0f7fa] p-3"
            variants={splitterVariants}
            initial="hidden"
            animate="visible"
        >
            <SplitterComponent>
                <motion.div
                    className="h-full bg-dark backdrop-blur rounded-2xl shadow-xl mr-3 p-3 flex flex-col"
                    variants={sidebarVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Sidebar />
                </motion.div>
                <motion.div
                    className="flex-1 h-full bg-dark  backdrop-blur rounded-2xl shadow-xl p-4 flex flex-col"
                    variants={workspaceVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <WorkSpace />
                </motion.div>
            </SplitterComponent>
        </motion.div>
    );
}

export default EditorPage;
