const x10 = (f) => { f();f();f();f();f();f();f();f();f();f(); };

const main = () => {
    const print = () => console.log("Hello, World!");

    x10(() =>
      x10(() =>
        x10(() =>
          x10(() =>
            x10(() =>
              x10(print)
            )
          )
        )
      )
    );
};

main();
