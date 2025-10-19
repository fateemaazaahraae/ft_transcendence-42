import { navigate } from "../main.ts";

export default function Register() {
  return `<div class="flex items-center gap-[170px] relative pt-[3%]">
        <img src="/images/blue-boy33.svg" alt="Blue Boy" class="w-[500px] h-auto mt-[7%] ml-[300px] drop-shadow-[0_0_17px_rgba(0,160,255,255.7)]">
<!--I removed glow from this part-->

        <div class="absolute z-0 rounded-full blur-[55px] opacity-100 w-[250px] h-[250px] bg-[#35C6DDE5] right-[calc(50%-220px)] top-[15%]"></div>
        <div class="absolute z-0 rounded-full blur-[55px] opacity-100 w-[300px] h-[500px] bg-[#D02EA48A] right-[calc(50%-598px)] bottom-[35%] top-[53%] -rotate-[20deg]"></div>


        <div class="relative w-[530px] mt-[7%] pt-[2%] pb-[2%] px-[50px] bg-black rounded-[50px] blur-[10]">
            <form action="">
                <h2
                class="font-glitch font-extralight w-full text-[1.5em] leading-[35px] tracking-[2px] text-white mb-[20px] text-center">
                Register Now !</h2>
                <div class="flex justify-between gap-[10px] pb-[3px] pr-[5px] pl-0 w-[430px] my-[30px] bg-none rounded-[20px] ">
                    <span class="icon"></span>
                    <input type="text" required placeholder="First name" class="w-full h-[52px] px-[20px] py-[15px] bg-black font-roboto text-white border-none shadow-[0_0_10px_rgba(53,198,221,0.9)] focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] text-[0.9em] font-medium outline-none placeholder:text-gray-400 transition-shadow duration-400 ease-in-out rounded-[20px] placeholder:text-[0.9em] ">
                    <span class="icon"></span>
                    <input type="text" required placeholder="Last name" class="w-full h-[52px] px-[20px] py-[15px] bg-black font-roboto text-white border-none shadow-[0_0_10px_rgba(53,198,221,0.9)] focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] text-[0.9em] font-medium outline-none placeholder:text-gray-400 transition-shadow duration-400 ease-in-out rounded-[20px] placeholder:text-[0.9em] ">
                </div>
                <div class="flex justify-between gap-[10px] pb-[3px] pr-[5px] pl-0 w-[430px] my-[30px] bg-none rounded-[20px] ">
                    <span class="icon"></span>
                    <input type="text" required placeholder="User name" class="w-full h-[52px] px-[20px] py-[15px] bg-black font-roboto text-white border-none shadow-[0_0_10px_rgba(53,198,221,0.9)] focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] text-[0.9em] font-medium outline-none placeholder:text-gray-400 transition-shadow duration-400 ease-in-out rounded-[20px] placeholder:text-[0.9em] ">
                </div>
                <div class="flex justify-between gap-[10px] pb-[3px] pr-[5px] pl-0 w-[430px] my-[30px] bg-none rounded-[20px] ">
                    <span class="icon"></span>
                    <input type="email" required placeholder="Email" class="w-full h-[52px] px-[20px] py-[15px] bg-black text font-roboto-white border-none shadow-[0_0_10px_rgba(53,198,221,0.9)] focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] text-[0.9em] font-medium outline-none placeholder:text-gray-400 transition-shadow duration-400 ease-in-out rounded-[20px] placeholder:text-[0.9em] ">
                </div>
                <div class="flex justify-between gap-[10px] pb-[3px] pr-[5px] pl-0 w-[430px] my-[30px] bg-none rounded-[20px] ">
                    <span class="icon"></span>
                    <input type="password" required placeholder="Password" class="w-full h-[52px] px-[20px] py-[15px] bg-black text font-roboto-white border-none shadow-[0_0_10px_rgba(53,198,221,0.9)] focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] text-[0.9em] font-medium outline-none placeholder:text-gray-400 transition-shadow duration-400 ease-in-out rounded-[20px] placeholder:text-[0.9em] ">
                    <span class="icon"></span>
                    <input type="password" required placeholder="Confirm Password" class="w-full h-[52px] px-[20px] py-[15px] bg-black font-roboto text-white border-none shadow-[0_0_10px_rgba(53,198,221,0.9)] focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] text-[0.9em] font-medium outline-none placeholder:text-gray-400 transition-shadow duration-400 ease-in-out rounded-[20px] placeholder:text-[0.9em] ">
                </div>
                <button type="submit" id="submit"
                    class="flex w-[45%] h-[50px] font-glitch justify-center items-center ml-[110px] leading-[35px] bg-[#35C6DDB5] text-white text-[1.2em] tracking-[2px] px-[15px] py-[10px] rounded-[50px] cursor-pointer mt-2 hover:text-black hover:bg-cyan-800 hover:transition hover:duration-300">
                    Submit
                </button>
                <div class="flex items-center my-[30px]">
                    <div class="flex-1 border-b-2 border-[#35C6DDE5] opacity-70"></div>
                    <span class="px-3 text-[#35C6DDE5] font-roboto text-[1.0em] font-semibold">
                    Or you can join with
                    </span>
                    <div class="flex-1 border-b-2 border-[#35C6DDE5] opacity-70"></div>
                </div>
                <div class="social-icons flex text-white text-[1.9em] gap-[15px] justify-center cursor-pointer mt-2">
                    <i class="fa-brands fa-google"></i>
                    <i class="fa-brands fa-github"></i>
                </div>
                <div class="text-white mt-5 text-center text-[1.0em] font-roboto font-semibold">
                    <p>Already a member? 
                    <a href="" id="login-link" class="text-[#35C6DD] text-[0.9em] items-end font-bold border-b  hover:text-cyan-800 hover:border-cyan-800 border-[#35C6DDE5]">Login</a>
                     </p>

                </div>
            </form>
        </div>
    </div>
    `;
}

        // <div class="absolute z-0 rounded-full blur-[55px] opacity-100 w-[300px] h-[500px] bg-[#D02EA48A] right-[calc(50%-798px)] bottom-[20%] top-[43%] -rotate-[20deg]"></div>
        // <div class="absolute z-0 rounded-full blur-[55px] opacity-100 w-[250px] h-[250px] bg-[#35C6DDE5] right-[calc(50%-410px)] top-[20%]"></div>


export function RegisterEventListener(){
    const login= document.getElementById("login-link");
    login?.addEventListener("click", () =>{navigate("/login");
    }); 
    const submit= document.getElementById("submit");
    submit?.addEventListener("click", () =>{navigate("/ChoseAvatar");
    }); 
}