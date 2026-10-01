import React, { createContext, useContext, useState, useEffect } from 'react';

const I18nContext = createContext(null);

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', dir: 'ltr' },
  { code: 'es', name: 'Spanish', native: 'Español', dir: 'ltr' },
  { code: 'fr', name: 'French', native: 'Français', dir: 'ltr' },
  { code: 'de', name: 'German', native: 'Deutsch', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', native: 'العربية', dir: 'rtl' },
  { code: 'ja', name: 'Japanese', native: '日本語', dir: 'ltr' },
];

export const TRANSLATIONS = {
  en: {
    // Nav
    nav_dashboard: 'Dashboard',
    nav_new_request: 'New Request',
    nav_approvals: 'Approvals',
    nav_orders: 'Orders',
    nav_analytics: 'Analytics',
    nav_employees: 'Employees',
    nav_tasks: 'Tasks',
    nav_audit_log: 'Audit Log',
    nav_ai_workflows: 'AI Workflows',
    nav_lighting_modes: 'Lighting Modes',
    nav_role: 'Role',
    nav_sign_in: 'Sign In',
    nav_get_started: 'Get Started',
    nav_settings: 'Settings',
    nav_sign_out: 'Sign Out',
    nav_replay_intro: 'Replay Intro Animation',
    
    // Statuses
    status_pending: 'Pending',
    status_accepted: 'Accepted',
    status_denied: 'Denied',
    status_in_progress: 'In Progress',
    status_completed: 'Completed',
    status_all: 'All',

    // Common actions
    action_create_order: 'Create Order',
    action_view_details: 'View Details',
    action_accept: 'Accept',
    action_deny: 'Deny',
    action_complete: 'Complete',
    action_mark_completed: 'Mark as Completed',
    action_download_summary: 'Download Summary',
    action_search: 'Search...',
    action_export: 'Export',
    action_filter: 'Filter',
    action_clear_filters: 'Clear Filters',
    action_close: 'Close',
    action_cancel: 'Cancel',
    action_confirm: 'Confirm',
    action_submit: 'Submit Request',
    action_add_employee: 'Add Employee',
    action_start_workflow: 'Start a Workflow',
    action_book_demo: 'Book a Demo',
    action_explore_how: 'Explore How It Works',
    action_go_dashboard: 'Go to Dashboard',

    // Orders page
    orders_title: 'Orders',
    orders_subtitle: 'Monitor, approve, and track workflow-related orders from submission to completion.',
    orders_pending_card: 'Pending Orders',
    orders_accepted_card: 'Accepted Orders',
    orders_denied_card: 'Denied Orders',
    orders_in_progress_card: 'Orders in Progress',
    orders_completed_card: 'Completed Orders',
    orders_table_id: 'Order ID',
    orders_table_title: 'Request Title',
    orders_table_requested_by: 'Requested By',
    orders_table_department: 'Department',
    orders_table_amount: 'Amount',
    orders_table_date: 'Submitted Date',
    orders_table_approver: 'Assigned Approver',
    orders_table_status: 'Status',
    orders_table_actions: 'Actions',
    orders_empty_message: 'No orders match your filters.',

    // Dashboard
    dash_total_requests: 'Total Requests',
    dash_pending_approvals: 'Pending Approvals',
    dash_active_tasks: 'Active Tasks',
    dash_orders_in_progress: 'Orders in Progress',
    dash_completed_orders: 'Completed Orders',
    dash_audit_events: 'Audit Events',
    dash_workflow_activity: 'Workflow Activity Chart',
    dash_recent_orders: 'Recent Orders',
    dash_pending_actions: 'Pending Actions',
    dash_recent_audit: 'Recent Audit Activity',
    dash_quick_actions: 'Quick Actions',

    // Hero
    hero_eyebrow: 'Smart Automation Hackathon 2026 Edition • Powered by Gemini AI',
    hero_headline_1: 'Turn manual requests into ',
    hero_headline_gradient: 'intelligent automated workflows.',
    hero_subheadline: 'Employees type requests in plain language. FlowPilotAI understands the intent, checks financial policy, routes approvals, dispatches procurement orders, and audits every step in real time.',
  },

  hi: {
    // Nav
    nav_dashboard: 'डैशबोर्ड',
    nav_new_request: 'नया अनुरोध',
    nav_approvals: 'स्वीकृतियाँ',
    nav_orders: 'ऑर्डर',
    nav_analytics: 'एनालिटिक्स',
    nav_employees: 'कर्मचारी',
    nav_tasks: 'कार्य',
    nav_audit_log: 'ऑडिट लॉग',
    nav_ai_workflows: 'एआई वर्कफ़्लो',
    nav_lighting_modes: 'लाइटिंग मोड्स',
    nav_role: 'भूमिका',
    nav_sign_in: 'साइन इन',
    nav_get_started: 'शुरू करें',
    nav_settings: 'सेटिंग्स',
    nav_sign_out: 'साइन आउट',
    nav_replay_intro: 'परिचय एनीमेशन फिर से देखें',
    
    // Statuses
    status_pending: 'लंबित',
    status_accepted: 'स्वीकृत',
    status_denied: 'अस्वीकृत',
    status_in_progress: 'प्रगति पर',
    status_completed: 'पूर्ण',
    status_all: 'सभी',

    // Common actions
    action_create_order: 'ऑर्डर बनाएं',
    action_view_details: 'विवरण देखें',
    action_accept: 'स्वीकार करें',
    action_deny: 'अस्वीकार करें',
    action_complete: 'पूर्ण करें',
    action_mark_completed: 'पूर्ण चिह्नित करें',
    action_download_summary: 'सारांश डाउनलोड करें',
    action_search: 'खोजें...',
    action_export: 'निर्यात करें',
    action_filter: 'फ़िल्टर',
    action_clear_filters: 'फ़िल्टर हटाएं',
    action_close: 'बंद करें',
    action_cancel: 'रद्द करें',
    action_confirm: 'पुष्टि करें',
    action_submit: 'अनुरोध भेजें',
    action_add_employee: 'कर्मचारी जोड़ें',
    action_start_workflow: 'वर्कफ़्लो शुरू करें',
    action_book_demo: 'डेमो बुक करें',
    action_explore_how: 'देखें यह कैसे काम करता है',
    action_go_dashboard: 'डैशबोर्ड पर जाएं',

    // Orders page
    orders_title: 'ऑर्डर प्रबंधन',
    orders_subtitle: 'वर्कफ़्लो से संबंधित ऑर्डर को सबमिशन से पूर्ण होने तक मॉनिटर और ट्रैक करें।',
    orders_pending_card: 'लंबित ऑर्डर',
    orders_accepted_card: 'स्वीकृत ऑर्डर',
    orders_denied_card: 'अस्वीकृत ऑर्डर',
    orders_in_progress_card: 'प्रगति में ऑर्डर',
    orders_completed_card: 'पूर्ण ऑर्डर',
    orders_table_id: 'ऑर्डर आईडी',
    orders_table_title: 'अनुरोध शीर्षक',
    orders_table_requested_by: 'अनुरोधकर्ता',
    orders_table_department: 'विभाग',
    orders_table_amount: 'राशि',
    orders_table_date: 'सबमिशन तिथि',
    orders_table_approver: 'स्वीकर्ता',
    orders_table_status: 'स्थिति',
    orders_table_actions: 'कार्रवाई',
    orders_empty_message: 'फ़िल्टर से मेल खाने वाला कोई ऑर्डर नहीं मिला।',

    // Dashboard
    dash_total_requests: 'कुल अनुरोध',
    dash_pending_approvals: 'लंबित स्वीकृतियाँ',
    dash_active_tasks: 'सक्रिय कार्य',
    dash_orders_in_progress: 'प्रगति में ऑर्डर',
    dash_completed_orders: 'पूर्ण ऑर्डर',
    dash_audit_events: 'ऑडिट इवेंट्स',
    dash_workflow_activity: 'वर्कफ़्लो गतिविधि चार्ट',
    dash_recent_orders: 'हाल के ऑर्डर',
    dash_pending_actions: 'लंबित कार्रवाइयां',
    dash_recent_audit: 'हाल की ऑडिट गतिविधि',
    dash_quick_actions: 'त्वरित क्रियाएं',

    // Hero
    hero_eyebrow: 'स्मार्ट ऑटोमेशन हैकाथॉन 2026 • जेमिनी एआई द्वारा संचालित',
    hero_headline_1: 'मैन्युअल अनुरोधों को ',
    hero_headline_gradient: 'बुद्धिमान स्वचालित वर्कफ़्लो में बदलें।',
    hero_subheadline: 'कर्मचारी सरल भाषा में अनुरोध लिखते हैं। FlowPilotAI इरादा समझता है, वित्तीय नीति जांचता है, अनुमोदन मार्ग तय करता है और रीयल-टाइम ऑडिट करता है।',
  },

  es: {
    // Nav
    nav_dashboard: 'Panel',
    nav_new_request: 'Nueva Solicitud',
    nav_approvals: 'Aprobaciones',
    nav_orders: 'Pedidos',
    nav_analytics: 'Analítica',
    nav_employees: 'Empleados',
    nav_tasks: 'Tareas',
    nav_audit_log: 'Registro de Auditoría',
    nav_ai_workflows: 'Flujos de IA',
    nav_lighting_modes: 'Modos de Iluminación',
    nav_role: 'Rol',
    nav_sign_in: 'Iniciar Sesión',
    nav_get_started: 'Empezar',
    nav_settings: 'Configuración',
    nav_sign_out: 'Cerrar Sesión',
    nav_replay_intro: 'Repetir Animación Inicial',
    
    // Statuses
    status_pending: 'Pendiente',
    status_accepted: 'Aceptado',
    status_denied: 'Denegado',
    status_in_progress: 'En Progreso',
    status_completed: 'Completado',
    status_all: 'Todos',

    // Common actions
    action_create_order: 'Crear Pedido',
    action_view_details: 'Ver Detalles',
    action_accept: 'Aceptar',
    action_deny: 'Denegar',
    action_complete: 'Completar',
    action_mark_completed: 'Marcar como Completado',
    action_download_summary: 'Descargar Resumen',
    action_search: 'Buscar...',
    action_export: 'Exportar',
    action_filter: 'Filtrar',
    action_clear_filters: 'Limpiar Filtros',
    action_close: 'Cerrar',
    action_cancel: 'Cancelar',
    action_confirm: 'Confirmar',
    action_submit: 'Enviar Solicitud',
    action_add_employee: 'Agregar Empleado',
    action_start_workflow: 'Iniciar Flujo',
    action_book_demo: 'Agendar Demo',
    action_explore_how: 'Explorar Cómo Funciona',
    action_go_dashboard: 'Ir al Panel',

    // Orders page
    orders_title: 'Pedidos',
    orders_subtitle: 'Monitorea, aprueba y rastrea pedidos de flujos de trabajo desde el envío hasta su finalización.',
    orders_pending_card: 'Pedidos Pendientes',
    orders_accepted_card: 'Pedidos Aceptados',
    orders_denied_card: 'Pedidos Denegados',
    orders_in_progress_card: 'Pedidos en Progreso',
    orders_completed_card: 'Pedidos Completados',
    orders_table_id: 'ID de Pedido',
    orders_table_title: 'Título de Solicitud',
    orders_table_requested_by: 'Solicitado Por',
    orders_table_department: 'Departamento',
    orders_table_amount: 'Importe',
    orders_table_date: 'Fecha de Envío',
    orders_table_approver: 'Aprobador Asignado',
    orders_table_status: 'Estado',
    orders_table_actions: 'Acciones',
    orders_empty_message: 'No hay pedidos que coincidan con sus filtros.',

    // Dashboard
    dash_total_requests: 'Total Solicitudes',
    dash_pending_approvals: 'Aprobaciones Pendientes',
    dash_active_tasks: 'Tareas Activas',
    dash_orders_in_progress: 'Pedidos en Progreso',
    dash_completed_orders: 'Pedidos Completados',
    dash_audit_events: 'Eventos de Auditoría',
    dash_workflow_activity: 'Actividad de Flujos',
    dash_recent_orders: 'Pedidos Recientes',
    dash_pending_actions: 'Acciones Pendientes',
    dash_recent_audit: 'Auditoría Reciente',
    dash_quick_actions: 'Acciones Rápidas',

    // Hero
    hero_eyebrow: 'Smart Automation Hackathon 2026 • Impulsado por Gemini AI',
    hero_headline_1: 'Convierte solicitudes manuales en ',
    hero_headline_gradient: 'flujos de trabajo inteligentes y automatizados.',
    hero_subheadline: 'Los empleados escriben solicitudes en lenguaje natural. FlowPilotAI comprende la intención, evalúa políticas y despacha compras en tiempo real.',
  },

  fr: {
    nav_dashboard: 'Tableau de bord',
    nav_new_request: 'Nouvelle Demande',
    nav_approvals: 'Approbations',
    nav_orders: 'Commandes',
    nav_analytics: 'Analytique',
    nav_employees: 'Employés',
    nav_tasks: 'Tâches',
    nav_audit_log: "Journal d'Audit",
    nav_ai_workflows: 'Flux IA',
    nav_lighting_modes: "Modes d'Éclairage",
    nav_role: 'Rôle',
    nav_sign_in: 'Connexion',
    nav_get_started: 'Démarrer',
    nav_settings: 'Paramètres',
    nav_sign_out: 'Déconnexion',
    status_pending: 'En attente',
    status_accepted: 'Accepté',
    status_denied: 'Refusé',
    status_in_progress: 'En cours',
    status_completed: 'Terminé',
    status_all: 'Tout',
    action_create_order: 'Créer Commande',
    action_view_details: 'Voir Détails',
    action_accept: 'Accepter',
    action_deny: 'Refuser',
    action_complete: 'Terminer',
    action_mark_completed: 'Marquer comme Terminé',
    orders_title: 'Commandes',
    orders_subtitle: 'Supervisez et gérez les commandes de bout en bout.',
    dash_total_requests: 'Total Demandes',
    dash_completed_orders: 'Commandes Terminées'
  },

  de: {
    nav_dashboard: 'Dashboard',
    nav_new_request: 'Neue Anfrage',
    nav_approvals: 'Genehmigungen',
    nav_orders: 'Bestellungen',
    nav_analytics: 'Analytik',
    nav_employees: 'Mitarbeiter',
    nav_tasks: 'Aufgaben',
    nav_audit_log: 'Audit-Protokoll',
    nav_ai_workflows: 'KI-Workflows',
    nav_lighting_modes: 'Lichtmodi',
    nav_role: 'Rolle',
    nav_sign_in: 'Anmelden',
    nav_get_started: 'Loslegen',
    nav_settings: 'Einstellungen',
    nav_sign_out: 'Abmelden',
    status_pending: 'Ausstehend',
    status_accepted: 'Akzeptiert',
    status_denied: 'Abgelehnt',
    status_in_progress: 'In Bearbeitung',
    status_completed: 'Abgeschlossen',
    status_all: 'Alle',
    action_create_order: 'Bestellung erstellen',
    action_view_details: 'Details ansehen',
    action_accept: 'Akzeptieren',
    action_deny: 'Ablehnen',
    action_complete: 'Abschließen',
    action_mark_completed: 'Als Abgeschlossen markieren',
    orders_title: 'Bestellungen',
    orders_subtitle: 'Überwachen und verwalten Sie Workflow-Bestellungen.',
    dash_total_requests: 'Gesamte Anfragen',
    dash_completed_orders: 'Abgeschlossene Bestellungen'
  },

  ar: {
    nav_dashboard: 'لوحة التحكم',
    nav_new_request: 'طلب جديد',
    nav_approvals: 'الموافقات',
    nav_orders: 'الطلبات والطلبيات',
    nav_analytics: 'التحليلات',
    nav_employees: 'الموظفون',
    nav_tasks: 'المهام',
    nav_audit_log: 'سجل التدقيق',
    nav_ai_workflows: 'مهام سير العمل بالذكاء الاصطناعي',
    nav_lighting_modes: 'أوضاع الإضاءة',
    nav_role: 'الدور',
    nav_sign_in: 'تسجيل الدخول',
    nav_get_started: 'ابدأ الآن',
    nav_settings: 'الإعدادات',
    nav_sign_out: 'تسجيل الخروج',
    status_pending: 'قيد الانتظار',
    status_accepted: 'مقبول',
    status_denied: 'مرفوض',
    status_in_progress: 'قيد التنفيذ',
    status_completed: 'مكتمل',
    status_all: 'الكل',
    action_create_order: 'إنشاء طلبية',
    action_view_details: 'عرض التفاصيل',
    action_accept: 'قبول',
    action_deny: 'رفض',
    action_complete: 'إكمال',
    action_mark_completed: 'تحديد كمكتمل',
    orders_title: 'إدارة الطلبيات',
    orders_subtitle: 'مراقبة وتتبع الطلبيات من الإنشاء وحتى الإنجاز الكامل.',
    dash_total_requests: 'إجمالي الطلبات',
    dash_completed_orders: 'الطلبات المكتملة'
  },

  ja: {
    nav_dashboard: 'ダッシュボード',
    nav_new_request: '新規リクエスト',
    nav_approvals: '承認一覧',
    nav_orders: '発注管理',
    nav_analytics: 'アナリティクス',
    nav_employees: '従業員',
    nav_tasks: 'タスク',
    nav_audit_log: '監査ログ',
    nav_ai_workflows: 'AIワークフロー',
    nav_lighting_modes: '照明オートメーション',
    nav_role: 'ロール',
    nav_sign_in: 'ログイン',
    nav_get_started: '始める',
    nav_settings: '設定',
    nav_sign_out: 'ログアウト',
    status_pending: '保留中',
    status_accepted: '承認済み',
    status_denied: '却下',
    status_in_progress: '進行中',
    status_completed: '完了',
    status_all: 'すべて',
    action_create_order: '発注作成',
    action_view_details: '詳細を見る',
    action_accept: '承認する',
    action_deny: '却下する',
    action_complete: '完了にする',
    action_mark_completed: '完了としてマーク',
    orders_title: '発注管理',
    orders_subtitle: 'ワークフローに基づく発注の進捗を監視・管理します。',
    dash_total_requests: '総リクエスト',
    dash_completed_orders: '完了した発注'
  }
};

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('flowpilot_lang') || 'en');
  const [currency, setCurrency] = useState(() => localStorage.getItem('flowpilot_currency') || 'INR');
  const [dateFormat, setDateFormat] = useState(() => localStorage.getItem('flowpilot_date_format') || 'DD MMM YYYY');

  useEffect(() => {
    localStorage.setItem('flowpilot_lang', lang);
    const activeLangObj = SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0];
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', activeLangObj.dir);
  }, [lang]);

  const t = (key, fallback = '') => {
    const langDict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    if (langDict && langDict[key]) return langDict[key];
    if (TRANSLATIONS.en && TRANSLATIONS.en[key]) return TRANSLATIONS.en[key];
    return fallback || key;
  };

  const formatCurrency = (amount) => {
    const num = Number(amount) || 0;
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num * 0.012);
    }
    if (currency === 'EUR') {
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(num * 0.011);
    }
    // Default INR
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      if (dateFormat === 'MM/DD/YYYY') {
        return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
      }
      if (dateFormat === 'YYYY-MM-DD') {
        return d.toISOString().split('T')[0];
      }
      return d.toLocaleDateString(lang === 'hi' ? 'hi-IN' : lang === 'es' ? 'es-ES' : 'en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <I18nContext.Provider
      value={{
        lang,
        setLang,
        currency,
        setCurrency,
        dateFormat,
        setDateFormat,
        t,
        formatCurrency,
        formatDate,
        isRTL: lang === 'ar',
        supportedLanguages: SUPPORTED_LANGUAGES
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
