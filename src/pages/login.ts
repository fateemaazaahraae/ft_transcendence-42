import { navigate } from "../main.ts";
export default function Login() {
  return `
    <div class="min-h-screen w-full flex items-center justify-center relative">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-center gap-[20px] md:gap-[190px]">
        <div class="relative inset-0 w-full md:w-[480px] lg:w-[480px] h-[430px] md:h-full px-2 sm:px-6 py-6 sm:py-10 pt-[40px] pb-[60px] items-center bg-black rounded-[50px] backdrop-blur-[10px] mt-[50px]">
          <form action="">
            <h2
                class="text-white text-center font-glitch text-[1.1em] md:text-[1.5em] leading-[10px] md:leading-[35px] tracking-[2px] mt-[5px] mb-[25px]">
              Step Into Your World ..
            </h2>
            <div class="input-box">
              <input 
                type="text" 
                required 
                placeholder="User name" 
                class="block mx-auto w-[95%] h-[45px] md:h-[52px] px-5 items-center bg-black font-roboto text-white border-none rounded-[20px]
                  shadow-[0_0_10px_rgba(53,198,221,0.9)] 
                  focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] 
                  text-[1.1em] md:text-[1.5em] font-medium outline-none
                  placeholder:text-[0.8em] placeholder:text-gray-400 
                  transition-shadow duration-400 ease-in-out">
            </div>

            <div class="input-box mt-4">
              <input 
                type="password" 
                required 
                placeholder="Password" 
                class="block mx-auto w-[95%] h-[45px] md:h-[52px] px-5 items-center bg-black font-roboto text-white border-none rounded-[20px]
                  shadow-[0_0_10px_rgba(53,198,221,0.9)] 
                  focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] 
                  text-[1.1em] md:text-[1.5em] font-medium outline-none
                  placeholder:text-[0.8em] placeholder:text-gray-400 
                  transition-shadow duration-400 ease-in-out">
            </div>
            <div class="flex p-[20px] font-roboto items-center justify-between mt-3">
              <label class="flex items-center gap-2 text-white cursor-pointer">
                <input type="checkbox" class="sr-only peer" />
                <span class="w-3 md:w-4 h-3 md:h-4 inline-block border-[1px] border-cyan-400 rounded-sm
                            shadow-[0_0_5px_#00ffff] relative
                            peer-checked:border-cyan-400
                            peer-checked:shadow-[0_0_5px_#ff69b4]
                            peer-checked:after:content-['']
                            peer-checked:after:absolute peer-checked:after:left-[5px]
                            peer-checked:after:top-[2px] peer-checked:after:w-[4px]
                            peer-checked:after:h-[8px] peer-checked:after:border-[2px]
                            peer-checked:after:border-t-0 peer-checked:after:border-l-0
                            peer-checked:after:rotate-45 peer-checked:after:border-cyan-400">
                </span>
                <span class="font-thin text-[0.7em] md:text-[0.92em]">Remember Me</span>
              </label>
              <a href="" id="pw" class="text-[#35C6DD] text-[0.67em] md:text-[0.8em] font-semibold border-b hover:text-cyan-800 hover:border-cyan-800 border-[#35C6DDE5]">
                Forget password?
              </a>
            </div>
            <button type="submit" id="login-btn"
              class="flex w-[45%] h-[37px] md:h-[43px] font-glitch items-center justify-center mx-auto leading-[35px] bg-[#35C6DDB5] text-white text-[1.2em] tracking-[2px] px-[20px] py-[7px] rounded-[50px] cursor-pointer md:mt-2 hover:text-black hover:bg-cyan-800 hover:transition hover:duration-300">
              Login
            </button>
            <div class="flex items-center my-[15px] md:my-[30px]">
            <div class="flex-1 border-b-2 border-[#35C6DDE5] opacity-70"></div>
            <span class="px-3 text-[#35C6DDE5] font-roboto text-[0.7em] md:text-[1.0em] font-semibold">
              Or you can join with
            </span>
            <div class="flex-1 border-b-2 border-[#35C6DDE5] opacity-70"></div>
          </div>

            <div class="social-icons flex text-white text-[1.5em] md:text-[2.1em] gap-[15px] justify-center cursor-pointer mt-2">
                <i class="fa-brands fa-google"></i>
                <i class="fa-brands fa-github"></i>
            </div>
            <div class="text-white mt-3 md:mt-9 text-center text-[0.7em] md:text-[0.9em] font-roboto font-semibold">
                <p>Don’t have an account? Click here to 
                <a href="" id="register-link" class="text-[#35C6DD] text-[0.7em] md:text-[0.9em] items-end font-bold border-b  hover:text-cyan-800 hover:border-cyan-800 border-[#35C6DDE5]">Register Now</a>
                </p>

            </div>
          </form>
        <!--<div class="relative z-0 rounded-full blur-[65px] opacity-100 w-[300px] h-[200px] bg-[#D02EA4FF] top-[3%] bottom-[20%] left-240 right-[calc(50%-397px)] rotate-[140deg]"></div>-->

        </div>
      <img src="/images/white_boy22.svg" class="hidden lg:flex md:items-center md:justify-center md:w-1/2 max-w-[420px] w-full h-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]">
    </div>
  </div>
  `;
}

export function LoginEventListener(){
  const register=document.getElementById("register-link");
  register?.addEventListener("click", () => {navigate("/register");  
  });
  const btn=document.getElementById("login-btn");
  btn?.addEventListener("click", () => {navigate("/home");
  });
  const password=document.getElementById("pw");
  password?.addEventListener("click", () => {navigate("/resetpw");
  });
}


    // <!--<div class="absolute inset-0 rounded-[50px] bg-[conic-gradient(from_90deg,_#F40CA4_0deg,_transparent_180deg),_conic-gradient(from_90deg,_#35C6DD_180deg,_transparent_360deg)] animate-spin-slower"></div>-->
  
    // <!--<div class="absolute  w-[400px] h-[250px] bg-cyan-300 rounded-full blur-[60px] opacity-90 rotate-[45deg] top-[230px] left-[340px]"></div>-->
    // <!--<div class="absolute  w-[400px] h-[250px] bg-[rgb(208,46,164)] rounded-full blur-[80px] opacity-90 rotate-[45deg]  top-[550px] left-[560px]"></div>-->
