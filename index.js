import { 
    saveSettingsDebounced, 
    eventSource, 
    event_types,
    setExtensionPrompt,
    extension_prompt_types
} from '../../../../script.js';
import { extension_settings } from '../../../extensions.js';
import { 
    getRandomSymptomIndices, 
    rollComplication, 
    getComplication, 
    getRandomFetalDiseaseId, 
    getFetalDisease 
} from './symptoms.js';
import { getText, translateGender } from './translations.js';
import { 
    dateToDays, 
    daysToDateString, 
    normalizeInputDate, 
    parseRpDateFromText, 
    parseRelativeDaysFromText 
} from './dateUtils.js';
import { buildSystemPrompt } from './promptBuilder.js';
import { renderUI, exportReproLogs } from './ui.js';

const EXTENSION_NAME = 'st-advanced-reproductive-system';

const DEFAULT_SETTINGS = {
    isEnabled: true,
    isNotificationsEnabled: true,
    isSecretConception: true,
    isIrregularCycle: true,
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
        isDiscovered: false,
        pregnancyDaysTotal: 0,
        pregnancyWeeks: 0,
        pregnancyDays: 0,
        babiesCount: 0,
        babiesGenders: [],
        babiesDiseases: [],
        currentDeliveredCount: 0,
        currentCycleTargetLength: 28,
        symptomPhaseKey: null,
        symptomIndices: [],
        rolledTrimesters: { 1: false, 2: false, 3: false },
        fetalDemiseRolledTrimesters: { 1: false, 2: false, 3: false },
        fetalDemise: null,
        activeComplication: null,
        postpartumDays: 0,
        deliveryMethod: 'none',
        childrenList: [],
        contraception: 'none',
        fetalDiseaseId: null,
        activityLogs: []
    };
}

let settings = Object.assign({}, DEFAULT_SETTINGS);
let isMenuCollapsed = true; 
let pendingUserTimeskipDays = 0;
let activeChatId = null;
const processedBirthMessages = new Set();

function getLanguage() {
    return settings.language || 'ru';
}

function logReproEvent(message) {
    const data = getChatBodyData();
    if (!data.activityLogs) data.activityLogs = [];
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const rpDateStr = data.lastRpDate ? `[RP Date: ${data.lastRpDate}]` : `[RP Date: N/A]`;
    data.activityLogs.push(`[${timestamp}] ${rpDateStr} ${message}`);
    if (data.activityLogs.length > 250) data.activityLogs.shift();
}

function getCurrentChatId() {
    return (typeof SillyTavern?.getContext === 'function') ? (SillyTavern.getContext().chatId || window.chat_id || 'default') : (window.chat_id || 'default');
}

function getChatBodyData() {
    const chatId = getCurrentChatId();
    if (!settings.chatPregnancyData[chatId]) {
        const context = typeof SillyTavern?.getContext === 'function' ? SillyTavern.getContext() : null;
        const chat = context ? context.chat : window.chat;
        
        if (activeChatId && activeChatId !== chatId && settings.chatPregnancyData[activeChatId] && Array.isArray(chat) && chat.length > 1) {
            settings.chatPregnancyData[chatId] = JSON.parse(JSON.stringify(settings.chatPregnancyData[activeChatId]));
        } else {
            settings.chatPregnancyData[chatId] = createDefaultBodyData();
        }
    }
    activeChatId = chatId;
    const data = settings.chatPregnancyData[chatId];
    if (data.postpartumDays === undefined) data.postpartumDays = 0;
    if (data.deliveryMethod === undefined) data.deliveryMethod = 'none';
    if (!data.childrenList) data.childrenList = [];
    if (!data.rolledTrimesters) data.rolledTrimesters = { 1: false, 2: false, 3: false };
    if (!data.fetalDemiseRolledTrimesters) data.fetalDemiseRolledTrimesters = { 1: false, 2: false, 3: false };
    if (data.fetalDemise === undefined) data.fetalDemise = null;
    if (data.contraception === undefined) data.contraception = 'none'; 
    if (data.isDiscovered === undefined) data.isDiscovered = data.isPregnant;
    if (data.pregnancyDaysTotal === undefined) data.pregnancyDaysTotal = (data.pregnancyWeeks || 0) * 7 + (data.pregnancyDays || 0);
    if (data.fetalDiseaseId === undefined) data.fetalDiseaseId = data.fetalDisease?.id || null;
    if (!data.babiesDiseases) {
        data.babiesDiseases = (data.babiesGenders || []).map((_, i) => (i === 0 ? data.fetalDiseaseId : null));
    }
    if (data.currentDeliveredCount === undefined) data.currentDeliveredCount = 0;
    if (data.currentCycleTargetLength === undefined) data.currentCycleTargetLength = settings.cycleLength || 28;
    if (!data.symptomIndices) data.symptomIndices = [];
    if (!data.activityLogs) data.activityLogs = [];
    return data;
}

function rollNewCycleTarget() {
    const base = settings.cycleLength || 28;
    if (!settings.isIrregularCycle) return base;
    
    const roll = Math.random() * 100;
    let variance = 0;
    if (roll < 65) {
        variance = Math.floor(Math.random() * 3) - 1;
    } else if (roll < 90) {
        variance = Math.random() > 0.3 ? (Math.floor(Math.random() * 4) + 2) : -2;
    } else {
        variance = Math.floor(Math.random() * 7) + 6;
    }
    const result = Math.max((settings.periodDuration || 5) + 6, base + variance);
    logReproEvent(`[CYCLE] New cycle target duration secretly rolled: ${result} days (Base: ${base}, Variance: ${variance > 0 ? '+' + variance : variance})`);
    return result;
}

