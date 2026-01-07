import { useEffect, useState } from "react";
import { usePostcreateMutation } from "../../store/home";
import { useParams } from "react-router-dom";
import {
  useArticlepatchMutation,
  useGetarticleQuery
} from "../../store/article";

function Postcreate() {
  const { id } = useParams();

  const [postcreate, error] = usePostcreateMutation();
  const [articlepatch, { error: err }] = useArticlepatchMutation();

  const { data } = useGetarticleQuery(id,{
      skip: !id
  });

  const [postdata, setpostdata] = useState({
    title: "",
    description: "",
    category: "news",
    link1: "",
    link2: ""
  });

  useEffect(() => {
    if (data) {
      setpostdata({
        title: data.title,
        description: data.description,
        category: data.category,
        link1: data.link1,
        link2: data.link2
      });
    }
  }, [data]);

  const handlechange = (e) => {
    const { name, value } = e.target;
    setpostdata((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await postcreate(postdata).unwrap();
      console.log("successful create", res);
    } catch (error) {
      console.error(err?.data?.message);
    }
  };

  const handlepatchsubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await articlepatch({ id, ...postdata }).unwrap();
      console.log("successful updated", res);
    } catch (error) {
      console.error(err?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          {id ? "Update Article" : "Create New Article"}
        </h2>

        <form
          onSubmit={id ? handlepatchsubmit : handleSubmit}
          className="space-y-5"
        >
          {/* TITLE */}
          <input
            type="text"
            name="title"
            placeholder="Enter title"
            value={postdata.title}
            onChange={handlechange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* DESCRIPTION */}
          <textarea
            name="description"
            placeholder="Enter description"
            value={postdata.description}
            onChange={handlechange}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* CATEGORY */}
          <select
            name="category"
            value={postdata.category}
            onChange={handlechange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="news">News</option>
            <option value="edu">Education</option>
            <option value="sports">Sports</option>
            <option value="tech">Technology</option>
            <option value="business">Business</option>
            <option value="health">Health</option>
            <option value="entertainment">Entertainment</option>
            <option value="politics">Politics</option>
            <option value="travel">Travel</option>
            <option value="food">Food</option>
            <option value="lifestyle">Lifestyle</option>
          </select>

          {/* LINKS */}
          <input
            type="url"
            name="link1"
            placeholder="Link 1"
            value={postdata.link1}
            onChange={handlechange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="url"
            name="link2"
            placeholder="Link 2"
            value={postdata.link2}
            onChange={handlechange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold
                       hover:bg-blue-700 transition"
          >
            {id ? "Update Post" : "Create Post"}
          </button>
        </form>

        {(error || err) && (
          <p className="mt-4 text-center text-sm text-red-600">
            {error?.data?.message || err?.data?.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Postcreate;
