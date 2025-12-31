import { useState } from "react";
import { useCommentpostMutation } from "../../store/comment";


function Postcomment({id,parent_d=null}){
    const [content,setcontent] =useState("")
    const [postdata,error,isLoading] =useCommentpostMutation()
  const handleSubmit =async()=>{
    try {
         const res =await postdata({
            id:id,
            parent_d:parent_d,
            data:content
         })

         console.log("kk",res.data)
    } catch (err) {
        console.log("error",err)
    }
  }
    return (
        <div>
            <label>write comment</label>
            <input type="text" name={content} value={content} onChange={(e)=>setcontent(e.target.value)}></input>
        <button onClick={handleSubmit}>Submit</button>
        </div>
    )
}

export default Postcomment