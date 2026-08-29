import { getTooltipHtml } from './tooltips.js';
import { getText, translateGender } from './translations.js';
import { getFetusData, getPostpartumData, getSymptomList, getComplication, getFetalDisease } from './symptoms.js';
import { dateToDays, daysToDateString } from './dateUtils.js';
import { getEntityBodyPhase } from './entityController.js';
import { getIncubationStageData } from './oviposition.js';

export function renderUI({ settings, chatData, activeTab, isMenuCollapsed }) {
    const lang = settings.language || 'ru';
    const targetMode = chatData.targetMode || 'user';
    const activeEntityKey = (targetMode === 'both') ? activeTab : targetMode;
    const currentEntity = chatData[activeEntityKey];

    const baseCycleDisplay = currentEntity.cycleLength || (currentEntity.mode === 'oviposition' ? 90 : 28);
    const isCurrentlyPregnantDiscovered = currentEntity.isPregnant && (currentEntity.isDiscovered || !currentEntity.isSecretConception);

    let displayDate = getText('waitingDate', lang);
    let inputDateValue = '';
    if (chatData.lastRpDate) { 
        const parts = chatData.lastRpDate.split('-'); 
        displayDate = `${parts[2]}.${parts[1]}.${parts[0]}`; 
        inputDateValue = `${parts[2]}.${parts[1]}.${parts[0]}`;
    }

    const currentSymptoms = getSymptomList(currentEntity.symptomPhaseKey, currentEntity.symptomIndices, lang);
    let symptomsHtml = '';
    if (currentSymptoms.length > 0) {
        symptomsHtml = `<div style="margin: 5px 0 10px 0; padding: 10px; background: rgba(244, 114, 182, 0.1); border: 1px solid rgba(244, 114, 182, 0.35); border-radius: 6px; text-align: left;">
            <strong style="font-size: 0.9em; color: #f472b6; display: block; margin-bottom: 5px;">${getText('symptomsTitle', lang)}</strong>
            <ul style="margin: 0; padding-left: 18px; font-size: 0.85em; line-height: 1.4; opacity: 0.95; color: var(--text-color);">${currentSymptoms.map(s => `<li style="margin-bottom: 2px;">${s}</li>`).join('')}</ul>
        </div>`;
    }

    let fetusHtml = '';
    let eddHtml = '';
    let fetalDiseaseHtml = '';
    let wombMapHtml = '';
    let incubationHtml = '';

    if (currentEntity.isIncubating) {
        const incData = getIncubationStageData(currentEntity.incubationDays, lang);
        incubationHtml = `<div style="margin: 5px 0 10px 0; padding: 10px; background: rgba(234, 179, 8, 0.12); border: 1px solid rgba(234, 179, 8, 0.45); border-radius: 6px; text-align: left; font-size: 0.85em; line-height: 1.4;">
            <strong style="font-size: 1.05em; color: #eab308; display: block; margin-bottom: 4px;">🪺 ${getText('incubationPhase', lang)} (День ${currentEntity.incubationDays}/70)</strong>
            • <b>${getText('eggsLaidCountLabel', lang)}</b> <span style="color: #facc15; font-weight: bold;">${currentEntity.laidClutchCount}</span><br>
            • <b>${getText('stageLabel', lang)}</b> <span>${incData.stage}</span><br>
            <span style="display: block; margin-top: 4px; opacity: 0.9; font-style: italic;">${incData.desc}</span>
        </div>`;
    }

    if (isCurrentlyPregnantDiscovered) {
        const fetus = getFetusData(currentEntity.pregnancyWeeks, lang, currentEntity.mode);
        const titleLabel = currentEntity.mode === 'oviposition' ? getText('eggTitle', lang) : getText('fetusTitle', lang);
        
        fetusHtml = `<div style="margin: 5px 0 10px 0; padding: 10px; background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.35); border-radius: 6px; text-align: left; font-size: 0.85em; line-height: 1.4;">
            <strong style="font-size: 1.05em; color: #38bdf8; display: block; margin-bottom: 5px;">${titleLabel}</strong>
            • ${getText('fetusSizeLabel', lang)} <span style="color: #38bdf8; font-weight: bold;">${fetus.size}</span><br>
            • ${getText('fetusWeightLabel', lang)} <span>${fetus.weight}</span><br>
            • ${getText('fetusBellyLabel', lang)} <span>${fetus.belly}</span><br>
            <span style="display: block; margin-top: 4px; opacity: 0.85; font-style: italic;">${fetus.desc}</span>
        </div>`;

        const hasAnyPathology = currentEntity.babiesDiseases?.some(Boolean);
        if (hasAnyPathology && settings.aiAwareness !== 'hidden') {
            let itemsHtml = '';
            currentEntity.babiesDiseases.forEach((dId, idx) => {
                if (dId) {
                    const disease = getFetalDisease(dId, lang);
                    const isDiscovered = (settings.aiAwareness === 'full') || (currentEntity.pregnancyWeeks >= (disease?.discoveryWeek || 2));
                    if (isDiscovered && disease) {
                        const itemTitle = currentEntity.mode === 'oviposition' ? `• Яйцо #${idx + 1}:` : `• Плод #${idx + 1}:`;
                        itemsHtml += `<div style="margin-bottom: 6px;"><b>${itemTitle}</b> <span style="color: #fcd34d; font-weight: bold;">${disease.name}</span><br><span style="opacity: 0.85; font-style: italic; font-size: 0.95em; padding-left: 10px; display: block;">${disease.desc}</span></div>`;
                    }
                }
            });
            if (itemsHtml) {
                fetalDiseaseHtml = `<div style="margin: 5px 0 10px 0; padding: 10px; background: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.4); border-radius: 6px; text-align: left; font-size: 0.85em; line-height: 1.4;"><strong style="font-size: 1.0em; color: #fbbf24; display: block; margin-bottom: 4px;">${getText('fetalAnomalyTitle', lang)}</strong>${itemsHtml}</div>`;
            }
        }

        if (currentEntity.mode === 'oviposition') {
            if (settings.aiAwareness === 'hidden') {
                wombMapHtml = `<div style="border-top: 1px dashed rgba(255,255,255,0.1); margin-top: 5px; padding-top: 5px; color: #a1a1aa; font-style: italic; font-size: 0.85em;">${getText('medievalLocked', lang)}</div>`;
            } else if (settings.aiAwareness === 'dynamic') {
                wombMapHtml = `<div style="border-top: 1px dashed rgba(255,255,255,0.1); margin-top: 5px; padding-top: 5px; color: #f472b6; font-size: 0.85em;">ℹ️ <em>${getText('wombMap', lang)}</em><br>• ${getText('eggsCountLabel', lang)} <b>${currentEntity.babiesCount}</b><br><span style="color: #a1a1aa; font-style: italic;">${getText('ultrasound12Locked', lang)}</span></div>`;
            } else {
                wombMapHtml = `<div style="border-top: 1px dashed rgba(255,255,255,0.1); margin-top: 5px; padding-top: 5px; color: #f472b6; font-size: 0.85em;">ℹ️ <em>${getText('wombMap', lang)}</em><br>• ${getText('eggsCountLabel', lang)} <b>${currentEntity.babiesCount}</b><br>• ${getText('babiesSex', lang)} <b>${currentEntity.babiesGenders.map(g => translateGender(g, lang)).join(', ')}</b></div>`;
            }
        } else {
            if (settings.aiAwareness === 'hidden') {
                wombMapHtml = `<div style="border-top: 1px dashed rgba(255,255,255,0.1); margin-top: 5px; padding-top: 5px; color: #a1a1aa; font-style: italic; font-size: 0.85em;">${getText('medievalLocked', lang)}</div>`;
            } else if (settings.aiAwareness === 'dynamic') {
                if (currentEntity.pregnancyWeeks >= 20) {
                    wombMapHtml = `<div style="border-top: 1px dashed rgba(255,255,255,0.1); margin-top: 5px; padding-top: 5px; color: #f472b6; font-size: 0.85em;">ℹ️ <em>${getText('wombMap', lang)}</em><br>• ${getText('babiesCount', lang)} <b>${currentEntity.babiesCount}</b><br>• ${getText('babiesSex', lang)} <b>${currentEntity.babiesGenders.map(g => translateGender(g, lang)).join(', ')}</b></div>`;
                } else if (currentEntity.pregnancyWeeks >= 12) {
                    wombMapHtml = `<div style="border-top: 1px dashed rgba(255,255,255,0.1); margin-top: 5px; padding-top: 5px; color: #f472b6; font-size: 0.85em;">ℹ️ <em>${getText('wombMap', lang)}</em><br>• ${getText('babiesCount', lang)} <b>${currentEntity.babiesCount}</b><br><span style="color: #a1a1aa; font-style: italic;">${getText('ultrasound20Locked', lang)}</span></div>`;
                } else {
                    wombMapHtml = `<div style="border-top: 1px dashed rgba(255,255,255,0.1); margin-top: 5px; padding-top: 5px; color: #a1a1aa; font-style: italic; font-size: 0.85em;">${getText('ultrasound12Locked', lang)}</div>`;
                }
            } else {
                wombMapHtml = `<div style="border-top: 1px dashed rgba(255,255,255,0.1); margin-top: 5px; padding-top: 5px; color: #f472b6; font-size: 0.85em;">ℹ️ <em>${getText('wombMap', lang)}</em><br>• ${getText('babiesCount', lang)} <b>${currentEntity.babiesCount}</b><br>• ${getText('babiesSex', lang)} <b>${currentEntity.babiesGenders.map(g => translateGender(g, lang)).join(', ')}</b></div>`;
            }
        }

        if (chatData.lastRpDate) {
            const maxWeeks = currentEntity.maxPregnancyWeeks || (currentEntity.mode === 'oviposition' ? 6 : (currentEntity.mode === 'omegaverse' ? 36 : 40));
            const daysRemaining = (maxWeeks * 7) - currentEntity.pregnancyDaysTotal;
            const parts = chatData.lastRpDate.split('-').map(Number);
            const currentTotalDays = dateToDays(parts[0], parts[1] - 1, parts[2]);
            const eddDateStr = daysToDateString(currentTotalDays + daysRemaining);
            const eddParts = eddDateStr.split('-');
            eddHtml = `<div style="margin-bottom: 4px;"><strong>${getText('eddLabel', lang)}</strong> <span style="color: #f472b6; font-weight: bold;">${eddParts[2]}.${eddParts[1]}.${eddParts[0]}</span></div>`;
        }
    }

    let postpartumHtml = '';
    if (currentEntity.postpartumDays > 0) {
        const pData = getPostpartumData(currentEntity.postpartumDays, currentEntity.deliveryMethod, lang);
        const maxRecovery = currentEntity.mode === 'oviposition' ? 7 : (currentEntity.deliveryMethod === 'miscarriage' ? 14 : 40);
        
        let outcomeText = lang === 'en' ? 'Natural Delivery' : 'Естественные роды';
        if (currentEntity.deliveryMethod === 'oviposition_recovery') outcomeText = lang === 'en' ? 'Oviposition' : 'Откладка яиц';
        if (currentEntity.deliveryMethod === 'c_section') outcomeText = lang === 'en' ? 'Cesarean Section' : 'Кесарево сечение';
        if (currentEntity.deliveryMethod === 'miscarriage') outcomeText = lang === 'en' ? 'Loss Recovery' : 'Восстановление / Прерывание';

        postpartumHtml = `<div style="margin: 5px 0 10px 0; padding: 10px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 6px; text-align: left; font-size: 0.85em; line-height: 1.4;">
            <strong style="font-size: 1.05em; color: #10b981; display: block; margin-bottom: 4px;">${getText('postpartumHeader', lang)}${currentEntity.postpartumDays}/${maxRecovery})</strong>
            <b>${getText('outcomeType', lang)}</b> <span style="color: #10b981; font-weight: bold;">${outcomeText}</span><br>
            <b>${getText('stageLabel', lang)}</b> <span>${pData.name}</span><br>
            <span style="opacity: 0.85; display: block; margin-top: 4px; font-style: italic;">${pData.desc}</span>
        </div>`;
    }

    let complicationHtml = '';
    if (isCurrentlyPregnantDiscovered && currentEntity.activeComplication?.isDiscovered) {
        const comp = getComplication(currentEntity.activeComplication.id, lang);
        if (comp) {
            complicationHtml = `<div style="margin: 8px 0 10px 0; padding: 10px; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 6px; text-align: left; font-size: 0.85em; line-height: 1.4;">
                <strong style="color: #f87171; display: block; margin-bottom: 4px;">${getText('complicationTitle', lang)} ${comp.name}</strong>
                <span style="opacity: 0.9; display: block; margin-bottom: 6px;">${comp.desc}</span>
                ${comp.curable ? `<button id="repro-cure-complication" class="menu_button" style="width: 100%; background: #059669; color: white; font-size: 11px; padding: 4px; font-weight: 600; justify-content: center;">${getText('cureBtn', lang)}</button>` : ''}
            </div>`;
        }
    }

    let familyHtml = '';
    if (currentEntity.childrenList?.length > 0) {
        familyHtml = `<div style="margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.03); border: 1px dashed rgba(255,255,255,0.15); border-radius: 6px; text-align: left; font-size: 0.85em;">
            <strong style="color: #f472b6; display: block; margin-bottom: 6px;">${getText('newbornTitle', lang)}</strong>
            ${currentEntity.childrenList.map((c, i) => {
                let featureHtml = '';
                if (c.diseaseId) {
                    const feat = getFetalDisease(c.diseaseId, lang);
                    if (feat) featureHtml = `<div style="margin-top: 2px; padding-left: 14px; font-size: 0.9em; color: #fcd34d;">• ${getText('congenitalFeatureLabel', lang)} <b>${feat.name}</b></div>`;
                }
                return `<div style="margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px dashed rgba(255,255,255,0.08);">👶 ${getText('childLabel', lang)} ${i+1}: <b>${translateGender(c.gender, lang)}</b>${featureHtml}</div>`;
            }).join('')}
        </div>`;
    }

    let genderOptionsHtml = '';
    if (currentEntity.mode === 'realism') {
        genderOptionsHtml = `<option value="female" ${currentEntity.gender === 'female' ? 'selected' : ''}>${getText('female', lang)}</option>`;
    } else if (currentEntity.mode === 'omegaverse') {
        genderOptionsHtml = `
            <option value="female_omega" ${currentEntity.gender === 'female_omega' ? 'selected' : ''}>${getText('female_omega', lang)}</option>
            <option value="male_omega" ${currentEntity.gender === 'male_omega' ? 'selected' : ''}>${getText('male_omega', lang)}</option>
        `;
    } else {
        genderOptionsHtml = `
            <option value="female_oviposition" ${currentEntity.gender === 'female_oviposition' ? 'selected' : ''}>${getText('female_oviposition', lang)}</option>
            <option value="male_oviposition" ${currentEntity.gender === 'male_oviposition' ? 'selected' : ''}>${getText('male_oviposition', lang)}</option>
        `;
    }

    const checkBtnLabel = (settings.aiAwareness === 'hidden') ? getText('checkPregnancyBtn', lang) : getText('takeTestBtn', lang);

    const activeTabStyle = `flex: 1; padding: 7px 0; font-size: 12px; font-weight: 700; justify-content: center; background: linear-gradient(135deg, #ec4899, #be185d) !important; color: #ffffff !important; border: 1px solid #f472b6 !important; box-shadow: 0 0 10px rgba(244, 114, 182, 0.45); border-radius: 6px; cursor: pointer; transition: all 0.15s ease;`;
    const inactiveTabStyle = `flex: 1; padding: 7px 0; font-size: 12px; font-weight: 500; justify-content: center; background: rgba(255, 255, 255, 0.05) !important; color: #94a3b8 !important; border: 1px solid rgba(255, 255, 255, 0.15) !important; border-radius: 6px; cursor: pointer; opacity: 0.75; transition: all 0.15s ease;`;

    const tabsHtml = targetMode === 'both' ? `
        <div style="display: flex; gap: 8px; margin-bottom: 12px;">
            <button id="repro-tab-user" class="menu_button" style="${activeTab === 'user' ? activeTabStyle : inactiveTabStyle}">${getText('tabUser', lang)}</button>
            <button id="repro-tab-char" class="menu_button" style="${activeTab === 'char' ? activeTabStyle : inactiveTabStyle}">${getText('tabChar', lang)}</button>
        </div>
    ` : '';

    const currentMode = currentEntity.mode || 'realism';

    const html = `
        <div class="repro-custom-btn-toggle" style="display: flex; justify-content: space-between; align-items: center; background: var(--input-bg, #1e1e2a); border: 1px solid var(--input-border, #334155); padding: 10px 14px; border-radius: ${isMenuCollapsed ? '10px' : '10px 10px 0 0'}; cursor: pointer; user-select: none; font-size: 14px; transition: background 0.15s;">
            <span style="color: #f472b6 !important; font-weight: 600;">${getText('title', lang)}</span>
            <i id="repro-toggle-arrow" class="fa-solid ${isMenuCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'}" style="opacity: 0.6; font-size: 12px; margin-right: 4px;"></i>
        </div>
        
        <div id="repro-content-wrapper" style="${isMenuCollapsed ? 'display: none;' : 'display: block;'} background: rgba(0, 0, 0, 0.15); border: 1px solid var(--input-border, #334155); border-top: none; border-radius: 0 0 10px 10px; padding: 14px; box-sizing: border-box;">
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px dashed rgba(255,255,255,0.1);">
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="repro-is-enabled" ${settings.isEnabled ? 'checked' : ''} style="cursor: pointer; width: 15px; height: 15px; margin: 0;"/>
                        <label for="repro-is-enabled" style="font-size: 0.9em; cursor: pointer; color: var(--text-color, #f8fafc); opacity: 0.85;">${getText('enableExt', lang)}</label>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="repro-is-notifications-enabled" ${settings.isNotificationsEnabled ? 'checked' : ''} style="cursor: pointer; width: 15px; height: 15px; margin: 0;"/>
                        <label for="repro-is-notifications-enabled" style="font-size: 0.9em; cursor: pointer; opacity: 0.85; color: var(--text-color, #f8fafc);">${getText('enableNotif', lang)}</label>
                    </div>
                </div>
                <select id="repro-lang-select" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: #f472b6; font-weight: 700; font-size: 12px; min-width: 58px; height: 32px; padding: 4px 6px; border-radius: 6px; outline: none; cursor: pointer; text-align: center;">
                    <option value="ru" ${settings.language === 'ru' ? 'selected' : ''}>RU</option>
                    <option value="en" ${settings.language === 'en' ? 'selected' : ''}>EN</option>
                </select>
            </div>

            <div id="repro-options-panel" style="display: flex; flex-direction: column; opacity: ${settings.isEnabled ? '1' : '0.35'}; pointer-events: ${settings.isEnabled ? 'auto' : 'none'};">
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; background: rgba(244, 114, 182, 0.08); padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(244, 114, 182, 0.3);">
                    <label style="font-size: 0.9em; font-weight: 600; color: #f472b6;">${getText('targetModeLabel', lang)}</label>
                    <select id="repro-target-mode" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 5px 8px; border-radius: 6px; font-weight: 600;">
                        <option value="user" ${targetMode === 'user' ? 'selected' : ''}>${getText('targetUser', lang)}</option>
                        <option value="char" ${targetMode === 'char' ? 'selected' : ''}>${getText('targetChar', lang)}</option>
                        <option value="both" ${targetMode === 'both' ? 'selected' : ''}>${getText('targetBoth', lang)}</option>
                    </select>
                </div>

                ${tabsHtml}

                <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; padding: 8px; background: rgba(255,255,255,0.02); border-radius: 6px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="repro-is-secret-conception" ${currentEntity.isSecretConception ? 'checked' : ''} style="cursor: pointer; width: 15px; height: 15px; margin: 0;"/>
                        <label for="repro-is-secret-conception" style="font-size: 0.85em; cursor: pointer;">${getText('secretConceptionLabel', lang)}</label>
                        ${getTooltipHtml('secretConception', lang, currentMode)}
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="repro-is-irregular-cycle" ${currentEntity.isIrregularCycle ? 'checked' : ''} style="cursor: pointer; width: 15px; height: 15px; margin: 0;"/>
                        <label for="repro-is-irregular-cycle" style="font-size: 0.85em; cursor: pointer;">${getText('irregularCycleLabel', lang)}</label>
                        ${getTooltipHtml('irregularCycle', lang, currentMode)}
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <label style="font-size: 0.9em; opacity: 0.85; display: flex; align-items: center;">${getText('system', lang)} ${getTooltipHtml('mode', lang, currentMode)}</label>
                    <select id="repro-mode" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%;">
                        <option value="realism" ${currentEntity.mode === 'realism' ? 'selected' : ''}>${getText('realism', lang)}</option>
                        <option value="omegaverse" ${currentEntity.mode === 'omegaverse' ? 'selected' : ''}>${getText('omegaverse', lang)}</option>
                        <option value="oviposition" ${currentEntity.mode === 'oviposition' ? 'selected' : ''}>${getText('oviposition', lang)}</option>
                    </select>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <label style="font-size: 0.9em; opacity: 0.85; display: flex; align-items: center;">${getText('physiology', lang)} ${getTooltipHtml('physiology', lang, currentMode)}</label>
                    <select id="repro-gender" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%;">
                        ${genderOptionsHtml}
                    </select>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <label style="font-size: 0.9em; opacity: 0.85; display: flex; align-items: center;">${getText('aiLogic', lang)} ${getTooltipHtml('aiAwareness', lang, currentMode)}</label>
                    <select id="repro-awareness" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%;">
                        <option value="dynamic" ${settings.aiAwareness === 'dynamic' ? 'selected' : ''}>${getText('ultrasound', lang)}</option>
                        <option value="hidden" ${settings.aiAwareness === 'hidden' ? 'selected' : ''}>${getText('medieval', lang)}</option>
                        <option value="full" ${settings.aiAwareness === 'full' ? 'selected' : ''}>${getText('knowsAll', lang)}</option>
                    </select>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <label style="font-size: 0.9em; opacity: 0.85; display: flex; align-items: center;">${getText('protectionLabel', lang)} ${getTooltipHtml('contraception', lang, currentMode)}</label>
                    <select id="repro-contraception" ${isCurrentlyPregnantDiscovered || currentEntity.postpartumDays > 0 || currentEntity.isIncubating ? 'disabled' : ''} style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%;">
                        <option value="none" ${currentEntity.contraception === 'none' ? 'selected' : ''}>${getText('protectionNone', lang)}</option>
                        <option value="condom" ${currentEntity.contraception === 'condom' ? 'selected' : ''}>${getText('protectionCondom', lang)}</option>
                        <option value="pills" ${currentEntity.contraception === 'pills' ? 'selected' : ''}>${getText('protectionPills', lang)}</option>
                        <option value="iud" ${currentEntity.contraception === 'iud' ? 'selected' : ''}>${getText('protectionIud', lang)}</option>
                    </select>
                </div>

                <div style="background: rgba(0, 0, 0, 0.25); border-left: 3px solid #f472b6; border-radius: 4px; padding: 10px; margin: 12px 0; font-size: 0.9em; text-align: left;">
                    <div style="margin-bottom: 4px;"><strong>${getText('phaseRealism', lang)}</strong> <span style="color: #4ade80; font-weight: 700;">${getEntityBodyPhase(currentEntity, lang)}</span></div>
                    
                    ${symptomsHtml}
                    ${incubationHtml}
                    ${fetusHtml}
                    ${fetalDiseaseHtml}
                    ${postpartumHtml}
                    ${complicationHtml}
                    ${familyHtml}

                    ${isCurrentlyPregnantDiscovered ? `
                        <div style="margin-bottom: 4px;"><strong>${getText('termInRp', lang)}</strong> ${currentEntity.pregnancyWeeks} ${getText('weeksShort', lang)} ${currentEntity.pregnancyDays} ${getText('daysShort', lang)}</div>
                        ${eddHtml}
                        ${wombMapHtml}
                    ` : `
                        ${currentEntity.postpartumDays === 0 && !currentEntity.isIncubating ? `<div style="margin-bottom: 4px;"><strong>${getText('cycleDayLabel', lang)}</strong> ${currentEntity.cycleDay} ${getText('ofLabel', lang)} ${baseCycleDisplay}</div>` : ''}
                    `}
                    <div style="font-size: 0.85em; color: #64748b; margin-top: 6px;">📅 ${getText('sync', lang)} ${displayDate}</div>
                </div>

                ${(!isCurrentlyPregnantDiscovered && currentEntity.cycleDay > currentEntity.cycleLength && currentEntity.postpartumDays === 0 && !currentEntity.isIncubating) ? `
                    <button id="repro-btn-take-test" class="menu_button" style="width: 100%; background: #db2777; color: white; font-weight: 700; margin-bottom: 10px; padding: 8px 0; justify-content: center;">${checkBtnLabel}</button>
                ` : ''}

                ${isCurrentlyPregnantDiscovered ? `
                    <button id="repro-btn-birth-trigger" class="menu_button" style="width: 100%; background: #10b981; color: white; font-weight: 700; margin-bottom: 10px; padding: 8px 0; justify-content: center;">${getText('giveBirthBtn', lang)}</button>
                ` : ''}

                ${currentEntity.isIncubating ? `
                    <button id="repro-btn-hatch-trigger" class="menu_button" style="width: 100%; background: #eab308; color: black; font-weight: 700; margin-bottom: 10px; padding: 8px 0; justify-content: center;">${getText('hatchAllBtn', lang)}</button>
                ` : ''}

                ${isCurrentlyPregnantDiscovered ? `
                    <button id="repro-btn-abort" class="menu_button" style="width: 100%; background: #991b1b; color: white; font-weight: 700; margin-bottom: 10px; padding: 8px 0; justify-content: center;">${getText('abortBtn', lang)}</button>
                ` : ''}

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <label style="font-size: 0.9em; opacity: 0.85; display: flex; align-items: center;">${getText('rpDateLabel', lang)} ${getTooltipHtml('rpDate', lang, currentMode)}</label>
                    <input type="text" id="repro-input-rpdate" placeholder="ДД.ММ.ГГГГ" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%;" value="${inputDateValue}"/>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <label style="font-size: 0.9em; opacity: 0.85; display: flex; align-items: center;">${getText('cycleLengthLabel', lang)} ${getTooltipHtml('cycleLength', lang, currentMode)}</label>
                    <input type="number" id="repro-input-cycle" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%;" value="${currentEntity.cycleLength || (currentEntity.mode === 'oviposition' ? 90 : 28)}"/>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <label style="font-size: 0.9em; opacity: 0.85; display: flex; align-items: center;">${getText('periodDurationLabel', lang)} ${getTooltipHtml('periodDuration', lang, currentMode)}</label>
                    <input type="number" id="repro-input-period" min="2" max="15" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%;" value="${currentEntity.periodDuration || 5}"/>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <label style="font-size: 0.9em; opacity: 0.85; display: flex; align-items: center;">${getText('maxWeeksLabel', lang)} ${getTooltipHtml('maxWeeks', lang, currentMode)}</label>
                    <input type="number" id="repro-input-maxweeks" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%;" value="${currentEntity.maxPregnancyWeeks || (currentEntity.mode === 'oviposition' ? 6 : (currentEntity.mode === 'omegaverse' ? 36 : 40))}" min="1" max="50"/>
                </div>
                
                ${isCurrentlyPregnantDiscovered ? `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <label style="font-size: 0.9em; opacity: 0.85;">${getText('pregnancyWeekLabel', lang)}</label>
                        <div style="display: flex; gap: 6px; width: 55%;">
                            <input type="number" id="repro-input-weeks" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 8px; border-radius: 6px; width: 50%;" value="${currentEntity.pregnancyWeeks}" min="0" max="50"/>
                            <input type="number" id="repro-input-days" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 8px; border-radius: 6px; width: 50%;" value="${currentEntity.pregnancyDays || 0}" min="0" max="6"/>
                        </div>
                    </div>
                ` : `
                    ${currentEntity.postpartumDays === 0 && !currentEntity.isIncubating ? `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <label style="font-size: 0.9em; opacity: 0.85;">${getText('cycleDayLabel', lang)} </label>
                        <input type="number" id="repro-input-day" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%;" value="${currentEntity.cycleDay}"/>
                    </div>` : ''}
                `}

                <button id="repro-apply-params" class="menu_button type_primary" style="width: 100%; margin-top: 10px; font-weight: 600;">${getText('applyBtn', lang)}</button>

                ${(!isCurrentlyPregnantDiscovered && currentEntity.postpartumDays === 0 && !currentEntity.isIncubating) ? `
                    <div style="background: rgba(244, 114, 182, 0.03); border: 1px dashed rgba(244, 114, 182, 0.2); border-radius: 8px; padding: 12px; margin: 14px 0 10px 0; text-align: left;">
                        <div style="font-size: 0.85em; font-weight: 700; color: #f472b6; margin-bottom: 8px; text-transform: uppercase;">${getText('initPregnancyHeader', lang)}</div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <label style="font-size: 0.9em; opacity: 0.85;">${getText('manualWeeks', lang)}</label>
                            <div style="display: flex; gap: 6px; width: 55%;">
                                <input type="number" id="repro-manual-weeks" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 8px; border-radius: 6px; width: 50%;" value="${currentEntity.mode === 'oviposition' ? 2 : 4}" min="0" max="40"/>
                                <input type="number" id="repro-manual-days" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 8px; border-radius: 6px; width: 50%;" value="0" min="0" max="6"/>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <label style="font-size: 0.9em; opacity: 0.85;">${getText('manualCount', lang)} </label>
                            <input type="number" id="repro-manual-count" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%;" value="${currentEntity.mode === 'oviposition' ? 4 : 1}" min="1" max="12"/>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                            <input type="checkbox" id="repro-fetal-pathology-enabled" ${currentEntity.isFetalPathologyEnabled ? 'checked' : ''} style="cursor: pointer; width: 14px; height: 14px; margin: 0;"/>
                            <label for="repro-fetal-pathology-enabled" style="font-size: 0.85em; cursor: pointer; color: var(--text-color, #f8fafc); line-height: 1.3;">${getText('fetalPathologyLabel', lang)}</label>
                            ${getTooltipHtml('fetalPathology', lang, currentMode)}
                        </div>
                        <button id="repro-btn-manual-preg" class="menu_button" style="width: 100%; background: #db2777; color: white; font-weight: 600;">${getText('startPregnancyBtn', lang)}</button>
                    </div>
                ` : ''}

                ${isCurrentlyPregnantDiscovered || currentEntity.isIncubating ? `
                    <button id="repro-reset-pregnancy-only" class="menu_button type_warning" style="width: 100%; margin-top: 10px; font-weight: 600;">${getText('resetPregnancyBtn', lang)}</button>
                ` : ''}

                <button id="repro-reset" class="menu_button type_danger" style="width: 100%; margin-top: 10px; font-weight: 600;">${getText('resetAllBtn', lang)}</button>
                
                <div style="margin-top: 14px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 0.78em; color: #64748b; text-align: center; font-style: italic;">
                    ${getText('globalRollsLabel', lang)} <span style="font-weight: bold; font-family: monospace; color: #94a3b8; margin-left: 2px;">${settings.globalRollsCount || 0}</span>
                </div>

                <button id="repro-export-logs" class="menu_button" style="width: 100%; margin-top: 10px; font-weight: 600; justify-content: center;">${getText('exportLogsBtn', lang)}</button>
            </div>
        </div>
    `;

    let container = $('#repro-system-extension-container');
    if (container.length === 0) {
        container = $('<div id="repro-system-extension-container" style="grid-column: auto; margin-bottom: 10px;"></div>');
        $('#extensions_settings').append(container);
    }
    container.html(html);
}

