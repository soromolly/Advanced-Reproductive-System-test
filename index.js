import { 
    saveSettingsDebounced, 
    eventSource, 
    event_types,
    setExtensionPrompt,
    extension_prompt_types
} from '../../../../script.js';
import { extension_settings } from '../../../extensions.js';
import { 
    createDefaultEntityState, 
    updateEntitySymptoms, 
    checkEntityComplications, 
    checkEntityFetalDemise, 
    advanceEntityDays, 
    triggerEntityPregnancy, 
    deliverEntitySingleBaby, 
    processEntityAbortion, 
    getEntityBodyPhase,
    generateBabyGender
} from './entityController.js';
import { getText } from './translations.js';
import { 
    dateToDays, 
    daysToDateString, 
    normalizeInputDate, 
    parseRpDateFromText, 
    parseRelativeDaysFromText 
} from './dateUtils.js';
import { buildMultiEntityPrompt } from './promptBuilder.js';
import { renderUI, exportReproLogs } from './ui.js';

const EXTENSION_NAME = 'st-advanced-reproductive-system';

const DEFAULT_SETTINGS = {
    isEnabled: true,
    isNotificationsEnabled: true,
    language: 'ru',
    aiAwareness: 'dynamic', 
    globalRollsCount: 0,
    chatPregnancyData: {}
};

let settings = Object.assign({}, DEFAULT_SETTINGS);
let isMenuCollapsed = true; 
let activeTab = 'user'; // 'user' | 'char'
let activeChatId = null;
let pendingUserTimeskipDays = 0;
const processedBirthMessages = new Set();
let lastProcessedMessageUid = null;

function getCurrentChatId() {
    return (typeof SillyTavern?.getContext === 'function') ? (SillyTavern.getContext().chatId || window.chat_id || 'default') : (window.chat_id || 'default');
}

function getChatData() {
    const chatId = getCurrentChatId();
    if (!settings.chatPregnancyData[chatId]) {
        settings.chatPregnancyData[chatId] = {
            targetMode: 'user',
            lastRpDate: null,
            activityLogs: [],
            user: createDefaultEntityState('user'),
            char: createDefaultEntityState('char')
        };
    }
    activeChatId = chatId;
    const data = settings.chatPregnancyData[chatId];
    
    if (data.cycleDay !== undefined && !data.user) {
        data.user = Object.assign(createDefaultEntityState('user'), data);
        data.char = createDefaultEntityState('char');
        data.targetMode = 'user';
    }
    if (!data.user) data.user = createDefaultEntityState('user');
    if (!data.char) data.char = createDefaultEntityState('char');
    if (!data.targetMode) data.targetMode = 'user';
    if (!data.activityLogs) data.activityLogs = [];
    return data;
}

export function getActiveEntityKey() {
    const data = getChatData();
    if (data.targetMode === 'both') return activeTab;
    return data.targetMode || 'user';
}

function logReproEvent(message) {
    const data = getChatData();
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const rpDateStr = data.lastRpDate ? `[RP Date: ${data.lastRpDate}]` : `[RP Date: N/A]`;
    data.activityLogs.push(`[${timestamp}] ${rpDateStr} ${message}`);
    if (data.activityLogs.length > 300) data.activityLogs.shift();
}

function notify(text, type = 'info') {
    if (settings.isNotificationsEnabled && typeof toastr !== 'undefined') {
        toastr[type]?.(text) || toastr.info(text);
    }
}

function updatePrompt() {
    if (!settings.isEnabled) { 
        setExtensionPrompt(EXTENSION_NAME, '', extension_prompt_types.IN_CHAT, 0); 
        return; 
    }
    const data = getChatData();
    const prompt = buildMultiEntityPrompt({
        targetMode: data.targetMode,
        userEntity: data.user,
        charEntity: data.char,
        aiAwareness: settings.aiAwareness
    });
    setExtensionPrompt(EXTENSION_NAME, prompt, extension_prompt_types.IN_CHAT, 0);
}

