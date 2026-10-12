import React, { useEffect, useRef } from 'react';

interface PetalsAndSparklesProps {
  burstTrigger?: number;
  interactive?: boolean;
}

export const PetalsAndSparkles: React.FC<PetalsAndSparklesProps> = ({ burstTrigger, interactive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth || 800);
    let height = (canvas.height = window.innerHeight || 600);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth || 800;
      height = canvas.height = window.innerHeight || 600;
    };
    window.addEventListener('resize', handleResize);

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      rotation: number;
      rotationSpeed: number;
      type: 'petal' | 'gold_dust';
      opacity: number;
      color: string;
      oscillationSpeed: number;
      oscillationDistance: number;
      initialX: number;
    }

    const petalColors = ['#D9534F', '#C0392B', '#E88B96', '#B8263D', '#EFA7B2', '#FADBD8'];
    const goldColors = ['#D4AF37', '#E5C378', '#F3E5AB', '#C5A059', '#FFE57F'];

    const particles: Particle[] = [];
    const maxParticles = window.innerWidth < 768 ? 24 : 45;

    const createParticle = (yRandom = true): Particle => {
      const isPetal = Math.random() > 0.45;
      const x = Math.random() * width;
      const y = yRandom ? Math.random() * height : -20;
      return {
        x,
        initialX: x,
        y,
        size: isPetal ? Math.random() * 9 + 8 : Math.random() * 3 + 1.5,
        speedY: isPetal ? Math.random() * 0.9 + 0.6 : Math.random() * 0.6 + 0.3,
        speedX: Math.random() * 0.6 - 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        type: isPetal ? 'petal' : 'gold_dust',
        opacity: Math.random() * 0.5 + 0.4,
        color: isPetal
          ? petalColors[Math.floor(Math.random() * petalColors.length)]
          : goldColors[Math.floor(Math.random() * goldColors.length)],
        oscillationSpeed: Math.random() * 0.02 + 0.01,
        oscillationDistance: Math.random() * 30 + 15,
      };
    };

    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(true));
    }

    // Burst celebration effect
    const addBurst = (count = 50) => {
      const centerX = width / 2;
      const centerY = height / 3;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 3;
        particles.push({
          x: centerX,
          initialX: centerX,
          y: centerY,
          size: Math.random() * 10 + 6,
          speedY: Math.sin(angle) * speed,
          speedX: Math.cos(angle) * speed,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.1,
          type: Math.random() > 0.4 ? 'petal' : 'gold_dust',
          opacity: 1,
          color: Math.random() > 0.5
            ? petalColors[Math.floor(Math.random() * petalColors.length)]
            : goldColors[Math.floor(Math.random() * goldColors.length)],
          oscillationSpeed: 0.02,
          oscillationDistance: 10,
        });
      }
    };

    if (burstTrigger && burstTrigger > 0) {
      addBurst(60);
    }

    let time = 0;
    const render = () => {
      time++;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x = p.initialX + Math.sin(time * p.oscillationSpeed) * p.oscillationDistance;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 25) {
          if (particles.length > maxParticles) {
            particles.splice(i, 1);
            i--;
            continue;
          } else {
            particles[i] = createParticle(false);
            continue;
          }
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        if (p.type === 'petal') {
          // Draw organic curved rose petal
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-p.size / 2, -p.size / 2, -p.size, p.size / 2, 0, p.size);
          ctx.bezierCurveTo(p.size, p.size / 2, p.size / 2, -p.size / 2, 0, 0);
          ctx.fill();

          // Subtle petal highlight
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        } else {
          // Draw sparkling golden star / dust diamond
          ctx.fillStyle = p.color;
          ctx.shadowColor = '#D4AF37';
          ctx.shadowBlur = 4;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [burstTrigger]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-10 ${interactive ? '' : 'hidden'}`}
      style={{ opacity: 0.9 }}
    />
  );
};
