import { useNavigate } from "react-router-dom"
import { useArticledeleteMutation, useGetuserpostlistQuery } from "../../store/article"


function Userarticlelist(){
   
const {data,error,isLoading} =useGetuserpostlistQuery()
const [articledelete,{error:ed}] =useArticledeleteMutation()
const navigate =useNavigate()  
      if(isLoading){
        return <p>...isloading</p>
      }

const handledelete=async(id)=>{
    try {
        const res=await articledelete(id).unwrap()
        console.log("deleted successfully",res.data)
    } catch (error) {
        console.log(error)
        console.log("erorr a rha hai",ed?.data?.message)
    }
}
     console.log(data,"pp")
     console.log(error,"jk")
      return (
        <div>
            {data && 
            data.map((item)=>(
                <div key={item.id}>
               <h1>{item.title}</h1>
               <button onClick={()=>navigate(`/up/${item.id}`)}>Edit</button>
               <button onClick={()=>handledelete(item.id)}>Delete</button>
                </div>
            ))}
    
            {error && <p>{error}</p>}
        </div>
      )
    }

    export default Userarticlelist
    
   