function generateBabyGender(mode, lang = 'ru') {
    const isBoy = Math.random() > 0.5;
    const isRu = lang === 'ru';
    
    if (mode === 'omegaverse') {
        const roll = Math.random() * 100;
        let sec = isRu ? 'Бета' : 'Beta';
        if (roll < 25) sec = isRu ? 'Альфа' : 'Alpha'; 
        else if (roll < 50) sec = isRu ? 'Омега' : 'Omega'; 
        
        if (isRu) return isBoy ? `${sec}-мальчик ♂` : `${sec}-девочка ♀`;
        return isBoy ? `${sec} Boy ♂` : `${sec} Girl ♀`;
    } else {
        if (isRu) return isBoy ? 'Мальчик ♂' : 'Девочка ♀';
        return isBoy ? 'Boy ♂' : 'Girl ♀';
    }
}

function getBodyPhase(lang = 'ru') {
    const data = getChatBodyData();
    const l = (lang === 'en') ? 'en' : 'ru';
    const isRevealedPregnancy = data.isPregnant && (data.isDiscovered || !settings.isSecretConception);

    if (data.postpartumDays > 0) return getText('postpartumPhase', l);
    if (isRevealedPregnancy) {
        return settings.mode === 'realism' ? getText('pregnancy', l) : getText('pregnancyOmega', l);
    }

    const day = data.cycleDay;
    const targetLength = data.currentCycleTargetLength || settings.cycleLength || 28;
    const periodDays = settings.periodDuration || 5;

    if (settings.mode === 'realism') {
        if (day > targetLength) return getText('delayed', l);
        if (day <= periodDays) return getText('menstruation', l);
        
        const ovulPeak = Math.max(periodDays + 2, targetLength - 14);
        const ovulStart = Math.max(periodDays + 1, ovulPeak - 3);
        const ovulEnd = ovulPeak + 1;

        if (day < ovulStart) return getText('follicular', l);
        if (day >= ovulStart && day <= ovulEnd) return getText('ovulation', l);
        return getText('luteal', l);
    } else {
        if (day > targetLength) return getText('delayedHeat', l);
        if (day <= periodDays) return getText('heat', l);
        return getText('quiescence', l);
    }
}

