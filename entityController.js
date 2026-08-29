import { 
    getRandomSymptomIndices, 
    rollComplication, 
    getComplication, 
    getRandomFetalDiseaseId, 
    getFetalDisease 
} from './symptoms.js';
import { rollEggPathology, getEggPathology } from './oviposition.js';
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
    const base = entity.cycleLength || (entity.mode === 'oviposition' ? 30 : 28);
    if (!entity.isIrregularCycle) return base;
    
    const roll = Math.random() * 100;
    let variance = 0;
    if (roll < 65) {
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
    
    if (mode === 'omegaverse') {
        const roll = Math.random() * 100;
        let sec = isRu ? 'Бета' : 'Beta';
        if (roll < 33.33) sec = isRu ? 'Альфа' : 'Alpha';
        else if (roll < 66.66) sec = isRu ? 'Омега' : 'Omega';
        return isRu ? `${sec}-${isBoy ? 'мальчик ♂' : 'девочка ♀'}` : `${sec} ${isBoy ? 'Boy ♂' : 'Girl ♀'}`;
    } else {
        return isRu ? (isBoy ? 'Мальчик ♂' : 'Девочка ♀') : (isBoy ? 'Boy ♂' : 'Girl ♀');
    }
}

export function getEntityBodyPhase(entity, lang = 'ru') {
    const l = (lang === 'en') ? 'en' : 'ru';
    const isRevealed = entity.isPregnant && (entity.isDiscovered || !entity.isSecretConception);

    if (entity.postpartumDays > 0) {
        return entity.mode === 'oviposition' ? getText('postLayingPhase', l) : getText('postpartumPhase', l);
    }
    if (isRevealed) {
        if (entity.mode === 'oviposition') return getText('pregnancyOviposition', l);
        return entity.mode === 'realism' ? getText('pregnancy', l) : getText('pregnancyOmega', l);
    }

    const day = entity.cycleDay;
    const targetLength = entity.currentCycleTargetLength || entity.cycleLength || 28;
    const periodDays = entity.periodDuration || 5;

    if (entity.mode === 'oviposition') {
        if (day > targetLength) return getText('delayedRut', l);
        if (day <= periodDays) return getText('rut', l);
        return getText('quiescence', l);
    } else if (entity.mode === 'omegaverse') {
        if (day > targetLength) return getText('delayedHeat', l);
        if (day <= periodDays) return getText('heat', l);
        return getText('quiescence', l);
    } else {
        if (day > targetLength) return getText('delayed', l);
        if (day <= periodDays) return getText('menstruation', l);
        const ovulPeak = Math.max(periodDays + 2, targetLength - 14);
        const ovulStart = Math.max(periodDays + 1, ovulPeak - 3);
        const ovulEnd = ovulPeak + 1;
        if (day < ovulStart) return getText('follicular', l);
        if (day >= ovulStart && day <= ovulEnd) return getText('ovulation', l);
        return getText('luteal', l);
    }
}

