//
// Goal: Deploy the chat application
//
// 1. Setup Git and commit files
//    - Ignore node_modules folder
// 2. Setup a Github repository and push code up
// 3. Setup a Heroku app and push code up
// 4. Open the liver app and test your work

const socket = io();

// Elements

const $messageForm = document.querySelector(".message-form");
const $messageFormInput = document.querySelector("input");
const $messageFormButton = document.querySelector("button");
const $sendLocation = document.querySelector(".send-location");
const $messages = document.querySelector("#messages");
const $sidebar = document.querySelector("#sidebar");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;
// Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoscroll = () => {
  // New message element
  const $newMessage = $messages.lastElementChild;

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible Height
  const visibleHeight = $messages.offsetHeight;

  // Height of messages container
  const containerHeight = $messages.scrollHeight;

  // How far have I scrolled
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
  console.log(newMessageHeight);
};

socket.on("message", (message) => {
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });

  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("location-message", (locationMessage) => {
  const html = Mustache.render(locationTemplate, {
    username: locationMessage.username,
    url: locationMessage.url,
    createdAt: moment(locationMessage.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  $sidebar.innerHTML = html;
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // disable
  $messageFormButton.setAttribute("disabled", "disabled");
  socket.emit("sent-message", $messageFormInput.value, (error) => {
    // enable

    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
    if (error) {
      return console.log(error);
    }

    console.log("Message delivered");
  });
});

$sendLocation.addEventListener("click", () => {
  // disable
  $sendLocation.setAttribute("disabled", "disabled");
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const coordinates = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    socket.emit("send-location", coordinates, () => {
      // enable
      $sendLocation.removeAttribute("disabled");
      console.log("Location shared");
    });
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