export function exportReproLogs({ data, chatId, language, isNotificationsEnabled }) {
    let textContent = `=====================================================\n`;
    textContent += `  REPRODUCTIVE SYSTEM EXTENSION - ACTIVITY LOGS\n`;
    textContent += `  Chat ID: ${chatId}\n`;
    textContent += `  Export Date: ${new Date().toISOString()}\n`;
    textContent += `  Current RP Date: ${data.lastRpDate || 'N/A'}\n`;
    textContent += `  Active Tracking Target: ${data.targetMode.toUpperCase()}\n`;
    textContent += `=====================================================\n\n`;

    const formatEntityInfo = (ent, label) => {
        let str = `--- [${label}] ---\n`;
        str += `Mode: ${ent.mode} | Gender: ${ent.gender} | Contraception: ${ent.contraception}\n`;
        str += `State: ${ent.isPregnant ? (ent.isDiscovered ? 'Pregnant/Carrying (Discovered)' : 'Pregnant/Carrying (Secret)') : (ent.isIncubating ? 'Incubating Clutch' : 'Not Pregnant')}\n`;
        str += `Cycle Day: ${ent.cycleDay}/${ent.cycleLength}\n`;
        str += `Term: ${ent.pregnancyWeeks}w ${ent.pregnancyDays}d | Incubation: ${ent.incubationDays}d\n`;
        str += `Babies/Eggs: ${ent.babiesCount || ent.laidClutchCount}\n\n`;
        return str;
    };

    if (data.user) textContent += formatEntityInfo(data.user, 'USER PROFILE');
    if (data.char) textContent += formatEntityInfo(data.char, 'CHAR PROFILE');

    textContent += `=== EVENT LOGS ===\n`;
    if (data.activityLogs && data.activityLogs.length > 0) {
        textContent += data.activityLogs.join('\n');
    } else {
        textContent += `(No event logs recorded yet for this session)\n`;
    }

    try {
        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `repro_logs_${chatId}_${Date.now()}.txt`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            if (document.body.contains(a)) document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 1500);

        if (isNotificationsEnabled && typeof toastr !== 'undefined') {
            toastr.success(language === 'en' ? 'Log file downloaded!' : 'Файл логов скачивается!');
        }
    } catch (err) {
        console.error('Repro export failed:', err);
        if (typeof toastr !== 'undefined') {
            toastr.error('Download failed: ' + err.message);
        }
    }
}
