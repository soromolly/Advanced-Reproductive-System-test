import { 
    getRandomSymptomIndices, 
    rollComplication, 
    getComplication, 
    getRandomFetalDiseaseId, 
    getFetalDisease 
} from './symptoms.js';
import { getText, translateGender } from './translations.js';

export function createDefaultEntityState(entityKey = 'user') {
    return {
        key: entityKey,
        mode: 'realism', // 'realism' | 'omegaverse' | 'oviposition'
        gender: entityKey === 'user' ? 'female' : 'male_omega',
        isSecretConception: true,
        isIrregularCycle: true,
        isFetalPathologyEnabled: true,
        cycleLength: 28,
        periodDuration: 5,
        maxPregnancyWeeks: 40,
        contraception: 'none',

        cycleDay: 1,
        currentCycleTargetLength: 28,
        isPregnant: false,
        isDiscovered: false,
        pregnancyDaysTotal: 0,
        pregnancyWeeks: 0,
        pregnancyDays: 0,
        
        // Инкубация яиц в гнезде
        isIncubating: false,
        incubationDaysTotal: 0,
        maxIncubationDays: 70, // ~10 недель

        babiesCount: 0,
        babiesGenders: [],
        babiesDiseases: [],
        currentDeliveredCount: 0,
        symptomPhaseKey: null,
        symptomIndices: [],
        rolledTrimesters: { 1: false, 2: false, 3: false },
        fetalDemiseRolledTrimesters: { 1: false, 2: false, 3: false },
        fetalDemise: null,
        activeComplication: null,
        postpartumDays: 0,
        deliveryMethod: 'none',
        childrenList: [],
        fetalDiseaseId: null
    };
}

export function rollNewCycleTarget(entity) {
    const base = entity.cycleLength || (entity.mode === 'oviposition' ? 90 : 28);
    if (!entity.isIrregularCycle) return base;
    
    const roll = Math.random() * 100;
    let variance = 0;
    if (entity.mode === 'oviposition') {
        variance = Math.floor(Math.random() * 20) - 10;
    } else if (roll < 65) {
        variance = Math.floor(Math.random() * 3) - 1;
    } else if (roll < 90) {
        variance = Math.random() > 0.3 ? (Math.floor(Math.random() * 4) + 2) : -2;
    } else {
        variance = Math.floor(Math.random() * 7) + 6;
    }
    return Math.max((entity.periodDuration || 5) + 6, base + variance);
}

export function generateBabyGender(mode, lang = 'ru') {
    const isBoy = Math.random() > 0.5;
    const isRu = lang === 'ru';
    
    if (mode === 'oviposition') {
        if (isRu) return isBoy ? 'Дракон-самец ♂' : 'Драконица-самка ♀';
        return isBoy ? 'Dragon Hatchling ♂' : 'Dragon Hatchling ♀';
    } else if (mode === 'omegaverse') {
        const roll = Math.random() * 100;
        let sec = isRu ? 'Бета' : 'Beta';
        if (roll < 33.33) sec = isRu ? 'Альфа' : 'Alpha';
        else if (roll < 66.66) sec = isRu ? 'Омега' : 'Omega';
        
        if (isRu) return isBoy ? `${sec}-мальчик ♂` : `${sec}-девочка ♀`;
        return isBoy ? `${sec} Boy ♂` : `${sec} Girl ♀`;
    } else {
        if (isRu) return isBoy ? 'Мальчик ♂' : 'Девочка ♀';
        return isBoy ? 'Boy ♂' : 'Girl ♀';
    }
}

