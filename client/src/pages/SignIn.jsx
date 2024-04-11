import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import {useNavigate} from 'react-router-dom'
export default function SignIn() {

  const[formData,setFormData]=useState({});
  const [error,setError]=useState(null);
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();
  const handleChange = (e) =>
  {
    setFormData (
      {
        ...formData, // spread operator creates copy pof current elements 
        [e.target.id]:e.target.value, //updates when do any change in form 
      }
    )
  };

  const handleSubmit = async(e) =>
  {
    e.preventDefault(); // to stop reload of page when we click on submit button
    try{
    setLoading(true);
    const res= await fetch('api/auth/signin',{
      method : 'POST',
      headers : 
      {
        'Content-Type' : 'application/json',
      },
      body:JSON.stringify(formData),
    });
    const data =await res.json();
    if(data.success === false)
    {
      setError(data.message);
      setLoading(false);
      
      return ;
    }
    setLoading(false);
    setError(null);
    navigate("/");
    console.log(data);
  }
  catch(error)
    {setLoading(false) 
      setError(error.message);
    }
   
  }

  console.log(formData);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">SignIn</h1>
      <form className=" flex flex-col  text-center gap-4 justify-center"  onSubmit={handleSubmit}>
        <input type="email" placeholder='Email'   className="border p-3 rounded-lg" id="email" onChange={handleChange}/>
        <input type="password" placeholder="Password" className="border p-3 rounded-lg" id="password" onChange={handleChange} />
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-85" >{loading ? 'loading' : 'SignUp' } </button>
       </form>
       <div className="flex flex-row gap-2 my-4">
        <p>Dont have an account ? </p>
        <Link to="/sign-up" className="text-blue-500">SignUp</Link>
       </div>
       {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  )
}
