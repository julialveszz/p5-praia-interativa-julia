// Praia animada inspirada no Rio de Janeiro - Interativa e estilizada

// Variáveis globais
let eNoite = false;
let deslocamentoOnda = 0;
let anguloPalmeira = 0;
let anguloMaximoPalmeira = 45; 
let anguloMinimoPalmeira = -15; 
let gaivolaX = 200;
let gaivolaY = 120;
let direcaoGaivola = 1;
let imgGaivola; 
let imagemCarregada = false;
let posicaoBondinho = 0; 

// Variáveis para efeitos visuais
let texturaAreia;
let velocidadeOnda = 0.5;
let camadasOnda = 3;
let particulasEspuma = [];

function preload() {
  try {
    imgGaivola = loadImage('gaivota.png', 
      function() { imagemCarregada = true; },
      function() { imagemCarregada = false; }
    );
  } catch (e) {
    imagemCarregada = false;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  
  // Inicializa as partículas de espuma do mar
  for (let i = 0; i < 40; i++) {
    particulasEspuma.push({
      x: random(width),
      y: height * 0.68 + random(-10, 10),
      size: random(2, 6),
      speed: random(0.5, 1.5)
    });
  }
  
  // Inicializa a textura da areia com ruído
  texturaAreia = createGraphics(width, height * 0.3);
  criarTexturaAreia();
}

function criarTexturaAreia() {
  texturaAreia.loadPixels();
  let escala = 0.01;
  
  for (let x = 0; x < texturaAreia.width; x++) {
    for (let y = 0; y < texturaAreia.height; y++) {
      let valorRuido = noise(x * escala, y * escala) * 35;
      let indice = (x + y * texturaAreia.width) * 4;
      
      texturaAreia.pixels[indice] = 237 - valorRuido;
      texturaAreia.pixels[indice+1] = 210 - valorRuido;
      texturaAreia.pixels[indice+2] = 170 - valorRuido;
      texturaAreia.pixels[indice+3] = 255;
    }
  }
  
  texturaAreia.updatePixels();
}

function draw() {
  // [REQUISITO - ANIMAÇÃO CONTÍNUA] Loop principal de animação
  if (eNoite) {
    background(20, 24, 60); // céu de noite
  } else {
    background(120, 200, 255); // céu de dia
  }

  desenharSolOuLua();
  desenharPaoDeAcucar();
  desenharMar();
  desenharAreia();
  desenharPalmeira();
  desenharGaivola();
  desenharInstrucoes();
  desenharAssinatura();

  // [REQUISITO - ANIMAÇÃO CONTÍNUA] Animação da gaivola e do bondinho
  deslocamentoOnda += 1;
  gaivolaX += direcaoGaivola * 2;
  if (gaivolaX > width - 100 || gaivolaX < 100) direcaoGaivola *= -1;
  
  posicaoBondinho += 0.2;
  if (posicaoBondinho > 100) posicaoBondinho = 0;
}

function desenharSolOuLua() {
  // [REQUISITO - TRANSFORMAÇÕES - push/pop()]
  push();
  noStroke();
  if (eNoite) {
    fill(255, 255, 200, 200);
    ellipse(100, 100, 70);

    // Estrelas no céu noturno
    for (let i = 0; i < 60; i++) {
      fill(255, 255, 255, random(100, 200));
      ellipse(random(width), random(height * 0.6), random(1, 3));
    }
  } else {
    fill(255, 220, 60);
    ellipse(100, 100, 90);
  }
  pop();
}

function desenharPaoDeAcucar() {
  // [REQUISITO - TRANSFORMAÇÕES - push/pop(), translate(), scale()]
  push();
  // [REQUISITO - TRANSFORMAÇÕES - translate()]
  translate(width * 0.5, height * 0.67);
  
  // [REQUISITO - TRANSFORMAÇÕES - scale()]
  scale(width / 1600, height / 800);
  
  // Definição dos pontos do cabo
  let inicioX = -140;
  let inicioY = -100;
  let fimX = 130;
  let fimY = -200;
  
  // Morro da Urca
  noStroke();
  fill(150, 140, 130);
  beginShape();
  vertex(-280, 80);
  bezierVertex(-270, -20, -180, -120, -140, -100);
  bezierVertex(-100, -80, -60, 0, -40, 80);
  endShape(CLOSE);
  
  // Pão de Açúcar
  fill(150, 140, 130);
  beginShape();
  vertex(20, 80);
  bezierVertex(30, -50, 100, -200, 130, -200);
  bezierVertex(150, -210, 180, -190, 200, -160);
  bezierVertex(230, -110, 245, -30, 250, 80);
  endShape(CLOSE);
  
  // Cabo do bondinho
  stroke(80);
  strokeWeight(3);
  line(inicioX, inicioY, fimX, fimY);
  
  // [REQUISITO - ANIMAÇÃO CONTÍNUA] Movimento do bondinho
  let posicao = posicaoBondinho / 100;
  let posicaoAjustada;
  
  if (posicao <= 0.5) {
    posicaoAjustada = posicao * 2;
  } else {
    posicaoAjustada = (1 - posicao) * 2;
  }
  
  let bondinhoX = lerp(inicioX, fimX, posicaoAjustada);
  let bondinhoY = lerp(inicioY, fimY, posicaoAjustada);
  
  // Bondinho 
  fill(255);
  stroke(40);
  strokeWeight(1.5);
  rect(bondinhoX - 10, bondinhoY - 5, 20, 15, 4);
  stroke(40);
  line(bondinhoX, bondinhoY - 5, bondinhoX, bondinhoY);
  
  pop();
}

function desenharMar() {
  // [REQUISITO - TRANSFORMAÇÕES - push/pop(), translate()]
  push();
  translate(0, height * 0.68);
  
  // [REQUISITO - ANIMAÇÃO CONTÍNUA] Camadas de ondas animadas
  for (let camada = 0; camada < camadasOnda; camada++) {
    let deslocamentoCamada = camada * 20;
    let amplitude = map(camada, 0, camadasOnda-1, 20, 8); 
    let frequencia = map(camada, 0, camadasOnda-1, 0.03, 0.08);
    let velocidade = map(camada, 0, camadasOnda-1, 1, 1.5);
    
    noStroke();
    let transparencia = map(camada, 0, camadasOnda-1, 255, 180);
    fill(0, 119, eNoite ? 160 + camada*10 : 210 + camada*10, transparencia);
    
    beginShape();
    for (let x = 0; x <= width; x += 8) {
      let y = amplitude * sin((x + deslocamentoOnda * velocidade) * frequencia) + 
              amplitude/2 * sin((x + deslocamentoOnda * velocidade * 1.5) * frequencia * 2);
      vertex(x, y - deslocamentoCamada);
    }
    vertex(width, height * 0.4);
    vertex(0, height * 0.4);
    endShape(CLOSE);
  }
  
  // [REQUISITO - ANIMAÇÃO CONTÍNUA] Espuma das ondas
  for (let p of particulasEspuma) {
    p.x -= p.speed;
    if (p.x < 0) p.x = width;
    
    let alturaOnda = 18 * sin((p.x + deslocamentoOnda) * 0.04) + 
                      8 * sin((p.x + deslocamentoOnda * 2) * 0.07);
    
    fill(255, 255, 255, 180);
    noStroke();
    ellipse(p.x, alturaOnda - 5, p.size, p.size * 0.7);
  }
  
  pop();
  
  // Movimentação das ondas
  deslocamentoOnda += velocidadeOnda;
}

function desenharAreia() {
  // [REQUISITO - TRANSFORMAÇÕES - push/pop()]
  push();
  
  noStroke();
  fill(237, 210, 170);
  rect(0, height * 0.75, width, height * 0.25);
  
  // Textura de areia criada com noise
  image(texturaAreia, 0, height * 0.75, width, height * 0.25);
  
  // Detalhes na areia
  for (let i = 0; i < 80; i++) {
    let x = random(width);
    let y = random(height * 0.77, height * 0.99);
    
    if (random() < 0.3) {
      fill(230, 225, 210, 120);
      ellipse(x, y, random(2, 5), random(3, 6));
    } else {
      fill(230, 200, 150, 60);
      ellipse(x, y, random(2, 8), random(2, 8));
    }
  }
  pop();
}

function desenharPalmeira() {
  // [REQUISITO - TRANSFORMAÇÕES - push/pop(), translate(), rotate()]
  push();
  // [REQUISITO - TRANSFORMAÇÕES - translate()]
  translate(width * 0.82, height * 0.75);
  // [REQUISITO - TRANSFORMAÇÕES - rotate()]
  rotate(anguloPalmeira);
  
  // Tronco da palmeira
  fill(101, 67, 33);
  stroke(80, 50, 20);
  strokeWeight(2);
  
  beginShape();
  for (let y = 0; y <= 160; y += 10) {
    let x = 12 * sin(y * 0.06) - 10;
    vertex(x, -y);
  }
  for (let y = 160; y >= 0; y -= 10) {
    let x = 12 * sin(y * 0.06) + 10;
    vertex(x, -y);
  }
  endShape(CLOSE);
  
  // Detalhes no tronco
  push();
  noStroke();
  fill(120, 80, 40);
  ellipse(4, -40, 8, 5);
  ellipse(2, -80, 8, 5);
  ellipse(5, -120, 8, 5);
  pop();
  
  // [REQUISITO - ANIMAÇÃO CONTÍNUA] Folhas animadas
  translate(0, -160);
  noStroke();
  for (let i = 0; i < 7; i++) {
    push();
    // [REQUISITO - TRANSFORMAÇÕES - rotate()]
    rotate(i * 52 + 20 * sin(frameCount * 0.02 + i));
    
    let corFolha = color(34, 139, 34, 220);
    let corDestaque = color(80, 180, 60, 220);
    
    fill(corFolha);
    beginShape();
    vertex(0, 0);
    bezierVertex(20, -10, 50, -20, 90, -5);
    bezierVertex(50, 15, 20, 10, 0, 0);
    endShape();
    
    fill(corDestaque);
    beginShape();
    vertex(0, 0);
    bezierVertex(15, -5, 35, -10, 65, -2);
    bezierVertex(35, 7, 15, 5, 0, 0);
    endShape();
    
    pop();
  }
  
  // Cocos
  fill(90, 60, 30);
  ellipse(-8, 10, 14, 14);
  ellipse(8, 8, 16, 16);
  ellipse(0, 15, 12, 12);
  
  pop();
}

function desenharGaivola() {
  // [REQUISITO - TRANSFORMAÇÕES - push/pop(), translate(), scale(), rotate()]
  push();
  // [REQUISITO - TRANSFORMAÇÕES - translate()]
  // [REQUISITO - INTERATIVIDADE - mouseY] A gaivola segue o mouse no eixo Y
  translate(gaivolaX, gaivolaY + (mouseY - height * 0.2) * 0.05);
  
  // [REQUISITO - TRANSFORMAÇÕES - scale()]
  scale(1.2, 1.2);
  
  // [REQUISITO - TRANSFORMAÇÕES - rotate()]
  // [REQUISITO - ANIMAÇÃO CONTÍNUA] Rotação animada da gaivola
  rotate(-10 + 10 * sin(frameCount * 0.04));
  
  if (imagemCarregada && imgGaivola) {
    imageMode(CENTER);
    image(imgGaivola, 0, 0, 60, 40);
  } else {
    // Gaivola simplificada como fallback
    noFill();
    stroke(255);
    strokeWeight(3);
    arc(0, 0, 40, 18, PI, 0);
    arc(20, 0, 40, 18, PI, 0);
    strokeWeight(2);
    arc(10, 5, 18, 8, PI, 0);
  }
  
  pop();
}

function desenharInstrucoes() {
  // [REQUISITO - INTERFACE] Instruções para o usuário
  let larguraCaixa = 280;
  let alturaCaixa = 130;
  let espacamento = 10;
  
  push();
  fill(0, 0, 0, 200);
  noStroke();
  rect(width - larguraCaixa - espacamento, espacamento, larguraCaixa, alturaCaixa, 10);
  
  // Adiciona instruções na tela para o usuário
  fill(255);
  textSize(16);
  text("Instruções:", width - larguraCaixa + 10, 35);
  textSize(14);
  text("• Clique para alternar dia/noite", width - larguraCaixa + 10, 60);
  text("• Tecla 'D' gira a palmeira à direita", width - larguraCaixa + 10, 80);
  text("• Tecla 'E' gira a palmeira à esquerda", width - larguraCaixa + 10, 100);
  text("• Mova o mouse para guiar a gaivota", width - larguraCaixa + 10, 120);
  pop();
}

// Assinatura do desenho
function desenharAssinatura() {
  push();
  noStroke();
  textSize(14 * 1.1);
  fill(0);
  text("Júlia Alves de Jesus - uma carioca com saudade da sua cidade natal", 20, height - 20);
  pop();
}

// [REQUISITO - INTERATIVIDADE - mousePressed()] Alterna entre dia e noite
function mousePressed() {
  eNoite = !eNoite;
}

// [REQUISITO - INTERATIVIDADE - keyPressed()] Controla a rotação da palmeira
function keyPressed() {
  if (key === 'd' || key === 'D') {
    anguloPalmeira = min(anguloPalmeira + 5, anguloMaximoPalmeira);
  }
  if (key === 'e' || key === 'E') {
    anguloPalmeira = max(anguloPalmeira - 5, anguloMinimoPalmeira);
  }
}

// [REQUISITO - RESPONSIVIDADE]
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
