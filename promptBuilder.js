import { getFetusData, getPostpartumData, getSymptomList, getComplication, getFetalDisease } from './symptoms.js';
import { translateGender } from './translations.js';
import { getEntityBodyPhase } from './entityController.js';

function buildSingleEntityPrompt(entity, macroName, aiAwareness) {
    let p = `\n[OOC: SYSTEM NOTE — ${macroName} Physiological & Reproductive Status]\n`;

    if (entity.postpartumDays > 0) {
        const pData = getPostpartumData(entity.postpartumDays, entity.deliveryMethod, 'en');
        const maxRecDays = (entity.deliveryMethod === 'miscarriage') ? 14 : 40;
        p += `Status: RECOVERY PHASE (Day ${entity.postpartumDays}/${maxRecDays}) | Event Outcome: ${entity.deliveryMethod.toUpperCase()}\n`;
        p += `Physical Condition & Limitations: ${pData.desc}\n`;
        return p;
    }

    const isRevealedPregnancy = entity.isPregnant && (entity.isDiscovered || !entity.isSecretConception);

    if (isRevealedPregnancy) {
        p += `Status: PREGNANT (Obstetric Term) | Duration: ${entity.pregnancyWeeks} weeks ${entity.pregnancyDays} days.\n`;
        const fetus = getFetusData(entity.pregnancyWeeks, 'en');
        p += `Fetus Size: ${fetus.size} | Maternal Body: ${fetus.belly}. ${fetus.desc}\n`;
        
        const symptomsEn = getSymptomList(entity.symptomPhaseKey, entity.symptomIndices, 'en');
        if (symptomsEn.length > 0) {
            p += `Current Pregnancy Symptoms: ${symptomsEn.join(', ')}.\n`;
        }

        if (entity.activeComplication && entity.activeComplication.isDiscovered) {
            const compEn = getComplication(entity.activeComplication.id, 'en');
            if (compEn) {
                p += `[ACTIVE MEDICAL COMPLICATION]: ${macroName} is experiencing "${compEn.name}". Symptoms: ${compEn.desc}.\n`;
            }
        }

        if (entity.fetalDemise && entity.fetalDemise.isDead) {
            const dDays = entity.fetalDemise.daysSinceDemise;
            let stageDesc = dDays <= 14 
                ? `Stage 1 (Silent phase, Day ${dDays}/14): Non-developing pregnancy, sudden drop in symptoms.`
                : (dDays <= 21 ? `Stage 2 (Expulsion onset, Day ${dDays}/21): Spontaneous spotting, cramping.` : `Stage 3: Active expulsion.`);
            if (entity.fetalDemise.hasInfection) stageDesc += ` [CRITICAL INFECTION PROCESS DETECTED]`;

            p += `\n[SECRET MEDICAL EVENT — MISSED MISCARRIAGE]:
- Secret Status for ${macroName}: ${stageDesc}
- Roleplay subtle symptoms. IF medical check/scan occurs, confirm non-viable pregnancy.
- IF abortion/D&C performed on ${macroName}, append hidden tag: <!--ABORTION_${entity.key.toUpperCase()}-->\n`;
        }

        let revealCount = (aiAwareness === 'full') || (aiAwareness === 'dynamic' && entity.pregnancyWeeks >= 12);
        let revealGenders = (aiAwareness === 'full') || (aiAwareness === 'dynamic' && entity.pregnancyWeeks >= 20);

        if (revealCount) {
            p += entity.babiesCount === 1 
                ? `[ULTRASOUND SCAN]: Medical scans confirm ${macroName} is carrying EXACTLY 1 BABY (SINGLETON).\n`
                : `[ULTRASOUND SCAN]: Medical scans confirm ${macroName} is carrying ${entity.babiesCount} BABIES.\n`;
        }

        if (aiAwareness === 'hidden') {
            p += `[SECRET DATA]: Headcount and features of ${macroName}'s babies hidden until labor.\n`;
        } else {
            if (entity.babiesDiseases?.length > 0) {
                entity.babiesDiseases.forEach((dId, idx) => {
                    const gEn = revealGenders ? translateGender(entity.babiesGenders[idx], 'en') : 'Unknown Sex';
                    if (dId) {
                        const d = getFetalDisease(dId, 'en');
                        const isDiscovered = (aiAwareness === 'full') || (entity.pregnancyWeeks >= (d.discoveryWeek || 20));
                        if (isDiscovered && d.type === 'prenatal') {
                            p += `[MEDICAL DIAGNOSIS - ${macroName} FETUS #${idx + 1} (${gEn})]: "${d.name}" (${d.desc})\n`;
                        }
                    }
                });
            }

            if (revealGenders) {
                p += `[ANATOMY SCAN]: ${macroName}'s baby sex(es): ${entity.babiesGenders.map(g => translateGender(g, 'en')).join(', ')}.\n`;
            }
        }

        if (entity.pregnancyWeeks >= 20) {
            const nextNum = (entity.currentDeliveredCount || 0) + 1;
            const tagSuffix = entity.key.toUpperCase();
            p += `\n🚨 CRITICAL BIRTH TAG DIRECTIVE FOR ${macroName}:
If ${macroName} gives birth in this response, append tag at the very end:
- Natural birth: <!--BIRTH_NATURAL_${tagSuffix}_${nextNum}--> (or <!--BIRTH_NATURAL_${tagSuffix}-->)
- C-Section: <!--BIRTH_C_SECTION_${tagSuffix}_${nextNum}--> (or <!--BIRTH_C_SECTION_${tagSuffix}-->)\n`;
        }
    } else {
        const baseCycle = entity.cycleLength || 28;
        const target = entity.currentCycleTargetLength || baseCycle;
        const periodDays = entity.periodDuration || 5;
        const ovulPeak = Math.max(periodDays + 2, target - 14);
        const ovulStart = Math.max(periodDays + 1, ovulPeak - 3);
        const ovulEnd = ovulPeak + 1;

        if (entity.mode === 'realism') {
            if (entity.cycleDay <= periodDays) {
                p += `Current Status: MENSTRUATION / PERIOD ACTIVE (Day ${entity.cycleDay} of ${periodDays}) | Total Cycle: ${baseCycle} days.
⚠️ DIRECTIVE: ${macroName} is actively having natural menstrual bleeding right now. This is a normal new menstrual cycle, NOT a missed period or pregnancy delay.\n`;
            } else if (entity.cycleDay > target) {
                p += `Current Status: CYCLE DELAY / MISSED PERIOD (Late by ${entity.cycleDay - target} days). Menstruation has not arrived.\n`;
            } else if (entity.cycleDay < ovulStart) {
                p += `Current Status: FOLLICULAR PHASE (Cycle Day ${entity.cycleDay}/${baseCycle}).\n`;
            } else if (entity.cycleDay >= ovulStart && entity.cycleDay <= ovulEnd) {
                p += `Current Status: OVULATION WINDOW / CONCEPTION PEAK (Cycle Day ${entity.cycleDay}/${baseCycle}).\n`;
            } else {
                p += `Current Status: LUTEAL PHASE / PMS (Cycle Day ${entity.cycleDay}/${baseCycle}).\n`;
            }
        } else {
            if (entity.cycleDay <= periodDays) {
                p += `Current Status: IN HEAT (Day ${entity.cycleDay}/${periodDays}) | Peak Fertility Window.\n`;
            } else if (entity.cycleDay > target) {
                p += `Current Status: HEAT DELAYED (Late by ${entity.cycleDay - target} days).\n`;
            } else {
                p += `Current Status: QUIESCENCE / REST PHASE (Day ${entity.cycleDay}/${baseCycle}).\n`;
            }
        }

        if (entity.contraception !== 'none') {
            p += `Active Contraception: ${entity.contraception.toUpperCase()}.\n`;
        }
        const symptomsEn = getSymptomList(entity.symptomPhaseKey, entity.symptomIndices, 'en');
        if (symptomsEn.length > 0) p += `Current Symptoms: ${symptomsEn.join(', ')}.\n`;
    }

    return p;
}

export function buildMultiEntityPrompt({ targetMode, userEntity, charEntity, aiAwareness }) {
    let fullPrompt = '';

    if (targetMode === 'user' || targetMode === 'both') {
        fullPrompt += buildSingleEntityPrompt(userEntity, '{{user}}', aiAwareness);
    }
    if (targetMode === 'char' || targetMode === 'both') {
        fullPrompt += buildSingleEntityPrompt(charEntity, '{{char}}', aiAwareness);
    }

    fullPrompt += `\n🚨 EJACULATION / CLIMAX LOGGING DIRECTIVE FOR {{char}}:
At the absolute end of the response, append exactly one tag IF climax occurred inside someone:
- Inside {{user}} vagina: <!--CUM_VAGINAL_USER--> | anus: <!--CUM_ANAL_USER-->
- Inside {{char}} vagina: <!--CUM_VAGINAL_CHAR--> | anus: <!--CUM_ANAL_CHAR-->\n`;

    return fullPrompt;
}