export function updateEntitySymptoms(entity) {
    if (entity.postpartumDays > 0) {
        entity.symptomPhaseKey = (entity.mode === 'oviposition') ? 'post_laying' : null;
        entity.symptomIndices = (entity.mode === 'oviposition') ? getRandomSymptomIndices('post_laying', 2) : [];
        return;
    }

    const isRevealed = entity.isPregnant && (entity.isDiscovered || !entity.isSecretConception);
    let phaseKey = null;

    if (isRevealed) {
        if (entity.mode === 'oviposition') {
            phaseKey = entity.pregnancyWeeks <= 3 ? 'gravid_oviposition_early' : 'gravid_oviposition_late';
        } else {
            const week = entity.pregnancyWeeks;
            if (week <= 12) phaseKey = 'preg_trimester_1';
            else if (week >= 13 && week <= 26) phaseKey = 'preg_trimester_2';
            else phaseKey = 'preg_trimester_3';
        }
    } else {
        const day = entity.cycleDay;
        const targetLength = entity.currentCycleTargetLength || entity.cycleLength || 28;
        const periodDays = entity.periodDuration || 5;

        if (entity.mode === 'oviposition') {
            if (day <= periodDays) phaseKey = 'rut_oviposition';
        } else if (entity.mode === 'omegaverse') {
            if (day <= periodDays) phaseKey = (entity.gender === 'male_omega') ? 'heat_male' : 'heat_female';
        } else {
            if (day <= targetLength) {
                const ovulPeak = Math.max(periodDays + 2, targetLength - 14);
                const ovulStart = Math.max(periodDays + 1, ovulPeak - 3);
                const ovulEnd = ovulPeak + 1;

                if (day <= periodDays) phaseKey = 'menstruation';
                else if (day < ovulStart) phaseKey = 'follicular';
                else if (day >= ovulStart && day <= ovulEnd) phaseKey = 'ovulation';
                else phaseKey = 'luteal';
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
    if (!isRevealed) return;

    if (entity.mode === 'oviposition') {
        if (entity.isFetalPathologyEnabled && !entity.rolledTrimesters[1] && !entity.activeComplication) {
            entity.rolledTrimesters[1] = true;
            if (Math.random() * 100 < 15) {
                const eggPathology = rollEggPathology();
                entity.activeComplication = eggPathology;
                logFn?.(`[EGG PATHOLOGY ROLLED] [${entity.key.toUpperCase()}] ${eggPathology.id} (Discovered at week ${eggPathology.discoveryWeek})`);
            }
        }
        if (entity.activeComplication && !entity.activeComplication.isDiscovered && entity.pregnancyWeeks >= entity.activeComplication.discoveryWeek) {
            entity.activeComplication.isDiscovered = true;
            const comp = getEggPathology(entity.activeComplication.id, lang);
            logFn?.(`[EGG PATHOLOGY DISCOVERED] [${entity.key.toUpperCase()}] ${entity.activeComplication.id}`);
            notifyFn?.(`🪺 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${getText('eggAnomalyTitle', lang)} «${comp.name}»!`, 'warning');
        }
        return;
    }

    const currentWeek = entity.pregnancyWeeks;
    let currentTrimester = currentWeek >= 27 ? 3 : (currentWeek >= 13 ? 2 : 1);

    if (!entity.rolledTrimesters[currentTrimester] && !entity.activeComplication) {
        entity.rolledTrimesters[currentTrimester] = true;
        const rolled = rollComplication(currentTrimester);
        if (rolled) {
            entity.activeComplication = rolled;
            logFn?.(`[COMPLICATION] [${entity.key.toUpperCase()}] Trimester ${currentTrimester}: ${rolled.id}`);
        }
    }

    if (entity.activeComplication && !entity.activeComplication.isDiscovered && currentWeek >= entity.activeComplication.triggerWeek) {
        entity.activeComplication.isDiscovered = true;
        const comp = getComplication(entity.activeComplication.id, lang);
        logFn?.(`[COMPLICATION DISCOVERED] [${entity.key.toUpperCase()}] ${entity.activeComplication.id}`);
        notifyFn?.(`🚨 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${getText('complicationTitle', lang)} «${comp.name}»!`, 'error');
    }
}

export function checkEntityFetalDemise(entity, logFn) {
    if (!entity.isPregnant || !entity.isFetalPathologyEnabled || (entity.fetalDemise && entity.fetalDemise.isDead)) return;
    
    const week = entity.pregnancyWeeks;
    let currentTrimester = week >= 28 ? 3 : (week >= 13 ? 2 : 1);

    if (!entity.fetalDemiseRolledTrimesters[currentTrimester]) {
        entity.fetalDemiseRolledTrimesters[currentTrimester] = true;
        let demiseChance = entity.mode === 'oviposition' ? 4 : (currentTrimester === 1 ? 10 : (currentTrimester === 2 ? 1.5 : 0.4));
        const roll = Math.random() * 100;
        if (roll < demiseChance) {
            entity.fetalDemise = { isDead: true, daysSinceDemise: 0, hasInfection: false };
            logFn?.(`[DEMISE ROLLED] [${entity.key.toUpperCase()}] Missed arrest at week ${week}.`);
        }
    }
}

export function advanceEntityDays(entity, days, aiAwareness, lang, logFn, notifyFn) {
    if (entity.postpartumDays > 0) {
        entity.postpartumDays += days;
        const maxRecoveryDays = (entity.mode === 'oviposition') ? 28 : ((entity.deliveryMethod === 'miscarriage') ? 14 : 40);
        if (entity.postpartumDays > maxRecoveryDays) {
            entity.postpartumDays = 0;
            entity.deliveryMethod = 'none';
            entity.cycleDay = 1; 
            entity.currentCycleTargetLength = rollNewCycleTarget(entity);
            logFn?.(`[POSTPARTUM] [${entity.key.toUpperCase()}] Recovery completed. Cycle reset.`);
            notifyFn?.(lang === 'en' 
                ? `[${entity.key === 'user' ? '{{user}}' : '{{char}}'}] Recovery completed. Cycle restarted.`
                : `[${entity.key === 'user' ? '{{user}}' : '{{char}}'}] Восстановление завершено. Цикл запущен.`, 'success');
        }
        return;
    }

    if (entity.isPregnant) {
        checkEntityFetalDemise(entity, logFn);

        if (entity.fetalDemise && entity.fetalDemise.isDead) {
            entity.fetalDemise.daysSinceDemise += days;
            if (entity.fetalDemise.daysSinceDemise >= 21) {
                processEntityMiscarriage(entity, lang, logFn, notifyFn);
                return;
            }
        }

        const prevWeeks = entity.pregnancyWeeks;
        entity.pregnancyDaysTotal += days;
        entity.pregnancyWeeks = Math.floor(entity.pregnancyDaysTotal / 7);
        entity.pregnancyDays = entity.pregnancyDaysTotal % 7;
        entity.cycleDay += days;

        // В режиме Яйцекладки из-за твердости скорлупы авто-обнаружение происходит уже на 3-й неделе!
        const autoDiscoveryWeek = (entity.mode === 'oviposition') ? 3 : ((aiAwareness === 'hidden') ? 9 : 6);
        if (!entity.isDiscovered && entity.pregnancyWeeks >= autoDiscoveryWeek) {
            entity.isDiscovered = true;
            logFn?.(`[PREGNANCY/CLUTCH DISCOVERED] [${entity.key.toUpperCase()}] Confirmed at week ${entity.pregnancyWeeks}.`);
            notifyFn?.(lang === 'en' 
                ? `🚨 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${entity.mode === 'oviposition' ? 'Egg clutch detected (~week ' + entity.pregnancyWeeks + ')!' : 'Pregnancy confirmed (~' + entity.pregnancyWeeks + ' wks)!'}` 
                : `🚨 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${entity.mode === 'oviposition' ? 'Обнаружена кладка яиц (~' + entity.pregnancyWeeks + ' нед.)!' : 'Беременность подтверждена (~' + entity.pregnancyWeeks + ' нед.)!'}`, 'success');
        }

        if (entity.isDiscovered && entity.babiesDiseases && aiAwareness !== 'hidden' && entity.mode !== 'oviposition') {
            entity.babiesDiseases.forEach((dId, idx) => {
                if (dId) {
                    const disease = getFetalDisease(dId, lang);
                    if (disease && disease.type === 'prenatal' && disease.discoveryWeek && prevWeeks < disease.discoveryWeek && entity.pregnancyWeeks >= disease.discoveryWeek) {
                        logFn?.(`[SCREENING WEEK ${disease.discoveryWeek}] [${entity.key.toUpperCase()}] Fetus #${idx + 1}: ${disease.name}`);
                        const babyTitle = entity.babiesCount > 1 ? ` (${getText('childLabel', lang)} #${idx + 1})` : '';
                        notifyFn?.(`🧬 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${getText('fetalAnomalyTitle', lang)}${babyTitle} «${disease.name}»!`, 'warning');
                    }
                }
            });
        }

        updateEntitySymptoms(entity);
        const maxWeeks = entity.maxPregnancyWeeks || (entity.mode === 'oviposition' ? 6 : (entity.mode === 'omegaverse' ? 36 : 40));
        if (entity.isDiscovered && entity.pregnancyWeeks >= maxWeeks) {
            notifyFn?.(`[${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${entity.mode === 'oviposition' ? getText('toastClutchReady', lang) : getText('toastPregEnd', lang)}`, 'warning');
        }
    } else {
        const target = entity.currentCycleTargetLength || entity.cycleLength || 28;
        entity.cycleDay += days;

        if (entity.cycleDay > target) {
            entity.cycleDay = ((entity.cycleDay - 1) % target) + 1;
            entity.currentCycleTargetLength = rollNewCycleTarget(entity);
            entity.symptomPhaseKey = null;
            logFn?.(`[CYCLE RESET] [${entity.key.toUpperCase()}] Reset after ${target} days.`);
            const cycleToast = entity.mode === 'oviposition' ? getText('toastNewRut', lang) : (entity.mode === 'omegaverse' ? getText('toastNewHeat', lang) : getText('toastNewCycle', lang));
            notifyFn?.(`[${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${cycleToast}`, 'info');
        }
        updateEntitySymptoms(entity);
    }
}

export function triggerEntityPregnancy(entity, lang = 'ru', logFn, notifyFn) {
    entity.isPregnant = true;
    entity.pregnancyDaysTotal = Math.max(14, entity.cycleDay || 14);
    entity.pregnancyWeeks = Math.floor(entity.pregnancyDaysTotal / 7);
    entity.pregnancyDays = entity.pregnancyDaysTotal % 7;
    entity.isDiscovered = !entity.isSecretConception;
    entity.rolledTrimesters = { 1: false, 2: false, 3: false }; 
    entity.fetalDemiseRolledTrimesters = { 1: false, 2: false, 3: false };
    entity.fetalDemise = null;
    entity.activeComplication = null;
    entity.deliveryMethod = 'none';
    entity.currentDeliveredCount = 0;

    if (entity.mode === 'oviposition') {
        // Случайное количество оплодотворенных яиц от 2 до 7!
        entity.babiesCount = Math.floor(Math.random() * 6) + 2;
        entity.maxPregnancyWeeks = 6;
    } else {
        const roll = Math.random() * 100;
        entity.babiesCount = entity.mode === 'omegaverse' ? (roll > 92 ? 3 : roll > 70 ? 2 : 1) : (roll > 98.5 ? 3 : roll > 95 ? 2 : 1);
    }

    entity.babiesGenders = [];
    entity.babiesDiseases = [];
    
    for (let i = 0; i < entity.babiesCount; i++) {
        entity.babiesGenders.push(generateBabyGender(entity.mode, 'en'));
        entity.babiesDiseases.push(null);
    }

    entity.fetalDiseaseId = null;
    if (entity.mode !== 'oviposition' && entity.isFetalPathologyEnabled && Math.random() * 100 < 3) {
        const primaryDisease = getRandomFetalDiseaseId();
        entity.fetalDiseaseId = primaryDisease;
        entity.babiesDiseases[0] = primaryDisease;
    }

    checkEntityFetalDemise(entity, logFn);
    logFn?.(`[PREGNANCY INITIATED] [${entity.key.toUpperCase()}] Mode: ${entity.mode} | Count: ${entity.babiesCount}`);

    updateEntitySymptoms(entity);
    if (entity.isDiscovered) {
        const toastMsg = entity.mode === 'oviposition' ? getText('toastEggConception', lang) : getText('toastConception', lang);
        notifyFn?.(`🚨 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${toastMsg}`, 'success');
    }
}

export function deliverEntitySingleBaby(entity, method = 'natural', lang = 'ru', logFn, notifyFn) {
    const rawGender = entity.babiesGenders.shift() || generateBabyGender(entity.mode, 'en');
    const babyDiseaseId = entity.babiesDiseases?.length > 0 ? entity.babiesDiseases.shift() : null;
    
    entity.currentDeliveredCount = (entity.currentDeliveredCount || 0) + 1;
    entity.childrenList.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        gender: rawGender,
        diseaseId: babyDiseaseId
    });
    
    entity.babiesCount = entity.babiesGenders.length;
    const isOviposition = entity.mode === 'oviposition';
    const displayGender = translateGender(rawGender, lang);
    const disease = babyDiseaseId ? (isOviposition ? getEggPathology(babyDiseaseId, lang) : getFetalDisease(babyDiseaseId, lang)) : null;

    logFn?.(`[BIRTH/LAYING] [${entity.key.toUpperCase()}] Delivered: ${rawGender} | Remaining: ${entity.babiesCount}`);

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

        const completeMsg = isOviposition ? getText('toastClutchComplete', lang) : (lang === 'en' ? 'Delivery complete!' : 'Роды завершены!');
        notifyFn?.(`🪺 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${completeMsg}`, 'success');
    } else {
        const singleMsg = isOviposition ? getText('toastEggLaid', lang) : (lang === 'en' ? `Baby born (${displayGender})` : `Родился ребёнок (${displayGender})`);
        notifyFn?.(`🪺 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${singleMsg}. ${lang === 'en' ? 'Remaining:' : 'Осталось:'} ${entity.babiesCount}`, 'info');
    }
}

export function processEntityMiscarriage(entity, lang = 'ru', logFn, notifyFn) {
    logFn?.(`[MISCARRIAGE] [${entity.key.toUpperCase()}] Miscarriage / Clutch arrest.`);
    entity.isPregnant = false;
    entity.isDiscovered = false;
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

    notifyFn?.(`🚨 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${lang === 'en' ? 'Pregnancy/Clutch arrested. Terminated.' : 'Прерывание вынашивания. Кладка утрачена.'}`, 'error');
}

export function processEntityAbortion(entity, lang = 'ru', logFn, notifyFn) {
    logFn?.(`[ABORTION] [${entity.key.toUpperCase()}] Terminated manually.`);
    entity.isPregnant = false;
    entity.isDiscovered = false;
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
