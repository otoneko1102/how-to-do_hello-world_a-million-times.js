let counter = 0;
let intervalId;

function hello() {
    console.log("Hello, World!");
    counter++;

    if (counter >= 1000000) {
        clearInterval(intervalId);
    }
}

intervalId = setInterval(hello);
