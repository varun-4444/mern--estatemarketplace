import { useState,useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react';
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage'
import { updateUserStart,updateUserSuccess,updateUserFailure,deleteUserStart,deleteUserSuccess,deleteUserFailure } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

import {app} from "../firebase" 

export default function Profile() {
  const {currentUser,loading,error} = useSelector((state)=>state.user);
  const fileRef =useRef(null);
  const [file,setFile]=useState(undefined);
  const [filePercent,setFilePercent]=useState(0);
  const [fileUploadError,setFileUploadError]=useState(false);
  const [formData,setFormData] = useState({});
  const [updateSuccess,setUpdateSuccess]=useState(false);
  const dispatch=useDispatch();
  
  useEffect( () =>
  {
    if(file)
    {
      handleFileUpload(file);
    }

  },[file]);

  const handleFileUpload = (file) =>
  {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name ;
    const storageRef = ref(storage , fileName);
    const uploadTask = uploadBytesResumable(storageRef,file);

    uploadTask.on('state_changed',(snapshot)=>
  {
    const progress=Math.round((snapshot.bytesTransferred)/(snapshot.totalBytes)*100);
    setFilePercent(progress);
  },
    (error)=>
      {
          setFileUploadError(true);
      },
    ()=>
      {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>
          setFormData({...formData, avatar : downloadURL})
      )
      }
    );
};

const handleChange = (e) => {
setFormData({ ...formData, [e.target.id]: e.target.value });
};

const handleSubmit = async (e) => {
e.preventDefault();
try {
  dispatch(updateUserStart());
  const res = await fetch(`/api/user/update/${currentUser._id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (data.success === false) {
    dispatch(updateUserFailure(data.message));
    return;
  }

  dispatch(updateUserSuccess(data));

  setUpdateSuccess(true);
} catch (error) {
  dispatch(updateUserFailure(error.message));
}
};
  const handleDeleteUser = async(e)=>
  {
    try {
      dispatch(deleteUserStart());
      const res=await fetch(`/api/user/delete/${currentUser._id}`,
    {
      method:'DELETE',
    });
      const data= await res.json();
      if(data.success === false)
      {
        dispatch(deleteUserFailure(data.message));
        return ;
      }
      dispatch(deleteUserSuccess(data));

      
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  return (
      <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      
      <form className=" flex flex-col  text-center gap-4 justify-center m-3" onSubmit={handleSubmit} >
      <input onChange={ (e) =>  setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*'/>
      <img  onClick = {()=>fileRef.current.click()}className="rounded-full h-24  w-24 self-center object-cover mx-auto cursor-pointer"src={formData.avatar || currentUser.avatar} onChange={handleChange} alt="image"></img>
      <p>{ fileUploadError ? (<span className="text-red-700">error In Uploading image(image must be less than 2 megabytes)</span>) : filePercent > 0 && filePercent < 100 ?
      (<span className='text-slate-700'>{`uploading ${filePercent}%`}</span> ): filePercent===100 ? <span className="text-green-700">Image Uploaded Successfully</span> :( "")
      }
      </p>
      <input type="text" placeholder={currentUser.username} defaultValue={currentUser.username} className=" border p-3 rounded-lg" id="username" onChange={handleChange} />
        <input type="email" placeholder='Email'  defaultValue={currentUser.email} className="border p-3 rounded-lg" id="email" onChange={handleChange}/>
        <input type="password" placeholder="Password" className="border p-3 rounded-lg" id="password" onChange={handleChange}/>
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-85 "  >
          
          {loading ? "Loading..." :"UPDATE" } 
          </button>
        <button className="bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-85" >CREATE LISTING</button>
        <div className="flex flex-row justify-between">
          <p  className="text-red-700 p-3   hover:opacity-95 disabled:opacity-85 cursor-pointer " onClick={handleDeleteUser}>Delete Account</p>
          <p className="text-red-500">Sign Out</p>
        </div>
        <p className="text-green-500">Show Listings</p>
       </form>
       {/* <div className="text-red-700 mt-5">
        {error ? error : ""}
       </div> */}
       <div className="text-green-700 mt-5">
        {updateSuccess ? "Successfully updated" : ""} 
       </div>

      </div>
  )
}