function updateSymptomsData(data) {
    if (data.postpartumDays > 0) {
        data.symptomPhaseKey = null;
        data.symptomIndices = [];
        return;
    }

    const isRevealedPregnancy = data.isPregnant && (data.isDiscovered || !settings.isSecretConception);
    let phaseKey = null;

    if (isRevealedPregnancy) {
        const week = data.pregnancyWeeks;
        if (week <= 12) phaseKey = 'preg_trimester_1';
        else if (week >= 13 && week <= 26) phaseKey = 'preg_trimester_2';
        else phaseKey = 'preg_trimester_3';
    } else {
        const day = data.cycleDay;
        const targetLength = data.currentCycleTargetLength || settings.cycleLength || 28;
        const periodDays = settings.periodDuration || 5;

        if (settings.mode === 'realism') {
            if (day <= targetLength) {
                const ovulPeak = Math.max(periodDays + 2, targetLength - 14);
                const ovulStart = Math.max(periodDays + 1, ovulPeak - 3);
                const ovulEnd = ovulPeak + 1;

                if (day <= periodDays) phaseKey = 'menstruation';
                else if (day < ovulStart) phaseKey = 'follicular';
                else if (day >= ovulStart && day <= ovulEnd) phaseKey = 'ovulation';
                else phaseKey = 'luteal';
            }
        } else {
            if (day <= periodDays) {
                phaseKey = (settings.gender === 'male_omega') ? 'heat_male' : 'heat_female';
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
    const isRevealedPregnancy = data.isPregnant && (data.isDiscovered || !settings.isSecretConception);
    if (!isRevealedPregnancy) return;

    const currentWeek = data.pregnancyWeeks;
    let currentTrimester = 1;
    if (currentWeek >= 13 && currentWeek <= 26) currentTrimester = 2;
    else if (currentWeek >= 27) currentTrimester = 3;

    if (!data.rolledTrimesters[currentTrimester] && !data.activeComplication) {
        data.rolledTrimesters[currentTrimester] = true;
        const rolled = rollComplication(currentTrimester);
        if (rolled) {
            data.activeComplication = rolled;
            logReproEvent(`[COMPLICATION] Complication rolled for trimester ${currentTrimester}: ${rolled.id} (Triggers at week ${rolled.triggerWeek})`);
        }
    }

    if (data.activeComplication && !data.activeComplication.isDiscovered) {
        if (currentWeek >= data.activeComplication.triggerWeek) {
            data.activeComplication.isDiscovered = true;
            const comp = getComplication(data.activeComplication.id, getLanguage());
            logReproEvent(`[COMPLICATION DISCOVERED] ${data.activeComplication.id} diagnosed at week ${currentWeek}`);
            if (settings.isNotificationsEnabled && comp) {
                toastr.error(`🚨 ${getText('complicationTitle', getLanguage())} «${comp.name}»!`);
            }
        }
    }
}

function checkFetalDemise(data) {
    if (!data.isPregnant || !settings.isFetalPathologyEnabled || (data.fetalDemise && data.fetalDemise.isDead)) return;
    
    const week = data.pregnancyWeeks;
    let currentTrimester = 1;
    if (week >= 13 && week <= 27) currentTrimester = 2;
    else if (week >= 28) currentTrimester = 3;

    if (!data.fetalDemiseRolledTrimesters[currentTrimester]) {
        data.fetalDemiseRolledTrimesters[currentTrimester] = true;
        
        let demiseChance = 0;
        if (currentTrimester === 1) demiseChance = 10;
        else if (currentTrimester === 2) demiseChance = 1.5;
        else if (currentTrimester === 3) demiseChance = 0.4;

        const roll = Math.random() * 100;
        if (roll < demiseChance) {
            data.fetalDemise = {
                isDead: true,
                daysSinceDemise: 0,
                hasInfection: false
            };
            logReproEvent(`[FETAL DEMISE ROLLED] Secret missed miscarriage occurred at week ${week} (Trimester ${currentTrimester}, Roll: ${roll.toFixed(2)}% < ${demiseChance}%).`);
        }
    }
}

function updatePromptInjection(isImmediateBirth = false) {
    if (!settings.isEnabled) { 
        setExtensionPrompt(EXTENSION_NAME, '', extension_prompt_types.IN_CHAT, 0); 
        return; 
    }
    const data = getChatBodyData();
    const phaseEn = getBodyPhase('en');
    const prompt = buildSystemPrompt({ settings, data, phaseEn, isImmediateBirth });
    setExtensionPrompt(EXTENSION_NAME, prompt, extension_prompt_types.IN_CHAT, 0);
}

function handleRefreshUI() {
    const data = getChatBodyData();
    updateSymptomsData(data);
    checkPregnancyComplications(data);
    checkFetalDemise(data);
    renderUI({ settings, data, isMenuCollapsed, getBodyPhase });
}

function advanceBodyTime(days) {
    const data = getChatBodyData();
    const lang = getLanguage();
    
    if (data.postpartumDays > 0) {
        data.postpartumDays += days;
        const maxRecoveryDays = (data.deliveryMethod === 'miscarriage') ? 14 : 40;
        if (data.postpartumDays > maxRecoveryDays) {
            data.postpartumDays = 0;
            data.deliveryMethod = 'none';
            data.cycleDay = 1; 
            data.currentCycleTargetLength = rollNewCycleTarget();
            logReproEvent(`[POSTPARTUM] Recovery completed after ${maxRecoveryDays} days. New cycle initiated.`);
            if (settings.isNotificationsEnabled) {
                toastr.success(lang === 'en' 
                    ? "Postpartum recovery complete. Reproductive cycle restarted."
                    : "Послеродовое восстановление завершено. Репродуктивный цикл запущен.");
            }
        }
        return;
    }

    if (data.isPregnant) {
        checkFetalDemise(data);

        if (data.fetalDemise && data.fetalDemise.isDead) {
            data.fetalDemise.daysSinceDemise += days;
            
            if (data.fetalDemise.daysSinceDemise >= 16 && !data.fetalDemise.hasInfection) {
                data.fetalDemise.hasInfection = true;
                logReproEvent(`[FETAL DEMISE COMPLICATION] Secondary inflammation / infection started due to prolonged unexpelled tissue (>16 days).`);
            }

            if (data.fetalDemise.daysSinceDemise >= 21) {
                logReproEvent(`[FETAL DEMISE RESOLUTION] Stage 3 reached (21+ days): spontaneous expulsion / miscarriage triggered.`);
                processMiscarriageTrigger();
                return;
            }
        }

        if (data.activeComplication && data.activeComplication.id === 'miscarriage_threat_early' && data.activeComplication.isDiscovered) {
            for (let i = 0; i < days; i++) {
                if (Math.random() * 100 < 10) { 
                    processMiscarriageTrigger();
                    return; 
                }
            }
        }

        const prevWeeks = data.pregnancyWeeks;
        data.pregnancyDaysTotal += days;
        data.pregnancyWeeks = Math.floor(data.pregnancyDaysTotal / 7);
        data.pregnancyDays = data.pregnancyDaysTotal % 7;
        data.cycleDay += days;

        const autoDiscoveryWeek = (settings.aiAwareness === 'hidden') ? 9 : 6;
        if (!data.isDiscovered && data.pregnancyWeeks >= autoDiscoveryWeek) {
            data.isDiscovered = true;
            logReproEvent(`[PREGNANCY DISCOVERED] Auto-confirmed at ${data.pregnancyWeeks} obstetric weeks.`);
            if (settings.isNotificationsEnabled) {
                if (settings.aiAwareness === 'hidden') {
                    toastr.success(lang === 'en'
                        ? `🚨 Body changes and visible signs make pregnancy undeniable! (~${data.pregnancyWeeks} weeks).`
                        : `🚨 Изменения в теле не оставляют сомнений: беременность подтвердилась (~${data.pregnancyWeeks} нед.)!`);
                } else {
                    toastr.success(getText('toastAutoDiscovered', lang));
                }
            }
        }

        if (data.isDiscovered && data.babiesDiseases && settings.isNotificationsEnabled && settings.aiAwareness !== 'hidden') {
            data.babiesDiseases.forEach((dId, idx) => {
                if (dId) {
                    const disease = getFetalDisease(dId, lang);
                    if (disease && disease.type === 'prenatal' && disease.discoveryWeek) {
                        if (prevWeeks < disease.discoveryWeek && data.pregnancyWeeks >= disease.discoveryWeek) {
                            logReproEvent(`[SCREENING WEEK ${disease.discoveryWeek}] Diagnosed condition for Fetus #${idx + 1}: ${disease.name}`);
                            const babyTitle = data.babiesCount > 1 ? ` (${getText('childLabel', lang)} #${idx + 1})` : '';
                            toastr.warning(`🧬 ${getText('fetalAnomalyTitle', lang)}${babyTitle} «${disease.name}»!`);
                        }
                    }
                }
            });
        }

        updateSymptomsData(data);
        const maxWeeks = settings.maxPregnancyWeeks || (settings.mode === 'omegaverse' ? 36 : 40);
        if (data.isDiscovered && data.pregnancyWeeks >= maxWeeks && settings.isNotificationsEnabled) {
            toastr.warning(getText('toastPregEnd', lang));
        }
    } else {
        const target = data.currentCycleTargetLength || settings.cycleLength || 28;
        data.cycleDay += days;

        if (data.cycleDay > target) {
            data.cycleDay = ((data.cycleDay - 1) % target) + 1;
            data.currentCycleTargetLength = rollNewCycleTarget();
            data.symptomPhaseKey = null;
            logReproEvent(`[CYCLE RESET] Period started after cycle length of ${target} days.`);
            if (settings.isNotificationsEnabled) {
                toastr.info(settings.mode === 'omegaverse' ? getText('toastNewHeat', lang) : getText('toastNewCycle', lang));
            }
        }
        updateSymptomsData(data);
    }
}

function handleUserMessageTime(text) {
    const data = getChatBodyData();
    const relativeDays = parseRelativeDaysFromText(text);

    if (relativeDays > 0) {
        pendingUserTimeskipDays = relativeDays;
        advanceBodyTime(relativeDays);
        checkPregnancyComplications(data);
        checkFetalDemise(data);

        if (data.lastRpDate) {
            const parts = data.lastRpDate.split('-').map(Number);
            const currentTotalDays = dateToDays(parts[0], parts[1] - 1, parts[2]);
            data.lastRpDate = daysToDateString(currentTotalDays + relativeDays);
        }

        logReproEvent(`[USER TIMESKIP] Advanced by ${relativeDays} days via relative text.`);
        saveSettingsDebounced(); 
        handleRefreshUI(); 
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
                checkFetalDemise(data);
                logReproEvent(`[USER DATE SYNC] Date changed from ${data.lastRpDate} to ${newDateStr} (+${diff} days).`);
            }
        }
        data.lastRpDate = newDateStr;
        saveSettingsDebounced(); 
        handleRefreshUI(); 
    }
}

function handleAiMessageTime(text) {
    const data = getChatBodyData();

    if (pendingUserTimeskipDays > 0) {
        pendingUserTimeskipDays = 0;
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
                checkFetalDemise(data);
                logReproEvent(`[AI DATE SYNC] Synced from ${data.lastRpDate} to ${newDateStr} (+${diff} days).`);
                if (settings.isNotificationsEnabled) {
                    toastr.info(`${getText('toastTimePassed', getLanguage())}${diff}.`);
                }
            }
        }
        data.lastRpDate = newDateStr;
        saveSettingsDebounced(); 
        handleRefreshUI(); 
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

        logReproEvent(`[CONCEPTION ROLL] Roll: ${rollResult.toFixed(2)}% | Needed <= ${finalChance}% | Phase: ${phase} | Protection: ${data.contraception} | Outcome: ${isSuccessful ? 'SUCCESS' : 'FAILED'}`);

        if (isSuccessful) {
            if (!settings.isSecretConception && settings.isNotificationsEnabled) {
                toastr.success(lang === 'en'
                    ? `🎲 Conception roll made! Result: ${rollResult.toFixed(1)}% of ${finalChance}% required. SUCCESSFUL CONCEPTION!`
                    : `🎲 Кубик на зачатие брошен! Результат: ${rollResult.toFixed(1)}% из ${finalChance}% необходимых. ЗАЧАТИЕ ПРОИЗОШЛО!`);
            }
            triggerPregnancy(data);
        } else {
            if (!settings.isSecretConception && settings.isNotificationsEnabled) {
                toastr.info(lang === 'en'
                    ? `🎲 Conception roll made! Result: ${rollResult.toFixed(1)}% (needed <= ${finalChance}%). Missed.`
                    : `🎲 Кубик на зачатие брошен! Результат: ${rollResult.toFixed(1)}% (требовалось <= ${finalChance}%). Мимо.`);
            }
            saveSettingsDebounced();
            handleRefreshUI();
        }
    }
}