function refreshUI() {
    const data = getChatData();
    const lang = settings.language || 'ru';
    updateEntitySymptoms(data.user);
    updateEntitySymptoms(data.char);
    checkEntityComplications(data.user, lang, logReproEvent, notify);
    checkEntityComplications(data.char, lang, logReproEvent, notify);
    checkEntityFetalDemise(data.user, logReproEvent);
    checkEntityFetalDemise(data.char, logReproEvent);
    renderUI({ settings, chatData: data, activeTab, isMenuCollapsed });
}

function advanceTimeAll(days) {
    const data = getChatData();
    const lang = settings.language || 'ru';
    if (data.targetMode === 'user' || data.targetMode === 'both') {
        advanceEntityDays(data.user, days, settings.aiAwareness, lang, logReproEvent, notify);
    }
    if (data.targetMode === 'char' || data.targetMode === 'both') {
        advanceEntityDays(data.char, days, settings.aiAwareness, lang, logReproEvent, notify);
    }
}

function checkConceptionForEntity(entity, text, isReceivedClimax) {
    if (!isReceivedClimax || entity.isPregnant || entity.postpartumDays > 0) return;

    settings.globalRollsCount = (settings.globalRollsCount || 0) + 1;
    const phase = getEntityBodyPhase(entity, 'en');
    const isFertile = phase.includes('Ovulation') || phase.includes('Heat');

    let finalChance = 0;
    if (entity.contraception === 'none') {
        finalChance = isFertile ? (entity.mode === 'omegaverse' ? 85 : 25) : (entity.mode === 'omegaverse' ? 5 : 0.5);
    } else if (entity.contraception === 'condom') finalChance = 2;
    else if (entity.contraception === 'pills') finalChance = 0.1;
    else if (entity.contraception === 'iud') finalChance = 0.2;

    const roll = Math.random() * 100;
    const isSuccess = roll <= finalChance;
    const lang = settings.language || 'ru';

    logReproEvent(`[CONCEPTION ROLL] [${entity.key.toUpperCase()}] Roll: ${roll.toFixed(2)}% <= ${finalChance}% | Outcome: ${isSuccess ? 'SUCCESS' : 'MISSED'}`);

    if (isSuccess) {
        if (!entity.isSecretConception) {
            notify(`🎲 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${lang === 'en' ? 'Conception Roll SUCCESS!' : 'Кубик на зачатие: УСПЕХ!'} (${roll.toFixed(1)}% <= ${finalChance}%)`, 'success');
        }
        triggerEntityPregnancy(entity, lang, logReproEvent, notify);
    } else if (!entity.isSecretConception) {
        notify(`🎲 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${lang === 'en' ? 'Conception Roll Missed.' : 'Кубик на зачатие: Мимо.'} (${roll.toFixed(1)}% > ${finalChance}%)`, 'info');
    }
}

