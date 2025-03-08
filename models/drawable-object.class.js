/**
 * Represents a drawable object in the game.
 */
class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 280;
    height = 150;
    width = 100;

    /**
     * Loads an image from the specified path.
     * @param {string} path - The path to the image.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the object on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Draws the object's frame for debugging purposes.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof MiniChicken || this instanceof Chicken || this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = '3';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        };
    }

    /**
     * Draws the object's frame with offset for debugging purposes.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    drawFrameOffset(ctx) {
        if (this instanceof Character || this instanceof MiniChicken || this instanceof Chicken || this instanceof Endboss || this instanceof Coin || this instanceof Bottle) {
            ctx.beginPath();
            ctx.lineWidth = '3';
            ctx.strokeStyle = 'red';
            ctx.rect(
                this.x + this.offset.left,
                this.y + this.offset.top,
                this.width - this.offset.left - this.offset.right,
                this.height - this.offset.top - this.offset.bottom
            );
            ctx.stroke();
        }
    }

    /**
     * Loads multiple images from the specified array of paths.
     * @param {Array<string>} arr - The array of image paths.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Resolves the image index based on the current percentage.
     * @returns {number} - The index of the image to display.
     */
    resolveImageIndex() {
        if (this.percentage >= 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}