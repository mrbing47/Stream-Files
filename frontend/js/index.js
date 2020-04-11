const username = document.getElementById("username");
const roomname = document.getElementById("roomname");

const btnJoin = document.getElementById("join-btn");
const btnCreate = document.getElementById("create-btn");

const snackbar = document.getElementById("snackbar");
const snacktext = document.getElementById("snacktext");

let snackbarInterval = 0;

function showSnackState(msg) {
	msg = msg || "Enter all details.";

	if (snackbarInterval == 0) {
		snacktext.innerText = msg;

		snackbar.style.bottom = "5%";
		snackbar.style.visibility = "visible";
		snackbar.style.opacity = "1";

		snackbarInterval = setTimeout(() => {
			snackbar.style.bottom = "-40px";
			snackbar.style.visibility = "hidden";
			snackbar.style.opacity = "0";
			snackbarInterval = 0;
		}, 2000);
	}
}

btnJoin.addEventListener("click", (e) => {
	e.preventDefault();
	console.log("here");
	if (roomname.value === "" || username.value === "") {
		showSnackState();
		return;
	}
	if (roomname.value.length > 18) {
		showSnackState("Max. 18 characters in Room name.");
		return;
	}

	fetch("/login", {
		method: "post",
		body: JSON.stringify({
			roomid: roomname.value,
		}),
		redirect: "follow",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
			if (data.err) {
				showSnackState(data.err);
			} else {
				setCookie("usertype", "member");
				setCookie("username", username.value);

				window.location.href = new URL(data.src, window.location.origin).href;
			}
		})
		.catch((err) => console.log(err));
});