function triggerPregnancy(data) {
    data.isPregnant = true;
    data.pregnancyDaysTotal = Math.max(14, data.cycleDay || 14);
    data.pregnancyWeeks = Math.floor(data.pregnancyDaysTotal / 7);
    data.pregnancyDays = data.pregnancyDaysTotal % 7;

    data.isDiscovered = !settings.isSecretConception;
    data.rolledTrimesters = { 1: false, 2: false, 3: false }; 
    data.fetalDemiseRolledTrimesters = { 1: false, 2: false, 3: false };
    data.fetalDemise = null;
    data.activeComplication = null;
    data.deliveryMethod = 'none';
    data.currentDeliveredCount = 0;

    const roll = Math.random() * 100;
    data.babiesCount = settings.mode === 'omegaverse' ? (roll > 92 ? 3 : roll > 70 ? 2 : 1) : (roll > 98.5 ? 3 : roll > 95 ? 2 : 1);
    data.babiesGenders = [];
    data.babiesDiseases = [];
    
    for (let i = 0; i < data.babiesCount; i++) {
        data.babiesGenders.push(generateBabyGender(settings.mode, 'en'));
        data.babiesDiseases.push(null);
    }

    data.fetalDiseaseId = null;
    if (settings.isFetalPathologyEnabled && Math.random() * 100 < 3) {
        const primaryDisease = getRandomFetalDiseaseId();
        data.fetalDiseaseId = primaryDisease;
        data.babiesDiseases[0] = primaryDisease;

        for (let i = 1; i < data.babiesCount; i++) {
            if (Math.random() * 100 < 5) {
                data.babiesDiseases[i] = getRandomFetalDiseaseId();
            }
        }
        data.babiesDiseases.sort(() => 0.5 - Math.random());
    }

    checkFetalDemise(data);

    logReproEvent(`[PREGNANCY INITIATED] Babies: ${data.babiesCount} (${data.babiesGenders.join(', ')}) | Diseases: [${data.babiesDiseases.join(', ')}] | Obstetric Week: ${data.pregnancyWeeks}w ${data.pregnancyDays}d | Demise: ${data.fetalDemise?.isDead || false} | Secret Mode: ${settings.isSecretConception}`);

    updateSymptomsData(data);
    saveSettingsDebounced(); 
    handleRefreshUI(); 
    updatePromptInjection(); 

    if (data.isDiscovered && settings.isNotificationsEnabled) {
        toastr.success(getText('toastConception', getLanguage()));
    }
}

