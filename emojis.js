const energies = ['Energy', '[E]', '[R]', '[G]', '[B]', '[W]'];
const emojis = [
    ['Artifact', 'p_artifact:997273885995188335'],
    ['Block', 'p_block:997281211305181314'],
    ['Blur', 'p_blur:997273889950416908'],
    ['Dexterity', 'p_dexterity:997273884330037260'],
    ['Focus', 'p_focus:997273883122089994'],
    ['Frail', 'p_frail:997273897697288202'],
    ['gold', 'p_gold:997287497883193344'],
    ['Gold', 'p_gold:997287497883193344'],
    ['souls', 'p_gold:997287497883193344'],
    ['Souls', 'p_gold:997287497883193344'],
    ['Intangible', 'p_intangible:997281585177055262'],
    ['Mantra', 'p_mantra:997273892051750963'],
    ['Poison', 'p_poison:997273896237666385'],
    ['Strength', 'p_strength:997273888897642696'],
    ['temporary', 'p_temp:997273899039473724'],
    ['Temporary', 'p_temp:997273899039473724'],
    ['Thorns', 'p_thorns:997273887358337206'],
    ['Vigor', 'p_vigor:997275506749743126'],
    ['Vulnerable', 'p_vulnerable:997273894861934602'],
    ['Weak', 'p_weak:997273893402325102'],
    ['[STAR]', 'energy_star:1477661993463844875', true],
    ['hermit:Bruise', 'p_bruise:1031919239856136232'],
    ['hermit:Concentrate', 'p_concentration:1031918889065521242'],
    ['hermit:Rugged', 'p_rugged:1031918890571268116'],
    ['champ:Counter', 'p_counter:997275619337453690'],
    ['[fist_icon]', 'finisher:961810374120849418', true],
    ['gremlin:Wiz', 'p_wiz:997275808316010607'],
    ['hexamod:Soulburn', 'p_soulburn:997276073010147328'],
    ['TheBrainlets:Soulburn', 'p_soulburn:997276073010147328'],
    ['hexamod:Intensity', 'p_intensity:997274751028437022'],
    ['slimeboundmod:Potency', 'p_potency:997276392007925852'],
    ['slimeboundmod:Goop', 'p_goop:997275103463219280'],
    ['theunchainedmod:Momentum', 'Momentum:1064667335216087070'],
    ['theunchainedmod:Crushed_Armor', 'CrushedArmor:1064667253896904734'],
    ['theunchainedmod:Relay ', 'Relay:1064667209663774751'],
    ['theunchainedmod:Relay.', 'Relay:1064667209663774751'],
    ['clockworkchar:Wind_Up', 'crankywindup:1117518847717687426'],
    ['clockworkchar:Spin', 'crankyspin:1117518630561787934'],
    ['clockworkchar:Let_Go', 'crankyspin:1117518630561787934'],
    ['clockworkchar:Attune', 'crankyattune:1117519047244918924'],
    ['clockworkchar:Actuate', 'crankyattune:1117519047244918924'],
    ['clockworkchar:Proficiency', 'crankyproficiency:1117518430044692542'],
    ['clockworkchar:Part', 'crankypart:1117519374614544446'],
    ['clockworkchar:Dizzy', 'crankydizzy:1117518578149761045'],
    ['clockworkchar:Battery', 'battery:1107557955932520519'],
    ['bogwarden:Mojo', 'bogwardenmojo:1161308927993065533'],
    ['bogwarden:Maledict', 'bogwardenmaledict:1161308927007391875'],
    ['bogwarden:Spines', 'bogwardenspines:1161308929553354862'],
    ['bogwarden:Venom', 'bogwardenvenom:1161308924830564372'],
    ['[snowpunk:SnowIcon]', 'conducto_snow:1320903821869846538', true],
    ['[snowpunk:GearIcon]', 'conducto_gear:1320903832162668585', true],
];

export default function emojify(text, character) {
    text = text.replaceAll('([', '( [');
    for (let i of energies)
        text = text.replaceAll(i, character[2]);
    for (let i of emojis)
        text = text.replaceAll(i[0], i.length > 2 ? `<:${i[1]}>` : `${i[0]} <:${i[1]}>`);
    return text;
}