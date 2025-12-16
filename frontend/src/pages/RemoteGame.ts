// frontend/src/pages/RemoteGame.ts
import { getGameSocket } from "../utils/gameSocket.ts";
import { navigate } from "../main.ts";

export default function RemoteGame() {
  return `
    <div class="w-full h-screen flex flex-col justify-center items-center bg-black text-white">
      <h1 class="text-3xl mb-4 font-glitch">REMOTE MATCH</h1>
      
      <div class="relative border-4 border-[#35C6DD] shadow-[0_0_20px_#35C6DD]">
        <canvas id="gameCanvas" width="800" height="600" class="bg-gray-900"></canvas>
      </div>

      <button id="leave-btn" class="mt-8 px-6 py-2 bg-red-600 rounded hover:bg-red-700 transition">
        Leave Game
      </button>
    </div>
  `;
}

export function RemoteGameEventListener() {
  const socket = getGameSocket(localStorage.getItem("token"));
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  const ctx = canvas?.getContext("2d");


}