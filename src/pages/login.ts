export default function Login() {
  return `
    <div class="flex items-center justify-center gap-[4px] relative min-h-screen w-full">
    
    <div class="absolute  w-[400px] h-[200px] bg-cyan-500 rounded-full blur-[80px] opacity-90 rotate-[45deg] top-[196px] left-[270px] transform -translate-x-1/2 -translate-y-1/2"></div>
    <div class="absolute  w-[400px] h-[250px] bg-[rgb(208,46,164)] rounded-full blur-[80px] opacity-90 rotate-[45deg]  top-[560px] left-[550px]"></div>
    <div class="relative h-[600px] w-[480px] pt-[40px] pb-[60px] items-center px-[50px] bg-black rounded-[50px] backdrop-blur-[10px] ml-[1480px] ">
      <form action="">
        <h2
            class="text-white text-center font-glitch text-[1.5em] leading-[35px] tracking-[2px] mt-[5px] mb-[20px]">
          Step Into Your World ..
        </h2>
        <div class="input-box">
          <input 
            type="text" 
            required 
            placeholder="User name" 
            class="w-[370px] h-[52px] px-[20px] py-[15px] items-center bg-black font-roboto text-white border-none rounded-[20px]
                  shadow-[0_0_10px_rgba(53,198,221,0.9)] 
                  focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] 
                  text-[1.1em] font-medium outline-none mx-3 
                  placeholder:text-[0.8em] placeholder:text-gray-400 
                  transition-shadow duration-500 ease-in-out"
          >
        </div>

        <div class="input-box mt-4">
          <input 
            type="password" 
            required 
            placeholder="Password" 
            class="w-[370px] h-[52px] px-[20px] py-[15px] items-center bg-black font-roboto text-white border-none rounded-[20px]
                  shadow-[0_0_10px_rgba(53,198,221,0.9)] 
                  focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] 
                  text-[1.1em] font-medium outline-none mx-3 
                  placeholder:text-[0.8em] placeholder:text-gray-400 
                  transition-shadow duration-300 ease-in-out"
          >
        </div>
        <div class="flex p-[20px] font-roboto items-center justify-between mt-3">
          <label class="flex items-center gap-2 text-white cursor-pointer">
            <input type="checkbox" class="sr-only peer" />
            <span class="w-4 h-4 inline-block border-[1px] border-cyan-400 rounded-sm
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
            <span class="font-thin text-[0.92em]">Remember Me</span>
          </label>
          <a href="#" class="text-[#35C6DD] text-[0.8em] font-semibold border-b hover:text-cyan-800 hover:border-cyan-800 border-[#35C6DDE5]">
            Forgot password?
          </a>
        </div>
        <button type="submit"
          class="w-[45%] h-[43px] font-glitch items-center ml-[110px] leading-[35px] bg-[#35C6DDB5] text-white text-[1.2em] tracking-[2px] px-[20px] py-[7px] rounded-[50px] cursor-pointer mt-2 hover:text-black hover:bg-cyan-800 hover:transition hover:duration-300">
          Login
        </button>
        <div class="flex items-center my-[30px]">
        <div class="flex-1 border-b-2 border-[#35C6DDE5] opacity-70"></div>
        <span class="px-3 text-[#35C6DDE5] font-roboto text-[1.0em] font-semibold">
          Or you can join with
        </span>
        <div class="flex-1 border-b-2 border-[#35C6DDE5] opacity-70"></div>
      </div>

        <div class="social-icons flex text-white text-[2.1em] gap-[15px] justify-center cursor-pointer mt-2">
            <ion-icon name="logo-google"></ion-icon>
            <ion-icon name="logo-github"></ion-icon>
        </div>
        <div class="text-white mt-9 text-center text-[0.9em] font-roboto font-semibold">
            <p>Don’t have an account? Click here to <a href="#" class="text-[#35C6DD] text-[0.9em] items-end font-bold border-b  hover:text-cyan-800 hover:border-cyan-800 border-[#35C6DDE5]">Register Now</a> </p>

        </div>
      </form>
    <!--<div class="relative z-0 rounded-full blur-[65px] opacity-100 w-[300px] h-[200px] bg-[#D02EA4FF] top-[3%] bottom-[20%] left-240 right-[calc(50%-397px)] rotate-[140deg]"></div>-->

    </div>
    <img src="/images/white-boy2.svg" class="w-[1120px] h-[752px] mr-[1050px] drop-shadow-[0_0_20px_rgba(255,255,255,255.7)]">
  </div>
  `;
}

