import { 
    getRandomSymptomIndices, 
    rollComplication, 
    getComplication, 
    getRandomFetalDiseaseId, 
    getFetalDisease,
    getAmenorrheaWindow
} from './symptoms.js';
import { getText, translateGender } from './translations.js';
import { getPrematurityCategory, getDailySurvivalHazard, getNeonatalWindowDays, getOutcomeDefs, getOutcomeName } from './prematurity.js';
import { getChildAgeDays } from './dateUtils.js';
import { createDefaultStats, ensureStats, generateBabyGender, rollNewCycleTarget, getCycleDelayBaseline, formatDelayDays, generateBirthMeasurements, getEffectiveTermWeeks } from './shared.js';
import {
    advanceOvipositionEntity,
    triggerEggGravid,
    updateEggSymptoms,
    getEggBodyPhase,
    getEggPregnancyCheckResult
} from './eggController.js';

export { ensureStats, generateBabyGender, rollNewCycleTarget, getCycleDelayBaseline, formatDelayDays } from './shared.js';
export { laySingleEgg, layAllEggs, layEggs, hatchSingleEgg, hatchEggs } from './eggController.js';

// Накопительная статистика сущности. Граница выкидыш/мертворождение — 18 недель:
// до 18 недель — выкидыш, от 18 недель — мертворождение (совпадает с полосой 18–21 нед. в prematurity.js).
const STATS_STILLBIRTH_WEEKS = 18;

// Преждевременные роды: механика угрозы и начала родов.
export const PRETERM_LABOR_MIN_WEEK = 20;      // угроза «включается» с 20-й недели
export const PRETERM_LABOR_ONSET_CHANCE = 10;  // % в день: угроза -> начало родов
export const PRETERM_LABOR_WINDOW_DAYS = 7;    // окно с момента начала родов
export const PRETERM_LABOR_DAILY_BASE = 10;    // роды: 10% * день (10..70%)

function recordEntityLoss(entity) {
    const stats = ensureStats(entity);
    if ((entity.pregnancyWeeks || 0) >= STATS_STILLBIRTH_WEEKS) {
        stats.stillbirths += 1;
    } else {
        stats.miscarriages += 1;
    }
}

export function createDefaultEntityState(entityKey = 'user') {
    return {
        key: entityKey,
        mode: 'realism',
        gender: entityKey === 'user' ? 'female' : 'male_omega',
        isSecretConception: true,
        isIrregularCycle: true,
        isFetalPathologyEnabled: true,
        isComplicationsEnabled: true,
        isPrematurityEnabled: true,
        isBreastfeeding: true,
        lactationDays: null,
        daysNotBreastfeeding: 0,
        cycleLength: 28,
        periodDuration: 5,
        maxPregnancyWeeks: 40,
        contraception: 'none',
        stats: createDefaultStats(),

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
        pretermLabor: null,
        tocolysisNotice: false,
        postpartumDays: 0,
        deliveryMethod: 'none',
        childrenList: [],
        fetalDiseaseId: null,

        // Поля для режима Яйцекладка
        eggCount: 0,
        eggShellDefects: [],
        eggGenders: [],
        eggDiseases: [],
        eggsLaid: 0,
        laidEggs: [],
        eggIncubationDays: 0,
        eggIncubationTotal: 0,
        eggsHatched: 0,
        isNestActive: false
    };
}

export function triggerEntityPregnancy(entity, lang = 'ru', logFn, notifyFn) {
    if (entity.mode === 'oviposition') {
        triggerEggGravid(entity, lang, logFn, notifyFn);
        return;
    }

    ensureStats(entity).pregnanciesTotal += 1;
    entity.isPregnant = true;

    if (entity.mode === 'omegaverse') {
        entity.pregnancyDaysTotal = Math.max(1, entity.cycleDay || 1);
    } else {
        entity.pregnancyDaysTotal = Math.max(14, entity.cycleDay || 14);
    }

    entity.pregnancyWeeks = Math.floor(entity.pregnancyDaysTotal / 7);
    entity.pregnancyDays = entity.pregnancyDaysTotal % 7;
    entity.isDiscovered = !entity.isSecretConception;
    entity.rolledTrimesters = { 1: false, 2: false, 3: false };
    entity.fetalDemiseRolledTrimesters = { 1: false, 2: false, 3: false };
    entity.fetalDemise = null;
    entity.activeComplication = null;
    entity.pretermLabor = null;
    entity.tocolysisNotice = false;
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
    logFn?.(`[PREGNANCY INITIATED] [${entity.key.toUpperCase()}] Mode: ${entity.mode} | Initial Days: ${entity.pregnancyDaysTotal} | Babies: ${entity.babiesCount} | Secret: ${entity.isSecretConception}`);

    updateEntitySymptoms(entity);
    if (entity.isDiscovered) {
        notifyFn?.(`🚨 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${getText('toastConception', lang)}`, 'success');
    }
}

