import { getFetusData, getPostpartumData, getSymptomList, getComplication, getFetalDisease } from './symptoms.js';
import { translateGender } from './translations.js';

function buildSingleEntityPrompt(entity, macroName, aiAwareness) {
    let p = `\n[CRITICAL CANON DIRECTIVE — ${macroName} Physiological & Reproductive Status]\n`;

    if (entity.postpartumDays > 0) {
        const pData = getPostpartumData(entity.postpartumDays, entity.deliveryMethod, 'en');
        const maxRecDays = (entity.deliveryMethod === 'miscarriage') ? 14 : (entity.mode === 'oviposition' ? 14 : 40);
        p += `Status: RECOVERY PHASE (Day ${entity.postpartumDays}/${maxRecDays}) | Event Outcome: ${entity.deliveryMethod.toUpperCase()}\n`;
        p += `Physical Condition & Limitations: ${pData.desc}\n`;
        return p;
    }

    if (entity.isIncubating) {
        const weeksInc = Math.floor(entity.incubationDaysTotal / 7) + 1;
        p += `Status: NEST BROODING & INCUBATION | Total Eggs in Nest: ${entity.babiesCount} | Incubation Week: ${weeksInc}/10.\n`;
        p += `Clutch Environment: Requires steady body heat / thermal nesting materials (30–34°C).\n`;
        if (aiAwareness !== 'hidden') {
            p += `Egg Candling / Diagnostics: Embryonic sexes: ${entity.babiesGenders.map(g => translateGender(g, 'en')).join(', ')}.\n`;
        }
        p += `\n🚨 CRITICAL HATCHING DIRECTIVE FOR ${macroName}:
If the eggs hatch in this response, append tag at the very end: <!--HATCH_${entity.key.toUpperCase()}-->\n`;
        return p;
    }

    const isRevealedPregnancy = entity.isPregnant && (entity.isDiscovered || !entity.isSecretConception);

    if (isRevealedPregnancy) {
        if (entity.mode === 'oviposition') {
            p += `Status: OVIPOSITION GRAVIDITY (Internal Oviduct Gestation) | Duration: ${entity.pregnancyWeeks} weeks ${entity.pregnancyDays} days (Full Term: 6 weeks).\n`;
            const eggData = getFetusData(entity.pregnancyWeeks, 'oviposition', 'en');
            p += `Clutch Size: ${entity.babiesCount} Eggs in Oviduct | Individual Egg: ${eggData.size} | Abdominal Distension: ${eggData.belly}. ${eggData.desc}\n`;
        } else {
            p += `Status: PREGNANT (Obstetric Term) | Duration: ${entity.pregnancyWeeks} weeks ${entity.pregnancyDays} days.\n`;
            const fetus = getFetusData(entity.pregnancyWeeks, entity.mode, 'en');
            p += `Fetus Size: ${fetus.size} | Maternal Body: ${fetus.belly}. ${fetus.desc}\n`;
        }
        
        const symptomsEn = getSymptomList(entity.symptomPhaseKey, entity.symptomIndices, 'en');
        if (symptomsEn.length > 0) {
            p += `Current Body Symptoms: ${symptomsEn.join(', ')}.\n`;
        }

        if (entity.activeComplication && entity.activeComplication.isDiscovered) {
            const compEn = getComplication(entity.activeComplication.id, 'en');
            if (compEn) {
                p += `[ACTIVE MEDICAL COMPLICATION]: ${macroName} is experiencing "${compEn.name}". Symptoms: ${compEn.desc}.\n`;
            }
        }

        // Логика раскрытия количества и пола
        if (entity.mode === 'oviposition') {
            if (aiAwareness === 'full' || aiAwareness === 'dynamic') {
                p += `[ULTRASOUND SCAN]: Medical/Magical scan detects EXACTLY ${entity.babiesCount} EGGS inside the spiral oviduct. Embryo sex/interior details remain obscured by the crystalline eggshell.\n`;
            }
            if (aiAwareness === 'full') {
                p += `[OMNISCIENT INTEL]: Clutch Sexes: ${entity.babiesGenders.map(g => translateGender(g, 'en')).join(', ')}.\n`;
            }
            if (aiAwareness === 'hidden') {
                p += `[SECRET DATA]: Exact egg headcount, shell features and sexes are hidden until oviposition.\n`;
            }
        } else {
            let revealCount = (aiAwareness === 'full') || (aiAwareness === 'dynamic' && entity.pregnancyWeeks >= 12);
            let revealGenders = (aiAwareness === 'full') || (aiAwareness === 'dynamic' && entity.pregnancyWeeks >= 20);

            if (revealCount) {
                p += entity.babiesCount === 1 
                    ? `[ULTRASOUND SCAN]: Scans confirm ${macroName} is carrying EXACTLY 1 BABY.\n`
                    : `[ULTRASOUND SCAN]: Scans confirm ${macroName} is carrying ${entity.babiesCount} BABIES.\n`;
            }

            if (revealGenders) {
                p += `[ANATOMY SCAN]: Baby sex(es): ${entity.babiesGenders.map(g => translateGender(g, 'en')).join(', ')}.\n`;
            }
        }

        const tagSuffix = entity.key.toUpperCase();
        if (entity.mode === 'oviposition') {
            p += `\n🚨 CRITICAL OVIPOSITION / CLUTCH LAYING DIRECTIVE FOR ${macroName}:
If ${macroName} lays the clutch into a nest/bed, append tag at the very end: <!--EGG_LAY_${tagSuffix}-->\n`;
        } else if (entity.pregnancyWeeks >= 20) {
            const nextNum = (entity.currentDeliveredCount || 0) + 1;
            p += `\n🚨 CRITICAL BIRTH TAG DIRECTIVE FOR ${macroName}:
If ${macroName} gives birth in this response, append tag at the very end:
- Natural birth: <!--BIRTH_NATURAL_${tagSuffix}_${nextNum}--> (or <!--BIRTH_NATURAL_${tagSuffix}-->)
- C-Section: <!--BIRTH_C_SECTION_${tagSuffix}_${nextNum}--> (or <!--BIRTH_C_SECTION_${tagSuffix}-->)\n`;
        }
    } else {
        const baseCycle = entity.cycleLength || (entity.mode === 'oviposition' ? 90 : 28);
        const target = entity.currentCycleTargetLength || baseCycle;
        const periodDays = entity.periodDuration || 5;

        if (entity.mode === 'oviposition') {
            if (entity.cycleDay <= periodDays) {
                p += `Current Status: OVIPOSITION FERTILE WINDOW (Day ${entity.cycleDay}/${periodDays}) | Peak receptive window for mating/clutch initiation.\n`;
            } else {
                p += `Current Status: DRACONIC QUIESCENCE / REST (Day ${entity.cycleDay}/${baseCycle}). Oviduct empty.\n`;
            }
        } else if (entity.mode === 'realism') {
            const ovulPeak = Math.max(periodDays + 2, target - 14);
            const ovulStart = Math.max(periodDays + 1, ovulPeak - 3);
            const ovulEnd = ovulPeak + 1;

            if (entity.cycleDay <= periodDays) {
                p += `Current Status: MENSTRUATION ACTIVE (Day ${entity.cycleDay} of ${periodDays}) | Cycle Duration: ${baseCycle} days. 100% NOT pregnant.\n`;
            } else if (entity.cycleDay > target) {
                p += `Current Status: MENSTRUAL CYCLE DELAY (Late by ${entity.cycleDay - target} days).\n`;
            } else if (entity.cycleDay < ovulStart) {
                p += `Current Status: FOLLICULAR PHASE (Cycle Day ${entity.cycleDay}/${baseCycle}).\n`;
            } else if (entity.cycleDay >= ovulStart && entity.cycleDay <= ovulEnd) {
                p += `Current Status: OVULATION WINDOW / FERTILE CONCEPTION PEAK (Cycle Day ${entity.cycleDay}/${baseCycle}).\n`;
            } else {
                p += `Current Status: LUTEAL PHASE / PMS (Cycle Day ${entity.cycleDay}/${baseCycle}).\n`;
            }
        } else {
            if (entity.cycleDay <= periodDays) {
                p += `Current Status: IN HEAT (Day ${entity.cycleDay}/${periodDays}) | Peak Fertility Window.\n`;
            } else {
                p += `Current Status: QUIESCENCE / REST (Day ${entity.cycleDay}/${baseCycle}).\n`;
            }
        }

        if (entity.contraception !== 'none') {
            p += `Active Contraception: ${entity.contraception.toUpperCase()}.\n`;
        }
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

    fullPrompt += `\n🚨 INSEMINATION / EJACULATION DIRECTIVE FOR {{char}}:
At the absolute end of the response, append exactly one tag IF climax occurred inside someone:
- Inside {{user}}: Vagina: <!--CUM_VAGINAL_USER--> | Anus: <!--CUM_ANAL_USER--> | Cloaca / Oviduct: <!--CUM_CLOACA_USER-->
- Inside {{char}}: Vagina: <!--CUM_VAGINAL_CHAR--> | Anus: <!--CUM_ANAL_CHAR--> | Cloaca / Oviduct: <!--CUM_CLOACA_CHAR-->\n`;

    return fullPrompt;
}
