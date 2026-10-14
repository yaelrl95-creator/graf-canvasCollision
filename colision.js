const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.originalColor = color; 
        this.color = color;
        this.text = text;
        this.speed = speed;
        this.dx = (Math.random() < 0.5 ? 1 : -1) * this.speed;
        this.dy = (Math.random() < 0.5 ? 1 : -1) * this.speed;
    }

    draw(context) {
        context.beginPath();
        
        // Efecto de brillo de neón (ShadowBlur)
        context.shadowColor = this.color;
        context.shadowBlur = 15;

        // Relleno semitransparente futurista
        context.fillStyle = this.color;
        context.globalAlpha = 0.25;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.fill();

        // Borde sólido brillante
        context.globalAlpha = 1.0;
        context.lineWidth = 3;
        context.strokeStyle = this.color;
        context.stroke();
        context.closePath();

        // Texto central estilizado
        context.shadowBlur = 0; 
        context.fillStyle = "#ffffff";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "bold 14px 'Orbitron', sans-serif";
        context.fillText(this.text, this.posX, this.posY);
    }

    update(context, circles) {
        this.draw(context);

        // Restaurar color original en cada fotograma
        this.color = this.originalColor;

        // Movimiento en X y rebote en paredes
        this.posX += this.dx;
        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
            this.dx = -this.dx;
        }

        // Movimiento en Y y rebote en paredes
        this.posY += this.dy;
        if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
            this.dy = -this.dy;
        }

        // Detección de colisión y rebote mutuo
        circles.forEach(circle => {
            if (circle !== this) {
                let distX = this.posX - circle.posX;
                let distY = this.posY - circle.posY;
                let distance = Math.sqrt(distX * distX + distY * distY);

                // Si colisionan
                if (distance <= this.radius + circle.radius) {
                    this.color = "#00f3ff"; // Cambiar a color azul eléctrico de neón
                    
                    // Invertir dirección (rebote en sentido contrario)
                    this.dx = -this.dx;
                    this.dy = -this.dy;
                }
            }
        });
    }
}

let circles = [];

function generateCircles(n) {
    const neonColors = ["#ff0055", "#00ffcc", "#7000ff", "#ffcc00", "#ff3300", "#0066ff"];

    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 20 + 20; // Radio entre 20 y 40
        let x = Math.random() * (window_width - radius * 2) + radius;
        let y = Math.random() * (window_height - radius * 2) + radius;
        let color = neonColors[Math.floor(Math.random() * neonColors.length)];
        let speed = Math.random() * 3 + 2; // Velocidad entre 2 y 5
        let text = `C-${i + 1}`;
        circles.push(new Circle(x, y, radius, color, text, speed));
    }
}

function animate() {
    ctx.fillStyle = "rgba(5, 8, 20, 0.3)";
    ctx.fillRect(0, 0, window_width, window_height);

    circles.forEach(circle => {
        circle.update(ctx, circles);
    });
    requestAnimationFrame(animate);
}

// Generar los 20 círculos
generateCircles(20);
animate();