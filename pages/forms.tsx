import { resourceUsage } from 'process';
import { useForm } from 'react-hook-form'

// Less code(o)
// Better validation
// Better Erros (set,clear,display)
// Have Control over inputs 
// Don't deal with events (o)
// Easier Inputs(o)

export default function Forms(){

    const {register,handleSubmit} = useForm();
    const onValid = () => {
        console.log("i am valid")
    }
    return <form onSubmit={handleSubmit(onValid)} >
        <input {...register("username",{
            required:true,

        })}   type="text" placeholder="Username"/>
        <input {...register("email",{required:true})}   type="email" placeholder="Email"/>
        <input  {...register("password",{required:true})}  type="password" placeholder="Password"/>
        <input type="submit"  value="Create Account" />
    </form>
}