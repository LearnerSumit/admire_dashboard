import React, { useState, useEffect } from "react";
import { Pencil, Trash2, PlusCircle, Eye, EyeOff, ArrowRight, List } from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- DUMMY DATA ---
const dummyBlogs = [
  {
    id: 1,
    title: "Understanding React Hooks",
    description:
      "Hooks let you use state and other React features without writing a class. Learn how to use useEffect, useState, and more.",
    image: "https://placehold.co/600x400/7e5bef/ffffff?text=React+Hooks",
    visibility: "public",
  },
  {
    id: 2,
    title: "Top 10 Travel Destinations",
    description:
      "Explore some of the most breathtaking travel destinations around the world for your 2025 adventures.",
    image: "https://placehold.co/600x400/3498db/ffffff?text=Travel+2025",
    visibility: "private",
  },
  {
    id: 3,
    title: "A Guide to Consistent UI Design",
    description:
      "Learn how to maintain a consistent and user-friendly design across your entire application.",
    image: "https://placehold.co/600x400/2ecc71/ffffff?text=UI+Design",
    visibility: "public",
  },
  {
    id: 4,
    title: "A Guide to Consistent UI Design",
    description:
      "Learn how to maintain a consistent and user-friendly design across your entire application.",
    image: "https://placehold.co/600x400/2ecc71/ffffff?text=UI+Design",
    visibility: "public",
  },
];


// --- REDESIGNED BlogCard COMPONENT ---
const BlogCard = ({ blog, onEdit, onDelete, onToggleVisibility }) => {
  return (
    <div className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out">
      <div className="overflow-hidden relative">
        {/* Action Icons */}
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(blog.id); }}
            className="p-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full text-blue-600 dark:text-blue-400 hover:bg-white dark:hover:bg-slate-900 transition"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(blog.id); }}
            className="p-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full text-red-600 dark:text-red-400 hover:bg-white dark:hover:bg-slate-900 transition"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
        <img
          src={blog.image}
          alt={`Thumbnail for ${blog.title}`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 flex flex-col h-[calc(100%-12rem)]"> {/* 12rem is h-48 */}
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate mb-2">
            {blog.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {blog.description}
          </p>
        </div>

        {/* Footer with Visibility Toggle */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleVisibility(blog.id, blog.visibility); }}
            className={`flex items-center gap-x-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
              blog.visibility === "public"
                ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400"
                : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
            }`}
          >
            {blog.visibility === "public" ? <Eye size={14} /> : <EyeOff size={14} />}
            <span className="capitalize">{blog.visibility}</span>
          </button>
           <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
             Read More
             <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
           </a>
        </div>
      </div>
    </div>
  );
};


// --- REDESIGNED BlogList PAGE ---
const BlogList = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch blogs
    setTimeout(() => {
      setBlogs(dummyBlogs);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleEdit = (id) => {
    console.log("Edit blog", id);
    // navigate(`/admin/blogs/edit/${id}`);
  };

  const handleDelete = (id) => {
    console.log("Delete blog", id);
    // Add a confirmation modal here for better UX
    setBlogs((prev) => prev.filter((b) => b.id !== id));
  };

  const handleVisibilityToggle = (id, currentVisibility) => {
    const newVisibility = currentVisibility === "public" ? "private" : "public";
    console.log(`Updating blog ${id} visibility to ${newVisibility}`);
    // Simulate API call and then update state
    setBlogs((prev) =>
      prev.map((blog) =>
        blog.id === id ? { ...blog, visibility: newVisibility } : blog
      )
    );
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white min-h-screen p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <List size={28} className="mr-3 text-blue-500" />
              Blog Posts
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Manage your content and share your stories with the world.
            </p>
          </div>
          <button
            onClick={() => navigate("/create_blog")}
            className="mt-4 sm:mt-0 inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-slate-900"
          >
            <PlusCircle size={16} />
            Create New Post
          </button>
        </div>

        {/* Itinerary Grid */}
        {isLoading ? (
          // --- Loading Skeleton ---
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 animate-pulse">
                <div className="w-full h-48 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                <div className="mt-4 h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="mt-3 h-4 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="mt-1 h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          // --- No Itineraries Found ---
          <div className="text-center py-16 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
             <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No Blog Posts Found</h3>
             <p className="text-slate-500 mt-2">Get started by creating a new post.</p>
          </div>
        ) : (
          // --- Display Itineraries ---
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleVisibility={handleVisibilityToggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;