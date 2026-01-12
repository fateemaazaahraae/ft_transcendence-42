import { navigate } from "../main.ts";
import { showAlert } from "../utils/alert.ts";

export default function Register() {
  return `<div class="min-h-screen w-full flex items-center justify-center relative pt-[7%] md:pt-[2%]">

    <img src="blue-boy33.svg" alt="Blue Boy" class="hidden lg:flex md:items-center md:justify-center w-[500px] h-auto drop-shadow-[0_0_17px_rgba(0,160,255,255.7)]">
    <div class="relative inset-0 items-center h-full w-full md:w-[820px] mt-[50px] md:mt-0 md:pt-[60px] mr-30 pb-[60px] md:px-[150px] overflow-hidden">

      <div class="absolute rounded-full blur-[55px] opacity-80  w-[170px] h-[240px] md:w-[400px] md:h-[250px] bg-[#35C6DDE5] left-[calc(50%-220px)] md:left-[calc(50%-320px)] top-[10%] md:top-[19%] -rotate-[20deg] md:rotate-[63deg]"></div>
      <div class="absolute rounded-full blur-[55px] opacity-100 w-[130px] h-[260px] md:w-[400px] md:h-[250px] bg-[#D02EA48A] right-[calc(50%-220px)] md:left-[calc(50%-10px)] md:bottom-[60%] top-[6]0%] md:top-[53%] -rotate-[35deg] md:rotate-[45deg]"></div>
    
    <div class="relative inset-0 m-auto w-[80%] md:w-[480px] lg:w-[480px] h-full md:h-full px-0 sm:px-6 py-6 sm:py-10 pt-[40px] md:pb-[60px] items-center bg-black rounded-[40px] md:rounded-[50px] backdrop-blur-[10px] mt-[50px]">
    <form id="registerForm" action="">
        <h2
        class="text-white text-center font-glitch text-[1.1em] md:text-[1.5em] leading-[10px] md:leading-[35px] tracking-[2px] mt-[5px] mb-[25px]">
        Register Now !
        </h2>
        <div class="flex flex-col md:flex-row gap-[15px] pb-0 md:pb-[3px] pr-[5px] pl-0 w-[80%] md:w-full mx-auto bg-none rounded-[20px] mb-5">
            <div class="flex flex-col h-[50px]">
              <input id="firstName" type="text" required placeholder="First name" class="w-full h-[40px] md:h-[48px] px-[20px] py-[15px] bg-black font-roboto text-white border-none shadow-[0_0_10px_rgba(53,198,221,0.9)] focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] text-[0.9em] font-medium outline-none placeholder:text-gray-400 transition-shadow duration-400 ease-in-out rounded-[15px] placeholder:text-[0.9em] ">
              <div id="fnameErr" class="text-redRemove text-[10px] mt-2"></div>
            </div>
            <div class="flex flex-col h-[50px]">
              <input id="lastName" type="text" required placeholder="Last name" class="w-full h-[40px] md:h-[48px] px-[20px] py-[15px] bg-black font-roboto text-white border-none shadow-[0_0_10px_rgba(53,198,221,0.9)] focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] text-[0.9em] font-medium outline-none placeholder:text-gray-400 transition-shadow duration-400 ease-in-out rounded-[15px] placeholder:text-[0.9em] ">
              <div id="lnameErr" class="text-redRemove text-[10px] mt-2"></div>
            </div>
        </div>

        <div class="flex flex-col gap-[10px] pb-0 md:pb-[3px] pr-[5px] pl-0 w-[80%] md:w-full mx-auto bg-none rounded-[20px] mb-5">
            <div class="h-[50px]">
              <input id="userName" type="text" required placeholder="User name" class="w-full h-[40px] md:h-[48px] px-[20px] py-[15px] bg-black font-roboto text-white border-none shadow-[0_0_10px_rgba(53,198,221,0.9)] focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] text-[0.9em] font-medium outline-none placeholder:text-gray-400 transition-shadow duration-400 ease-in-out rounded-[15px] placeholder:text-[0.9em] ">
              <div id="unameErr" class="text-redRemove text-[10px] mt-2"></div>
            </div>
        </div>

        <div class="flex flex-col gap-[10px] pb-0 md:pb-[3px] pr-[5px] pl-0 w-[80%] md:w-full mx-auto bg-none rounded-[20px] mb-5">
            <div class="h-[50px]">
              <input id="email" type="email" required placeholder="Email" class="w-full h-[40px] md:h-[48px] px-[20px] py-[15px] bg-black  font-roboto text-white border-none shadow-[0_0_10px_rgba(53,198,221,0.9)] focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] text-[0.9em] font-medium outline-none placeholder:text-gray-400 transition-shadow duration-400 ease-in-out rounded-[15px] placeholder:text-[0.9em] ">
              <div id="emailErr" class="text-redRemove text-[10px] mt-2"></div>
            </div>        
        </div>

        <div class="flex flex-col md:flex-row gap-[15px] pb-0 md:pb-[3px] pr-[5px] pl-0 w-[80%] md:w-full mx-auto bg-none rounded-[20px] mb-12 md:mb-5">
          <div class="flex flex-col h-[50px] w-full">
            <input id="password" type="password" required placeholder="Password" class="w-full h-[40px] md:h-[48px] px-[20px] py-[15px] bg-black font-roboto text-white border-none shadow-[0_0_10px_rgba(53,198,221,0.9)] focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] text-[0.9em] font-medium outline-none placeholder:text-gray-400 transition-shadow duration-400 ease-in-out rounded-[15px] placeholder:text-[0.8em] ">
            <div id="passwordErr" class="text-redRemove text-[10px] mt-2"></div>
          </div>
          <div class="w-full">
            <input id="confirmPassword" type="password" required placeholder="Confirm Password" class="w-full h-[40px] md:h-[48px] px-[20px] py-[15px] bg-black font-roboto text-white border-none shadow-[0_0_10px_rgba(53,198,221,0.9)] focus:shadow-[0_0_10px_rgba(255,255,255,0.9)] text-[0.9em] font-medium outline-none placeholder:text-gray-400 transition-shadow duration-400 ease-in-out rounded-[15px] placeholder:text-[0.8em] ">
            <div class="mt-1"></div>
          </div>
        </div>
        <button type="submit" id="submit"
            class="flex w-[40%] h-[35px] md:h-[46px] font-glitch justify-center items-center mx-auto leading-[35px] bg-primary/60 text-white text-[1.2em] tracking-[2px] px-[15px] py-[20px] rounded-[50px] cursor-pointer mt-5 md:mt-[10%] hover:text-black hover:bg-primary hover:transition hover:duration-300">
            Submit
        </button>
        <div class="flex items-center my-[15px] md:my-[30px] mt-6">
            <div class="flex-1 border-b-2 border-[#35C6DDE5] opacity-70 ml-8"></div>
            <span class="px-3 text-[#35C6DDE5] font-roboto text-[0.7em] md:text-[1.0em] font-semibold">
            Or you can join with
            </span>
            <div class="flex-1 border-b-2 border-[#35C6DDE5] opacity-70 mr-8"></div>
        </div>
        <div class="social-icons flex text-white text-[1.5em] md:text-[2.1em] gap-[15px] justify-center cursor-pointer mb-[20px] md:mt-2">
          <a href="http://localhost:3000/auth/google">
            <i class="fa-brands fa-google"></i>
          </a>
          <a href="http://localhost:3000/auth/42">
            <img src="/intra42.png" class="mt-[15%] w-[35px] md:w-[50px]" />
          </a>
        </div>
        <div class="text-white mt-6 md:mt-5 text-center text-[0.8em] md:text-[0.9em] font-roboto font-semibold">
            <p>Already a member? 
            <a href="" id="login-link" class="text-primary/60 text-[0.8em] md:text-[1.0em] items-end font-bold border-b hover:text-primary hover:border-primary border-primary/60">Login</a>
             </p>

        </div>
    </form>
</div>
    </div>
</div>
`;
}


