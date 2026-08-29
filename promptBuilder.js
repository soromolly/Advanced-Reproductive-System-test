import { getFetusData, getPostpartumData, getSymptomList, getComplication, getFetalDisease } from './symptoms.js';
import { translateGender } from './translations.js';
import { getIncubationStageData } from './oviposition.js';

function buildSingleEntityPrompt(entity, macroName, aiAwareness) {
    let p = `\n[CRITICAL CANON DIRECTIVE — ${macroName} Physiological & Reproductive Status]\n`;

    if (entity.isIncubating) {
        const incData = getIncubationStageData(entity.incubationDays, 'en');
        p += `Status: EXTERNAL CLUTCH INCUBATION (Day ${entity.incubationDays}/70) | Brooding Phase.\n`;
        p += `Clutch Overview: Brooding a nest clutch of ${entity.laidClutchCount} eggs. Stage: ${incData.stage} (${incData.desc}).\n`;
        p += `Brooding Instincts: ${macroName} experiences an intense biological drive to keep the clutch warmed and safely defended.\n`;
        
        if (entity.incubationDays >= 70) {
            const tagSuffix = entity.key.toUpperCase();
            p += `\n🚨 CRITICAL HATCHING TAG DIRECTIVE FOR ${macroName}:
If the eggs in the nest hatch in this response, append tag at the very end:
<!--HATCH_EGGS_${tagSuffix}-->\n`;
        }
        return p;
    }

    if (entity.postpartumDays > 0) {
        const pData = getPostpartumData(entity.postpartumDays, entity.deliveryMethod, 'en');
        p += `Status: RECOVERY PHASE (Day ${entity.postpartumDays}) | Event Outcome: ${entity.deliveryMethod.toUpperCase()}\n`;
        p += `Physical Condition: ${pData.desc}\n`;
        return p;
    }

    const isRevealedPregnancy = entity.isPregnant && (entity.isDiscovered || !entity.isSecretConception);

    if (isRevealedPregnancy) {
        if (entity.mode === 'oviposition') {
            p += `Status: INTERNAL CLUTCH GESTATION | Term: ${entity.pregnancyWeeks} weeks ${entity.pregnancyDays} days.\n`;
            const eggData = getFetusData(entity.pregnancyWeeks, 'en', 'oviposition');
            p += `Oviduct Content: ${entity.babiesCount} developing eggs. Egg Status: ${eggData.size} (${eggData.weight}). Belly: ${eggData.belly}. ${eggData.desc}\n`;
            
            const symptomsEn = getSymptomList(entity.symptomPhaseKey, entity.symptomIndices, 'en');
            if (symptomsEn.length > 0) p += `Current Oviduct Symptoms: ${symptomsEn.join(', ')}.\n`;

            if (aiAwareness === 'hidden') {
                p += `[MEDIEVAL LOGIC]: Exact egg count is revealed upon oviposition (laying). Sex and inner traits are completely hidden until hatching.\n`;
            } else if (aiAwareness === 'dynamic') {
                p += `[CLINICAL ULTRASOUND]: Scan confirms EXACTLY ${entity.babiesCount} EGGS inside the oviduct. Internal embryo sex is shielded by calcified eggshells until late incubation.\n`;
            } else {
                p += `[OMNISCIENCE]: Carrying ${entity.babiesCount} eggs. Sexes: ${entity.babiesGenders.map(g => translateGender(g, 'en')).join(', ')}.\n`;
            }

            if (entity.pregnancyWeeks >= 5) {
                const tagSuffix = entity.key.toUpperCase();
                p += `\n🚨 CRITICAL OVIPOSITION TAG DIRECTIVE FOR ${macroName}:
If ${macroName} lays the clutch of eggs in this response, append tag at the very end:
<!--LAY_EGGS_${tagSuffix}--> (or <!--BIRTH_NATURAL_${tagSuffix}-->)\n`;
            }
            return p;
        }

        // Realism / Omegaverse
        p += `Status: PREGNANT (Obstetric Term) | Duration: ${entity.pregnancyWeeks} weeks ${entity.pregnancyDays} days.\n`;
        const fetus = getFetusData(entity.pregnancyWeeks, 'en', entity.mode);
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

        let revealCount = (aiAwareness === 'full') || (aiAwareness === 'dynamic' && entity.pregnancyWeeks >= 12);
        let revealGenders = (aiAwareness === 'full') || (aiAwareness === 'dynamic' && entity.pregnancyWeeks >= 20);

        if (revealCount) {
            p += `[ULTRASOUND SCAN]: Medical scans confirm ${macroName} is carrying ${entity.babiesCount} BABIES.\n`;
        }

        if (aiAwareness === 'hidden') {
            p += `[SECRET DATA]: Headcount and features of ${macroName}'s babies hidden until labor.\n`;
        } else {
            if (entity.babiesDiseases?.length > 0) {
                entity.babiesDiseases.forEach((dId, idx) => {
                    const gEn = revealGenders ? translateGender(entity.babiesGenders[idx], 'en') : 'Unknown Sex';
                    if (dId) {
                        const d = getFetalDisease(dId, 'en');
                        const isDiscovered = (aiAwareness === 'full') || (entity.pregnancyWeeks >= (d?.discoveryWeek || 20));
                        if (isDiscovered && d?.type === 'prenatal') {
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
        const baseCycle = entity.cycleLength || (entity.mode === 'oviposition' ? 90 : 28);
        const target = entity.currentCycleTargetLength || baseCycle;
        const periodDays = entity.periodDuration || 5;
        const ovulPeak = Math.max(periodDays + 2, target - 14);
        const ovulStart = Math.max(periodDays + 1, ovulPeak - 3);
        const ovulEnd = ovulPeak + 1;

        if (entity.mode === 'realism') {
            if (entity.cycleDay <= periodDays) {
                p += `Current Status: MENSTRUATION ACTIVE (Day ${entity.cycleDay}/${periodDays}). Not pregnant.\n`;
            } else if (entity.cycleDay > target) {
                p += `Current Status: MENSTRUAL CYCLE DELAY (Late by ${entity.cycleDay - target} days).\n`;
            } else if (entity.cycleDay < ovulStart) {
                p += `Current Status: FOLLICULAR PHASE (Cycle Day ${entity.cycleDay}/${baseCycle}).\n`;
            } else if (entity.cycleDay >= ovulStart && entity.cycleDay <= ovulEnd) {
                p += `Current Status: OVULATION WINDOW / FERTILE CONCEPTION PEAK (Cycle Day ${entity.cycleDay}/${baseCycle}).\n`;
            } else {
                p += `Current Status: LUTEAL PHASE / PMS (Cycle Day ${entity.cycleDay}/${baseCycle}).\n`;
            }
        } else if (entity.mode === 'omegaverse') {
            if (entity.cycleDay <= periodDays) {
                p += `Current Status: IN HEAT (Day ${entity.cycleDay}/${periodDays}) | Peak Fertility Window.\n`;
            } else {
                p += `Current Status: QUIESCENCE / REST PHASE (Day ${entity.cycleDay}/${baseCycle}).\n`;
            }
        } else {
            // Oviposition
            if (entity.cycleDay <= periodDays) {
                p += `Current Status: FERTILE OVIDUCT SWELLING / HEAT (Day ${entity.cycleDay}/${periodDays}) | Peak Fertility Window.\n`;
            } else {
                p += `Current Status: REST PHASE (Day ${entity.cycleDay}/${baseCycle}). Oviduct empty and calm.\n`;
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
- Inside {{user}} vagina/tract: <!--CUM_VAGINAL_USER--> | anus: <!--CUM_ANAL_USER-->
- Inside {{char}} vagina/tract: <!--CUM_VAGINAL_CHAR--> | anus: <!--CUM_ANAL_CHAR-->\n`;

    return fullPrompt;
}
