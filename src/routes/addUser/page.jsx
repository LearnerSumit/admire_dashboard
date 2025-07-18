import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { ENV } from "../../constants/api";
import { User, Lock, Loader2 } from "lucide-react"; // Import necessary icons

const AddUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false); // Renamed for consistency

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast.error("Please fill in both username and password.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${ENV.API_BASE_URL}/admin/add-user`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success(response.data?.msg || "User added successfully!");
      setFormData({ username: "", password: "" });
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.response?.data?.msg ||
        "Something went wrong while adding the user.";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      {/* Page Title - Consistent with other pages */}
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
        Add New User
      </h1>

      {/* Main Content Card - Using the established card style */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-sm font-medium text-slate-800 dark:text-slate-200"
            >
              Username
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3 size-5 text-slate-400" />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                // Applying the consistent input style from other components
                className="w-full rounded-lg border border-slate-300 bg-transparent py-2 pl-10 pr-3 text-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/80 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus-visible:ring-blue-600"
                placeholder="Enter a unique username"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-800 dark:text-slate-200"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 size-5 text-slate-400" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                // Applying the consistent input style
                className="w-full rounded-lg border border-slate-300 bg-transparent py-2 pl-10 pr-3 text-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/80 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus-visible:ring-blue-600"
                placeholder="Create a strong password"
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              // Applying the consistent button style
              className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-900"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>Adding User...</span>
                </>
              ) : (
                <span>Add User</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;