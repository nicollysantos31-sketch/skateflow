// SkateFlow - p5.js Frontend
// Plataforma interativa sobre skate com menu e informações

let menuItems = [];
let selectedMenu = null;
let showInfoPanel = false;
let infoPanelContent = {};
let particles = [];
let mouseOverButton = false;
let canvasWidth, canvasHeight;

// Dados sobre manobras de skate
const skateInfo = {
  ollie: {
    title: 'OLLIE',
    description: 'O Ollie é a manobra mais básica e fundamental do skate. É quando você pressiona a cauda do skate no chão enquanto pula, levantando o board no ar.',
    tips: [
      'Posição: Coloque seu pé traseiro na cauda e o outro no meio',
      'Pressão: Bata a cauda no chão com força',
      'Pulo: Pule enquanto bate, sincronizando os movimentos',
      'Dificuldade: Iniciante',
      'Prática: 30 min/dia por 2-3 semanas'
    ]
  },
  kickflip: {
    title: 'KICKFLIP',
    description: 'Um Kickflip é quando o skatista faz um Ollie e, enquanto o board está no ar, o chuta lateralmente fazendo-o girar 360 graus antes de pousá-lo.',
    tips: [
      'Pré-requisito: Dominar o Ollie',
      'Posição: Pé traseiro na cauda, dianteiro na lateral',
      'Movimento: Chute o board enquanto pula',
      'Dificuldade: Intermediário',
      'Prática: 1-2 horas/dia por 4-6 semanas'
    ]
  },
  heelflip: {
    title: 'HEELFLIP',
    description: 'Similar ao Kickflip, mas o movimento é feito com o calcanhar, girando o board para a direção oposta.',
    tips: [
      'Pré-requisito: Kickflip bem executado',
      'Posição: Pé traseiro fora da borda, dianteiro no talho',
      'Movimento: Chute com o calcanhar enquanto pula',
      'Dificuldade: Intermediário/Avançado',
      'Prática: 1-2 horas/dia por 6-8 semanas'
    ]
  },
  manual: {
    title: 'MANUAL',
    description: 'Manobra onde o skatista levanta o nose ou a cauda do chão enquanto anda, equilibrando apenas as rodas traseiras ou dianteiras.',
    tips: [
      'Posição: Coloque o pé na cauda ou no nose',
      'Equilíbrio: Distribua bem o peso corporal',
      'Movimento: Incline o corpo para trás ou frente',
      'Dificuldade: Intermediário',
      'Prática: 45 min/dia por 3-4 semanas'
    ]
  },
  railstand: {
    title: 'RAILSTAND',
    description: 'Manobra avançada onde o skatista equilibra o board em apenas um trilho (lateral do board) enquanto permanece em pé.',
    tips: [
      'Pré-requisito: Manual bem executado',
      'Posição: Pé na cauda ou nose, levante a borda oposta',
      'Equilíbrio: Mantenha o corpo vertical e centralizado',
      'Dificuldade: Avançado',
      'Prática: 2+ horas/dia por 8+ semanas'
    ]
  },
  grind: {
    title: 'GRIND',
    description: 'Manobra em obstáculos onde o skatista desliza nos trilhos (trucks) do board ao longo de um objeto como escadas ou corrimão.',
    tips: [
      'Pré-requisito: Ollie e confiança',
      'Posição: Salte para cima do obstáculo',
      'Deslize: Deixe o board deslizar nos trucks',
      'Saída: Desce e continue rolando',
      'Dificuldade: Intermediário/Avançado',
      'Prática: 1-2 horas/dia em spots com obstáculos'
    ]
  }
};

function setup() {
  canvasWidth = windowWidth;
  canvasHeight = windowHeight;
  createCanvas(canvasWidth, canvasHeight);
  
  // Criar botões do menu
  createMenuButtons();
  
  // Inicializar partículas
  initializeParticles();
}

function draw() {
  // Fundo com degradado
  background(10, 14, 39);
  drawGradientBackground();
  
  // Desenhar e atualizar partículas
  updateAndDrawParticles();
  
  // Desenhar título
  drawTitle();
  
  // Desenhar botões do menu
  drawMenuButtons();
}

function createMenuButtons() {
  menuItems = [];
  
  const keys = Object.keys(skateInfo);
  const buttonWidth = 140;
  const buttonHeight = 50;
  const spacing = 20;
  const startX = 50;
  const startY = 150;
  
  keys.forEach((key, index) => {
    const x = startX;
    const y = startY + (index * (buttonHeight + spacing));
    
    menuItems.push({
      key: key,
      label: skateInfo[key].title,
      x: x,
      y: y,
      width: buttonWidth,
      height: buttonHeight,
      isHovered: false
    });
  });
}