// Результат «теста / проверки признаков» по дню задержки (детерминированный,
// без ложноположительных/ложноотрицательных). Во всеведении (full) кнопки нет.
// delayDays = сколько дней месячные/течка задерживаются от номинальной длины цикла.
export function getPregnancyCheckResult(entity, aiAwareness) {
    if (entity.mode === 'oviposition') {
        return getEggPregnancyCheckResult(entity, aiAwareness);
    }
    const delayDays = Math.max(1, entity.cycleDay - getCycleDelayBaseline(entity));
    if (!entity.isPregnant) {
        return { status: 'negative', delayDays };
    }
    if (aiAwareness === 'hidden') {
        // Средневековье: проверка признаков становится явной с 15 дня задержки.
        return delayDays >= 15 ? { status: 'positive', delayDays } : { status: 'uncertain', delayDays };
    }
    // Современность (dynamic): тест на ХГЧ уверенно положителен с 5 дня задержки.
    return delayDays >= 5 ? { status: 'positive', delayDays } : { status: 'uncertain', delayDays };
}

export function getEntityBodyPhase(entity, lang = 'ru') {
    if (entity.mode === 'oviposition') {
        return getEggBodyPhase(entity, lang);
    }
    const l = (lang === 'en') ? 'en' : 'ru';
    const isRevealedPregnancy = entity.isPregnant && (entity.isDiscovered || !entity.isSecretConception);

    if (entity.postpartumDays > 0) return getText('postpartumPhase', l);
    if (isRevealedPregnancy) {
        return entity.mode === 'realism' ? getText('pregnancy', l) : getText('pregnancyOmega', l);
    }

    const day = entity.cycleDay;
    const baseLength = entity.cycleLength || 28;
    const targetLength = entity.currentCycleTargetLength || baseLength;
    const delayBaseline = getCycleDelayBaseline(entity);
    const periodDays = entity.periodDuration || 5;

    if (entity.mode === 'realism') {
        if (day > delayBaseline) {
            const delay = day - delayBaseline;
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
        if (day > delayBaseline) {
            const delay = day - delayBaseline;
            return `${getText('delayedHeat', l)} (${formatDelayDays(delay, l)})`;
        }
        if (day <= periodDays) return getText('heat', l);
        return getText('quiescence', l);
    }
}

export function updateEntitySymptoms(entity) {
    if (entity.mode === 'oviposition') {
        updateEggSymptoms(entity);
        return;
    }

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
            // omegaverse (яйцекладка перенаправлена выше)
            if (day <= periodDays) {
                phaseKey = (entity.gender === 'male_omega') ? 'heat_male' : 'heat_female';
            } else {
                phaseKey = 'quiescence';
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

export function checkEntityComplications(entity, lang = 'ru', logFn, notifyFn, aiAwareness = 'dynamic') {
    if (entity.mode === 'oviposition') return;
    if (!entity.isComplicationsEnabled) return;

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
        if (aiAwareness === 'full' || currentWeek >= entity.activeComplication.triggerWeek) {
            entity.activeComplication.isDiscovered = true;
            const comp = getComplication(entity.activeComplication.id, lang);
            logFn?.(`[COMPLICATION DISCOVERED] [${entity.key.toUpperCase()}] ${entity.activeComplication.id} diagnosed at week ${currentWeek}`);
            notifyFn?.(`🚨 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${getText('complicationTitle', lang)} «${comp.name}»!`, 'error');
        }
    }
}

export function checkEntityFetalDemise(entity, logFn) {
    if (entity.mode === 'oviposition') return;
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

export function advanceEntityDays(entity, days, aiAwareness, lang, logFn, notifyFn, rpDate) {
    if (entity.mode === 'oviposition') {
        advanceOvipositionEntity(entity, days, aiAwareness, lang, logFn, notifyFn);
        return;
    }

    entity.tocolysisNotice = false;
    advanceChildrenSurvival(entity, days, aiAwareness, lang, logFn, notifyFn, rpDate);
    advanceLactation(entity, days, lang, logFn, notifyFn);

    if (entity.postpartumDays > 0) {
        const pp = advancePostpartumDays(entity, days, lang, logFn, notifyFn);
        if (!pp.returned) return;
        advanceCycleDays(entity, pp.surplusDays, lang, logFn, notifyFn);
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

        // Преждевременные роды: угроза -> начало родов.
        if (entity.activeComplication?.id === 'premature_labor_threat'
            && entity.activeComplication.isDiscovered
            && !entity.pretermLabor
            && entity.pregnancyWeeks >= PRETERM_LABOR_MIN_WEEK) {
            for (let i = 0; i < days; i++) {
                if (Math.random() * 100 < PRETERM_LABOR_ONSET_CHANCE) {
                    entity.pretermLabor = { startedWeek: entity.pregnancyWeeks, daysSince: 0 };
                    logFn?.(`[PRETERM LABOR ONSET] [${entity.key.toUpperCase()}] Premature labor started at week ${entity.pregnancyWeeks}.`);
                    notifyFn?.(`🚨 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${lang === 'en' ? 'PREMATURE LABOR HAS BEGUN!' : 'ПРЕЖДЕВРЕМЕННЫЕ РОДЫ НАЧАЛИСЬ!'} ${lang === 'en' ? `(week ${entity.pregnancyWeeks})` : `(${entity.pregnancyWeeks} нед.)`}`, 'error');
                    return;
                }
            }
        }

        // Преждевременные роды: окно в 7 дней, накопительный кубик на роды.
        if (entity.pretermLabor) {
            for (let i = 0; i < days; i++) {
                entity.pretermLabor.daysSince += 1;
                const day = entity.pretermLabor.daysSince;
                const chance = Math.min(PRETERM_LABOR_DAILY_BASE * day, PRETERM_LABOR_DAILY_BASE * PRETERM_LABOR_WINDOW_DAYS);
                if (Math.random() * 100 < chance) {
                    deliverAllBabiesPremature(entity, lang, logFn, notifyFn, rpDate);
                    return;
                }
                if (day >= PRETERM_LABOR_WINDOW_DAYS) {
                    entity.pretermLabor = null;
                    entity.activeComplication = null;
                    logFn?.(`[PRETERM LABOR SUBSIDED] [${entity.key.toUpperCase()}] Contractions stopped on their own; pregnancy continues.`);
                    notifyFn?.(`🕊️ [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${lang === 'en' ? 'The premature labor subsided on its own — the pregnancy continues.' : 'Преждевременные роды прекратились сами собой — беременность продолжается.'}`, 'info');
                    break;
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
        const maxWeeks = getEffectiveTermWeeks(entity);
        if (entity.isDiscovered && entity.pregnancyWeeks >= maxWeeks) {
            notifyFn?.(`[${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${getText('toastPregEnd', lang)}`, 'warning');
        }
    } else {
        advanceCycleDays(entity, days, lang, logFn, notifyFn);
    }
}

// Послеродовой период: после минимального срока аменореи ежедневно бросается
// кубик на возврат менструации. При возврате в середине скачка времени
// «съеденные» лишние дни не теряются, а переносятся в новый цикл.
function advancePostpartumDays(entity, days, lang, logFn, notifyFn) {
    const w = getAmenorrheaWindow(entity.deliveryMethod, entity.isBreastfeeding);
    let remaining = days;
    let returned = false;
    let returnDay = 0;

    for (let i = 0; i < days; i++) {
        entity.postpartumDays += 1;
        remaining -= 1;
        const ppDay = entity.postpartumDays;
        if (ppDay >= w.maxDay) {
            returned = true;
            returnDay = ppDay;
            break;
        }
        if (ppDay > w.minDay && Math.random() * 100 < w.dailyChance) {
            returned = true;
            returnDay = ppDay;
            break;
        }
    }

    if (!returned) return { returned: false, surplusDays: 0 };

    entity.postpartumDays = 0;
    entity.deliveryMethod = 'none';
    entity.cycleDay = 1;
    entity.currentCycleTargetLength = rollNewCycleTarget(entity);

    logFn?.(`[POSTPARTUM] [${entity.key.toUpperCase()}] Menstruation returned on postpartum day ${returnDay}. New cycle started.`);
    notifyFn?.(lang === 'en'
        ? `[${entity.key === 'user' ? '{{user}}' : '{{char}}'}] Postpartum recovery complete. Menstruation has returned — new cycle started.`
        : `[${entity.key === 'user' ? '{{user}}' : '{{char}}'}] Восстановление завершено. Месячные вернулись — начался новый цикл.`, 'success');

    return { returned: true, surplusDays: remaining };
}

function advanceCycleDays(entity, days, lang, logFn, notifyFn) {
    if (days > 0) {
        const target = entity.currentCycleTargetLength || entity.cycleLength || 28;
        entity.cycleDay += days;

        const stats = ensureStats(entity);
        const delay = entity.cycleDay - (entity.cycleLength || 28);
        if (delay > 0 && delay > stats.maxDelayDays) stats.maxDelayDays = delay;

        if (entity.cycleDay > target) {
            entity.cycleDay = ((entity.cycleDay - 1) % target) + 1;
            entity.currentCycleTargetLength = rollNewCycleTarget(entity);
            entity.symptomPhaseKey = null;
            stats.cyclesCompleted += 1;
            stats.cycleLengthsSum += target;
            logFn?.(`[CYCLE RESET] [${entity.key.toUpperCase()}] New cycle started after ${target} days.`);
            notifyFn?.(`[${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${entity.mode === 'omegaverse' ? getText('toastNewHeat', lang) : getText('toastNewCycle', lang)}`, 'info');
        }
    }
    updateEntitySymptoms(entity);
}

// Лактация после родов: пока кормление идёт — молоко есть; если кормление
// выключено дольше 7 дней — молоко высыхает и окно закрывается. После возврата
// месячных ежедневно бросается редкий кубик на «пропало молоко» (максимум 2 года).
const LACTATION_GRACE_DAYS = 7;
const LACTATION_MAX_DAYS = 730;
const LACTATION_DAILY_CHANCE = 0.3;

function advanceLactation(entity, days, lang, logFn, notifyFn) {
    if (entity.lactationDays === null || entity.lactationDays === undefined) return;

    entity.lactationDays += days;

    if (!entity.isBreastfeeding) {
        entity.daysNotBreastfeeding = (entity.daysNotBreastfeeding || 0) + days;
        if (entity.daysNotBreastfeeding > LACTATION_GRACE_DAYS) {
            entity.lactationDays = null;
            entity.daysNotBreastfeeding = 0;
            logFn?.(`[LACTATION] [${entity.key.toUpperCase()}] Milk dried up (not breastfeeding for over ${LACTATION_GRACE_DAYS} days).`);
        }
        return;
    }

    entity.daysNotBreastfeeding = 0;

    if (entity.postpartumDays === 0) {
        for (let i = 0; i < days; i++) {
            if (Math.random() * 100 < LACTATION_DAILY_CHANCE) {
                logFn?.(`[LACTATION] [${entity.key.toUpperCase()}] Milk dried up (daily roll) on lactation day ${entity.lactationDays}.`);
                entity.lactationDays = null;
                notifyFn?.(lang === 'en'
                    ? `[${entity.key === 'user' ? '{{user}}' : '{{char}}'}] Milk supply has dried up.`
                    : `[${entity.key === 'user' ? '{{user}}' : '{{char}}'}] Молоко пропало.`, 'info');
                break;
            }
        }
        if (entity.lactationDays !== null && entity.lactationDays >= LACTATION_MAX_DAYS) {
            logFn?.(`[LACTATION] [${entity.key.toUpperCase()}] Milk dried up (reached 2-year limit).`);
            entity.lactationDays = null;
        }
    }
}

function advanceChildrenSurvival(entity, days, aiAwareness, lang, logFn, notifyFn, rpDate) {
    if (!entity.childrenList || entity.childrenList.length === 0) return;
    const era = aiAwareness === 'hidden' ? 'medieval' : 'modern';

    for (let idx = 0; idx < entity.childrenList.length; idx++) {
        const child = entity.childrenList[idx];
        if (!child.prematurityId || child.alive === false || child.survivalResolved) continue;

        // Дети, рождённые до появления механики (или после ручного скачка даты),
        // уже миновали критический период — не бросаем ретроспективно.
        const windowDays = getNeonatalWindowDays(child.prematurityId);
        const realAgeDays = getChildAgeDays(child.birthDate, rpDate);
        if (realAgeDays !== null && realAgeDays >= windowDays) {
            child.survivalResolved = true;
            child.consequences = child.consequences || [];
            logFn?.(`[NEONATAL RESOLVED] [${entity.key.toUpperCase()}] Child #${idx + 1} already past critical period (age ${realAgeDays}d).`);
            continue;
        }

        child.ageDays = child.ageDays || 0;
        for (let d = 0; d < days; d++) {
            child.ageDays += 1;
            const hazard = getDailySurvivalHazard(child.prematurityId, child.ageDays, era);
            if (hazard <= 0) {
                child.survivalResolved = true;
                rollPostnatalConsequences(entity, child, aiAwareness, lang, logFn, notifyFn);
                break;
            }
            const roll = Math.random() * 100;
            if (roll < hazard) {
                child.alive = false;
                const nameStr = (child.name && child.name.trim()) ? `«${child.name.trim()}»` : `#${idx + 1}`;
                logFn?.(`[NEONATAL DEATH] [${entity.key.toUpperCase()}] Child #${idx + 1} died on day ${child.ageDays} (Roll ${roll.toFixed(2)}% < ${hazard}%).`);
                notifyFn?.(`💔 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${lang === 'en' ? `Child ${nameStr} has died` : `Ребёнок ${nameStr} умер(ла)`} (${lang === 'en' ? 'day' : 'день'} ${child.ageDays}).`, 'warning');
                break;
            }
        }
    }
}

function rollPostnatalConsequences(entity, child, aiAwareness, lang, logFn, notifyFn) {
    const era = aiAwareness === 'hidden' ? 'medieval' : 'modern';
    const defs = getOutcomeDefs(child.prematurityId);
    if (!defs || defs.length === 0) return;

    const outcomes = [];
    for (const o of defs) {
        if (Math.random() * 100 < o.chance) outcomes.push(o.id);
    }

    const nameStr = (child.name && child.name.trim()) ? `«${child.name.trim()}»` : '';
    if (outcomes.length > 0) {
        child.consequences = outcomes;
        const listStr = outcomes.map(id => getOutcomeName(id, era, lang)).join('; ');
        logFn?.(`[POSTNATAL OUTCOMES] [${entity.key.toUpperCase()}] Child ${nameStr || '(unnamed)'}: ${outcomes.join(', ')}`);
        notifyFn?.(`🧬 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${lang === 'en' ? 'Child' : 'Ребёнок'}${nameStr ? ' ' + nameStr : ''} ${lang === 'en' ? 'pulled through. Lasting consequences:' : 'выкарабкался(лась). Последствия:'} ${listStr}`, 'info');
    } else {
        logFn?.(`[POSTNATAL OUTCOMES] [${entity.key.toUpperCase()}] Child ${nameStr || '(unnamed)'} survived with no lasting consequences.`);
        notifyFn?.(`🎉 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${lang === 'en' ? 'The premature child pulled through healthy.' : 'Недоношенный ребёнок выкарабкался здоровым.'}`, 'success');
    }
}

function deliverAllBabiesPremature(entity, lang, logFn, notifyFn, rpDate) {
    logFn?.(`[PRETERM LABOR DELIVERY] [${entity.key.toUpperCase()}] Labor completed at ${entity.pregnancyWeeks} weeks — delivering all babies.`);
    while (entity.babiesCount > 0 && entity.isPregnant) {
        deliverEntitySingleBaby(entity, 'natural', lang, logFn, notifyFn, rpDate);
    }
}

export function deliverEntitySingleBaby(entity, method = 'natural', lang = 'ru', logFn, notifyFn, rpDate = null) {
    if (entity.mode === 'oviposition') return;

    if (!entity.isPregnant && (!entity.babiesGenders || entity.babiesGenders.length === 0)) return;

    const birthWeek = entity.pregnancyWeeks;
    const prematurityId = entity.isPrematurityEnabled ? getPrematurityCategory(birthWeek, entity.mode) : null;

    if (prematurityId === 'stillbirth') {
        processEntityStillbirth(entity, lang, logFn, notifyFn);
        return;
    }

    // Индивидуальные рост/вес при рождении: учитываем срок и многоплодие.
    const totalBabies = (entity.babiesGenders?.length || 0) + (entity.currentDeliveredCount || 0);
    const measurements = generateBirthMeasurements(birthWeek, totalBabies);

    const rawGender = entity.babiesGenders.shift();
    if (!rawGender) {
        entity.isPregnant = false;
        entity.babiesCount = 0;
        return;
    }

    const babyDiseaseId = entity.babiesDiseases?.length > 0 ? entity.babiesDiseases.shift() : null;
    
    entity.currentDeliveredCount = (entity.currentDeliveredCount || 0) + 1;
    entity.childrenList.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        gender: rawGender,
        name: '',
        diseaseId: babyDiseaseId,
        birthWeek,
        prematurityId,
        birthWeightGrams: measurements.weightGrams,
        birthLengthCm: measurements.lengthCm,
        birthDate: rpDate || null,
        ageDays: 0,
        alive: true,
        survivalResolved: false,
        consequences: []
    });
    
    entity.babiesCount = entity.babiesGenders.length;
    const displayGender = translateGender(rawGender, lang);
    const disease = babyDiseaseId ? getFetalDisease(babyDiseaseId, lang) : null;
    const sizeNote = lang === 'en'
        ? ` (${measurements.weightGrams} g, ${measurements.lengthCm} cm)`
        : ` (${measurements.weightGrams} г, ${measurements.lengthCm} см)`;
    const prematurityNote = prematurityId
        ? (lang === 'en' ? ` Premature (~${birthWeek} wks).` : ` Преждевременные роды (~${birthWeek} нед.).`)
        : '';

    logFn?.(`[BIRTH] [${entity.key.toUpperCase()}] Delivered: ${rawGender} | Method: ${method} | Prematurity: ${prematurityId || 'none'} | Remaining: ${entity.babiesCount}`);

    if (entity.babiesCount === 0) {
        entity.isPregnant = false;
        entity.isDiscovered = false;
        entity.pregnancyDaysTotal = 0;
        entity.pregnancyWeeks = 0;
        entity.pregnancyDays = 0;
        entity.currentDeliveredCount = 0;
        entity.activeComplication = null;
        entity.pretermLabor = null;
        entity.tocolysisNotice = false;
        entity.fetalDiseaseId = null;
        entity.babiesDiseases = [];
        entity.fetalDemise = null;
        entity.fetalDemiseRolledTrimesters = { 1: false, 2: false, 3: false };
        entity.postpartumDays = 1;
        entity.deliveryMethod = method;
        entity.lactationDays = 0;
        entity.daysNotBreastfeeding = 0;
        ensureStats(entity).births += 1;

        const methodText = method === 'c_section' ? (lang === 'en' ? 'C-Section' : 'Кесарево сечение') : (lang === 'en' ? 'Natural' : 'Естественные роды');
        const extraNote = disease ? ` (${disease.name})` : '';
        notifyFn?.(`👶 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${lang === 'en' ? 'Delivery complete!' : 'Роды завершены!'} (${displayGender})${sizeNote}${extraNote}${prematurityNote} [${methodText}]`, 'success');
    } else {
        const extraNote = disease ? ` (${disease.name})` : '';
        notifyFn?.(`👶 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${lang === 'en' ? 'Baby born' : 'Родился ребёнок'} (${displayGender})${sizeNote}${extraNote}${prematurityNote}. ${lang === 'en' ? 'Remaining:' : 'Осталось:'} ${entity.babiesCount}`, 'info');
    }
}

function resetEntityAfterLoss(entity) {
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
    entity.pretermLabor = null;
    entity.tocolysisNotice = false;
    entity.fetalDiseaseId = null;
    entity.fetalDemise = null;
    entity.fetalDemiseRolledTrimesters = { 1: false, 2: false, 3: false };
    entity.postpartumDays = 1;
    entity.deliveryMethod = 'miscarriage';
}

// Полная очистка беременности (и вынашивания яиц) без послеродового периода.
// Используется при смене режима, чтобы нерождённый плод не переезжал в другую систему.
export function resetEntityPregnancy(entity) {
    entity.isPregnant = false;
    entity.isDiscovered = false;
    entity.pregnancyDaysTotal = 0;
    entity.pregnancyWeeks = 0;
    entity.pregnancyDays = 0;
    entity.babiesCount = 0;
    entity.babiesGenders = [];
    entity.babiesDiseases = [];
    entity.currentDeliveredCount = 0;
    entity.rolledTrimesters = { 1: false, 2: false, 3: false };
    entity.fetalDemiseRolledTrimesters = { 1: false, 2: false, 3: false };
    entity.fetalDemise = null;
    entity.activeComplication = null;
    entity.pretermLabor = null;
    entity.tocolysisNotice = false;
    entity.fetalDiseaseId = null;
    entity.eggCount = 0;
    entity.eggShellDefects = [];
    entity.eggGenders = [];
    entity.eggDiseases = [];
    entity.eggsLaid = 0;
    entity.laidEggs = [];
    entity.eggIncubationDays = 0;
    entity.eggIncubationTotal = 0;
    entity.eggsHatched = 0;
    entity.isNestActive = false;
    entity.postpartumDays = 0;
    entity.deliveryMethod = 'none';
    entity.lactationDays = null;
    entity.daysNotBreastfeeding = 0;
    entity.symptomPhaseKey = null;
    entity.symptomIndices = [];
}

export function processEntityMiscarriage(entity, lang = 'ru', logFn, notifyFn) {
    logFn?.(`[MISCARRIAGE] [${entity.key.toUpperCase()}] Spontaneous miscarriage.`);
    recordEntityLoss(entity);
    resetEntityAfterLoss(entity);
    notifyFn?.(`🚨 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${lang === 'en' ? 'Miscarriage occurred. Pregnancy terminated.' : 'Произошел самопроизвольный выкидыш. Беременность прервана.'}`, 'error');
}

export function processEntityStillbirth(entity, lang = 'ru', logFn, notifyFn) {
    const week = entity.pregnancyWeeks;
    logFn?.(`[STILLBIRTH] [${entity.key.toUpperCase()}] Premature stillbirth (late miscarriage) at ${week} weeks.`);
    recordEntityLoss(entity);
    resetEntityAfterLoss(entity);
    notifyFn?.(`[${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${lang === 'en' ? 'Premature stillbirth (late miscarriage). Pregnancy ended.' : 'Преждевременные роды: мертворождение (поздний выкидыш). Беременность завершена.'}`, 'error');
}

export function isAbortionAllowed(entity, aiAwareness) {
    if (!entity || entity.mode === 'oviposition') return false;
    if (!entity.isPregnant || (!entity.isDiscovered && entity.isSecretConception)) return false;

    const isUnder12Weeks = (entity.pregnancyWeeks < 12) || (entity.pregnancyWeeks === 12 && (entity.pregnancyDays || 0) === 0);
    if (isUnder12Weeks) return true;

    if (aiAwareness === 'hidden') return false;
    if (!entity.babiesDiseases || entity.babiesDiseases.length === 0) return false;
    return entity.babiesDiseases.some(dId => {
        if (!dId) return false;
        const d = getFetalDisease(dId, 'en');
        return d?.type === 'prenatal' && d.abortionIndicated && ((aiAwareness === 'full') || (entity.pregnancyWeeks >= (d.discoveryWeek || 20)));
    });
}

export function processEntityAbortion(entity, lang = 'ru', logFn, notifyFn) {
    logFn?.(`[ABORTION] [${entity.key.toUpperCase()}] Terminated at ${entity.pregnancyWeeks} weeks.`);
    ensureStats(entity).abortions += 1;
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
    entity.pretermLabor = null;
    entity.tocolysisNotice = false;
    entity.fetalDiseaseId = null;
    entity.fetalDemise = null;
    entity.fetalDemiseRolledTrimesters = { 1: false, 2: false, 3: false };
    entity.postpartumDays = 1;
    entity.deliveryMethod = 'miscarriage'; 

    notifyFn?.(`[${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${getText('toastAbort', lang)}`, 'info');
}
