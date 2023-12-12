document.getElementById("updateform").addEventListener("submit", async (event) => {
    event.preventDefault();
  
    const formData = new FormData(event.target);
    const dataObject = Object.fromEntries(formData.entries());
    const jsonData = JSON.stringify(dataObject);

    try {
      const response = await fetch("/update", {
        method: "POST",
        body: jsonData,
        headers: {
            "Content-Type": "application/json"
        }
      });
  
      const data = await response.json();
  
      if (data.error) {
        alert(data.error);
      } else {
        // Handle success, maybe redirect or update the UI
        window.location.href = "/profile";
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("An unexpected error occurred.");
    }
});