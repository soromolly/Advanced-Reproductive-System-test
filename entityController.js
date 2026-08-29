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
        mode: 'realism',
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
    const base = entity.cycleLength || 28;
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
        
        if (roll < 33.33) {
            sec = isRu ? 'Альфа' : 'Alpha';
        } else if (roll < 66.66) {
            sec = isRu ? 'Омега' : 'Omega';
        } else {
            sec = isRu ? 'Бета' : 'Beta';
        }
        
        if (isRu) return isBoy ? `${sec}-мальчик ♂` : `${sec}-девочка ♀`;
        return isBoy ? `${sec} Boy ♂` : `${sec} Girl ♀`;
    } else {
        if (isRu) return isBoy ? 'Мальчик ♂' : 'Девочка ♀';
        return isBoy ? 'Boy ♂' : 'Girl ♀';
    }
}

function formatDelayDays(days, lang = 'ru') {
    if (lang === 'en') {
        return `${days} ${days === 1 ? 'day' : 'days'}`;
    }
    const abs = Math.abs(days) % 100;
    const last = abs % 10;
    if (abs >= 11 && abs <= 19) return `${days} дней`;
    if (last === 1) return `${days} день`;
    if (last >= 2 && last <= 4) return `${days} дня`;
    return `${days} дней`;
}

export function getEntityBodyPhase(entity, lang = 'ru') {
    const l = (lang === 'en') ? 'en' : 'ru';
    const isRevealedPregnancy = entity.isPregnant && (entity.isDiscovered || !entity.isSecretConception);

    if (entity.postpartumDays > 0) return getText('postpartumPhase', l);
    if (isRevealedPregnancy) {
        return entity.mode === 'realism' ? getText('pregnancy', l) : getText('pregnancyOmega', l);
    }

    const day = entity.cycleDay;
    const baseLength = entity.cycleLength || 28;
    const targetLength = entity.currentCycleTargetLength || baseLength;
    const periodDays = entity.periodDuration || 5;

    if (entity.mode === 'realism') {
        // Проверяем задержку от дефолтного cycleLength
        if (day > baseLength) {
            const delay = day - baseLength;
            return `${getText('delayed', l)} (${formatDelayDays(delay, l)})`;
        }
        if (day <= periodDays) return getText('menstruation', l);
        
        const ovulPeak = Math.max(periodDays + 2, targetLength - 14);
        const ovulStart = Math.max(periodDays + 1, ovulPeak - 3);
        const ovulEnd = ovulPeak + 1;

        if (day < ovulStart) return getText('follicular', l);
        if (day >= ovulStart && day <= ovulEnd) return getText('ovulation', l);
        return getText('luteal', l);
    } else {
        if (day > baseLength) {
            const delay = day - baseLength;
            return `${getText('delayedHeat', l)} (${formatDelayDays(delay, l)})`;
        }
        if (day <= periodDays) return getText('heat', l);
        return getText('quiescence', l);
    }
}

