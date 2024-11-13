let riverdata

function preload() {
  // put preload code here
  riverdata = loadTable ("assets1/Rivers_in_the _world_Data", "csv", "header")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // put setup code here
background(255);
let margin = 20
let cols = 10;
let rows = 10;
}

function draw() {
  // put drawing code here
  for (let i = 0; i < riverData.getRowCount(); i++) {
    let row = riverdata.getRow(i);

    // 取出数据
    let length = row.getNum("length");
    let discharge = row.getNum("discharge");
    let avgTemp = row.getNum("avg_temp");
    let continent = row.getString("continent");

    // 计算位置
    let x = margin + (i % cols) * (cellWidth + margin) + cellWidth / 2;
    let y = margin + floor(i / cols) * (cellHeight + margin) + cellHeight / 2;

    push();
    translate(x, y);
    drawGlyph(length, discharge, avgTemp, continent, min(cellWidth, cellHeight) / 2);
    pop();
  }
}

// 根据河流数据绘制图案
function drawGlyph(length, discharge, avgTemp, continent, maxSize) {
  // 颜色和形状设置
  let size = map(length, 500, 7000, maxSize * 0.5, maxSize); // 基于长度设置大小
  let colorVal = map(discharge, 1000, 50000, 100, 255); // 基于流量设置颜色
  let glowSize = map(avgTemp, -20, 30, maxSize * 0.8, maxSize * 1.2); // 基于温度设置光晕大小
  let glyphColor = color(colorVal, 100, 200, 180);

  fill(glyphColor);
  noStroke();

  // 根据大陆选择形状
  if (continent === "Africa") {
    ellipse(0, 0, size, size); // 圆形表示非洲
  } else if (continent === "Asia") {
    rectMode(CENTER);
    rect(0, 0, size, size); // 正方形表示亚洲
  } else if (continent === "Europe") {
    beginShape();
    for (let i = 0; i < 5; i++) {
      let angle = map(i, 0, 5, 0, TWO_PI);
      let r = size / 2;
      vertex(cos(angle) * r, sin(angle) * r);
    }
    endShape(CLOSE); // 五边形表示欧洲
  } else if (continent === "South America") {
    triangle(0, -size / 2, -size / 2, size / 2, size / 2, size / 2); // 三角形表示南美
  } else {
    ellipse(0, 0, size, size / 1.5); // 椭圆表示其他区域
  }

  // 绘制光晕效果
  drawGlow(glowSize);
}

// 绘制光晕效果
function drawGlow(radius) {
  for (let i = 5; i > 0; i--) {
    fill(255, 200, 0, map(i, 1, 5, 50, 10));
    ellipse(0, 0, radius * i * 0.4);
  }
}
