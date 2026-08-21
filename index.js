import { 
    saveSettingsDebounced, 
    eventSource, 
    event_types,
    setExtensionPrompt,
    extension_prompt_types
} from '../../../../script.js';
import { extension_settings } from '../../../extensions.js';
import { 
    getFetusData, 
    getPostpartumData, 
    getRandomSymptomIndices, 
    getSymptomList, 
    rollComplication, 
    getComplication, 
    getRandomFetalDiseaseId, 
    getFetalDisease 
} from './symptoms.js';

const EXTENSION_NAME = 'st-advanced-reproductive-system';

const DEFAULT_SETTINGS = {
    isEnabled: true,
    isNotificationsEnabled: true,
    language: 'ru',
    mode: 'realism',       
    gender: 'female',      
    aiAwareness: 'dynamic', 
    cycleLength: 28,
    periodDuration: 5,
    maxPregnancyWeeks: 40, 
    chatPregnancyData: {},
    globalRollsCount: 0,
    isFetalPathologyEnabled: true 
};

function createDefaultBodyData() {
    return {
        cycleDay: 1,
        lastRpDate: null,
        isPregnant: false,
        pregnancyWeeks: 0,
        pregnancyDays: 0,
        babiesCount: 0,
        babiesGenders: [],
        currentDeliveredCount: 0,
        symptomPhaseKey: null,
        symptomIndices: [],
        rolledTrimesters: { 1: false, 2: false, 3: false },
        activeComplication: null,
        postpartumDays: 0,
        deliveryMethod: 'none',
        childrenList: [],
        contraception: 'none',
        fetalDiseaseId: null 
    };
}

let settings = Object.assign({}, DEFAULT_SETTINGS);
let isMenuCollapsed = true; 
let pendingUserTimeskipDays = 0;
const processedBirthMessages = new Set();

const MONTHS = {
    'января': 0, 'январь': 0, 'янв': 0,
    'февраля': 1, 'февраль': 1, 'фев': 1,
    'марта': 2, 'март': 2, 'мар': 2,
    'апреля': 3, 'апрель': 3, 'апр': 3,
    'мая': 4, 'май': 4,
    'июня': 5, 'июнь': 5, 'июн': 5,
    'июля': 6, 'июль': 6, 'июл': 6,
    'августа': 7, 'август': 7, 'авг': 7,
    'сентября': 8, 'сентябрь': 8, 'сен': 8, 'сент': 8,
    'октября': 9, 'октябрь': 9, 'окт': 9,
    'ноября': 10, 'ноябрь': 10, 'ноя': 10,
    'декабря': 11, 'декабрь': 11, 'дек': 11,
    'january': 0, 'jan': 0,
    'february': 1, 'feb': 1,
    'march': 2, 'mar': 2,
    'april': 3, 'apr': 3,
    'may': 4,
    'june': 5, 'jun': 5,
    'july': 6, 'jul': 6,
    'august': 7, 'aug': 7,
    'september': 8, 'sep': 8, 'sept': 8,
    'october': 9, 'oct': 9,
    'november': 10, 'nov': 10,
    'december': 11, 'dec': 11
};

const TRANSLATIONS = {
    ru: {
        title: '🧬 Репродуктивная Система',
        enableExt: 'Включить расширение',
        enableNotif: 'Показывать уведомления',
        system: 'Система:', realism: 'Реализм', omegaverse: 'ОмегаВерс',
        physiology: 'Физиология:', female: 'Женщина', female_omega: 'Женщина Омега', male_omega: 'Мужчина Омегa',
        aiLogic: 'Знания ИИ:', ultrasound: 'УЗИ (20 нед)', medieval: 'Средневековье', knowsAll: 'Знает всё',
        phaseRealism: 'Текущая фаза:', phaseOmega: 'Текущее состояние омеги:',
        termInRp: 'Срок в RP:', weeksShort: 'нед.', daysShort: 'дн.',
        wombMap: 'Карта плода:', babiesCount: 'Детей в утробе:', babiesSex: 'Пол:',
        sync: 'Синхронизация:', waitingDate: 'Ожидание даты',
        paramsHeader: 'Параметры', rpDateLabel: 'RP Дата (ДД.ММ.ГГГГ):', cycleLengthLabel: 'Цикл (дней):',
        pregnancyWeekLabel: 'Неделя:', cycleDayLabel: 'День цикла:',
        applyBtn: '▶ Применить изменения', initPregnancyHeader: 'Задать беременность',
        manualWeeks: 'Срок (нед):', manualCount: 'Плодов:', startPregnancyBtn: '🤰 Начать беременность',
        resetPregnancyBtn: '🚼 Сбросить беременность', resetAllBtn: 'Полный сброс данных',
        toastSaved: 'Параметры успешно сохранены!', toastManualPreg: 'Беременность установлена вручную: ',
        toastResetPreg: 'Беременность сброшена.', toastResetAll: 'Данные чата полностью очищены.',
        toastTimePassed: 'Репродуктивная система: В РП прошло дней: ',
        toastConception: '🚨 ЗАЧАТИЕ ПРОИЗОШЛО! Успешная имплантация в матке.',
        toastPregEnd: 'Срок беременности подошел к концу! Пора рожать.',
        pregnancy: 'Беременность 🤰', pregnancyOmega: 'Беременность (Омега) 🤰',
        menstruation: 'Менструация 🩸', follicular: 'Фолликулярная фаза 🌸', ovulation: 'Овуляция (Окно зачатия) ✨', luteal: 'Лютеиновая фаза (ПМС) 🍂',
        heat: 'Течка (Пик фертильности) 🔥', quiescence: 'Период покоя',
        delayed: 'Задержка цикла ⚠️',
        symptomsTitle: '🎯 Симптомы организма:', fetusTitle: '👶 Развитие плода и тела:',
        fetusSizeLabel: 'Размер плода:', fetusWeightLabel: 'Вес:', fetusBellyLabel: 'Живот:',
        fetalAnomalyTitle: '🧬 Врожденная патология плода (обнаружена на УЗИ):',
        fetalAnomalyLocked: '🔒 Патология плода будет выявлена на скрининговом УЗИ (20-я неделя).',
        medievalLocked: '🔒 Режим Средневековье: количество и пол плода скрыты до момента родов.',
        ultrasound12Locked: '🔒 УЗИ-скрининг (1-й триместр): количество и пол плода пока не исследованы (до 12 нед).',
        ultrasound20Locked: '🔒 Пол плода будет определен на скрининговом УЗИ (20-я неделя).',
        complicationTitle: '⚠️ Медицинское осложнение:', cureBtn: '💊 Провести лечение / Облегчить симптом',
        postpartumPhase: 'Восстановление после родов 🩹', 
        postpartumHeader: 'Послеродовое состояние (День ',
        outcomeType: 'Тип исхода:', stageLabel: 'Стадия:',
        careTips: '💡 Рекомендации по уходу:',
        newbornTitle: '🍼 Рожденные дети в семье:',
        childLabel: 'Ребенок',
        giveBirthBtn: '🔔 ПРИНЯТЬ ВСЕ РОДЫ ВРУЧНУЮ',
        protectionLabel: 'Контрацепция:', protectionNone: 'Без защиты', protectionCondom: 'Презерватив (Барьерный)',
        protectionPills: 'Оральные контрацептивы (КОК)', protectionIud: 'Внутриматочная спираль (ВМС)',
        fetalPathologyLabel: '🧬 Разрешить врождённые патологии плода',
        fetalPathologySub: '(~3% шанс при зачатии)',
        globalRollsLabel: 'Всего скрытых проверок на зачатие:',
        eddLabel: '📅 ПДР (Дата родов):',
        maxWeeksLabel: 'Срок беременности (нед):'
    },
    en: {
        title: '🧬 Reproductive System',
        enableExt: 'Enable Extension',
        enableNotif: 'Show Notifications',
        system: 'System:', realism: 'Realism', omegaverse: 'OmegaVerse',
        physiology: 'Physiology:', female: 'Female', female_omega: 'F-Omega', male_omega: 'M-Omega',
        aiLogic: 'AI Awareness:', ultrasound: 'Ultrasound (20 wk)', medieval: 'Medieval (Blind)', knowsAll: 'Knows Everything',
        phaseRealism: 'Current Phase:', phaseOmega: 'Current Omega Status:',
        termInRp: 'Term in RP:', weeksShort: 'wks', daysShort: 'days',
        wombMap: 'Womb Content:', babiesCount: 'Babies in Womb:', babiesSex: 'Sex:',
        sync: 'Synchronized:', waitingDate: 'Waiting for date',
        paramsHeader: 'Parameters', rpDateLabel: 'RP Date (DD.MM.YYYY):', cycleLengthLabel: 'Cycle (days):',
        pregnancyWeekLabel: 'Week:', cycleDayLabel: 'Cycle Day:',
        applyBtn: '▶ Apply Changes', initPregnancyHeader: 'Initialize Pregnancy',
        manualWeeks: 'Term (wks):', manualCount: 'Babies:', startPregnancyBtn: '🤰 Start Pregnancy',
        resetPregnancyBtn: '🚼 Reset Pregnancy Only', resetAllBtn: 'Full Data Reset',
        toastSaved: 'Parameters successfully saved!', toastManualPreg: 'Pregnancy set manually: ',
        toastResetPreg: 'Pregnancy has been reset.', toastResetAll: 'Chat data fully cleared.',
        toastTimePassed: 'Reproductive system: Days passed in RP: ',
        toastConception: '🚨 CONCEPTION OCCURRED! Successful implantation in the womb.',
        toastPregEnd: 'Pregnancy term has ended! Time to give birth.',
        pregnancy: 'Pregnancy 🤰', pregnancyOmega: 'Pregnancy (Omega) 🤰',
        menstruation: 'Menstruation 🩸', follicular: 'Follicular Phase 🌸', ovulation: 'Ovulation (Conception Window) ✨', luteal: 'Luteal Phase (PMS) 🍂',
        heat: 'Heat (Peak Fertility) 🔥', quiescence: 'Quiescence Period',
        delayed: 'Cycle Delayed ⚠️',
        symptomsTitle: '🎯 Body Symptoms:', fetusTitle: '👶 Fetus & Body Development:',
        fetusSizeLabel: 'Fetus Size:', fetusWeightLabel: 'Weight:', fetusBellyLabel: 'Belly:',
        fetalAnomalyTitle: '🧬 Fetal Anomaly Detected (Ultrasound Anatomy Scan):',
        fetalAnomalyLocked: '🔒 Fetal pathology will be detected at anatomy ultrasound (week 20).',
        medievalLocked: '🔒 Medieval Mode: baby headcount and sex are hidden until labor.',
        ultrasound12Locked: '🔒 1st Trimester Scan: baby count and sex are not yet visible (<12 wks).',
        ultrasound20Locked: '🔒 Fetal sex will be determined on week 20 anatomy ultrasound.',
        complicationTitle: '⚠️ Medical Complication:', cureBtn: '💊 Treat / Alleviate Complication',
        postpartumPhase: 'Postpartum Recovery 🩹',
        postpartumHeader: 'Postpartum State (Day ',
        outcomeType: 'Outcome:', stageLabel: 'Stage:',
        careTips: '💡 Recovery Care Guidelines:',
        newbornTitle: '🍼 Children in Family:',
        childLabel: 'Child',
        giveBirthBtn: '🔔 DELIVER ALL BABIES MANUALLY',
        protectionLabel: 'Contraception:', protectionNone: 'No Protection', protectionCondom: 'Condom (Barrier)',
        protectionPills: 'Oral Extraconceptives (Pills)', protectionIud: 'Intrauterine Device (IUD)',
        fetalPathologyLabel: '🧬 Allow Congenital Fetal Anomalies',
        fetalPathologySub: '(~3% chance on conception)',
        globalRollsLabel: 'Total hidden conception checks:',
        eddLabel: '📅 EDD (Due Date):',
        maxWeeksLabel: 'Pregnancy Term (wks):'
    }
};

