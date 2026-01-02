import { useNavigate, useParams } from "react-router-dom"


import { useGetbyidQuery } from "../store/home"
import Commentpost from "./comment/commentpost"



function Articlebyid(){
const {id} =useParams()
const navigate =useNavigate()
const {data,error,isLoading} =useGetbyidQuery(id)
   
      if(isLoading){
        return <p>...isloading</p>
      }

     console.log(data,"q")
     console.log(error,"m")
      return (
        <div>
             {data && <div>
               <h1>{data.title}</h1>
               <h1>{data.description}</h1>
              <Commentpost id={data.id}/>
              
                </div>}
                
           
    
            {error && <p>{error}</p>}
        </div>
      )
    }

    export default Articlebyid
    
   
