let riverData;

function preload() {
  // put preload code here
  riverData = loadTable ("assets/data.csv", "csv", "header")
}
let bgColor = "#F0F0F0";
let baseColors = ["#00A8E8", "#007EA7", "#145DA0", "#1A508B", "#133B5C"]; // 温度颜色梯度
let textColor = "black";

let gridSize = 150; // 每个 glyph 的宽高
let padding = 20;
let textHeight = 60; // 为文字预留更多高度

function setup() {
  // 计算动态网格布局
  let cols = floor((windowWidth - padding) / (gridSize + padding));
  let rows = ceil(riverData.getRowCount() / cols);
  let canvasHeight = rows * (gridSize + padding + textHeight) + padding;

  createCanvas(windowWidth, canvasHeight);
  background(bgColor);

  let xPos = padding;
  let yPos = padding;

  for (let i = 0; i < riverData.getRowCount(); i++) {
    let row = riverData.getRow(i);
    let item = {
      name: row.get("name"),
      country: row.get("countries"),
      length: row.getNum("length"),
      discharge: row.getNum("discharge"),
      avgTemp: row.getNum("avg_temp"),
    };

    drawGlyph(xPos, yPos, gridSize, item);

    xPos += gridSize + padding;

    // 自动换行
    if (xPos + gridSize > width) {
      xPos = padding;
      yPos += gridSize + padding + textHeight;
    }
  }
}

function drawGlyph(x, y, size, data) {
  push();
  translate(x + size / 2, y + size / 2);

  // 1. 菱形的大小表示长度（调整大小范围以突出差异）
  let diamondSize = map(data.length, 500, 7000, size * 0.2, size * 0.95);

  // 2. 菱形的颜色表示温度
  let tempColorIndex = floor(map(data.avgTemp, -20, 40, 0, baseColors.length - 1));
  fill(baseColors[tempColorIndex]);
  noStroke();

  beginShape();
  vertex(0, -diamondSize / 2);
  vertex(diamondSize / 2, 0);
  vertex(0, diamondSize / 2);
  vertex(-diamondSize / 2, 0);
  endShape(CLOSE);

  // 3. 在菱形中绘制流量相关的不规则分布点
  drawFlowDots(diamondSize, data.discharge);

  // 4. 显示河流名称和国家（自动换行）
  fill(textColor);
  textAlign(CENTER, CENTER);
  textSize(10);
  drawWrappedText(`${data.name}\n(${data.country})`, 0, size / 2 + 15, size);

  pop();
}

function drawFlowDots(diamondSize, discharge) {
  let dotCount = floor(map(discharge, 1000, 50000, 5, 50)); // 点的数量与流量相关
  fill("white");
  noStroke();

  for (let i = 0; i < dotCount; i++) {
    // 在菱形内随机生成点
    let angle = random(TWO_PI);
    let radius = random(diamondSize / 2); // 点限制在菱形的范围内
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;

    // 过滤掉点落在菱形外部的情况
    if (abs(x) + abs(y) < diamondSize / 2) {
      ellipse(x, y, 3, 3);
    }
  }
}

function drawWrappedText(content, x, y, maxWidth) {
  let lines = content.split("\n");
  let yOffset = 0;
  let lineHeight = 12;

  for (let line of lines) {
    let words = line.split(" ");
    let currentLine = "";

    for (let word of words) {
      let testLine = currentLine + word + " ";
      if (textWidth(testLine) > maxWidth) {
        text(currentLine, x, y + yOffset);
        currentLine = word + " ";
        yOffset += lineHeight;
      } else {
        currentLine = testLine;
      }
    }
    text(currentLine, x, y + yOffset);
    yOffset += lineHeight;
  }
}

// 添加屏幕大小变化的动态响应
function windowResized() {
  setup();
}
