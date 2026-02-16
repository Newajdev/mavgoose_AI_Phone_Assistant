import React, { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import InputField from "../components/InputField";
import {
  updateProfileApi,
  changePasswordApi,
} from "../libs/auth.api";
import { AuthContext } from "../provider/AuthContext";

/* 🔧 BACKEND BASE URL */
const BACKEND_URL = "http://172.252.13.97:8020";

export default function Setting() {
  const { user, fetchProfile } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("profile");
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    stateLocation: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    if (!user) return;

    setProfile({
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      email: user.email || "",
      stateLocation: user.state_location || "",
    });
  }, [user]);

  /* ================= IMAGE CLEANUP ================= */
  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  /* ================= PROFILE IMAGE ================= */
  const getProfileImage = () => {
    if (selectedImage) {
      return URL.createObjectURL(selectedImage);
    }

    if (user?.profile_image) {
      if (user.profile_image.startsWith("http")) {
        return `${user.profile_image}?t=${Date.now()}`;
      }
      return `${BACKEND_URL}${user.profile_image}?t=${Date.now()}`;
    }

    return "https://api.dicebear.com/7.x/avataaars/svg";
  };

  /* ================= SAVE PROFILE ================= */
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!profile.firstName.trim()) {
      toast.error("First name is required");
      return;
    }

    try {
      setProfileLoading(true);

      const formData = new FormData();
      formData.append("first_name", profile.firstName.trim());
      formData.append(
        "last_name",
        profile.lastName.trim() || "User"
      );
      formData.append(
        "state_location",
        profile.stateLocation || ""
      );

      if (selectedImage instanceof File) {
        formData.append("profile_image", selectedImage);
      }

      await updateProfileApi(formData);
      await fetchProfile(); // 🔥 GLOBAL SYNC

      setIsEditing(false);
      setSelectedImage(null);

      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err?.response?.data);
      toast.error("Profile update failed");
    } finally {
      setProfileLoading(false);
    }
  };

  /* ================= SAVE PASSWORD ================= */
  const handleSavePassword = async (e) => {
    e.preventDefault();

    const { oldPassword, newPassword, confirmPassword } =
      passwordForm;

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setPasswordLoading(true);

      await changePasswordApi({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      toast.success("Password changed successfully");
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err?.response?.data);
      toast.error("Password change failed");
    } finally {
      setPasswordLoading(false);
    }
  };
  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-8">
        Settings
      </h1>

      {/* ================= TABS ================= */}
      <div className="flex gap-12 mb-12 border-b border-[#2B7FFF10]">
        {["profile", "password"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 ${activeTab === tab
              ? "text-white"
              : "text-[#90A1B9]"
              }`}
          >
            {tab === "profile"
              ? "Profile"
              : "Password Settings"}
          </button>
        ))}
      </div>

      {/* ================= PROFILE TAB ================= */}
      {activeTab === "profile" && (
        <div className="max-w-4xl transition-all duration-300">

          {/* ================= Profile Image Card ================= */}
          <div className="bg-[#0F172A] p-6 rounded-2xl  mb-8 border border-blue-500">
            <p className="text-sm text-[#90A1B9] mb-6 font-medium">
              Profile Information
            </p>

            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="flex items-center gap-5">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#2B7FFF40] shadow-md">
                  <img
                    src={getProfileImage()}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {profile.firstName} {profile.lastName}
                  </h3>
                  <p className="text-sm text-[#90A1B9]">
                    {profile.email}
                  </p>
                </div>
              </div>

              {isEditing ? (
                <label className="cursor-pointer text-[#2B7FFF] text-sm font-medium hover:opacity-80 transition">
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) =>
                      setSelectedImage(e.target.files?.[0] || null)
                    }
                  />
                </label>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-5 py-2 rounded-xl bg-[#2B7FFF15] text-[#2B7FFF] text-sm font-medium hover:bg-[#2B7FFF25] transition"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* ================= Form Section ================= */}
          <form
            onSubmit={handleSaveProfile}
            className="bg-[#0F172A] p-6 rounded-2xl grid gap-6 md:grid-cols-2 transition-all duration-300 border border-blue-500"
          >
            <InputField
              label="First Name"
              value={profile.firstName}
              disabled={!isEditing}
              onChange={(e) =>
                setProfile(prev => ({
                  ...prev,
                  firstName: e.target.value
                }))
              }

              isEditing={isEditing}
            />

            <InputField
              label="Last Name"
              value={profile.lastName}
              disabled={!isEditing}
              onChange={(e) =>
                setProfile(prev => ({
                  ...prev,
                  lastName: e.target.value
                }))
              }
              isEditing={isEditing}
            />

            <InputField
              label="Email"
              value={profile.email}
              disabled
              isEditing={false}
            />

            <InputField
              label="State Location"
              value={profile.stateLocation}
              disabled={!isEditing}
              onChange={(e) =>
                setProfile(prev => ({
                  ...prev,
                  stateLocation: e.target.value
                }))
              }
              isEditing={isEditing}
            />

            {/* Buttons Row */}
            {isEditing && (
              <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 rounded-xl bg-[#1E293B] text-[#90A1B9] hover:bg-[#243244] transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-8 py-2 rounded-xl bg-[#05DF72] text-white hover:bg-[#05DF72CC] disabled:bg-[#05DF7299] transition"
                >
                  {profileLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </div>
      )}


      {/* ================= PASSWORD TAB ================= */}
      {activeTab === "password" && (
        <form
          onSubmit={handleSavePassword}
          className="max-w-xl space-y-6"
        >
          <InputField
            label="Current Password"
            type="password"
            placeholder="Enter current password"
            value={passwordForm.oldPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                oldPassword: e.target.value,
              })
            }
          />
          <InputField
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                newPassword: e.target.value,
              })
            }
          />
          <InputField
            label="Confirm Password"
            type="password"
            placeholder="Confirm new password"
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                confirmPassword: e.target.value,
              })
            }
          />

          <button
            type="submit"
            disabled={passwordLoading}
            className="bg-[#05DF72] px-8 py-3 rounded-xl text-white cursor-pointer hover:bg-[#05DF72CC] disabled:bg-[#05DF7299]"
          >
            {passwordLoading
              ? "Saving..."
              : "Save"}
          </button>
        </form>
      )}
    </div>
  );
}
