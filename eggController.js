// Логика режима «Яйцекладка» — изолирована от entityController.js, чтобы
// разработка остальных систем не задевала этот режим. Режим ЗАМОРОЖЕН:
// работает как раньше, но больше не развивается.
import {
    rollNewCycleTarget,
    ensureStats,
    generateBabyGender,
    getCycleDelayBaseline,
    formatDelayDays
} from './shared.js';
import { getText, translateGender } from './translations.js';
import {
    rollEggCount,
    rollEggIncubationDays,
    rollEggShellDefect,
    getRandomEggSymptomIndices
} from './eggSystem.js';
import { rollEggEmbryoDisease, getEggEmbryoDisease } from './symptoms.js';

// ---------- Отображение: фаза тела / симптомы / «тест» ----------

export function getEggBodyPhase(entity, lang = 'ru') {
    const l = (lang === 'en') ? 'en' : 'ru';
    const isRevealedPregnancy = entity.isPregnant && (entity.isDiscovered || !entity.isSecretConception);

    if (entity.isNestActive) {
        return l === 'en' ? 'Egg Incubation (Nest) 🥚' : 'Инкубация яиц (гнездо) 🥚';
    }

    if (entity.postpartumDays > 0) return getText('postpartumPhase', l);
    if (isRevealedPregnancy) {
        return l === 'en' ? 'Egg Carrying 🥚' : 'Вынашивание яиц 🥚';
    }

    const day = entity.cycleDay;
    const delayBaseline = getCycleDelayBaseline(entity);
    const periodDays = entity.periodDuration || 5;

    if (day > delayBaseline) {
        const delay = day - delayBaseline;
        return `${getText('delayedHeat', l)} (${formatDelayDays(delay, l)})`;
    }
    if (day <= periodDays) return getText('heat', l);
    return l === 'en' ? 'Quiescence (Rest Period) 🌿' : 'Период покоя 🌿';
}

export function getEggPregnancyCheckResult(entity, aiAwareness) {
    const delayDays = Math.max(1, entity.cycleDay - getCycleDelayBaseline(entity));
    // Для яйцекладки «теста» нет — вынашивание яиц подтверждается сразу.
    return { status: 'positive', delayDays };
}

export function updateEggSymptoms(entity) {
    if (entity.isNestActive) {
        entity.symptomPhaseKey = null;
        entity.symptomIndices = [];
        return;
    }

    if (entity.postpartumDays > 0) {
        if (entity.symptomPhaseKey !== 'egg_recovery' || !entity.symptomIndices?.length) {
            entity.symptomPhaseKey = 'egg_recovery';
            entity.symptomIndices = getRandomEggSymptomIndices('egg_recovery', 3);
        }
        return;
    }

    const isRevealedPregnancy = entity.isPregnant && (entity.isDiscovered || !entity.isSecretConception);
    let phaseKey = null;

    if (isRevealedPregnancy) {
        const days = entity.pregnancyDaysTotal;
        if (days < 8) phaseKey = 'egg_forming';
        else if (days < 29) phaseKey = 'egg_carrying';
        else phaseKey = 'egg_carrying_late';
    } else {
        const day = entity.cycleDay;
        const periodDays = entity.periodDuration || 5;
        if (day <= periodDays) {
            phaseKey = (entity.gender === 'male') ? 'egg_heat_male' : 'egg_heat_female';
        } else {
            phaseKey = 'egg_quiescence';
        }
    }

    if (phaseKey) {
        if (entity.symptomPhaseKey !== phaseKey || !entity.symptomIndices || entity.symptomIndices.length === 0) {
            entity.symptomPhaseKey = phaseKey;
            entity.symptomIndices = getRandomEggSymptomIndices(phaseKey, 3);
        }
    } else {
        entity.symptomPhaseKey = null;
        entity.symptomIndices = [];
    }
}

// ---------- Вынашивание / кладка / инкубация ----------

