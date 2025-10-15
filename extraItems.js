export default {
    "Slay the Spire" : {
        "pre": {
            "add": {
                "creatures": [
                    {
                        "name": "Spike Slime (L)",
                        "type": "Normal",
                        "minHP": "64",
                        "maxHP": "70",
                        "minHPA": "67",
                        "maxHPA": "73",
                        "id": "SpikeSlime_L",
                        "img": "/extraImages/creatures/Spike-slime-l.png"
                    },
    
                    {
                        "name": "Bronze Orb",
                        "type": "Boss",
                        "minHP": "52",
                        "maxHP": "58",
                        "minHPA": "54",
                        "maxHPA": "60",
                        "id": "BronzeOrb",
                        "img": "/extraImages/creatures/Bronze-orb.png"
                    },
    
                    {
                        "name": "Torch Head",
                        "type": "Boss",
                        "minHP": "38",
                        "maxHP": "40",
                        "minHPA": "40",
                        "maxHPA": "45",
                        "id": "TorchHead",
                        "img": "/extraImages/creatures/Torchhead.png"
                    },
    
                    {
                        "name": "Mad Gremlin",
                        "type": "Normal",
                        "minHP": "20",
                        "maxHP": "24",
                        "minHPA": "21",
                        "maxHPA": "25",
                        "id": "GremlinWarrior",
                        "img": "/extraImages/creatures/Mad-gremlin.png"
                    },
                ],

                "keywords": [
                    {
                        "name": "Ascension",
                        "description": "1. Elites spawn more often.\n2. Normal enemies are deadlier.\n3. Elites are deadlier.\n4. Bosses are deadlier.\n5. Heal less after Boss battles.\n6. Start each run damaged.\n7. Normal enemies are tougher.\n8. Elites are tougher.\n9. Bosses are tougher.\n10. Start each run cursed.\n11. Fewer Potion Slots.\n12. Upgraded cards appear less often.\n13. Poor bosses.\n14. Lower Max HP.\n15. Unfavorable Events.\n16. Shops are more costly.\n17. Normal enemies have more challenging movesets and abilities.\n18. Elites have more challenging movesets and abilities.\n19. Bosses have more challenging movesets and abilities.\n20. (Max Level) Double Boss.\n" 
                    }
                ]
            },

            "edit": {
                "creatures": [
                    /*
                    move types:
                        a - attack
                        d - debuff
                        D - debuff (large)
                        f - buff
                        b - block
                        bd - block + debuff
                        bf - block + buff
                        af - attack + buff
                        ad - attack + debuff
                        ab - attack + block
                        u - unknown
                        s - stunned
                        e - escape
                        z - sleep
                    */
                    {
                        "where": {"id": "AcidSlime_L"},
                        "to": {
                            "moves": [
                                {"type": "ad", "name": "Corrosive Spit", "description": "#r11 #b(12). Shuffles #r2 #ySlimed into your discard pile."},
                                {"type": "d", "name": "Lick", "description": "Applies #r2 #yWeak."},
                                {"type": "a", "name": "Tackle", "description": "#r16 #b(18)."},
                                {"type": "u", "name": "Split", "description": "Splits into #r2 Acid Slimes (M) with its current HP."},
                            ],
                            "description": "30%/40%/30% (40%/30%/30% on A17) chance to use Corrosive Spit/Tackle/Lick.\nWhen its HP is at or below 50%, switches its intent to Split.\nCannot use Tackle twice in a row or Corrosive Spit three times in a row. Cannot use Lick three times in a row (or twice in a row on A17)."
                        }
                    },
                    
                    {
                        "where": {"id": "AcidSlime_M"},
                        "to": {
                            "moves": [
                                {"type": "ad", "name": "Corrosive Spit", "description": "#r7 #b(8). Shuffles #r2 #ySlimed into your discard pile."},
                                {"type": "d", "name": "Lick", "description": "Applies #r1 #yWeak."},
                                {"type": "a", "name": "Tackle", "description": "#r10 #b(12)."},
                            ],
                            "description": "30%/40%/30% (40%/40%/20% on A17) chance to use Corrosive Spit/Tackle/Lick.\nCannot use Tackle twice in a row or Corrosive Spit three times in a row. Cannot use Lick three times in a row (or twice in a row on A17)."
                        }
                    },
                    
                    {
                        "where": {"id": "AcidSlime_S"},
                        "to": {
                            "moves": [
                                {"type": "d", "name": "Lick", "description": "Applies #r1 #yWeak."},
                                {"type": "a", "name": "Tackle", "description": "#r3 #b(4)."},
                            ],
                            "description": "Starts with Lick on A17, otherwise starts with a random move. Then alternates between moves."
                        }
                    },
                    
                    {
                        "where": {"id": "AwakenedOne"},
                        "to": {
                            "moves": [
                                {"type": "a", "name": "Slash", "description": "#r20."},
                                {"type": "a", "name": "Soul Strike", "description": "#r6x4."},
                                {"type": "u", "name": "Rebirth", "description": "Removes all debuffs. Removes curiosity. Heals to full. Switches to Awakened Form."},
                                {"type": "a", "name": "Dark Echo", "description": "#r40."},
                                {"type": "ad", "name": "Sludge", "description": "#r18. Shuffle #r1 #yVoid into the draw pile."},
                                {"type": "a", "name": "Tackle", "description": "#r10x3."},
                            ],
                            "description": "Whenever you play a power, gains 1 Strength (2 on A19). Starts with 2 Strength on A4. Heals 10 HP at the end of its turn (15 on A19).\nWhen killed for the first time, changes its intent to Rebirth.\nUnawakened Form: Starts with Slash. Then has a 25%/75% chance to use Soul Strike/Slash.\nCannot use Slash three times in a row or Soul Strike twice in a row.\nAwakened Form: Starts with Dark Echo. Then has a 50%/50% chance to use Tackle/Sludge.\nCannot use any move three times in a row."
                        }
                    },
                    
                    {
                        "where": {"id": "BanditBear"},
                        "to": {
                            "moves": [
                                {"type": "d", "name": "Bear Hug", "description": "Removes #r2 #b(4) #yDexterity."},
                                {"type": "ab", "name": "Lunge", "description": "#r9 #b(10) damage, #r9 #yBlock."},
                                {"type": "a", "name": "Maul", "description": "#r18 #b(20)."},
                            ],
                            "description": "Starts with Bear Hug, then alternates between Lunge and Maul."
                        }
                    },
                    
                    {
                        "where": {"id": "BookOfStabbing"},
                        "to": {
                            "moves": [
                                {"type": "a", "name": "Multi-Stab", "description": "#r6xN #b(7xN)."},
                                {"type": "a", "name": "Simgle Stab", "description": "#r21 #b(24)."},
                            ],
                            "description": "N=2 and increases by 1 when Multi-Stab is used. On A18, N=1+turn number. Whenever it deals unblocked damage, adds a Wound to your discard pile.\nHas an 85%/15% chance to use Multi-Stab/Single Stab.\nCannot use Multi-Stab 3 times in a row or Single Stab twice in a row."
                        }
                    },
                    
                    {
                        "where": {"id": "BronzeAutomaton"},
                        "to": {
                            "moves": [
                                {"type": "u", "name": "Spawn Orbs", "description": "Spawns 2 Bronze Orbs."},
                                {"type": "bf", "name": "Boost", "description": "Gains #r3 #b(4) #yStrength and #r9 #b(12) Block."},
                                {"type": "a", "name": "Flail", "description": "#r7x2 #b(8x2)."},
                                {"type": "a", "name": "HYPER BEAM", "description": "#r45 #b(50)."},
                                {"type": "s", "name": "Stunned", "description": "Nothing."},
                            ],
                            "description": "Has 3 Artifact.\nStarts with Spawn Orbs, then repeats Flail/Boost/Flail/Boost/HYPER BEAM/Stunned. On A19, Stunned is replaced with Boost."
                        }
                    },
                    
                    {
                        "where": {"id": "Byrd"},
                        "to": {
                            "moves": [
                                {"type": "f", "name": "Caw", "description": "Gains #r1 #yStrength."},
                                {"type": "a", "name": "Peck", "description": "#r1x5 #b(1x6)"},
                                {"type": "a", "name": "Swoop", "description": "#r12 #b(14)."},
                                {"type": "s", "name": "Stunned", "description": "Nothing."},
                                {"type": "a", "name": "Headbutt", "description": "#r3."},
                                {"type": "u", "name": "Fly", "description": "Starts Flying."},
                            ],
                            "description": "Starts out Flying. When Flying, it takes half as much attack damage. If hit 3 (4 on A17) times in a turn while Flying, it becomes grounded.\nFlying: On turn 1, has a 62.5%/37.5% chance to use Peck/Caw. Then, has a 50%/20%/30% chance of using Peck/Swoop/Caw.\nCannot use Peck three times in a row or use Caw or Swoop twice in a row.\nGrounded: Uses Stunned then Headbutt then Fly."
                        }
                    },
                    
                    {
                        "where": {"id": "ByrdGrounded"},
                        "to": {
                            "moves": [],
                            "description": "See Byrd."
                        }
                    },
                    
                    {
                        "where": {"id": "Centurion"},
                        "to": {
                            "moves": [
                                {"type": "a", "name": "Slash", "description": "#r12 #b(14)."},
                                {"type": "a", "name": "Fury", "description": "#r6x3 #b(7x3)."},
                                {"type": "b", "name": "Defend", "description": "#r15 #b(20) to other enemy, or self if alone."},
                            ],
                            "description": "65%/35% chance to use Slash/Defend. If Mystic is dead, uses Defend instead of Fury."
                        }
                    },
                    
                    {
                        "where": {"id": "Chosen"},
                        "to": {
                            "moves": [
                                {"type": "a", "name": "Poke", "description": "#r5x2 #b(6x2)."},
                                {"type": "a", "name": "Zap", "description": "#r18 #b(21)."},
                                {"type": "ad", "name": "Debilitate", "description": "#r10 #b(12). Applies #r2 #yVulnerable."},
                                {"type": "d", "name": "Drain", "description": "Applies #r3 #yWeak and gains #r3 #yStrength."},
                                {"type": "D", "name": "Hex", "description": "Applies Hex."},
                            ],
                            "description": "Hex - Shuffle a Dazed into your draw pile whenever you play a skill.\nStarts with Poke then Hex. On A17 starts with just Hex. Then alternates between a 50%/50% chance to use Debilitate/Drain and a 60%/40% chance of using Poke/Zap."
                        }
                    },
                    
                    {
                        "where": {"id": "CorruptHeart"},
                        "to": {
                            "moves": [
                                {"type": "D", "name": "Debilitate", "description": "Applies #r2 #yVulnerable, #yWeak, and #yFrail. Shuffles #r1 of #rEVERY status into your draw pile."},
                                {"type": "a", "name": "Blood Shots", "description": "#r2x12 #b(2x15)."},
                                {"type": "a", "name": "Echo", "description": "#r40 #b(45)."},
                                {"type": "f", "name": "Buff", "description": "Removes negative #yStrength. Gains #r2 #yStrength. Gains an extra buff based on the buff number."},
                            ],
                            "description": "Whenever you play a card, deals 1 damage (2 on A19). Caps all damage in a turn to 250 (200 on A19).\nStarts with Debilitate. Then repeats Blood Shots/Echo/Buff and Echo/Blood Shots/Buff at random.\nExtra buffs, in order: 2 Artifact, +1 to the damage dealt whenever you play a card, starts adding a Wound to your discard whenever it deals unblocked attack damage, +10 Strength, +50 Strength. Further buffs repeat the +50 Strength."
                        }
                    },
                    
                    {
                        "where": {"id": "Cultist"},
                        "to": {
                            "moves": [
                                {"type": "f", "name": "Incantation", "description": "Gains #r3 #b(4) #b(5) #yRitual."},
                                {"type": "a", "name": "Dark Strike", "description": "6."},
                            ],
                            "description": "Starts with Incantation, then repeats Dark Strike."
                        }
                    },
                    
                    {
                        "where": {"id": "Dagger"},
                        "to": {
                            "moves": [
                                {"type": "ad", "name": "Stab", "description": "#r9. Adds a #yWound to your discard pile."},
                                {"type": "a", "name": "Explode", "description": "#r25. Dies."},
                            ],
                            "description": "Uses Stab then Explode."
                        }
                    },
                    
                    {
                        "where": {"id": "Darkling"},
                        "to": {
                            "moves": [
                                {"type": "a", "name": "Nip", "description": "#rD #b(D+2)."},
                                {"type": "a", "name": "Chomp", "description": "#r8x2 #b(9x2)."},
                                {"type": "b", "name": "Harden", "description": "#r12. #b(Gains 2 #yStrength)."},
                                {"type": "u", "name": "Regrow", "description": "Nothing."},
                                {"type": "f", "name": "Reincarnate", "description": "Revives with 50% HP."},
                            ],
                            "description": "D is a random number chosen between 7 and 11 for each darkling that does not change.\nMiddle Darkling: 50%/50% chance to use Nip/Harden.\nSide Darklings: Same pattern as the middle Darkling on turn 1, then has a 30%/40%/30% chance to use Nip/Chomp/Harden.\nCannot use Harden or Chomp twice in a row, or Nip three times in a row.\nWhen killed, if there are other Darklings alive, uses Regrow then Reincarnate.\nDespite not being a \"minion\" enemy, Fatal effects used on Darklings will not trigger unless there are no other darklings alive."
                        }
                    },
                    
                    {
                        "where": {"id": "Deca"},
                        "to": {
                            "moves": [
                                {"type": "b", "name": "Square of Protection", "description": "#r16 to all enemies. #b(Applies #r3 #bPlated #bArmor #bto #ball #benemies.)"},
                                {"type": "ad", "name": "Beam", "description": "#r10x2 #b(12x2). Adds #r2 #yDazed to your discard pile."},
                            ],
                            "description": "Has 2 (3 on A19) Artifact.\nRepeats Square of Protection/Beam."
                        }
                    },
                    
                    {
                        "where": {"id": "Donu"},
                        "to": {
                            "moves": [
                                {"type": "f", "name": "Circle of Power", "description": "Applies #r3 #yStrength to all enemies."},
                                {"type": "a", "name": "Beam", "description": "#r10x2 #b(12x2)."},
                            ],
                            "description": "Has 2 (3 on A19) Artifact.\nRepeats Beam/Circle of Power."
                        }
                    },
                    
                    {
                        "where": {"id": "Exploder"},
                        "to": {
                            "moves": [
                                {"type": "a", "name": "Slam", "description": "#r9 #b(11)."},
                                {"type": "u", "name": "Explode", "description": "Deals 30 non-attack damage. Dies."},
                            ],
                            "description": "Uses Slam then Slam then Explode."
                        }
                    },
                    
                    {
                        "where": {"id": "GremlinFat"},
                        "to": {
                            "moves": [
                                {"type": "ad", "name": "Smash", "description": "#r4 #b(5). Applies #r1 #yWeak #b(And #yFrail)."},
                            ],
                            "description": "Repeats Smash."
                        }
                    },
                    
                    {
                        "where": {"id": "FungiBeast"},
                        "to": {
                            "moves": [
                                {"type": "a", "name": "Bite", "description": "#r6."},
                                {"type": "f", "name": "Grow", "description": "Gains #r3 #b(4) #b(5) #yStrength."},
                            ],
                            "description": "Applies 2 Vulnerable on death.\n60%/40% to use Bite/Grow. Cannot use Bite three times in a row or Grow twice in a row."
                        }
                    },
                    
                    {
                        "where": {"id": "GiantHead"},
                        "to": {
                            "moves": [
                                {"type": "a", "name": "Count", "description": "#r13."},
                                {"type": "d", "name": "Glare", "description": "Applies #r1 #yWeak."},
                                {"type": "a", "name": "It Is Time", "description": "#r30 #b(40). Increases the damage of It Is Time by 5."},
                            ],
                            "description": "For the first 4 (3 on A18) turns, has a 50%/50% chance of using Count/Glare, then repeats It Is Time.\nCannot use Count or Glare three times in a row.\nIt Is Time's damage cannot be increased by more than a total of 30."
                        }
                    },
                    
                    {
                        "where": {"id": "GremlinLeader"},
                        "to": {
                            "moves": [
                                {"type": "bf", "name": "Encourage", "description": "#r6 #b(10) to other enemies. Applies #r3 #b(4) #b(5) #yStrength to all enemies."},
                                {"type": "a", "name": "Stab", "description": "#r6x3."},
                                {"type": "u", "name": "Rally!", "description": "Summon #r2 random Gremlins."},
                            ],
                            "description": "Starts combat with the effects of Rally!\nWith 0 minions: Has a 75%/25% chance to use Rally!/Stab.\nWith 1 minion: If the last move was Encourage, has a 50%/50% chance to use Rally!/Stab. If the last move was Stab, has a 62.5%/37.5% chance to use Rally!/Encourage.\nWith 2+ minions: Has a 67%/33% chance to use Encourage/Stab.\nCannot use any of its move twice in a row."
                        }
                    },
                    
                    {
                        "where": {"id": "GremlinNob"},
                        "to": {
                            "moves": [
                                {"type": "f", "name": "Bellow", "description": "Gains #r2 #b(3) Enrage."},
                                {"type": "ad", "name": "Skull Bash", "description": "#r6 #b(8). Applies #r2 #yVulnerable."},
                                {"type": "a", "name": "Rush", "description": "#r14 #b(16)."},
                            ],
                            "description": "Enrage - Gains Strength whenever you play a skill.\nStarts with Bellow. Then, has a 33%/67% chance to use Skull Bash/Rush, or, if on A18, repeats Skull Bash/Rush/Rush.\nCannot use Rush 3 times in a row."
                        }
                    },
                    
                    {
                        "where": {"id": "GremlinWizard"},
                        "to": {
                            "moves": [
                                {"type": "u", "name": "Charging", "description": "Nothing."},
                                {"type": "a", "name": "Ultimate Blast", "description": "#r25 #b(30)."},
                            ],
                            "description": "Repeats Charging/Charging/Ultimate Blast. On A17, uses Charging for the first 2 turns then repeats Ultimate Blast."
                        }
                    },
                    
                    {
                        "where": {"id": "Hexaghost"},
                        "to": {
                            "moves": [
                                {"type": "u", "name": "Activate", "description": "Nothing."},
                                {"type": "a", "name": "Divider", "description": "#rHx6."},
                                {"type": "ad", "name": "Sear", "description": "#r6. Adds #r1 #b(2) #yBurn(s) to your discard pile."},
                                {"type": "a", "name": "Tackle", "description": "#r5x2 #b(6x2)."},
                                {"type": "bf", "name": "Inflame", "description": "12. Gains #r2 #b(3) #yStrength."},
                                {"type": "a", "name": "Inferno", "description": "#r2x6 #b(3x6). Upgrades ALL current and future #yBurns. Adds 3 #yBurns to your discard pile."},
                            ],
                            "description": "H=Current Player HP / 12 + 1.\nStarts with Activate and Divider, then repeats Sear/Tackle/Sear/Inflame/Tackle/Sear/Inferno."
                        }
                    },
                    
                    {
                        "where": {"id": "JawWorm"},
                        "to": {
                            "moves": [
                                {"type": "a", "name": "Chomp", "description": "#r11 #b(12)."},
                                {"type": "ab", "name": "Thrash", "description": "#r7 damage, #r5 #yBlock."},
                                {"type": "bf", "name": "Bellow", "description": "#r6 #b(9). Gains #r3 #b(4) #b(5) #yStrength."},
                            ],
                            "description": "Starts with Chomp. Then has a 45%/30%/25% chance of using Bellow/Thrash/Chomp. Cannot use Bellow or Chomp twice in a row, or Thrash three times in a row.\nIn the act 3 encounter of 3 Jaw Worms, they start combat with the effects of Bellow."
                        }
                    },
                    
                    {
                        "where": {"id": "Lagavulin"},
                        "to": {
                            "moves": [
                                {"type": "z", "name": "Sleep", "description": "Nothing."},
                                {"type": "s", "name": "Wake", "description": "Loses #g8 Metallicize."},
                                {"type": "a", "name": "Attack", "description": "#r18 #b(20)."},
                                {"type": "D", "name": "Siphon Soul", "description": "Removes #r1 #b(2) #yStrength and #yDexterity."},
                            ],
                            "description": "Starts with 8 Block and Metallicize.\nUses Sleep for the first 2 turns, then uses Wake. If it loses HP while Sleeping, it changes its intent to Wake. After using Wake, it repeats Attack/Attack/Siphon Soul."
                        }
                    },
                    
                    {
                        "where": {"id": "LagavulinAwake"},
                        "to": {
                            "moves": [],
                            "description": "See Lagavulin."
                        }
                    },
                    
                    {
                        "where": {"id": "Looter"},
                        "to": {
                            "moves": [
                                {"type": "a", "name": "Mug", "description": "#r10 #b(11)."},
                                {"type": "a", "name": "Lunge", "description": "#r12 #b(14)."},
                                {"type": "b", "name": "Smoke Bomb", "description": "#r6."},
                                {"type": "e", "name": "Escape", "description": "Escape."},
                            ],
                            "description": "Steals 15 (20 on A17) gold whenever it attacks. If killed before it manages to Escape, all stolen gold is added to the post-combat rewards.\nStarts with Mug then Mug. Then, has a 50%/50% chance to use Lunge then Smoke Bomb, or immediately use Smoke Bomb. Then, uses Escape."
                        }
                    },
                    
                    {
                        "where": {"id": "FuzzyLouseDefensive"},
                        "to": {
                            "moves": [
                                {"type": "a", "name": "Bite", "description": "#rD #b(D+1)."},
                                {"type": "d", "name": "Spit Web", "description": "Applies #r2 #yWeak."},
                            ],
                            "description": "D is a random number chosen between 5 and 7 for each louse that does not change. Gains 3-7 (4-8 on A7, 9-12 on A17) Block the first time it's hit.\nHas a 25%/75% chance to use Spit Web/Bite.\nCannot use Bite or Spit Web three times in a row. On A17, cannot use Spit Web twice in a row."
                        }
                    },
                    
                    {
                        "where": {"id": "FuzzyLouseNormal"},
                        "to": {
                            "moves": [
                                {"type": "a", "name": "Bite", "description": "#rD #b(D+1)."},
                                {"type": "f", "name": "Grow", "description": "Gains #r3 #b(4) #yStrength."},
                            ],
                            "description": "D is a random number chosen between 5 and 7 for each louse that does not change. Gains 3-7 (4-8 on A7, 9-12 on A17) Block the first time it's hit.\nHas a 25%/75% chance to use Grow/Bite.\nCannot use Bite or Grow three times in a row. On A17, cannot use Grow twice in a row."
                        }
                    },
                    
                    {
                        "where": {"id": "Mugger"},
                        "to": {
                            "moves": [
                                {"type": "a", "name": "Mug", "description": "#r10 #b(11)."},
                                {"type": "a", "name": "Lunge", "description": "#r16 #b(18)."},
                                {"type": "b", "name": "Smoke Bomb", "description": "#r11 #b(17)."},
                                {"type": "e", "name": "Escape", "description": "Escape."},
                            ],
                            "description": "Steals 15 (20 on A17) gold whenever it attacks. If killed before it manages to Escape, all stolen gold is added to the post-combat rewards.\nStarts with Mug then Mug. Then, has a 50%/50% chance to use Lunge then Smoke Bomb, or immediately use Smoke Bomb. Then, uses Escape."
                        }
                    },
                    
                    {
                        "where": {"id": "Healer"},
                        "to": {
                            "moves": [
                                {"type": "ad", "name": "Attack", "description": "#r8 #b(9). Applies #r2 #yFrail."},
                                {"type": "f", "name": "Heal", "description": "Heals all enemies for #r16 #b(20)."},
                                {"type": "f", "name": "Buff", "description": "Applies #r2 #b(3) #b(4) #yStrength to all enemies."},
                            ],
                            "description": "If the total amount of HP that the enemy team is missing is at least 16 (21 if A17), will use Heal. Otherwise has a 40%/60% chance to use Buff/Heal.\nCannot use any move three times in a row. On A17, cannot use Attack twice in a row."
                        }
                    },
                    
                    {
                        "where": {"id": "Nemesis"},
                        "to": {
                            "moves": [
                                {"type": "d", "name": "Debuff", "description": "Adds #r3 #b(5) #yBurns to your discard pile."},
                                {"type": "a", "name": "Attack", "description": "#r6x3 #b(7x3)/"},
                                {"type": "a", "name": "Scythe", "description": "#r45."},
                            ],
                            "description": "Has Intangible on even-numbered turns.\nHas a 35%/35%/30% chance to use Debuff/Attack/Scythe, but cannot use Scythe on turn 1.\nCannot use attack three times in a row, or use Debuff or Scythe twice in a row.\nBoot fearer."
                        }
                    },
                    
                    {
                        "where": {"id": "Orb Walker"},
                        "to": {
                            "moves": [
                                {"type": "ad", "name": "Laser", "description": "#r10 #b(11). Shuffles a #yBurn into your draw pile. Adds a #yBurn to your discard pile."},
                                {"type": "a", "name": "Claw", "description": "#r15 #b(16)."},
                            ],
                            "description": "Gains 3 (5 on A17) Strength at the end of its turn.\nHas a 60%/40% chance to use Laser/Claw.\nCannot use either move three times in a row."
                        }
                    },
                    
                    {
                        "where": {"id": "BanditChild"},
                        "to": {
                            "moves": [
                                {"type": "a", "name": "Attack", "description": "#r5x2 #r(6x2)."},
                            ],
                            "description": "Repeats Attack."
                        }
                    },
                    
                    {
                        "where": {"id": "Reptomancer"},
                        "to": {
                            "moves": [
                                {"type": "u", "name": "Summon", "description": "Summons #r1 #b(2) #yDagger(s)."},
                                {"type": "ad", "name": "Snake Strike", "description": "#r13x2 #b(16x2). Applies #r1 #yWeak."},
                                {"type": "a", "name": "Big Bite", "description": "#r30 #b(34)."},
                            ],
                            "description": "Starts with 2 daggers.\nStarts with Summon. Then, has a 33%/33%/33% chance to use Summon/Snake Strike/Big Bite, or if there are 4 daggers, has a 67%/33% chance to use Snake Strike/Big Bite.\nCannot use Summon three times in a row, or use Snake Strike or Big Bite twice in a row."
                        }
                    },
                    
                    {
                        "where": {"id": "Repulsor"},
                        "to": {
                            "moves": [
                                {"type": "a", "name": "Bash", "description": "#r11 #b(13)."},
                                {"type": "d", "name": "Repulse", "description": "Shuffles #r2 #yDazed into your draw pile."},
                            ],
                            "description": "Has a 20%/80% chance to use Bash/Repulse.\nCannot use Bash twice in a row."
                        }
                    },
                    
                    {
                        "where": {"id": "BanditLeader"},
                        "to": {
                            "moves": [
                                {"type": "u", "name": "Mock", "description": "Nothing."},
                                {"type": "ad", "name": "Agonizing Slash", "description": "#r10 #r(12). Applies #r2 #r(3) #yWeak."},
                                {"type": "a", "name": "Cross Slash", "description": "#r15 #r(17)."},
                            ],
                            "description": "Starts with Mock, then repeats Agonizing Slash/Cross Slash (Agonizing Slash/Cross Slash/Cross Slash on A17)."
                        }
                    },
                    
                    {
                        "where": {"id": "Sentry"},
                        "to": {
                            "moves": [
                                {"type": "a", "name": "Beam", "description": "#r9 #b(10)."},
                                {"type": "d", "name": "Bolt", "description": "Adds #r2 #b(3) #yDazed to your discard pile."},
                            ],
                            "description": "Has 1 Artifact.\nWhen starting between two other sentries, repeats Beam/Bolt, otherwise repeats Bolt/Beam."
                        }
                    },
                    
                    {
                        "where": {"id": "Shelled Parasite"},
                        "to": {
                            "moves": [
                                {"type": "ad", "name": "Fell", "description": "#r18 #b(21). Applies #r2 #yFrail."},
                                {"type": "a", "name": "Double Strike", "description": "#r6x2 #b(7x2)."},
                                {"type": "af", "name": "Suck", "description": "#r10 #b(12). Heals HP equal to unblocked damage dealt."},
                                {"type": "s", "name": "Stun", "description": "Nothing."},
                            ],
                            "description": "Starts with 14 Block and Plated Armor.\nStarts with a 50%/50% chance to use Suck/Double Strike. On A17 starts with Fell. Then, has a 40%/40$/20% chance to use Double Strike/Suck/Fell. If its Plated Armor is reduced to 0, sets its intent to Stun.\nCannot use Double Strike or Suck three times in a row, or Fell twice in a row."
                        }
                    },
                    
                    {
                        "where": {"id": "GremlinTsundere"},
                        "to": {
                            "moves": [
                                {"type": "b", "name": "Protect", "description": "#r7 #b(8) #b(11) to a random other enemy, or self if alone."},
                                {"type": "a", "name": "Shield Bash", "description": "#r6 #b(8)."},
                            ],
                            "description": "Repeats Protect until no other enemies are alive, then repeats Shield Bash."
                        }
                    },
                    
                    {
                        "where": {"id": "SlaverBlue"},
                        "to": {
                            "moves": [
                                {"type": "a", "name": "Stab", "description": "#r12 #b(13)."},
                                {"type": "ad", "name": "Rake", "description": "#r7 #b(8). Applies #r1 #b(2) #yWeak."},
                            ],
                            "description": "Has a 40%/60% chance to use Rake/Stab.\nCannot use any move 3 times in a row. On A17, cannot use Rake twice in a row."
                        }
                    },
                    
                    {
                        "where": {"id": "SlaverRed"},
                        "to": {
                            "moves": [
                                {"type": "a", "name": "Stab", "description": "#r13 #b(14)."},
                                {"type": "ad", "name": "Scrape", "description": "#r8 #b(9). Applies #r1 #b(2) #Vulnerable."},
                                {"type": "D", "name": "Entangle", "description": "Stops the player from playing attacks for #r1 turn."},
                            ],
                            "description": "Starts with Stab. Then, repeats Scrape/Scrape/Stab (Scrape/Stab on A17) with a 25% chance replace Entangle as any move. After Entangle is used, has a 55%/45% chance to use Scrape/Stab.\nCannot use any move 3 times in a row. On A17, cannot use Scrape twice in a row."
                        }
                    },
                    
                    {
                        "where": {"id": "SlimeBoss"},
                        "to": {
                            "moves": [
                                {"type": "D", "name": "Goop Spray", "description": "Adds #r3 #b(5) #ySlimed to your discard pile."},
                                {"type": "u", "name": "Preparing", "description": "Nothing."},
                                {"type": "a", "name": "Slam", "description": "#r35 #b(38)."},
                                {"type": "u", "name": "Split", "description": "Splits into an Acid Slime (L) and a Spike Slime (L) with its current HP."},
                            ],
                            "description": "Repeats Goop Spray/Preparing/Slam. When its HP is at or below 50%, switches its intent to Split."
                        }
                    },
                    
                    {
                        "where": {"id": "SnakePlant"},
                        "to": {
                            "moves": [
                                {"type": "a", "name": "Chomp", "description": "#r7x3 #b(8x3)."},
                                {"type": "D", "name": "Enfeebling Spores", "description": "Applies #r2 #yFrail and #yWeak."},
                            ],
                            "description": "Starts with 3 Malleable - Gains block when attacked and increases that block by 1. Resets to 3 at the start of its turn.\nHas a 65%/35% chance to use Chomp/Enfeebling Spores. On A17, after using Enfeebling Spores for the first time, repeats Chomp/Chomp/Enfeebling Spores.\nCannot use Chomp three times in a row or Enfeebling Spores twice in a row."
                        }
                    },
                    
                    {
                        "where": {"id": "GremlinThief"},
                        "to": {
                            "moves": [
                                {"type": "a", "name": "Puncture", "description": "#r9 #b(10)."},
                            ],
                            "description": "Repeats Puncture."
                        }
                    },
                    
                    {
                        "where": {"id": "Snecko"},
                        "to": {
                            "moves": [
                                {"type": "D", "name": "Perplexing Glare", "description": "Applies #yConfused."},
                                {"type": "a", "name": "Tail Whip", "description": "#r8 #b(10). Applies #r2 #yVulnerable #b(and #yWeak)"},
                                {"type": "a", "name": "Bite", "description": "#r15 #b(18)."},
                            ],
                            "description": "Starts with Perplexing Glare. Then, has a 60%/40% chance to use Bite/Tail Whip.\nCannot use Bite 3 times in a row."
                        }
                    },
                    
                    {
                        "where": {"id": "SphericGuardian"},
                        "to": {
                            "moves": [
                                {"type": "b", "name": "Activate", "description": "#r25 #b(35)."},
                                {"type": "ad", "name": "Attack", "description": "#r10 #b(11). Apply #r5 #yFrail."},
                                {"type": "a", "name": "Slam", "description": "#r10x2 #b(11x2)."},
                                {"type": "ab", "name": "Harden", "description": "#r10 #b(11) damage, #r15 #yBlock."},
                            ],
                            "description": "Has 3 Artifact, 40 Block, and the effects of Barricade.\nStarts with Activate then Attack. Then, repeats Slam/Harden."
                        }
                    },
                    
                    {
                        "where": {"id": "SpikeSlime_L"},
                        "to": {
                            "moves": [
                                {"type": "ad", "name": "Flame Tackle", "description": "#r16 #b(18). Shuffles #r2 #ySlimed into your discard pile."},
                                {"type": "d", "name": "Lick", "description": "Applies #r2 #Frail."},
                                {"type": "u", "name": "Split", "description": "Splits into #r2 Acid Slimes (M) with its current HP."},
                            ],
                            "description": "30%/70% chance to use Flame Tackle/Lick.\nWhen its HP is at or below 50%, switches its intent to Split.\nCannot use any move three times in a row. Cannot use Lick twice in a row on A17."
                        }
                    },
                    
                    {
                        "where": {"id": "SpikeSlime_M"},
                        "to": {
                            "moves": [
                                {"type": "ad", "name": "Flame Tackle", "description": "#r8 #b(10). Shuffles #r2 #ySlimed into your discard pile."},
                                {"type": "d", "name": "Lick", "description": "Applies #r1 #yFrail."},
                            ],
                            "description": "30%/70% chance to use Flame Tackle/Lick.\nCannot use either move three times in a row. Cannot use Lick twice in a row on A17."
                        }
                    },
                    
                    {
                        "where": {"id": "SpikeSlime_S"},
                        "to": {
                            "moves": [
                                {"type": "a", "name": "Tackle", "description": "#r5 #b(6)."},
                            ],
                            "description": "Repeats Tackle."
                        }
                    },
                    
                    {
                        "where": {"id": "Spiker"},
                        "to": {
                            "moves": [
                                {"type": "a", "name": "Cut", "description": "#r7 #b(9)."},
                                {"type": "f", "name": "Spike", "description": "Gains #r2 #yThorns."},
                            ],
                            "description": "Starts with 3 (4 on A2 and 7 on A17) Thorns.\nHas a 50%/50% chance to use Cut/Spike. Can only use Spike 6 times.\nCannot use Cut twice in a row, unless Spike has reached its maximum uses."
                        }
                    },
                    
                    {
                        "where": {"id": "Serpent"},
                        "to": {
                            "moves": [
                                {"type": "D", "name": "Constrict", "description": "Applies #r10 #b(12) Constricted."},
                                {"type": "a", "name": "Quick Tackle", "description": "#r16 #b(18)."},
                                {"type": "a", "name": "Smash", "description": "#r22 #b(25)."},
                            ],
                            "description": "Constrict - At the end of your turn, take damage.\nIf the player is Constricted or if Constrict was used last turn, has a 50%/50% chance to use Quick Tackle/Smash. Otherwise, has a 50%/50% (100%/0% on A17) chance to use Constrict/Quick Tackle."
                        }
                    },
                    
                    {
                        "where": {"id": "SpireShield"},
                        "to": {
                            "moves": [
                                {"type": "b", "name": "Bash", "description": "#r30 to all enemies."},
                                {"type": "ad", "name": "Fortify", "description": "#r12 #b(14). Removes #r1 #yStrength."},
                                {"type": "ab", "name": "Smash", "description": "#r34 #b(38). Gains #yBlock equal to damage dealt #b(99)."},
                            ],
                            "description": "Has 1 (2 on A18) Artifact. Deals +50% damage from behind.\nIf the player has any Orb slots, the Strength removal has a 50% chance to be replaced with 1 Focus removal.\nRepeats Bash/Fortify/Smash and Fortify/Bash/Smash at random."
                        }
                    },
                    
                    {
                        "where": {"id": "SpireSpear"},
                        "to": {
                            "moves": [
                                {"type": "ad", "name": "Burn Strike", "description": "#r5x2 #b(6x2). Adds #r2 #yBurns to your discard #b(the top of your draw) pile."},
                                {"type": "f", "name": "Piercer", "description": "Applies #r2 #yStrength to all enemies."},
                                {"type": "a", "name": "Skewer", "description": "#r10x3 #b(10x4)."},
                            ],
                            "description": "Has 1 (2 on A18) Artifact. Deals +50% damage from behind.\nStarts with Burn Strike. Then, repeats Skewer/Burn Strike/Piercer and Skewer/Piercer/Burn Strike at random."
                        }
                    },
                    
                    {
                        "where": {"id": "SlaverBoss"},
                        "to": {
                            "moves": [
                                {"type": "ad", "name": "Scouring Whip", "description": "#r7. Adds #r1 #b(2) #b(3) #yWound(s) to your discard pile. #b(Gains #r1 #yStrength.)"},
                            ],
                            "description": "Repeats Scouring Whip."
                        }
                    },
                    
                    {
                        "where": {"id": "Champ"},
                        "to": {
                            "moves": [
                                {"type": "bf", "name": "Defensive Stance", "description": "#r15 #b(18) #b(20). Gains #r5 #b(6) #b(7) Metallicize."},
                                {"type": "ad", "name": "Face Slap", "description": "#r12 #b(14). Applies #r2 #yFrail and #yVulnerable."},
                                {"type": "d", "name": "Taunt", "description": "Applies #r2 #yWeak and #yVulnerable."},
                                {"type": "a", "name": "Heavy Slash", "description": "#r16 #b(18)."},
                                {"type": "f", "name": "Gloat", "description": "Gains #r2 #b(3) #b(4) #yStrength."},
                                {"type": "f", "name": "Anger", "description": "Removes all debuffs. Gains #r6 #b(9) #b(12) #yStrength."},
                                {"type": "af", "name": "Execute", "description": "#r10x2."},
                            ],
                            "description": "Uses Taunt every 4 turns. Otherwise, has a 15%/15%/25%/45% chance to use Defensive Stance/Gloat/Face Slap/Heavy Slash. On A19, Gloat is replaced with Defensive Stance, if it can be used.\nAfter its HP is reduced below 50%, uses Anger then repeats Execute/Move as normal/Move as normal.\nCannot use any move twice in a row. Cannot use Defensive Stance more than twice per combat."
                        }
                    },
                    
                    {
                        "where": {"id": "TheCollector"},
                        "to": {
                            "moves": [
                                {"type": "u", "name": "Spawn", "description": "Spawns Torch Heads until there are #r2."},
                                {"type": "a", "name": "Fireball", "description": "#r18 #b(21)."},
                                {"type": "bf", "name": "Buff", "description": "#r15 #b(18) #b(23). Applies #r3 #b(4) #b(5) #yStrength to all enemies."},
                                {"type": "D", "name": "YOU ARE MINE", "description": "Applies #r3 #b(5) #yWeak, #yVulnerable, and #yFrail."},
                            ],
                            "description": "Starts with Spawn. Uses YOU ARE MINE on turn 4. Otherwise, has a 25%/45%/30% chance to use Spawn/Fireball/Buff.\nCannot use Spawn if there are 2 Torch Heads (uses Fireball instead). Cannot use Buff twice in a row or Fireball three times in a row."
                        }
                    },
                    
                    {
                        "where": {"id": "TheGuardian"},
                        "to": {
                            "moves": [
                                {"type": "b", "name": "Charging Up", "description": "#r9."},
                                {"type": "a", "name": "Fierce Bash", "description": "#r32 #b(36)."},
                                {"type": "D", "name": "Vent Steam", "description": "Applies #r2 #yVulnerable and #yWeak."},
                                {"type": "a", "name": "Whirlwind", "description": "#r5x4."},
                                {"type": "f", "name": "Defending...", "description": "Gains #r3 #b(4) Sharp Hide."},
                                {"type": "a", "name": "Roll Attack", "description": "#r9 #b(10)."},
                                {"type": "af", "name": "Twin Slam", "description": "#r8x2. Removes Sharp Hide. Switches to Offensive Mode."},
                            ],
                            "description": "Sharp Hide - Whenever you play an attack, take damage. Has Mode Shift 30 (35 on A9, 40 on A19), which reduces by unblocked damage dealt. When it reaches 0, switches to Defensive Mode. Starts in Offensive Mode.\nOffensive Mode: Repeats Charging Up/Fierce Bash/Vent Steam/Whirlwind. Starts with Whirlwind when coming out of Defensive Mode.\nDefensive Mode: Uses Defending... then Roll Attack then Twin Slam."
                        }
                    },
                    
                    {
                        "where": {"id": "Maw"},
                        "to": {
                            "moves": [
                                {"type": "D", "name": "Roar", "description": "Applies #r3 #b(5) #yWeak and #yFrail."},
                                {"type": "f", "name": "Slam", "description": "#r25 #b(30)."},
                                {"type": "a", "name": "Nom", "description": "#r5xT."},
                                {"type": "a", "name": "Drool", "description": "Gains #r3 #b(5) #yStrength."},
                            ],
                            "description": "T=turn number / 2, rounded up.\nStarts with Roar. After using Roar or Drool, has a 50%/50% chance to use Slam/Nom. After using Slam, has a 50%/50% chance to use Drool/Nom. After using Nom, uses Drool."
                        }
                    },
                    
                    {
                        "where": {"id": "TimeEater"},
                        "to": {
                            "moves": [
                                {"type": "a", "name": "Reverbrate", "description": "#r7x3 #b(8x3)."},
                                {"type": "a", "name": "Head Slam", "description": "#r26 #b(32). Reduces draw by #r1 for the next #r2 turns. #b(Adds #r2 #ySlimed #bto #byour #bdiscard #bpile.)"},
                                {"type": "bd", "name": "Ripple", "description": "#r20. Applies #r1 #yVulnerable, #yWeak #b(and #yFrail)."},
                                {"type": "f", "name": "Haste", "description": "Removes all debuffs. Heals to 50% HP."},
                            ],
                            "description": "For each 12 cards you play, ends your turn and gains 2 Strength.\nIf its HP is below 50%, uses Haste. Otherwise, has a 20%/45%/35% chance to use Ripple/Reverbrate/Head Slam.\nCannot use Ripple or Head Slam twice in a row, or Reverbrate three times in a row. Can only use Haste once per combat."
                        }
                    },
                    
                    {
                        "where": {"id": "Transient"},
                        "to": {
                            "moves": [
                                {"type": "a", "name": "Attack", "description": "#r30 #b(40). Increases the damage of Attack by #r10."},
                            ],
                            "description": "Dies after 5 (6 if A17) turns. When attacked, loses Strength equal to damage taken. Gains that Strength back at the end of its turn.\nRepeats Attack."
                        }
                    },
                    
                    {
                        "where": {"id": "WrithingMass"},
                        "to": {
                            "moves": [
                                {"type": "ab", "name": "Flail", "description": "#r15 #b(16) damage, #r16 #b(18) #yBlock."},
                                {"type": "ad", "name": "Wither", "description": "#r10 #b(12). Applies #b2 #yWeak and #yVulnerable."},
                                {"type": "a", "name": "Multi-Strike", "description": "#r7x3 #b(9x3)."},
                                {"type": "a", "name": "Strong Strike", "description": "#r32 #b(38)."},
                                {"type": "D", "name": "Implant", "description": "Permanently adds a #yParasite to your deck."},
                            ],
                            "description": "When attacked, changes its intent. Starts with 3 Malleable - Gains block when attacked and increases that block by 1. Resets to 3 at the start of its turn.\nIts starting move has an equal chance to be any move but Implant. Future moves have a 10%/30%/20%/30%/10% chance to be Implant/Flail/Wither/Multi-Strike/Strong Strike.\nCan only use Implant once per combat."
                        }
                    },
                    
                    {
                        "where": {"id": "BronzeOrb"},
                        "to": {
                            "moves": [
                                {"type": "D", "name": "Stasis", "description": "Steals the rarest card in the draw pile, or from the discard pile if the draw pile is empty."},
                                {"type": "a", "name": "Beam", "description": "#r8."},
                                {"type": "b", "name": "Support Beam", "description": "#r12 to Bronze Automaton."},
                            ],
                            "description": "When killed, adds the card taken from Stasis to your hand.\nHas a 75%/7.5%/17.5% chance to use Stasis/Beam/Support Beam.\nCan only use Stasis once per combat. Cannot use any move 3 times in a row."
                        }
                    },
                    
                    {
                        "where": {"id": "TorchHead"},
                        "to": {
                            "moves": [
                                {"type": "a", "name": "Tackle", "description": "#r7."},
                            ],
                            "description": "Repeats Tackle."
                        }
                    },
                    
                    {
                        "where": {"id": "GremlinWarrior"},
                        "to": {
                            "moves": [
                                {"type": "a", "name": "Scratch", "description": "#r4 #b(5)."},
                            ],
                            "description": "Gains 1 (2 on A17) Strength when hit."
                        }
                    }
                ]
            }
        },
    
        "post": {
            "add": {
                "events": [
                    {
                        "name": "Ominous Forge",
                        "acts": [1, 2, 3],
                        "options": [
                            ["Tinker", "automaton only", "g/Upgrade 3 Random Cards with Encode."],
                            ["Tinker", "guardian only - have a card with sockets", "g/Add a socket to any socketed card."],
                            ["Forge", null, "g/Upgrade a card in your deck."],
                            ["Rummage", null, "g/Obtain a special Relic. r/Become Cursed - Pain."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Pleading Vagrant",
                        "acts": [2],
                        "options": [
                            ["Offer Gold", "requires 85 gold", "y/85 Gold: g/Obtain a Relic."],
                            ["Rob", null, "g/Obtain a Relic. r/Become Cursed - Shame."],
                            ["Leave", "", ""]
                        ]
                    },
            
                    {
                        "name": "Ancient Writing",
                        "acts": [2],
                        "options": [
                            ["Elegance", null, "g/Remove a card from your deck."],
                            ["Simplicity", null, "g/Upgrade all Strikes and Defends."],
                            ["Unification", "automaton only", "All g/Strikes n/and g/Defends n/gain g/Encode."],
                            ["Intuition", "champ only", "g/Add y/'trigger Skill Bonus.' n/to all g/Strikes n/and g/Defends."],
                            ["Caprice", "gremlins only", "g/Replace n/all g/Strikes n/and g/Defends n/with g/Shivs n/and g/Wards."],
                            ["Endurance", "guardian only", "g/Add Brace 2 n/to all g/Strikes n/and g/Defends."],
                            ["Wistfulness", "hexaghost only", "g/Add Ethereal n/to all g/Strikes n/and g/Defends."],
                            ["Inspiration", "slime boss only", "g/Add Command n/to all g/Strikes n/and g/Defends."],
                            ["Improvisation", "snecko only", "g/Replace n/all g/Strikes n/and g/Defends n/with random g/Unidentified n/cards."]
                        ]
                    },
            
                    {
                        "name": "Old Beggar",
                        "acts": [2],
                        "options": [
                            ["Offer Gold", "requires 75 gold", "y/75 Gold: g/Remove a card from your deck."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Big Fish",
                        "acts": [1],
                        "options": [
                            ["Banana", null, "g/Heal HP equal to 33% of your max HP."],
                            ["Donut", null, "g/Max HP +5."],
                            ["Box", null, "g/Obtain a Relic. r/Become Cursed - Regret."]
                        ]
                    },
            
                    {
                        "name": "Bonfire Spirits",
                        "acts": [1, 2, 3],
                        "options": [
                            ["Offer", null, "Receive a reward based on the offer."],
                            ["Donate", "downfall only, requires 150 souls", "r/Lose 150 Souls. g/Gain 10 Max HP."]
                        ]
                    },
            
                    {
                        "name": "Dead Adventurer",
                        "acts": [1],
                        "options": [
                            ["Soul Harvest", null, "g/Find Loot. r/25% -> 50% -> 75% a/(35% -> 60% -> 85%)r/: monster returns."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Augmenter",
                        "acts": [2],
                        "options": [
                            ["Test J.A.X.", null, "g/Get JAXXED."],
                            ["Become Test Subject", null, "g/Transform 2 cards."],
                            ["Ingest Mutagens", null, "g/Gain Mutagenic Strength."],
                            ["Punch", "downfall only", "r/Fight. g/Take Everything."]
                        ]
                    },
            
                    {
                        "name": "Duplicator",
                        "acts": [1, 2, 3],
                        "options": [
                            ["Desecrate", "downfall only", "g/Duplicate 2 cards. r/Cursed - Random."],
                            ["Pray", null, "g/Duplicate a card in your deck."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Falling",
                        "acts": [3],
                        "options": [
                            ["Land", null, "r/Lose (random skill)."],
                            ["Channel", null, "r/Lose(random power) n/"],
                            ["Strike", null, "r/Lose (random attack)n/"],
                            ["Float", "hexaghost only", "r/Lose nothing..."]
                        ]
                    },
            
                    {
                        "name": "Forgotten Altar",
                        "acts": [2],
                        "options": [
                            ["Offer", "requires golden idol", "g/Obtain a special Relic. r/Lose Golden Idol."],
                            ["Sacrifice", null, "g/Gain 5 max HP. r/Lose HP equal to 25% a/(35%) r/of your max HP."],
                            ["Desecrate", "standard only", "r/Become Cursed - Decay."],
                            ["Offer Souls", "downfall only, requires 50 souls", "r/Lose 50 Souls. g/Heal HP equal to 35% a/(45%) g/of your max HP."],
                            ["Leave", "downfall only", ""]
                        ]
                    },
            
                    {
                        "name": "The Divine Fountain",
                        "acts": [1, 2, 3],
                        "options": [
                            ["Drink", null, "g/Remove all Curses from your deck."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Council of Ghosts",
                        "acts": [2],
                        "options": [
                            ["Offer", "downfall only, requires 150 souls", "r/Lose 150 Souls. g/Receive n/Apparition."],
                            ["Accept", null, "g/Receive 5 a/(3) n/Apparition. r/Lose 50% of your max HP."],
                            ["Refuse", null, ""]
                        ]
                    },
            
                    {
                        "name": "Golden Idol",
                        "acts": [1],
                        "options": [
                            ["Take", null, "g/Obtain Golden Idol. r/Trigger a trap."],
                            ["Leave", null, ""],
                            ["Outrun", "trap triggered", "r/Become Cursed - Injury."],
                            ["Smash", "trap triggered", "r/Take damage equal to 25% a/(35%) r/of your max HP."],
                            ["Hide", "trap triggered", "r/Lose 8% a/(10%) r/Max HP."]
                        ]
                    },
            
                    {
                        "name": "Golden Shrine",
                        "acts": [1, 2, 3],
                        "options": [
                            ["Pray", null, "g/Gain 100 a/(50) g/Gold."],
                            ["Desecrate", null, "g/Gain 275 Gold. r/Become Cursed - Regret."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Wing Statue",
                        "acts": [1],
                        "options": [
                            ["Pray", null, "g/Remove a card from your deck. r/Lose 7 HP."],
                            ["Destroy", "requires card with 10 or more damage", "g/Gain 50-80 Gold."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Knowing Skull",
                        "acts": [2],
                        "options": [
                            ["A Pick Me Up?", null, "g/Get a Potion. r/Lose X HP, where X = (10% of your max hp + number of times an option has been clicked)."],
                            ["Riches?", null, "g/Gain 90 g/Gold. r/Lose X HP."],
                            ["Success?", null, "g/Get a Colorless Card. r/Lose X HP."],
                            ["How do I leave?", null, "Leave. r/Lose X HP."]
                        ]
                    },
            
                    {
                        "name": "Lab",
                        "acts": [1, 2, 3],
                        "options": [
                            ["Search", null, "g/Find 3 a/(2) g/random Potions!"]
                        ]
                    },
            
                    {
                        "name": "The Ssssserpent",
                        "acts": [1],
                        "options": [
                            ["Agree", "not snecko", "g/Gain 175 a/(150) y/Souls. r/Become Cursed - Doubt."],
                            ["Agree", "snecko only", "g/Gain a random Relic. r/Become Cursed - Bewildered."],
                            ["Disagree", null, ""]
                        ]
                    },
            
                    {
                        "name": "Living Wall",
                        "acts": [1],
                        "options": [
                            ["Forget", null, "g/Remove a card from your deck."],
                            ["Change", null, "g/Transform a card in your deck."],
                            ["Grow", null, "g/Upgrade a card in your deck."],
                            ["Punch", "downfall only", "r/Fight. g/Use all 3 Heads."]
                        ]
                    },
            
                    {
                        "name": "Masked Bandits",
                        "acts": [2],
                        "options": [
                            ["r/Lose (relic chosen at random)", "downfall only - requires a non-starter relic", "g/Gain Bandit Contract."],
                            ["Pay", "standard only", "r/Lose ALL n/of your y/Gold."],
                            ["Fight!", null, "r/Fight. g/Gain Red Mask."]
                        ]
                    },
            
                    {
                        "name": "Match and Keep!",
                        "acts": [1, 2, 3],
                        "options": [
                            ["Play", null, "Play Match and Keep!"],
                            ["Punch", "downfall only", "r/Fight. g/Gain Gremlin Sack."]
                        ]
                    },
            
                    {
                        "name": "Mushrooms",
                        "acts": [1],
                        "options": [
                            ["Stomp", null, "r/Anger the Mushrooms. g/Gain Odd Mushroom."],
                            ["Eat", null, "g/Heal 25% HP. r/Become Cursed - Parasite."]
                        ]
                    },
            
                    {
                        "name": "Mysterious Sphere",
                        "acts": [3],
                        "options": [
                            ["Open Sphere", null, "r/Fight 2 Orb Walkers. g/Reward: Rare Relic."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "N'loth",
                        "acts": [2],
                        "options": [
                            ["Offer: (relic chosen at random)", null, "r/Lose this relic. Obtain a special relic"],
                            ["Offer: (relic chosen at random)", null, "r/Lose this relic. Obtain a special relic"],
                            ["Punch", "downfall only", "g/Gain Random Relic. r/Become Cursed - Pain."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Purifier",
                        "acts": [1, 2, 3],
                        "options": [
                            ["Desecrate", "downfall only", "g/Remove 3 cards. r/Cursed - Random."],
                            ["Smash", "guardian only, instead of desecrate", "g/Gain 2 Random Gems."],
                            ["Pray", null, "g/Remove a card from your deck."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Scrap Ooze",
                        "acts": [1],
                        "options": [
                            ["Recruit", "slime boss only", "r/Lose (common or uncommon relic chosen at random). Gain g/Scrap Ooze."],
                            ["Reach Inside", null, "r/Lose 3 -> 4 -> 5 a/(5 -> 6 -> 7) r/HP. g/25% -> 35% -> 45%: g/Find a Relic."],
                            ["Reach Carefully", "gremlins only - instead of reach inside", "r/10% -> 15% -> 20% a/(20% -> 25% -> 30%)r/: Become Cursed - Scatterbrained. g/25% -> 35% -> 45%: g/Find a Relic."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Secret Portal",
                        "acts": [3],
                        "options": [
                            ["Enter the Portal", "standard only", "IMMEDIATELY travel to the boss."],
                            ["Take Stone", "downfall only", "g/Gain Teleport Stone."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Sensory Stone",
                        "acts": [3],
                        "options": [
                            ["Recall", "standard only", "g/Add 1/2/3 Colorless card(s) to your deck. r/Lose 0/5/10 HP."],
                            ["Recall", "downfall only", "g/Add 1/2/3 Boss card(s) to your deck. r/Lose 0/5/10 HP."]
                        ]
                    },
            
                    {
                        "name": "Shining Light",
                        "acts": [1],
                        "options": [
                            ["Enter", null, "g/Upgrade 2 random cards. r/Lose HP equal to 20% a/(30%) r/of your max HP."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "The Cleric",
                        "acts": [1],
                        "options": [
                            ["Heal", null, "y/35 Gold: g/Heal 25% of your max HP."],
                            ["Purify", null, "y/50 a/(75) y/Gold: g/Remove a card from your deck."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "The Joust",
                        "acts": [2],
                        "options": [
                            ["Murderer", null, "y/Bet 50 Gold n/- g/70%: win 250 Gold."],
                            ["Owner", null, "y/Bet 50 Gold n/- g/30%: win 100 Gold."]
                        ]
                    },
            
                    {
                        "name": "The Library",
                        "acts": [2],
                        "options": [
                            ["Read", null, "g/Choose 1 of 20 cards to add to your deck."],
                            ["Sleep", null, "g/Heal 33% a/(20%) g/of your max HP."],
                            ["Seek", "champ only", "Locate a g/Book n/on Fighting. (Will be g/Berserker's guiden/, g/Defensive Thesisn/, g/Gladiators Manualn/, or g/Dolphin's Style Guiden/)"]
                        ]
                    },
            
                    {
                        "name": "The Mausoleum",
                        "acts": [2],
                        "options": [
                            ["Feast", "downfall only", "g/Gain 200 Souls. r/Become Cursed - Haunted."],
                            ["Open Coffin", "downfall only", "g/Obtain a Relic. r/50% a/(100%)r/: Become Cursed - Haunted."],
                            ["Open Coffin", "standard", "g/Obtain a Relic. r/50% a/(100%)r/: Become Cursed - Writhe."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "The Moai Head",
                        "acts": [3],
                        "options": [
                            ["Jump Inside", null, "g/Heal to full HP. r/Lose 12.5% a/(18%) r/of your max HP."],
                            ["Offer Souls", "downfall only, requires 333 souls", "r/Lose 333 Souls. g/Gain max HP equal to 12.5% a/(18%) g/of your current max HP n/and g/Heal to full."],
                            ["Offer Golden Idol", "requires golden idol", "g/Gain 333 Gold. r/Lose Golden Idol."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "The Woman in Blue",
                        "acts": [1, 2, 3],
                        "options": [
                            ["Buy 1 Potion", null, "y/20 Gold."],
                            ["Buy 2 Potions", null, "y/30 Gold."],
                            ["Buy 3 Potions", null, "y/40 Gold."],
                            ["Leave", null, "a/Take damage equal to 5% of your max HP."]
                        ]
                    },
            
                    {
                        "name": "Tomb of Lord Red Mask",
                        "acts": [3],
                        "options": [
                            ["Don the Red Mask", "requires red mask", "g/Gain 222 Gold."],
                            ["Offer", null, "r/Lose all Gold. g/Obtain a Relic."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Transmogrifier",
                        "acts": [1, 2, 3],
                        "options": [
                            ["Desecrate", "downfall only", "g/Transform 3 cards. r/Cursed - Random."],
                            ["Smash", "guardian only, instead of desecrate", "g/Gain 2 Random Gems."],
                            ["Pray", null, "g/Transform a card."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Upgrade Shrine",
                        "acts": [1, 2, 3],
                        "options": [
                            ["Desecrate", "downfall only", "g/Upgrade 2 cards. r/Cursed - Random."],
                            ["Smash", "guardian only, instead of desecrate", "g/Gain 2 Random Gems."],
                            ["Pray", null, "g/Upgrade a card."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Vampires(?)",
                        "acts": [2],
                        "options": [
                            ["Offer: Blood Vial", "requires blood vial", "g/Remove all n/Strikes. g/Receive 5 n/Bites."],
                            ["Accept", null, "g/Remove all n/Strikes. g/Receive 5 n/Bites. r/Lose 30% of your Max HP."],
                            ["Refuse", null, ""]
                        ]
                    },
            
                    {
                        "name": "Wheel of Change",
                        "acts": [1, 2, 3],
                        "options": [
                            ["Prize", null, "g/Obtain a Relic n/or g/Gain (act number x 100) gold n/or g/Remove a card from your deck n/or g/Heal to full health n/or r/Lose HP equal to 10% a/(15%) r/of your Max HP n/or r/Curse - Decay"],
                            ["Punch", "downfall only", "r/Fight. g/Gain Wheel of Change."],
                            ["PREEMPTIVE STRIKE!", "as gremlins, get the \"lose hp\" option", "g/Gain a random relic and 300 gold."]
                        ]
                    },
            
                    {
                        "name": "Winding Halls",
                        "acts": [3],
                        "options": [
                            ["Embrace Madness", null, "g/Receive 2 n/Madness. r/Lose HP equal to 12.5% a/(18%) r/of your max HP."],
                            ["Focus", null, "r/Become Cursed - Writhe. g/Heal 25% a/(20%) g/of max HP."],
                            ["Retrace Your Steps", null, "r/Lose 5% of your Max HP."]
                        ]
                    },
            
                    {
                        "name": "World of Goop",
                        "acts": [1],
                        "options": [
                            ["Gather Gold", null, "g/Gain 75 Gold. r/Lose 11 HP."],
                            ["Leave It", null, "r/Lose 20-50 a/(35-75) r/Gold."]
                        ]
                    },
            
                    {
                        "name": "Mind Bloom",
                        "acts": [3],
                        "options": [
                            ["I am War", null, "r/Fight a Boss from Act 1. g/Obtain a Rare Relic."],
                            ["I am Awake", null, "g/Upgrade all Cards. r/You can no longer heal."],
                            ["I am Rich", "before floor 41", "g/Gain 999 Gold. r/Cursed - 2 Normality."],
                            ["I am Healthy", "floor 41+", "g/Heal to full HP. r/Cursed - Doubt."]
                        ]
                    },
            
                    {
                        "name": "The Nest",
                        "acts": [2],
                        "options": [
                            ["Smash and Grab", null, "g/Obtain 99 a/(50) y/Gold."],
                            ["Stay in Line", null, "g/Obtain n/Ritual Dagger. r/Lose 6 HP."]
                        ]
                    },
            
                    {
                        "name": "Face Trader",
                        "acts": [1, 2],
                        "options": [
                            ["Punch", "downfall only", "r/Fight. g/Gain Coat of Many Faces."],
                            ["Touch", "standard only", "r/Lose HP equal to 10% of max HP, g/gain 75 a/(50) y/gold."],
                            ["Trade", null, "Gain g/Ssserpent Headn/, g/Face Of Clericn/, w/Cultist Headpiecen/, r/Gremlin Visagen/, or r/N'Loth's Hungry Facen/."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "A Note For Yourself",
                        "acts": [1, 2, 3],
                        "options": [
                            ["Take and Give", null, "g/Receive n/(last card stored) g/and Store a Card."],
                            ["Ignore", null, ""]
                        ]
                    },
            
                    {
                        "name": "We Meet Again!",
                        "acts": [1, 2, 3],
                        "options": [
                            ["Give Potion", "requires potion", "r/Lose (potion chosen at random). g/Obtain a Relic."],
                            ["Give Gold", "requires 50 gold", "r/Lose 50-150 gold. g/Obtain a Relic."],
                            ["Give Card", "requires non-starter non-curse card", "r/Lose n/(card chosen at random). g/Obtain a Relic."],
                            ["Attack", null, ""]
                        ]
                    },
            
                    {
                        "name": "Designer In-Spire",
                        "acts": [2, 3],
                        "options": [
                            ["Adjustments", null, "r/Lose 40 a/(50) r/Gold. (chosen at random): g/Upgrade a card n/or g/Upgrade 2 random cards."],
                            ["Clean Up", null, "r/Lose 60 a/(75) r/Gold. g(chosen at random): g/Remove a card n/or g/Transform 2 cards."],
                            ["Full Service", null, "r/Lose 90 a/(110) r/Gold. g/Remove a card and upgrade a random card."],
                            ["Punch", null, "r/Lose 3 a/(5) r/HP."]
                        ]
                    },
            
                    {
                        "name": "The Colosseum",
                        "acts": [2],
                        "options": [
                            ["Fight", "forced", "r/Fight Blue Slaver and Red Slaver. Gain no rewards."],
                            ["COWARDICE", null, "Escape."],
                            ["VICTORY", null, "A powerful fight with many rewards."]
                        ]
                    }
                ],
            },
        
            "edit": {        
                "potions": [
                    {
                        "where": {"name": "Heart of Iron"},
                        "to": {"color": "Red"}
                    },
        
                    {
                        "where": {"name": "Ghost in a Jar"},
                        "to": {"color": "Green"}
                    },
        
                    {
                        "where": {"name": "Essence Of Darkness"},
                        "to": {"color": "Blue"}
                    },
        
                    {
                        "where": {"name": "Ambrosia"},
                        "to": {"color": "Purple"}
                    },

                    {
                        "where": {"name": "Blood Potion"},
                        "to": {"color": "Red"}
                    },
        
                    {
                        "where": {"name": "Poison Potion"},
                        "to": {"color": "Green"}
                    },
        
                    {
                        "where": {"name": "Bottled Miracle"},
                        "to": {"color": "Purple"}
                    },
        
                    {
                        "where": {"name": "Elixir"},
                        "to": {"color": "Red"}
                    },
        
                    {
                        "where": {"name": "Cunning Potion"},
                        "to": {"color": "Green"}
                    },
        
                    {
                        "where": {"name": "Potion Of Capacity"},
                        "to": {"color": "Blue"}
                    },
        
                    {
                        "where": {"name": "Stance Potion"},
                        "to": {"color": "Purple"}
                    },
        
                    {
                        "where": {"name": "Entropic Brew"},
                        "to": {"img": "/extraImages/potions/entropicbrew.gif"}
                    },
        
                    {
                        "where": {"name": "Duplication Potion"},
                        "to": {"img": "/extraImages/potions/dupe.gif"}
                    },
        
                    {
                        "where": {"name": "Distilled Chaos"},
                        "to": {"img": "/extraImages/potions/distilledchaos.gif"}
                    },
                ],
    
                "creatures": [
                    {
                        "where": {"id": "FuzzyLouseNormal"},
                        "to": {"name": "Red Louse"}
                    },
    
                    {
                        "where": {"id": "FuzzyLouseDefensive"},
                        "to": {"name": "Green Louse"}
                    },

                    {
                        "where": {"id": "SlaverBlue"},
                        "to": {"name": "Blue Slaver"}
                    },
    
                    {
                        "where": {"id": "SlaverRed"},
                        "to": {"name": "Red Slaver"}
                    },
                ],
            }
        }
    },

    "Downfall": {
        "pre": {
            "add": {

            },

            "edit": {

            }
        },

        "post": {
            "add": {
                "bosss": [
                    {
                        "name": "Ironclad",
                        "act": 1,
                        "buff": ["Synchronize", "Whenever Ironclad generates a Status card, a duplicate is added into your discard pile."],
                        "cards": ["Bash", "Flawed", "Doubt", "Reckless Charge", "Wild Strike(+)", "Defend", "Power Through", "Second Wind", "Seeing Red", "Immolate", "Icky", "True Grit+", "Thunderclap+", "Feel No Pain"],
                        "relics": ["Art of War", "Champion's Belt", "Orichalcum (A19)"]
                    },
                    
                    {
                        "name": "Ironclad",
                        "act": 2,
                        "buff": ["Feeding Frenzy", "Ironclad's Reaper foes not Exhaust and targets ALL Mushrooms. When Ironclad kills a Mushroom, he gains 1 Strength."],
                        "cards": ["Twin Strike", "Feed", "Clothesline", "Fungus Among Us", "Ghostly Armor+", "Hemokinesis", "Reaper", "Defend", "Haunted", "Swift Strike", "Heavy Blade", "Clumsy", "Bloodletting", "Headbutt", "Flame Barrier+", "Inflame(+)", "Strike"],
                        "customCards": [["Fungus Among Us", "Kill all Mushrooms. Heal HP equal to their remaining HP. Summon two Mushrooms."]],
                        "relics": ["Red Skull", "Magic Flower", "Vajra", "Du-Vu Doll (A19)"]
                    },
                    
                    {
                        "name": "Ironclad",
                        "act": 3,
                        "buff": ["Bastion", "Ironclad begins the fight with a Fortification, which will grant him 10 block each turn. When the Fortification has been destroyed, Ironclad loses Barricade, but gains 5 Strength at the start of each turn."],
                        "cards": ["Feel No Pain", "Impervious", "Intimidate", "Flame Barrier(+)", "Body Slam", "Clumsy", "Entrench", "Metallicize", "Decay", "Power Through", "Second Wind", "Ghostly Armor"],
                        "relics": ["Odd Mushroom", "Torii", "Cursed Key", "Horn Cleat", "Self-Forming Clay (A19)"]
                    },
                    
                    {
                        "name": "Silent",
                        "act": 1,
                        "buff": ["Warning: Highly Toxic", "Poison is blockable and deals damage at end of turn. Receive an Antidote at the start of combat."],
                        "cards": ["Crippling Cloud", "Survivor", "Burst", "Poisoned Stab", "Dodge and Roll", "Strike", "Bane(+)", "Defend", "Deflect", "Footwork", "Noxious Fumes", "Deadly Poison"],
                        "customCards": [["Antidote", "Lose all Poison."]],
                        "relics": ["Horn Cleat", "Twisted Funnel", "Lantern (A19)"]
                    },
                    
                    {
                        "name": "Silent",
                        "act": 2,
                        "buff": ["Seeing Double", "At the start of each turn, a mirror image of Silent will hide her real location. Attacking silent or the mirror removes it from combat for the turn."],
                        "cards": ["After Image+", "Backstab", "Doppelganger+", "Nightmare", "Deflect(+)", "J.A.X.+", "Dagger Spray", "Decay", "Outmaneuver", "Flying Knee", "Blur", "Footwork", "Leg Sweep", "Riddle with Holes"],
                        "relics": ["Paper Krane", "Anchor", "Bag of Marbles", "Oddly Smooth Stone (A19)"]
                    },
                    
                    {
                        "name": "Silent",
                        "act": 3,
                        "buff": ["Bag of Knives", "The first time you play a card that costs 2 or more each turn, Silent gains 2 Shivs."],
                        "cards": ["Predator", "Flying Knee", "Burst", "Flechettes", "Leg Sweep", "Cloak and Dagger", "Neutralize", "Blur", "Endless Agony", "Finisher+", "Defend", "Blade Dance -> Shiv", "Sucker Punch", "Dagger Spray", "Piercing Wail", "After Image", "Dash"],
                        "relics": ["Mummified Hand", "Fusion Hammer", "Shuriken", "Ornamental Fan", "Kunai (A19)"]
                    },
                    
                    {
                        "name": "Defect",
                        "act": 1,
                        "buff": ["Energy Thief", "Whenever Defect generates a Void, it goes to the top of your draw pile."],
                        "cards": ["Buffer", "Doom and Gloom(+)", "Shame", "Steam Barrier", "Defend", "Aged", "Turbo+", "Sunder", "Defend", "Strike", "Core Surge", "Equilibrium"],
                        "relics": ["Clockwork souvenir", "Fossilized Helix", "Symbiotic Virus (A19)"]
                    },
                    
                    {
                        "name": "Defect",
                        "act": 2,
                        "buff": ["Ancient Construct", "Begins the fight with 2 Bronze Orb minions. Gains 1 Artifact at the end of its turn if it did not already have Artifact."],
                        "cards": ["Boot Sequence", "Claw", "Machine Learning+", "Leap", "Cold Snap+", "Panic Button", "Strike", "Reprogram", "Swift Strike", "Rebound", "Charge Battery", "Genetic Algorithm+", "Shame", "Hyperbeam(+)", "Flawed", "Defend", "Clumsy"],
                        "relics": ["Turnip", "Red Mask", "Kunai", "Ginger (A19)"]
                    },
                    
                    {
                        "name": "Defect",
                        "act": 3,
                        "buff": ["Unbiased Cognision", "Whenever you play a Power card, Defect gains 1 Focus."],
                        "cards": ["Rainbow", "Reinforced Body", "Charge Battery", "Zap+", "Dualcast", "Multi-Cast", "Cold Snap", "Barrage+", "Leap", "Storm", "Defragment(+)", "Blind"],
                        "relics": ["Coffee Dripper", "Fossilized Helix", "Lantern", "Data Disk", "Art of War (A19)"]
                    },
                    
                    {
                        "name": "Watcher",
                        "act": 1,
                        "buff": ["Unbridled Rage", "At the end of her turn, if Watcher is at or below 50% HP, she enters Wrath. Watcher's Wrath increases damage dealt and received by 50% instead of 100%."],
                        "cards": ["Wallop(+)", "Halt", "Defend+", "Clumsy", "Sands of Time", "Talk to the Hand", "Crush Joints", "Panacea", "Fasting", "Regret", "Parasite"],
                        "relics": ["Bag of Preparation", "Cloak Clasp", "Mercury Hourglass (A19)"]
                    },
                    
                    {
                        "name": "Watcher",
                        "act": 2,
                        "buff": ["Blasphemer's Demise", "When Watcher loses 150 more HP, apply -4 Strength to her when she next enters Divinity or plays Ragnarok."],
                        "cards": ["Like Water", "Defend", "Ragnarok+", "Strike", "Follow-Up", "Wave of the Hand", "Defend+", "Wallop+", "Blasphemy+", "Flying Sleeves+", "Wish(+) -> Become Almighty(+)", "Tranquility+", "Vigilance", "Empty Body", "Wish -> Live Forever", "Consecrate+"],
                        "relics": ["Incense Burner", "Teardrop Locket", "Oddly Smooth Stone", "Enchiridion (A19)"]
                    },
                    
                    {
                        "name": "Watcher",
                        "act": 3,
                        "buff": [" Fleeting Faith", "Watcher gains 1 Mantra whenever you play a card. Watcher loses 5 Mantra at the start of her turn. Watcher does not exit Divinity at the end of her turn."],
                        "cards": ["Wish -> Live Forever", "Good Instincts", "Shame", "Wave of the Hand", "Swivel", "Blind", "Signature Move", "Conjure Blade -> Expunger", "Sanctity", "Protect+", "Empty Fist(+)", "Normality", "Strike", "Devotion"],
                        "relics": ["Velvet Choker", "Torii", "Captain's Wheel", "Thread and Needle", "Damaru (A19)"]
                    },
                    
                    {
                        "name": "Hermit",
                        "act": 1,
                        "buff": ["Deadly Focus ", "Hermit has Concentration, which adds special Dead On effects to his cards. Dealing 10 unblocked damage to him breaks the concentration, causing his cards to lose their Dead On effects."],
                        "cards": ["Headshot", "Defend", "Injury", "Itchy Trigger", "Strike", "Ghostly Presence", "Dive(+)", "Lone Wolf", "Roughhouse", "Deadeye"],
                        "relics": ["Calipers", "Oddly Smooth Stone", "The Abacus", "Orichalcum (A19)"]
                    },
                    
                    {
                        "name": "Hermit",
                        "act": 2,
                        "buff": ["Wheel of Fortune", "Whenever you strike Hermit with an Attack, its leftmost card is discarded and it draws a card. Every 6 times this happens, Hermit gains 1 Strength."],
                        "cards": ["Showdown+", "Strike+", "Strike", "Defend", "Desperado", "Wide Open+", "Hole Up", "Flash Powder(+)", "Itchy Trigger", "Hand of Greed", "Virtue+", "Maintenance+", "Necronomicurse"],
                        "relics": ["Necronomicon", "Philosopher's Stone", "Pen Nib"]
                    },
                    
                    {
                        "name": "Hermit",
                        "act": 3,
                        "buff": ["Doomsday", "At the start of your turn, gain an Impending Doom with Retain."],
                        "cards": ["Covet+", "Defend", "Pain", "Clumsy", "Spite", "Misfire", "Glare", "Ghostly Presence", "Master of Strategy", "Bandage Up", "Lone Wolf", "Wide Open", "Malice", "Spray n' Pray", "Enervate", "Low Profile", "Doubt", "Purgatory", "Grudge"],
                        "relics": ["Charred Glove", "Gremlin Visage", "Art of War", "Omamori", "Calling Bell", "Orichalcum (A19)"]
                    }
                ],
            
                "events": [
                    {
                        "name": "Mind Bloom",
                        "acts": [3],
                        "options": [
                            ["I am an Echo", null, "r/Fight yourself. g/Obtain a Rare Relic."],
                            ["I am Complete", "requires all keys broken", "g/Upgrade all Cards. r/Lose Heart Blessings n/and r/10 Max HP."],
                            ["I am Gorged", "before chest", "g/Gain 999 Souls r/Cursed - 2 Normality."],
                            ["I am Healthy", "after chest", "g/Heal to full HP. r/Cursed - Doubt."]
                        ]
                    },
            
                    {
                        "name": "Soul Shrine",
                        "acts": ["?"],
                        "options": [
                            ["Pray", null, "g/Gain 100 a/(50) Gold."],
                            ["Desecrate", null, "g/Gain 275 Gold. r/Become Cursed - Regret"],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "The Woman in Blue",
                        "acts": ["?"],
                        "options": [
                            ["Punch", null, "r/Fight. g/Gain a Potion Relic and 3 Potions."],
                            ["Leave", null, "a/Take damage equal to 5% of your max HP."]
                        ]
                    },
            
                    {
                        "name": "The Cursed Fountain",
                        "acts": ["?"],
                        "options": [
                            ["Bottle", "requires 1+ curse", "g/Gain Cursed Liquid Potion."],
                            ["Consume", "requires 2+ curses", "g/Gain 75 y/Souls."],
                            ["Drink", "requires 3+ curses", "g/Heal to full HP."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "We Meet Again!",
                        "acts": [1, 2, 3],
                        "options": [
                            ["r/Lose (relic chosen at random)", "requires 1+ non-starter non-boss non-event relic", "g/Gain 3 Potions."],
                            ["r/Lose (relic chosen at random)", "requires 2+ non-starter non-boss non-event relics", "g/Gain 150 a/(75) y/Souls."],
                            ["r/Lose (relic chosen at random)", "requires 3+ non-starter non-boss non-event relics", "g/Gain a y/Rare g/Card."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Designer In-Spire",
                        "acts": ["?"],
                        "options": [
                            ["Punch", null, "r/Take damage equal to 8% a/(12%) of your max HP."],
                            ["Adjustments", "punch first", "g/Upgrade 1-2 random cards."],
                            ["Clean Up", "punch first", "g/Transform 1-2 random cards."],
                            ["Full Service", "punch first", "g/Remove a card and upgrade a random card."],
                            ["Ignore", null, "Leave."]
                        ]
                    },
            
                    {
                        "name": "Shining Light",
                        "acts": ["?"],
                        "options": [
                            ["Enter", null, "g/Upgrade 3 random cards. r/Become Cursed - Flawed."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "World of Goop",
                        "acts": ["?"],
                        "options": [
                            ["Full Harvest", null, "g/Gain 450 a/(300) y/Souls. r/Become Cursed Thrice - Icky."],
                            ["Drain", null, "g/Gain 300 a/(200) y/Souls. r/Become Cursed Twice - Icky."],
                            ["Sap", null, "g/Gain 150 a/(100) y/Souls. r/Become Cursed - Icky."]
                        ]
                    },
            
                    {
                        "name": "Wing Statue",
                        "acts": ["?"],
                        "options": [
                            ["Destroy", null, "r/Lose 11 Max HP. g/Gain Sharpened Fragment."],
                            ["Collect", null, "g/Gain Broken Wing Statue."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Golden Idol",
                        "acts": [1],
                        "options": [
                            ["Set Trap", "last time you saw this event in another run, you harvested", "r/Lose a Strike."],
                            ["Harvest", "last time you saw this event in another run, you set a trap", "g/Gain 100 y/Souls."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "The Cleric",
                        "acts": ["?"],
                        "options": [
                            ["Punch", null, "g/Gain 100 a/(50) y/Souls"],
                            ["Intimidate", null, "g/Remove a card from your deck."]
                        ]
                    },
            
                    {
                        "name": "Cursed Tome",
                        "acts": [2],
                        "options": [
                            ["Take", null, "Obtain g/Enchiridionn/, g/Nilry's Codexn/, or g/Necronomicon. r/Lose 16 a/(21) r/HP."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Knowing Skull",
                        "acts": ["?"],
                        "options": [
                            ["You.", null, "g/Obtain Knowing Skull. r/Lose 7 a/(14) r/HP."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Pleading Vagrant",
                        "acts": ["?"],
                        "options": [
                            ["Punch", null, "g/Gain 85 Souls. r/Lose 11 a/(16) r/HP."],
                            ["Rob", null, "g/Obtain a Relic. r/Become Cursed - Pride."]
                        ]
                    },
            
                    {
                        "name": "Old Beggar",
                        "acts": ["?"],
                        "options": [
                            ["Continue", "cleric event not seen yet", "g/Begin cleric event"],
                            ["Fight", " intimidate option chosen in cleric event", "r/Fight 2 centurions. n/Choose: g/Gain 200 a/(100) y/Souls n/or g/Remove 2 cards from your deck."],
                            ["Punch", "punch option chosen in cleric event", "g/Gain 100 a/(50) y/Souls. r/Become Cursed - Pride"],
                            ["Leave", "punch option chosen in cleric event", ""]
                        ]
                    },
            
                    {
                        "name": "The Nest",
                        "acts": ["?"],
                        "options": [
                            ["Return Statue", "requires Broken Wing Statue", "r/Lose Broken Wing Statue. g/Gain n/Ritual Dagger+ g/with 20 damage n/and a g/Cultist Potion."],
                            ["Steal", null, "g/Obtain n/Ritual Dagger. r/Lose 6 HP."],
                            ["Accept", null, "g/Gain Cultist Potion."],
                            ["Continue", null, ""]
                        ]
                    },
            
                    {
                        "name": "The Colosseum",
                        "acts": ["?"],
                        "options": [
                            ["Defend Title", "champ only", "r/Fight n/Black Knight. g/Gain many rewards."],
                            ["Challenge", null, "r/Fight n/Arena Champions. g/Gain many rewards."],
                            ["Participate", null, "r/Fight n/Captive Hero. g/Gain many rewards."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Tomb of Lord Red Mask",
                        "acts": ["?"],
                        "options": [
                            ["Don the Red Mask", "requires red mask and bandit contract", "g/Upgrade Bandit Contract."],
                            ["Bash", null, "r/Lose (attack chosen at random). g/Obtain Red Mask."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Winding Halls",
                        "acts": ["?"],
                        "options": [
                            ["Left", null, "g/Explore an Event."],
                            ["Right", null, "g/Search the Treasury for a Relic."],
                            ["Straight", null, "g/Hunt down the Merchant."]
                        ]
                    },
            
                    {
                        "name": "The Joust",
                        "acts": ["?"],
                        "options": [
                            ["Left", null, "r/50%: Lose HP equal to 30% of your max HP. g/50%: Gain 200 Souls."],
                            ["Right", null, "r/25%: Lose HP equal to 15% of your max HP. g/75%: Gain 100 Souls."]
                        ]
                    },
            
                    {
                        "name": "Drone Factory",
                        "acts": ["?"],
                        "character": "The_bronze_automaton",
                        "options": [
                            ["Fight Spiker", null, "g/Gain Spike n/as a combat reward."],
                            ["Fight Repulsor", null, "g/Gain Dazing Pulse n/as a combat reward."],
                            ["Fight Exploder", null, "g/Gain Explode n/as a combat reward."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Ancient Factory",
                        "acts": ["?"],
                        "character": "The_bronze_automaton",
                        "options": [
                            ["Fight Donu Prototype", null, "g/Gain Proto-Beam."],
                            ["Fight Deca Prototype", null, "g/Gain Proto-Shield."],
                            ["Fight Both", null, "g/Gain Both Cards."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Grim Forge",
                        "acts": ["?"],
                        "character": "The_bronze_automaton",
                        "options": [
                            ["Craft", null, "g/Gain Bottled Code. r/Lose 10 Max HP."],
                            ["Reforge", "requires a rare card", "r/Remove n/a y/Rare n/Card. g/Gain 10 Max HP and Heal to full."],
                            ["Transmute", null, "r/Remove n/a Card. Gain a random g/Card with Encode."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Tome of Technique",
                        "acts": ["?"],
                        "character": "The_champ_gray",
                        "options": [
                            ["Read", null, "Choose an Attack to gain y/'trigger Skill Bonus.' r/Lose 5 -> 10 -> 20 r/HP n/-> r/Cursed - Pride"],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Gymnasium",
                        "acts": ["?"],
                        "character": "The_champ_gray",
                        "options": [
                            ["Cardio", null, "g/Gain 10 Max HP."],
                            ["Spar", null, "Choose a non-Finisher card to gain 'Enter (Chosen) Stance'."],
                            ["Lift", null, "g/Gain Inner Strength."]
                        ]
                    },
            
                    {
                        "name": "Minor League Arena",
                        "acts": ["?"],
                        "options": [
                            ["Fight Centurion & Mystic", null, "g/Gain Cloak Clasp"],
                            ["Fight Gremlin Nob", null, "g/Gain Champion Belt"],
                            ["Fight Slaver Duo", null, "g/Gain Wrist Blade"],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Suspicious Merchant",
                        "acts": ["?"],
                        "options": [
                            ["Buy", null, "r/Lose 10 a/(30) r/Gold. g/Obtain 1 random Colorless Card."],
                            ["Buy", null, "r/Lose 50 a/(70) r/Gold. g/Obtain 2 random Colorless Cards."],
                            ["Buy", null, "r/Lose 90 a/(110) r/Gold. g/Obtain 3 random Colorless Cards."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Gem Mine",
                        "acts": ["?"],
                        "character": "Guardian",
                        "options": [
                            ["Rob", null, "r/Fight Gremlins. g/Gain Pick of Rhapsody."],
                            ["Mine with Pick", "have pick of rhapsody with at least 1 charge", "g/Gain random Gem. r/Lose Pick charge."],
                            ["Dig with Claws", null, "g/Gain random Gem. r/Lose ", " r/HP."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Quantum Chamber",
                        "acts": ["?"],
                        "character": "Guardian",
                        "options": [
                            ["Use", null, "g/Gain Quantum Chamber. r/Become Cursed - Aged"],
                            ["Smash", null, "g/Gain max hp equal to 15% a/(10%) g/of your current max HP. r/Become Cursed - Pain"],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Grim Forge",
                        "acts": ["?"],
                        "character": "Guardian",
                        "options": [
                            ["Dismantle", "requires card with a gem installed.", "r/Remove n/Socketed Card. Gain its g/Gems."],
                            ["Pry", "requires card with a gem installed.", "r/Destroy n/all g/Gems n/in a Socketed Card."],
                            ["Transmute", null, "r/Remove n/a Card. Gain a random g/Gem."],
                            ["Enhance", "requires a gem and an open socket.", "Add a g/Gem n/to a g/Socket."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Wandering Specter",
                        "acts": ["?"],
                        "options": [
                            ["Left Box", null, "g/Obtain a Du-Vu Doll or Darkstone Periapt. r/Cursed Twice - Haunted."],
                            ["Right Box", null, "g/Obtain r/Extra g/Cursed Key n/or r/Extra g/Cursed Bell."],
                            ["Chase Away", "no blue candle", "g/Obtain Blue Candle. r/Lose 5 HP."],
                            ["Chase Away", "have blue candle", "Leave."],
                            ["Trade for Power", "choose a box", "g/Gain n/a g/random y/Rare g/card. r/Become Cursed - Random."],
                            ["Trade for Life", "choose a box", "g/Gain 5 Max HP. r/Become Cursed - Random."],
                            ["Trade for Souls", "choose a box", "g/Gain 100 Souls. r/Become Cursed - Random."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Seal Chamber",
                        "acts": ["?"],
                        "character": "Hexa_ghost_purple",
                        "options": [
                            ["Offer", null, "r/Lose n/7 HP. g/Gain First Seal."],
                            ["Offer", null, "r/Lose n/10 y/Souls. g/Gain Second Seal."],
                            ["Offer", null, "r/Lose n/(common card chosen at random). g/Gain Third Seal."],
                            ["Offer", null, "r/Lose n/(potion chosen at random). g/Gain Fourth Seal."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Council of Ghosts",
                        "acts": [2],
                        "character": "Hexa_ghost_purple",
                        "options": [
                            ["Accept", null, "r/Lose 50% of your Max HP. n/Unlock Study and Learn options."],
                            ["Study", null, "r/Lose all Strikes. g/Gain 3 Council's Justice."],
                            ["Learn", null, "r/Lose all Defends. g/Gain 3 Apparition."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "World of Goop",
                        "acts": ["?"],
                        "character": "Slimebound",
                        "options": [
                            ["Gather Souls", null, "g/Gain 75 Souls."],
                            ["Recruit", null, "r/Lose 75 Souls. g/Gain y/Greed Ooze."]
                        ]
                    },
            
                    {
                        "name": "The Art of Slime War",
                        "acts": ["?"],
                        "options": [
                            ["Read", null, "g/Remove all n/Strikes. g/Receive 3 Upgraded n/Tackles."],
                            ["Take", null, "g/Obtain Consult Playbook. r/Trigger a trap."],
                            ["Leave", null, ""],
                            ["Dive", "trap triggered", "r/Become Cursed - Icky."],
                            ["Be Patient", "trap triggered", "r/Take 35% a/(45%) r/of your max HP as damage."],
                            ["Grab and Run", "trap triggered", "r/Lose 10% a/(15%) r/of your Max HP."]
                        ]
                    },
            
                    {
                        "name": "Darklings",
                        "acts": ["?"],
                        "character": "Slimebound",
                        "options": [
                            ["Fight", null, "r/Fight Darklings. g/Gain card reward."],
                            ["Recruit", "requires a rare card", "r/Lose n/(rare card chosen at random) g/Obtain Darkling Duo."]
                        ]
                    },
            
                    {
                        "name": "Mystical Octahedron",
                        "acts": ["?"],
                        "character": "Snecko_cyan",
                        "options": [
                            ["Shatter", null, "r/Lose 10 a/(15) r/HP. g/Gain 5 Unidentified Cards"],
                            ["Take", "requires a card that uses a randomly chosen number", "g/Gain Mystical Octahedron. r/Cursed - Pain."],
                            ["Leave", null, ""]
                        ]
                    },
            
                    {
                        "name": "Suspicious House",
                        "acts": ["?"],
                        "options": [
                            ["Rescue", null, "g/Gain Young Snecko. r/Become Cursed - Bewildered."],
                            ["Leave", null, ""]
                        ]
                    },
                ],
            
                "potions": [                    
                    {
                        "id": "downfall:CursedFountainPotion",
                        "name": "Cursed Fountain Liquid",
                        "rarity": "Event",
                        "description": "Apply 2 Weak, 2 Vulnerable, and reduce Strength by 2.",
                        "img": "/extraImages/potions/fountain.png"
                    }
                ]
            },

            "edit": {
                "cards": [
                    {
                        "where": {"name": "Gremlin Dance"},
                        "to": {"description": desc => desc.replace('Has a bonus effect based on which Gremlin you are.', 'If Sneaky: Draw 2 cards.\nIf Mad: Deals to ALL enemies.\nIf Shield: Gain 6 Block.\nIf Fat: Enemy loses 2 Strength this turn.\nIf Wizard: Gain 2 gremlin:Wiz.')}
                    },
    
                    {
                        "where": {"name": "Knowing Skull"},
                        "to": {"description": "Ethereal.\nChoose:\nSouls: Lose 3 HP. Gain 40 (50) Souls.\nSuccess: Lose 1 HP. Add a random (upgraded) Colorless card to your hand.\nA Pick Me Up: Lose 5 (2) HP. Gain a random Potion.\nExhaust."}
                    },
    
                    {
                        "where": {"name": "Whiz"},
                        "to": {"description": desc => desc+'\n\nBang (0 [E] card): Deal 0 damage 3 (4) times. Add a Whiz(+) to your discard pile. Exhaust.'}
                    }
                ],
        
                "relics": [
                    {
                        "where": {"name": "Bronze Idol"},
                        "to": {"description": "Status cards now cost [E] and may be played for useful effects.\n\nSlimed -> Lubricant: Draw 2 cards. Exhaust.\nWound -> Grievous Wound: Apply 1 Vulnerable.\nVoid -> Into the Void: Ethereal. Enemy loses 5 Strength this turn. Whenever this card is drawn, lose 1 Energy. Exhaust.\nDazed -> Daze: Ethereal. Apply 1 Weak. Exhaust.\nBurn -> Ignite: Apply 10 :Soulburn. At the end of your turn, take 2 damage.\n"}
                    },
        
                    {
                        "where": {"name": "Knowing Skull"},
                        "to": {"description": "At the start of each combat, add a **Knowing Skull** to your hand."}
                    },
                    
                    {
                        "where": {"name": "Greed Ooze"},
                        "to": {"description": desc => desc.replace(' (can be revived if Absorbed)', '')+'\nWhen Greed Ooze is absorbed gain Revive Greed.\nRevive Greed (2 (1) [E] ): Retain. Split into Greed Ooze. Exhaust.'}
                    }
                ],

                "potions": [
                    
        
                    {
                        "where": {"name": "Jar of Slime"},
                        "to": {"color": "Slimebound"}
                    },
        
                    {
                        "where": {"name": "Potentially Potent Potion"},
                        "to": {"color": "Snecko_cyan"}
                    },
        
                    {
                        "where": {"name": "Tonic"},
                        "to": {"color": "Hermit_yellow"}
                    },
        
                    {
                        "where": {"name": "Machine Oil"},
                        "to": {"color": "The_bronze_automaton"}
                    },
        
                    {
                        "where": {"name": "Ecto-Cooler"},
                        "to": {"color": "Hexa_ghost_purple"}
                    },
        
                    {
                        "where": {"name": "Strategy Potion"},
                        "to": {"color": "The_champ_gray"}
                    },
        
                    {
                        "where": {"name": "Temporal Potion"},
                        "to": {"color": "Guardian"}
                    },
        
                    {
                        "where": {"name": "Slimy Elixir"},
                        "to": {"color": "Slimebound"}
                    },
        
                    {
                        "where": {"name": "Polishing Oil"},
                        "to": {"color": "Guardian"}
                    },
        
                    {
                        "where": {"name": "Alchyrical Elixir"},
                        "to": {"color": "The_bronze_automaton"}
                    },
        
                    {
                        "where": {"name": "Exotic Beverage"},
                        "to": {"color": "Snecko_cyan"}
                    },
        
                    {
                        "where": {"name": "Bottled Technique"},
                        "to": {"color": "The_champ_gray"}
                    },
        
                    {
                        "where": {"name": "Combustive Fluid"},
                        "to": {"color": "Hexa_ghost_purple"}
                    },
        
                    {
                        "where": {"name": "Eau de Grem"},
                        "to": {"color": "Gremlin"}
                    },
        
                    {
                        "where": {"name": "Black Bile"},
                        "to": {"color": "Hermit_yellow"}
                    },
        
                    {
                        "where": {"name": "Liquid Void"},
                        "to": {"color": "Hermit_yellow"}
                    },
        
                    {
                        "where": {"name": "Stimpack"},
                        "to": {"color": "The_champ_gray"}
                    },
        
                    {
                        "where": {"name": "Liquid Luck"},
                        "to": {"color": "Snecko_cyan"}
                    },
        
                    {
                        "where": {"name": "Quantum Elixir"},
                        "to": {"color": "Guardian"}
                    },
        
                    {
                        "where": {"name": "Inferno Potion"},
                        "to": {"color": "Hexa_ghost_purple"}
                    },
        
                    {
                        "where": {"name": "Kio's Clever Concoction"},
                        "to": {"color": "The_bronze_automaton"}
                    },
        
                    {
                        "where": {"name": "Gremlin In A Jar"},
                        "to": {"color": "Gremlin"}
                    },
        
                    {
                        "where": {"name": "Army in a Bottle"},
                        "to": {"color": "Slimebound"}
                    },
                ],

                "creatures": [
                    
                    {
                        "where": {"name": "Neow", type: "Boss"},
                        "to": {"img": "/Downfall/creatures/NeowBossFinal.png"}
                    },
        
                    {
                        "where": {"name": "the Snecko"},
                        "to": {"name": "The Snecko"}
                    },
    
                    {
                        "where": {"name": "The Ironclad", type: "Elite"},
                        "to": {"img": "/Downfall/creatures/GauntletIronclad.png"}
                    },
    
                    {
                        "where": {"name": "The Silent", type: "Elite"},
                        "to": {"img": "/Downfall/creatures/GauntletSilent.png"}
                    },
    
                    {
                        "where": {"name": "The Defect", type: "Elite"},
                        "to": {"img": "/Downfall/creatures/GauntletDefect.png"}
                    },
    
                    {
                        "where": {"name": "The Watcher", type: "Elite"},
                        "to": {"img": "/Downfall/creatures/GauntletWatcher.png"}
                    },
    
                    {
                        "where": {"name": "The Hermit", type: "Elite"},
                        "to": {"img": "/Downfall/creatures/GauntletHermit.png"}
                    },
    
                    {
                        "where": {"name": "The Woman in Blue"},
                        "to": {"img": "/Downfall/creatures/LadyInBlue.png"}
                    },
    
                    {
                        "where": {"name": "Merchant", "type": "Normal"},
                        "to": {"img": "/Downfall/creatures/FleeingMerchant.png"}
                    },
    
                    {
                        "where": {"name": "Head of Growth"},
                        "to": {"img": "/Downfall/creatures/GrowingTotem.png"}
                    },
    
                    {
                        "where": {"name": "Head of Change"},
                        "to": {"img": "/Downfall/creatures/ChangingTotem.png"}
                    },
    
                    {
                        "where": {"name": "Forgetful Head"},
                        "to": {"img": "/Downfall/creatures/ForgetfulTotem.png"}
                    },
                ],
        
                "keywords": [
                    {
                        "where": {"name": "Gremlin Nob"},
                        "to": {"description": "At the start of your turn, add the following cards with Ethereal and Exhaust to your hand:\n\nBellow (0 [E] ): Gain 2 (3) Strength for each enemy that does not intend to Attack.\nSkull Bash (1 [E] ): Deal 6 (8) damage. Apply 2 Vulnerable.\nRush (1 [E] ): Deal 14 (16) damage.\n\nYou can no longer :Swap. When you would lose all :Temporary :HP, prevent further damage and revert back."}
                    }
                ],
            }
        }
    },

    "The Unchained Mod": {
        "pre": {
            "add": {

            },

            "edit": {

            }
        },

        "post": {
            "add": {
                "events": [
                    {
                        "name": "The Demon Speaks",
                        "acts": [1],
                        "character": "Unchained_orange_color",
                        "options": [
                            ["Unstoppable Force", null, "g/Obtain Crushing Gauntlets. r/Take 7 a/(10) r/damage."],
                            ["Unlimited Power", null, "g/Obtain Arcane Amplifier. r/Gain a Writhe."],
                            ["Tell him to shove it", null, ""],
                        ]
                    },
                ]
            },

            "edit": {

            }
        }
    },

    "Borealis Content": {
        "pre": {
            "remove": {
                "cards": [
                    {
                        "id":"borealiscards:Bonk"
                    },
                    {
                        "id":"borealiscards:DevastatingStrikeOLD"
                    }
                ]
            }
        }
    },

    "Template": {
        "pre": {
            "add": {

            },

            "edit": {

            }
        },

        "post": {
            "add": {

            },

            "edit": {

            }
        }
    },
}