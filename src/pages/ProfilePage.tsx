import Layout from "../components/Layout";
import { getCurrentUser } from "../utils/auth";

export default function ProfilePage() {
  const user = getCurrentUser();

  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl font-medium border border-red-100">
            User data not found. Please log in again.
          </div>
        </div>
      </Layout>
    );
  }

  // Ambil inisial untuk avatar
  const initial = user.firstName?.charAt(0) || "U";

  return (
    <Layout>
      <div className="min-w-276">
        {/* Header Profile */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-3xl font-extrabold">My Profile</p>
        </div>

        <div className="bg-white rounded-4xl mb-4 p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-[#FEF3C7] rounded-full flex items-center justify-center text-[40px] font-black text-amber-900 mb-4 shadow-inner">
            {initial}
          </div>
          <h2 className="text-xl font-bold text-black">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-sm text-gray-500 mb-6">@{user.username}</p>

          <div className="w-full pt-6 border-t border-gray-50">
            <span className="text-sm mr-3">Role: </span>
            <span className="px-4 py-2 bg-gray-100 rounded-full text-xs font-bold text-gray-600 uppercase tracking-widest">
              {user.role || "User"}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-4xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-lg font-extrabold mb-8 text-black border-b border-gray-50 pb-4">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                First Name
              </p>
              <div className="p-4 bg-gray-50 rounded-2xl font-semibold text-gray-800 border border-transparent focus-within:border-[#FEF3C7] transition-all">
                {user.firstName}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Last Name
              </p>
              <div className="p-4 bg-gray-50 rounded-2xl font-semibold text-gray-800 border border-transparent focus-within:border-[#FEF3C7] transition-all">
                {user.lastName}
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Username
              </p>
              <div className="p-4 bg-gray-50 rounded-2xl font-semibold text-gray-800 border border-transparent focus-within:border-[#FEF3C7] transition-all">
                {user.username}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
