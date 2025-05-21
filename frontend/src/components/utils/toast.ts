export function showToast(message: string, type: "success" | "error" = "success") {
  const toast = document.createElement("div");
  toast.className = `custom-toast ${type}`;
  toast.innerText = message;

  Object.assign(toast.style, {
    position: "fixed",
    top: "30%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: type === "success" ? "#2ecc71" : "#e74c3c",
    color: "white",
    padding: "10px 20px",
    borderRadius: "6px",
    zIndex: "9999",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    fontSize: "1rem",
    opacity: "0.95",
  });

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