function performPregnancyTest() {
    const data = getChatBodyData();
    const lang = getLanguage();
    const isMedieval = settings.aiAwareness === 'hidden';

    if (data.isPregnant) {
        const targetCycle = data.currentCycleTargetLength || settings.cycleLength || 28;
        const delayDays = data.cycleDay - targetCycle;
        
        let detectionChance = 99;
        if (isMedieval) {
            if (delayDays < 7) detectionChance = 25;
            else if (delayDays < 14) detectionChance = 65;
            else if (delayDays < 21) detectionChance = 90;
            else detectionChance = 98;
        } else {
            if (delayDays <= 0) detectionChance = 15;
            else if (delayDays <= 2) detectionChance = 50;
            else if (delayDays <= 4) detectionChance = 75;
            else if (delayDays <= 6) detectionChance = 90;
            else detectionChance = 99;
        }

        const roll = Math.random() * 100;
        const isDetected = roll <= detectionChance;

        logReproEvent(`[PREGNANCY TEST ROLL] Missed period: ${delayDays} days | Detection chance: ${detectionChance}% | Roll: ${roll.toFixed(1)}% | Detected: ${isDetected}`);

        if (isDetected) {
            data.isDiscovered = true;
            logReproEvent(`[PREGNANCY CONFIRMED] Test positive at ${data.pregnancyWeeks}w ${data.pregnancyDays}d.`);
            updateSymptomsData(data);
            saveSettingsDebounced();
            handleRefreshUI();
            updatePromptInjection();
            if (settings.isNotificationsEnabled) {
                if (isMedieval) {
                    toastr.success(lang === 'en'
                        ? `🌿 Signs and pulse confirm pregnancy (~${data.pregnancyWeeks} weeks)!`
                        : `🌿 Признаки и самочувствие подтверждают беременность (~${data.pregnancyWeeks} нед.)!`);
                } else {
                    toastr.success(`${getText('toastTestPositive', lang)}${data.pregnancyWeeks} ${getText('weeksShort', lang)} ${data.pregnancyDays} ${getText('daysShort', lang)}`);
                }
            }
        } else {
            if (settings.isNotificationsEnabled) {
                if (isMedieval) {
                    toastr.info(lang === 'en'
                        ? `🍃 Herbal signs and bodily cues are faint and inconclusive. Better to check again in a few days.`
                        : `🍃 Признаки слишком неясные и сомнительные. Травяные настои и самочувствие пока не дают точного ответа. Стоит проверить позже.`);
                } else {
                    toastr.warning(getText('toastTestUncertain', lang));
                }
            }
        }
    } else {
        logReproEvent(`[PREGNANCY CHECK] Negative test on cycle day ${data.cycleDay}.`);
        if (settings.isNotificationsEnabled) {
            if (isMedieval) {
                toastr.info(lang === 'en'
                    ? `🍃 No signs of pregnancy detected. Just a natural cycle delay.`
                    : `🍃 Признаков беременности нет. Это обычная задержка цикла.`);
            } else {
                toastr.info(getText('toastTestNegative', lang));
            }
        }
    }
}

function processAbortionTrigger() {
    const data = getChatBodyData();
    logReproEvent(`[ABORTION] Terminated pregnancy at ${data.pregnancyWeeks} weeks.`);
    data.isPregnant = false;
    data.isDiscovered = false;
    data.pregnancyDaysTotal = 0;
    data.pregnancyWeeks = 0;
    data.pregnancyDays = 0;
    data.currentDeliveredCount = 0;
    data.babiesCount = 0;
    data.babiesGenders = [];
    data.babiesDiseases = [];
    data.activeComplication = null;
    data.fetalDiseaseId = null;
    data.fetalDemise = null;
    data.fetalDemiseRolledTrimesters = { 1: false, 2: false, 3: false };
    data.postpartumDays = 1;
    data.deliveryMethod = 'miscarriage'; 

    updatePromptInjection(); 
    saveSettingsDebounced();
    handleRefreshUI(); 
    
    if (settings.isNotificationsEnabled) {
        toastr.info(getText('toastAbort', getLanguage()));
    }
}

function checkAbortionTagTrigger(text) {
    const data = getChatBodyData();
    if (!data.isPregnant) return;

    const abortionTagRegex = /<!--\s*(?:ABORTION|MEDICAL_ABORTION|CURETTAGE)\s*-->/i;
    if (abortionTagRegex.test(text)) {
        logReproEvent(`[AI ABORTION TRIGGER] Abortion procedure detected via AI hidden tag.`);
        processAbortionTrigger();
    }
}

