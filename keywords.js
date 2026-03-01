const keywords = [
    ['[E]', 'Energy'],
    ['[R]', 'Energy'],
    ['[G]', 'Energy'],
    ['[B]', 'Energy'],
    ['[W]', 'Energy'],
    ['[fist_icon]', 'finisheremoji'],
    ['champ:Combo:', 'Combo:'],
    ['slimeboundmod:Bruiser_Slime', 'Bru​iser Slime'],
    ['slimeboundmod:Bruiser', 'Bru​iser'],
];

const directKeywords = [
    'Exhaust',
    'Ethereal',
    'Echo',
    'Retain',
    'Innate',
    'Unplayable',
    'Fleeting',

    'Weak',
    'Frail',
    'Vulnerable',
    'Strength',
    'Dexterity',
    'Focus',
    'Vigor',
    'Artifact',
    'Intangible',
    'Confused',

    'Stance',
    'Scry',
    'Fetch',
    'Block',
    'Temporary HP',
    'Upgrade',
    'Fatal',
    'Transform',
    'Status',
    'Curse',
];

export default function keywordify(text, character) {
    for (let i of keywords)
        text = text.replaceAll(i[0], `**${i[1]}**`);
    for (let i of directKeywords)
        text = text.replaceAll(i, `**${i}**`);
    let lines = text.split('\n');
    for (let i in lines) {
        let words = lines[i].split(' ');
        for (let j in words) {
            let word = words[j];
            if (word.includes(':') && word.indexOf(':') != word.length-1 && !word.startsWith('**') && !word.includes('<')) //if is modded keyword
                words[j] = `**${word.slice(word.indexOf(':')+1).replaceAll('_', ' ')}**`;
        }
        lines[i] = words.join(' ');
    }
    text = lines.join('\n');
    return text;
}