export function getEntityBodyPhase(entity, lang = 'ru') {
    const l = (lang === 'en') ? 'en' : 'ru';
    const isRevealedPregnancy = entity.isPregnant && (entity.isDiscovered || !entity.isSecretConception);

    if (entity.postpartumDays > 0) return getText('postpartumPhase', l);
    if (entity.isIncubating) return getText('nestIncubation', l);
    
    if (isRevealedPregnancy) {
        if (entity.mode === 'oviposition') return getText('pregnancyOviposition', l);
        return entity.mode === 'realism' ? getText('pregnancy', l) : getText('pregnancyOmega', l);
    }

    const day = entity.cycleDay;
    const targetLength = entity.currentCycleTargetLength || entity.cycleLength || (entity.mode === 'oviposition' ? 90 : 28);
    const periodDays = entity.periodDuration || 5;

    if (entity.mode === 'oviposition') {
        if (day <= periodDays) return getText('ovipositionPeak', l);
        if (day > targetLength) return getText('delayed', l);
        return getText('quiescence', l);
    } else if (entity.mode === 'realism') {
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

export function updateEntitySymptoms(entity) {
    if (entity.postpartumDays > 0 || entity.isIncubating) {
        entity.symptomPhaseKey = null;
        entity.symptomIndices = [];
        return;
    }

    const isRevealedPregnancy = entity.isPregnant && (entity.isDiscovered || !entity.isSecretConception);
    let phaseKey = null;

    if (isRevealedPregnancy) {
        const week = entity.pregnancyWeeks;
        if (entity.mode === 'oviposition') {
            phaseKey = week <= 3 ? 'oviposition_gravid_early' : 'oviposition_gravid_late';
        } else {
            if (week <= 12) phaseKey = 'preg_trimester_1';
            else if (week >= 13 && week <= 26) phaseKey = 'preg_trimester_2';
            else phaseKey = 'preg_trimester_3';
        }
    } else {
        const day = entity.cycleDay;
        const targetLength = entity.currentCycleTargetLength || entity.cycleLength || 28;
        const periodDays = entity.periodDuration || 5;

        if (entity.mode === 'oviposition') {
            if (day <= periodDays) phaseKey = 'oviposition_fertile';
        } else if (entity.mode === 'realism') {
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
                phaseKey = (entity.gender === 'male_omega') ? 'heat_male' : 'heat_female';
            }
        }
    }

    if (phaseKey) {
        if (entity.symptomPhaseKey !== phaseKey || !entity.symptomIndices || entity.symptomIndices.length === 0) {
            entity.symptomPhaseKey = phaseKey;
            entity.symptomIndices = getRandomSymptomIndices(phaseKey, 3);
        }
    } else {
        entity.symptomPhaseKey = null;
        entity.symptomIndices = [];
    }
}

export function checkEntityComplications(entity, lang = 'ru', logFn, notifyFn) {
    const isRevealed = entity.isPregnant && (entity.isDiscovered || !entity.isSecretConception);
    if (!isRevealed || entity.isIncubating) return;

    const currentWeek = entity.pregnancyWeeks;
    let currentTrimester = 1;
    if (entity.mode === 'oviposition') {
        if (currentWeek >= 3 && currentWeek <= 4) currentTrimester = 2;
        else if (currentWeek >= 5) currentTrimester = 3;
    } else {
        if (currentWeek >= 13 && currentWeek <= 26) currentTrimester = 2;
        else if (currentWeek >= 27) currentTrimester = 3;
    }

    if (!entity.rolledTrimesters[currentTrimester] && !entity.activeComplication) {
        entity.rolledTrimesters[currentTrimester] = true;
        const rolled = rollComplication(currentTrimester);
        if (rolled) {
            entity.activeComplication = rolled;
            logFn?.(`[COMPLICATION] [${entity.key.toUpperCase()}] Trimester ${currentTrimester}: ${rolled.id}`);
        }
    }

    if (entity.activeComplication && !entity.activeComplication.isDiscovered) {
        if (currentWeek >= entity.activeComplication.triggerWeek) {
            entity.activeComplication.isDiscovered = true;
            const comp = getComplication(entity.activeComplication.id, lang);
            logFn?.(`[COMPLICATION DISCOVERED] [${entity.key.toUpperCase()}] ${entity.activeComplication.id}`);
            notifyFn?.(`🚨 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${getText('complicationTitle', lang)} «${comp.name}»!`, 'error');
        }
    }
}

export function checkEntityFetalDemise(entity, logFn) {
    if (!entity.isPregnant || !entity.isFetalPathologyEnabled || (entity.fetalDemise && entity.fetalDemise.isDead)) return;
    
    const week = entity.pregnancyWeeks;
    let currentTrimester = 1;
    if (entity.mode === 'oviposition') {
        if (week >= 3 && week <= 4) currentTrimester = 2;
        else if (week >= 5) currentTrimester = 3;
    } else {
        if (week >= 13 && week <= 27) currentTrimester = 2;
        else if (week >= 28) currentTrimester = 3;
    }

    if (!entity.fetalDemiseRolledTrimesters[currentTrimester]) {
        entity.fetalDemiseRolledTrimesters[currentTrimester] = true;
        let demiseChance = currentTrimester === 1 ? 8 : (currentTrimester === 2 ? 1.5 : 0.4);
        const roll = Math.random() * 100;
        if (roll < demiseChance) {
            entity.fetalDemise = { isDead: true, daysSinceDemise: 0, hasInfection: false };
            logFn?.(`[DEMISE ROLLED] [${entity.key.toUpperCase()}] Non-viable development rolled.`);
        }
    }
}

export function advanceEntityDays(entity, days, aiAwareness, lang, logFn, notifyFn) {
    // 1. Посткладочное восстановление / реабилитация
    if (entity.postpartumDays > 0) {
        entity.postpartumDays += days;
        const maxRecoveryDays = (entity.deliveryMethod === 'miscarriage') ? 14 : (entity.mode === 'oviposition' ? 14 : 40);
        if (entity.postpartumDays > maxRecoveryDays) {
            entity.postpartumDays = 0;
            entity.deliveryMethod = 'none';
            entity.cycleDay = 1; 
            entity.currentCycleTargetLength = rollNewCycleTarget(entity);
            logFn?.(`[POSTPARTUM] [${entity.key.toUpperCase()}] Recovery completed.`);
            notifyFn?.(lang === 'en' 
                ? `[${entity.key === 'user' ? '{{user}}' : '{{char}}'}] Recovery complete. New cycle started.`
                : `[${entity.key === 'user' ? '{{user}}' : '{{char}}'}] Восстановление завершено. Цикл запущен.`, 'success');
        }
        return;
    }

    // 2. Внешнее высиживание яиц в гнезде (Инкубация)
    if (entity.isIncubating) {
        entity.incubationDaysTotal += days;
        if (entity.incubationDaysTotal >= (entity.maxIncubationDays || 70)) {
            hatchEntityEggs(entity, lang, logFn, notifyFn);
        }
        return;
    }

    // 3. Внутреннее вынашивание (Гравидность)
    if (entity.isPregnant) {
        checkEntityFetalDemise(entity, logFn);

        const prevWeeks = entity.pregnancyWeeks;
        entity.pregnancyDaysTotal += days;
        entity.pregnancyWeeks = Math.floor(entity.pregnancyDaysTotal / 7);
        entity.pregnancyDays = entity.pregnancyDaysTotal % 7;
        entity.cycleDay += days;

        const autoDiscoveryWeek = (aiAwareness === 'hidden') ? 4 : 2;
        if (!entity.isDiscovered && entity.pregnancyWeeks >= autoDiscoveryWeek) {
            entity.isDiscovered = true;
            logFn?.(`[DISCOVERED] [${entity.key.toUpperCase()}] Confirmed at ${entity.pregnancyWeeks} weeks.`);
            notifyFn?.(lang === 'en' 
                ? `🚨 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] Gestation confirmed (~${entity.pregnancyWeeks} wks)!` 
                : `🚨 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] Вынашивание подтверждено (~${entity.pregnancyWeeks} нед.)!`, 'success');
        }

        updateEntitySymptoms(entity);
        const maxWeeks = entity.maxPregnancyWeeks || (entity.mode === 'oviposition' ? 6 : (entity.mode === 'omegaverse' ? 36 : 40));
        if (entity.isDiscovered && entity.pregnancyWeeks >= maxWeeks) {
            notifyFn?.(`[${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${getText('toastPregEnd', lang)}`, 'warning');
        }
    } else {
        // Обычный цикл
        const target = entity.currentCycleTargetLength || entity.cycleLength || (entity.mode === 'oviposition' ? 90 : 28);
        entity.cycleDay += days;

        if (entity.cycleDay > target) {
            entity.cycleDay = ((entity.cycleDay - 1) % target) + 1;
            entity.currentCycleTargetLength = rollNewCycleTarget(entity);
            entity.symptomPhaseKey = null;
            logFn?.(`[CYCLE RESET] [${entity.key.toUpperCase()}] New cycle started after ${target} days.`);
            
            let cycleToastKey = 'toastNewCycle';
            if (entity.mode === 'omegaverse') cycleToastKey = 'toastNewHeat';
            if (entity.mode === 'oviposition') cycleToastKey = 'toastNewOvipositionCycle';
            
            notifyFn?.(`[${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${getText(cycleToastKey, lang)}`, 'info');
        }
        updateEntitySymptoms(entity);
    }
}

export function triggerEntityPregnancy(entity, lang = 'ru', logFn, notifyFn) {
    entity.isPregnant = true;
    entity.pregnancyDaysTotal = Math.max(7, entity.cycleDay || 7);
    entity.pregnancyWeeks = Math.floor(entity.pregnancyDaysTotal / 7);
    entity.pregnancyDays = entity.pregnancyDaysTotal % 7;
    entity.isDiscovered = !entity.isSecretConception;
    entity.rolledTrimesters = { 1: false, 2: false, 3: false }; 
    entity.fetalDemiseRolledTrimesters = { 1: false, 2: false, 3: false };
    entity.fetalDemise = null;
    entity.activeComplication = null;
    entity.deliveryMethod = 'none';
    entity.currentDeliveredCount = 0;
    entity.isIncubating = false;
    entity.incubationDaysTotal = 0;

    // Случайное количество яиц: от 2 до 7 для яйцеклада
    if (entity.mode === 'oviposition') {
        entity.babiesCount = Math.floor(Math.random() * 6) + 2; // 2..7 яиц
    } else if (entity.mode === 'omegaverse') {
        const roll = Math.random() * 100;
        entity.babiesCount = (roll > 92 ? 3 : roll > 70 ? 2 : 1);
    } else {
        const roll = Math.random() * 100;
        entity.babiesCount = (roll > 98.5 ? 3 : roll > 95 ? 2 : 1);
    }

    entity.babiesGenders = [];
    entity.babiesDiseases = [];
    
    for (let i = 0; i < entity.babiesCount; i++) {
        entity.babiesGenders.push(generateBabyGender(entity.mode, 'en'));
        entity.babiesDiseases.push(null);
    }

    entity.fetalDiseaseId = null;
    if (entity.isFetalPathologyEnabled && Math.random() * 100 < 5) {
        const isEgg = (entity.mode === 'oviposition');
        const primaryDisease = getRandomFetalDiseaseId(isEgg);
        entity.fetalDiseaseId = primaryDisease;
        entity.babiesDiseases[0] = primaryDisease;
    }

    checkEntityFetalDemise(entity, logFn);
    logFn?.(`[PREGNANCY INITIATED] [${entity.key.toUpperCase()}] Count: ${entity.babiesCount} | Mode: ${entity.mode}`);

    updateEntitySymptoms(entity);
    if (entity.isDiscovered) {
        notifyFn?.(`🚨 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${getText(entity.mode === 'oviposition' ? 'toastEggConception' : 'toastConception', lang)}`, 'success');
    }
}

// Откладка яиц в гнездо (для Oviposition) или роды (для Realism/Omegaverse)
export function deliverEntitySingleBaby(entity, method = 'natural', lang = 'ru', logFn, notifyFn) {
    if (entity.mode === 'oviposition') {
        // При яйцекладке откладывается вся кладка разом в гнездо на инкубацию!
        entity.isPregnant = false;
        entity.isDiscovered = true;
        entity.isIncubating = true;
        entity.incubationDaysTotal = 0;
        entity.pregnancyDaysTotal = 0;
        entity.pregnancyWeeks = 0;
        entity.pregnancyDays = 0;
        entity.postpartumDays = 1;
        entity.deliveryMethod = 'oviposition_laying';

        logFn?.(`[OVIPOSITION] [${entity.key.toUpperCase()}] Laid clutch of ${entity.babiesCount} eggs into nest.`);
        notifyFn?.(`🪺 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${lang === 'en' ? `Laid a clutch of ${entity.babiesCount} eggs! Transferred to nest incubation.` : `Отложена кладка из ${entity.babiesCount} яиц! Яйца перемещены в гнездо на высиживание.`}`, 'success');
        return;
    }

    const rawGender = entity.babiesGenders.shift() || generateBabyGender(entity.mode, 'en');
    const babyDiseaseId = entity.babiesDiseases?.length > 0 ? entity.babiesDiseases.shift() : null;
    
    entity.currentDeliveredCount = (entity.currentDeliveredCount || 0) + 1;
    entity.childrenList.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        gender: rawGender,
        diseaseId: babyDiseaseId
    });
    
    entity.babiesCount = entity.babiesGenders.length;
    const displayGender = translateGender(rawGender, lang);
    const disease = babyDiseaseId ? getFetalDisease(babyDiseaseId, lang) : null;

    logFn?.(`[BIRTH] [${entity.key.toUpperCase()}] Delivered: ${rawGender} | Method: ${method}`);

    if (entity.babiesCount === 0) {
        entity.isPregnant = false;
        entity.isDiscovered = false;
        entity.pregnancyDaysTotal = 0;
        entity.pregnancyWeeks = 0;
        entity.pregnancyDays = 0;
        entity.currentDeliveredCount = 0;
        entity.activeComplication = null;
        entity.fetalDiseaseId = null;
        entity.babiesDiseases = [];
        entity.fetalDemise = null;
        entity.fetalDemiseRolledTrimesters = { 1: false, 2: false, 3: false };
        entity.postpartumDays = 1;
        entity.deliveryMethod = method;

        const methodText = method === 'c_section' ? (lang === 'en' ? 'C-Section' : 'Кесарево сечение') : (lang === 'en' ? 'Natural' : 'Естественные роды');
        const extraNote = disease ? ` (${disease.name})` : '';
        notifyFn?.(`👶 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${lang === 'en' ? 'Delivery complete!' : 'Роды завершены!'} (${displayGender})${extraNote} [${methodText}]`, 'success');
    } else {
        const extraNote = disease ? ` (${disease.name})` : '';
        notifyFn?.(`👶 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${lang === 'en' ? 'Baby born' : 'Родился ребёнок'} (${displayGender})${extraNote}. ${lang === 'en' ? 'Remaining:' : 'Осталось:'} ${entity.babiesCount}`, 'info');
    }
}

