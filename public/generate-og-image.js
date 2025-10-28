const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// Canvas dimensions for Open Graph
const WIDTH = 1200;
const HEIGHT = 630;

// Create canvas
const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');

// Color scheme - Professional blues and grays
const colors = {
  primary: '#1e3a8a', // Deep blue
  secondary: '#3b82f6', // Bright blue
  accent: '#60a5fa', // Light blue
  dark: '#1f2937', // Dark gray
  light: '#f3f4f6', // Light gray
  white: '#ffffff',
  gradient1: '#0f172a', // Slate 900
  gradient2: '#1e40af', // Blue 700
  gradient3: '#3b82f6', // Blue 500
};

// Create gradient background
const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
gradient.addColorStop(0, colors.gradient1);
gradient.addColorStop(0.5, colors.gradient2);
gradient.addColorStop(1, colors.gradient3);
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, WIDTH, HEIGHT);

// Add subtle pattern overlay
ctx.globalAlpha = 0.05;
for (let i = 0; i < 50; i++) {
  const x = Math.random() * WIDTH;
  const y = Math.random() * HEIGHT;
  const size = Math.random() * 100 + 50;
  ctx.fillStyle = colors.white;
  ctx.fillRect(x, y, size, 2);
  ctx.fillRect(x, y, 2, size);
}
ctx.globalAlpha = 1;

// Create visual metaphor - Gap/Divide with contrasting sides
const centerX = WIDTH / 2;
const gapWidth = 20;

// Left side - "Perception" (darker)
ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
ctx.fillRect(50, 150, centerX - gapWidth / 2 - 100, 330);

// Right side - "Reality" (lighter)
ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
ctx.fillRect(centerX + gapWidth / 2 + 50, 150, centerX - gapWidth / 2 - 100, 330);

// Draw the gap in the middle with glow effect
ctx.shadowColor = colors.accent;
ctx.shadowBlur = 30;
ctx.fillStyle = colors.white;
ctx.fillRect(centerX - gapWidth / 2, 140, gapWidth, 350);
ctx.shadowBlur = 0;

// Add "PERCEPTION" and "REALITY" labels
ctx.font = 'bold 20px Arial, sans-serif';
ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
ctx.textAlign = 'center';
ctx.fillText('PERCEPTION', centerX / 2, 200);
ctx.fillText('REALITY', centerX + centerX / 2, 200);

// Draw Socially Square branding at top
ctx.font = 'bold 32px Arial, sans-serif';
ctx.fillStyle = colors.white;
ctx.textAlign = 'left';
ctx.fillText('SOCIALLY SQUARE', 60, 80);

// Add small subtitle for branding
ctx.font = '18px Arial, sans-serif';
ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
ctx.fillText('Marketing Intelligence', 60, 110);

// Main headline - "Discover Your Marketing Blind Spots"
ctx.font = 'bold 64px Arial, sans-serif';
ctx.fillStyle = colors.white;
ctx.textAlign = 'center';
ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
ctx.shadowBlur = 20;
ctx.shadowOffsetY = 4;

const headline = 'Discover Your';
const headline2 = 'Marketing Blind Spots';
ctx.fillText(headline, centerX, 300);
ctx.fillText(headline2, centerX, 370);

// Subheading
ctx.font = '28px Arial, sans-serif';
ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
ctx.shadowBlur = 10;
const subheading1 = 'Is there a gap between what you think';
const subheading2 = 'and reality in SEO & AEO?';
ctx.fillText(subheading1, centerX, 430);
ctx.fillText(subheading2, centerX, 465);

ctx.shadowBlur = 0;
ctx.shadowOffsetY = 0;

// Call-to-action button
const buttonWidth = 400;
const buttonHeight = 70;
const buttonX = centerX - buttonWidth / 2;
const buttonY = 520;
const borderRadius = 35;

// Button shadow
ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
ctx.shadowBlur = 15;
ctx.shadowOffsetY = 5;

// Button background with gradient
const buttonGradient = ctx.createLinearGradient(buttonX, buttonY, buttonX, buttonY + buttonHeight);
buttonGradient.addColorStop(0, '#fbbf24'); // Amber 400
buttonGradient.addColorStop(1, '#f59e0b'); // Amber 500
ctx.fillStyle = buttonGradient;

// Draw rounded rectangle for button
ctx.beginPath();
ctx.moveTo(buttonX + borderRadius, buttonY);
ctx.lineTo(buttonX + buttonWidth - borderRadius, buttonY);
ctx.quadraticCurveTo(buttonX + buttonWidth, buttonY, buttonX + buttonWidth, buttonY + borderRadius);
ctx.lineTo(buttonX + buttonWidth, buttonY + buttonHeight - borderRadius);
ctx.quadraticCurveTo(buttonX + buttonWidth, buttonY + buttonHeight, buttonX + buttonWidth - borderRadius, buttonY + buttonHeight);
ctx.lineTo(buttonX + borderRadius, buttonY + buttonHeight);
ctx.quadraticCurveTo(buttonX, buttonY + buttonHeight, buttonX, buttonY + buttonHeight - borderRadius);
ctx.lineTo(buttonX, buttonY + borderRadius);
ctx.quadraticCurveTo(buttonX, buttonY, buttonX + borderRadius, buttonY);
ctx.closePath();
ctx.fill();

ctx.shadowBlur = 0;
ctx.shadowOffsetY = 0;

// Button text
ctx.font = 'bold 32px Arial, sans-serif';
ctx.fillStyle = colors.gradient1;
ctx.textAlign = 'center';
ctx.fillText('Take the 60-Second Quiz', centerX, buttonY + 47);

// Add arrow icon to button
ctx.font = 'bold 32px Arial, sans-serif';
ctx.fillText('→', centerX + 185, buttonY + 47);

// Save to PNG
const buffer = canvas.toBuffer('image/png');
const outputPath = path.join(__dirname, 'og-image.png');
fs.writeFileSync(outputPath, buffer);

console.log(`OG image created successfully at: ${outputPath}`);
