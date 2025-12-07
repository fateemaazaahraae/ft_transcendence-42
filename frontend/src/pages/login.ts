import { navigate } from "../main.ts";
import { showAlert } from "../utils/alert.ts";

export default function Login() {
  return `<div class="min-h-screen w-full flex items-center justify-center relative pt-[7%] md:pt-[2%]">

    <div class="relative inset-0 items-center h-[690px] md:h-full w-full md:w-[820px] pt-[60px] mr-30 pb-[60px] px-[20px] md:px-[150px] rounded-[50px] overflow-hidden">

        <div class="absolute rounded-full blur-[55px] opacity-80  w-[170px] h-[240px] md:w-[400px] md:h-[250px] bg-[#35C6DDE5] left-[calc(50%-175px)] md:left-[calc(50%-320px)]  top-[15%] md:top-[19%] -rotate-[20deg] md:rotate-[63deg]"></div>
        <div class="absolute rounded-full blur-[55px] opacity-100 w-[130px] h-[260px] md:w-[400px] md:h-[250px] bg-[#D02EA48A] right-[calc(50%-146px)] md:left-[calc(50%-60px)] md:bottom-[60%] top-[50%] md:top-[53%] -rotate-[35deg] md:rotate-[45deg]"></div>

        <div class="relative inset-0 m-auto w-[320px] md:w-[480px] lg:w-[480px] h-[500px] md:h-full px-2 sm:px-6 py-6 sm:py-10 pt-[40px] pb-[60px] items-center bg-black rounded-[40px] md:rounded-[50px] backdrop-blur-[10px] mt-[50px]">
          <form id="loginForm" action="">
            <h2
                class="text-white text-center font-glitch text-[1.1em] md:text-[1.5em] leading-[10px] md:leading-[35px] tracking-[2px] mt-[5px] mb-[25px]">
              Step Into Your World ..
            </h2>
            <div class="input-box">
              <input id="userName"
                type="text" 
                required 
                placeholder="User name" 
                class="block mx-auto w-[85%] h-[40px] md:h-[52px] px-5 items-center bg-black font-roboto text-white border-none rounded-[20px]
                  shadow-[0_0_10px_rgba(53,198,221,0.9)] 
                  focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] 
                  text-[1.1em] md:text-[1.5em] font-medium outline-none
                  placeholder:text-[0.7em] placeholder:text-gray-400 
                  transition-shadow duration-400 ease-in-out">
            </div>

            <div class="input-box mt-4">
              <input id="password"
                type="password" 
                required 
                placeholder="Password" 
                class="block mx-auto w-[85%] h-[40px] md:h-[52px] px-5 items-center bg-black font-roboto text-white border-none rounded-[20px]
                  shadow-[0_0_10px_rgba(53,198,221,0.9)] 
                  focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] 
                  text-[1.1em] md:text-[1.5em] font-medium outline-none
                  placeholder:text-[0.7em] placeholder:text-gray-400 
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
              <a href="" id="pw" class="text-primary/60 text-[0.67em] md:text-[0.8em] font-semibold border-b   hover:text-primary hover:border-primary border-primary/60">
                Forget password?
              </a>
            </div>
            <button type="submit" id="submit"
              class="flex w-[40%] h-[30px] md:h-[43px] font-glitch items-center justify-center mx-auto leading-[35px] bg-primary/60 text-white text-[1.0em] tracking-[2px] px-[20px] py-[7px] rounded-[50px] cursor-pointer mt-4 md:mt-2 hover:text-black hover:bg-primary hover:transition hover:duration-300">
              Login
            </button>
            <div class="flex items-center mt-[35px] mb-[20px] md:my-[30px]">
            <div class="flex-1 border-b-[1px] md:border-b-2 ml-[15px] border-[#35C6DDE5] opacity-70"></div>
            <span class="px-3 text-[#35C6DDE5] font-roboto text-[0.7em] md:text-[1.0em] font-semibold">
              Or you can join with
            </span>
            <div class="flex-1 border-b-[1px] md:border-b-2 mr-[15px] border-[#35C6DDE5] opacity-70"></div>
          </div>

            <div class="social-icons flex text-white text-[1.5em] md:text-[2.1em] gap-[15px] justify-center cursor-pointer mb-[20px] md:mt-2">
                <a href="http://localhost:3000/auth/google">
                <i class="fa-brands fa-google"></i>
            </a>
            <a href="http://localhost:3000/auth/42">
              <img src="/intra42.png" class="mt-[15%] w-[45px]" />
            </a>
            </div>
            <div class="text-white mt-3 md:mt-9 text-center text-[0.8em] md:text-[0.9em] font-roboto font-semibold">
                <p class="mb-[5px]">Don’t have an account? Click here to </p>
                <a href="" id="register-link" class="text-primary/60 text-[0.8em] md:text-[0.9em] items-end font-bold border-b  hover:text-primary hover:border-primary border-primary/60">Register Now</a>
            </div>
          </form>
        </div>
        </div>
      <img src="/white_boy22.svg" class="hidden  lg:flex md:items-center md:justify-center mr-40 mt-[60px] md:w-1/2 max-w-[420px] w-full h-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]">
  </div>
  `;
}

export function LoginEventListener() {
  const password = document.getElementById("pw");
  password?.addEventListener("click", () => {
    navigate("/resetpw");
  });
  const register = document.getElementById("register-link");
  register?.addEventListener("click", (e) => {
    e.preventDefault(); 
    navigate("/register");
  });
  const form = document.getElementById("loginForm") as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userName = (document.getElementById("userName") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({userName, password})
      });
      const data = await res.json();
      if (!res.ok) {
        showAlert(data.error || "login failed");
        return;
      }

      // ✅ Store JWT in localStorage
      localStorage.setItem("token", data.token);
      
      if (data.isTwoFactorEnabled === 1) {
        localStorage.setItem("userId", data.userId);
        await showAlert("Check your email - Verification code sent", "success");
        navigate("/TwoFactor");
      } else {
        // await showAlert("Login successful", "success");
        if (!localStorage.getItem("userId"))
          localStorage.setItem("userId", data.user.id);
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
      showAlert("Network or server error.");
    }
  });
}