function deliverSingleBaby(data, method = 'natural') {
    const lang = getLanguage();
    const rawGender = data.babiesGenders.shift() || generateBabyGender(settings.mode, 'en');
    const babyDiseaseId = (data.babiesDiseases && data.babiesDiseases.length > 0) ? data.babiesDiseases.shift() : null;
    
    data.currentDeliveredCount = (data.currentDeliveredCount || 0) + 1;
    
    data.childrenList.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        gender: rawGender,
        diseaseId: babyDiseaseId
    });
    
    data.babiesCount = data.babiesGenders.length;
    const displayGender = translateGender(rawGender, lang);
    const disease = babyDiseaseId ? getFetalDisease(babyDiseaseId, lang) : null;

    logReproEvent(`[BIRTH] Child delivered: ${rawGender} | Method: ${method} | Condition: ${disease ? disease.name : 'None'} | Remaining in womb: ${data.babiesCount}`);

    if (data.babiesCount === 0) {
        data.isPregnant = false;
        data.isDiscovered = false;
        data.pregnancyDaysTotal = 0;
        data.pregnancyWeeks = 0;
        data.pregnancyDays = 0;
        data.currentDeliveredCount = 0;
        data.activeComplication = null;
        data.fetalDiseaseId = null;
        data.babiesDiseases = [];
        data.fetalDemise = null;
        data.fetalDemiseRolledTrimesters = { 1: false, 2: false, 3: false };
        data.postpartumDays = 1;
        data.deliveryMethod = method;

        const methodText = method === 'c_section' 
            ? (lang === 'en' ? 'C-Section' : 'Кесарево сечение') 
            : (lang === 'en' ? 'Natural Delivery' : 'Естественные роды');
        
        let extraNote = '';
        if (disease) {
            extraNote = lang === 'en' ? ` (Detected condition: «${disease.name}»)` : ` (Выявлена особенность: «${disease.name}»)`;
        }

        if (settings.isNotificationsEnabled) {
            toastr.success(lang === 'en'
                ? `👶 Delivery complete! Baby (${displayGender}) delivered!${extraNote} Method: ${methodText}. Postpartum recovery begun.`
                : `👶 Все роды завершены! Малыш (${displayGender}) успешно родился!${extraNote} Способ: ${methodText}. Запущен восстановительный период.`);
        }
    } else {
        let extraNote = '';
        if (disease) {
            extraNote = lang === 'en' ? ` (Detected condition: «${disease.name}»)` : ` (Выявлена особенность: «${disease.name}»)`;
        }

        if (settings.isNotificationsEnabled) {
            toastr.info(lang === 'en'
                ? `👶 Baby born (${displayGender})!${extraNote} Remaining in womb: ${data.babiesCount}.`
                : `👶 Родился ребёнок (${displayGender})!${extraNote} В утробе остаётся еще малышей: ${data.babiesCount}.`);
        }
    }

    updatePromptInjection();
    saveSettingsDebounced();
    handleRefreshUI();
}

