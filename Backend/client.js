const io = require("socket.io-client");

const socket = io("http://localhost:3000");

socket.on("connect", () => {
    console.log("Connected as", socket.id);
    socket.emit("joinChat", { name: "Mechanic", room: "room1" });

    // Listen for messages
    socket.on("receiveMessage", (message) => {
        console.log("New Message:", message.user, "->", message.text);
    });

    // Send a test message after joining
    setTimeout(() => {
        socket.emit("sendMessage", { user: "Mechanic", text: "Hey User!", room: "room1" });
    }, 2000);
});

socket.on("disconnect", () => {
    console.log("Disconnected");
});
