import { navigate } from "../main.ts";
export default function ResetPw() {
  return `<div class="min-h-screen w-full flex items-center justify-center gap-[8px] relative pt-[3%]">

    <div class="relative inset-0 items-center h-[550px] md:h-[750px] w-full md:w-[820px] pt-[110px] md:pt-[130px] rounded-[50px] overflow-hidden mr-[3%] ">

        <div class="absolute rounded-full blur-[55px] opacity-80  w-[170px] h-[240px] md:w-[265px] md:h-[170px] bg-[#35C6DDE5] left-[calc(50%-175px)] md:left-[calc(50%-320px)]  top-[20%] md:top-[24%] -rotate-[20deg] md:rotate-[63deg]"></div>
        <div class="absolute rounded-full blur-[55px] opacity-110 w-[90px] h-[300px] md:w-[300px] md:h-[250px] bg-[#D02EA48A] right-[calc(50%-106px)] md:left-[calc(50%-20px)] md:bottom-[60%] top-[34%] md:top-[43%] -rotate-[35deg] md:rotate-[45deg]"></div>

        <div class="relative inset-0 m-auto w-[320px] md:w-[480px] lg:w-[480px] h-[250px] md:h-[330px] px-2 sm:px-6 py-6 sm:py-10 pt-[40px] pb-[60px] items-center bg-black rounded-[40px] md:rounded-[50px] backdrop-blur-[10px] mt-[50px]">
          <form action="">
            <h2
                class="text-white text-center font-glitch text-[1.1em] md:text-[1.5em] leading-[10px] md:leading-[35px] tracking-[2px] mt-[5px] mb-[25px]">
              Reset password
            </h2>
            <div class="input-box">
              <input 
                type="email" 
                required 
                placeholder="Enter e-mail" 
                class="block mx-auto w-[95%] h-[45px] md:h-[52px] px-5 items-center bg-black font-roboto text-white border-none rounded-[20px]
                  shadow-[0_0_10px_rgba(53,198,221,0.9)] 
                  focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] 
                  text-[1.1em] md:text-[1.5em] font-medium outline-none
                  placeholder:text-[0.8em] placeholder:text-gray-400 
                  transition-shadow duration-400 ease-in-out">
            </div>
            <button type="submit" id="send"
              class="flex w-[45%] h-[37px] md:h-[43px] font-glitch items-center justify-center mx-auto leading-[35px] bg-[#35C6DDB5] text-white text-[1.2em] tracking-[2px] px-[20px] py-[20px] rounded-[50px] cursor-pointer mt-7 md:mt-10 hover:text-black hover:bg-cyan-800 hover:transition hover:duration-300">
              Send
            </button>
            <div class="text-white mt-5 md:mt-9 text-center text-[0.7em] md:text-[0.9em] font-roboto font-semibold">
                <p>Already a member? 
                <a href="" id="register-link" class="text-[#35C6DD] text-[0.7em] md:text-[0.9em] items-end font-bold border-b  hover:text-cyan-800 hover:border-cyan-800 border-[#35C6DDE5]">Login</a>
                </p>

            </div>
          </form>
        </div>
        </div>
      <img src="/public/white_boy22.svg" class="hidden lg:flex md:items-center md:justify-center md:w-1/2 max-w-[420px] w-full h-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.9)] pb-[120px]">
  </div>
  `;
}

export function ResetPwEventListener(){
  const btnSend=document.getElementById("send");
  btnSend?.addEventListener("click", () =>{navigate("/TwoFactor");
  });
}
