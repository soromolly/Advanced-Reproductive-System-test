import { getFetusData, getPostpartumData, getSymptomList, getComplication, getFetalDisease } from './symptoms.js';
import { getEggData, getPostLayingData, getEggPathology } from './oviposition.js';
import { translateGender } from './translations.js';

function buildSingleEntityPrompt(entity, macroName, aiAwareness) {
    let p = `\n[CRITICAL CANON DIRECTIVE — ${macroName} Reproductive & Physiological Status]\n`;

    if (entity.postpartumDays > 0) {
        if (entity.mode === 'oviposition') {
            const pData = getPostLayingData(entity.postpartumDays, 'en');
            p += `Status: POST-LAYING RECOVERY & BROODING (Day ${entity.postpartumDays}/28) | Event Outcome: OVIPOSITION COMPLETE\n`;
            p += `Physical Condition & Instincts: ${pData.desc}\n`;
        } else {
            const pData = getPostpartumData(entity.postpartumDays, entity.deliveryMethod, 'en');
            const maxRecDays = (entity.deliveryMethod === 'miscarriage') ? 14 : 40;
            p += `Status: RECOVERY PHASE (Day ${entity.postpartumDays}/${maxRecDays}) | Event Outcome: ${entity.deliveryMethod.toUpperCase()}\n`;
            p += `Physical Condition & Limitations: ${pData.desc}\n`;
        }
        return p;
    }

    const isRevealedPregnancy = entity.isPregnant && (entity.isDiscovered || !entity.isSecretConception);

    if (isRevealedPregnancy) {
        if (entity.mode === 'oviposition') {
            p += `Status: GRAVID / INTERNAL EGG GESTATION (Oviduct) | Term: ${entity.pregnancyWeeks} weeks ${entity.pregnancyDays} days.\n`;
            const eggInfo = getEggData(entity.pregnancyWeeks, entity.babiesCount, 'en');
            p += `Clutch Development: ${eggInfo.size} | Shell & Contour: ${eggInfo.belly}. ${eggInfo.desc}\n`;
            p += `Eggs in Oviduct: EXACTLY ${entity.babiesCount} hard, calcifying eggs.\n`;

            const symptomsEn = getSymptomList(entity.symptomPhaseKey, entity.symptomIndices, 'en');
            if (symptomsEn.length > 0) p += `Current Physiological Symptoms: ${symptomsEn.join(', ')}.\n`;

            if (entity.activeComplication && entity.activeComplication.isDiscovered) {
                const compEn = getEggPathology(entity.activeComplication.id, 'en');
                if (compEn) p += `[EGG CLUTCH ANOMALY]: "${compEn.name}" (${compEn.desc})\n`;
            }

            const nextNum = (entity.currentDeliveredCount || 0) + 1;
            const tagSuffix = entity.key.toUpperCase();
            p += `\n🚨 CRITICAL OVIPOSITION / EGG-LAYING TAG DIRECTIVE FOR ${macroName}:
If ${macroName} lays egg(s) in this response, append tag at the very end for each egg laid:
<!--BIRTH_NATURAL_${tagSuffix}_${nextNum}--> (or <!--BIRTH_NATURAL_${tagSuffix}-->)\n`;
        } else {
            p += `Status: PREGNANT (Obstetric Term) | Duration: ${entity.pregnancyWeeks} weeks ${entity.pregnancyDays} days.\n`;
            const fetus = getFetusData(entity.pregnancyWeeks, 'en');
            p += `Fetus Size: ${fetus.size} | Maternal Body: ${fetus.belly}. ${fetus.desc}\n`;
            
            const symptomsEn = getSymptomList(entity.symptomPhaseKey, entity.symptomIndices, 'en');
            if (symptomsEn.length > 0) p += `Current Pregnancy Symptoms: ${symptomsEn.join(', ')}.\n`;

            if (entity.activeComplication && entity.activeComplication.isDiscovered) {
                const compEn = getComplication(entity.activeComplication.id, 'en');
                if (compEn) p += `[ACTIVE MEDICAL COMPLICATION]: "${compEn.name}". Symptoms: ${compEn.desc}.\n`;
            }

            let revealCount = (aiAwareness === 'full') || (aiAwareness === 'dynamic' && entity.pregnancyWeeks >= 12);
            let revealGenders = (aiAwareness === 'full') || (aiAwareness === 'dynamic' && entity.pregnancyWeeks >= 20);

            if (revealCount) {
                p += `[SCAN]: Medical scans confirm ${macroName} is carrying ${entity.babiesCount} baby/babies.\n`;
            }
            if (revealGenders && entity.babiesGenders) {
                p += `[ANATOMY SCAN]: Baby sex(es): ${entity.babiesGenders.map(g => translateGender(g, 'en')).join(', ')}.\n`;
            }

            if (entity.pregnancyWeeks >= 20) {
                const nextNum = (entity.currentDeliveredCount || 0) + 1;
                const tagSuffix = entity.key.toUpperCase();
                p += `\n🚨 CRITICAL BIRTH TAG DIRECTIVE FOR ${macroName}:
- Natural birth: <!--BIRTH_NATURAL_${tagSuffix}_${nextNum}--> (or <!--BIRTH_NATURAL_${tagSuffix}-->)
- C-Section: <!--BIRTH_C_SECTION_${tagSuffix}_${nextNum}-->\n`;
            }
        }
    } else {
        const baseCycle = entity.cycleLength || 28;
        const target = entity.currentCycleTargetLength || baseCycle;
        const periodDays = entity.periodDuration || 5;

        if (entity.mode === 'oviposition') {
            if (entity.cycleDay <= periodDays) {
                p += `Current Status: IN RUT / FERTILE MATING WINDOW (Day ${entity.cycleDay}/${periodDays}) | Peak receptivity, cloacal lubrication.\n`;
            } else if (entity.cycleDay > target) {
                p += `Current Status: CYCLE DELAY (Late by ${entity.cycleDay - target} days).\n`;
            } else {
                p += `Current Status: REPRODUCTIVE QUIESCENCE / REST (Day ${entity.cycleDay}/${baseCycle}). Not gravid.\n`;
            }
        } else if (entity.mode === 'omegaverse') {
            if (entity.cycleDay <= periodDays) {
                p += `Current Status: IN HEAT (Day ${entity.cycleDay}/${periodDays}) | Peak Fertility Window.\n`;
            } else if (entity.cycleDay > target) {
                p += `Current Status: HEAT DELAYED (Late by ${entity.cycleDay - target} days).\n`;
            } else {
                p += `Current Status: QUIESCENCE / REST (Day ${entity.cycleDay}/${baseCycle}). Not pregnant.\n`;
            }
        } else {
            if (entity.cycleDay <= periodDays) {
                p += `Current Status: MENSTRUATION ACTIVE (Day ${entity.cycleDay}/${periodDays}) | Cycle: ${baseCycle} days. 100% NOT PREGNANT.\n`;
            } else if (entity.cycleDay > target) {
                p += `Current Status: CYCLE DELAY (Late by ${entity.cycleDay - target} days).\n`;
            } else {
                p += `Current Status: NON-PREGNANT (Cycle Day ${entity.cycleDay}/${baseCycle}).\n`;
            }
        }

        if (entity.contraception !== 'none') p += `Active Contraception: ${entity.contraception.toUpperCase()}.\n`;
        const symptomsEn = getSymptomList(entity.symptomPhaseKey, entity.symptomIndices, 'en');
        if (symptomsEn.length > 0) p += `Current Physiological Symptoms: ${symptomsEn.join(', ')}.\n`;
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

    fullPrompt += `\n🚨 INSEMINATION / CLIMAX LOGGING DIRECTIVE FOR {{char}}:
At the absolute end of the response, append exactly one tag IF climax occurred inside someone:
- Inside {{user}} (vagina/cloaca): <!--CUM_VAGINAL_USER--> | anus: <!--CUM_ANAL_USER-->
- Inside {{char}} (vagina/cloaca): <!--CUM_VAGINAL_CHAR--> | anus: <!--CUM_ANAL_CHAR-->\n`;

    return fullPrompt;
}