function drawMenuButtons() {
  menuItems.forEach(button => {
    // Verificar se o mouse está sobre o botão
    button.isHovered = mouseX > button.x && 
                       mouseX < button.x + button.width &&
                       mouseY > button.y && 
                       mouseY < button.y + button.height;
    
    // Cor do botão
    if (button.isHovered) {
      fill(0, 255, 136);
      shadowColor = color(0, 255, 136, 100);
    } else if (selectedMenu === button.key) {
      fill(0, 200, 106);
    } else {
      fill(26, 26, 46);
    }
    
    // Desenhar botão com borda
    stroke(button.isHovered ? color(0, 255, 136) : color(0, 100, 136));
    strokeWeight(button.isHovered ? 3 : 2);
    rect(button.x, button.y, button.width, button.height, 5);
    
    // Texto do botão
    fill(button.isHovered || selectedMenu === button.key ? 10 : 200, 
         button.isHovered || selectedMenu === button.key ? 14 : 200, 
         button.isHovered || selectedMenu === button.key ? 39 : 200);
    textSize(12);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    text(button.label, button.x + button.width/2, button.y + button.height/2);
    
    // Efeito de sombra neon
    if (button.isHovered) {
      drawNeonGlow(button.x + button.width/2, button.y + button.height/2, 100);
    }
  });
}

function drawTitle() {
  fill(0, 255, 136);
  textSize(48);
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  text('SKATEFLOW', 50, 80);
  
  // Subtítulo
  fill(150, 150, 150);
  textSize(14);
  textStyle(NORMAL);
  text('Clique em uma manobra para saber mais', 50, 110);
}

function drawNeonGlow(x, y, radius) {
  push();
  noStroke();
  
  for (let i = radius; i > 0; i -= 5) {
    fill(0, 255, 136, map(i, radius, 0, 0, 20));
    ellipse(x, y, i);
  }
  
  pop();
}

function drawGradientBackground() {
  // Desenhar gradiente de fundo
  for (let i = 0; i < height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(
      color(10, 14, 39),
      color(26, 26, 46),
      inter
    );
    stroke(c);
    line(0, i, width, i);
  }
}

function initializeParticles() {
  particles = [];
  for (let i = 0; i < 30; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-1, 1),
      vy: random(-0.5, 0.5),
      size: random(1, 3),
      opacity: random(50, 150)
    });
  }
}

function updateAndDrawParticles() {
  particles.forEach((p, index) => {
    // Atualizar posição
    p.x += p.vx;
    p.y += p.vy;
    
    // Rebote nas bordas
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;
    
    // Manter na tela
    p.x = constrain(p.x, 0, width);
    p.y = constrain(p.y, 0, height);
    
    // Desenhar partícula
    fill(0, 255, 136, p.opacity);
    noStroke();
    ellipse(p.x, p.y, p.size);
  });
}

function mousePressed() {
  // Verificar clique nos botões do menu
  for (let button of menuItems) {
    if (mouseX > button.x && mouseX < button.x + button.width &&
        mouseY > button.y && mouseY < button.y + button.height) {
      selectedMenu = button.key;
      showInfoPanel = true;
      displayInfoPanel(button.key);
      return false;
    }
  }
}

function displayInfoPanel(key) {
  const info = skateInfo[key];
  const infoPanelDiv = document.getElementById('info-panel');
  const infoContent = document.getElementById('info-content');
  
  // Montar HTML com as informações
  let html = `
    <h2>${info.title}</h2>
    <p>${info.description}</p>
    <h3 style="color: #00ff88; margin-top: 20px; margin-bottom: 10px; font-size: 16px;">Dicas e Informações:</h3>
    <ul>
  `;
  
  info.tips.forEach(tip => {
    html += `<li>${tip}</li>`;
  });
  
  html += '</ul>';
  
  infoContent.innerHTML = html;
  infoPanelDiv.classList.remove('hidden');
  infoPanelDiv.classList.add('active');
}

// Fechar painel de informações
document.getElementById('close-btn').addEventListener('click', function() {
  const infoPanelDiv = document.getElementById('info-panel');
  infoPanelDiv.classList.remove('active');
  setTimeout(() => {
    infoPanelDiv.classList.add('hidden');
  }, 300);
});

// Ajustar canvas quando a janela redimensionar
function windowResized() {
  if (windowWidth > 0 && windowHeight > 0) {
    resizeCanvas(windowWidth, windowHeight);
    createMenuButtons();
  }
}