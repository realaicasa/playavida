import { LegalConfiguration, TrustBadgeInfo, TrustBadgeType, EnvironmentalNotice, Language } from '../types';

/**
 * Centralized Legal Configuration for PlayaVida.
 * In accordance with Mexican legal framework (LFPDPPP & PROFECO) and Prompt 1:
 * If legal fields are pending, we flag them clearly rather than fabricating entities.
 */
export const DEFAULT_LEGAL_CONFIG: LegalConfiguration = {
  legal_entity_name: 'PlayaVida Riviera Maya (Operador en Proceso de Registro)',
  legal_entity_type: 'Sociedad en Constitución / Entity Pending Registration',
  legal_domicile: 'Playa del Carmen, Solidaridad, Quintana Roo, México',
  tax_id: undefined, // RFC pending final registration
  privacy_contact_email: 'privacidad@playavida.mx',
  data_protection_contact: 'Oficial de Privacidad y Cumplimiento ARCO',
  support_email: 'soporte@playavida.mx',
  support_url: 'https://playavida.mx/soporte',
  privacy_notice_url: 'https://playavida.mx/aviso-de-privacidad',
  terms_url: 'https://playavida.mx/terminos',
  community_guidelines_url: 'https://playavida.mx/reglas-comunitarias',
  loyalty_terms_url: 'https://playavida.mx/terminos-lealtad',
  accessibility_statement_url: 'https://playavida.mx/accesibilidad',
  status: 'under_review',
  version: '2026.1-beta',
  effective_at: '2026-09-01',
  last_reviewed_at: '2026-09-19',
};

/**
 * Trust Badge definitions mapping to explicit, documented statuses.
 * Strictly avoids unverified marketing claims like 'Guaranteed', 'Official', or 'Safe'.
 */
export const TRUST_BADGE_DEFINITIONS: Record<TrustBadgeType, TrustBadgeInfo> = {
  business_managed: {
    type: 'business_managed',
    label_es: 'Gestionado por el Negocio',
    label_en: 'Business-Managed',
    explanation_es: 'Información, fotos y horarios actualizados directamente por los propietarios o encargados del comercio.',
    explanation_en: 'Information, photos, and hours updated directly by the merchant owners or managers.',
  },
  organizer_managed: {
    type: 'organizer_managed',
    label_es: 'Gestionado por el Organizador',
    label_en: 'Organizer-Managed',
    explanation_es: 'Evento publicado y supervisado directamente por sus organizadores o anfitriones oficiales.',
    explanation_en: 'Event published and maintained directly by the designated event organizers.',
  },
  community_reported: {
    type: 'community_reported',
    label_es: 'Reportado por la Comunidad',
    label_en: 'Community-Reported',
    explanation_es: 'Aportación colectiva de habitantes locales. Sujeto a cambios y verificación independiente.',
    explanation_en: 'Crowdsourced by local community members. Subject to change and independent review.',
  },
  recently_confirmed: {
    type: 'recently_confirmed',
    label_es: 'Recientemente Confirmado',
    label_en: 'Recently Confirmed',
    explanation_es: 'Horarios, ubicación o actividad reconfirmados por miembros de la comunidad en los últimos 30 días.',
    explanation_en: 'Hours, location, or activity reconfirmed by community members within the last 30 days.',
  },
  approximate_location: {
    type: 'approximate_location',
    label_es: 'Ubicación Aproximada',
    label_en: 'Approximate Location',
    explanation_es: 'Coordenadas referenciales en zona costera o cenote. Consulte señalamientos directos antes de arribar.',
    explanation_en: 'Approximate coastal or cenote coordinates. Check direct local signage prior to arrival.',
  },
  external_ticketing: {
    type: 'external_ticketing',
    label_es: 'Boletaje Externo',
    label_en: 'External Ticketing',
    explanation_es: 'La reserva y cobro se realizan en la plataforma externa del proveedor. PlayaVida no procesa fondos.',
    explanation_en: 'Reservations and payments are handled on the external provider site. PlayaVida does not process funds.',
  },
  sponsored: {
    type: 'sponsored',
    label_es: 'Destacado / Patrocinado',
    label_en: 'Featured / Sponsored',
    explanation_es: 'Espacio patrocinado con fines de difusión comunitaria. No implica evaluación de calidad.',
    explanation_en: 'Sponsored listing for promotional discovery. Does not constitute a quality endorsement.',
  },
  machine_translated: {
    type: 'machine_translated',
    label_es: 'Traducción Automatizada',
    label_en: 'Machine-Translated',
    explanation_es: 'Texto traducido automáticamente. En caso de discrepancia, prevalece el idioma original.',
    explanation_en: 'Automated translation. In case of discrepancies, the original source text takes precedence.',
  },
};

