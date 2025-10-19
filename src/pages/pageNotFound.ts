export default function PageNotFound() {
 return `
  <div class="flex flex-col fixed items-center  min-h-screen top-1/3 left-[20%] xl:left-[30%] lg:top-1/4 text-black text-center overflow-x-hidden overflow-y-auto">

    <!-- Glitch 404 text -->
    <h1 class="text-[80px] md:text-[120px] lg:text-[150px] font-glitch tracking-[8px] 
               drop-shadow-cyan
               before:content-['404'] before:absolute before:left-0 before:text-secondary 
               before:translate-x-[3px] before:top-0 before:animate-glitch 
               after:content-['404'] after:absolute after:left-0 after:text-black
               after:-translate-x-[3px] after:top-0 after:animate-glitch-slow">
      404
    </h1>

    <!-- Subtitle -->
    <p class="text-3xl md:text-6xl lg:text-8xl mt-4 text-black drop-shadow-pink font-glitch z-10">Page Not Found</p>
</div>
   
`;

}