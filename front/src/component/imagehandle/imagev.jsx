import { useState } from "react";
import { usePostimageMutation } from "../../store/image";
import { useParams } from "react-router-dom";

function Imagevideo() {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [imagehandle, { error, isLoading }] = usePostimageMutation();

  const handlechange = (e) => {
    const f = e.target.files[0];
    setFile(f);
  };

  const handlesubmit = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formdata = new FormData();
    formdata.append("file", file);

    try {
      const res = await imagehandle({ id, data: formdata }).unwrap();
      console.log(res?.data, "Successfully uploaded");
      alert("Uploaded successfully");
      setFile(null);
    } catch (err) {
      console.log(error?.data?.message);
      console.log("RTK error:", err)

  console.log(
    err?.data?.error ||
    err?.data?.message ||
    "Upload failed"
  )
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-6 bg-white rounded-xl shadow-md flex flex-col gap-4">
      <label className="text-gray-700 font-medium">Upload image or video</label>

      <input
        type="file"
        name="file"
        accept="image/*,video/*"
        onChange={handlechange}
        className="w-full text-sm text-gray-700 file:border file:border-gray-300 file:rounded-lg
                   file:px-4 file:py-2 file:bg-gray-100 file:text-gray-700
                   hover:file:bg-gray-200 focus:outline-none"
      />

      <button
        onClick={handlesubmit}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg
                   hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? "Uploading…" : "Upload"}
      </button>

      {error && (
        <p className="text-red-600 text-sm">
          Error uploading file: {error?.data?.message}
        </p>
      )}
    </div>
  );
}

export default Imagevideo;
