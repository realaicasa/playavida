import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  QrCode,
  Search,
  Sparkles,
  ArrowRight,
  Building2,
  Calendar,
  Users,
  Award,
  Camera,
  CameraOff,
  RefreshCw,
  ScanLine,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Language } from '../types';

interface QuickLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onNavigateToRef: (ref: string) => void;
}

export const QuickLookupModal: React.FC<QuickLookupModalProps> = ({
  isOpen,
  onClose,
  language,
  onNavigateToRef,
}) => {
  if (!isOpen) return null;

  const isEs = language === 'es';
  const [activeMode, setActiveMode] = useState<'camera' | 'manual'>('camera');
  const [inputRef, setInputRef] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const sampleRefs = [
    {
      code: 'BUS-PDC-001',
      label: 'Café Choux Choux (Negocio)',
      type: 'business',
      icon: Building2,
    },
    {
      code: 'EVT-PDC-001',
      label: 'Noche de Salsa en la Playa (Evento)',
      type: 'event',
      icon: Calendar,
    },
    {
      code: 'GRP-PDC-001',
      label: 'Riviera Maya Tech & Nomads (Grupo)',
      type: 'group',
      icon: Users,
    },
    {
      code: 'LOY-PDC-001',
      label: 'Café Choux Choux Pass (Lealtad)',
      type: 'loyalty',
      icon: Award,
    },
  ];

  // Stop camera stream utility
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Start live camera stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser context.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Live camera access:', err);
      setCameraError(
        isEs
          ? 'No se pudo acceder a la cámara (permiso denegado o no disponible en este dispositivo).'
          : 'Could not access camera (permission denied or unavailable on this device).'
      );
      setCameraActive(false);
    }
  };

  useEffect(() => {
    if (activeMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeMode]);

  const handleLookup = (codeToTest?: string) => {
    const raw = (codeToTest || inputRef).trim();
    if (!raw) {
      setErrorMsg(isEs ? 'Por favor ingresa un código de referencia.' : 'Please enter a reference code.');
      return;
    }

    // Extract reference if full URL was pasted
    let cleanRef = raw;
    if (raw.includes('ref=')) {
      const match = raw.match(/ref=([A-Za-z0-9-_]+)/);
      if (match && match[1]) {
        cleanRef = match[1];
      }
    }

    cleanRef = cleanRef.toUpperCase();

    // Verify if it starts with valid prefix
    if (
      cleanRef.startsWith('BUS-') ||
      cleanRef.startsWith('EVT-') ||
      cleanRef.startsWith('GRP-') ||
      cleanRef.startsWith('LOY-')
    ) {
      setErrorMsg('');
      stopCamera();
      onClose();
      onNavigateToRef(cleanRef);
    } else {
      setErrorMsg(
        isEs
          ? 'Código no reconocido. Debe comenzar con BUS-, EVT-, GRP- o LOY-.'
          : 'Invalid reference. Must start with BUS-, EVT-, GRP-, or LOY-.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-stone-200 overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200/60 shadow-2xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-stone-900">
                {isEs ? 'Visor QR & Referencias' : 'QR Viewfinder & Reference Lookup'}
              </h3>
              <p className="text-xs text-stone-500">
                {isEs ? 'Escanea con tu cámara o ingresa código' : 'Scan with camera or type code'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="px-6 pt-4">
          <div className="flex bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs font-semibold">
            <button
              onClick={() => setActiveMode('camera')}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
                activeMode === 'camera'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-teal-700" />
              <span>{isEs ? 'Cámara en Vivo' : 'Live Camera'}</span>
            </button>
            <button
              onClick={() => setActiveMode('manual')}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
                activeMode === 'manual'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-teal-700" />
              <span>{isEs ? 'Ingreso Manual' : 'Manual Code'}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {activeMode === 'camera' ? (
            <div className="space-y-4">
              {/* Camera Video Viewport */}
              <div className="relative w-full h-64 bg-stone-950 rounded-2xl overflow-hidden border-2 border-stone-800 flex items-center justify-center shadow-inner">
                {cameraActive ? (
                  <>
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {/* Viewfinder Target Framing & Laser line */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-teal-400/80 rounded-2xl relative shadow-[0_0_20px_rgba(20,184,166,0.3)]">
                        {/* Corner Accents */}
                        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-teal-300" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-teal-300" />
                        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-teal-300" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-teal-300" />

                        {/* Animated Laser Scanning Line */}
                        <motion.div
                          animate={{ y: [0, 180, 0] }}
                          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                          className="w-full h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_8px_#2dd4bf]"
                        />
                      </div>
                    </div>
                    <div className="absolute bottom-3 py-1 px-3 bg-black/60 backdrop-blur-md rounded-full text-[11px] font-medium text-white/90">
                      {isEs ? 'Apunta al código QR para escanear' : 'Align QR code within the frame'}
                    </div>
                  </>
                ) : (
                  <div className="p-6 text-center text-stone-300 space-y-3">
                    <CameraOff className="w-10 h-10 mx-auto text-stone-500" />
                    <p className="text-xs text-stone-300 font-medium leading-relaxed">
                      {cameraError ||
                        (isEs
                          ? 'Iniciando sensor de cámara...'
                          : 'Starting camera sensor...')}
                    </p>
                    <button
                      onClick={startCamera}
                      className="py-1.5 px-3 bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold rounded-lg border border-stone-700 flex items-center gap-1.5 mx-auto"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{isEs ? 'Reintentar Cámara' : 'Retry Camera'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Quick simulation / test scan triggers for testing */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  {isEs ? 'O simula escaneo de código rápido:' : 'Or simulate instant code detection:'}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {sampleRefs.slice(0, 2).map((item) => (
                    <button
                      key={item.code}
                      onClick={() => handleLookup(item.code)}
                      className="p-2.5 bg-stone-50 hover:bg-teal-50 border border-stone-200 hover:border-teal-300 rounded-xl text-left transition-all group"
                    >
                      <div className="text-xs font-bold text-stone-900 group-hover:text-teal-800 font-mono">
                        {item.code}
                      </div>
                      <div className="text-[10px] text-stone-500 line-clamp-1">{item.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  {isEs ? 'Código de Referencia o URL' : 'Reference Code or Link'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={inputRef}
                    onChange={(e) => {
                      setInputRef(e.target.value);
                      setErrorMsg('');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                    placeholder="BUS-PDC-001, EVT-PDC-001, GRP-PDC-001..."
                    className="w-full px-4 py-3 bg-stone-50 hover:bg-stone-100/60 focus:bg-white text-sm font-mono border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all uppercase"
                  />
                  <button
                    onClick={() => handleLookup()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 py-1.5 px-3 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <span>{isEs ? 'Ir' : 'Go'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {errorMsg && (
                  <div className="mt-2 text-xs text-rose-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </div>

              {/* Sample Quick Links */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  {isEs ? 'Ejemplos para probar:' : 'Click to test instant lookup:'}
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {sampleRefs.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.code}
                        onClick={() => handleLookup(item.code)}
                        className="p-3 bg-stone-50 hover:bg-teal-50/70 border border-stone-200 hover:border-teal-300 rounded-xl flex items-center justify-between text-left transition-all group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 group-hover:text-teal-700">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-stone-900 group-hover:text-teal-800 font-mono">
                              {item.code}
                            </div>
                            <div className="text-[11px] text-stone-500">{item.label}</div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-teal-700 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