function getLanguage() {
    return settings.language || 'ru';
}

function getText(key) {
    const lang = getLanguage();
    return TRANSLATIONS[lang][key] || TRANSLATIONS['ru'][key] || key;
}

function translateGender(genderStr, targetLang = 'en') {
    if (!genderStr) return '';
    const isEn = targetLang === 'en';
    const clean = genderStr.trim();

    const map = {
        'Мальчик ♂': isEn ? 'Boy ♂' : 'Мальчик ♂',
        'Boy ♂': isEn ? 'Boy ♂' : 'Мальчик ♂',
        'Девочка ♀': isEn ? 'Girl ♀' : 'Девочка ♀',
        'Girl ♀': isEn ? 'Girl ♀' : 'Девочка ♀',
        'Альфа-мальчик ♂': isEn ? 'Alpha Boy ♂' : 'Альфа-мальчик ♂',
        'Alpha Boy ♂': isEn ? 'Alpha Boy ♂' : 'Альфа-мальчик ♂',
        'Омега-мальчик ♂': isEn ? 'Omega Boy ♂' : 'Омега-мальчик ♂',
        'Omega Boy ♂': isEn ? 'Omega Boy ♂' : 'Омега-мальчик ♂',
        'Бета-мальчик ♂': isEn ? 'Beta Boy ♂' : 'Бета-мальчик ♂',
        'Beta Boy ♂': isEn ? 'Beta Boy ♂' : 'Бета-мальчик ♂',
        'Альфа-девочка ♀': isEn ? 'Alpha Girl ♀' : 'Альфа-девочка ♀',
        'Alpha Girl ♀': isEn ? 'Alpha Girl ♀' : 'Альфа-девочка ♀',
        'Омега-девочка ♀': isEn ? 'Omega Girl ♀' : 'Омега-девочка ♀',
        'Omega Girl ♀': isEn ? 'Omega Girl ♀' : 'Омега-девочка ♀',
        'Бета-девочка ♀': isEn ? 'Beta Girl ♀' : 'Бета-девочка ♀',
        'Beta Girl ♀': isEn ? 'Beta Girl ♀' : 'Бета-девочка ♀'
    };
    return map[clean] || clean;
}

function getCurrentChatId() {
    return (typeof SillyTavern?.getContext === 'function') ? (SillyTavern.getContext().chatId || window.chat_id || 'default') : (window.chat_id || 'default');
}

function getChatBodyData() {
    const chatId = getCurrentChatId();
    if (!settings.chatPregnancyData[chatId]) {
        settings.chatPregnancyData[chatId] = createDefaultBodyData();
    }
    const data = settings.chatPregnancyData[chatId];
    if (data.postpartumDays === undefined) data.postpartumDays = 0;
    if (data.deliveryMethod === undefined) data.deliveryMethod = 'none';
    if (!data.childrenList) data.childrenList = [];
    if (!data.rolledTrimesters) data.rolledTrimesters = { 1: false, 2: false, 3: false };
    if (data.contraception === undefined) data.contraception = 'none'; 
    if (data.fetalDiseaseId === undefined) {
        data.fetalDiseaseId = data.fetalDisease?.id || null;
    }
    if (data.currentDeliveredCount === undefined) data.currentDeliveredCount = 0;
    if (!data.symptomIndices) data.symptomIndices = [];
    return data;
}

function generateBabyGender(mode, lang = 'ru') {
    const isBoy = Math.random() > 0.5;
    const isRu = lang === 'ru';
    
    if (mode === 'omegaverse') {
        const roll = Math.random() * 100;
        let sec = isRu ? 'Бета' : 'Beta';
        if (roll < 25) { 
            sec = isRu ? 'Альфа' : 'Alpha'; 
        } else if (roll < 50) { 
            sec = isRu ? 'Омега' : 'Omega'; 
        }
        
        if (isRu) {
            return isBoy ? `${sec}-мальчик ♂` : `${sec}-девочка ♀`;
        } else {
            return isBoy ? `${sec} Boy ♂` : `${sec} Girl ♀`;
        }
    } else {
        if (isRu) {
            return isBoy ? 'Мальчик ♂' : 'Девочка ♀';
        } else {
            return isBoy ? 'Boy ♂' : 'Girl ♀';
        }
    }
}

function loadSettings() {
    if (!extension_settings[EXTENSION_NAME]) {
        extension_settings[EXTENSION_NAME] = Object.assign({}, DEFAULT_SETTINGS);
    }
    settings = extension_settings[EXTENSION_NAME];
    if (settings.language === undefined) settings.language = 'ru';
    if (settings.globalRollsCount === undefined) settings.globalRollsCount = 0;
    if (settings.maxPregnancyWeeks === undefined) settings.maxPregnancyWeeks = 40;
    if (settings.isNotificationsEnabled === undefined) settings.isNotificationsEnabled = true;
    if (settings.isFetalPathologyEnabled === undefined) settings.isFetalPathologyEnabled = true;

    if (settings.mode === 'realism' && settings.gender !== 'female') {
        settings.gender = 'female';
    } else if (settings.mode === 'omegaverse' && settings.gender === 'female') {
        settings.gender = 'female_omega';
    }

    const data = getChatBodyData();
    updateSymptomsData(data);
    checkPregnancyComplications(data);

    renderUI();
    updatePromptInjection();
}

function getBodyPhase(lang = 'ru') {
    const data = getChatBodyData();
    const l = (lang === 'en') ? 'en' : 'ru';
    const T = TRANSLATIONS[l];

    if (data.postpartumDays > 0) return T['postpartumPhase'];
    
    if (data.isPregnant && data.pregnancyWeeks === 0 && data.cycleDay <= settings.cycleLength) {
        if (settings.mode === 'realism') {
            if (data.cycleDay <= 10) return T['follicular'];
            if (data.cycleDay >= 11 && data.cycleDay <= 16) return T['ovulation'];
            return T['luteal'];
        } else {
            if (data.cycleDay >= 12 && data.cycleDay <= 15) return T['heat'];
            return T['quiescence'];
        }
    }

    if (data.isPregnant) return settings.mode === 'realism' ? T['pregnancy'] : T['pregnancyOmega'];

    const day = data.cycleDay;
    if (day > settings.cycleLength) return T['delayed']; 

    if (settings.mode === 'realism') {
        if (day <= settings.periodDuration) return T['menstruation'];
        if (day > settings.periodDuration && day <= 10) return T['follicular'];
        if (day >= 11 && day <= 16) return T['ovulation'];
        return T['luteal'];
    } else {
        if (day >= 12 && day <= 15) return T['heat'];
        return T['quiescence'];
    }
}

function updateSymptomsData(data) {
    if (data.postpartumDays > 0) {
        data.symptomPhaseKey = null;
        data.symptomIndices = [];
        return;
    }

    let phaseKey = null;
    if (data.isPregnant) {
        if (data.pregnancyWeeks === 0 && data.cycleDay <= settings.cycleLength) {
            data.symptomPhaseKey = null;
            data.symptomIndices = [];
            return;
        }
        const week = data.pregnancyWeeks;
        if (week <= 12) phaseKey = 'preg_trimester_1';
        else if (week >= 13 && week <= 26) phaseKey = 'preg_trimester_2';
        else phaseKey = 'preg_trimester_3';
    } else {
        const day = data.cycleDay;
        if (day <= settings.cycleLength) {
            if (settings.mode === 'realism') {
                if (day <= settings.periodDuration) phaseKey = 'menstruation';
                else if (day > settings.periodDuration && day <= 10) phaseKey = 'follicular';
                else if (day >= 11 && day <= 16) phaseKey = 'ovulation';
                else phaseKey = 'luteal';
            } else {
                if (day >= 12 && day <= 15) {
                    phaseKey = (settings.gender === 'male_omega') ? 'heat_male' : 'heat_female';
                }
            }
        }
    }

    if (phaseKey) {
        if (data.symptomPhaseKey !== phaseKey || !data.symptomIndices || data.symptomIndices.length === 0) {
            data.symptomPhaseKey = phaseKey;
            data.symptomIndices = getRandomSymptomIndices(phaseKey, 3);
        }
    } else {
        data.symptomPhaseKey = null;
        data.symptomIndices = [];
    }
}

function checkPregnancyComplications(data) {
    if (!data.isPregnant) return;
    const currentWeek = data.pregnancyWeeks;
    let currentTrimester = 1;
    if (currentWeek >= 13 && currentWeek <= 26) currentTrimester = 2;
    else if (currentWeek >= 27) currentTrimester = 3;

    if (!data.rolledTrimesters[currentTrimester] && !data.activeComplication) {
        data.rolledTrimesters[currentTrimester] = true;
        const rolled = rollComplication(currentTrimester);
        if (rolled) data.activeComplication = rolled;
    }

    if (data.activeComplication && !data.activeComplication.isDiscovered) {
        if (currentWeek >= data.activeComplication.triggerWeek) {
            data.activeComplication.isDiscovered = true;
            const comp = getComplication(data.activeComplication.id, getLanguage());
            if (settings.isNotificationsEnabled && comp) {
                toastr.error(`🚨 ${getText('complicationTitle')} «${comp.name}»!`);
            }
        }
    }
}

function normalizeYear(yearStr) {
    let y = parseInt(yearStr, 10);
    if (yearStr.length <= 2) {
        return y <= 40 ? 2000 + y : 1900 + y;
    }
    return y;
}

