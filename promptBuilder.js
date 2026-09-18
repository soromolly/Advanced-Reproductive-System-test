import { getFetusData, getPostpartumData, getSymptomList, getComplication, getFetalDisease } from './symptoms.js';
import { translateGender } from './translations.js';
import { getEntityBodyPhase } from './entityController.js';

function buildSingleEntityPrompt(entity, macroName, aiAwareness) {
    let p = `\n[CRITICAL CANON DIRECTIVE — ${macroName} Physiological & Reproductive Status]\n`;

    if (entity.postpartumDays > 0) {
        const pData = getPostpartumData(entity.postpartumDays, entity.deliveryMethod, 'en');
        const maxRecDays = (entity.deliveryMethod === 'miscarriage') ? 14 : 40;
        p += `Status: RECOVERY PHASE (Day ${entity.postpartumDays}/${maxRecDays}) | Event Outcome: ${entity.deliveryMethod.toUpperCase()}\n`;
        p += `Physical Condition & Limitations: ${pData.desc}\n`;
    } else {
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
                    p += `Current Status: MENSTRUATION / NATURAL PERIOD ACTIVE (Day ${entity.cycleDay} of ${periodDays}) | Cycle Duration: ${baseCycle} days.
🛑 ABSOLUTE CANON FACT: ${macroName} is 100% NOT PREGNANT. Conception failed/did not happen. 
⚠️ STRICT FORBIDDEN ACTIONS FOR {{char}}:
- DO NOT roleplay pregnancy, missed periods, late periods, toxicosis, morning sickness, or sudden realization of being pregnant.
- ${macroName} is actively experiencing her normal monthly menstrual bleeding right now. Treat all physical sensations (cramps, breast tenderness) strictly as menstrual symptoms, NOT pregnancy.\n`;
                } else if (entity.cycleDay > target) {
                    p += `Current Status: MENSTRUAL CYCLE DELAY (Late by ${entity.cycleDay - target} days). Menstruation has not arrived yet.
Note: Pregnancy has NOT been verified or confirmed yet.\n`;
                } else if (entity.cycleDay < ovulStart) {
                    p += `Current Status: FOLLICULAR PHASE (Cycle Day ${entity.cycleDay}/${baseCycle}). Not pregnant.\n`;
                } else if (entity.cycleDay >= ovulStart && entity.cycleDay <= ovulEnd) {
                    p += `Current Status: OVULATION WINDOW / FERTILE CONCEPTION PEAK (Cycle Day ${entity.cycleDay}/${baseCycle}).\n`;
                } else {
                    p += `Current Status: LUTEAL PHASE / PMS (Cycle Day ${entity.cycleDay}/${baseCycle}). Not pregnant.\n`;
                }
            } else {
                if (entity.cycleDay <= periodDays) {
                    p += `Current Status: IN HEAT (Day ${entity.cycleDay}/${periodDays}) | Peak Fertility Window.\n`;
                } else if (entity.cycleDay > target) {
                    p += `Current Status: HEAT DELAYED (Late by ${entity.cycleDay - target} days).\n`;
                } else {
                    p += `Current Status: QUIESCENCE / REST PHASE (Day ${entity.cycleDay}/${baseCycle}). Not pregnant.\n`;
                }
            }

            if (entity.contraception !== 'none') {
                p += `Active Contraception: ${entity.contraception.toUpperCase()}.\n`;
            }
            const symptomsEn = getSymptomList(entity.symptomPhaseKey, entity.symptomIndices, 'en');
            if (symptomsEn.length > 0) p += `Current Physiological Symptoms: ${symptomsEn.join(', ')}.\n`;
        }
    }

    // Инъекция информации обо всех рождённых детях в семье
    if (entity.childrenList?.length > 0) {
        const kidsInfo = entity.childrenList.map((c, i) => {
            const gEn = translateGender(c.gender, 'en');
            const nameStr = (c.name && c.name.trim()) ? `Name: "${c.name.trim()}"` : 'Name: Unnamed';
            let diseaseStr = '';
            if (c.diseaseId) {
                const d = getFetalDisease(c.diseaseId, 'en');
                if (d) diseaseStr = `, Congenital Condition: ${d.name}`;
            }
            return `• Child #${i + 1} (${gEn}, ${nameStr}${diseaseStr})`;
        }).join('\n');

        p += `\n[FAMILY TREE & BORN CHILDREN OF ${macroName}]:
${macroName} has ${entity.childrenList.length} born child(ren) in the family:
${kidsInfo}
Direct Canon Instruction: Always remember and acknowledge these existing children in family interactions, daily life, dialogue, and roleplay context.\n`;
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
