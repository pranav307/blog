import { useGetitemQuery } from "../store/home"


function Postlist(){
  const {data,errors,isLoading} =useGetitemQuery()

  if(isLoading){
    return <p>...isloading</p>
  }
 console.log(data,"pp")
 console.log(errors,"jk")
  return (
    <div>
        {data && 
        data.map((item)=>(
            <div key={item.id}>
           <h1>{data.title}</h1>
            </div>
        ))}

        {errors && <p>{errors}</p>}
    </div>
  )
}