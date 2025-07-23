import { useState, useCallback, useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { UploadCloud, PlusCircle, Blinds, Eye } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useDebouncedCallback } from 'use-debounce';
import { apiClient } from "../../stores/authStore";
import { toast } from 'react-toastify';

// OPTIMIZATION: Define constants outside the component so they are not recreated on every render.
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
  "header", "bold", "italic", "underline", "strike", "blockquote",
  "list", "bullet", "indent", "link", "image",
];

const inputStyle = "block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500";
const labelStyle = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";


const CreateBlog = () => {
  const { theme } = useTheme();

  const quillRef = useRef();

  const [blogData, setBlogData] = useState({
    title: "",
    content: "",
    coverImage: null,
    visibility: "private",
  });

  // OPTIMIZATION: Wrap handlers in useCallback to stabilize their references.
  // This prevents child components from re-rendering if they receive these functions as props.
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setBlogData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []); // Empty dependency array means the function is created only once.

  // OPTIMIZATION: Debounce the content change handler.
  // This waits for the user to stop typing for 300ms before updating state,
  // preventing a flood of re-renders on every keystroke in the editor.
  const handleContentChange = useDebouncedCallback((content) => {
    setBlogData((prevData) => ({
      ...prevData,
      content,
    }));
  }, 300);

  const handleFileChange = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      setBlogData((prevData) => ({
        ...prevData,
        coverImage: e.target.files[0],
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // This is where you would format your data for API submission,
    // e.g., using FormData for the file upload.
    const formData = new FormData();
    formData.append('title', blogData.title);
    formData.append('content', blogData.content);
    formData.append('visibility', blogData.visibility);
    if (blogData.coverImage) {
      formData.append('coverImage', blogData.coverImage);
    }

    try {
      const res = await apiClient.post('/admin/blog', formData);
      if (res.data.success) {
        toast.success(res.data.msg);
        setBlogData({
          title: "",
          content: "",
          coverImage: null,
          visibility: "private",
        });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      toast.error('Failed to create blog.');
    }
  };

  // OPTIMIZATION: Memoize the ReactQuill component to prevent re-renders
  // when other parts of the form (like the title input) are updated.
  const MemoizedQuill = useMemo(() => (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={blogData.content}
      onChange={handleContentChange}
      modules={modules}
      formats={formats}
      placeholder="Write your blog content here..."
      className={theme === 'dark' ? 'quill-dark' : ''}
    />
  ), [theme, blogData.content, handleContentChange]); // Re-render only if these dependencies change.

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">Create a New Blog Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">

        {/* Title & Visibility Card */}
        <div className="card">
          <div className="card-header"><p className="card-title">Blog Details</p></div>
          <div className="card-body grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className={labelStyle}>
                <Blinds className="inline mr-2 text-muted-foreground" size={16} /> Title
              </label>
              <input type="text" name="title" id="title" placeholder="Enter Blog Title" value={blogData.title} onChange={handleChange} className={inputStyle} required />
            </div>
            <div>
              <label htmlFor="visibility" className={labelStyle}>
                <Eye className="inline mr-2 text-muted-foreground" size={16} /> Visibility
              </label>
              <select name="visibility" id="visibility" value={blogData.visibility} onChange={handleChange} className={inputStyle} required>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cover Image Upload */}
        <div className="card">
          <div className="card-header"><p className="card-title">Cover Image</p></div>
          <div className="card-body">
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:hover:bg-bray-800 dark:bg-slate-950 hover:bg-slate-100 dark:border-slate-600 dark:hover:border-slate-500 dark:hover:bg-slate-900">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-10 h-10 mb-3 text-slate-400" />
                  <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">SVG, PNG, JPG or GIF</p>
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
            {/* Render the memoized editor */}
            {MemoizedQuill}
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