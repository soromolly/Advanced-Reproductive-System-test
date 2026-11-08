// База данных и классификация преждевременных родов (Realism / OmegaVerse).
// Яйцекладка не участвует — у неё другие сроки вынашивания и инкубации.

const PREMATURITY = {
    stillbirth: {
        label: 'late miscarriage (stillbirth)',
        band: '18–21 weeks',
        facts: 'Weight under 400 g; all systems immature; no independent breathing; non-viable.',
        prognosis: {
            modern: 'Non-viable.',
            medieval: 'Non-viable.'
        }
    },
    extreme: {
        label: 'extremely premature',
        band: '22–25 weeks',
        facts: '450–750 g; dark-red translucent wrinkled skin (no subcutaneous fat); fused eyelids; soft ears; immature lungs (no surfactant) — cannot breathe independently; no suck/swallow reflexes; needs ventilator, high-humidity incubator and IV parenteral nutrition.',
        prognosis: {
            modern: '10–30% survival; high risk of cerebral palsy, retinopathy/blindness, deafness and severe developmental delay.',
            medieval: 'Survival impossible.'
        }
    },
    very: {
        label: 'very premature',
        band: '26–29 weeks',
        facts: '800–1200 g; red heavily wrinkled skin; abundant lanugo; immature lungs with apnea episodes — needs CPAP or ventilator; no suck reflex; needs incubator, nasogastric tube feeding, low light/noise.',
        prognosis: {
            modern: '80–90% survival; risk of intraventricular hemorrhage and bronchopulmonary dysplasia; frequent growth delay.',
            medieval: 'Survival <1%.'
        }
    },
    moderate: {
        label: 'moderately premature',
        band: '30–33 weeks',
        facts: '1300–2000 g; red skin, little subcutaneous fat, very thin; breathing independent but unstable with possible apnea; suck reflex weak/absent (develops by 32–34 weeks); needs incubator for thermoregulation and expressed milk via tube or bottle.',
        prognosis: {
            modern: 'Common neonatal jaundice (phototherapy) and infection risk; overall favorable.',
            medieval: 'Survival only in rare cases with ideal care and warmth.'
        }
    },
    late: {
        label: 'late premature',
        band: '34–36 weeks',
        facts: '2000–2500 g; close to full term but smaller with less subcutaneous fat; independent breathing with possible brief tachypnea; suck reflex present but tires quickly; may room in, often needs warmer or short incubator for thermoregulation.',
        prognosis: {
            modern: 'Risk of mild jaundice and slow weight gain; rapid adaptation.',
            medieval: 'High survival with warmth and a wet nurse.'
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
    return `Born at ${birthWeek} weeks (${cat.label}, ${cat.band}): ${cat.facts} Prognosis (${era}): ${cat.prognosis[era]}`;
}