export function advanceOvipositionEntity(entity, days, aiAwareness, lang, logFn, notifyFn) {
    if (entity.isNestActive) {
        entity.eggIncubationDays += days;
        if (entity.postpartumDays > 0) {
            entity.postpartumDays += days;
            if (entity.postpartumDays > 7) entity.postpartumDays = 0;
        }
        logFn?.(`[EGG INCUBATION] [${entity.key.toUpperCase()}] Day ${entity.eggIncubationDays}/${entity.eggIncubationTotal}`);
        if (entity.eggIncubationDays >= entity.eggIncubationTotal) {
            hatchEggs(entity, lang, logFn, notifyFn);
        }
        return;
    }

    if (entity.postpartumDays > 0) {
        let remaining = days;
        for (let i = 0; i < days; i++) {
            entity.postpartumDays += 1;
            remaining -= 1;
            if (entity.postpartumDays > 7) {
                entity.postpartumDays = 0;
                entity.deliveryMethod = 'none';
                entity.cycleDay = 1;
                entity.currentCycleTargetLength = rollNewCycleTarget(entity);
                break;
            }
        }
        if (entity.postpartumDays === 0 && remaining > 0) {
            const target = entity.currentCycleTargetLength || entity.cycleLength || 28;
            entity.cycleDay += remaining;
            if (entity.cycleDay > target) {
                entity.cycleDay = ((entity.cycleDay - 1) % target) + 1;
                entity.currentCycleTargetLength = rollNewCycleTarget(entity);
                entity.symptomPhaseKey = null;
                logFn?.(`[CYCLE RESET] [${entity.key.toUpperCase()}] New cycle after ${target} days.`);
                notifyFn?.(`[${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${getText('toastNewHeat', lang)}`, 'info');
            }
        }
        updateEggSymptoms(entity);
        return;
    }

    if (entity.isPregnant) {
        entity.pregnancyDaysTotal += days;
        entity.pregnancyWeeks = Math.floor(entity.pregnancyDaysTotal / 7);
        entity.pregnancyDays = entity.pregnancyDaysTotal % 7;
        entity.cycleDay += days;

        const autoDiscoveryDays = (aiAwareness === 'hidden') ? 14 : 5;
        if (!entity.isDiscovered && entity.pregnancyDaysTotal >= autoDiscoveryDays) {
            entity.isDiscovered = true;
            logFn?.(`[EGG CARRYING DISCOVERED] [${entity.key.toUpperCase()}] Confirmed at day ${entity.pregnancyDaysTotal}.`);
            notifyFn?.(lang === 'en' 
                ? `🥚 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] Egg carrying confirmed (~${entity.pregnancyWeeks} wks)!`
                : `🥚 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] Вынашивание яиц подтверждено (~${entity.pregnancyWeeks} нед.)!`, 'success');
        }

        updateEggSymptoms(entity);

        if (entity.pregnancyDaysTotal >= 42) {
            notifyFn?.(`[${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${lang === 'en' ? 'Time to lay eggs!' : 'Пора откладывать яйца!'}`, 'warning');
        }
        return;
    }

    const target = entity.currentCycleTargetLength || entity.cycleLength || 28;
    entity.cycleDay += days;
    if (entity.cycleDay > target) {
        entity.cycleDay = ((entity.cycleDay - 1) % target) + 1;
        entity.currentCycleTargetLength = rollNewCycleTarget(entity);
        entity.symptomPhaseKey = null;
        logFn?.(`[CYCLE RESET] [${entity.key.toUpperCase()}] New cycle after ${target} days.`);
        notifyFn?.(`[${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${getText('toastNewHeat', lang)}`, 'info');
    }
    updateEggSymptoms(entity);
}

export function triggerEggGravid(entity, lang = 'ru', logFn, notifyFn) {
    ensureStats(entity).clutches += 1;
    entity.isPregnant = true;
    entity.pregnancyDaysTotal = Math.max(1, entity.cycleDay || 1);
    entity.pregnancyWeeks = Math.floor(entity.pregnancyDaysTotal / 7);
    entity.pregnancyDays = entity.pregnancyDaysTotal % 7;
    entity.isDiscovered = !entity.isSecretConception;
    entity.deliveryMethod = 'none';
    entity.eggsLaid = 0;
    entity.laidEggs = [];
    entity.eggsHatched = 0;
    entity.isNestActive = false;
    entity.eggIncubationDays = 0;
    entity.eggIncubationTotal = 0;

    entity.eggCount = rollEggCount();

    entity.eggShellDefects = [];
    for (let i = 0; i < entity.eggCount; i++) {
        entity.eggShellDefects.push(rollEggShellDefect());
    }

    entity.eggGenders = [];
    entity.eggDiseases = [];
    for (let i = 0; i < entity.eggCount; i++) {
        entity.eggGenders.push(generateBabyGender('realism', 'en'));
        entity.eggDiseases.push(entity.isFetalPathologyEnabled ? rollEggEmbryoDisease() : null);
    }

    logFn?.(`[EGG GRAVID INITIATED] [${entity.key.toUpperCase()}] Eggs: ${entity.eggCount} | Secret: ${entity.isSecretConception}`);

    updateEggSymptoms(entity);
    if (entity.isDiscovered) {
        notifyFn?.(`🥚 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${lang === 'en' ? 'Egg carrying has begun.' : 'Началось вынашивание яиц.'}`, 'success');
    }
}

export function laySingleEgg(entity, lang = 'ru', logFn, notifyFn) {
    if (entity.mode !== 'oviposition' || !entity.isPregnant) return false;
    if (entity.eggsLaid >= entity.eggCount) return false;

    const idx = entity.eggsLaid;

    entity.laidEggs.push({
        id: Date.now() + idx + Math.floor(Math.random() * 1000),
        gender: entity.eggGenders[idx] || null,
        diseaseId: entity.eggDiseases[idx] || null,
        shellDefect: entity.eggShellDefects[idx] || null,
        hatched: false
    });
    entity.eggsLaid++;
    ensureStats(entity).eggsLaid += 1;

    logFn?.(`[EGG LAID] [${entity.key.toUpperCase()}] Egg ${entity.eggsLaid}/${entity.eggCount}`);

    if (entity.eggsLaid >= entity.eggCount) {
        finishLaying(entity, lang, logFn, notifyFn);
    } else {
        notifyFn?.(`🥚 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${lang === 'en' ? `Egg laid ${entity.eggsLaid}/${entity.eggCount}` : `Отложено яйцо ${entity.eggsLaid}/${entity.eggCount}`}`, 'info');
    }

    updateEggSymptoms(entity);
    return true;
}

