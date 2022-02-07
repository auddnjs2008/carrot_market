import { resourceUsage } from 'process';
import { FieldError, FieldErrors, useForm } from 'react-hook-form'

// Less code(o)
// Better validation(o)
// Better Erros (set,clear,display)
// Have Control over inputs 
// Don't deal with events (o)
// Easier Inputs(o)

interface LoginForm{
    username:string;
    password:string;
    email:string;
    errors?:string;
}

export default function Forms(){

    const {register,handleSubmit,setError,formState:{errors}} = useForm<LoginForm>({mode:"onChange"});
    const onValid = (data:LoginForm) => {
        console.log("i am valid")
        setError("username",{message:"Taken username"});
    }

    const onInvalid = (errors:FieldErrors) =>{
        console.log(errors);
    };

    

    return <form onSubmit={handleSubmit(onValid,onInvalid)} >
        <input {...register("username",{
            required:"Username is required",
            minLength:{message:"The username should be longer than 5 chars", value:5},
            
        })}  className={`${Boolean(errors.email?.message) ? "border-red-500" : ""}`} type="text" placeholder="Username"/>
        
        <input {...register("email",{required:"Email is required",validate:{notGmail:(value) => !value.includes("@gmail.com") || "Gmail is no allowed"}})}   type="email" placeholder="Email"/>
        {errors.email?.message}
        <input  {...register("password",{required:"Password is required"})}  type="password" placeholder="Password"/>
        <input type="submit"  value="Create Account" />
        {errors.errors?.message}
    </form>
}