export function deliverEntitySingleBaby(entity, method = 'natural', lang = 'ru', logFn, notifyFn) {
    if (!entity.isPregnant && entity.babiesGenders.length === 0) return;

    const rawGender = entity.babiesGenders.shift();
    if (!rawGender) {
        entity.isPregnant = false;
        entity.babiesCount = 0;
        return;
    }

    const babyDiseaseId = entity.babiesDiseases?.length > 0 ? entity.babiesDiseases.shift() : null;
    
    entity.currentDeliveredCount = (entity.currentDeliveredCount || 0) + 1;
    entity.childrenList.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        gender: rawGender,
        diseaseId: babyDiseaseId
    });
    
    entity.babiesCount = entity.babiesGenders.length;
    const displayGender = translateGender(rawGender, lang);
    const disease = babyDiseaseId ? getFetalDisease(babyDiseaseId, lang) : null;

    logFn?.(`[BIRTH] [${entity.key.toUpperCase()}] Delivered: ${rawGender} | Method: ${method} | Remaining: ${entity.babiesCount}`);

    if (entity.babiesCount === 0) {
        entity.isPregnant = false;
        entity.isDiscovered = false;
        entity.pregnancyDaysTotal = 0;
        entity.pregnancyWeeks = 0;
        entity.pregnancyDays = 0;
        entity.currentDeliveredCount = 0;
        entity.activeComplication = null;
        entity.fetalDiseaseId = null;
        entity.babiesDiseases = [];
        entity.fetalDemise = null;
        entity.fetalDemiseRolledTrimesters = { 1: false, 2: false, 3: false };
        entity.postpartumDays = 1;
        entity.deliveryMethod = method;

        const methodText = method === 'c_section' ? (lang === 'en' ? 'C-Section' : 'Кесарево сечение') : (lang === 'en' ? 'Natural' : 'Естественные роды');
        const extraNote = disease ? ` (${disease.name})` : '';
        notifyFn?.(`👶 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${lang === 'en' ? 'Delivery complete!' : 'Роды завершены!'} (${displayGender})${extraNote} [${methodText}]`, 'success');
    } else {
        const extraNote = disease ? ` (${disease.name})` : '';
        notifyFn?.(`👶 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${lang === 'en' ? 'Baby born' : 'Родился ребёнок'} (${displayGender})${extraNote}. ${lang === 'en' ? 'Remaining:' : 'Осталось:'} ${entity.babiesCount}`, 'info');
    }
}