function processMessageInteractions(text, isUserMessage, messageIndex) {
    const data = getChatData();
    const chatId = getCurrentChatId();
    const msgKey = `${chatId}_${messageIndex}_birth`;

    const cumVagUser = /<!--\s*CUM_VAGINAL_USER\s*-->/i.test(text) || (!/CHAR/i.test(text) && /<!--\s*CUM_VAGINAL\s*-->/i.test(text));
    const cumAnalUser = /<!--\s*CUM_ANAL_USER\s*-->/i.test(text) || (!/CHAR/i.test(text) && /<!--\s*CUM_ANAL\s*-->/i.test(text));
    const cumVagChar = /<!--\s*CUM_VAGINAL_CHAR\s*-->/i.test(text);
    const cumAnalChar = /<!--\s*CUM_ANAL_CHAR\s*-->/i.test(text);

    if (data.targetMode === 'user' || data.targetMode === 'both') {
        const isTargetClimax = (data.user.gender === 'male_omega') ? cumAnalUser : cumVagUser;
        checkConceptionForEntity(data.user, text, isTargetClimax);
    }
    if (data.targetMode === 'char' || data.targetMode === 'both') {
        const isTargetClimax = (data.char.gender === 'male_omega') ? cumAnalChar : cumVagChar;
        checkConceptionForEntity(data.char, text, isTargetClimax);
    }

    if (/<!--\s*ABORTION_USER\s*-->/i.test(text) || /<!--\s*ABORTION\s*-->/i.test(text)) {
        if (data.user.isPregnant) processEntityAbortion(data.user, settings.language, logReproEvent, notify);
    }
    if (/<!--\s*ABORTION_CHAR\s*-->/i.test(text)) {
        if (data.char.isPregnant) processEntityAbortion(data.char, settings.language, logReproEvent, notify);
    }

    if (!processedBirthMessages.has(msgKey)) {
        const checkBirthFor = (entity, tagKey) => {
            if (!entity.isPregnant || entity.babiesGenders.length === 0) return;
            const regex = new RegExp(`<!--\\s*BIRTH_(NATURAL|C_SECTION)_${tagKey}(?:_(\\d+))?\\s*-->`, 'gi');
            let match;
            while ((match = regex.exec(text)) !== null) {
                const method = match[1].toLowerCase() === 'c_section' ? 'c_section' : 'natural';
                deliverEntitySingleBaby(entity, method, settings.language, logReproEvent, notify);
            }
        };

        checkBirthFor(data.user, 'USER');
        checkBirthFor(data.char, 'CHAR');
        processedBirthMessages.add(msgKey);
    }
}

function processIncomingMessage(messageIndex, isUser = false) {
    if (!settings.isEnabled) return; 
    const context = typeof SillyTavern?.getContext === 'function' ? SillyTavern.getContext() : null;
    const chat = context ? context.chat : window.chat;
    if (!chat || !Array.isArray(chat) || chat.length === 0) return;

    let text = null;
    let idx = null;
    if (typeof messageIndex === 'number' && chat[messageIndex]) {
        text = chat[messageIndex].mes;
        idx = messageIndex;
    } else if (typeof messageIndex === 'object' && messageIndex?.mes) {
        text = messageIndex.mes;
        idx = messageIndex?.id ?? (chat.length - 1);
    } else {
        idx = chat.length - 1;
        text = chat[idx]?.mes;
    }

    if (!text) return;

    const currentMsgUid = `${idx}_${isUser ? 'user' : 'ai'}_${text.length}`;
    if (lastProcessedMessageUid === currentMsgUid) return;
    lastProcessedMessageUid = currentMsgUid;

    const data = getChatData();

    if (isUser) {
        const relativeDays = parseRelativeDaysFromText(text);
        if (relativeDays > 0) {
            pendingUserTimeskipDays = relativeDays;
            advanceTimeAll(relativeDays);
            if (data.lastRpDate) {
                const parts = data.lastRpDate.split('-').map(Number);
                const currentTotalDays = dateToDays(parts[0], parts[1] - 1, parts[2]);
                data.lastRpDate = daysToDateString(currentTotalDays + relativeDays);
            }
            logReproEvent(`[USER TIMESKIP] Advanced by ${relativeDays} days via relative user text.`);
        } else {
            const parsedDate = parseRpDateFromText(text);
            if (parsedDate) {
                const newTotalDays = dateToDays(parsedDate.year, parsedDate.month, parsedDate.day);
                const newDateStr = daysToDateString(newTotalDays);
                if (data.lastRpDate && data.lastRpDate !== newDateStr) {
                    const parts = data.lastRpDate.split('-').map(Number);
                    const prevTotalDays = dateToDays(parts[0], parts[1] - 1, parts[2]);
                    const diff = newTotalDays - prevTotalDays;
                    if (diff > 0) advanceTimeAll(diff);
                }
                data.lastRpDate = newDateStr;
            }
        }
    } else {
        // Из постов ИИ берется строго дата из хедера
        const parsedDate = parseRpDateFromText(text);
        if (parsedDate) {
            const newTotalDays = dateToDays(parsedDate.year, parsedDate.month, parsedDate.day);
            const newDateStr = daysToDateString(newTotalDays);

            if (pendingUserTimeskipDays > 0) {
                // Таймскип уже был начислен в посте юзера: синхронизируем дату без повторного начисления
                pendingUserTimeskipDays = 0;
                data.lastRpDate = newDateStr;
                logReproEvent(`[AI DATE SYNC] Date aligned to ${newDateStr} after user timeskip.`);
            } else if (data.lastRpDate && data.lastRpDate !== newDateStr) {
                const parts = data.lastRpDate.split('-').map(Number);
                const prevTotalDays = dateToDays(parts[0], parts[1] - 1, parts[2]);
                const diff = newTotalDays - prevTotalDays;
                if (diff > 0) {
                    advanceTimeAll(diff);
                    logReproEvent(`[AI DATE SYNC] Synced from ${data.lastRpDate} to ${newDateStr} (+${diff} days).`);
                    notify(`${getText('toastTimePassed', settings.language || 'ru')}${diff}.`, 'info');
                }
                data.lastRpDate = newDateStr;
            } else {
                data.lastRpDate = newDateStr;
            }
        }
    }

    processMessageInteractions(text, isUser, idx);
    saveSettingsDebounced();
    refreshUI();
    updatePrompt();
}

