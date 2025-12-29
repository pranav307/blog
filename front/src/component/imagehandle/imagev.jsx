import { useState } from "react";
import { usePostimageMutation } from "../../store/image";
import { useParams } from "react-router-dom";



function Imagevideo(){
    const {id} =useParams()
    const [file,setfile] =useState(null)
    const handlechange=(e)=>{
        const f =e.target.files[0]
        setfile(f)
       }

    if(isLoading){
        return <p>...loading</p>
    }
    const [imagehandle,{error,isLoading}] =usePostimageMutation()
    const handlesubmit=async()=>{
      if(!file) {
        alert("file not selected")
        return
      }

      const formdata= new FormData()
      formdata.append("file",file)
      try {
          const res = await imagehandle({id,data:formdata}).unwrap()
          console.log(res?.data,"successfully uploaded")
          alert("Uploaded successfully");
      } catch (error) {
        console.log(error?.data?.message)
      }
    }

return (
    <>
    <label>Upload image or video</label>
      <input type="file" value={file} 
      name="file"
      accept="image/*,video/*"
      onChange={handlechange}></input>
      <button onClick={handlesubmit}>{isLoading ? "uploading" :"upload"}</button>
       {error && <p>Error uploading file {error?.data?.message}</p>}
    </>

    
)
}
export default Imagevideo