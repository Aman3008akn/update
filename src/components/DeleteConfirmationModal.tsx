interface DeleteConfirmationModalProps {
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmationModal({ itemName, onConfirm, onCancel }: DeleteConfirmationModalProps) {
  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <div className="mx-auto bg-red-900/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">Delete Product?</h3>
        <p className="text-gray-400">
          Are you sure you want to delete <span className="font-semibold text-white">"{itemName}"</span>? 
          This action cannot be undone.
        </p>
      </div>
      
      <div className="flex justify-center space-x-4 pt-4">
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-300"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/30"
        >
          Delete
        </button>
      </div>
    </div>
  );
}