import { navigate } from "../main.ts";

export default function Register() {
  return `
  <div class="min-h-screen flex items-center justify-center p-6 bg-transparent">
    <!-- center row that holds image + form -->
    <div class="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-[1400px]">

      <!-- Illustration: responsive, will shrink instead of jumping -->
      <div class="flex-shrink-0 w-full md:w-1/2 flex justify-center">
        <img
          src="/images/blue-boy33.svg"
          alt="Blue Boy"
          class="max-w-[48vw] w-[420px] sm:w-[360px] md:w-[480px] h-auto object-contain drop-shadow-[0_0_17px_rgba(0,160,255,0.35)]"
        />
      </div>

      <!-- Form card container: relative so blobs are positioned relative to this block -->
      <div class="relative w-full md:w-1/2 max-w-[820px] p-6 md:p-10 rounded-3xl overflow-hidden">
        <!-- decorative blobs positioned relative to this card (z-0 => behind) -->
        <div class="absolute z-0 rounded-full blur-[55px] opacity-70 w-[180px] h-[260px] bg-[#35C6DD] -left-16 top-10 transform -rotate-12 pointer-events-none"></div>
        <div class="absolute z-0 rounded-full blur-[55px] opacity-80 w-[220px] h-[360px] bg-[#D02EA4] right-8 bottom-8 -rotate-36 pointer-events-none"></div>

        <!-- inner black card (z-10 => above the glows) -->
        <div class="relative z-10 mx-auto w-full max-w-[560px] bg-black/95 rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          <form id="register-form" action="" class="space-y-4">
            <h2 class="text-center text-white text-[1.5rem] tracking-wider font-extralight">Register Now !</h2>

            <!-- name row -->
            <div class="flex gap-3">
              <input type="text" name="firstName" required placeholder="First name"
                class="flex-1 h-12 px-4 rounded-lg bg-black text-white outline-none shadow-[0_0_10px_rgba(53,198,221,0.9)] placeholder:text-gray-400" />
              <input type="text" name="lastName" required placeholder="Last name"
                class="flex-1 h-12 px-4 rounded-lg bg-black text-white outline-none shadow-[0_0_10px_rgba(53,198,221,0.9)] placeholder:text-gray-400" />
            </div>

            <!-- username -->
            <div>
              <input type="text" name="username" required placeholder="User name"
                class="w-full h-12 px-4 rounded-lg bg-black text-white outline-none shadow-[0_0_10px_rgba(53,198,221,0.9)] placeholder:text-gray-400" />
            </div>

            <!-- email -->
            <div>
              <input type="email" name="email" required placeholder="Email"
                class="w-full h-12 px-4 rounded-lg bg-black text-white outline-none shadow-[0_0_10px_rgba(53,198,221,0.9)] placeholder:text-gray-400" />
            </div>

            <!-- password row -->
            <div class="flex gap-3">
              <input type="password" name="password" required placeholder="Password"
                class="flex-1 h-12 px-4 rounded-lg bg-black text-white outline-none shadow-[0_0_10px_rgba(53,198,221,0.9)] placeholder:text-gray-400" />
              <input type="password" name="confirmPassword" required placeholder="Confirm Password"
                class="flex-1 h-12 px-4 rounded-lg bg-black text-white outline-none shadow-[0_0_10px_rgba(53,198,221,0.9)] placeholder:text-gray-400" />
            </div>

            <div class="flex justify-center">
              <button id="submit" type="submit"
                class="w-1/2 h-12 rounded-full bg-[#35C6DD] text-black font-semibold hover:bg-cyan-800 hover:text-white transition">
                Submit
              </button>
            </div>

            <div class="flex items-center gap-3 text-[#35C6DD] mt-4">
              <div class="flex-1 border-b border-[#35C6DDE5] opacity-70"></div>
              <div class="text-center text-sm font-semibold">Or you can join with</div>
              <div class="flex-1 border-b border-[#35C6DDE5] opacity-70"></div>
            </div>

            <div class="flex justify-center gap-6 text-white text-xl mt-2">
              <i class="fa-brands fa-google" aria-hidden="true"></i>
              <i class="fa-brands fa-github" aria-hidden="true"></i>
            </div>

            <p class="text-center text-white mt-4">
              Already a member?
              <a href="" id="login-link" class="text-[#35C6DD] font-bold underline">Login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
  `;
}


export function RegisterEventListener(){
    const login= document.getElementById("login-link");
    login?.addEventListener("click", () =>{navigate("/login");
    }); 
    const submit= document.getElementById("submit");
    submit?.addEventListener("click", () =>{navigate("/ChoseAvatar");
    }); 
}



























// Other version of the code (retry two...)




import { navigate } from "../main.ts";

