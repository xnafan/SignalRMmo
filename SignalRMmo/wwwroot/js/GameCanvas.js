class GameCanvas {

    #keyboardStatus = { up: false, down: false, left: false, right: false };
    #ctx;
    #canvas;
    #mousePosition;
    #mouseButtonDown = false;

    constructor(canvas) {
        this.#canvas = canvas;
        this.#ctx = canvas.getContext("2d");
        canvas.focus();
        canvas.addEventListener("keydown", (event) => this.#keyDown(event));
        canvas.addEventListener("keyup", (event) => this.#keyUp(event));
        canvas.addEventListener("mousedown", (event) => this.#mouseDown(event));
        canvas.addEventListener("mousemove", (event) => this.#mouseMove(event));
        canvas.addEventListener("mouseup", (event) => this.#mouseUp(event));
        canvas.addEventListener("touchstart", (event) => this.#mouseDown(event));
        canvas.addEventListener("touchmove", (event) => this.#mouseMove(event));
        canvas.addEventListener("touchend", (event) => this.#mouseUp(event));

        canvas.addEventListener("mouseout", _ => this.#mouseOut(event));
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

    #mouseDown(event) {
        this.#updateMousePosition(event);
        this.#mouseButtonDown = true;
    }

    #mouseMove(event) {
        this.#mouseButtonDown = event.buttons & 1; 
        this.#updateMousePosition(event);
    }
    #mouseUp(event) {
        this.#updateMousePosition(event);
        this.#mouseButtonDown = false;
    }

    #mouseOut(event) {
        this.#mousePosition = undefined;
        this.#mouseButtonDown = false;
    }

    #updateMousePosition(event) {
        const rect = this.#canvas.getBoundingClientRect()
        const mouseX = event.clientX - rect.left
        const mouseY = event.clientY - rect.top
        this.#mousePosition = { x: mouseX, y: mouseY };
    }

    get keyboardState() { return this.#keyboardStatus; }
    get mousePosition() { return this.#mousePosition; }
    get mouseButtonDown() { return this.#mouseButtonDown; }

    get context() { return this.#ctx; }
    get width() { return this.#canvas.width; }
    get height() { return this.#canvas.height; }

    getKeyboardMovement() {
        var deltaX = 0;
        deltaX += this.#keyboardStatus.left ? -1 : 0;
        deltaX += this.#keyboardStatus.right ? 1 : 0;
        var deltaY = 0;
        deltaY += this.#keyboardStatus.up ? -1 : 0;
        deltaY += this.#keyboardStatus.down ? 1 : 0;
        return { x: deltaX, y: deltaY };
    }

    getDirectionTowardsMouse(fromPoint) {
        if (this.mousePosition !== undefined) {
            
            var horizontalDistanceToMouse = this.#mousePosition.x - fromPoint.x;
            var verticalDistanceToMouse = this.#mousePosition.y - fromPoint.y;
            var degrees = this.#calcAngleDegrees(horizontalDistanceToMouse, verticalDistanceToMouse);
           // console.log("x distance:" + horizontalDistanceToMouse + ", y distance:" + verticalDistanceToMouse + "= degrees:" + degrees);
            return degrees;
        }
    }
    #calcAngleDegrees(x, y) {
        return Math.atan2(y, x);
    }
}