const ts_x10 = (f: Function) => { f();f();f();f();f();f();f();f();f();f(); };

const ts_main: Function = (): void => {
    const print: Function = (): void => console.log("Hello, World!");

    ts_x10(() =>
      ts_x10(() =>
        ts_x10(() =>
          ts_x10(() =>
            ts_x10(() =>
              ts_x10(print)
            )
          )
        )
      )
    );
};

ts_main();
