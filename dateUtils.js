import { MONTHS } from './translations.js';

export function normalizeYear(yearStr) {
    let y = parseInt(yearStr, 10);
    if (yearStr.length <= 2) {
        return y <= 40 ? 2000 + y : 1900 + y;
    }
    return y;
}

export function dateToDays(year, month, day) {
    return Math.floor(Date.UTC(year, month, day) / 86400000);
}

export function daysToDateString(days) {
    const d = new Date(days * 86400000);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function dateStringToDays(dateStr) {
    if (!dateStr) return null;
    const parts = String(dateStr).split('-').map(Number);
    if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null;
    return dateToDays(parts[0], parts[1] - 1, parts[2]);
}

function ruPlural(n, one, few, many) {
    const abs = Math.abs(n) % 100;
    const last = abs % 10;
    if (abs >= 11 && abs <= 19) return many;
    if (last === 1) return one;
    if (last >= 2 && last <= 4) return few;
    return many;
}

export function formatAgeFromDays(totalDays, lang = 'ru') {
    const d = Math.max(0, Math.floor(totalDays));
    const isRu = lang === 'ru';

    if (d < 30) {
        const weeks = Math.floor(d / 7);
        const days = d % 7;
        if (weeks === 0) {
            return isRu ? `${days} ${ruPlural(days, 'день', 'дня', 'дней')}` : `${days} day${days === 1 ? '' : 's'}`;
        }
        if (days === 0) {
            return isRu ? `${weeks} ${ruPlural(weeks, 'неделя', 'недели', 'недель')}` : `${weeks} week${weeks === 1 ? '' : 's'}`;
        }
        if (isRu) {
            return `${weeks} ${ruPlural(weeks, 'неделя', 'недели', 'недель')} ${days} ${ruPlural(days, 'день', 'дня', 'дней')}`;
        }
        return `${weeks} week${weeks === 1 ? '' : 's'} ${days} day${days === 1 ? '' : 's'}`;
    }

    if (d < 365) {
        const months = Math.floor(d / 30);
        const weeks = Math.floor((d % 30) / 7);
        if (isRu) {
            const m = `${months} ${ruPlural(months, 'месяц', 'месяца', 'месяцев')}`;
            if (weeks === 0) return m;
            return `${m} ${weeks} ${ruPlural(weeks, 'неделя', 'недели', 'недель')}`;
        }
        const m = `${months} month${months === 1 ? '' : 's'}`;
        if (weeks === 0) return m;
        return `${m} ${weeks} week${weeks === 1 ? '' : 's'}`;
    }

    if (d < 1095) {
        let years = Math.floor(d / 365);
        let months = Math.floor((d % 365) / 30);
        if (months >= 12) { years += 1; months -= 12; }
        if (isRu) {
            const y = `${years} ${ruPlural(years, 'год', 'года', 'лет')}`;
            if (months === 0) return y;
            return `${y} ${months} ${ruPlural(months, 'месяц', 'месяца', 'месяцев')}`;
        }
        const y = `${years} year${years === 1 ? '' : 's'}`;
        if (months === 0) return y;
        return `${y} ${months} month${months === 1 ? '' : 's'}`;
    }

    const years = Math.floor(d / 365);
    if (isRu) return `${years} ${ruPlural(years, 'год', 'года', 'лет')}`;
    return `${years} year${years === 1 ? '' : 's'}`;
}

export function formatChildAge(birthDateStr, currentDateStr, lang = 'ru') {
    const birth = dateStringToDays(birthDateStr);
    const current = dateStringToDays(currentDateStr);
    if (birth === null || current === null || current < birth) return '';
    return formatAgeFromDays(current - birth, lang);
}

export function getChildAgeDays(birthDateStr, currentDateStr) {
    const birth = dateStringToDays(birthDateStr);
    const current = dateStringToDays(currentDateStr);
    if (birth === null || current === null || current < birth) return null;
    return current - birth;
}

export function cleanHtmlFromText(text) {
    if (!text) return '';
    return text
        .replace(/<think[\s\S]*?<\/think>/gi, ' ')
        .replace(/<thought[\s\S]*?<\/thought>/gi, ' ')
        .replace(/```[\s\S]*?```/gi, ' ')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/\u00A0/g, ' ')
        .replace(/✦|★|•|\|/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

export function normalizeInputDate(val) {
    if (!val) return null;
    val = val.trim();
    const dmy = val.match(/^(\d{1,2})[\.\-\/](\d{1,2})[\.\-\/](\d{2,4})$/);
    if (dmy) {
        const d = String(parseInt(dmy[1], 10)).padStart(2, '0');
        const m = String(parseInt(dmy[2], 10)).padStart(2, '0');
        const y = String(normalizeYear(dmy[3])).padStart(4, '0');
        return `${y}-${m}-${d}`;
    }
    const ymd = val.match(/^(\d{3,4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})$/);
    if (ymd) {
        const y = String(parseInt(ymd[1], 10)).padStart(4, '0');
        const m = String(parseInt(ymd[2], 10)).padStart(2, '0');
        const d = String(parseInt(ymd[3], 10)).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
    return null;
}

export function parseRpDateFromText(rawText) {
    if (!rawText) return null;
    const text = cleanHtmlFromText(rawText);

    // 1. Поиск численного формата даты ДД.ММ.ГГГГ (07.11.2024, 07/11/2024, 07-11-2024)
    const numMatches = [...text.matchAll(/(?:\b|\D|^)(\d{1,2})[\.\-\/](\d{1,2})[\.\-\/](\d{2,4})(?:\b|\D|$)/g)];
    if (numMatches.length > 0) {
        const match = numMatches[numMatches.length - 1];
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1;
        const year = normalizeYear(match[3]);
        if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
            return { year, month, day };
        }
    }

    // 2. Поиск текстовой даты (7 ноября 2024 / 7th November 2024)
    const textMatches = [...text.matchAll(/(\d{1,2})(?:-?е|-?го|-?th|-?st|-?nd|-?rd)?\s+(?:of\s+)?([a-zA-Zа-яёА-ЯЁ]+)[,\s]+(\d{2,4})/gi)];
    if (textMatches.length > 0) {
        const match = textMatches[textMatches.length - 1];
        const day = parseInt(match[1], 10);
        const monthStr = match[2].toLowerCase();
        const year = normalizeYear(match[3]);
        if (MONTHS[monthStr] !== undefined && day >= 1 && day <= 31) {
            return { year, month: MONTHS[monthStr], day };
        }
    }

    // 3. Поиск формата ISO ГГГГ.ММ.ДД (2024-11-07)
    const isoMatches = [...text.matchAll(/(\d{3,4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/g)];
    if (isoMatches.length > 0) {
        const match = isoMatches[isoMatches.length - 1];
        const year = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1;
        const day = parseInt(match[3], 10);
        if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
            return { year, month, day };
        }
    }

    return null;
}

export function parseRelativeDaysFromText(rawText) {
    if (!rawText) return 0;
    const lower = cleanHtmlFromText(rawText).toLowerCase();

    if (/(?:прошл(?:о|а|ел|и|ели)|спустя|через)\s+(?:(?:около|примерно)\s+)?пол[\s-]?года|half\s+a\s+year\s+(?:passed|later)|after\s+half\s+a\s+year/i.test(lower)) {
        return 180;
    }

    const WORD_NUMBERS = {
        'один': 1, 'одна': 1, 'одно': 1, 'одну': 1, '1': 1,
        'два': 2, 'две': 2, 'пара': 2, 'пару': 2, '2': 2,
        'три': 3, 'четыре': 4, 'пять': 5, 'шесть': 6,
        'семь': 7, 'восемь': 8, 'девять': 9, 'десять': 10,
        'a': 1, 'an': 1, 'one': 1, 'two': 2, 'couple': 2,
        'three': 3, 'four': 4, 'five': 5, 'six': 6,
        'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
    };

    const parseCount = (rawCount) => {
        if (!rawCount) return 1;
        const cleaned = rawCount.trim().toLowerCase();
        if (/^\d+$/.test(cleaned)) return parseInt(cleaned, 10);
        if (WORD_NUMBERS[cleaned] !== undefined) return WORD_NUMBERS[cleaned];
        return 1;
    };

    const calculateDays = (count, unitStr) => {
        const u = unitStr.toLowerCase();
        if (u.startsWith('дн') || u.startsWith('day')) return count;
        if (u.startsWith('нед') || u.startsWith('week')) return count * 7;
        if (u.startsWith('мес') || u.startsWith('month')) return count * 30;
        if (u.startsWith('ле') || u.startsWith('год') || u.startsWith('year') || u.startsWith('yr')) return count * 365;
        return 0;
    };

    const ruRegex = /(?:прошл(?:о|а|ел|и|ели)|спустя|через)\s+(?:(?:около|примерно)\s+)?(\d+|од[иннаоу]+|дв[ае]|пар[ау]|три|четыре|пять|шесть|семь|восемь|девять|десять)?\s*(дне[йяа]|день|дня|недел[ьиюяе]+|месяц[аев]*|ле[тв]|год[аоу]?)/i;
    const ruMatch = lower.match(ruRegex);
    if (ruMatch) {
        const count = parseCount(ruMatch[1]);
        const days = calculateDays(count, ruMatch[2]);
        if (days > 0) return days;
    }

    const enSuffixRegex = /(\d+|a|an|one|two|couple|three|four|five|six|seven|eight|nine|ten)?\s*(day|week|month|year)s?\s+(?:passed|later)/i;
    const enSuffixMatch = lower.match(enSuffixRegex);
    if (enSuffixMatch) {
        const count = parseCount(enSuffixMatch[1]);
        const days = calculateDays(count, enSuffixMatch[2]);
        if (days > 0) return days;
    }

    const enPrefixRegex = /\b(?:after|in|past)\s+(?:about\s+)?(\d+|a|an|one|two|couple|three|four|five|six|seven|eight|nine|ten)?\s*(day|week|month|year)s?\b/i;
    const enPrefixMatch = lower.match(enPrefixRegex);
    if (enPrefixMatch) {
        const count = parseCount(enPrefixMatch[1]);
        const days = calculateDays(count, enPrefixMatch[2]);
        if (days > 0) return days;
    }

    return 0;
}
