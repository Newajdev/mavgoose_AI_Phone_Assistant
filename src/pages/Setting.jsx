import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import InputField from "../components/InputField";
import {
  getProfileApi,
  updateProfileApi,
  changePasswordApi,
} from "../libs/auth.api";

export default function Setting() {
  const [activeTab, setActiveTab] = useState("profile");

  /* ================= LOADING STATES ================= */
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  /* ================= PROFILE STATE ================= */
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    stateLocation: "",
    profileImage: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  /* ================= PASSWORD STATE ================= */
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getProfileApi();
        const data = res.data;

        setProfile({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email || "",
          stateLocation: data.state_location || "",
          profileImage: data.profile_image || "",
        });
      } catch (err) {
        toast.error("Failed to load profile");
      }
    };

    loadProfile();
  }, []);

  /* ================= IMAGE CLEANUP ================= */
  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  /* ================= SAVE PROFILE ================= */
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      setProfileLoading(true);

      const formData = new FormData();
      formData.append("first_name", profile.firstName);
      formData.append("last_name", profile.lastName);
      formData.append("state_location", profile.stateLocation);

      if (selectedImage) {
        formData.append("profile_image", selectedImage);
      }

      await updateProfileApi(formData);

      const res = await getProfileApi();
      const data = res.data;

      setProfile({
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        email: data.email || "",
        stateLocation: data.state_location || "",
        profileImage: data.profile_image || "",
      });

      setSelectedImage(null);
      setIsEditing(false);

      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Profile update failed"
      );
    } finally {
      setProfileLoading(false);
    }
  };

  /* ================= CHANGE PASSWORD ================= */
  const handleSavePassword = async (e) => {
    e.preventDefault();

    const { oldPassword, newPassword, confirmPassword } = passwordForm;

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
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
      const data = err.response?.data;

      if (data?.old_password) {
        toast.error(data.old_password[0]);
      } else if (data?.confirm_password) {
        toast.error(data.confirm_password[0]);
      } else {
        toast.error(data?.detail || "Password change failed");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="p-2 md:p-6">
      <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>

      {/* ================= TABS ================= */}
      <div className="flex gap-12 mb-12 border-b border-[#2B7FFF10] pb-2">
        {["profile", "password"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-medium pb-2 relative ${
              activeTab === tab
                ? "text-white"
                : "text-[#90A1B9] hover:text-white"
            }`}
          >
            {tab === "profile" ? "Profile" : "Password Settings"}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2B7FFF]" />
            )}
          </button>
        ))}
      </div>

      {/* ================= PROFILE TAB ================= */}
      {activeTab === "profile" && (
        <div className="max-w-4xl">
          {/* Profile Image */}
          <div className="mb-8">
            <p className="text-[#90A1B9] text-sm mb-4">Profile Image</p>

            <div className="flex items-center gap-4">
              <div className="size-20 rounded-full overflow-hidden border-2 border-[#2B7FFF33]">
                <img
                  src={
                    selectedImage
                      ? URL.createObjectURL(selectedImage)
                      : profile.profileImage ||
                        "https://api.dicebear.com/7.x/avataaars/svg"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              {isEditing && (
                <label className="cursor-pointer text-[#2B7FFF] text-sm">
                  Change
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                  />
                </label>
              )}

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-1.5 rounded-lg bg-[#2B7FFF15] text-[#2B7FFF] text-xs font-semibold"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {isEditing ? (
                <>
                  <InputField
                    label="First Name"
                    value={profile.firstName}
                    onChange={(e) =>
                      setProfile({ ...profile, firstName: e.target.value })
                    }
                  />
                  <InputField
                    label="Last Name"
                    value={profile.lastName}
                    onChange={(e) =>
                      setProfile({ ...profile, lastName: e.target.value })
                    }
                  />
                  <InputField label="Email" value={profile.email} disabled />
                  <InputField
                    label="State Location"
                    value={profile.stateLocation}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        stateLocation: e.target.value,
                      })
                    }
                  />
                </>
              ) : (
                <>
                  <DataGrid label="First Name" value={profile.firstName} />
                  <DataGrid label="Last Name" value={profile.lastName} />
                  <DataGrid label="Email" value={profile.email} />
                  <DataGrid
                    label="State Location"
                    value={profile.stateLocation}
                  />
                </>
              )}
            </div>

            {isEditing && (
              <button
                type="submit"
                disabled={profileLoading}
                className="bg-[#05DF72] px-10 py-3 rounded-xl text-white font-bold disabled:opacity-50"
              >
                {profileLoading ? "Saving..." : "Save"}
              </button>
            )}
          </form>
        </div>
      )}

      {/* ================= PASSWORD TAB ================= */}
      {activeTab === "password" && (
        <div className="max-w-xl">
          <form onSubmit={handleSavePassword} className="space-y-8">
            <InputField
              label="Old Password"
              type="password"
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
              className="bg-[#05DF72] px-10 py-3 rounded-xl text-white font-bold disabled:opacity-50"
            >
              {passwordLoading ? "Saving..." : "Save"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

/* ================= DISPLAY GRID ================= */
function DataGrid({ label, value }) {
  return (
    <div>
      <p className="text-[#90A1B9] text-xs uppercase">{label}</p>
      <p className="text-white text-lg">{value || "-"}</p>
    </div>
  );
}