function processBirthTrigger(method = 'natural') {
    const data = getChatBodyData();
    if (!data.isPregnant) return;
    const lang = getLanguage();

    while (data.babiesCount > 0 || data.babiesGenders.length > 0) {
        const rawGender = data.babiesGenders.shift() || generateBabyGender(settings.mode, lang);
        const babyDiseaseId = (data.babiesDiseases && data.babiesDiseases.length > 0) ? data.babiesDiseases.shift() : null;
        
        data.childrenList.push({
            id: Date.now() + Math.floor(Math.random() * 1000),
            gender: rawGender,
            diseaseId: babyDiseaseId
        });
        data.babiesCount = data.babiesGenders.length;
    }

    data.isPregnant = false;
    data.isDiscovered = false;
    data.pregnancyDaysTotal = 0;
    data.pregnancyWeeks = 0; 
    data.pregnancyDays = 0; 
    data.currentDeliveredCount = 0;
    data.babiesCount = 0; 
    data.babiesGenders = []; 
    data.babiesDiseases = [];
    data.activeComplication = null;
    data.fetalDiseaseId = null;
    data.fetalDemise = null;
    data.fetalDemiseRolledTrimesters = { 1: false, 2: false, 3: false };
    data.postpartumDays = 1; 
    data.deliveryMethod = method; 

    logReproEvent(`[MANUAL BIRTH] All babies delivered manually. Method: ${method}`);

    updatePromptInjection(); 
    saveSettingsDebounced();
    handleRefreshUI(); 
    
    const methodText = method === 'c_section' 
        ? (lang === 'en' ? 'C-Section' : 'Кесарево сечение') 
        : (lang === 'en' ? 'Natural Delivery' : 'Естественные роды');
    if (settings.isNotificationsEnabled) {
        toastr.success(lang === 'en'
            ? `👶 All births completed manually! Method: ${methodText}. Recovery phase started.`
            : `👶 Роды успешно завершены вручную! Способ: ${methodText}. Запущен период восстановления.`);
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

function processMiscarriageTrigger() {
    const data = getChatBodyData();
    const lang = getLanguage();
    logReproEvent(`[MISCARRIAGE] Spontaneous miscarriage occurred.`);
    data.isPregnant = false;
    data.isDiscovered = false;
    data.pregnancyDaysTotal = 0;
    data.pregnancyWeeks = 0;
    data.pregnancyDays = 0;
    data.currentDeliveredCount = 0;
    data.babiesCount = 0;
    data.babiesGenders = [];
    data.babiesDiseases = [];
    data.activeComplication = null;
    data.fetalDiseaseId = null;
    data.fetalDemise = null;
    data.fetalDemiseRolledTrimesters = { 1: false, 2: false, 3: false };
    data.postpartumDays = 1;
    data.deliveryMethod = 'miscarriage'; 

    updatePromptInjection(); 
    saveSettingsDebounced();
    handleRefreshUI(); 
    
    if (settings.isNotificationsEnabled) {
        toastr.error(lang === 'en'
            ? `🚨 CRITICAL EVENT: Due to acute complications, a spontaneous miscarriage occurred. Pregnancy terminated.`
            : `🚨 КРИТИЧЕСКОЕ СОБЫТИЕ: Произошел самопроизвольный выкидыш. Беременность прервана.`);
    }
}

function bindGlobalEvents() {
    $(document).off('click', '.repro-tooltip-btn, .repro-tooltip-icon').on('click', '.repro-tooltip-btn, .repro-tooltip-icon', function(e) {
        e.stopPropagation();
        e.preventDefault();
        const tip = $(this).attr('data-tip') || $(this).attr('title');
        if (tip && typeof toastr !== 'undefined') {
            toastr.info(tip, settings.language === 'en' ? "Information" : "Справка", { timeOut: 9000, closeButton: true });
        }
    });

    $(document).off('click', '.repro-custom-btn-toggle').on('click', '.repro-custom-btn-toggle', function() {
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

    $(document).off('change', '#repro-lang-select').on('change', '#repro-lang-select', function() {
        settings.language = $(this).val();
        saveSettingsDebounced();
        handleRefreshUI();
        updatePromptInjection();
    });

    $(document).off('change', '#repro-is-enabled').on('change', '#repro-is-enabled', function() {
        settings.isEnabled = $(this).is(':checked');
        saveSettingsDebounced();
        updatePromptInjection();
        handleRefreshUI(); 
    });

    $(document).off('change', '#repro-is-notifications-enabled').on('change', '#repro-is-notifications-enabled', function() {
        settings.isNotificationsEnabled = $(this).is(':checked');
        saveSettingsDebounced();
    });

    $(document).off('change', '#repro-is-secret-conception').on('change', '#repro-is-secret-conception', function() {
        settings.isSecretConception = $(this).is(':checked');
        const bodyData = getChatBodyData();
        if (!settings.isSecretConception && bodyData.isPregnant) {
            bodyData.isDiscovered = true;
        }
        saveSettingsDebounced();
        handleRefreshUI();
        updatePromptInjection();
    });

    $(document).off('change', '#repro-is-irregular-cycle').on('change', '#repro-is-irregular-cycle', function() {
        settings.isIrregularCycle = $(this).is(':checked');
        saveSettingsDebounced();
    });

    $(document).off('change', '#repro-mode').on('change', '#repro-mode', function() { 
        settings.mode = $(this).val(); 
        if (settings.mode === 'realism') {
            settings.gender = 'female';
        } else if (settings.mode === 'omegaverse' && settings.gender === 'female') {
            settings.gender = 'female_omega';
        }
        saveSettingsDebounced(); 
        handleRefreshUI(); 
        updatePromptInjection(); 
    });

    $(document).off('change', '#repro-gender').on('change', '#repro-gender', function() { 
        settings.gender = $(this).val(); 
        saveSettingsDebounced(); 
        handleRefreshUI(); 
        updatePromptInjection(); 
    });

    $(document).off('change', '#repro-awareness').on('change', '#repro-awareness', function() { 
        settings.aiAwareness = $(this).val(); 
        saveSettingsDebounced(); 
        handleRefreshUI(); 
        updatePromptInjection(); 
    });

    $(document).off('change', '#repro-contraception').on('change', '#repro-contraception', function() {
        const bodyData = getChatBodyData();
        bodyData.contraception = $(this).val();
        saveSettingsDebounced();
        updatePromptInjection();
    });

    $(document).off('change', '#repro-fetal-pathology-enabled').on('change', '#repro-fetal-pathology-enabled', function() {
        settings.isFetalPathologyEnabled = $(this).is(':checked');
        saveSettingsDebounced();
    });

    $(document).off('click', '#repro-btn-take-test').on('click', '#repro-btn-take-test', function() {
        performPregnancyTest();
    });

    $(document).off('click', '#repro-btn-abort').on('click', '#repro-btn-abort', function() {
        const confirmText = settings.language === 'en' 
            ? "Are you sure you want to terminate the pregnancy?" 
            : "Вы уверены, что хотите провести процедуру прерывания беременности?";
        if (confirm(confirmText)) {
            processAbortionTrigger();
        }
    });

    $(document).off('click', '#repro-export-logs').on('click', '#repro-export-logs', function() {
        exportReproLogs({
            data: getChatBodyData(),
            chatId: getCurrentChatId(),
            language: getLanguage(),
            isNotificationsEnabled: settings.isNotificationsEnabled
        });
    });

    $(document).off('click', '#repro-apply-params').on('click', '#repro-apply-params', function() {
        const root = $(this).closest('#repro-content-wrapper');
        const bodyData = getChatBodyData();
        
        settings.cycleLength = parseInt(root.find('#repro-input-cycle').val() || $('#repro-input-cycle').val(), 10) || 28;
        settings.periodDuration = parseInt(root.find('#repro-input-period').val() || $('#repro-input-period').val(), 10) || 5;
        settings.maxPregnancyWeeks = parseInt(root.find('#repro-input-maxweeks').val() || $('#repro-input-maxweeks').val(), 10) || 40;
        
        const manualDateVal = root.find('#repro-input-rpdate').val() || $('#repro-input-rpdate').val();
        const normalized = normalizeInputDate(manualDateVal);
        if (normalized) bodyData.lastRpDate = normalized;

        const isRevealedPregnancy = bodyData.isPregnant && (bodyData.isDiscovered || !settings.isSecretConception);

        if (isRevealedPregnancy) { 
            const weeks = parseInt(root.find('#repro-input-weeks').val() || $('#repro-input-weeks').val(), 10) || 0;
            const days = parseInt(root.find('#repro-input-days').val() || $('#repro-input-days').val(), 10) || 0;
            bodyData.pregnancyWeeks = weeks; 
            bodyData.pregnancyDays = Math.max(0, Math.min(6, days)); 
            bodyData.pregnancyDaysTotal = (weeks * 7) + bodyData.pregnancyDays;
        } else if (bodyData.postpartumDays === 0) { 
            bodyData.cycleDay = parseInt(root.find('#repro-input-day').val() || $('#repro-input-day').val(), 10) || 1; 
        }

        saveSettingsDebounced(); 
        handleRefreshUI(); 
        updatePromptInjection(); 
        if (settings.isNotificationsEnabled) toastr.success(getText('toastSaved', getLanguage()));
    });

    $(document).off('click', '#repro-btn-birth-trigger').on('click', '#repro-btn-birth-trigger', function() {
        const method = confirm(settings.language === 'en' 
            ? "Perform delivery via Cesarean Section (C-Section)? [OK - C-Section, Cancel - Natural Birth]"
            : "Выполнить родоразрешение путем операции Кесарева сечения (КС)? [ОК - Кесарево, Отмена - Естественные роды]") ? 'c_section' : 'natural';
        processBirthTrigger(method);
    });

    $(document).off('click', '#repro-cure-complication').on('click', '#repro-cure-complication', function() {
        const bodyData = getChatBodyData();
        if (bodyData.activeComplication) {
            const lang = getLanguage();
            const comp = getComplication(bodyData.activeComplication.id, lang);
            if (settings.isNotificationsEnabled && comp) {
                toastr.success(lang === 'en' ? `Successfully treated: ${comp.name}` : `Успешно купировано: ${comp.name}`);
            }
            bodyData.activeComplication = null; 
            saveSettingsDebounced(); 
            handleRefreshUI(); 
            updatePromptInjection(); 
        }
    });

    $(document).off('click', '#repro-btn-manual-preg').on('click', '#repro-btn-manual-preg', function() {
        const root = $(this).closest('#repro-content-wrapper');
        const bodyData = getChatBodyData();
        const weeks = parseInt(root.find('#repro-manual-weeks').val() || $('#repro-manual-weeks').val(), 10) || 0;
        const days = parseInt(root.find('#repro-manual-days').val() || $('#repro-manual-days').val(), 10) || 0;
        const count = parseInt(root.find('#repro-manual-count').val() || $('#repro-manual-count').val(), 10) || 1;

        bodyData.isPregnant = true; 
        bodyData.isDiscovered = true;
        bodyData.pregnancyWeeks = weeks; 
        bodyData.pregnancyDays = Math.max(0, Math.min(6, days)); 
        bodyData.pregnancyDaysTotal = (weeks * 7) + bodyData.pregnancyDays;
        bodyData.babiesCount = count; 
        bodyData.currentDeliveredCount = 0;
        bodyData.rolledTrimesters = { 1: false, 2: false, 3: false }; 
        bodyData.fetalDemiseRolledTrimesters = { 1: false, 2: false, 3: false };
        bodyData.fetalDemise = null;
        bodyData.activeComplication = null;
        bodyData.babiesGenders = [];
        bodyData.babiesDiseases = [];
        bodyData.deliveryMethod = 'none';
        
        for (let i = 0; i < count; i++) {
            bodyData.babiesGenders.push(generateBabyGender(settings.mode, 'en'));
            bodyData.babiesDiseases.push(null);
        }

        bodyData.fetalDiseaseId = null;
        if (settings.isFetalPathologyEnabled && Math.random() * 100 < 3) {
            const diseaseId = getRandomFetalDiseaseId();
            bodyData.fetalDiseaseId = diseaseId;
            bodyData.babiesDiseases[0] = diseaseId;
            bodyData.babiesDiseases.sort(() => 0.5 - Math.random());
        }

        checkFetalDemise(bodyData);

        logReproEvent(`[MANUAL PREGNANCY] Set to ${weeks}w ${bodyData.pregnancyDays}d with ${count} baby/babies. Condition: ${bodyData.fetalDiseaseId || 'None'} | Demise: ${bodyData.fetalDemise?.isDead || false}`);

        saveSettingsDebounced(); 
        handleRefreshUI(); 
        updatePromptInjection(); 
        if (settings.isNotificationsEnabled) toastr.success(`${getText('toastManualPreg', getLanguage())}${weeks} ${getText('weeksShort', getLanguage())} ${bodyData.pregnancyDays} ${getText('daysShort', getLanguage())}`);
    });

    $(document).off('click', '#repro-reset-pregnancy-only').on('click', '#repro-reset-pregnancy-only', function() {
        const bodyData = getChatBodyData();
        bodyData.isPregnant = false; 
        bodyData.isDiscovered = false;
        bodyData.pregnancyDaysTotal = 0;
        bodyData.pregnancyWeeks = 0; 
        bodyData.pregnancyDays = 0; 
        bodyData.currentDeliveredCount = 0;
        bodyData.babiesCount = 0; 
        bodyData.babiesGenders = []; 
        bodyData.babiesDiseases = [];
        bodyData.rolledTrimesters = { 1: false, 2: false, 3: false }; 
        bodyData.fetalDemiseRolledTrimesters = { 1: false, 2: false, 3: false };
        bodyData.fetalDemise = null;
        bodyData.activeComplication = null;
        bodyData.deliveryMethod = 'none';
        bodyData.fetalDiseaseId = null;

        logReproEvent(`[RESET] Pregnancy state reset.`);

        processedBirthMessages.clear();
        saveSettingsDebounced(); 
        handleRefreshUI(); 
        updatePromptInjection(); 
        if (settings.isNotificationsEnabled) toastr.info(getText('toastResetPreg', getLanguage()));
    });

    $(document).off('click', '#repro-reset').on('click', '#repro-reset', function() {
        const confirmText = settings.language === 'en' 
            ? "Are you sure you want to completely clear the reproductive data for this chat?" 
            : "Вы уверены, что хотите полностью очистить данные этого чата?";
        if (confirm(confirmText)) {
            const chatId = getCurrentChatId();
            settings.chatPregnancyData[chatId] = createDefaultBodyData();
            processedBirthMessages.clear();
            saveSettingsDebounced(); 
            handleRefreshUI(); 
            updatePromptInjection(); 
            if (settings.isNotificationsEnabled) toastr.warning(getText('toastResetAll', getLanguage()));
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
        checkAbortionTagTrigger(text);
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
                    handleRefreshUI();
                }
                break;
            }
        }
    }
}

function loadSettings() {
    if (!extension_settings[EXTENSION_NAME]) {
        extension_settings[EXTENSION_NAME] = Object.assign({}, DEFAULT_SETTINGS);
    }
    settings = extension_settings[EXTENSION_NAME];
    if (settings.language === undefined) settings.language = 'ru';
    if (settings.isSecretConception === undefined) settings.isSecretConception = true;
    if (settings.isIrregularCycle === undefined) settings.isIrregularCycle = true;
    if (settings.periodDuration === undefined) settings.periodDuration = 5;
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
    if (!settings.isSecretConception && data.isPregnant) {
        data.isDiscovered = true;
    }

    handleRefreshUI();
    updatePromptInjection();
}

jQuery(async () => {
    bindGlobalEvents();
    loadSettings();
    scanLastDateFromChat();

    if (typeof eventSource?.on === 'function') { 
        eventSource.on('i18n_language_changed', () => { handleRefreshUI(); }); 

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
