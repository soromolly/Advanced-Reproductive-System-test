function processMessageInteractions(rawText, isUserMessage, messageIndex) {
    const data = getChatData();
    const chatId = getCurrentChatId();
    const msgKey = `${chatId}_${messageIndex}_birth`;

    // Вырезаем мысли и скрытые блоки рассуждений перед проверкой тегов
    const text = (rawText || '')
        .replace(/<think[\s\S]*?<\/think>/gi, ' ')
        .replace(/<thought[\s\S]*?<\/thought>/gi, ' ');

    const cumVagUser = /<!--\s*CUM_VAGINAL_USER\s*-->/i.test(text) || (!/CHAR/i.test(text) && /<!--\s*CUM_VAGINAL\s*-->/i.test(text));
    const cumAnalUser = /<!--\s*CUM_ANAL_USER\s*-->/i.test(text) || (!/CHAR/i.test(text) && /<!--\s*CUM_ANAL\s*-->/i.test(text));
    const cumVagChar = /<!--\s*CUM_VAGINAL_CHAR\s*-->/i.test(text);
    const cumAnalChar = /<!--\s*CUM_ANAL_CHAR\s*-->/i.test(text);

    if (data.targetMode === 'user' || data.targetMode === 'both') {
        const isTargetClimax = (data.user.gender === 'male_omega') ? cumAnalUser : cumVagUser;
        checkConceptionForEntity(data.user, text, isTargetClimax);
    }
    if (data.targetMode === 'char' || data.targetMode === 'both') {
        const isTargetClimax = (data.char.gender === 'male_omega') ? cumAnalChar : cumVagChar;
        checkConceptionForEntity(data.char, text, isTargetClimax);
    }

    if (/<!--\s*ABORTION_USER\s*-->/i.test(text) || /<!--\s*ABORTION\s*-->/i.test(text)) {
        if (data.user.isPregnant) processEntityAbortion(data.user, settings.language, logReproEvent, notify);
    }
    if (/<!--\s*ABORTION_CHAR\s*-->/i.test(text)) {
        if (data.char.isPregnant) processEntityAbortion(data.char, settings.language, logReproEvent, notify);
    }

    if (!processedBirthMessages.has(msgKey)) {
        const checkBirthFor = (entity, tagKey) => {
            if (!entity.isPregnant || !entity.babiesGenders || entity.babiesGenders.length === 0) return;
            const regex = new RegExp(`<!--\\s*BIRTH_(NATURAL|C_SECTION)_${tagKey}(?:_(\\d+))?\\s*-->`, 'gi');
            let match;
            while ((match = regex.exec(text)) !== null) {
                if (!entity.isPregnant) break; // Прерываем цикл сразу после рождения последнего ребёнка
                const method = match[1].toLowerCase() === 'c_section' ? 'c_section' : 'natural';
                deliverEntitySingleBaby(entity, method, settings.language, logReproEvent, notify);
            }
        };

        checkBirthFor(data.user, 'USER');
        checkBirthFor(data.char, 'CHAR');
        processedBirthMessages.add(msgKey);
    }
}
