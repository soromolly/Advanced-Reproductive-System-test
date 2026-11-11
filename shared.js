// Общие хелперы сущности, используемые и обычной беременностью (Реализм/ОмегаВерс),
// и режимом «Яйцекладка». Вынесены отдельно, чтобы яйцекладка (eggController.js)
// и entityController.js не тянули друг друга (нет циклических импортов).

// Накопительная статистика сущности.
export function createDefaultStats() {
    return {
        cyclesCompleted: 0,
        cycleLengthsSum: 0,
        maxDelayDays: 0,
        conceptionChecks: 0,
        conceptionSuccesses: 0,
        pregnanciesTotal: 0,
        births: 0,
        miscarriages: 0,
        stillbirths: 0,
        abortions: 0,
        clutches: 0,
        eggsLaid: 0,
        eggsHatched: 0
    };
}

export function ensureStats(entity) {
    if (!entity.stats) entity.stats = createDefaultStats();
    return entity.stats;
}

export function generateBabyGender(mode, lang = 'ru') {
    const isBoy = Math.random() > 0.5;
    const isRu = lang === 'ru';
    
    if (mode === 'omegaverse') {
        const roll = Math.random() * 100;
        let sec = isRu ? 'Бета' : 'Beta';
        if (roll < 33.33) sec = isRu ? 'Альфа' : 'Alpha';
        else if (roll < 66.66) sec = isRu ? 'Омега' : 'Omega';
        if (isRu) return isBoy ? `${sec}-мальчик ♂` : `${sec}-девочка ♀`;
        return isBoy ? `${sec} Boy ♂` : `${sec} Girl ♀`;
    }
    if (isRu) return isBoy ? 'Мальчик ♂' : 'Девочка ♀';
    return isBoy ? 'Boy ♂' : 'Girl ♀';
}

export function formatDelayDays(days, lang = 'ru') {
    if (lang === 'en') return `${days} ${days === 1 ? 'day' : 'days'}`;
    const abs = Math.abs(days) % 100;
    const last = abs % 10;
    if (abs >= 11 && abs <= 19) return `${days} дней`;
    if (last === 1) return `${days} день`;
    if (last >= 2 && last <= 4) return `${days} дня`;
    return `${days} дней`;
}

// Задержка всегда считается от номинальной длины цикла (настроенной в UI).
// Персонаж не знает фактическую длину текущего цикла — овуляция могла
// сдвинуться раньше или позже, — поэтому субъективная «задержка»
// отсчитывается только от номинала, одинаково в UI и в промпте.
export function getCycleDelayBaseline(entity) {
    return entity.cycleLength || 28;
}

export function rollNewCycleTarget(entity) {
    const base = entity.cycleLength || 28;
    if (!entity.isIrregularCycle) return base;
    
    const roll = Math.random() * 100;
    let variance = 0;
    if (roll < 65) {
        variance = Math.floor(Math.random() * 3) - 1;
    } else if (roll < 90) {
        variance = Math.random() > 0.3 ? (Math.floor(Math.random() * 4) + 2) : -2;
    } else {
        variance = Math.floor(Math.random() * 7) + 6;
    }
    return Math.max((entity.periodDuration || 5) + 6, base + variance);
}
