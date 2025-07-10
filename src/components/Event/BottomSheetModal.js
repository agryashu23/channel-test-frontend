
const BottomSheetModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50">
        <div className="bg-theme-tertiaryBackground w-full rounded-t-2xl p-4 max-h-[85vh] overflow-y-auto">
          <div className="flex justify-end">
            <button
              className="text-theme-secondaryText text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

export default BottomSheetModal;