export function layAllEggs(entity, lang = 'ru', logFn, notifyFn) {
    if (entity.mode !== 'oviposition' || !entity.isPregnant) return;
    let guard = 20;
    while (entity.eggsLaid < entity.eggCount && guard-- > 0) {
        if (!laySingleEgg(entity, lang, logFn, notifyFn)) break;
    }
}

export function layEggs(entity, lang = 'ru', logFn, notifyFn) {
    layAllEggs(entity, lang, logFn, notifyFn);
}

function finishLaying(entity, lang = 'ru', logFn, notifyFn) {
    entity.isPregnant = false;
    entity.isDiscovered = false;
    entity.pregnancyDaysTotal = 0;
    entity.pregnancyWeeks = 0;
    entity.pregnancyDays = 0;

    entity.postpartumDays = 1;
    entity.deliveryMethod = 'oviposition';
    entity.isNestActive = true;
    entity.eggIncubationDays = 0;
    entity.eggIncubationTotal = rollEggIncubationDays();

    logFn?.(`[EGG LAYING COMPLETE] [${entity.key.toUpperCase()}] All ${entity.eggCount} eggs laid. Incubation: ${entity.eggIncubationTotal} days.`);
    notifyFn?.(`🥚 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${lang === 'en' ? 'All eggs laid!' : 'Все яйца отложены!'} (${entity.eggCount})`, 'success');
}

export function hatchSingleEgg(entity, lang = 'ru', logFn, notifyFn, rpDate = null) {
    if (entity.mode !== 'oviposition' || !entity.isNestActive) return false;
    if (!entity.laidEggs || entity.laidEggs.length === 0) return false;

    const egg = entity.laidEggs.find(e => !e.hatched);
    if (!egg) return false;

    egg.hatched = true;

    if (egg.diseaseId === 'embryo_dead') {
        logFn?.(`[EGG DEAD] [${entity.key.toUpperCase()}] Egg ID ${egg.id} — embryo dead, no hatching.`);
        notifyFn?.(`[${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${lang === 'en' ? 'One egg did not hatch.' : 'Одно яйцо не вылупилось.'}`, 'warning');
    } else {
        const child = {
            id: egg.id,
            gender: egg.gender || generateBabyGender('realism', 'en'),
            name: '',
            diseaseId: egg.diseaseId || null,
            birthDate: rpDate || null
        };
        entity.childrenList.push(child);
        entity.eggsHatched = (entity.eggsHatched || 0) + 1;
        ensureStats(entity).eggsHatched += 1;

        const genderLabel = translateGender(child.gender, lang);
        const disease = egg.diseaseId ? getEggEmbryoDisease(egg.diseaseId, lang) : null;
        const extraNote = disease ? ` (${disease.name})` : '';
        logFn?.(`[EGG HATCHED] [${entity.key.toUpperCase()}] Child: ${child.gender}${disease ? ' | ' + disease.name : ''}`);
        notifyFn?.(`🐣 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${lang === 'en' ? 'Egg hatched!' : 'Яйцо вылупилось!'} (${genderLabel})${extraNote}`, 'success');
    }

    const allDone = entity.laidEggs.every(e => e.hatched);
    if (allDone) {
        finishIncubation(entity, lang, logFn, notifyFn);
    }

    updateEggSymptoms(entity);
    return true;
}

function finishIncubation(entity, lang = 'ru', logFn, notifyFn) {
    entity.isNestActive = false;
    entity.eggIncubationDays = 0;
    entity.eggIncubationTotal = 0;
    entity.postpartumDays = 0;
    entity.deliveryMethod = 'none';
    entity.cycleDay = 1;
    entity.currentCycleTargetLength = rollNewCycleTarget(entity);

    logFn?.(`[INCUBATION COMPLETE] [${entity.key.toUpperCase()}] All eggs processed.`);
    notifyFn?.(`🐣 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${lang === 'en' ? 'Clutch fully hatched!' : 'Кладка полностью вылупилась!'}`, 'success');

    entity.laidEggs = [];
    entity.eggsLaid = 0;
    entity.eggCount = 0;
    entity.eggShellDefects = [];
    entity.eggGenders = [];
    entity.eggDiseases = [];
}

export function hatchEggs(entity, lang = 'ru', logFn, notifyFn, rpDate = null) {
    if (!entity.isNestActive) return;
    let guard = 20;
    while (entity.isNestActive && guard-- > 0) {
        if (!hatchSingleEgg(entity, lang, logFn, notifyFn, rpDate)) break;
    }
}
