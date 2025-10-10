export default function Login() {
  return `
    <div class="flex items-center gap-[135px] relative">
    <!-- <div class="relative z-0 rounded-full blur-[55px] opacity-100 w-[300px] h-[500px] bg-[#D02EA48A] top-[3%] bottom-[20%] left-240 right-[calc(50%-97px)] rotate-[140deg]"></div> -->
    <div class="relative h-[650px] w-[530px] pt-[40px] pb-[60px] px-[50px] bg-black rounded-[50px] backdrop-blur-[10px] ml-[170px]">
      <form action="">
        <h2
            class="text-white text-center font-glitch text-[1.9em] leading-[35px] tracking-[2px] mt-[15px] mb-[10px]">
          Step Into Your World ..
        </h2>
        <div class="input-box">
  <input 
    type="text" 
    required 
    placeholder="User name" 
    class="w-[395px] px-[20px] py-[15px] bg-black font-roboto text-white border-none rounded-[20px] 
           shadow-[0_0_15px_rgba(53,198,221,0.9)] 
           focus:shadow-[0_0_15px_rgba(255,255,255,0.9)] 
           text-[1.1em] font-semibold outline-none mx-3 
           placeholder:text-[0.8em] placeholder:text-gray-400 
           transition-shadow duration-300 ease-in-out"
  >
</div>

<div class="input-box mt-4">
  <input 
    type="password" 
    required 
    placeholder="Password" 
    class="w-[395px] px-[20px] py-[15px] bg-black font-roboto text-white border-none rounded-[20px] 
           shadow-[0_0_15px_rgba(53,198,221,0.9)] 
           focus:shadow-[0_0_15px_rgba(255,255,255,0.9)] 
           text-[1.1em] font-semibold outline-none mx-3 
           placeholder:text-[0.8em] placeholder:text-gray-400 
           transition-shadow duration-300 ease-in-out"
  >
</div>
        <div class="flex p-[20px] font-roboto items-center justify-between mt-3">
        <label class="flex items-center gap-2 text-white">
          <input type="checkbox" class="w-4 h-4 checked:rounded-full">
          <span class="font-thin  text-[0.92em]">Remember Me</span>
        </label>
        <a href="#" class="text-[#35C6DD] text-[0.8em] items-end font-semibold border-b-1 border-[#35C6DDE5]">Forgot password?</a>
        </div>
        <button type="submit"
          class="w-[45%] h-[43px] font-glitch items-center ml-[110px] leading-[35px] bg-[#35C6DDB5] text-white text-[1.2em] tracking-[2px] px-[20px] py-[7px] rounded-[50px] cursor-pointer mt-2 hover:text-black hover:bg-[#ce386a] hover:transition hover:duration-300">
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
        <div class="text-white mt-11 text-center text-[1.0em] font-roboto font-semibold">
            <p>Don’t have an account? Click here to <a href="#" class="text-[#35C6DD] text-[0.9em] items-end font-bold border-b-1 border-[#35C6DDE5]">Register Now</a> </p>

        </div>
      </form>
    </div>
    <img src="/images/white-boy2.svg" class="w-[980px] h-auto">
  </div>
  `;
}