export function RegisterEventListener() {
  const login = document.getElementById("login-link");
  login?.addEventListener("click", (e) => {
    e.preventDefault();
    navigate("/login");
  });

  const form = document.getElementById("registerForm") as HTMLFormElement | null;
  if (!form) {
    console.error("Register form not found");
    return;
  }

  /*REGEX RULES */
  const nameRegex = /^[a-zA-Z]{3,30}$/;
  const userRegex = /^[a-zA-Z0-9_]{3,15}$/;
  const emailRegex = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&_])[A-Za-z\d@$!%*#?&_]{8,}$/;

  /*HELPERS*/
  function setError(id: string, message: string) {
    const el = document.getElementById(id);
    if (!el) return;

    el.innerHTML = message
      ? `<i class="fa-solid fa-triangle-exclamation mr-1"></i>${message}`
      : "";
  }


  function getValue(id: string): string {
    return (document.getElementById(id) as HTMLInputElement)?.value || "";
  }

  /*FIELD VALIDATORS */
  function validateFirstName(): boolean {
    const valid = nameRegex.test(getValue("firstName"));
    setError("fnameErr", valid ? "" : "First name must be 3–30 letters.");
    return valid;
  }

  function validateLastName(): boolean {
    const valid = nameRegex.test(getValue("lastName"));
    setError("lnameErr", valid ? "" : "Last name must be 3–30 letters.");
    return valid;
  }

  function validateUsername(): boolean {
    const valid = userRegex.test(getValue("userName"));
    setError(
      "unameErr",
      valid ? "" : "Username must be 3–15 characters (letters, numbers, underscores)."
    );
    return valid;
  }

  function validateEmail(): boolean {
    const valid = emailRegex.test(getValue("email"));
    setError("emailErr", valid ? "" : "Invalid email address.");
    return valid;
  }

  function validatePassword(): boolean {
    const valid = passwordRegex.test(getValue("password"));
    setError(
      "passwordErr",
      valid
        ? ""
        : "Password must be 8+ chars with letter, number & special character."
    );
    return valid;
  }

  function validateConfirmPassword(): boolean {
    const valid = getValue("password") === getValue("confirmPassword");
    setError("confirmPasswordErr", valid ? "" : "Passwords do not match.");
    return valid;
  }

  /*REAL-TIME LISTENERS*/
  document.getElementById("firstName")?.addEventListener("input", validateFirstName);
  document.getElementById("lastName")?.addEventListener("input", validateLastName);
  document.getElementById("userName")?.addEventListener("input", validateUsername);
  document.getElementById("email")?.addEventListener("input", validateEmail);
  document.getElementById("password")?.addEventListener("input", validatePassword);
  document
    .getElementById("confirmPassword")
    ?.addEventListener("input", validateConfirmPassword);

  /*SUBMIT HANDLER*/
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const isValid =
      validateFirstName() &&
      validateLastName() &&
      validateUsername() &&
      validateEmail() &&
      validatePassword() &&
      validateConfirmPassword();

    if (!isValid) return;

    const payload = {
      firstName: getValue("firstName"),
      lastName: getValue("lastName"),
      userName: getValue("userName"),
      email: getValue("email"),
      password: getValue("password"),
      confirmPassword: getValue("confirmPassword"),
    };

    try {
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        showAlert(data.error || "Registration failed");
        return;
      }

      // localStorage.setItem("token", data.token);
      console.log("hooonaaa ->>>> " + data.user.id);
      localStorage.setItem("userId", data.user.id);

      showAlert("Registration successful", "success");
      navigate("/ChoseAvatar");
    } catch (err) {
      console.error(err);
      showAlert("Network error. Please try again.");
    }
  });
}