export function updateEntitySymptoms(entity) {
    if (entity.postpartumDays > 0) {
        entity.symptomPhaseKey = null;
        entity.symptomIndices = [];
        return;
    }

    const isRevealedPregnancy = entity.isPregnant && (entity.isDiscovered || !entity.isSecretConception);
    let phaseKey = null;

    if (isRevealedPregnancy) {
        const week = entity.pregnancyWeeks;
        if (week <= 12) phaseKey = 'preg_trimester_1';
        else if (week >= 13 && week <= 26) phaseKey = 'preg_trimester_2';
        else phaseKey = 'preg_trimester_3';
    } else {
        const day = entity.cycleDay;
        const targetLength = entity.currentCycleTargetLength || entity.cycleLength || 28;
        const periodDays = entity.periodDuration || 5;

        if (entity.mode === 'realism') {
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
    if (!isRevealed) return;

    const currentWeek = entity.pregnancyWeeks;
    let currentTrimester = 1;
    if (currentWeek >= 13 && currentWeek <= 26) currentTrimester = 2;
    else if (currentWeek >= 27) currentTrimester = 3;

    if (!entity.rolledTrimesters[currentTrimester] && !entity.activeComplication) {
        entity.rolledTrimesters[currentTrimester] = true;
        const rolled = rollComplication(currentTrimester);
        if (rolled) {
            entity.activeComplication = rolled;
            logFn?.(`[COMPLICATION] [${entity.key.toUpperCase()}] Trimester ${currentTrimester}: ${rolled.id} (Week ${rolled.triggerWeek})`);
        }
    }

    if (entity.activeComplication && !entity.activeComplication.isDiscovered) {
        if (currentWeek >= entity.activeComplication.triggerWeek) {
            entity.activeComplication.isDiscovered = true;
            const comp = getComplication(entity.activeComplication.id, lang);
            logFn?.(`[COMPLICATION DISCOVERED] [${entity.key.toUpperCase()}] ${entity.activeComplication.id} diagnosed at week ${currentWeek}`);
            notifyFn?.(`🚨 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${getText('complicationTitle', lang)} «${comp.name}»!`, 'error');
        }
    }
}

export function checkEntityFetalDemise(entity, logFn) {
    if (!entity.isPregnant || !entity.isFetalPathologyEnabled || (entity.fetalDemise && entity.fetalDemise.isDead)) return;
    
    const week = entity.pregnancyWeeks;
    let currentTrimester = 1;
    if (week >= 13 && week <= 27) currentTrimester = 2;
    else if (week >= 28) currentTrimester = 3;

    if (!entity.fetalDemiseRolledTrimesters[currentTrimester]) {
        entity.fetalDemiseRolledTrimesters[currentTrimester] = true;
        
        let demiseChance = currentTrimester === 1 ? 10 : (currentTrimester === 2 ? 1.5 : 0.4);
        const roll = Math.random() * 100;
        if (roll < demiseChance) {
            entity.fetalDemise = { isDead: true, daysSinceDemise: 0, hasInfection: false };
            logFn?.(`[FETAL DEMISE ROLLED] [${entity.key.toUpperCase()}] Missed miscarriage at week ${week} (Roll: ${roll.toFixed(2)}% < ${demiseChance}%).`);
        }
    }
}

export function advanceEntityDays(entity, days, aiAwareness, lang, logFn, notifyFn) {
    if (entity.postpartumDays > 0) {
        entity.postpartumDays += days;
        const maxRecoveryDays = (entity.deliveryMethod === 'miscarriage') ? 14 : 40;
        if (entity.postpartumDays > maxRecoveryDays) {
            entity.postpartumDays = 0;
            entity.deliveryMethod = 'none';
            entity.cycleDay = 1; 
            entity.currentCycleTargetLength = rollNewCycleTarget(entity);
            logFn?.(`[POSTPARTUM] [${entity.key.toUpperCase()}] Recovery completed. New cycle started.`);
            notifyFn?.(lang === 'en' 
                ? `[${entity.key === 'user' ? '{{user}}' : '{{char}}'}] Postpartum recovery complete. Cycle restarted.`
                : `[${entity.key === 'user' ? '{{user}}' : '{{char}}'}] Восстановление завершено. Цикл запущен.`, 'success');
        }
        return;
    }

    if (entity.isPregnant) {
        checkEntityFetalDemise(entity, logFn);

        if (entity.fetalDemise && entity.fetalDemise.isDead) {
            entity.fetalDemise.daysSinceDemise += days;
            if (entity.fetalDemise.daysSinceDemise >= 16 && !entity.fetalDemise.hasInfection) {
                entity.fetalDemise.hasInfection = true;
                logFn?.(`[FETAL DEMISE COMPLICATION] [${entity.key.toUpperCase()}] Secondary infection occurred.`);
            }
            if (entity.fetalDemise.daysSinceDemise >= 21) {
                processEntityMiscarriage(entity, lang, logFn, notifyFn);
                return;
            }
        }

        if (entity.activeComplication?.id === 'miscarriage_threat_early' && entity.activeComplication.isDiscovered) {
            for (let i = 0; i < days; i++) {
                if (Math.random() * 100 < 10) { 
                    processEntityMiscarriage(entity, lang, logFn, notifyFn);
                    return; 
                }
            }
        }

        const prevWeeks = entity.pregnancyWeeks;
        entity.pregnancyDaysTotal += days;
        entity.pregnancyWeeks = Math.floor(entity.pregnancyDaysTotal / 7);
        entity.pregnancyDays = entity.pregnancyDaysTotal % 7;
        entity.cycleDay += days;

        const autoDiscoveryWeek = (aiAwareness === 'hidden') ? 9 : 6;
        if (!entity.isDiscovered && entity.pregnancyWeeks >= autoDiscoveryWeek) {
            entity.isDiscovered = true;
            logFn?.(`[PREGNANCY DISCOVERED] [${entity.key.toUpperCase()}] Confirmed at ${entity.pregnancyWeeks} weeks.`);
            notifyFn?.(lang === 'en' 
                ? `🚨 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] Pregnancy confirmed (~${entity.pregnancyWeeks} wks)!` 
                : `🚨 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] Беременность подтверждена (~${entity.pregnancyWeeks} нед.)!`, 'success');
        }

        if (entity.isDiscovered && entity.babiesDiseases && aiAwareness !== 'hidden') {
            entity.babiesDiseases.forEach((dId, idx) => {
                if (dId) {
                    const disease = getFetalDisease(dId, lang);
                    if (disease && disease.type === 'prenatal' && disease.discoveryWeek) {
                        if (prevWeeks < disease.discoveryWeek && entity.pregnancyWeeks >= disease.discoveryWeek) {
                            logFn?.(`[SCREENING WEEK ${disease.discoveryWeek}] [${entity.key.toUpperCase()}] Fetus #${idx + 1}: ${disease.name}`);
                            const babyTitle = entity.babiesCount > 1 ? ` (${getText('childLabel', lang)} #${idx + 1})` : '';
                            notifyFn?.(`🧬 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${getText('fetalAnomalyTitle', lang)}${babyTitle} «${disease.name}»!`, 'warning');
                        }
                    }
                }
            });
        }

        updateEntitySymptoms(entity);
        const maxWeeks = entity.maxPregnancyWeeks || (entity.mode === 'omegaverse' ? 36 : 40);
        if (entity.isDiscovered && entity.pregnancyWeeks >= maxWeeks) {
            notifyFn?.(`[${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${getText('toastPregEnd', lang)}`, 'warning');
        }
    } else {
        const target = entity.currentCycleTargetLength || entity.cycleLength || 28;
        entity.cycleDay += days;

        if (entity.cycleDay > target) {
            entity.cycleDay = ((entity.cycleDay - 1) % target) + 1;
            entity.currentCycleTargetLength = rollNewCycleTarget(entity);
            entity.symptomPhaseKey = null;
            logFn?.(`[CYCLE RESET] [${entity.key.toUpperCase()}] New cycle started after ${target} days.`);
            notifyFn?.(`[${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${entity.mode === 'omegaverse' ? getText('toastNewHeat', lang) : getText('toastNewCycle', lang)}`, 'info');
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

    const roll = Math.random() * 100;
    entity.babiesCount = entity.mode === 'omegaverse' ? (roll > 92 ? 3 : roll > 70 ? 2 : 1) : (roll > 98.5 ? 3 : roll > 95 ? 2 : 1);
    entity.babiesGenders = [];
    entity.babiesDiseases = [];
    
    for (let i = 0; i < entity.babiesCount; i++) {
        entity.babiesGenders.push(generateBabyGender(entity.mode, 'en'));
        entity.babiesDiseases.push(null);
    }

    entity.fetalDiseaseId = null;
    if (entity.isFetalPathologyEnabled && Math.random() * 100 < 3) {
        const primaryDisease = getRandomFetalDiseaseId();
        entity.fetalDiseaseId = primaryDisease;
        entity.babiesDiseases[0] = primaryDisease;

        for (let i = 1; i < entity.babiesCount; i++) {
            if (Math.random() * 100 < 5) entity.babiesDiseases[i] = getRandomFetalDiseaseId();
        }
        entity.babiesDiseases.sort(() => 0.5 - Math.random());
    }

    checkEntityFetalDemise(entity, logFn);
    logFn?.(`[PREGNANCY INITIATED] [${entity.key.toUpperCase()}] Babies: ${entity.babiesCount} | Diseases: [${entity.babiesDiseases.join(', ')}] | Secret: ${entity.isSecretConception}`);

    updateEntitySymptoms(entity);
    if (entity.isDiscovered) {
        notifyFn?.(`🚨 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${getText('toastConception', lang)}`, 'success');
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
    const displayGender = translateGender(rawGender, lang);
    const disease = babyDiseaseId ? getFetalDisease(babyDiseaseId, lang) : null;

    logFn?.(`[BIRTH] [${entity.key.toUpperCase()}] Delivered: ${rawGender} | Method: ${method} | Remaining: ${entity.babiesCount}`);

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

export function processEntityMiscarriage(entity, lang = 'ru', logFn, notifyFn) {
    logFn?.(`[MISCARRIAGE] [${entity.key.toUpperCase()}] Spontaneous miscarriage.`);
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

    notifyFn?.(`🚨 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${lang === 'en' ? 'Miscarriage occurred. Pregnancy terminated.' : 'Произошел самопроизвольный выкидыш. Беременность прервана.'}`, 'error');
}

export function processEntityAbortion(entity, lang = 'ru', logFn, notifyFn) {
    logFn?.(`[ABORTION] [${entity.key.toUpperCase()}] Terminated at ${entity.pregnancyWeeks} weeks.`);
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
