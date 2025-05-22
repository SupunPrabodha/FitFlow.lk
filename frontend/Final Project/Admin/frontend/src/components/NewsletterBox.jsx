import React from 'react'

const NewsletterBox = () => {
    const onSubmitHandler = (event) => {
        event.preventDefault();
    }

  return (
    <div className=' text-center'>
        <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</p>
        <p className='text-gray-400 mt-3'>Don't miss out! Get the latest gym tips & special offers straight to your inbox. Subscribe now!</p>
        <p>  <br/>  </p>
<form>
    <input className='w-full sm:flex-1 outline-none' type="email" placeholder='Enter your email' required/>
    <p>  <br/>  </p>    
    <button type='submit' className='bg-black text-white text-xs px-10 py-4'>SUBSCRIBE</button>
</form>
        </div>
  )
}

export default NewsletterBox
