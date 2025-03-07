
export const Tutorial = ({onClose}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">Welcome to the tutorial</h2>
            <p className="text-lg mb-4">This is a tutorial modal.</p>
            <button 
            className="bg-primary text-white px-4 py-2 rounded-lg"
            onClick={onClose}
            >
            Close
            </button>
        </div>
        </div>
    );
};

export default Tutorial;