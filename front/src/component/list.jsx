import { useGetitemQuery } from "../store/home"


function Postlist(){
  const {data,error,isLoading} =useGetitemQuery()

  if(isLoading){
    return <p>...isloading</p>
  }
 console.log(data,"pp")
 console.log(error,"jk")
  return (
    <div>
        {data && 
        data.map((item)=>(
            <div key={item.id}>
           <h1>{item.title}</h1>
            </div>
        ))}

        {error?.data?.message && <p>{error?.data?.message}</p>}
    </div>
  )
}

export default Postlist