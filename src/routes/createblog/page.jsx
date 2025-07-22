import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { UploadCloud, PlusCircle, Blinds } from "lucide-react";

// Optional: Replace with actual hook if available
import { useTheme } from "@/hooks/use-theme"; // Make sure this returns { theme: 'light' | 'dark' }

const CreateBlog = () => {
  const { theme } = useTheme(); // Assuming it returns a theme string like 'light' or 'dark'

  const [blogData, setBlogData] = useState({
    title: "",
    content: "",
    coverImage: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleContentChange = (content) => {
    setBlogData((prevData) => ({
      ...prevData,
      content,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setBlogData((prevData) => ({
        ...prevData,
        coverImage: e.target.files[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Example submission logic
    console.log("Blog Data:", blogData);
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold", "italic", "underline", "strike", "blockquote",
    "list", "bullet", "indent",
    "link", "image",
  ];
  const inputStyle =
    "block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
  const labelStyle = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">Create a New Blog Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">

        {/* Title Input */}
        <div className="card">
          <div className="card-header">
            <p className="card-title">Blog Title</p>
          </div>
          <div className="card-body">
            <div>
              <label htmlFor="title" className={labelStyle}>
                <Blinds className="inline mr-2 text-muted-foreground" size={16} /> Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Enter Blog Title"
                value={blogData.title}
                onChange={handleChange}
                className={inputStyle}
                required
              />
            </div>
          </div>
        </div>

        {/* Cover Image Upload */}
        <div className="card">
          <div className="card-header">
            <p className="card-title">Cover Image</p>
          </div>
          <div className="card-body">
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:hover:bg-bray-800 dark:bg-slate-950 hover:bg-slate-100 dark:border-slate-600 dark:hover:border-slate-500 dark:hover:bg-slate-900">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-10 h-10 mb-3 text-slate-400" />
                  <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                  {blogData.coverImage && <p className="mt-2 text-sm text-blue-500">{blogData.coverImage.name}</p>}
                </div>
                <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
              </label>
            </div>
          </div>
        </div>

        {/* Blog Content Editor */}
        <div className="w-full border bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm">
          <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 border-b border-slate-300 dark:border-slate-700">
            <p className="text-base font-semibold text-slate-800 dark:text-slate-200">Blog Content</p>
          </div>
          <div className="p-4">
            <div >
              <ReactQuill
                theme="snow"
                value={blogData.content}
                onChange={handleContentChange}
                modules={modules}
                formats={formats}
                placeholder="Write your blog content here..."
                className={theme === 'dark' ? 'quill-dark' : ''}
              />
            </div>
          </div>
        </div>




        {/* Submit Button */}
        <div className="flex justify-end">
          <button type="submit" className="bg-blue-600 p-2 rounded-md text-white flex items-center gap-x-2">
            <PlusCircle size={20} />
            Publish Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;
