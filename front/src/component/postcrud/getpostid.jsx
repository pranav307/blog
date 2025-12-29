import { useNavigate, useParams } from "react-router-dom"
import { useArticledeleteMutation, useGetarticleQuery } from "../../store/article"



function Userarticlebyid(){
const {id} =useParams()
const navigate =useNavigate() 
const {data,error,isLoading} =useGetarticleQuery(id)
 const [articledelete,{error:err}] =useArticledeleteMutation()   
      if(isLoading){
        return <p>...isloading</p>
      }
const handledelete=async(id)=>{
    try {
        const res=await articledelete(id).unwrap()
        console.log("deleted successfully",res.data)
    } catch (error) {
        console.log("erorr a rha hai",err?.data?.message)
    }
}
     console.log(data,"pp")
     console.log(error,"jk")
      return (
        <div>
             {data && <div>
               <h1>{data.title}</h1>
               <h1>{data.description}</h1>

               <button onClick={()=>navigate(`/up/${data.id}`)}>Update</button>
               <button onClick={()=>handledelete(data.id)}>Delete</button>
                </div>}
                
           
    
            {error && <p>{error}</p>}
        </div>
      )
    }

    export default Userarticlebyid
    
   
