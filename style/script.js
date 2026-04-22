const music = document.getElementById("bg-music");
const playBtn = document.getElementById("play-button");

// Hàm xử lý khi nhấn nút Play
playBtn.addEventListener("click", function() {
    // 1. Phát nhạc từ đầu
    music.currentTime = 0;
    music.play().catch(e => console.log("Music play blocked:", e));

    // 2. Làm mờ và xóa nút Play
    this.style.opacity = "0";
    setTimeout(() => {
        this.remove();
    }, 300);

    // 3. (Tùy chọn) Kích hoạt hiệu ứng bay của các ngôi sao nếu cần
    // Vì code Canvas của bạn chạy liên tục nên không cần gọi lại animate()
});

// Lưu ý: Xóa hoặc comment lại các đoạn window.addEventListener("click", playMusicOnce) cũ
// để tránh việc click vào màn hình cũng reset lại nhạc.

const messages = [
  "君は僕の宇宙だよ。",
  "星々の間で輝く永遠の愛。",
  "君は一番眩しく輝く星だよ。",
  "僕が輝けるのは君がいるからだよ。",
  "君は僕の空でとても眩しく輝いているよ。"
];
const fallingTexts = [];

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const stars = [];
const heartStars = [];
const meteors = [];

let mouseX = width / 2;
let mouseY = height / 2;
let heartBeat = 1;
let heartScale = Math.min(width, height) * 0.015;

function createFallingText() {
  const text = messages[Math.floor(Math.random() * messages.length)];
  const fontSize = Math.random() * 10 + 10;

  ctx.font = `bold ${fontSize}px Pacifico`;
  const textWidth = ctx.measureText(text).width;
  const x = Math.random() * (width - textWidth); 
  const hue = Math.random() * 360;

  fallingTexts.push({
    text,
    x,
    y: -10,
    speed: Math.random() * 2 + 2,
    alpha: 1,
    fontSize,
    // Lưu sẵn một phần chuỗi màu để nối nhanh với alpha ở mỗi frame
    color: `hsla(${hue}, 100%, 85%, `, 
    shadowColor: `hsla(${hue}, 100%, 70%, `
  });
}

function heartShape(t, scale = 1) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
  return { x: x * scale, y: y * scale };
}

function createHeartStars(count = 1600) {
  const centerX = width / 2;
  const centerY = height / 2 + 20;
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const heart = heartShape(t, heartScale);
    const offsetX = (Math.random() - 0.5) * 15;
    const offsetY = (Math.random() - 0.5) * 15;

    const targetX = centerX + heart.x + offsetX;
    const targetY = centerY + heart.y + offsetY;
    const hue = Math.random() * 60 + 300;

    heartStars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      targetX,
      targetY,
      originalX: targetX,
      originalY: targetY,
      size: Math.random() * 3 + 1,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
      brightness: Math.random() * 0.5 + 0.5,
      // Tính sẵn chuỗi màu để tối ưu bộ nhớ
      color: `hsl(${hue}, 70%, 80%)`,     
      shadowColor: `hsl(${hue}, 70%, 60%)`,
      mode: 'flying'
    });
  }
}

function createBackgroundStars() {
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.01 + 0.005,
      brightness: Math.random() * 0.3 + 0.2
    });
  }
}

function createMeteor() {
  meteors.push({
    x: Math.random() * width,
    y: -50,
    length: Math.random() * 80 + 50,
    speed: Math.random() * 6 + 6,
    angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
    alpha: 1
  });
}

setInterval(() => {
  if (Math.random() < 0.8) createFallingText();
}, 2000);

setInterval(() => { 
  if (Math.random() < 0.7) createMeteor(); 
}, 3000);