function bindGlobalEvents() {
    $(document).off('click', '.repro-tooltip-btn, .repro-tooltip-icon').on('click', '.repro-tooltip-btn, .repro-tooltip-icon', function(e) {
        e.stopPropagation();
        e.preventDefault();
        const tip = $(this).attr('data-tip') || $(this).attr('title');
        if (tip) notify(tip, 'info');
    });

    $(document).off('click', '.repro-custom-btn-toggle').on('click', '.repro-custom-btn-toggle', function() {
        isMenuCollapsed = !isMenuCollapsed; 
        $('#repro-content-wrapper').slideToggle(150);
        $('#repro-toggle-arrow').toggleClass('fa-chevron-down fa-chevron-up');
    });

    $(document).off('change', '#repro-target-mode').on('change', '#repro-target-mode', function() {
        const data = getChatData();
        data.targetMode = $(this).val();
        activeTab = (data.targetMode === 'char') ? 'char' : 'user';
        saveSettingsDebounced();
        refreshUI();
        updatePrompt();
    });

    $(document).off('click', '#repro-tab-user').on('click', '#repro-tab-user', function() {
        activeTab = 'user';
        refreshUI();
    });

    $(document).off('click', '#repro-tab-char').on('click', '#repro-tab-char', function() {
        activeTab = 'char';
        refreshUI();
    });

    $(document).off('change', '#repro-lang-select').on('change', '#repro-lang-select', function() {
        settings.language = $(this).val();
        saveSettingsDebounced();
        refreshUI();
        updatePrompt();
    });

    $(document).off('change', '#repro-is-enabled').on('change', '#repro-is-enabled', function() {
        settings.isEnabled = $(this).is(':checked');
        saveSettingsDebounced();
        updatePrompt();
        refreshUI(); 
    });

    $(document).off('change', '#repro-is-notifications-enabled').on('change', '#repro-is-notifications-enabled', function() {
        settings.isNotificationsEnabled = $(this).is(':checked');
        saveSettingsDebounced();
    });

    $(document).off('change', '#repro-is-secret-conception').on('change', '#repro-is-secret-conception', function() {
        const entity = getChatData()[getActiveEntityKey()];
        entity.isSecretConception = $(this).is(':checked');
        if (!entity.isSecretConception && entity.isPregnant) entity.isDiscovered = true;
        saveSettingsDebounced();
        refreshUI();
        updatePrompt();
    });

    $(document).off('change', '#repro-is-irregular-cycle').on('change', '#repro-is-irregular-cycle', function() {
        getChatData()[getActiveEntityKey()].isIrregularCycle = $(this).is(':checked');
        saveSettingsDebounced();
    });

    $(document).off('change', '#repro-mode').on('change', '#repro-mode', function() { 
        const entity = getChatData()[getActiveEntityKey()];
        entity.mode = $(this).val(); 
        if (entity.mode === 'realism') entity.gender = 'female';
        else if (entity.mode === 'omegaverse' && entity.gender === 'female') entity.gender = 'female_omega';
        saveSettingsDebounced(); 
        refreshUI(); 
        updatePrompt(); 
    });

    $(document).off('change', '#repro-gender').on('change', '#repro-gender', function() { 
        getChatData()[getActiveEntityKey()].gender = $(this).val(); 
        saveSettingsDebounced(); 
        refreshUI(); 
        updatePrompt(); 
    });

    $(document).off('change', '#repro-awareness').on('change', '#repro-awareness', function() { 
        settings.aiAwareness = $(this).val(); 
        saveSettingsDebounced(); 
        refreshUI(); 
        updatePrompt(); 
    });

    $(document).off('change', '#repro-contraception').on('change', '#repro-contraception', function() {
        getChatData()[getActiveEntityKey()].contraception = $(this).val();
        saveSettingsDebounced();
        updatePrompt();
    });

    $(document).off('change', '#repro-fetal-pathology-enabled').on('change', '#repro-fetal-pathology-enabled', function() {
        getChatData()[getActiveEntityKey()].isFetalPathologyEnabled = $(this).is(':checked');
        saveSettingsDebounced();
    });

    $(document).off('click', '#repro-btn-abort').on('click', '#repro-btn-abort', function() {
        if (confirm("Подтвердить прерывание беременности? / Confirm abortion?")) {
            processEntityAbortion(getChatData()[getActiveEntityKey()], settings.language, logReproEvent, notify);
            saveSettingsDebounced();
            refreshUI();
            updatePrompt();
        }
    });

    $(document).off('click', '#repro-export-logs').on('click', '#repro-export-logs', function() {
        exportReproLogs({
            data: getChatData(),
            chatId: getCurrentChatId(),
            language: settings.language || 'ru',
            isNotificationsEnabled: settings.isNotificationsEnabled
        });
    });

    $(document).off('click', '#repro-apply-params').on('click', '#repro-apply-params', function() {
        const root = $(this).closest('#repro-content-wrapper');
        const data = getChatData();
        const entity = data[getActiveEntityKey()];
        
        entity.cycleLength = parseInt(root.find('#repro-input-cycle').val(), 10) || 28;
        entity.periodDuration = parseInt(root.find('#repro-input-period').val(), 10) || 5;
        entity.maxPregnancyWeeks = parseInt(root.find('#repro-input-maxweeks').val(), 10) || 40;
        
        const manualDateVal = root.find('#repro-input-rpdate').val();
        const normalized = normalizeInputDate(manualDateVal);
        if (normalized) data.lastRpDate = normalized;

        if (entity.isPregnant && (entity.isDiscovered || !entity.isSecretConception)) { 
            const weeks = parseInt(root.find('#repro-input-weeks').val(), 10) || 0;
            const days = parseInt(root.find('#repro-input-days').val(), 10) || 0;
            entity.pregnancyWeeks = weeks; 
            entity.pregnancyDays = Math.max(0, Math.min(6, days)); 
            entity.pregnancyDaysTotal = (weeks * 7) + entity.pregnancyDays;
        } else if (entity.postpartumDays === 0) { 
            entity.cycleDay = parseInt(root.find('#repro-input-day').val(), 10) || 1; 
        }

        saveSettingsDebounced(); 
        refreshUI(); 
        updatePrompt(); 
        notify(getText('toastSaved', settings.language), 'success');
    });

    $(document).off('click', '#repro-btn-manual-preg').on('click', '#repro-btn-manual-preg', function() {
        const root = $(this).closest('#repro-content-wrapper');
        const entity = getChatData()[getActiveEntityKey()];
        const weeks = parseInt(root.find('#repro-manual-weeks').val(), 10) || 0;
        const days = parseInt(root.find('#repro-manual-days').val(), 10) || 0;
        const count = parseInt(root.find('#repro-manual-count').val(), 10) || 1;

        entity.isPregnant = true; 
        entity.isDiscovered = true;
        entity.pregnancyWeeks = weeks; 
        entity.pregnancyDays = Math.max(0, Math.min(6, days)); 
        entity.pregnancyDaysTotal = (weeks * 7) + entity.pregnancyDays;
        entity.babiesCount = count; 
        entity.currentDeliveredCount = 0;
        entity.babiesGenders = Array.from({ length: count }, () => generateBabyGender(entity.mode, 'en'));
        entity.babiesDiseases = Array.from({ length: count }, () => null);
        entity.deliveryMethod = 'none';

        saveSettingsDebounced(); 
        refreshUI(); 
        updatePrompt(); 
        notify(`${getText('toastManualPreg', settings.language)}${weeks}w ${days}d`, 'success');
    });

    $(document).off('click', '#repro-reset-pregnancy-only').on('click', '#repro-reset-pregnancy-only', function() {
        const entity = getChatData()[getActiveEntityKey()];
        entity.isPregnant = false; 
        entity.isDiscovered = false;
        entity.pregnancyDaysTotal = 0;
        entity.pregnancyWeeks = 0;
        entity.pregnancyDays = 0;
        entity.babiesCount = 0;
        entity.babiesGenders = [];
        entity.babiesDiseases = [];
        entity.postpartumDays = 0;
        saveSettingsDebounced(); 
        refreshUI(); 
        updatePrompt(); 
    });

    $(document).off('click', '#repro-reset').on('click', '#repro-reset', function() {
        if (confirm("Полностью сбросить репродуктивные данные этого чата? / Reset all chat data?")) {
            const chatId = getCurrentChatId();
            settings.chatPregnancyData[chatId] = {
                targetMode: 'user',
                lastRpDate: null,
                activityLogs: [],
                user: createDefaultEntityState('user'),
                char: createDefaultEntityState('char')
            };
            saveSettingsDebounced(); 
            refreshUI(); 
            updatePrompt(); 
            notify(getText('toastResetAll', settings.language), 'warning');
        }
    });
}

