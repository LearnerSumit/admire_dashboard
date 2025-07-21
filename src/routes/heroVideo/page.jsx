import { useRef, useState } from "react";
import { Loader2, Video, X, Replace, LayoutTemplate } from "lucide-react";
import { toast } from "react-toastify";
import { apiClient } from "../../stores/authStore";



const HeroVideoUpload = () => {
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Refs for form fields
  const pageRef = useRef();

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideo(file);
    } else if (file) {
      toast.error("Invalid file type. Please select a video file.");
    }
  };

  const handleRemoveVideo = () => {
    setVideo(null);
    document.getElementById("videoUpload").value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!video) {
      toast.error("Please select a video to upload.");
      return;
    }

    const page = pageRef.current?.value;
    if (!page) {
      toast.error("Please select a page.");
      return;
    }

    const formData = new FormData();
    formData.append("video", video);
    formData.append("page", page); // Additional field

    try {
      setIsLoading(true);

      const response = await apiClient.post("/admin/hero-section", formData);

      if (response.data.success) {
        toast.success(response.data.message || "Video uploaded successfully!");
        handleRemoveVideo();
        pageRef.current.value = "home";
      } else {
        toast.error(response.data.message || "Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Video Upload Error:", error);
      toast.error("An error occurred while uploading the video.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6 sm:p-10">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-8 border border-gray-200 dark:border-gray-700"
      >
        <h1 className="text-3xl font-bold border-b pb-3 border-gray-300 dark:border-gray-600">
          Update Hero Video
        </h1>

        {/* Page Dropdown */}
        <div>
          <label htmlFor="page" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <span className="inline-flex items-center gap-1">
              <LayoutTemplate size={16} /> Select Page
            </span>
          </label>
          <select
            ref={pageRef}
            id="page"
            defaultValue="home"
            className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="home">Home</option>
            <option value="about">About</option>
            <option value="domestic">Domestic</option>
            <option value="international">International</option>
            <option value="contact">Contact</option>
            <option value="blog">Blog</option>
          </select>
        </div>

        {/* Video Upload & Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Hero Section Video
          </label>

          {video ? (
            <div className="relative rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden group bg-black">
              <video
                src={URL.createObjectURL(video)}
                controls
                autoPlay
                muted
                loop
                className="w-full h-auto max-h-96 object-contain"
                onLoadedData={(e) => URL.revokeObjectURL(e.target.src)}
              />
              <div className="absolute top-2 right-2 flex gap-2 transition-opacity opacity-0 group-hover:opacity-100">
                <label
                  htmlFor="videoUpload"
                  className="bg-black/60 hover:bg-black/80 text-white rounded-full p-2 cursor-pointer"
                  title="Change video"
                >
                  <Replace size={18} />
                </label>
                <button
                  type="button"
                  onClick={handleRemoveVideo}
                  className="bg-black/60 hover:bg-black/80 text-white rounded-full p-2"
                  title="Remove video"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ) : (
            <label
              htmlFor="videoUpload"
              className="flex flex-col items-center justify-center gap-2 cursor-pointer rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-10 text-center transition hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
            >
              <Video size={36} className="text-blue-600 dark:text-blue-400" />
              <span className="text-gray-700 dark:text-gray-300 text-sm font-semibold">
                Click to upload or drag & drop a video
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                MP4, WebM, or Ogg formats recommended
              </span>
            </label>
          )}
          <input
            id="videoUpload"
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="hidden"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!video || isLoading}
          className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-800"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <span>Upload and Set as Hero Video</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default HeroVideoUpload;
