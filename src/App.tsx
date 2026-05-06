/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  MessageCircle, 
  Navigation, 
  ChevronDown,
  ExternalLink,
  Music2,
  Music
} from 'lucide-react';

const ASSETS = {
  flyer: 'https://res.cloudinary.com/dcnynnstm/image/upload/v1778103290/fFLYER_rl7c08.jpg',
  logoVideo: 'https://res.cloudinary.com/dcnynnstm/video/upload/v1778103364/logo_wgmo3v.mp4',
  logoStatic: 'https://res.cloudinary.com/dcnynnstm/image/upload/v1778103424/logo_bar_t3peko.jpg',
  locationUrl: 'https://maps.app.goo.gl/eRvcWnBveFjHqAHz6',
  whatsappUrl: 'https://wa.me/51925782415',
  eventDate: new Date('2026-05-06T18:00:00'),
  bgVideos: [
    'https://res.cloudinary.com/dcnynnstm/video/upload/v1778104314/NUEVO_01_qpve8d.mp4',
    'https://res.cloudinary.com/dcnynnstm/video/upload/v1778104394/Encuentra_tragos_discoteca_en_TikTok_-_Busca_contenido_en_TikTok_2_f8kzuc.mp4',
    'https://res.cloudinary.com/dcnynnstm/video/upload/v1778104402/CAMBIO_03_zjhchw.mp4',
    'https://res.cloudinary.com/dcnynnstm/video/upload/v1778104420/CAMBIO_04_tygsbx.mp4'
  ]
};

// --- Components ---

const VideoBackground = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % ASSETS.bgVideos.length);
  };

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentVideoIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <video
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            className="w-full h-full object-cover brightness-[0.4] contrast-125 saturate-150"
          >
            <source src={ASSETS.bgVideos[currentVideoIndex]} type="video/mp4" />
          </video>
        </motion.div>
      </AnimatePresence>
      {/* Dark persistent overlay */}
      <div className="absolute inset-0 bg-black/40 z-1" />
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80 z-2" />
    </div>
  );
};

const NeonText = ({ children, className = "", color = "blue" }: { children: React.ReactNode, className?: string, color?: "blue" | "orange" }) => {
  const glowClass = color === "blue" ? "text-brand-blue glow-blue" : "text-brand-orange glow-orange";

  return (
    <motion.span 
      initial={{ opacity: 0.5 }}
      animate={{ 
        opacity: [0.5, 1, 0.8, 1, 0.4, 1],
        scale: [1, 1.02, 1, 1.01, 1],
      }}
      transition={{ 
        duration: 2, 
        repeat: Infinity, 
        times: [0, 0.1, 0.2, 0.3, 0.4, 1],
        ease: "easeInOut"
      }}
      className={`${glowClass} ${className}`}
    >
      {children}
    </motion.span>
  );
};