// Финал инкубации: вылупление всех яиц из гнезда
export function hatchEntityEggs(entity, lang = 'ru', logFn, notifyFn) {
    if (!entity.isIncubating) return;

    const count = entity.babiesGenders.length;
    for (let i = 0; i < count; i++) {
        const rawGender = entity.babiesGenders[i] || generateBabyGender('oviposition', 'en');
        const babyDiseaseId = entity.babiesDiseases[i] || null;
        entity.childrenList.push({
            id: Date.now() + i,
            gender: rawGender,
            diseaseId: babyDiseaseId
        });
    }

    logFn?.(`[HATCHING] [${entity.key.toUpperCase()}] All ${count} dragon eggs successfully hatched!`);
    notifyFn?.(`🐣 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${lang === 'en' ? `Clutch hatched! ${count} dragon hatchlings emerged from the eggs!` : `Вылупление завершено! Из яиц появилось ${count} детенышей!`}`, 'success');

    entity.isIncubating = false;
    entity.incubationDaysTotal = 0;
    entity.babiesCount = 0;
    entity.babiesGenders = [];
    entity.babiesDiseases = [];
}

export function processEntityAbortion(entity, lang = 'ru', logFn, notifyFn) {
    logFn?.(`[ABORTION] [${entity.key.toUpperCase()}] Terminated.`);
    entity.isPregnant = false;
    entity.isDiscovered = false;
    entity.isIncubating = false;
    entity.pregnancyDaysTotal = 0;
    entity.pregnancyWeeks = 0;
    entity.pregnancyDays = 0;
    entity.currentDeliveredCount = 0;
    entity.babiesCount = 0;
    entity.babiesGenders = [];
    entity.babiesDiseases = [];
    entity.activeComplication = null;
    entity.fetalDiseaseId = null;
    entity.fetalDemise = null;
    entity.fetalDemiseRolledTrimesters = { 1: false, 2: false, 3: false };
    entity.postpartumDays = 1;
    entity.deliveryMethod = 'miscarriage'; 

    notifyFn?.(`[${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${getText('toastAbort', lang)}`, 'info');
}
