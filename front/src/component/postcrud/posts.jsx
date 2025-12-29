import { useEffect, useState } from "react";
import { usePostcreateMutation } from "../../store/home";
import { useParams } from "react-router-dom";
import {  useArticlepatchMutation, useGetarticleQuery } from "../../store/article";


function Postcreate() {
  const {id} =useParams()
  const [postcreate, error] = usePostcreateMutation();
  const [articlepatch,{error:err}] =useArticlepatchMutation()
 
  const {data} =useGetarticleQuery(id)
  const [postdata, setpostdata] = useState({
    title: "",
    description: "",
    category: "news",
    link1: "",
    link2: ""
  });
  useEffect(()=>{
    if(data){
    setpostdata({
    title:data.title,
    description:data.description,
    category:data.category,
    link1:data.link1,
    link2:data.link2
    })
    
    }
  },[id])
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
      const res = await articlepatch(id,postdata).unwrap();
      console.log("successful updated", res);
    } catch (error) {
      console.error(err?.data?.message);
    }
  };

  return (
    <div>
    <form onSubmit={id ? handlepatchsubmit :handleSubmit}>
      {/* TITLE */}
      <input
        type="text"
        name="title"
        placeholder="Enter title"
        value={postdata.title}
        onChange={handlechange}
      />

      {/* DESCRIPTION */}
      <textarea
        name="description"
        placeholder="Enter description"
        value={postdata.description}
        onChange={handlechange}
      />

      {/* CATEGORY */}
      <select
        name="category"
        value={postdata.category}
        onChange={handlechange}
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
      />

      <input
        type="url"
        name="link2"
        placeholder="Link 2"
        value={postdata.link2}
        onChange={handlechange}
      />

      <button type="submit">{id ? "update post" : "Create Post"}</button>
    </form>
    
    {error && <p>{error?.data?.message}</p>}
    </div>
  );
}

export default Postcreate;