export default function Register() {
  return `
  <div class="min-h-screen flex items-center justify-center p-6 bg-transparent">
    <!-- center row that holds image + form -->
    <div class="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-[1400px]">

      <!-- Illustration: responsive, will shrink instead of jumping -->
      <div class="flex-shrink-0 w-full md:w-1/2 flex justify-center">
        <img
          src="/images/blue-boy33.svg"
          alt="Blue Boy"
          class="max-w-[48vw] w-[420px] sm:w-[360px] md:w-[480px] h-auto object-contain drop-shadow-[0_0_17px_rgba(0,160,255,0.35)]"
        />
      </div>

      <!-- Form card container: relative so blobs are positioned relative to this block -->
      <div class="relative w-full md:w-1/2 max-w-[820px] p-6 md:p-10 rounded-3xl overflow-hidden">
        <!-- decorative blobs positioned relative to this card (z-0 => behind) -->
        <div class="absolute z-0 rounded-full blur-[55px] opacity-70 w-[130px] h-[160px] bg-[#35C6DD] left-15 top-26 transform -rotate-12 pointer-events-none"></div>
        <div class="absolute z-0 rounded-full blur-[55px] opacity-80 w-[160px] h-[300px] bg-[#D02EA4] right-20 bottom-6 -rotate-45 pointer-events-none"></div>

        <!-- inner black card (z-10 => above the glows) -->
        <div class="relative z-10 mx-auto w-full max-w-[360px] bg-black/95 rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          <form id="register-form" action="" class="space-y-4">
            <h2 class="text-center text-white text-[1.5rem] tracking-wider font-extralight">Register Now !</h2>

            <!-- name row -->
            <div class="flex gap-3">
              <input type="text" name="firstName" required placeholder="First name"
                class="flex-1 h-12 px-4 rounded-lg bg-black text-white outline-none shadow-[0_0_10px_rgba(53,198,221,0.9)] placeholder:text-gray-400" />
              <input type="text" name="lastName" required placeholder="Last name"
                class="flex-1 h-12 px-4 rounded-lg bg-black text-white outline-none shadow-[0_0_10px_rgba(53,198,221,0.9)] placeholder:text-gray-400" />
            </div>

            <!-- username -->
            <div>
              <input type="text" name="username" required placeholder="User name"
                class="w-full h-12 px-4 rounded-lg bg-black text-white outline-none shadow-[0_0_10px_rgba(53,198,221,0.9)] placeholder:text-gray-400" />
            </div>

            <!-- email -->
            <div>
              <input type="email" name="email" required placeholder="Email"
                class="w-full h-12 px-4 rounded-lg bg-black text-white outline-none shadow-[0_0_10px_rgba(53,198,221,0.9)] placeholder:text-gray-400" />
            </div>

            <!-- password row -->
            <div class="flex gap-3">
              <input type="password" name="password" required placeholder="Password"
                class="flex-1 h-12 px-4 rounded-lg bg-black text-white outline-none shadow-[0_0_10px_rgba(53,198,221,0.9)] placeholder:text-gray-400" />
              <input type="password" name="confirmPassword" required placeholder="Confirm Password"
                class="flex-1 h-12 px-4 rounded-lg bg-black text-white outline-none shadow-[0_0_10px_rgba(53,198,221,0.9)] placeholder:text-gray-400" />
            </div>

            <div class="flex justify-center">
              <button id="submit" type="submit"
                class="w-1/2 h-12 rounded-full bg-[#35C6DD] text-black font-semibold hover:bg-cyan-800 hover:text-white transition">
                Submit
              </button>
            </div>

            <div class="flex items-center gap-3 text-[#35C6DD] mt-4">
              <div class="flex-1 border-b border-[#35C6DDE5] opacity-70"></div>
              <div class="text-center text-sm font-semibold">Or you can join with</div>
              <div class="flex-1 border-b border-[#35C6DDE5] opacity-70"></div>
            </div>

            <div class="flex justify-center gap-6 text-white text-xl mt-2">
              <i class="fa-brands fa-google" aria-hidden="true"></i>
              <i class="fa-brands fa-github" aria-hidden="true"></i>
            </div>

            <p class="text-center text-white mt-4">
              Already a member?
              <a href="" id="login-link" class="text-[#35C6DD] font-bold underline">Login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
  `;
}


export function RegisterEventListener(){
    const login= document.getElementById("login-link");
    login?.addEventListener("click", () =>{navigate("/login");
    }); 
    const submit= document.getElementById("submit");
    submit?.addEventListener("click", () =>{navigate("/ChoseAvatar");
    }); 
}

// <div class="absolute z-0 rounded-full blur-[55px] opacity-100 w-[300px] h-[500px] bg-[#D02EA48A] right-[calc(50%-798px)] bottom-[20%] top-[43%] -rotate-[20deg]"></div>
// <div class="absolute z-0 rounded-full blur-[55px] opacity-100 w-[250px] h-[250px] bg-[#35C6DDE5] right-[calc(50%-410px)] top-[20%]"></div>
