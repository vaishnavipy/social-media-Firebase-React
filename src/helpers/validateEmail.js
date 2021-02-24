export default  function validateEmail(email){
        
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email.toLowerCase()))
    {
        return ""
    }   
       
        return "Please Enter a valid email"
    }
