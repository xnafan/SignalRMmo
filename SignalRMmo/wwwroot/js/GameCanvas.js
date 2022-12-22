// This clas wraps an HTML5 canvas and simplifies using it for games
// It facilitates getting
//  - a 2D drawing context for drawing to the canvas
//  - the position of the mouse
//  - the state of the primary mousebutton
//  - the indicated direction to move based on keyboard input (arrows + WASD)

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
        canvas.addEventListener("touchstart", (event) => this.#touchStart(event), false);
        canvas.addEventListener("touchend", (event) => this.#touchEnd(event), false);
        canvas.addEventListener("touchmove", (event) => this.#touchMove(event), false);
        canvas.addEventListener("mouseout", _ => this.#mouseOut(event));
        canvas.addEventListener("blur", (event) => this.#allKeysUp(event));
    }
    get keyboardState() { return this.#keyboardStatus; }
    get mousePosition() { return this.#mousePosition; }
    get mouseButtonDown() { return this.#mouseButtonDown; }

    get context() { return this.#ctx; }
    get width() { return this.#canvas.width; }
    get height() { return this.#canvas.height; }
    get canvas() { return this.#canvas; }

    // Get the position of a touch relative to the canvas
    #getTouchPos(canvasDom, touchEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
            x: touchEvent.touches[0].clientX - rect.left,
            y: touchEvent.touches[0].clientY - rect.top
        };
    }
    #touchStart(e) {
        let mousePos = this.#getTouchPos(this.#canvas, e);
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.#canvas.dispatchEvent(mouseEvent);
    }

    #touchEnd(e) {
        var mouseEvent = new MouseEvent("mouseup", {});
        this.#canvas.dispatchEvent(mouseEvent);
    }
    #touchMove(e) {
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.#canvas.dispatchEvent(mouseEvent);
        this.#mouseButtonDown = true;
    }

    //returns a point with values -1, 0 or 1 for x- and y-axis 
    //to indicate movement (if any) on the two axis
    getKeyboardMovement() {
        var deltaX = 0;
        deltaX += this.#keyboardStatus.left ? -1 : 0;
        deltaX += this.#keyboardStatus.right ? 1 : 0;
        var deltaY = 0;
        deltaY += this.#keyboardStatus.up ? -1 : 0;
        deltaY += this.#keyboardStatus.down ? 1 : 0;
        return { x: deltaX, y: deltaY };
    }

    //gets the angle in radian from a given point 
    //  towards the current mouse position
    getDirectionTowardsMouse(fromPoint) {
        if (this.mousePosition !== undefined) {
            var horizontalDistanceToMouse = this.#mousePosition.x - fromPoint.x;
            var verticalDistanceToMouse = this.#mousePosition.y - fromPoint.y;
            var degrees = this.#calcAngleRadian(horizontalDistanceToMouse, verticalDistanceToMouse);
            return degrees;
        }
    }

    #allKeysUp() {
        this.#keyboardStatus.down = false;
        this.#keyboardStatus.up = false;
        this.#keyboardStatus.left = false;
        this.#keyboardStatus.right = false;
    }

    #keyDown(event) {
        switch (event.code) {
            case 'KeyA': case 'ArrowLeft': this.#keyboardStatus.left = true; break;
            case 'KeyD': case 'ArrowRight': this.#keyboardStatus.right = true; break;
            case 'KeyW': case 'ArrowUp': this.#keyboardStatus.up = true; break;
            case 'KeyS': case 'ArrowDown': this.#keyboardStatus.down = true; break;
        }
    }

    #keyUp(event) {
        switch (event.code) {
            case 'KeyA': case 'ArrowLeft': this.#keyboardStatus.left = false; break;
            case 'KeyD': case 'ArrowRight': this.#keyboardStatus.right = false; break;
            case 'KeyW': case 'ArrowUp': this.#keyboardStatus.up = false; break;
            case 'KeyS': case 'ArrowDown': this.#keyboardStatus.down = false; break;
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

    #calcAngleRadian(x, y) {
        return Math.atan2(y, x);
    }
}