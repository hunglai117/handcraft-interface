import { useState } from "react";
import Layout from "../../components/Layout";
import { withAuth } from "../../utils/withAuth";
import { useAuth } from "../../contexts/AuthContext";

function ProfilePage() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would submit changes to your API
    // For now, we'll just toggle off edit mode
    setIsEditing(false);
  };

  return (
    <Layout title="My Profile">
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="font-heading text-h1">My Profile</h1>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-primary hover:underline font-medium"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="firstName" className="block mb-2 font-medium">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block mb-2 font-medium">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="block mb-2 font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    disabled={true} // Email can't be edited
                    className="w-full border border-gray-300 rounded p-3 bg-gray-100"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="phone" className="block mb-2 font-medium">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-100"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="address" className="block mb-2 font-medium">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={profileData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-100"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="city" className="block mb-2 font-medium">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={profileData.city}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block mb-2 font-medium">
                      State/Province
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={profileData.state}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="zip" className="block mb-2 font-medium">
                      ZIP/Postal Code
                    </label>
                    <input
                      type="text"
                      id="zip"
                      name="zip"
                      value={profileData.zip}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block mb-2 font-medium">
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={profileData.country}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {isEditing && (
                  <button type="submit" className="btn-primary w-full">
                    Save Changes
                  </button>
                )}
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="font-heading text-h2 mb-4">Account Settings</h2>
              <div className="space-y-4">
                <button className="text-primary hover:underline font-medium">
                  Change Password
                </button>
                <button className="text-primary hover:underline font-medium">
                  Email Preferences
                </button>
                <button className="text-primary hover:underline font-medium">
                  Privacy Settings
                </button>
              </div>
            </div>

            <div className="text-center mt-8">
              <button 
                onClick={logout}
                className="btn-secondary"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default withAuth(ProfilePage);
