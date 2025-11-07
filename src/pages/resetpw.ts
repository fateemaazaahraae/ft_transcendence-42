import { navigate } from "../main.ts";
export default function ResetPw() {
  return `<div class="min-h-screen w-full flex items-center justify-center gap-[80px] relative pt-[7%] md:pt-[3%]">

    <div class="relative inset-0 items-center h-[400px] md:h-full w-full md:w-[820px] pt-[50px] md:pt-[1px] pb-[60px] px-[20px] md:px-[150px] rounded-[50px] overflow-hidden ml-[1%] ">

        <div class="absolute rounded-full blur-[55px] opacity-80  w-[170px] h-[240px] md:w-[400px] md:h-[250px] bg-[#35C6DDE5] left-[calc(50%-175px)] md:left-[calc(50%-320px)]  top-[20%] md:top-[19%] -rotate-[20deg] md:rotate-[63deg]"></div>
        <div class="absolute rounded-full blur-[55px] opacity-100 w-[130px] h-[260px] md:w-[400px] md:h-[250px] bg-[#D02EA48A] right-[calc(50%-146px)] md:left-[calc(50%-60px)] md:bottom-[60%] top-[50%] md:top-[53%] -rotate-[35deg] md:rotate-[45deg]"></div>

        <div class="relative inset-0 m-auto w-[320px] md:w-[480px] lg:w-[480px] h-full px-2 sm:px-6 py-6 sm:py-10 pt-[40px] pb-[60px] items-center bg-black rounded-[40px] md:rounded-[50px] backdrop-blur-[10px] mt-[50px]">
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
              class="flex w-[45%] h-[37px] md:h-[43px] font-glitch items-center justify-center mx-auto leading-[35px] bg-[#35C6DDB5] text-white text-[1.2em] tracking-[2px] px-[20px] py-[20px] rounded-[50px] cursor-pointer md:mt-10 hover:text-black hover:bg-cyan-800 hover:transition hover:duration-300">
              Send
            </button>
            <div class="text-white mt-3 md:mt-9 text-center text-[0.7em] md:text-[0.9em] font-roboto font-semibold">
                <p>Already a member? 
                <a href="" id="register-link" class="text-[#35C6DD] text-[0.7em] md:text-[0.9em] items-end font-bold border-b  hover:text-cyan-800 hover:border-cyan-800 border-[#35C6DDE5]">Login</a>
                </p>

            </div>
          </form>
        <!--<div class="relative z-0 rounded-full blur-[65px] opacity-100 w-[300px] h-[200px] bg-[#D02EA4FF] top-[3%] bottom-[20%] left-240 right-[calc(50%-397px)] rotate-[140deg]"></div>-->

        </div>
        </div>
      <img src="/images/white_boy22.svg" class="hidden lg:flex md:items-center md:justify-center md:w-1/2 max-w-[420px] w-full h-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]">
  </div>
  `;
}

export function ResetPwEventListener(){
  const btnSend=document.getElementById("send");
  btnSend?.addEventListener("click", () =>{navigate("/TwoFactor");
  });
}


//   return `
//     <div class="flex items-center justify-center gap-[170px] relative min-h-screen w-full">
//     <div class="absolute  w-[315px] h-[230px] bg-cyan-300 rounded-full blur-[60px] opacity-90 rotate-[45deg] top-[300px] left-[400px]"></div>
//     <div class="absolute  w-[200px] h-[270px] bg-[rgb(208,46,164)] rounded-full blur-[80px] opacity-90 rotate-[45deg]  top-[450px] left-[660px]"></div>
//     <div class="relative h-[350px] w-[480px] pt-[40px] pb-[60px] items-center px-[50px] bg-black rounded-[50px] backdrop-blur-[10px] ml-[1580px] ">
//       <form action="">
//         <h2
//             class="text-white text-center font-glitch text-[1.5em] leading-[35px] tracking-[2px] mt-[5px] mb-[20px]">
//           Reset password
//         </h2>
//         <div class="flex justify-center input-box mb-[35px] mt-[30px]">
//           <input 
//             type="email" 
//             required 
//             placeholder="Enter e-mail" 
//             class="w-[330px] h-[52px] px-[20px] py-[15px] items-center bg-black font-roboto text-white border-none rounded-[20px]
//               shadow-[0_0_10px_rgba(53,198,221,0.9)] 
//               focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] 
//               text-[1.1em] font-medium outline-none mx-3 
//               placeholder:text-[0.8em] placeholder:text-gray-400 
//               transition-shadow duration-400 ease-in-out">
//         </div>
//         <button type="submit" id="send"
//           class="flex w-[45%] h-[43%] font-glitch items-center justify-center ml-[110px] leading-[35px] bg-[#35C6DDB5] text-white text-[1.2em] tracking-[2px] py-[7px] rounded-[50px] cursor-pointer mt-2 hover:text-black hover:bg-cyan-800 hover:transition hover:duration-300">
//           Send
//         </button>
//         <div class="text-white mt-[33px] text-center text-[1.0em] font-roboto font-semibold">
//                     <p>Already a member? <a href="#" class="text-[#35C6DD] text-[0.9em] items-end font-bold border-b  hover:text-cyan-800 hover:border-cyan-800 border-[#35C6DDE5]">Login</a> </p>

//                 </div>
//       </form>

//     </div>
//     <img src="/images/white_boy22.svg" class="w-[420px] h-[702px] mr-[1570px] drop-shadow-[0_0_20px_rgba(255,255,255,255.7)]">
//   </div>
//   `;
// }
