import React, { useState, useEffect } from 'react';
import { X, Shield, FileText, Download, AlertTriangle, Scale, Check, Smartphone, QrCode, ExternalLink, Sparkles, Mail } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Language } from '../types';
import { translations } from '../lib/i18n';
import { DEFAULT_LEGAL_CONFIG, RESPONSIBILITY_DISCLOSURES } from '../lib/legalConfig';

interface ModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

// 1. PRIVACY MODAL
export const PrivacyModal: React.FC<ModalBaseProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;
  const isEs = language === 'es';
  const legal = DEFAULT_LEGAL_CONFIG;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FAF9F6]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-['Outfit',sans-serif] font-bold text-stone-900 text-base">
                {isEs ? 'Aviso de Privacidad y Protección de Datos' : 'Privacy Notice & Data Protection'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {isEs ? `Cumplimiento LFPDPPP (México) • Versión ${legal.version}` : `Mexican LFPDPPP Compliance • Version ${legal.version}`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          {/* Status Banner when legal entity is pending final incorporation */}
          {legal.status !== 'finalized' && (
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">
                  {isEs ? 'Aviso de Transparencia de Operación:' : 'Operational Transparency Notice:'}
                </strong>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  {isEs
                    ? 'PlayaVida opera en fase beta controlada. La figura corporativa y registro fiscal definitivo están en trámite ante fedatario en Quintana Roo. Todos los principios de protección de datos se aplican de forma rigurosa.'
                    : 'PlayaVida is operating in a controlled beta release. Formal entity incorporation and fiscal registration are in progress in Quintana Roo. All data protection safeguards are actively enforced.'}
                </p>
              </div>
            </div>
          )}

          <div className="p-3.5 bg-teal-50/70 rounded-2xl border border-teal-200/80 text-teal-900 text-xs">
            <strong>{isEs ? 'Compromiso fundamental:' : 'Core Privacy Commitment:'}</strong>{' '}
            {isEs
              ? 'PlayaVida nunca vende, renta ni comercializa datos personales de usuarios ni listas de clientes con terceros, agencias de publicidad o intermediarios.'
              : 'PlayaVida never sells, rents, or commercializes user personal data or customer lists with third parties, advertising agencies, or brokers.'}
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 text-sm">
              {isEs ? '1. Identidad y Domicilio del Responsable' : '1. Data Controller Identity'}
            </h4>
            <p>
              {isEs
                ? `${legal.legal_entity_name}, con domicilio de operaciones en ${legal.legal_domicile}, es responsable del tratamiento de los datos personales que nos proporcione conforme a la LFPDPPP.`
                : `${legal.legal_entity_name}, with operating premises in ${legal.legal_domicile}, is responsible for the processing and safekeeping of personal data.`}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 text-sm">
              {isEs ? '2. Datos que se Recaban y Finalidad' : '2. Data Collected & Purpose'}
            </h4>
            <p>
              {isEs
                ? 'Solo recabamos el correo electrónico necesario para el acceso mediante código OTP (sin contraseñas almacenadas), identificadores públicos criptográficos inmutables (ej. USR-PDC-XXXXX) y las preferencias que voluntariamente configures en tu perfil de usuario.'
                : 'We collect only the email address required for passwordless OTP sign-in, immutable cryptographic public references (e.g. USR-PDC-XXXXX), and preferences you voluntarily configure in your member profile.'}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 text-sm">
              {isEs ? '3. Protección de Canales de Contacto' : '3. Protected Business Contact Information'}
            </h4>
            <p>
              {isEs
                ? 'Para evitar robots de extracción masiva y telemercadeo invasivo, los teléfonos y números de WhatsApp de comercios locales solo se revelan mediante interacción deliberada de miembros registrados.'
                : 'To prevent bulk automated scraping and telemarketing spam, local business direct phone and WhatsApp channels are revealed only upon intentional interaction by registered community members.'}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 text-sm">
              {isEs ? '4. Ejercicio de Derechos ARCO' : '4. ARCO Rights (Access, Rectification, Cancellation, Opposition)'}
            </h4>
            <p>
              {isEs
                ? `Usted tiene derecho a conocer qué datos personales tenemos, solicitar su corrección o supresión total (Cancelación) u Oponerse al tratamiento enviando un correo a ${legal.privacy_contact_email}. Asimismo, puede descargar una copia íntegra de sus datos en formato JSON directamente desde su perfil.`
                : `You have full rights to access, rectify, cancel, or oppose data processing by contacting ${legal.privacy_contact_email}. You may also export a full JSON copy of your data directly from your member profile.`}
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold rounded-xl"
          >
            {isEs ? 'Entendido' : 'Understood'}
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. TERMS & CONDITIONS MODAL
export const TermsModal: React.FC<ModalBaseProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;
  const isEs = language === 'es';
  const legal = DEFAULT_LEGAL_CONFIG;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FAF9F6]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-['Outfit',sans-serif] font-bold text-stone-900 text-base">
                {isEs ? 'Términos y Condiciones de Uso' : 'Terms & Conditions of Service'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {isEs ? `Vigencia ${legal.version} • Riviera Maya, Quintana Roo` : `Effective ${legal.version} • Riviera Maya, Quintana Roo`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          {/* Plain-Language Responsibility Boundary Box */}
          <div className="p-3 bg-stone-100/80 rounded-2xl border border-stone-200 text-stone-800 text-xs space-y-1">
            <span className="font-bold block text-stone-900">
              {isEs ? 'Límite de Responsabilidad de la Plataforma:' : 'Platform Scope & Responsibility:'}
            </span>
            <p className="text-[11px] text-stone-600">
              {isEs ? RESPONSIBILITY_DISCLOSURES.platform_role.es : RESPONSIBILITY_DISCLOSURES.platform_role.en}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 text-sm">
              {isEs ? '1. Naturaleza del Servicio y Enlaces Externos' : '1. Directory Scope & External Links'}
            </h4>
            <p>
              {isEs
                ? 'PlayaVida es un directorio digital independiente, sistema de eventos comunitarios y programa de lealtad nativo enfocado en la Riviera Maya. Todo enlace a boletaje externo, reservas de ecoturismo o WhatsApp dirige a servicios provistos por terceros bajo sus propias políticas.'
                : 'PlayaVida is an independent community directory, local events guide, and native loyalty platform. External links to ticketing, ecotourism bookings, or WhatsApp direct users to third-party services operating under their own terms.'}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 text-sm">
              {isEs ? '2. Publicación de Comercios y Eventos' : '2. Business Directory & Events'}
            </h4>
            <p>
              {isEs
                ? 'Los comercios y organizadores locales son enteramente responsables de la veracidad de horarios, precios, aforos y ofertas publicadas. PlayaVida modera contenidos pero no garantiza la disponibilidad ni calidad de servicios ajenos.'
                : 'Local merchants and organizers bear full responsibility for the accuracy of their posted hours, prices, capacities, and offers. PlayaVida moderates listings but does not guarantee third-party fulfillment.'}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 text-sm">
              {isEs ? '3. Sistema Nativo de Lealtad' : '3. Native Loyalty Programs'}
            </h4>
            <p>
              {isEs
                ? `${RESPONSIBILITY_DISCLOSURES.loyalty_promotional.es} Los sellos y recompensas otorgados por los comercios son emitidos y honrados directamente por cada negocio de manera autónoma. PlayaVida facilita la bitácora inmutable de transacciones sin comisiones de canje.`
                : `${RESPONSIBILITY_DISCLOSURES.loyalty_promotional.en} Stamps and vouchers are awarded and redeemed directly by each respective merchant. PlayaVida provides an auditable immutable ledger and authorized staff validation with zero redemption fees.`}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 text-sm">
              {isEs ? '4. Reseñas y Moderación' : '4. Authentic Reviews & Content Moderation'}
            </h4>
            <p>
              {isEs
                ? 'Queda estrictamente prohibida la compra de reseñas, creación de perfiles falsos o difamación comercial. Cualquier usuario o negocio puede utilizar el canal universal de reporte con revisión por el equipo de moderación local.'
                : 'Review purchasing, sock-puppet accounts, and slander are strictly prohibited. Any community member may submit an auditable report through the universal reporting canal.'}
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold rounded-xl"
          >
            {isEs ? 'Aceptar y Cerrar' : 'Accept & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. INSTALL APP (PWA & GOOGLE PLAY ROADMAP) MODAL
export const InstallAppModal: React.FC<ModalBaseProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;
  const isEs = language === 'es';
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallSuccess(true);
      }
      setDeferredPrompt(null);
    } else {
      // Show manual instruction
      alert(
        isEs
          ? 'En Chrome / Android: pulsa el menú de 3 puntos (⋮) y elige "Instalar aplicación" o "Agregar a pantalla principal". En Safari / iPhone: pulsa el botón Compartir y elige "Agregar al inicio".'
          : 'In Chrome / Android: tap the 3 dots (⋮) and choose "Install App" or "Add to Home Screen". On Safari / iOS: tap the Share button and select "Add to Home Screen".'
      );
    }
  };

  const appUrl = window.location.origin;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FAF9F6]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-800 text-amber-200 flex items-center justify-center font-bold text-sm">
              PV
            </div>
            <div>
              <h3 className="font-['Outfit',sans-serif] font-bold text-stone-900 text-base">
                {isEs ? 'Instalar PlayaVida en tu Celular' : 'Install PlayaVida on your Device'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {isEs ? 'Progressive Web App (PWA) • Acceso Instantáneo' : 'Progressive Web App (PWA) • Instant Access'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 text-center">
          {/* Google Play Store Roadmap Badge */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200/80 text-left space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>{isEs ? 'Próximamente en Google Play Store' : 'Coming Soon to Google Play Store'}</span>
            </div>
            <p className="text-[11px] text-emerald-800">
              {isEs
                ? 'Estamos empaquetando esta PWA oficial como Trusted Web Activity (TWA) para la Play Store de Google México y EE.UU. Mientras tanto, instálala ya mismo con 1 click a continuación.'
                : 'This PWA is currently being prepared for the Google Play Store as a Trusted Web Activity (TWA). You can install it right now with one click below!'}
            </p>
          </div>

          {/* Real Scannable QR to open on phone */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 inline-block mx-auto">
            <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
              <QRCodeSVG value={appUrl} size={150} level="M" includeMargin />
            </div>
            <p className="text-[11px] font-mono text-stone-500 mt-2">
              {isEs ? 'Escanea con tu cámara en tu teléfono' : 'Scan with your smartphone camera'}
            </p>
          </div>

          {/* Direct Install CTA Button */}
          <div>
            <button
              onClick={handleInstallClick}
              className="w-full py-3 px-4 bg-teal-800 hover:bg-teal-900 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              <span>{installSuccess ? (isEs ? '¡Instalación completada!' : 'App Installed!') : (isEs ? 'Instalar App Directamente' : 'Install App Directly')}</span>
            </button>
          </div>

          {/* OS-specific instructions */}
          <div className="grid grid-cols-2 gap-3 text-left pt-1">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
              <span className="font-bold text-stone-900 block mb-1">Android / Chrome:</span>
              <p className="text-[11px] text-stone-600">
                {isEs
                  ? 'Menú de opciones (⋮) > "Instalar aplicación" o "Agregar a pantalla principal".'
                  : 'Menu (⋮) > "Install app" or "Add to Home screen".'}
              </p>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
              <span className="font-bold text-stone-900 block mb-1">iPhone / Safari:</span>
              <p className="text-[11px] text-stone-600">
                {isEs
                  ? 'Icono Compartir (↑) > Selecciona "Agregar al inicio".'
                  : 'Share button (↑) > Select "Add to Home Screen".'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-xl"
          >
            {isEs ? 'Cerrar' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. DISCLAIMER MODAL
export const DisclaimerModal: React.FC<ModalBaseProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;
  const isEs = language === 'es';

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FAF9F6]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-['Outfit',sans-serif] font-bold text-stone-900 text-base">
                {isEs ? 'Aviso de Deslinde de Responsabilidad' : 'Disclaimer & Community Notice'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {isEs ? 'Transparencia de Contenido e Independencia Institucional' : 'Content Transparency & Institutional Independence'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 text-sm">
              {isEs ? '1. Independencia Gubernamental' : '1. Governmental Independence'}
            </h4>
            <p>
              {isEs
                ? 'PlayaVida es una iniciativa comunitaria e hiperlocal 100% privada e independiente. No guarda afiliación ni representa al H. Ayuntamiento del Municipio de Solidaridad, al Gobierno del Estado de Quintana Roo ni a la Secretaría de Turismo (SEDETUR).'
                : 'PlayaVida is a 100% independent private community initiative. It has no governmental affiliation with the Municipality of Solidaridad, the State of Quintana Roo, or Mexico Tourism authorities.'}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 text-sm">
              {isEs ? '2. Autonomía de los Negocios Listados' : '2. Autonomy of Listed Merchants'}
            </h4>
            <p>
              {isEs
                ? 'Los precios, promociones, condiciones de servicio, menús, horarios y permisos sanitarios o municipales son responsabilidad exclusiva de cada establecimiento comercial registrado. PlayaVida no responde por cancelaciones, incumplimientos comerciales o controversias entre clientes y comercios.'
                : 'Prices, promotions, services, schedules, and municipal/sanitary licenses are the sole responsibility of each listed merchant. PlayaVida is not liable for merchant disputes or service cancellations.'}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 text-sm">
              {isEs ? '3. Actividades en Exteriores y Deportes Acuáticos' : '3. Outdoor & Water Activities'}
            </h4>
            <p>
              {isEs
                ? 'Las actividades de buceo, snorkel, cenotes, kitesurf o tours en la Riviera Maya implican riesgos inherentes a los entornos naturales. Los participantes deben asegurarse de que los operadores cuenten con guías certificados y seguros de responsabilidad civil vigentes.'
                : 'Diving, snorkeling, cenote excursions, and adventure sports carry inherent physical risks. Users must independently verify operator certifications and insurance before booking.'}
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold rounded-xl"
          >
            {isEs ? 'Entendido' : 'Understood'}
          </button>
        </div>
      </div>
    </div>
  );
};

// 5. LEGAL & COMPLIANCE MODAL
export const LegalModal: React.FC<ModalBaseProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;
  const isEs = language === 'es';

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FAF9F6]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-900 text-teal-100 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-['Outfit',sans-serif] font-bold text-stone-900 text-base">
                {isEs ? 'Marco Legal y Cumplimiento Normativo' : 'Legal & Regulatory Compliance'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {isEs ? 'Legislación Federal Mexicana • PROFECO • Propiedad Intelectual' : 'Mexican Federal Law • PROFECO • Intellectual Property'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 text-sm">
              {isEs ? '1. Cumplimiento PROFECO (Ley Federal de Protección al Consumidor)' : '1. PROFECO Consumer Protection Standards'}
            </h4>
            <p>
              {isEs
                ? 'Conforme a los artículos 76 BIS y relativos de la LFPC, las transacciones y promociones mostradas en la plataforma deben respetar precios en moneda nacional (MXN), indicar claramente restricciones y respetar los términos de las ofertas vigentes.'
                : 'Under Mexican consumer protection laws (LFPC art. 76 BIS), all offers displayed must clearly disclose pricing in Mexican Pesos (MXN) and detail any conditions or expiration dates.'}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 text-sm">
              {isEs ? '2. Propiedad Intelectual y Marcas Registradas' : '2. Intellectual Property & Trademarks'}
            </h4>
            <p>
              {isEs
                ? 'Los nombres comerciales, logotipos e imágenes pertenecen a sus respectivos titulares y se exhiben en la plataforma únicamente con fines informativos, de referencia directa y promoción local autorizada.'
                : 'Logos, trademarks, and photos remain the exclusive property of their respective owners, displayed solely for identification and local promotional directory purposes.'}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 text-sm">
              {isEs ? '3. Canales de Notificación y Retiro de Contenido' : '3. Notice & Takedown Procedure'}
            </h4>
            <p>
              {isEs
                ? 'Cualquier titular de derechos o ciudadano que considere que algún contenido infringe derechos de autor, normativas sanitarias o privacidad puede solicitar su remoción inmediata a través de legal@playavida.mx o la herramienta de Reporte Universal de la aplicación.'
                : 'Rights holders or citizens requesting content review or copyright takedowns can reach our legal team at legal@playavida.mx or use the in-app Universal Report tool.'}
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold rounded-xl"
          >
            {isEs ? 'Cerrar' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
