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
