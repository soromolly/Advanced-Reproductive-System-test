// База данных и классификация преждевременных родов (Realism / OmegaVerse).
// Яйцекладка не участвует — у неё другие сроки вынашивания и инкубации.

const PREMATURITY = {
    stillbirth: {
        label: {
            ru: 'поздний выкидыш (мертворождение)',
            en: 'late miscarriage (stillbirth)'
        },
        band: {
            ru: '18–21 неделя',
            en: '18–21 weeks'
        },
        facts: {
            ru: 'Вес менее 400 г; все системы незрелые; самостоятельное дыхание невозможно; нежизнеспособен.',
            en: 'Weight under 400 g; all systems immature; no independent breathing; non-viable.'
        },
        prognosis: {
            modern: { ru: 'Нежизнеспособен.', en: 'Non-viable.' },
            medieval: { ru: 'Нежизнеспособен.', en: 'Non-viable.' }
        }
    },
    extreme: {
        label: {
            ru: 'крайне недоношенный',
            en: 'extremely premature'
        },
        band: {
            ru: '22–25 недель',
            en: '22–25 weeks'
        },
        facts: {
            ru: '450–750 г; тёмно-красная полупрозрачная морщинистая кожа (нет подкожного жира); сросшиеся веки; мягкие ушные раковины; незрелые лёгкие (нет сурфактанта) — не может дышать самостоятельно; нет сосательного/глотательного рефлексов; нужны аппарат ИВЛ, кувез с высокой влажностью и внутривенное парентеральное питание.',
            en: '450–750 g; dark-red translucent wrinkled skin (no subcutaneous fat); fused eyelids; soft ears; immature lungs (no surfactant) — cannot breathe independently; no suck/swallow reflexes; needs ventilator, high-humidity incubator and IV parenteral nutrition.'
        },
        prognosis: {
            modern: {
                ru: 'Выживаемость 10–30%; высокий риск ДЦП, ретинопатии/слепоты, глухоты и тяжёлой задержки развития.',
                en: '10–30% survival; high risk of cerebral palsy, retinopathy/blindness, deafness and severe developmental delay.'
            },
            medieval: { ru: 'Выживание невозможно.', en: 'Survival impossible.' }
        }
    },
    very: {
        label: {
            ru: 'глубоко недоношенный',
            en: 'very premature'
        },
        band: {
            ru: '26–29 недель',
            en: '26–29 weeks'
        },
        facts: {
            ru: '800–1200 г; красная сильно морщинистая кожа; обильный лануго; незрелые лёгкие с эпизодами апноэ — нужны CPAP или ИВЛ; нет сосательного рефлекса; нужны кувез, кормление через назогастральный зонд, приглушённый свет и тишина.',
            en: '800–1200 g; red heavily wrinkled skin; abundant lanugo; immature lungs with apnea episodes — needs CPAP or ventilator; no suck reflex; needs incubator, nasogastric tube feeding, low light/noise.'
        },
        prognosis: {
            modern: {
                ru: 'Выживаемость 80–90%; риск внутрижелудочкового кровоизлияния и бронхолёгочной дисплазии; часто задержка роста.',
                en: '80–90% survival; risk of intraventricular hemorrhage and bronchopulmonary dysplasia; frequent growth delay.'
            },
            medieval: { ru: 'Выживание <1%.', en: 'Survival <1%.' }
        }
    },
    moderate: {
        label: {
            ru: 'умеренно недоношенный',
            en: 'moderately premature'
        },
        band: {
            ru: '30–33 недели',
            en: '30–33 weeks'
        },
        facts: {
            ru: '1300–2000 г; красная кожа, мало подкожного жира, очень тонкая; дыхание самостоятельное, но нестабильное с возможным апноэ; сосательный рефлекс слабый/отсутствует (формируется к 32–34 неделям); нужны кувез для терморегуляции и сцеженное молоко через зонд или бутылочку.',
            en: '1300–2000 g; red skin, little subcutaneous fat, very thin; breathing independent but unstable with possible apnea; suck reflex weak/absent (develops by 32–34 weeks); needs incubator for thermoregulation and expressed milk via tube or bottle.'
        },
        prognosis: {
            modern: {
                ru: 'Частая желтуха новорождённых (фототерапия) и риск инфекций; в целом благоприятный.',
                en: 'Common neonatal jaundice (phototherapy) and infection risk; overall favorable.'
            },
            medieval: { ru: 'Выживание лишь в редких случаях при идеальном уходе и тепле.', en: 'Survival only in rare cases with ideal care and warmth.' }
        }
    },
    late: {
        label: {
            ru: 'поздний недоношенный',
            en: 'late premature'
        },
        band: {
            ru: '34–36 недель',
            en: '34–36 weeks'
        },
        facts: {
            ru: '2000–2500 г; близок к доношенному, но меньше и с меньшим подкожным жиром; дыхание самостоятельное с возможной кратковременной тахипноэ; сосательный рефлекс есть, но быстро устаёт; может находиться с матерью, часто нужен подогрев или короткий кувез для терморегуляции.',
            en: '2000–2500 g; close to full term but smaller with less subcutaneous fat; independent breathing with possible brief tachypnea; suck reflex present but tires quickly; may room in, often needs warmer or short incubator for thermoregulation.'
        },
        prognosis: {
            modern: {
                ru: 'Риск лёгкой желтухи и медленного набора веса; быстрая адаптация.',
                en: 'Risk of mild jaundice and slow weight gain; rapid adaptation.'
            },
            medieval: { ru: 'Высокая выживаемость при тепле и кормилице.', en: 'High survival with warmth and a wet nurse.' }
        }
    }
};

