import { getFetusData, getPostpartumData, getSymptomList, getComplication, getFetalDisease } from './symptoms.js';
import { translateGender } from './translations.js';

export function buildSystemPrompt({ settings, data, phaseEn, isImmediateBirth = false }) {
    let prompt = `\n[OOC: SYSTEM NOTE — {{user}} Physiological Status]\n`;
    
    if (isImmediateBirth) {
        const lastChildren = data.childrenList.slice(-data.childrenList.length);
        prompt += `🚨 CRITICAL STORY EVENT: {{user}} is GIVING BIRTH right now in this exact scene!\n`;
        prompt += `Baby details to describe: ${lastChildren.map((c, i) => `Child #${i+1}: ${translateGender(c.gender, 'en')}`).join('; ')}.\n`;
        return prompt;
    }

    if (data.postpartumDays > 0) {
        const pData = getPostpartumData(data.postpartumDays, data.deliveryMethod, 'en');
        const maxRecDays = (data.deliveryMethod === 'miscarriage') ? 14 : 40;
        prompt += `Status: RECOVERY PHASE (Day ${data.postpartumDays}/${maxRecDays}) | Event Outcome: ${data.deliveryMethod.toUpperCase()}\n`;
        prompt += `Physical Condition & Limitations: ${pData.desc}\n`;
        return prompt;
    }

    const isRevealedPregnancy = data.isPregnant && (data.isDiscovered || !settings.isSecretConception);

    if (isRevealedPregnancy) {
        prompt += `Status: PREGNANT (Obstetric Term) | Duration: ${data.pregnancyWeeks} weeks ${data.pregnancyDays} days.\n`;
        const fetus = getFetusData(data.pregnancyWeeks, 'en');
        prompt += `Fetus Size: ${fetus.size} | Maternal Body: ${fetus.belly}. ${fetus.desc}\n`;
        
        const symptomsEn = getSymptomList(data.symptomPhaseKey, data.symptomIndices, 'en');
        if (symptomsEn.length > 0) {
            prompt += `Current Pregnancy Symptoms: ${symptomsEn.join(', ')}.\n`;
        }

        if (data.activeComplication && data.activeComplication.isDiscovered) {
            const compEn = getComplication(data.activeComplication.id, 'en');
            if (compEn) {
                prompt += `[ACTIVE MEDICAL COMPLICATION]: {{user}} is experiencing "${compEn.name}". Symptoms/Condition: ${compEn.desc}. {{char}} must realistically acknowledge and react to this health complication.\n`;
            }
        }

        if (data.fetalDemise && data.fetalDemise.isDead) {
            const dDays = data.fetalDemise.daysSinceDemise;
            let stageDesc = '';
            if (dDays <= 14) {
                stageDesc = `Stage 1 (Silent / Hidden phase, Day ${dDays}/14): Non-developing pregnancy. Symptoms: sudden disappearance of morning sickness/toxicosis, drop in health and energy, silent demise.`;
            } else if (dDays <= 21) {
                stageDesc = `Stage 2 (Expulsion onset / Threatened miscarriage, Day ${dDays}/21): Inevitable rejection beginning. Symptoms: lower abdominal cramps, brownish spotting/discharge.`;
            } else {
                stageDesc = `Stage 3 (Active Expulsion / Miscarriage): Heavy uterine cramping, bleeding, spontaneous expulsion.`;
            }

            if (data.fetalDemise.hasInfection) {
                stageDesc += ` [CRITICAL COMPLICATION]: Prolonged unexpelled tissue has developed into an internal inflammatory process / infection debuff (pelvic fever, malaise, pain).`;
            }

            prompt += `\n[SECRET MEDICAL EVENT — MISSED MISCARRIAGE / ARRESTED PREGNANCY]:
- Current Secret Status: ${stageDesc}
- ⚠️ STRICT AI DIRECTIVE:
  1. DO NOT casually spoil this diagnosis in ordinary conversation. Roleplay subtle physiological symptoms only.
  2. IF {{user}} undergoes an ultrasound scan, visits a doctor, or is examined by a midwife/healer, {{char}} MUST diagnose the non-viable pregnancy / absent heartbeat.
  3. IF an abortion, curettage (D&C), vacuum extraction, or herbal expulsion is performed in this response, you MUST append the hidden tag at the absolute end: <!--ABORTION-->\n`;
        }

        let revealCount = (settings.aiAwareness === 'full') || (settings.aiAwareness === 'dynamic' && data.pregnancyWeeks >= 12);
        let revealGenders = (settings.aiAwareness === 'full') || (settings.aiAwareness === 'dynamic' && data.pregnancyWeeks >= 20);

        if (revealCount) {
            if (data.babiesCount === 1) {
                prompt += `[SINGLETON PREGNANCY - ULTRASOUND CONFIRMED]: Medical scans confirm {{user}} is carrying EXACTLY ONE SINGLE BABY (SINGLETON). STRICT DIRECTIVE: Under NO circumstances describe twins or multiples. There is strictly ONLY 1 child in the womb.\n`;
            } else {
                prompt += `[MULTIPLE PREGNANCY - ULTRASOUND CONFIRMED]: Medical scans confirm {{user}} is carrying EXACTLY ${data.babiesCount} babies in the womb.\n`;
            }
        }

        if (settings.aiAwareness === 'hidden') {
            prompt += `[SECRET DATA]: Headcount, sex, and congenital features are strictly CONCEALED from {{char}} (Medieval/Blind mode) until labor.\n`;
        } else {
            if (data.babiesDiseases && data.babiesDiseases.length > 0) {
                data.babiesDiseases.forEach((dId, idx) => {
                    const gEn = revealGenders ? translateGender(data.babiesGenders[idx], 'en') : 'Unknown Sex';
                    if (dId) {
                        const d = getFetalDisease(dId, 'en');
                        const isDiscovered = (settings.aiAwareness === 'full') || (data.pregnancyWeeks >= (d.discoveryWeek || 20));
                        if (isDiscovered && d.type === 'prenatal') {
                            const recText = d.abortionIndicated 
                                ? "Prognosis: Severe/Incompatible with life or severe disability. Medical board recommends or offers termination of pregnancy (abortion)."
                                : "Prognosis: Operable/Treatable postnatally or benign. Abortion is NOT medically indicated; postnatal care planned.";
                            prompt += `[MEDICAL DIAGNOSIS - FETUS #${idx + 1} (${gEn})]: Diagnosed with "${d.name}" (detected on week ${d.discoveryWeek} screening). ${d.desc} ${recText}\n`;
                        }
                    }
                });
            }

            if (revealGenders) {
                prompt += `[MEDICAL RECORD - ANATOMY SCAN (WEEK 20)]: Scans confirm the genders are: ${data.babiesGenders.map(g => translateGender(g, 'en')).join(', ')}.\n`;
            } else if (data.pregnancyWeeks < 20 && settings.aiAwareness === 'dynamic') {
                prompt += `[ULTRASOUND STAGE NOTICE]: Fetal sex is still completely OBSCURED from {{char}} before week 20 anatomy ultrasound.\n`;
            }
        }

        if (data.pregnancyWeeks >= 20) {
            const totalOriginal = data.babiesGenders.length + (data.currentDeliveredCount || 0);

            if (totalOriginal === 1) {
                prompt += `\n🚨 CRITICAL BIRTH LOGGING DIRECTIVE FOR {{char}}:
If {{user}} goes into labor, is currently giving birth, or delivers the baby in this specific response (natural delivery or C-section, full-term or preterm), you MUST append a hidden HTML tag at the absolute end of your response:
- For a natural delivery: <!--BIRTH_NATURAL-->
- For a Cesarean section (C-Section): <!--BIRTH_C_SECTION-->\n`;
            } else {
                const nextNum = (data.currentDeliveredCount || 0) + 1;
                prompt += `\n🚨 CRITICAL BIRTH LOGGING DIRECTIVE FOR {{char}} (MULTIPLE PREGNANCY):
{{user}} is carrying a multiple pregnancy (Total: ${totalOriginal} babies).
Babies already delivered: ${data.currentDeliveredCount || 0}.
Babies remaining in womb: ${data.babiesCount} (${data.babiesGenders.map(g => translateGender(g, 'en')).join(', ')}).

If a baby is physically delivered in this response, you MUST append the numbered tag for that baby at the absolute end of your response:
- If Baby #${nextNum} is delivered now: <!--BIRTH_NATURAL_${nextNum}--> (or <!--BIRTH_C_SECTION_${nextNum}-->)
${data.babiesGenders.length > 1 ? `- If Baby #${nextNum + 1} is ALSO delivered in this SAME response: <!--BIRTH_NATURAL_${nextNum + 1}--> (or <!--BIRTH_C_SECTION_${nextNum + 1}-->)` : ''}
⚠️ STRICT RULE: Append ONLY the tag matching the baby actually born in this scene. Do not append tags for unborn babies!\n`;
            }
        }
    } else {
        const baseCycle = settings.cycleLength || 28;
        const target = data.currentCycleTargetLength || baseCycle;
        prompt += `Current Cycle Day: ${data.cycleDay} | Cycle Length: ${baseCycle} days | Phase: ${phaseEn}\n`;
        if (data.cycleDay > target) {
            prompt += `[CYCLE DELAY NOTICE]: Menstrual period is late by ${data.cycleDay - target} days. {{user}} has not officially confirmed pregnancy yet.\n`;
        }
        if (data.contraception !== 'none') {
            prompt += `Active Birth Control Method: ${data.contraception.toUpperCase()}.\n`;
        }
        const symptomsEn = getSymptomList(data.symptomPhaseKey, data.symptomIndices, 'en');
        if (symptomsEn.length > 0) prompt += `Current Physical Symptoms: ${symptomsEn.join(', ')}.\n`;
        
        prompt += `🚨 CRITICAL SYSTEM LOG DIRECTIVE FOR {{char}}: At the absolute end of your response text, you MUST append a hidden HTML comment summary ONLY IF a full climax/ejaculation has explicitly occurred inside {{user}} WITHIN THIS SPECIFIC RESPONSE. 
        Choose exactly one that matches the finished action and write it verbatim:
        - If ejaculation has fully completed inside the vagina: <!--CUM_VAGINAL-->
        - If ejaculation has fully completed inside the anus: <!--CUM_ANAL-->
        - If ejaculation has fully completed inside the mouth/oral: <!--CUM_ORAL-->
        ⚠️ STRICTION LIMITATION: You MUST only append this tag at the very end when the action is truly COMPLETE and the climax has happened. Do not include this tag for foreplay or ongoing descriptions. Do not append if no climax/ejaculation occurs.\n`;
    }

    return prompt;
}
