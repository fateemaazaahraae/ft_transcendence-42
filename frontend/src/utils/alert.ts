export function showAlert(message: string, type: "error" | "success" = "error") {
    //removing existing alert
    const existingAlert = document.getElementById("custom-alert");
    if (existingAlert)
        existingAlert.remove();
    //create alert container (div)
    const alert = document.createElement("div");
    alert.id = "custom alert";
    alert.innerHTML = 
    `
    <div class="fixed top-10 right-10 z-[100]">
        <div class="animate-fade-in-down bg ${
            type === "error" ? "bg-redRemove/50" : "bg-greenAdd/50"
        } text-white rounded-xl px-12 py-4 text-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <p class="font-normal text-[17px] font-roboto">
                ${message}
            </p>
        </div>
    </div>
    `;
    document.body.appendChild(alert)

    //auto remove after 3s
    setTimeout(() => alert.remove(), 2000);
}