const CustomButton = ({ onClick, children, icon: Icon, className = "", primary = false, whatsapp = false }: any) => (
  <motion.button
    whileHover={{ scale: 1.05, boxShadow: whatsapp ? "0 0 20px rgba(255, 157, 0, 0.4)" : "0 0 20px rgba(0, 210, 255, 0.4)" }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
      whatsapp 
      ? "bg-brand-orange text-black hover:bg-orange-400"
      : primary 
        ? "bg-brand-blue text-black hover:bg-cyan-400" 
        : "bg-transparent border-2 border-brand-blue text-brand-blue hover:bg-brand-blue/10"
    } ${className}`}
  >
    {Icon && <Icon size={20} />}
    {children}
  </motion.button>
);

const Countdown = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const Item = ({ value, label }: any) => (
    <div className="countdown-box">
      <span className="block text-3xl font-black text-white">{value.toString().padStart(2, '0')}</span>
      <span className="text-[10px] uppercase tracking-widest text-white/40 mt-1">{label}</span>
    </div>
  );

  return (
    <div className="flex gap-3 justify-center items-center">
      <Item value={timeLeft.days} label="Días" />
      <Item value={timeLeft.hours} label="Horas" />
      <Item value={timeLeft.minutes} label="Min" />
      <Item value={timeLeft.seconds} label="Seg" />
    </div>
  );
};

export default function App() {
  const [isIntroFinished, setIsIntroFinished] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const logoScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.7]);

  // Handle Intro Timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsIntroFinished(true);
    }, 5500); // Intro video duration approx
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-main text-white font-sans overflow-x-hidden selection:bg-brand-blue/30">
      
      <VideoBackground />

      {/* Intro Layer */}
      <AnimatePresence>
        {!isIntroFinished && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          >
            <video 
              autoPlay 
              muted 
              playsInline 
              onEnded={() => setIsIntroFinished(true)}
              className="max-w-[90%] md:max-w-2xl"
            >
              <source src={ASSETS.logoVideo} type="video/mp4" />
            </video>
          </motion.div>
        )}
      </AnimatePresence>

      <main ref={containerRef} className="relative z-10">
        
        {/* Animated Particles Over Video */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden h-screen z-5">
          {/* Animated Particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-brand-blue rounded-full opacity-20"
              animate={{
                y: [-20, 1200],
                x: [Math.random() * 100 + "%", (Math.random() * 100 - 50) + "%"],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 5,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `-5%`,
              }}
            />
          ))}
          {/* Smoke/Vapor Effect */}
          <motion.div 
            className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-brand-blue/10 to-transparent blur-3xl opacity-30"
            animate={{ 
              scaleY: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Floating Logo Header (Immersive Style) */}
        <header className="fixed top-0 left-0 w-full z-40 p-6 md:p-8 flex justify-between items-center pointer-events-none">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-4 pointer-events-auto"
          >
            <img src={ASSETS.logoStatic} alt="Logo" className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-brand-blue shadow-[0_0_15px_rgba(0,210,255,0.5)]" />
            <div className="hidden md:flex flex-col">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-blue">Inauguración Oficial</span>
              <span className="text-lg font-black tracking-tight">TIEMPO EXTRA</span>
            </div>
          </motion.div>
          
          <motion.div 
             initial={{ x: 20, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             className="pointer-events-auto hidden md:flex gap-6 items-center"
          >
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Confirmación WhatsApp</p>
              <p className="text-sm font-bold text-brand-orange">+51 925 782 415</p>
            </div>
            <CustomButton 
              whatsapp
              onClick={() => window.open(ASSETS.whatsappUrl, '_blank')}
            >
              Confirmar
            </CustomButton>
          </motion.div>
        </header>

        {/* --- Hero Section --- */}
        <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-2"
          >
            <NeonText color="orange" className="text-xl md:text-2xl font-bold tracking-[0.4em] uppercase font-display">
              Bar & Licorería
            </NeonText>
          </motion.div>

          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-9xl font-black tracking-tighter mb-4"
          >
            <NeonText className="block">TIEMPO EXTRA</NeonText>
          </motion.h1>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm md:text-lg font-light text-white/40 tracking-[0.3em] mb-12 uppercase italic"
          >
            ¡La Mejor Experiencia Nocturna de la Ciudad!
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10"
          >
            <ChevronDown size={32} className="text-brand-blue" />
          </motion.div>
        </section>

        {/* --- Event Info Section --- */}
        <section className="relative py-24 px-6 max-w-4xl mx-auto space-y-24">
          
          {/* Countdown & Date */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <div className="inline-block px-4 py-1 rounded-full border border-brand-orange/50 bg-brand-orange/10 text-brand-orange text-[10px] font-bold uppercase tracking-widest">
              Gran Inauguración
            </div>
            
            <Countdown targetDate={ASSETS.eventDate} />
            
            <div className="glass p-8 rounded-3xl border-l-[3px] border-brand-blue space-y-8 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-2">Cuándo</p>
                  <p className="text-xl font-bold font-display">SÁBADO 06 DE MAYO</p>
                  <p className="text-sm text-brand-blue">06:00 PM - LATE NIGHT</p>
                </div>
                <div className="md:border-l border-white/10 space-y-1 md:pl-8">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-2">Dónde</p>
                  <p className="text-xl font-bold font-display uppercase leading-tight">BELLA VISTA ALTA</p>
                  <p className="text-sm text-brand-orange leading-none mt-1 uppercase">FONAVI, CIUDAD</p>
                </div>
              </div>

              <CustomButton 
                onClick={() => window.open(ASSETS.locationUrl, '_blank')}
                icon={Navigation}
                primary
                className="w-full"
              >
                Abrir Mapa en Google
              </CustomButton>
            </div>
          </motion.div>

          {/* Flyer Presentation */}
          <div className="relative group max-w-md mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 3 }}
              viewport={{ once: true }}
              className="relative z-10 flyer-shadow rounded-2xl overflow-hidden border border-white/20 transform-gpu"
            >
              <img 
                src={ASSETS.flyer} 
                alt="Evento Flyer" 
                className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-0 inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            </motion.div>
            
            {/* Tag from theme */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-6 -right-6 z-20 glass p-4 rounded-2xl border border-brand-orange/30 shadow-2xl"
            >
              <p className="text-xs font-bold text-brand-orange uppercase tracking-tighter">Acceso Exclusivo</p>
              <p className="text-[10px] text-white/60">Capacidad Limitada</p>
            </motion.div>
          </div>

          {/* Location Section */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 flex flex-col md:flex-row items-center gap-8"
          >
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2 text-cyan-400">
                <MapPin size={24} />
                <span className="font-bold uppercase tracking-widest text-sm">Nuestra Ubicación</span>
              </div>
              <h3 className="text-3xl font-black">BELLA VISTA ALTA - FONAVI</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                Te esperamos en el punto más vibrante del vecindario para celebrar una noche inolvidable.
              </p>
              <CustomButton 
                onClick={() => window.open(ASSETS.locationUrl, '_blank')}
                icon={Navigation}
                primary
              >
                ¿Cómo llegar?
              </CustomButton>
            </div>
            <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden border border-cyan-500/30">
               <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11432.846549283737!2d-78.4721471!3d-9.0838181!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMDUnMDEuNyJTIDc4wrAyOCcyNy43Ilc!5e0!3m2!1ses!2spe!4v1715000000000!5m2!1ses!2spe" 
                className="w-full h-full grayscale invert opacity-50 contrast-125"
                loading="lazy"
              ></iframe>
            </div>
          </motion.div>

          {/* Confirmation Section */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-12 px-6 bg-gradient-to-b from-cyan-950/20 to-transparent rounded-[3rem] border border-cyan-500/20"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              ¿LISTO PARA <br />
              <NeonText color="orange">VIVIR LA EXPERIENCIA?</NeonText>
            </h2>
            <p className="text-gray-400 mb-10 max-w-md mx-auto">
              Confirma tu asistencia ahora y asegura tu lugar en la fiesta más exclusiva.
            </p>
            <div className="flex flex-col items-center gap-4">
              <CustomButton 
                onClick={() => window.open(ASSETS.whatsappUrl, '_blank')}
                icon={MessageCircle}
                className="w-full md:w-auto"
              >
                Confirmar Asistencia
              </CustomButton>
              <span className="text-xs text-gray-500 italic">Clic para ir a WhatsApp</span>
            </div>
          </motion.div>

        </section>

        {/* --- Footer --- */}
        <footer className="relative mt-24 py-12 px-6 border-t border-white/5">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-end gap-12">
            <div className="flex flex-wrap justify-center md:justify-start gap-8 text-[10px] tracking-[0.3em] uppercase text-white/30">
              <div className="flex flex-col">
                <span className="text-white/60 mb-1">Música</span>
                <span>Electrónica / Lounge</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white/60 mb-1">Dress Code</span>
                <span>Elegante Nocturno</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white/60 mb-1">Experience</span>
                <span>Mixología Premium</span>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-4xl font-black italic tracking-tighter leading-none mb-4 glow-white">TE ESPERAMOS</p>
              <p className="text-[9px] text-white/20 uppercase tracking-[0.5em]">
                © 2026 TIEMPO EXTRA - PROHIBIDA LA VENTA A MENORES DE EDAD
              </p>
            </div>
          </div>
        </footer>

        {/* Mobile Sticky CTA */}
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 6 }}
          className="fixed bottom-6 right-6 z-50 md:hidden"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.open(ASSETS.whatsappUrl, '_blank')}
            className="w-16 h-16 bg-brand-orange text-black rounded-full flex items-center justify-center shadow-lg shadow-brand-orange/40"
          >
            <MessageCircle size={32} />
          </motion.button>
        </motion.div>

      </main>
    </div>
  );
}
