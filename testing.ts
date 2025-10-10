export default function Login() {
  return `
    <div class="flex items-center justify-center min-h-screen w-full bg-gray-900 relative overflow-hidden">
  <!-- Background blur elements -->
  <div class="absolute w-80 h-80 bg-purple-500 rounded-full blur-[100px] opacity-60 -bottom-20 -left-20"></div>
  <div class="absolute w-80 h-80 bg-cyan-500 rounded-full blur-[100px] opacity-60 -top-20 -right-20"></div>
  
  <!-- Main content container -->
  <div class="flex items-center justify-center gap-8 z-10">
    <!-- Left side image -->
    <div class="w-96 h-96 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
      <div class="text-white text-center">
        <div class="w-24 h-24 bg-white rounded-full mx-auto mb-4 opacity-80"></div>
        <p class="text-xl font-bold">Welcome Back</p>
      </div>
    </div>

    <!-- Login Form -->
    <div class="relative">
      <!-- The blur element UNDER the form -->
      <div class="absolute -z-10 w-96 h-96 bg-pink-500 rounded-full blur-[80px] opacity-70 -bottom-32 -right-10"></div>
      
      <!-- Form container -->
      <div class="bg-black/80 backdrop-blur-md rounded-3xl p-8 w-96 border border-white/10 shadow-2xl">
        <h2 class="text-white text-center text-2xl font-bold mb-8 tracking-wider">
          Step Into Your World...
        </h2>
        
        <form class="space-y-6">
          <!-- Username -->
          <div>
            <input 
              type="text" 
              placeholder="User name"
              class="w-full px-4 py-3 bg-black/50 border border-cyan-500/50 rounded-2xl text-white placeholder-gray-400
                     focus:outline-none focus:border-cyan-300 focus:shadow-[0_0_15px_rgba(53,198,221,0.6)]
                     transition-all duration-300"
            >
          </div>

          <!-- Password -->
          <div>
            <input 
              type="password" 
              placeholder="Password"
              class="w-full px-4 py-3 bg-black/50 border border-cyan-500/50 rounded-2xl text-white placeholder-gray-400
                     focus:outline-none focus:border-cyan-300 focus:shadow-[0_0_15px_rgba(53,198,221,0.6)]
                     transition-all duration-300"
            >
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex justify-between items-center">
            <label class="flex items-center space-x-2 text-white/80 text-sm cursor-pointer">
              <input type="checkbox" class="w-4 h-4 rounded border-cyan-500 bg-black/50">
              <span>Remember Me</span>
            </label>
            <a href="#" class="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
              Forgot password?
            </a>
          </div>

          <!-- Login Button -->
          <button 
            type="submit"
            class="w-full bg-gradient-to-r from-cyan-600 to-purple-600 text-white py-3 rounded-2xl font-semibold
                   hover:from-cyan-500 hover:to-purple-500 transition-all duration-300 shadow-lg
                   hover:shadow-cyan-500/25"
          >
            Login
          </button>

          <!-- Divider -->
          <div class="flex items-center my-6">
            <div class="flex-1 border-t border-white/20"></div>
            <span class="px-4 text-white/60 text-sm">Or you can join with</span>
            <div class="flex-1 border-t border-white/20"></div>
          </div>

          <!-- Social Icons -->
          <div class="flex justify-center space-x-6 text-2xl">
            <button class="text-white hover:text-cyan-400 transition-colors p-2 rounded-full hover:bg-white/10">
              <ion-icon name="logo-google"></ion-icon>
            </button>
            <button class="text-white hover:text-cyan-400 transition-colors p-2 rounded-full hover:bg-white/10">
              <ion-icon name="logo-github"></ion-icon>
            </button>
          </div>

          <!-- Register Link -->
          <div class="text-center text-white/70 text-sm mt-6">
            Don't have an account? 
            <a href="#" class="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
              Click here to Register Now
            </a>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
  `;
}