export function getPrematurityCategory(weeks, mode) {
    if (!Number.isFinite(weeks)) return null;
    const fullTermWeeks = mode === 'omegaverse' ? 36 : 37;
    if (weeks < 22) return 'stillbirth';
    if (weeks < 26) return 'extreme';
    if (weeks < 30) return 'very';
    if (weeks < 34) return 'moderate';
    if (weeks < fullTermWeeks) return 'late';
    return null;
}

export function getPrematurityPrompt(categoryId, birthWeek, aiAwareness) {
    if (!categoryId || !PREMATURITY[categoryId]) return '';
    const cat = PREMATURITY[categoryId];
    const era = aiAwareness === 'hidden' ? 'medieval' : 'modern';
    return `Born at ${birthWeek} weeks (${cat.label.en}, ${cat.band.en}): ${cat.facts.en} Prognosis (${era}): ${cat.prognosis[era].en}`;
}

// Данные для отображения в UI (локализованные). Возвращает null, если категория неизвестна.
export function getPrematurityDisplay(categoryId, lang, aiAwareness) {
    if (!categoryId || !PREMATURITY[categoryId]) return null;
    const cat = PREMATURITY[categoryId];
    const isRu = lang === 'ru';
    const era = aiAwareness === 'hidden' ? 'medieval' : 'modern';
    return {
        label: cat.label[isRu ? 'ru' : 'en'],
        band: cat.band[isRu ? 'ru' : 'en'],
        facts: cat.facts[isRu ? 'ru' : 'en'],
        prognosis: cat.prognosis[era][isRu ? 'ru' : 'en']
    };
}

// =============== Постнатальный риск и последствия недоношенности ===============
// Ежедневный риск гибели (% в день) в зависимости от дня жизни ребёнка.
// Брекеты идут по возрастанию: until — последний день действия брекета.
// Когда ageDays > последний until (или брекет даёт 0%) — ребёнок считается выжившим.
const NEONATAL_SURVIVAL = {
    extreme: [
        { until: 3,  modern: 15, medieval: 50 },
        { until: 7,  modern: 8,  medieval: 40 },
        { until: 14, modern: 4,  medieval: 30 },
        { until: 28, modern: 2,  medieval: 20 },
        { until: 60, modern: 1,  medieval: 10 }
    ],
    very: [
        { until: 3,  modern: 3,  medieval: 22 },
        { until: 7,  modern: 1.5, medieval: 20 },
        { until: 14, modern: 0.7, medieval: 18 },
        { until: 28, modern: 0.3, medieval: 15 }
    ],
    moderate: [
        { until: 3,  modern: 0.5, medieval: 10 },
        { until: 7,  modern: 0.2, medieval: 8 },
        { until: 14, modern: 0.2, medieval: 6 },
        { until: 28, modern: 0.1, medieval: 4 }
    ],
    late: [
        { until: 3,  modern: 0.1, medieval: 1 },
        { until: 7,  modern: 0,   medieval: 0.5 },
        { until: 14, modern: 0,   medieval: 0.3 }
    ]
};

