import LeftNav from "./leftNav";

export const AppLayout = ({ children }) => {
    return (
        <div className="flex h-screen overflow-hidden">
            <LeftNav/>
            <div className="flex flex-col flex-1 w-full">
                {children}
            </div>
        </div>
    );
};


export default AppLayout;