/**
 * Responsibility boundary disclosures
 */
export const RESPONSIBILITY_DISCLOSURES = {
  platform_role: {
    es: 'PlayaVida es una plataforma comunitaria de información y directorio hiperlocal. No operamos comercios, eventos ni tours de terceros.',
    en: 'PlayaVida is an informational community directory and hyperlocal discovery platform. We do not operate third-party merchants, events, or tours.',
  },
  external_link: {
    es: 'Al hacer clic será redirigido al sitio web del proveedor. Las condiciones, cobros y cancelaciones se rigen por las políticas externas de dicho sitio.',
    en: 'Clicking this link will direct you to the external provider website. Bookings, pricing, and cancellations are governed by their respective third-party terms.',
  },
  environmental_notice: {
    es: 'Las regulaciones ambientales en áreas naturales protegidas (CONANP/SEMARNAT) varían por temporada y zona. Verifique siempre los requisitos vigentes.',
    en: 'Environmental regulations in protected natural areas (CONANP/SEMARNAT) vary by season and sector. Always verify current local requirements.',
  },
  loyalty_promotional: {
    es: 'Los sellos y recompensas son iniciativas promocionales de cada comercio sin valor monetario canjeable por efectivo.',
    en: 'Loyalty stamps and rewards are merchant promotional programs with no cash or monetary redemption value against PlayaVida.',
  },
};

/**
 * Curated environmental notices for Riviera Maya protected marine & coastal zones
 */
export const SAMPLE_ENVIRONMENTAL_NOTICES: EnvironmentalNotice[] = [
  {
    id: 'ENV-AKU-TURTLES',
    title_es: 'Santuario Marino de Bahía de Akumal (CONANP)',
    title_en: 'Akumal Bay Marine Sanctuary (CONANP)',
    content_es: 'Área de Refugio para la Protección de Especies Marinas. El nado con tortugas marinas requiere guía certificado acreditado por CONANP, chaleco salvavidas obligatorio y uso estricto de protectores solares 100% biodegradables y libres de oxibenzona.',
    content_en: 'Protected Marine Species Refuge. Swimming with sea turtles requires a certified CONANP-accredited guide, mandatory life jackets, and exclusively 100% reef-safe, oxybenzone-free biodegradable sunscreen.',
    applicable_location: 'AKU',
    applicable_activity: 'marine_wildlife',
    source_label: 'CONANP / SEMARNAT México',
    source_url: 'https://www.gob.mx/conanp',
    last_reviewed_at: '2026-08-15',
    review_due_at: '2026-11-15',
    responsible_editor: 'Comité Ambiental Comunitario',
  },
  {
    id: 'ENV-PM-REEF',
    title_es: 'Parque Nacional Arrecife de Puerto Morelos',
    title_en: 'Puerto Morelos Reef National Park',
    content_es: 'Parte del Sistema Arrecifal Mesoamericano. Prohibido tocar formaciones coralinas, extraer fauna marina o conchas. Respete el brazalete oficial de conservación de la CONANP proporcionado por su embarcación autorizada.',
    content_en: 'Part of the Mesoamerican Barrier Reef. Touching corals or collecting marine organisms and shells is strictly prohibited. Keep your official CONANP conservation wristband provided by authorized boats.',
    applicable_location: 'PM',
    applicable_activity: 'reef',
    source_label: 'Parque Nacional Arrecife de Puerto Morelos',
    source_url: 'https://www.gob.mx/conanp',
    last_reviewed_at: '2026-07-20',
    review_due_at: '2026-10-20',
    responsible_editor: 'Comité Ambiental Comunitario',
  },
];
