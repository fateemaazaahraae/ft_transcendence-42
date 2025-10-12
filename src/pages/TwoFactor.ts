export default function TwoFactor() {
  return `
    <div class="flex items-center justify-center gap-[170px] relative min-h-screen w-full">
    
    <div class="absolute  w-[400px] h-[250px] bg-cyan-300 rounded-full blur-[60px] opacity-90 rotate-[45deg] top-[230px] left-[340px]"></div>
    <div class="absolute  w-[400px] h-[250px] bg-[rgb(208,46,164)] rounded-full blur-[80px] opacity-90 rotate-[45deg]  top-[550px] left-[560px]"></div>
    <div class="relative h-[300px] w-[500px] pt-[40px] pb-[60px] items-center px-[50px] bg-black rounded-[50px] backdrop-blur-[10px] ml-[1580px] ">
      <form action="">
        <h2
            class="text-white text-center font-glitch text-[1.4em] leading-[35px] tracking-[1px] mt-[5px] mb-[20px]">
          Two-factor authentication
        </h2>
        <div class="input-box mb-[35px] mt-[30px]">
          <input type="text" inputmode="numeric" pattern="[0-9]*"inputmode="numeric"  maxlength="6"
            required 
            placeholder="Enter 6-digits" 
            class="flex w-[330px] h-[52px] px-[20px] py-[15px] items-center justify-center bg-black font-roboto text-white border-none rounded-[20px]
              shadow-[0_0_10px_rgba(53,198,221,0.9)] 
              focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] 
              text-[1.1em] font-medium outline-none mx-3 
              placeholder:text-[0.8em] placeholder:text-gray-400 
              transition-shadow duration-400 ease-in-out">
        </div>
        <button type="submit"
          class="flex w-[45%] h-[43px] font-glitch items-center justify-center ml-[110px] leading-[35px] bg-[#35C6DDB5] text-white text-[1.2em] tracking-[2px] px-[20px] py-[7px] rounded-[50px] cursor-pointer mt-2 hover:text-black hover:bg-cyan-800 hover:transition hover:duration-300">
          Verify
        </button>
      </form>

    </div>
    <img src="/images/white_boy22.svg" class="w-[420px] h-[702px] mr-[1570px] drop-shadow-[0_0_20px_rgba(255,255,255,255.7)]">
  </div>
  `;
}

