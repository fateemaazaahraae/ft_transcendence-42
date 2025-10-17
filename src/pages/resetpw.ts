export default function ResetPw() {
  return `
    <div class="flex items-center justify-center gap-[170px] relative min-h-screen w-full">
    <div class="absolute  w-[315px] h-[230px] bg-cyan-300 rounded-full blur-[60px] opacity-90 rotate-[45deg] top-[300px] left-[400px]"></div>
    <div class="absolute  w-[200px] h-[270px] bg-[rgb(208,46,164)] rounded-full blur-[80px] opacity-90 rotate-[45deg]  top-[450px] left-[660px]"></div>
    <div class="relative h-[350px] w-[480px] pt-[40px] pb-[60px] items-center px-[50px] bg-black rounded-[50px] backdrop-blur-[10px] ml-[1580px] ">
      <form action="">
        <h2
            class="text-white text-center font-glitch text-[1.5em] leading-[35px] tracking-[2px] mt-[5px] mb-[20px]">
          Reset password
        </h2>
        <div class="flex justify-center input-box mb-[35px] mt-[30px]">
          <input 
            type="email" 
            required 
            placeholder="Enter e-mail" 
            class="w-[330px] h-[52px] px-[20px] py-[15px] items-center bg-black font-roboto text-white border-none rounded-[20px]
              shadow-[0_0_10px_rgba(53,198,221,0.9)] 
              focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] 
              text-[1.1em] font-medium outline-none mx-3 
              placeholder:text-[0.8em] placeholder:text-gray-400 
              transition-shadow duration-400 ease-in-out">
        </div>
        <button type="submit"
          class="flex w-[45%] h-[43%] font-glitch items-center justify-center ml-[110px] leading-[35px] bg-[#35C6DDB5] text-white text-[1.2em] tracking-[2px] py-[7px] rounded-[50px] cursor-pointer mt-2 hover:text-black hover:bg-cyan-800 hover:transition hover:duration-300">
          Send
        </button>
        <div class="text-white mt-[33px] text-center text-[1.0em] font-roboto font-semibold">
                    <p>Already a member? <a href="#" class="text-[#35C6DD] text-[0.9em] items-end font-bold border-b  hover:text-cyan-800 hover:border-cyan-800 border-[#35C6DDE5]">Login</a> </p>

                </div>
      </form>

    </div>
    <img src="/images/white_boy22.svg" class="w-[420px] h-[702px] mr-[1570px] drop-shadow-[0_0_20px_rgba(255,255,255,255.7)]">
  </div>
  `;
}

