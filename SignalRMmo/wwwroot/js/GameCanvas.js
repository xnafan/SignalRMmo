class GameCanvas {

    #keyboardStatus = { up: false, down: false, left: false, right: false };
    #ctx;
    #canvas;
    constructor(canvas) {
        this.#canvas = canvas;
        this.#ctx = canvas.getContext("2d");
        canvas.focus();
        canvas.addEventListener("keydown", (event) => this.#keyDown(event));
        canvas.addEventListener("keyup", (event) => this.#keyUp(event));
        canvas.addEventListener("blur", (event) => this.#allKeysUp(event));
    }

    #allKeysUp() {
        this.#keyboardStatus.down = false;
        this.#keyboardStatus.up = false;
        this.#keyboardStatus.left = false;
        this.#keyboardStatus.right = false;
    }
    #keyDown(event) {
        switch (event.code) {
            case 'ArrowLeft': this.#keyboardStatus.left = true; break;
            case 'ArrowRight': this.#keyboardStatus.right = true; break;
            case 'ArrowUp': this.#keyboardStatus.up = true; break;
            case 'ArrowDown': this.#keyboardStatus.down = true; break;
        }
    }

    #keyUp(event) {
    switch (event.code) {
        case 'ArrowLeft': this.#keyboardStatus.left = false; break;
        case 'ArrowRight': this.#keyboardStatus.right = false; break;
        case 'ArrowUp': this.#keyboardStatus.up = false; break;
        case 'ArrowDown': this.#keyboardStatus.down = false; break;
    }
}

    get keyboardState() { return this.#keyboardStatus; }

    get context() { return this.#ctx; }
    get width() { return this.#canvas.width; }
    get height() { return this.#canvas.height; }

    getMovement() {
        var deltaX = 0;
        deltaX += this.#keyboardStatus.left ? -1 : 0;
        deltaX += this.#keyboardStatus.right ? 1 : 0;
        var deltaY = 0;
        deltaY += this.#keyboardStatus.up ? -1 : 0;
        deltaY += this.#keyboardStatus.down ? 1 : 0;
        return { x: deltaX, y: deltaY };
    }
}