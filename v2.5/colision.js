const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;

let score = 0;
const counterDisplay = document.getElementById("counter");

class FlowerObject {
    constructor(x, y, radius, color, text) {
        this.posX = x;
        this.posY = y;
        this.radius = radius; // Tamaño base de la flor
        this.color = color;
        this.text = text;
        
        // Física de caída libre y rebote
        this.baseSpeed = Math.random() * 2 + 1;
        this.dy = this.baseSpeed;
        this.dx = (Math.random() - 0.5) * 2; 
        this.gravity = 0.2;
        this.bounceFactor = -0.6; // Pierde fuerza en cada rebote
        this.rotation = Math.random() * Math.PI; // Rotación inicial aleatoria
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    }

    updateSpeedMultiplier() {
        if (score > 20) {
            return 2.5; // Velocidad alta
        } else if (score > 10) {
            return 1.8; // Velocidad media
        }
        return 1.0; // Velocidad inicial predefinida
    }

    draw(context) {
        context.save();
        context.translate(this.posX, this.posY);
        context.rotate(this.rotation);

        context.shadowColor = this.color;
        context.shadowBlur = 10;

        // Dibujar pétalos de la flor (5 pétalos alrededor del centro)
        const petals = 5;
        const petalRadius = this.radius * 0.6;
        for (let i = 0; i < petals; i++) {
            let angle = (i * 2 * Math.PI) / petals;
            let pX = Math.cos(angle) * (this.radius * 0.4);
            let pY = Math.sin(angle) * (this.radius * 0.4);

            context.beginPath();
            context.fillStyle = this.color;
            context.globalAlpha = 0.85;
            context.arc(pX, pY, petalRadius, 0, Math.PI * 2);
            context.fill();
            context.closePath();
        }

        // Centro brillante de la flor
        context.beginPath();
        context.fillStyle = "#ffcc00"; // Centro amarillo llamativo
        context.globalAlpha = 1.0;
        context.arc(0, 0, this.radius * 0.4, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = "#ffffff";
        context.lineWidth = 1.5;
        context.stroke();
        context.closePath();

        context.restore();

        // Texto o identificador opcional sutil al centro
        context.shadowBlur = 0;
        context.fillStyle = "#ffffff";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "bold 10px 'Orbitron', sans-serif";
        context.fillText(this.text, this.posX, this.posY);
    }

    update(context) {
        let multiplier = this.updateSpeedMultiplier();

        // Movimiento de caída con gravedad
        this.dy += this.gravity * 0.5;
        this.posY += this.dy * multiplier;
        this.posX += this.dx * multiplier;
        this.rotation += this.rotationSpeed; // Efecto de giro mientras cae

        // Rebote en las paredes laterales
        if (this.posX - this.radius < 0 || this.posX + this.radius > window_width) {
            this.dx = -this.dx;
        }

        // Rebote en el margen inferior (efecto de parábola con pérdida de fuerza)
        if (this.posY + this.radius >= window_height) {
            this.posY = window_height - this.radius;
            this.dy = this.dy * this.bounceFactor;
            
            // Si la fuerza del rebote es mínima, vuelve a iniciar arriba (caída libre)
            if (Math.abs(this.dy) < 1) {
                this.respawn();
            }
        }

        this.draw(context);
    }

    respawn() {
        this.posX = Math.random() * (window_width - this.radius * 2) + this.radius;
        this.posY = -Math.random() * 200 - this.radius; // Inicia justo arriba del canvas
        this.dy = Math.random() * 2 + 1;
        this.dx = (Math.random() - 0.5) * 2;
    }

    isClicked(mouseX, mouseY) {
        let distX = this.posX - mouseX;
        let distY = this.posY - mouseY;
        let distance = Math.sqrt(distX * distX + distY * distY);
        return distance <= this.radius;
    }
}

let objects = [];

function generateObjects(n) {
    const flowerColors = ["#ff007f", "#00ffff", "#bf00ff", "#ff5500", "#00ff88", "#ff3399"];
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 10 + 22; // Tamaño dinámico de la flor
        let x = Math.random() * (window_width - radius * 2) + radius;
        let y = -Math.random() * window_height; 
        let color = flowerColors[Math.floor(Math.random() * flowerColors.length)];
        let text = `${i + 1}`;
        objects.push(new FlowerObject(x, y, radius, color, text));
    }
}

// Detección de clics mediante mouseX y mouseY para eliminar/reiniciar el objeto y sumar puntos
window.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    for (let i = 0; i < objects.length; i++) {
        if (objects[i].isClicked(mouseX, mouseY)) {
            objects[i].respawn(); 
            score++;
            counterDisplay.textContent = score;
            break;
        }
    }
});

function animate() {
    ctx.fillStyle = "rgba(5, 8, 20, 0.35)";
    ctx.fillRect(0, 0, window_width, window_height);

    objects.forEach(obj => {
        obj.update(ctx);
    });

    requestAnimationFrame(animate);
}

// Generar exactamente los 25 objetos indicados en la práctica
generateObjects(25);
animate();