function dateToDays(year, month, day) {
    return Math.floor(Date.UTC(year, month, day) / 86400000);
}

function daysToDateString(days) {
    const d = new Date(days * 86400000);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function cleanHtmlFromText(text) {
    if (!text) return '';
    return text
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/\u00A0/g, ' ')
        .replace(/✦|★|•|\|/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function normalizeInputDate(val) {
    if (!val) return null;
    val = val.trim();
    const dmy = val.match(/^(\d{1,2})[\.\-\/](\d{1,2})[\.\-\/](\d{2,4})$/);
    if (dmy) {
        const d = String(parseInt(dmy[1], 10)).padStart(2, '0');
        const m = String(parseInt(dmy[2], 10)).padStart(2, '0');
        const y = String(normalizeYear(dmy[3])).padStart(4, '0');
        return `${y}-${m}-${d}`;
    }
    const ymd = val.match(/^(\d{3,4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})$/);
    if (ymd) {
        const y = String(parseInt(ymd[1], 10)).padStart(4, '0');
        const m = String(parseInt(ymd[2], 10)).padStart(2, '0');
        const d = String(parseInt(ymd[3], 10)).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
    return null;
}

function parseRpDateFromText(rawText) {
    if (!rawText) return null;
    const text = cleanHtmlFromText(rawText);

    const dmyTextRegex = /(\d{1,2})(?:-?е|-?го|-?th|-?st|-?nd|-?rd)?\s+(?:of\s+)?([a-zA-Zа-яёА-ЯЁ]+)[,\s]+(\d{2,4})/i;
    const dmyTextMatch = text.match(dmyTextRegex);
    if (dmyTextMatch) {
        const day = parseInt(dmyTextMatch[1], 10);
        const monthStr = dmyTextMatch[2].toLowerCase();
        const year = normalizeYear(dmyTextMatch[3]);
        if (MONTHS[monthStr] !== undefined && day >= 1 && day <= 31) {
            return { year, month: MONTHS[monthStr], day };
        }
    }

    const mdyTextRegex = /([a-zA-Zа-яёА-ЯЁ]+)\s+(\d{1,2})(?:-?е|-?го|-?th|-?st|-?nd|-?rd)?[,\s]+(\d{2,4})/i;
    const mdyTextMatch = text.match(mdyTextRegex);
    if (mdyTextMatch) {
        const monthStr = mdyTextMatch[1].toLowerCase();
        const day = parseInt(mdyTextMatch[2], 10);
        const year = normalizeYear(mdyTextMatch[3]);
        if (MONTHS[monthStr] !== undefined && day >= 1 && day <= 31) {
            return { year, month: MONTHS[monthStr], day };
        }
    }

    const ymdNumRegex = /(\d{3,4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/;
    const ymdNumMatch = text.match(ymdNumRegex);
    if (ymdNumMatch) {
        const year = parseInt(ymdNumMatch[1], 10);
        const month = parseInt(ymdNumMatch[2], 10) - 1;
        const day = parseInt(ymdNumMatch[3], 10);
        if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
            return { year, month, day };
        }
    }

    const dmyNumRegex = /(\d{1,2})[\.\-\/](\d{1,2})[\.\-\/](\d{2,4})/;
    const dmyNumMatch = text.match(dmyNumRegex);
    if (dmyNumMatch) {
        const day = parseInt(dmyNumMatch[1], 10);
        const month = parseInt(dmyNumMatch[2], 10) - 1;
        const year = normalizeYear(dmyNumMatch[3]);
        if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
            return { year, month, day };
        }
    }

    return null;
}

function parseRelativeDaysFromText(rawText) {
    if (!rawText) return 0;
    const lower = cleanHtmlFromText(rawText).toLowerCase();

    if (/(?:прошл(?:о|а|ел|и|ели)|спустя|через)\s+(?:(?:около|примерно)\s+)?пол[\s-]?года|half\s+a\s+year\s+(?:passed|later)|after\s+half\s+a\s+year/i.test(lower)) {
        return 180;
    }

    const WORD_NUMBERS = {
        'один': 1, 'одна': 1, 'одно': 1, 'одну': 1, '1': 1,
        'два': 2, 'две': 2, 'пара': 2, 'пару': 2, '2': 2,
        'три': 3, 'четыре': 4, 'пять': 5, 'шесть': 6,
        'семь': 7, 'восемь': 8, 'девять': 9, 'десять': 10,
        'a': 1, 'an': 1, 'one': 1, 'two': 2, 'couple': 2,
        'three': 3, 'four': 4, 'five': 5, 'six': 6,
        'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
    };

    const parseCount = (rawCount) => {
        if (!rawCount) return 1;
        const cleaned = rawCount.trim().toLowerCase();
        if (/^\d+$/.test(cleaned)) return parseInt(cleaned, 10);
        if (WORD_NUMBERS[cleaned] !== undefined) return WORD_NUMBERS[cleaned];
        return 1;
    };

    const calculateDays = (count, unitStr) => {
        const u = unitStr.toLowerCase();
        if (u.startsWith('дн') || u.startsWith('day')) return count;
        if (u.startsWith('нед') || u.startsWith('week')) return count * 7;
        if (u.startsWith('мес') || u.startsWith('month')) return count * 30;
        if (u.startsWith('ле') || u.startsWith('год') || u.startsWith('year') || u.startsWith('yr')) return count * 365;
        return 0;
    };

    const ruRegex = /(?:прошл(?:о|а|ел|и|ели)|спустя|через)\s+(?:(?:около|примерно)\s+)?(\d+|од[иннаоу]+|дв[ае]|пар[ау]|три|четыре|пять|шесть|семь|восемь|девять|десять)?\s*(дне[йяа]|день|дня|недел[ьиюяе]+|месяц[аев]*|ле[тв]|год[аоу]?)/i;
    const ruMatch = lower.match(ruRegex);
    if (ruMatch) {
        const count = parseCount(ruMatch[1]);
        const days = calculateDays(count, ruMatch[2]);
        if (days > 0) return days;
    }

    const enSuffixRegex = /(\d+|a|an|one|two|couple|three|four|five|six|seven|eight|nine|ten)?\s*(day|week|month|year)s?\s+(?:passed|later)/i;
    const enSuffixMatch = lower.match(enSuffixRegex);
    if (enSuffixMatch) {
        const count = parseCount(enSuffixMatch[1]);
        const days = calculateDays(count, enSuffixMatch[2]);
        if (days > 0) return days;
    }

    const enPrefixRegex = /\b(?:after|in|past)\s+(?:about\s+)?(\d+|a|an|one|two|couple|three|four|five|six|seven|eight|nine|ten)?\s*(day|week|month|year)s?\b/i;
    const enPrefixMatch = lower.match(enPrefixRegex);
    if (enPrefixMatch) {
        const count = parseCount(enPrefixMatch[1]);
        const days = calculateDays(count, enPrefixMatch[2]);
        if (days > 0) return days;
    }

    return 0;
}

function handleUserMessageTime(text) {
    const data = getChatBodyData();
    const relativeDays = parseRelativeDaysFromText(text);

    if (relativeDays > 0) {
        pendingUserTimeskipDays = relativeDays;
        advanceBodyTime(relativeDays);
        checkPregnancyComplications(data);

        if (data.lastRpDate) {
            const parts = data.lastRpDate.split('-').map(Number);
            const currentTotalDays = dateToDays(parts[0], parts[1] - 1, parts[2]);
            data.lastRpDate = daysToDateString(currentTotalDays + relativeDays);
        }

        saveSettingsDebounced(); 
        renderUI(); 
        return; 
    }

    const parsedDate = parseRpDateFromText(text);
    if (parsedDate) {
        const newTotalDays = dateToDays(parsedDate.year, parsedDate.month, parsedDate.day);
        const newDateStr = daysToDateString(newTotalDays);

        if (data.lastRpDate && data.lastRpDate !== newDateStr) {
            const parts = data.lastRpDate.split('-').map(Number);
            const prevTotalDays = dateToDays(parts[0], parts[1] - 1, parts[2]);
            const diff = newTotalDays - prevTotalDays;
            if (diff > 0) {
                advanceBodyTime(diff);
                checkPregnancyComplications(data);
            }
        }
        data.lastRpDate = newDateStr;
        saveSettingsDebounced(); 
        renderUI();
    }
}

function handleAiMessageTime(text) {
    const data = getChatBodyData();

    if (pendingUserTimeskipDays > 0) {
        pendingUserTimeskipDays = 0;
        const parsedDate = parseRpDateFromText(text);
        if (parsedDate) {
            data.lastRpDate = daysToDateString(dateToDays(parsedDate.year, parsedDate.month, parsedDate.day));
            saveSettingsDebounced();
            renderUI();
        }
        return;
    }

    const relativeDays = parseRelativeDaysFromText(text);
    if (relativeDays > 0) {
        advanceBodyTime(relativeDays);
        checkPregnancyComplications(data);
        if (data.lastRpDate) {
            const parts = data.lastRpDate.split('-').map(Number);
            const currentTotalDays = dateToDays(parts[0], parts[1] - 1, parts[2]);
            data.lastRpDate = daysToDateString(currentTotalDays + relativeDays);
        }
        saveSettingsDebounced(); 
        renderUI(); 
        return; 
    }

    const parsedDate = parseRpDateFromText(text);
    if (parsedDate) {
        const newTotalDays = dateToDays(parsedDate.year, parsedDate.month, parsedDate.day);
        const newDateStr = daysToDateString(newTotalDays);

        if (data.lastRpDate && data.lastRpDate !== newDateStr) {
            const parts = data.lastRpDate.split('-').map(Number);
            const prevTotalDays = dateToDays(parts[0], parts[1] - 1, parts[2]);
            const diff = newTotalDays - prevTotalDays;
            if (diff > 0) {
                advanceBodyTime(diff);
                checkPregnancyComplications(data);
                if (settings.isNotificationsEnabled) {
                    toastr.info(`${getText('toastTimePassed')}${diff}.`);
                }
            }
        }
        data.lastRpDate = newDateStr;
        saveSettingsDebounced(); 
        renderUI();
    }
}

function advanceBodyTime(days) {
    const data = getChatBodyData();
    const lang = getLanguage();
    
    if (data.postpartumDays > 0) {
        data.postpartumDays += days;
        if (data.postpartumDays > 40) {
            data.postpartumDays = 0;
            data.deliveryMethod = 'none';
            data.cycleDay = 1; 
            if (settings.isNotificationsEnabled) {
                toastr.success(lang === 'en' 
                    ? "Postpartum recovery complete. Reproductive cycle restarted."
                    : "Послеродовое восстановление завершено. Репродуктивный цикл запущен.");
            }
        }
        return;
    }

    if (data.isPregnant) {
        if (data.activeComplication && data.activeComplication.id === 'miscarriage_threat_early' && data.activeComplication.isDiscovered) {
            for (let i = 0; i < days; i++) {
                if (Math.random() * 100 < 10) { 
                    processMiscarriageTrigger();
                    return; 
                }
            }
        }

        data.pregnancyDays += days;
        if (data.pregnancyDays >= 7) {
            const prevWeeks = data.pregnancyWeeks;
            data.pregnancyWeeks += Math.floor(data.pregnancyDays / 7);
            data.pregnancyDays %= 7;

            if (data.fetalDiseaseId && prevWeeks < 20 && data.pregnancyWeeks >= 20 && settings.isNotificationsEnabled && settings.aiAwareness !== 'hidden') {
                const disease = getFetalDisease(data.fetalDiseaseId, lang);
                if (disease) toastr.warning(`🧬 ${getText('fetalAnomalyTitle')} «${disease.name}»!`);
            }
        }
        updateSymptomsData(data);
        const maxWeeks = settings.maxPregnancyWeeks || (settings.mode === 'omegaverse' ? 36 : 40);
        if (data.pregnancyWeeks >= maxWeeks && settings.isNotificationsEnabled) {
            toastr.warning(getText('toastPregEnd'));
        }
    } else {
        data.cycleDay += days;
        if (data.cycleDay > settings.cycleLength) data.cycleDay = ((data.cycleDay - 1) % settings.cycleLength) + 1;
        updateSymptomsData(data);
    }
}

function checkConceptionTrigger(text) {
    const data = getChatBodyData();
    if (data.isPregnant || data.postpartumDays > 0) return;

    const lowerText = text.toLowerCase();
    const phase = getBodyPhase('en');
    const isFertile = phase.includes('Ovulation') || phase.includes('Heat');
    
    const hasVaginalTag = /<!--\s*CUM_VAGINAL\s*-->/i.test(text);
    const hasAnalTag = /<!--\s*CUM_ANAL\s*-->/i.test(text);

    let canConceive = false;

    if (settings.mode === 'realism' && settings.gender === 'female' && hasVaginalTag) {
        canConceive = true;
    } else if (settings.mode === 'omegaverse') {
        if (settings.gender === 'female_omega' && hasVaginalTag) canConceive = true;
        if (settings.gender === 'male_omega' && hasAnalTag) canConceive = true;
    }

    if (!canConceive && !hasVaginalTag && !hasAnalTag) {
        const hasEjaculationInside = /кончил внутрь|излил семя|эякуляция внутрь|залил внутрь|узел|сцепка|завязал узел|cum inside|ejaculation inside|creampie|knotting|излился внутрь|выплеснул внутрь/i.test(lowerText);
        
        if (hasEjaculationInside) {
            const hasVaginalText = /вагинально|в писю|в киску|внутрь влагалища|влагалище|vagina|pussy|лоно|нутро/i.test(lowerText);
            const hasAnalText = /анально|в анус|в попу|в задницу|прямую кишку|anal|anus|ass|кишку/i.test(lowerText);

            if (settings.mode === 'realism' && settings.gender === 'female' && hasVaginalText && !hasAnalText) {
                canConceive = true; 
            } else if (settings.mode === 'omegaverse') {
                if (settings.gender === 'female_omega' && hasVaginalText && !hasAnalText) canConceive = true;
                if (settings.gender === 'male_omega' && hasAnalText && !hasVaginalText) canConceive = true; 
            }
        }
    }

    if (canConceive) {
        settings.globalRollsCount++;

        let finalChance = 0;
        if (data.contraception === 'none') {
            finalChance = isFertile ? (settings.mode === 'omegaverse' ? 85 : 25) : (settings.mode === 'omegaverse' ? 5 : 0.5);
        } else if (data.contraception === 'condom') {
            finalChance = 2;
        } else if (data.contraception === 'pills') {
            finalChance = 0.1;
        } else if (data.contraception === 'iud') {
            finalChance = 0.2;
        }

        const rollResult = Math.random() * 100;
        const isSuccessful = rollResult <= finalChance;
        const lang = getLanguage();

        if (isSuccessful) {
            if (settings.isNotificationsEnabled) {
                toastr.success(lang === 'en'
                    ? `🎲 Conception roll made! Result: ${rollResult.toFixed(1)}% of ${finalChance}% required. SUCCESSFUL CONCEPTION!`
                    : `🎲 Кубик на зачатие брошен! Результат: ${rollResult.toFixed(1)}% из ${finalChance}% необходимых. ЗАЧАТИЕ ПРОИЗОШЛО!`);
            }
            triggerPregnancy(data);
        } else {
            if (settings.isNotificationsEnabled) {
                toastr.info(lang === 'en'
                    ? `🎲 Conception roll made! Result: ${rollResult.toFixed(1)}% (needed <= ${finalChance}%). Missed.`
                    : `🎲 Кубик на зачатие брошен! Результат: ${rollResult.toFixed(1)}% (требовалось <= ${finalChance}%). Мимо.`);
            }
            saveSettingsDebounced();
            renderUI();
        }
    }
}

function triggerPregnancy(data) {
    data.isPregnant = true;
    data.pregnancyWeeks = 0; 
    data.pregnancyDays = 0; 
    data.rolledTrimesters = { 1: false, 2: false, 3: false }; 
    data.activeComplication = null;
    data.deliveryMethod = 'none';
    data.currentDeliveredCount = 0;

    const roll = Math.random() * 100;
    data.babiesCount = settings.mode === 'omegaverse' ? (roll > 92 ? 3 : roll > 70 ? 2 : 1) : (roll > 98.5 ? 3 : roll > 95 ? 2 : 1);
    data.babiesGenders = [];
    
    for (let i = 0; i < data.babiesCount; i++) {
        data.babiesGenders.push(generateBabyGender(settings.mode, 'en'));
    }

    data.fetalDiseaseId = null;
    if (settings.isFetalPathologyEnabled && Math.random() * 100 < 3) {
        data.fetalDiseaseId = getRandomFetalDiseaseId();
    }

    updateSymptomsData(data);
    saveSettingsDebounced(); 
    renderUI(); 
    updatePromptInjection(); 
    if (settings.isNotificationsEnabled) {
        toastr.success(getText('toastConception'));
    }
}

function checkBirthTrigger(text, messageIndex) {
    const data = getChatBodyData();
    if (!data.isPregnant || data.babiesGenders.length === 0) return;

    const chatId = getCurrentChatId();
    const msgKey = `${chatId}_${messageIndex}_birth`;

    const numberedTagRegex = /<!--\s*BIRTH_(NATURAL|C_SECTION)_(\d+)\s*-->/gi;
    let match;
    const foundNumbered = [];
    while ((match = numberedTagRegex.exec(text)) !== null) {
        foundNumbered.push({
            method: match[1].toLowerCase() === 'c_section' ? 'c_section' : 'natural',
            num: parseInt(match[2], 10)
        });
    }

    if (foundNumbered.length > 0) {
        foundNumbered.sort((a, b) => a.num - b.num);
        for (const item of foundNumbered) {
            const nextExpected = (data.currentDeliveredCount || 0) + 1;
            if (item.num === nextExpected && data.isPregnant && data.babiesGenders.length > 0) {
                deliverSingleBaby(data, item.method);
            }
        }
        return;
    }

    if (typeof messageIndex === 'number' && processedBirthMessages.has(msgKey)) {
        return;
    }

    const unnumberedRegex = /<!--\s*BIRTH_(NATURAL|C_SECTION)\s*-->/gi;
    let unnumberedMatch;
    let deliveredCountInPass = 0;
    while ((unnumberedMatch = unnumberedRegex.exec(text)) !== null) {
        if (!data.isPregnant || data.babiesGenders.length === 0) break;
        const method = unnumberedMatch[1].toLowerCase() === 'c_section' ? 'c_section' : 'natural';
        deliverSingleBaby(data, method);
        deliveredCountInPass++;
    }

    if (deliveredCountInPass > 0 && typeof messageIndex === 'number') {
        processedBirthMessages.add(msgKey);
    }
}

function deliverSingleBaby(data, method = 'natural') {
    const lang = getLanguage();
    const rawGender = data.babiesGenders.shift() || generateBabyGender(settings.mode, 'en');
    data.currentDeliveredCount = (data.currentDeliveredCount || 0) + 1;
    
    data.childrenList.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        gender: rawGender
    });
    
    data.babiesCount = data.babiesGenders.length;

    const displayGender = translateGender(rawGender, lang);

    if (data.babiesCount === 0) {
        data.isPregnant = false;
        data.pregnancyWeeks = 0;
        data.pregnancyDays = 0;
        data.currentDeliveredCount = 0;
        data.activeComplication = null;
        data.fetalDiseaseId = null;
        data.postpartumDays = 1;
        data.deliveryMethod = method;

        const methodText = method === 'c_section' 
            ? (lang === 'en' ? 'C-Section' : 'Кесарево сечение') 
            : (lang === 'en' ? 'Natural Delivery' : 'Естественные роды');
        if (settings.isNotificationsEnabled) {
            toastr.success(lang === 'en'
                ? `👶 Delivery complete! Baby (${displayGender}) delivered! Method: ${methodText}. Postpartum recovery begun.`
                : `👶 Все роды завершены! Малыш (${displayGender}) успешно родился! Способ: ${methodText}. Запущен восстановительный период.`);
        }
    } else {
        if (settings.isNotificationsEnabled) {
            toastr.info(lang === 'en'
                ? `👶 Baby born (${displayGender})! Remaining in womb: ${data.babiesCount}.`
                : `👶 Родился ребёнок (${displayGender})! В утробе остаётся еще малышей: ${data.babiesCount}.`);
        }
    }

    updatePromptInjection();
    saveSettingsDebounced();
    renderUI();
}

function processBirthTrigger(method = 'natural') {
    const data = getChatBodyData();
    if (!data.isPregnant) return;
    const lang = getLanguage();

    while (data.babiesCount > 0 || data.babiesGenders.length > 0) {
        const rawGender = data.babiesGenders.shift() || generateBabyGender(settings.mode, 'en');
        data.childrenList.push({
            id: Date.now() + Math.floor(Math.random() * 1000),
            gender: rawGender
        });
        data.babiesCount = data.babiesGenders.length;
    }

    data.isPregnant = false;
    data.pregnancyWeeks = 0; 
    data.pregnancyDays = 0; 
    data.currentDeliveredCount = 0;
    data.babiesCount = 0; 
    data.babiesGenders = []; 
    data.activeComplication = null;
    data.fetalDiseaseId = null;
    data.postpartumDays = 1; 
    data.deliveryMethod = method; 

    updatePromptInjection(); 
    saveSettingsDebounced();
    renderUI();
    
    const methodText = method === 'c_section' 
        ? (lang === 'en' ? 'C-Section' : 'Кесарево сечение') 
        : (lang === 'en' ? 'Natural Delivery' : 'Естественные роды');
    if (settings.isNotificationsEnabled) {
        toastr.success(lang === 'en'
            ? `👶 All births completed manually! Method: ${methodText}. Recovery phase started.`
            : `👶 Роды успешно завершены вручную! Способ: ${methodText}. Запущен период восстановления.`);
    }
}

function processMiscarriageTrigger() {
    const data = getChatBodyData();
    const lang = getLanguage();
    data.isPregnant = false;
    data.pregnancyWeeks = 0;
    data.pregnancyDays = 0;
    data.currentDeliveredCount = 0;
    data.babiesCount = 0;
    data.babiesGenders = [];
    data.activeComplication = null;
    data.fetalDiseaseId = null;
    data.postpartumDays = 1;
    data.deliveryMethod = 'miscarriage'; 

    updatePromptInjection(); 
    saveSettingsDebounced();
    renderUI();
    
    if (settings.isNotificationsEnabled) {
        toastr.error(lang === 'en'
            ? `🚨 CRITICAL EVENT: Due to acute complications, a spontaneous miscarriage occurred. Pregnancy terminated.`
            : `🚨 КРИТИЧЕСКОЕ СОБЫТИЕ: Из-за сильного ухудшения состояния произошел спонтанный выкидыш. Беременность прервана.`);
    }
}

// Промпт-инъекция СТРОГО на английском языке
function updatePromptInjection(isImmediateBirth = false) {
    if (!settings.isEnabled) { setExtensionPrompt(EXTENSION_NAME, '', extension_prompt_types.IN_CHAT, 0); return; }
    const data = getChatBodyData();
    const phaseEn = getBodyPhase('en');
    
    let prompt = `\n[OOC: SYSTEM NOTE — {{user}} Physiological Status]\n`;
    
    if (isImmediateBirth) {
        const lastChildren = data.childrenList.slice(-data.childrenList.length);
        prompt += `🚨 CRITICAL STORY EVENT: {{user}} is GIVING BIRTH right now in this exact scene!\n`;
        prompt += `Baby details to describe: ${lastChildren.map((c, i) => `Child #${i+1}: ${translateGender(c.gender, 'en')}`).join('; ')}.\n`;
        setExtensionPrompt(EXTENSION_NAME, prompt, extension_prompt_types.IN_CHAT, 0);
        return;
    }

    if (data.postpartumDays > 0) {
        const pData = getPostpartumData(data.postpartumDays, data.deliveryMethod, 'en');
        prompt += `Status: RECOVERY PHASE (Day ${data.postpartumDays}/40) | Event Outcome: ${data.deliveryMethod.toUpperCase()}\n`;
        prompt += `Physical Condition & Limitations: ${pData.desc}\n`;
        setExtensionPrompt(EXTENSION_NAME, prompt, extension_prompt_types.IN_CHAT, 0);
        return;
    }

    if (data.isPregnant && (data.pregnancyWeeks > 0 || data.cycleDay > settings.cycleLength)) {
        prompt += `Status: PREGNANT | Duration: ${data.pregnancyWeeks} weeks.\n`;
        const fetus = getFetusData(data.pregnancyWeeks, 'en');
        prompt += `Fetus Size: ${fetus.size} | Maternal Body: ${fetus.belly}. ${fetus.desc}\n`;
        
        const symptomsEn = getSymptomList(data.symptomPhaseKey, data.symptomIndices, 'en');
        if (symptomsEn.length > 0) {
            prompt += `Current Pregnancy Symptoms: ${symptomsEn.join(', ')}.\n`;
        }

        let revealCount = (settings.aiAwareness === 'full') || (settings.aiAwareness === 'dynamic' && data.pregnancyWeeks >= 12);
        let revealGenders = (settings.aiAwareness === 'full') || (settings.aiAwareness === 'dynamic' && data.pregnancyWeeks >= 20);

        if (revealCount) {
            prompt += `[MEDICAL RECORD - FIRST TRIMESTER ULTRASOUND COMPLETED]: Medical scans confirm {{user}} is carrying ${data.babiesCount} baby/babies in the womb.\n`;
            
            if (revealGenders) {
                prompt += `[MEDICAL RECORD - ANATOMY SCAN (WEEK 20)]: Scans confirm the genders are: ${data.babiesGenders.map(g => translateGender(g, 'en')).join(', ')}.\n`;
                if (data.fetalDiseaseId) {
                    const diseaseEn = getFetalDisease(data.fetalDiseaseId, 'en');
                    if (diseaseEn) {
                        prompt += `[MEDICAL RECORD - FETAL ANOMALY DETECTED (ANATOMY SCAN)]: The anatomy scan revealed a condition in the fetus: "${diseaseEn.name}". ${diseaseEn.desc} {{char}} is aware of this diagnosis and should reference it naturally.\n`;
                    }
                }
            } else {
                prompt += `[ULTRASOUND STAGE NOTICE]: Fetal sex and secondary gender are still completely OBSCURED from {{char}} (too early to visually determine them before week 20).\n`;
            }
        } else if (settings.aiAwareness === 'hidden') {
            prompt += `[SECRET DATA]: The number of babies and their genders are strictly CONCEALED from {{char}} (Medieval/Blind mode). {{char}} must not know headcount or sex until birth.\n`;
        } else {
            prompt += `[SECRET DATA]: Ultrasound screening has not occurred yet. Headcount and genders are completely unknown to {{char}}.\n`;
        }

        if (data.pregnancyWeeks >= 20) {
            const totalOriginal = data.babiesGenders.length + (data.currentDeliveredCount || 0);

            if (totalOriginal === 1) {
                prompt += `\n🚨 CRITICAL BIRTH LOGGING DIRECTIVE FOR {{char}}:
If {{user}} goes into labor, is currently giving birth, or delivers the baby in this specific response (natural delivery or C-section, full-term or preterm), you MUST append a hidden HTML tag at the absolute end of your response:
- For a natural delivery: <!--BIRTH_NATURAL-->
- For a Cesarean section (C-Section): <!--BIRTH_C_SECTION-->\n`;
            } else {
                const nextNum = (data.currentDeliveredCount || 0) + 1;
                prompt += `\n🚨 CRITICAL BIRTH LOGGING DIRECTIVE FOR {{char}} (MULTIPLE PREGNANCY):
{{user}} is carrying a multiple pregnancy (Total: ${totalOriginal} babies).
Babies already delivered: ${data.currentDeliveredCount || 0}.
Babies remaining in womb: ${data.babiesCount} (${data.babiesGenders.map(g => translateGender(g, 'en')).join(', ')}).

If a baby is physically delivered in this response, you MUST append the numbered tag for that baby at the absolute end of your response:
- If Baby #${nextNum} is delivered now: <!--BIRTH_NATURAL_${nextNum}--> (or <!--BIRTH_C_SECTION_${nextNum}-->)
${data.babiesGenders.length > 1 ? `- If Baby #${nextNum + 1} is ALSO delivered in this SAME response: <!--BIRTH_NATURAL_${nextNum + 1}--> (or <!--BIRTH_C_SECTION_${nextNum + 1}-->)` : ''}
⚠️ STRICT RULE: Append ONLY the tag matching the baby actually born in this scene. Do not append tags for unborn babies!\n`;
            }
        }
    } else {
        prompt += `Current Cycle Day: ${data.cycleDay}/${settings.cycleLength} | Phase: ${phaseEn}\n`;
        if (data.contraception !== 'none') {
            prompt += `Active Birth Control Method: ${data.contraception.toUpperCase()}.\n`;
        }
        const symptomsEn = getSymptomList(data.symptomPhaseKey, data.symptomIndices, 'en');
        if (symptomsEn.length > 0) prompt += `Current Physical Symptoms: ${symptomsEn.join(', ')}.\n`;
        
        prompt += `🚨 CRITICAL SYSTEM LOG DIRECTIVE FOR {{char}}: At the absolute end of your response text, you MUST append a hidden HTML comment summary ONLY IF a full climax/ejaculation has explicitly occurred inside {{user}} WITHIN THIS SPECIFIC RESPONSE. 
        Choose exactly one that matches the finished action and write it verbatim:
        - If ejaculation has fully completed inside the vagina: <!--CUM_VAGINAL-->
        - If ejaculation has fully completed inside the anus: <!--CUM_ANAL-->
        - If ejaculation has fully completed inside the mouth/oral: <!--CUM_ORAL-->
        ⚠️ STRICTION LIMITATION: You MUST only append this tag at the very end when the action is truly COMPLETE and the climax has happened. Do not include this tag for foreplay or ongoing descriptions. Do not append if no climax/ejaculation occurs.\n`;
    }

    setExtensionPrompt(EXTENSION_NAME, prompt, extension_prompt_types.IN_CHAT, 0);
}

function renderUI() {
    const data = getChatBodyData();
    const lang = getLanguage();
    updateSymptomsData(data);
    checkPregnancyComplications(data);

    let displayDate = getText('waitingDate');
    let inputDateValue = '';
    if (data.lastRpDate) { 
        const parts = data.lastRpDate.split('-'); 
        displayDate = `${parts[2]}.${parts[1]}.${parts[0]}`; 
        inputDateValue = `${parts[2]}.${parts[1]}.${parts[0]}`;
    }

    const currentSymptoms = getSymptomList(data.symptomPhaseKey, data.symptomIndices, lang);
    let symptomsHtml = '';
    if (currentSymptoms.length > 0) {
        symptomsHtml = `<div style="margin: 5px 0 10px 0; padding: 10px; background: rgba(244, 114, 182, 0.12); border-left: 3px solid #f472b6; border-radius: 4px; text-align: left;">
            <strong style="font-size: 0.9em; color: #f472b6; display: block; margin-bottom: 5px;">${getText('symptomsTitle')}</strong>
            <ul style="margin: 0; padding-left: 16px; font-size: 0.85em; line-height: 1.4; opacity: 0.95; color: var(--text-color);">${currentSymptoms.map(s => `<li style="margin-bottom: 2px;">• ${s}</li>`).join('')}</ul>
        </div>`;
    }

    let fetusHtml = '';
    let eddHtml = '';
    let fetalDiseaseHtml = '';
    let wombMapHtml = '';

    if (data.isPregnant && (data.pregnancyWeeks > 0 || data.cycleDay > settings.cycleLength)) {
        const fetus = getFetusData(data.pregnancyWeeks, lang);
        fetusHtml = `<div style="margin: 5px 0 10px 0; padding: 10px; background: rgba(56, 189, 248, 0.1); border-left: 3px solid #38bdf8; border-radius: 4px; text-align: left; font-size: 0.85em; line-height: 1.4;">
            <strong style="font-size: 1.05em; color: #38bdf8; display: block; margin-bottom: 5px;">${getText('fetusTitle')}</strong>
            • ${getText('fetusSizeLabel')} <span style="color: #38bdf8; font-weight: bold;">${fetus.size}</span><br>
            • ${getText('fetusWeightLabel')} <span>${fetus.weight}</span><br>
            • ${getText('fetusBellyLabel')} <span>${fetus.belly}</span><br>
            <span style="display: block; margin-top: 4px; opacity: 0.85; font-style: italic;">${fetus.desc}</span>
        </div>`;

        if (data.fetalDiseaseId) {
            const disease = getFetalDisease(data.fetalDiseaseId, lang);
            if (disease) {
                if (settings.aiAwareness === 'hidden') {
                    // Скрыто
                } else if (settings.aiAwareness === 'full' || (settings.aiAwareness === 'dynamic' && data.pregnancyWeeks >= 20)) {
                    fetalDiseaseHtml = `<div style="margin: 5px 0 10px 0; padding: 10px; background: rgba(251, 191, 36, 0.1); border-left: 3px solid #fbbf24; border-radius: 4px; text-align: left; font-size: 0.85em; line-height: 1.4;">
                        <strong style="font-size: 1.0em; color: #fbbf24; display: block; margin-bottom: 4px;">${getText('fetalAnomalyTitle')}</strong>
                        <b style="color: #fcd34d;">${disease.name}</b><br>
                        <span style="opacity: 0.9; display: block; margin-top: 4px; font-style: italic;">${disease.desc}</span>
                    </div>`;
                } else if (settings.aiAwareness === 'dynamic' && data.pregnancyWeeks < 20) {
                    fetalDiseaseHtml = `<div style="margin: 5px 0 10px 0; padding: 8px 10px; background: rgba(251, 191, 36, 0.06); border-left: 3px solid rgba(251, 191, 36, 0.35); border-radius: 4px; text-align: left; font-size: 0.82em; color: #92400e; font-style: italic;">
                        ${getText('fetalAnomalyLocked')}
                    </div>`;
                }
            }
        }

        if (settings.aiAwareness === 'hidden') {
            wombMapHtml = `
                <div style="border-top: 1px dashed rgba(255,255,255,0.1); margin-top: 5px; padding-top: 5px; color: #a1a1aa; font-style: italic; font-size: 0.85em;">
                    ${getText('medievalLocked')}
                </div>
            `;
        } else if (settings.aiAwareness === 'dynamic') {
            if (data.pregnancyWeeks >= 20) {
                wombMapHtml = `
                    <div style="border-top: 1px dashed rgba(255,255,255,0.1); margin-top: 5px; padding-top: 5px; color: #f472b6; font-size: 0.85em;">
                        ℹ️ <em>${getText('wombMap')}</em><br>
                        • ${getText('babiesCount')} <b>${data.babiesCount}</b><br>
                        • ${getText('babiesSex')} <b>${data.babiesGenders.map(g => translateGender(g, lang)).join(', ')}</b>
                    </div>
                `;
            } else if (data.pregnancyWeeks >= 12) {
                wombMapHtml = `
                    <div style="border-top: 1px dashed rgba(255,255,255,0.1); margin-top: 5px; padding-top: 5px; color: #f472b6; font-size: 0.85em;">
                        ℹ️ <em>${getText('wombMap')}</em><br>
                        • ${getText('babiesCount')} <b>${data.babiesCount}</b><br>
                        <span style="color: #a1a1aa; font-style: italic;">${getText('ultrasound20Locked')}</span>
                    </div>
                `;
            } else {
                wombMapHtml = `
                    <div style="border-top: 1px dashed rgba(255,255,255,0.1); margin-top: 5px; padding-top: 5px; color: #a1a1aa; font-style: italic; font-size: 0.85em;">
                        ${getText('ultrasound12Locked')}
                    </div>
                `;
            }
        } else {
            wombMapHtml = `
                <div style="border-top: 1px dashed rgba(255,255,255,0.1); margin-top: 5px; padding-top: 5px; color: #f472b6; font-size: 0.85em;">
                    ℹ️ <em>${getText('wombMap')}</em><br>
                    • ${getText('babiesCount')} <b>${data.babiesCount}</b><br>
                    • ${getText('babiesSex')} <b>${data.babiesGenders.map(g => translateGender(g, lang)).join(', ')}</b>
                </div>
            `;
        }

        if (data.lastRpDate) {
            const maxWeeks = settings.maxPregnancyWeeks || (settings.mode === 'omegaverse' ? 36 : 40);
            const daysRemaining = (maxWeeks * 7) - ((data.pregnancyWeeks * 7) + data.pregnancyDays);
            const parts = data.lastRpDate.split('-').map(Number);
            const currentTotalDays = dateToDays(parts[0], parts[1] - 1, parts[2]);
            const eddDateStr = daysToDateString(currentTotalDays + daysRemaining);
            const eddParts = eddDateStr.split('-');
            eddHtml = `<div style="margin-bottom: 4px;"><strong>${getText('eddLabel')}</strong> <span style="color: #f472b6; font-weight: bold;">${eddParts[2]}.${eddParts[1]}.${eddParts[0]}</span></div>`;
        }
    }

    let postpartumHtml = '';
    if (data.postpartumDays > 0) {
        const pData = getPostpartumData(data.postpartumDays, data.deliveryMethod, lang);
        const isCS = data.deliveryMethod === 'c_section';
        const isMiscarriage = data.deliveryMethod === 'miscarriage';
        
        let outcomeText = lang === 'en' ? 'Natural Delivery (Vaginal)' : 'Естественные роды (ЕР)';
        if (isCS) outcomeText = lang === 'en' ? 'Cesarean Section (C-Section)' : 'Кесарево сечение (КС)';
        if (isMiscarriage) outcomeText = lang === 'en' ? 'Miscarriage (Loss)' : 'Выкидыш (Прерывание беременности)';

        postpartumHtml = `<div style="margin: 5px 0 10px 0; padding: 10px; background: ${isMiscarriage ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'}; border-left: 3px solid ${isMiscarriage ? '#ef4444' : '#10b981'}; border-radius: 4px; text-align: left; font-size: 0.85em; line-height: 1.4;">
            <strong style="font-size: 1.05em; color: ${isMiscarriage ? '#ef4444' : '#10b981'}; display: block; margin-bottom: 4px;">${getText('postpartumHeader')}${data.postpartumDays}/40)</strong>
            <b>${getText('outcomeType')}</b> <span style="color: ${isMiscarriage ? '#ef4444' : '#10b981'}; font-weight: bold;">${outcomeText}</span><br>
            <b>${getText('stageLabel')}</b> <span>${pData.name}</span><br>
            <span style="opacity: 0.85; display: block; margin-top: 4px; font-style: italic;">${pData.desc}</span>
            
            <div style="margin-top: 8px; padding-top: 6px; border-top: 1px dashed ${isMiscarriage ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'};">
                <strong style="color: ${isMiscarriage ? '#f87171' : '#34d399'}; display: block; margin-bottom: 3px;">${getText('careTips')}</strong>
                ${isMiscarriage ? (lang === 'en' ? `
                    • Ensure complete physical and emotional rest; strictly eliminate stress.<br>
                    • Avoid thermal procedures (hot baths, saunas) and lifting heavy objects.<br>
                    • Allow reproductive system to naturally heal and clear.
                ` : `
                    • Обеспечьте полный физический и психоэмоциональный покой, полностью исключите стресс.<br>
                    • Категорически запрещены любые тепловые процедуры (горячие ванны, сауна) и подъем тяжестей.<br>
                    • Дайте репродуктивной системе очиститься и восстановиться.
                `) : (isCS ? (lang === 'en' ? `
                    • Disinfect surgical incision site regularly.<br>
                    • Use a postpartum support band when standing to support abdominal wall.<br>
                    • Avoid any strain on abdominal muscles; get out of bed via your side.<br>
                    • Do not lift items heavier than your newborn baby.
                ` : `
                    • Регулярно обрабатывайте антисептиками послеоперационный рубец на животе.<br>
                    • Обязательно используйте послеродовой бандаж при вставании для поддержки брюшной стенки.<br>
                    • Исключите любые нагрузки на мышцы пресса, вставайте с кровати аккуратно через бок.<br>
                    • Запрещено поднимать любые предметы, вес которых превышает вес новорожденного ребенка.
                `) : (lang === 'en' ? `
                    • Maintain strict postpartum hygiene (warm rinse after every bathroom visit).<br>
                    • Avoid prolonged hard sitting if perineal stitches are present.<br>
                    • Use sterile maternity pads for free lochia drainage.<br>
                    • Frequent nursing encourages natural uterine contractions.
                ` : `
                    • Соблюдайте строжайшую гигиену (подмывание теплой водой после каждого посещения туалета).<br>
                    • При наличии внутренних или внешних швов избегайте сидения на жестком.<br>
                    • Используйте специальные стерильные послеродовые прокладки для оттока лохий.<br>
                    • Чаще прикладывайте малыша к груди — это стимулирует сокращение матки.
                `))}
            </div>
        </div>`;
    }

    let complicationHtml = '';
    if (data.isPregnant && data.activeComplication && data.activeComplication.isDiscovered) {
        const comp = getComplication(data.activeComplication.id, lang);
        if (comp) {
            complicationHtml = `<div style="margin: 8px 0 10px 0; padding: 10px; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 6px; text-align: left; font-size: 0.85em; line-height: 1.4;">
                <strong style="color: #f87171; display: block; margin-bottom: 4px;">${getText('complicationTitle')} ${comp.name}</strong>
                <span style="opacity: 0.9; display: block; margin-bottom: 6px;">${comp.desc}</span>
                ${comp.curable ? `<button id="repro-cure-complication" class="menu_button" style="width: 100%; background: #059669; color: white; font-size: 11px; padding: 4px; font-weight: 600; justify-content: center;">${getText('cureBtn')}</button>` : ''}
            </div>`;
        }
    }

    let familyHtml = '';
    if (data.childrenList?.length > 0) {
        familyHtml = `<div style="margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.03); border: 1px dashed rgba(255,255,255,0.15); border-radius: 6px; text-align: left; font-size: 0.85em;">
            <strong style="color: #f472b6; display: block; margin-bottom: 6px;">${getText('newbornTitle')}</strong>
            ${data.childrenList.map((c, i) => `<div style="margin-bottom: 4px;">👶 ${getText('childLabel')} ${i+1}: <b>${translateGender(c.gender, lang)}</b></div>`).join('')}
        </div>`;
    }

    let genderOptionsHtml = '';
    if (settings.mode === 'realism') {
        genderOptionsHtml = `<option value="female" ${settings.gender === 'female' ? 'selected' : ''}>${getText('female')}</option>`;
    } else {
        genderOptionsHtml = `
            <option value="female_omega" ${settings.gender === 'female_omega' ? 'selected' : ''}>${getText('female_omega')}</option>
            <option value="male_omega" ${settings.gender === 'male_omega' ? 'selected' : ''}>${getText('male_omega')}</option>
        `;
    }

    const html = `
        <div class="repro-custom-btn-toggle" style="display: flex; justify-content: space-between; align-items: center; background: var(--input-bg, #1e1e2a); border: 1px solid var(--input-border, #334155); padding: 10px 14px; border-radius: ${isMenuCollapsed ? '10px' : '10px 10px 0 0'}; cursor: pointer; user-select: none; font-size: 14px; transition: background 0.15s;">
            <span style="color: #f472b6 !important; font-weight: 600;">${getText('title')}</span>
            <i id="repro-toggle-arrow" class="fa-solid ${isMenuCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'}" style="opacity: 0.6; font-size: 12px; margin-right: 4px;"></i>
        </div>
        
        <div id="repro-content-wrapper" style="${isMenuCollapsed ? 'display: none;' : 'display: block;'} background: rgba(0, 0, 0, 0.15); border: 1px solid var(--input-border, #334155); border-top: none; border-radius: 0 0 10px 10px; padding: 14px; box-sizing: border-box;">
            
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px dashed rgba(255,255,255,0.1); text-align: left;">
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="repro-is-enabled" ${settings.isEnabled ? 'checked' : ''} style="cursor: pointer; width: 15px; height: 15px; margin: 0;"/>
                        <label for="repro-is-enabled" style="font-size: 0.9em; cursor: pointer; user-select: none; font-weight: 600; color: var(--text-color, #f8fafc);">${getText('enableExt')}</label>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="repro-is-notifications-enabled" ${settings.isNotificationsEnabled ? 'checked' : ''} style="cursor: pointer; width: 15px; height: 15px; margin: 0;"/>
                        <label for="repro-is-notifications-enabled" style="font-size: 0.9em; cursor: pointer; user-select: none; opacity: 0.8; color: var(--text-color, #f8fafc);">${getText('enableNotif')}</label>
                    </div>
                </div>
                <div>
                    <select id="repro-lang-select" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: #f472b6; font-weight: 700; font-size: 12px; padding: 4px 8px; border-radius: 6px; outline: none; cursor: pointer;">
                        <option value="ru" ${settings.language === 'ru' ? 'selected' : ''}>RU</option>
                        <option value="en" ${settings.language === 'en' ? 'selected' : ''}>EN</option>
                    </select>
                </div>
            </div>

            <div id="repro-options-panel" style="display: flex; flex-direction: column; opacity: ${settings.isEnabled ? '1' : '0.35'}; pointer-events: ${settings.isEnabled ? 'auto' : 'none'}; transition: opacity 0.15s;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <label style="font-size: 0.9em; opacity: 0.85;">${getText('system')}</label>
                    <select id="repro-mode" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none;">
                        <option value="realism" ${settings.mode === 'realism' ? 'selected' : ''}>${getText('realism')}</option>
                        <option value="omegaverse" ${settings.mode === 'omegaverse' ? 'selected' : ''}>${getText('omegaverse')}</option>
                    </select>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <label style="font-size: 0.9em; opacity: 0.85;">${getText('physiology')}</label>
                    <select id="repro-gender" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none;">
                        ${genderOptionsHtml}
                    </select>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <label style="font-size: 0.9em; opacity: 0.85;">${getText('aiLogic')}</label>
                    <select id="repro-awareness" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none;">
                        <option value="dynamic" ${settings.aiAwareness === 'dynamic' ? 'selected' : ''}>${getText('ultrasound')}</option>
                        <option value="hidden" ${settings.aiAwareness === 'hidden' ? 'selected' : ''}>${getText('medieval')}</option>
                        <option value="full" ${settings.aiAwareness === 'full' ? 'selected' : ''}>${getText('knowsAll')}</option>
                    </select>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <label style="font-size: 0.9em; opacity: 0.85;">${getText('protectionLabel')}</label>
                    <select id="repro-contraception" ${data.isPregnant || data.postpartumDays > 0 ? 'disabled' : ''} style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none; opacity: ${data.isPregnant || data.postpartumDays > 0 ? '0.5' : '1'};">
                        <option value="none" ${data.contraception === 'none' ? 'selected' : ''}>${getText('protectionNone')}</option>
                        <option value="condom" ${data.contraception === 'condom' ? 'selected' : ''}>${getText('protectionCondom')}</option>
                        <option value="pills" ${data.contraception === 'pills' ? 'selected' : ''}>${getText('protectionPills')}</option>
                        <option value="iud" ${data.contraception === 'iud' ? 'selected' : ''}>${getText('protectionIud')}</option>
                    </select>
                </div>

                <div style="background: rgba(0, 0, 0, 0.25); border-left: 3px solid #f472b6; border-radius: 4px; padding: 10px; margin: 12px 0; font-size: 0.9em; text-align: left;">
                    <div style="margin-bottom: 4px;"><strong>${settings.mode === 'realism' ? getText('phaseRealism') : getText('phaseOmega')}</strong> <span style="color: #4ade80; font-weight: 700;">${getBodyPhase(lang)}</span></div>
                    
                    ${symptomsHtml}
                    ${fetusHtml}
                    ${fetalDiseaseHtml}
                    ${postpartumHtml}
                    ${complicationHtml}
                    ${familyHtml}

                    ${(data.isPregnant && (data.pregnancyWeeks > 0 || data.cycleDay > settings.cycleLength)) ? `
                        <div style="margin-bottom: 4px;"><strong>${getText('termInRp')}</strong> ${data.pregnancyWeeks} ${getText('weeksShort')} ${data.pregnancyDays} ${getText('daysShort')}</div>
                        ${eddHtml}
                        ${wombMapHtml}
                    ` : `
                        ${data.postpartumDays === 0 ? `<div style="margin-bottom: 4px;"><strong>${getText('cycleDayLabel')}</strong> ${data.cycleDay} из ${settings.cycleLength}</div>` : ''}
                    `}
                    <div style="font-size: 0.85em; color: #64748b; margin-top: 6px;">📅 ${getText('sync')} ${displayDate}</div>
                </div>

                ${data.isPregnant ? `
                    <button id="repro-btn-birth-trigger" class="menu_button" style="width: 100%; background: #10b981; color: white; font-weight: 700; margin-bottom: 10px; padding: 8px 0; justify-content: center;">${getText('giveBirthBtn')}</button>
                ` : ''}

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <label style="font-size: 0.9em; opacity: 0.85;">${getText('rpDateLabel')}</label>
                    <input type="text" id="repro-input-rpdate" placeholder="ДД.ММ.ГГГГ" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none;" value="${inputDateValue}"/>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <label style="font-size: 0.9em; opacity: 0.85;">${getText('cycleLengthLabel')}</label>
                    <input type="number" id="repro-input-cycle" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none;" value="${settings.cycleLength}"/>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <label style="font-size: 0.9em; opacity: 0.85;">${getText('maxWeeksLabel')}</label>
                    <input type="number" id="repro-input-maxweeks" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none;" value="${settings.maxPregnancyWeeks || 40}" min="1" max="50"/>
                </div>
                
                ${data.isPregnant ? `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <label style="font-size: 0.9em; opacity: 0.85;">${getText('pregnancyWeekLabel')}</label>
                        <input type="number" id="repro-input-weeks" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none;" value="${data.pregnancyWeeks}"/>
                    </div>
                ` : `
                    ${data.postpartumDays === 0 ? `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <label style="font-size: 0.9em; opacity: 0.85;">${getText('cycleDayLabel')} </label>
                        <input type="number" id="repro-input-day" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none;" value="${data.cycleDay}"/>
                    </div>` : ''}
                `}

                <button id="repro-apply-params" class="menu_button type_primary" style="width: 100%; margin-top: 10px; font-weight: 600;">${getText('applyBtn')}</button>

                ${(!data.isPregnant && data.postpartumDays === 0) ? `
                    <div style="background: rgba(244, 114, 182, 0.03); border: 1px dashed rgba(244, 114, 182, 0.2); border-radius: 8px; padding: 12px; margin: 14px 0 10px 0; text-align: left;">
                        <div style="font-size: 0.85em; font-weight: 700; color: #f472b6; margin-bottom: 8px; text-transform: uppercase;">${getText('initPregnancyHeader')}</div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <label style="font-size: 0.9em; opacity: 0.85;">${getText('manualWeeks')}</label>
                            <input type="number" id="repro-manual-weeks" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none;" value="4" min="0" max="40"/>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <label style="font-size: 0.9em; opacity: 0.85;">${getText('manualCount')} </label>
                            <input type="number" id="repro-manual-count" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none;" value="1" min="1" max="3"/>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                            <input type="checkbox" id="repro-fetal-pathology-enabled" ${settings.isFetalPathologyEnabled ? 'checked' : ''} style="cursor: pointer; width: 14px; height: 14px; margin: 0; flex-shrink: 0;"/>
                            <label for="repro-fetal-pathology-enabled" style="font-size: 0.85em; cursor: pointer; user-select: none; opacity: 0.8; color: var(--text-color, #f8fafc); line-height: 1.3;">${getText('fetalPathologyLabel')} <span style="opacity: 0.55; font-style: italic;">${getText('fetalPathologySub')}</span></label>
                        </div>
                        <button id="repro-btn-manual-preg" class="menu_button" style="width: 100%; background: #db2777; color: white; font-weight: 600;">${getText('startPregnancyBtn')}</button>
                    </div>
                ` : ''}

                ${data.isPregnant ? `
                    <button id="repro-reset-pregnancy-only" class="menu_button type_warning" style="width: 100%; margin-top: 10px; font-weight: 600;">${getText('resetPregnancyBtn')}</button>
                ` : ''}

                <button id="repro-reset" class="menu_button type_danger" style="width: 100%; margin-top: 10px; font-weight: 600;">${getText('resetAllBtn')}</button>
                
                <div style="margin-top: 14px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 0.78em; color: #64748b; text-align: center; font-style: italic; user-select: none;">
                    ${getText('globalRollsLabel')} <span id="repro-global-rolls-count" style="font-weight: bold; font-family: monospace; color: #94a3b8; margin-left: 2px;">${settings.globalRollsCount}</span>
                </div>
            </div>
        </div>
    `;

    let container = $('#repro-system-extension-container');
    if (container.length === 0) {
        container = $('<div id="repro-system-extension-container" style="grid-column: auto; margin-bottom: 10px;"></div>');
        $('#extensions_settings').append(container);
    }
    container.html(html);

    $('#repro-lang-select').off('change').on('change', function() {
        settings.language = $(this).val();
        saveSettingsDebounced();
        renderUI();
        updatePromptInjection();
    });

    $('#repro-is-enabled').off('change').on('change', function() {
        settings.isEnabled = $(this).is(':checked');
        saveSettingsDebounced();
        updatePromptInjection();
        renderUI(); 
    });

    $('#repro-is-notifications-enabled').off('change').on('change', function() {
        settings.isNotificationsEnabled = $(this).is(':checked');
        saveSettingsDebounced();
    });

    $('#repro-contraception').off('change').on('change', function() {
        data.contraception = $(this).val();
        saveSettingsDebounced();
        updatePromptInjection();
    });

    $('#repro-fetal-pathology-enabled').off('change').on('change', function() {
        settings.isFetalPathologyEnabled = $(this).is(':checked');
        saveSettingsDebounced();
    });

    $('#repro-apply-params').on('click', function() {
        const bodyData = getChatBodyData();
        settings.cycleLength = parseInt($('#repro-input-cycle').val()) || 28;
        settings.maxPregnancyWeeks = parseInt($('#repro-input-maxweeks').val()) || 40;
        
        const manualDateVal = $('#repro-input-rpdate').val();
        const normalized = normalizeInputDate(manualDateVal);
        if (normalized) bodyData.lastRpDate = normalized;

        if (bodyData.isPregnant) { 
            bodyData.pregnancyWeeks = parseInt($('#repro-input-weeks').val()) || 0; 
            bodyData.pregnancyDays = 0; 
        } else if (bodyData.postpartumDays === 0) { 
            bodyData.cycleDay = parseInt($('#repro-input-day').val()) || 1; 
        }

        updateSymptomsData(bodyData);
        saveSettingsDebounced(); 
        renderUI(); 
        updatePromptInjection(); 
        if (settings.isNotificationsEnabled) toastr.success(getText('toastSaved'));
    });

    $('#repro-btn-birth-trigger').off('click').on('click', function() {
        const method = confirm(settings.language === 'en' 
            ? "Perform delivery via Cesarean Section (C-Section)? [OK - C-Section, Cancel - Natural Birth]"
            : "Выполнить родоразрешение путем операции Кесарева сечения (КС)? [ОК - Кесарево, Отмена - Естественные роды]") ? 'c_section' : 'natural';
        processBirthTrigger(method);
    });

    $('#repro-cure-complication').off('click').on('click', function() {
        if (data.activeComplication) {
            const lang = getLanguage();
            const comp = getComplication(data.activeComplication.id, lang);
            if (settings.isNotificationsEnabled && comp) {
                toastr.success(lang === 'en'
                    ? `Successfully treated: ${comp.name}`
                    : `Успешно купировано: ${comp.name}`);
            }
            data.activeComplication = null; 
            saveSettingsDebounced(); 
            renderUI(); 
            updatePromptInjection();
        }
    });

    $('.repro-custom-btn-toggle').off('click').on('click', function() {
        isMenuCollapsed = !isMenuCollapsed; 
        $('#repro-content-wrapper').slideToggle(150);
        const arrow = $('#repro-toggle-arrow');
        if (isMenuCollapsed) { 
            arrow.removeClass('fa-chevron-up').addClass('fa-chevron-down'); 
            $('.repro-custom-btn-toggle').css('border-radius', '10px'); 
        } else { 
            arrow.removeClass('fa-chevron-down').addClass('fa-chevron-up'); 
            $('.repro-custom-btn-toggle').css('border-radius', '10px 10px 0 0'); 
        }
    });

    $('#repro-mode').off('change').on('change', function() { 
        settings.mode = $(this).val(); 
        if (settings.mode === 'realism') {
            settings.gender = 'female';
        } else if (settings.mode === 'omegaverse' && settings.gender === 'female') {
            settings.gender = 'female_omega';
        }
        updateSymptomsData(getChatBodyData());
        saveSettingsDebounced(); 
        renderUI(); 
        updatePromptInjection(); 
    });

    $('#repro-gender').off('change').on('change', function() { 
        settings.gender = $(this).val(); 
        saveSettingsDebounced(); 
        renderUI(); 
        updatePromptInjection(); 
    });

    $('#repro-awareness').off('change').on('change', function() { 
        settings.aiAwareness = $(this).val(); 
        saveSettingsDebounced(); 
        renderUI(); 
        updatePromptInjection(); 
    });

    $('#repro-btn-manual-preg').off('click').on('click', function() {
        const bodyData = getChatBodyData();
        const weeks = parseInt($('#repro-manual-weeks').val()) || 0;
        const count = parseInt($('#repro-manual-count').val()) || 1;

        bodyData.isPregnant = true; 
        bodyData.pregnancyWeeks = weeks; 
        bodyData.pregnancyDays = 0; 
        bodyData.babiesCount = count; 
        bodyData.currentDeliveredCount = 0;
        bodyData.rolledTrimesters = { 1: false, 2: false, 3: false }; 
        bodyData.activeComplication = null;
        bodyData.babiesGenders = [];
        bodyData.deliveryMethod = 'none';
        
        for (let i = 0; i < count; i++) {
            bodyData.babiesGenders.push(generateBabyGender(settings.mode, 'en'));
        }

        bodyData.fetalDiseaseId = null;
        if (settings.isFetalPathologyEnabled && Math.random() * 100 < 3) {
            bodyData.fetalDiseaseId = getRandomFetalDiseaseId();
        }

        updateSymptomsData(bodyData);
        saveSettingsDebounced(); 
        renderUI(); 
        updatePromptInjection(); 
        if (settings.isNotificationsEnabled) toastr.success(`${getText('toastManualPreg')}${weeks}`);
    });

    $('#repro-reset-pregnancy-only').off('click').on('click', function() {
        const bodyData = getChatBodyData();
        bodyData.isPregnant = false; 
        bodyData.pregnancyWeeks = 0; 
        bodyData.pregnancyDays = 0; 
        bodyData.currentDeliveredCount = 0;
        bodyData.babiesCount = 0; 
        bodyData.babiesGenders = []; 
        bodyData.rolledTrimesters = { 1: false, 2: false, 3: false }; 
        bodyData.activeComplication = null;
        bodyData.deliveryMethod = 'none';
        bodyData.fetalDiseaseId = null;

        updateSymptomsData(bodyData);
        processedBirthMessages.clear();
        saveSettingsDebounced(); 
        renderUI(); 
        updatePromptInjection(); 
        if (settings.isNotificationsEnabled) toastr.info(getText('toastResetPreg'));
    });

    $('#repro-reset').off('click').on('click', function() {
        const confirmText = settings.language === 'en' 
            ? "Are you sure you want to completely clear the reproductive data for this chat?" 
            : "Вы уверены, что хотите полностью очистить данные этого чата?";
        if (confirm(confirmText)) {
            const chatId = getCurrentChatId();
            settings.chatPregnancyData[chatId] = createDefaultBodyData();
            processedBirthMessages.clear();
            saveSettingsDebounced(); 
            renderUI(); 
            updatePromptInjection(); 
            if (settings.isNotificationsEnabled) toastr.warning(getText('toastResetAll'));
        }
    });
}

function processIncomingMessage(messageIndex, isUser = false) {
    if (!settings.isEnabled) return; 
    const context = typeof SillyTavern?.getContext === 'function' ? SillyTavern.getContext() : null;
    const chat = context ? context.chat : window.chat;
    if (!chat) return;

    let text = null;
    let idx = null;
    if (typeof messageIndex === 'number' && chat[messageIndex]) {
        text = chat[messageIndex].mes;
        idx = messageIndex;
    } else if (typeof messageIndex === 'object' && messageIndex?.mes) {
        text = messageIndex.mes;
        idx = messageIndex?.id ?? null;
    } else if (chat.length > 0) {
        idx = chat.length - 1;
        text = chat[idx]?.mes;
    }

    if (!text) return;

    if (isUser) {
        handleUserMessageTime(text);
        checkConceptionTrigger(text);
    } else {
        handleAiMessageTime(text);
        checkConceptionTrigger(text);
        checkBirthTrigger(text, idx);
    }
    updatePromptInjection();
}

function scanLastDateFromChat() {
    const context = typeof SillyTavern?.getContext === 'function' ? SillyTavern.getContext() : null;
    const chat = context ? context.chat : window.chat;
    if (!chat || chat.length === 0) return;

    for (let i = chat.length - 1; i >= 0; i--) {
        const mesText = chat[i]?.mes;
        if (mesText) {
            const parsed = parseRpDateFromText(mesText);
            if (parsed) {
                const bodyData = getChatBodyData();
                if (!bodyData.lastRpDate) {
                    bodyData.lastRpDate = daysToDateString(dateToDays(parsed.year, parsed.month, parsed.day));
                    saveSettingsDebounced();
                    renderUI();
                }
                break;
            }
        }
    }
}

jQuery(async () => {
    loadSettings();
    scanLastDateFromChat();

    if (typeof eventSource?.on === 'function') { 
        eventSource.on(event_types.MESSAGE_SENT, async (messageIndex) => {
            processIncomingMessage(messageIndex, true);
        });

        eventSource.on(event_types.MESSAGE_RECEIVED, async (messageIndex) => {
            processIncomingMessage(messageIndex, false);
        });

        if (event_types.CHARACTER_MESSAGE_RENDERED) {
            eventSource.on(event_types.CHARACTER_MESSAGE_RENDERED, async (messageIndex) => {
                processIncomingMessage(messageIndex, false);
            });
        }

        if (event_types.MESSAGE_EDITED) {
            eventSource.on(event_types.MESSAGE_EDITED, async (messageIndex) => {
                processIncomingMessage(messageIndex, false);
            });
        }

        if (event_types.MESSAGE_SWIPED) {
            eventSource.on(event_types.MESSAGE_SWIPED, async (messageIndex) => {
                processIncomingMessage(messageIndex, false);
            });
        }

        if (event_types.CHAT_CHANGED) {
            eventSource.on(event_types.CHAT_CHANGED, () => { 
                pendingUserTimeskipDays = 0;
                processedBirthMessages.clear();
                loadSettings(); 
                scanLastDateFromChat();
            });
        }
    }
});
