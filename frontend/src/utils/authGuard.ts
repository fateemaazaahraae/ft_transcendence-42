import { navigate } from "../main";
import { showAlert } from "./alert";

export function requiredAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
        showAlert("You are not Authorized! Log in first");
        setTimeout(() => {
            navigate("/login")
        }, 200);
        return false;
    }
    return true;
}