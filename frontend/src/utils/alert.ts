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
    <div class="fixed inset-0 flex items-start justify-end mt-10 mr-10">
        <div class="animate-fade-in-down bg ${
            type === "error" ? "bg-redRemove/50" : "bg-greenAdd/50"
        } text-white rounded-xl px-12 py-4 text-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <p class="font-normal text-[17px] font-roboto"><span class="font-roboto font-bold text-[20px] mb-2 ">${type === "error" ? "Error" : "Success"}: </span>
                ${message}
            </p>
        </div>
    </div>
    `;
    document.body.appendChild(alert)

    //close it
    // document.getElementById("close-alert")?.addEventListener("click", () => {
    //     alert.remove();
    // });

    //auto remove after 3s
    setTimeout(() => alert.remove(), 3000);
}