function animate() {
  ctx.clearRect(0, 0, width, height);
  heartBeat += 0.1;

  // 1. Draw Background Stars
  stars.forEach(star => {
    star.twinkle += star.twinkleSpeed;
    const flicker = Math.random() < 0.005 ? 1 : 0;
    const baseOpacity = star.brightness * (0.4 + 0.6 * Math.sin(star.twinkle));
    const opacity = Math.min(1, baseOpacity + flicker);

    // Không dùng ctx.save()/restore() để giảm tải
    ctx.globalAlpha = opacity;
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = flicker ? 20 : 0;
    ctx.shadowColor = flicker ? '#fff' : 'transparent';
    
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });

  // 2. Draw Meteors
  ctx.shadowBlur = 0; // Reset shadow trước khi vẽ sao băng
  meteors.forEach((m, i) => {
    const dx = Math.cos(m.angle) * m.length;
    const dy = Math.sin(m.angle) * m.length;
    
    ctx.globalAlpha = m.alpha;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(m.x, m.y);
    ctx.lineTo(m.x - dx, m.y - dy);
    ctx.stroke();
    
    m.x += Math.cos(m.angle) * m.speed;
    m.y += Math.sin(m.angle) * m.speed;
    m.alpha -= 0.005;
    if (m.alpha <= 0) meteors.splice(i, 1);
  });

  // 3. Draw Falling Texts
  fallingTexts.forEach((t, i) => {
    ctx.font = `bold ${t.fontSize}px Pacifico`;
    // Nối chuỗi nhanh
    ctx.fillStyle = t.color + `${t.alpha})`;
    ctx.shadowBlur = 5;
    ctx.shadowColor = t.shadowColor + `${t.alpha})`;
    ctx.fillText(t.text, t.x, t.y);

    t.y += t.speed;
    t.alpha -= 0.002;

    if (t.y > height + 30 || t.alpha <= 0) {
      fallingTexts.splice(i, 1);
    }
  });

  // 4. Draw Heart Stars
  // Tính toán trước các biến dùng chung
  const centerX = width / 2;
  const centerY = height / 2 + 20;
  const beatScale = 1 + Math.sin(heartBeat) * 0.05;

  ctx.shadowBlur = 10; // Thiết lập 1 lần cho toàn bộ heartStars

  heartStars.forEach((star) => {
    star.twinkle += star.twinkleSpeed;

    if (star.mode === 'flying') {
      const dx = star.targetX - star.x;
      const dy = star.targetY - star.y;
      // Dùng bình phương khoảng cách để bỏ qua Math.sqrt()
      const distSq = dx * dx + dy * dy;
      const speed = 0.07;
      
      if (distSq > 1) { // 1^2 = 1
        star.x += dx * speed;
        star.y += dy * speed;
      } else {
        star.mode = 'heart';
      }
    } 
    else {
      const deltaX = star.originalX - centerX;
      const deltaY = star.originalY - centerY;
      
      star.x = centerX + deltaX * beatScale;
      star.y = centerY + deltaY * beatScale;

      const mouseDx = mouseX - star.x;
      const mouseDy = mouseY - star.y;
      const distToMouseSq = mouseDx * mouseDx + mouseDy * mouseDy;
      
      // Kiểm tra trong bán kính 100px (100^2 = 10000)
      if (distToMouseSq < 10000) { 
        const distanceToMouse = Math.sqrt(distToMouseSq); // Chỉ dùng Math.sqrt khi thoả điều kiện
        const interactionForce = (100 - distanceToMouse) / 100;
        const angle = Math.atan2(mouseDy, mouseDx);
        star.x += Math.cos(angle) * interactionForce * 10;
        star.y += Math.sin(angle) * interactionForce * 10;
      }
    }

    const twinkleOpacity = star.brightness * (0.3 + 0.7 * Math.sin(star.twinkle));
    
    ctx.globalAlpha = twinkleOpacity;
    ctx.fillStyle = star.color;
    ctx.shadowColor = star.shadowColor; 

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });

  // Reset shadow cho frame tiếp theo
  ctx.shadowBlur = 0; 
  ctx.shadowColor = 'transparent';

  requestAnimationFrame(animate);
}

canvas.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

canvas.addEventListener('click', (e) => {
  const centerX = width / 2;
  const centerY = height / 2 + 20;
  heartScale *= 1.015;
  
  heartStars.forEach((star, i) => {
    if (star.mode === 'heart') {
      const t = (i / heartStars.length) * Math.PI * 2;
      const heart = heartShape(t, heartScale);
      const offsetX = (Math.random() - 0.5) * 15;
      const offsetY = (Math.random() - 0.5) * 15;
      star.originalX = centerX + heart.x + offsetX;
      star.originalY = centerY + heart.y + offsetY;
    }
  });

  for (let i = 0; i < 10; i++) {
    const t = Math.random() * Math.PI * 2;
    const heart = heartShape(t, heartScale);
    const targetX = centerX + heart.x;
    const targetY = centerY + heart.y;
    const hue = Math.random() * 60 + 300;

    heartStars.push({
      x: e.clientX + (Math.random() - 0.5) * 50,
      y: e.clientY + (Math.random() - 0.5) * 50,
      targetX,
      targetY,
      originalX: targetX,
      originalY: targetY,
      size: Math.random() * 3 + 2,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.03 + 0.02,
      brightness: Math.random() * 0.8 + 0.6,
      color: `hsl(${hue}, 70%, 80%)`,
      shadowColor: `hsl(${hue}, 70%, 60%)`,
      mode: 'flying'
    });
  }
});

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  heartScale = Math.min(width, height) * 0.015;
  heartStars.length = 0;
  stars.length = 0;
  createHeartStars();
  createBackgroundStars();
});

createHeartStars();
createBackgroundStars();
animate();