function loadSettings() {
    if (!extension_settings[EXTENSION_NAME]) {
        extension_settings[EXTENSION_NAME] = Object.assign({}, DEFAULT_SETTINGS);
    }
    settings = extension_settings[EXTENSION_NAME];
    refreshUI();
    updatePrompt();
}

jQuery(async () => {
    bindGlobalEvents();
    loadSettings();

    if (typeof eventSource?.on === 'function') { 
        eventSource.on('i18n_language_changed', () => { refreshUI(); }); 
        eventSource.on(event_types.MESSAGE_SENT, async (i) => processIncomingMessage(i, true));
        eventSource.on(event_types.MESSAGE_RECEIVED, async (i) => processIncomingMessage(i, false));
        if (event_types.MESSAGE_EDITED) eventSource.on(event_types.MESSAGE_EDITED, async (i) => processIncomingMessage(i, false));
        if (event_types.MESSAGE_SWIPED) eventSource.on(event_types.MESSAGE_SWIPED, async (i) => processIncomingMessage(i, false));
        if (event_types.CHAT_CHANGED) {
            eventSource.on(event_types.CHAT_CHANGED, () => { 
                pendingUserTimeskipDays = 0;
                processedBirthMessages.clear();
                lastProcessedMessageUid = null;
                loadSettings(); 
            });
        }
    }
});