// Каталог стойких последствий для выживших крайне/глубоко недоношенных.
// name — реальное название диагноза (современность; в средневековье выводится в скобках);
// medieval — средневековая бытовая формулировка.
const OUTCOME_DEFS = {
    cp: {
        name: { ru: 'ДЦП', en: 'Cerebral palsy (CP)' },
        medieval: { ru: 'расслабленное, скованное дитя', en: 'a limp, stiff child' }
    },
    severe_delay: {
        name: { ru: 'тяжёлая задержка развития', en: 'Severe developmental delay' },
        medieval: { ru: 'отсталое в разуме дитя', en: 'a slow-minded child' }
    },
    retinopathy: {
        name: { ru: 'ретинопатия недоношенных', en: 'Retinopathy of prematurity (blindness)' },
        medieval: { ru: 'слепое отроду дитя', en: 'a child born blind' }
    },
    deafness: {
        name: { ru: 'глухота', en: 'Deafness' },
        medieval: { ru: 'глухое отроду дитя', en: 'a child born deaf' }
    },
    bpd: {
        name: { ru: 'бронхолёгочная дисплазия', en: 'Bronchopulmonary dysplasia' },
        medieval: { ru: 'одышливое, чахлое дитя', en: 'a wheezing, frail child' }
    },
    growth_delay: {
        name: { ru: 'задержка роста', en: 'Growth delay' },
        medieval: { ru: 'медленно растущее, мелкое дитя', en: 'a small, slow-growing child' }
    }
};

// Какие последствия и с каким шансом (%) бросаются по каждой категории.
// Бросок независимый по каждому пункту (могут выпасть несколько сразу).
// Для умеренно/поздне недоношенных стойких последствий не бросаем.
const POSTNATAL_OUTCOMES = {
    extreme: [
        { id: 'bpd', chance: 35 },
        { id: 'severe_delay', chance: 18 },
        { id: 'cp', chance: 12 },
        { id: 'retinopathy', chance: 7 },
        { id: 'deafness', chance: 4 }
    ],
    very: [
        { id: 'growth_delay', chance: 30 },
        { id: 'bpd', chance: 15 },
        { id: 'severe_delay', chance: 8 },
        { id: 'cp', chance: 6 },
        { id: 'deafness', chance: 2 },
        { id: 'retinopathy', chance: 2 }
    ]
};

// Возраст (дней), до которого в UI/промпте показываем детали недоношенности (факты + прогноз).
// После — ребёнок уже не «недоношенный младенец», остаются только стойкие последствия (если выпали).
export const PREMATURITY_DETAIL_DAYS = 180;

export function getDailySurvivalHazard(categoryId, ageDays, era) {
    const brackets = NEONATAL_SURVIVAL[categoryId];
    if (!brackets) return 0;
    for (const b of brackets) {
        if (ageDays <= b.until) return b[era] || 0;
    }
    return 0;
}

export function getNeonatalWindowDays(categoryId) {
    const brackets = NEONATAL_SURVIVAL[categoryId];
    if (!brackets || !brackets.length) return 0;
    return brackets[brackets.length - 1].until;
}

export function getOutcomeDefs(categoryId) {
    return POSTNATAL_OUTCOMES[categoryId] || [];
}

export function getOutcomeName(outcomeId, era, lang = 'ru') {
    const def = OUTCOME_DEFS[outcomeId];
    if (!def) return '';
    const isRu = lang === 'ru';
    const name = def.name[isRu ? 'ru' : 'en'];
    if (era === 'medieval') {
        const med = def.medieval[isRu ? 'ru' : 'en'];
        return `${med} (${name})`;
    }
    return name;
}
