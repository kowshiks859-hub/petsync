export default function Settings({ auth }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-heading font-extrabold text-gray-900 mb-8">Settings</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
          
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-1">Logged in as</label>
                <div className="text-gray-900 font-medium bg-gray-50 px-4 py-2 rounded-md border border-gray-200">
                  {auth.role === 'bluecross' ? 'Blue Cross Staff / Admin' : 'Normal User (Adopter)'}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Preferences</h2>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary" defaultChecked />
                <span className="text-gray-700">Email Notifications</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary" defaultChecked />
                <span className="text-gray-700">SMS Alerts</span>
              </label>
            </div>
          </div>

          <div>
             <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors">
               Save Preferences
             </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
