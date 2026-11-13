// Общие хелперы сущности, используемые и обычной беременностью (Реализм/ОмегаВерс),
// и режимом «Яйцекладка». Вынесены отдельно, чтобы яйцекладка (eggController.js)
// и entityController.js не тянули друг друга (нет циклических импортов).

// Накопительная статистика сущности.
export function createDefaultStats() {
    return {
        cyclesCompleted: 0,
        cycleLengthsSum: 0,
        maxDelayDays: 0,
        sexualActs: 0,
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

// Медианные вес (г) и длина (см) новорождённого по акушерской неделе.
// Используются для генерации индивидуальных значений при рождении.
// Вес шаг 10 г, длина шаг 1 см — без дробных значений.
const BIRTH_SIZE_BY_WEEK = {
    22: { weight: 500, length: 28 },
    23: { weight: 550, length: 29 },
    24: { weight: 640, length: 31 },
    25: { weight: 740, length: 32 },
    26: { weight: 820, length: 34 },
    27: { weight: 950, length: 35 },
    28: { weight: 1050, length: 36 },
    29: { weight: 1200, length: 37 },
    30: { weight: 1350, length: 38 },
    31: { weight: 1500, length: 40 },
    32: { weight: 1700, length: 41 },
    33: { weight: 1900, length: 42 },
    34: { weight: 2100, length: 43 },
    35: { weight: 2350, length: 44 },
    36: { weight: 2600, length: 45 },
    37: { weight: 2900, length: 47 },
    38: { weight: 3100, length: 48 },
    39: { weight: 3300, length: 49 },
    40: { weight: 3500, length: 50 }
};

export function generateBirthMeasurements(weeks, babiesCount = 1) {
    const w = Math.max(22, Math.min(40, Math.round(weeks || 40)));
    const ref = BIRTH_SIZE_BY_WEEK[w] || BIRTH_SIZE_BY_WEEK[40];
    // Двойни и тройни рождаются мельче одиночек.
    const multiFactor = babiesCount >= 3 ? 0.78 : (babiesCount === 2 ? 0.88 : 1);
    const weightSpread = 0.9 + Math.random() * 0.2;   // ±10%
    const lengthSpread = 0.96 + Math.random() * 0.08;  // ±4%
    const weightGrams = Math.round((ref.weight * multiFactor * weightSpread) / 10) * 10;
    const lengthCm = Math.round(ref.length * multiFactor * lengthSpread);
    return { weightGrams, lengthCm };
}


// Полная кратность беременности (сколько детей всего, а не осталось родить).
export function getTotalBabies(entity) {
    return (entity.babiesGenders?.length || 0) + (entity.currentDeliveredCount || 0);
}

// Эффективный срок доношенности с учётом многоплодия:
// двойня — на 2 недели раньше, тройня+ — на 4 недели раньше одиночки.
export function getEffectiveTermWeeks(entity) {
    const base = entity.maxPregnancyWeeks || (entity.mode === 'omegaverse' ? 36 : 40);
    const total = getTotalBabies(entity);
    const shift = total >= 3 ? 4 : (total === 2 ? 2 : 0);
    return Math.max(1, base - shift);
}
