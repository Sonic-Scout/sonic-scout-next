'use client';
import LeftNav from "./leftNav";
import Tutorial from "./ui/action/Tutorial";
import { useTutorial } from "../context/TutorialContext";

export const AppLayout = ({ children }) => {
    const { isOpenTutorial, closeTutorial } = useTutorial();

    return (
        <div className="flex h-screen overflow-hidden">
            <LeftNav/>
            <div className="flex flex-col flex-1 w-full">
                {children}
            </div>
            {isOpenTutorial && <Tutorial onClose={closeTutorial} />}
        </div>
    );
};

export default AppLayout;