const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, AttachmentBuilder, EmbedBuilder, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('monster-hunter')
        .setDescription('Monster ecodata!'),
    async execute(interaction) {
        let selectedGame, selectedClass, monsterInfo, thumbnailPath, thumbnailFile, MHembed, output = false;
        const jsonPath = './../../data/monster-hunter.json';
        const data = require(jsonPath);

        // Main Menu
        const mainMenu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('mainMenu').setPlaceholder('Select the game!').addOptions(
                data.games.map((game) =>
                    new StringSelectMenuOptionBuilder().setLabel(game.label).setDescription(game.description).setValue(game.value),
                ),
            ),
        );

        // ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                                                                                   //
        // Monster Hunter Freedom Unite                                                                      //
        //                                                                                                   //
        // ////////////////////////////////////////////////////////////////////////////////////////////////////
        const MHFU = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('MHFU').setPlaceholder('Select the monster class!').addOptions(
                data.mhfu.monster_classes.map((mhfu_monster_class) =>
                    new StringSelectMenuOptionBuilder().setLabel(mhfu_monster_class.label).setDescription(mhfu_monster_class.description).setValue(mhfu_monster_class.value),
                ),
            ),
        );

        const MHFUlynian = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('MHFUlynian').setPlaceholder('Select the monster!').addOptions(
                new StringSelectMenuOptionBuilder().setLabel('Felyne').setDescription('アイルー (Airū)').setValue('MHFU Felyne'),
                new StringSelectMenuOptionBuilder().setLabel('Melynx').setDescription('メラルー (Merarū)').setValue('MHFU Melynx'),
                new StringSelectMenuOptionBuilder().setLabel('Shakalaka').setDescription('チャチャブー (Chachabū)').setValue('MHFU Shakalaka'),
                new StringSelectMenuOptionBuilder().setLabel('King Shakalaka').setDescription('キングチャチャブー (Kingu Chachabū)').setValue('MHFU King Shakalaka'),
            ),
        );

        const MHFUneopteron = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('MHFUneopteron').setPlaceholder('Select the monster!').addOptions(
                new StringSelectMenuOptionBuilder().setLabel('Vespoid').setDescription('ランゴスタ (Rangosuta)').setValue('MHFU Vespoid'),
                new StringSelectMenuOptionBuilder().setLabel('Vespoid Queen').setDescription('クイーンランゴスタ (Kuīn Rangosuta)').setValue('MHFU Vespoid Queen'),
                new StringSelectMenuOptionBuilder().setLabel('Hornetaur').setDescription('カンタロス (Kantarosu)').setValue('MHFU Hornetaur'),
                new StringSelectMenuOptionBuilder().setLabel('Great Thunderbug').setDescription('大雷光虫 (Dai Raikō Mushi)').setValue('MHFU Great Thunderbug'),
            ),
        );

        // ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                                                                                   //
        // Monster Hunter 3rd                                                                                //
        //                                                                                                   //
        // ////////////////////////////////////////////////////////////////////////////////////////////////////
        const MHP3rd = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('MHP3rd').setPlaceholder('Select the monster class!').addOptions(
                data.mhp3rd.monster_classes.map((mhp3rd_monster_class) =>
                    new StringSelectMenuOptionBuilder().setLabel(mhp3rd_monster_class.label).setDescription(mhp3rd_monster_class.description).setValue(mhp3rd_monster_class.value),
                ),
            ),
        );

        const MHP3rdLynian = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('MHP3rdLynian').setPlaceholder('Select the monster!').addOptions(
                new StringSelectMenuOptionBuilder().setLabel('Felyne').setDescription('アイルー (Airū)').setValue('MHP3rd Felyne'),
                new StringSelectMenuOptionBuilder().setLabel('Melynx').setDescription('メラルー (Merarū)').setValue('MHP3rd Melynx'),
            ),
        );

        const MHP3rdNeopteron = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('MHP3rdNeopteron').setPlaceholder('Select the monster!').addOptions(
                new StringSelectMenuOptionBuilder().setLabel('Altaroth').setDescription('オルタロス (Orutarosu)').setValue('MHP3rd Altaroth'),
                new StringSelectMenuOptionBuilder().setLabel('Bnahabra').setDescription('ブナハブラ (Bunahabura)').setValue('MHP3rd Bnahabra'),
            ),
        );

        const MHP3rdPiscineWyvern = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('MHP3rdPiscineWyvern').setPlaceholder('Select the monster!').addOptions(
                new StringSelectMenuOptionBuilder().setLabel('Delex').setDescription('デルクス (Derukusu)').setValue('MHP3rd Delex'),
            ),
        );

        // ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                                                                                   //
        // Monster Hunter Tri                                                                                //
        //                                                                                                   //
        // ////////////////////////////////////////////////////////////////////////////////////////////////////
        const MHTri = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('MHTri').setPlaceholder('Select the monster class!').addOptions(
                data.mhtri.monster_classes.map((mhtri_monster_class) =>
                    new StringSelectMenuOptionBuilder().setLabel(mhtri_monster_class.label).setDescription(mhtri_monster_class.description).setValue(mhtri_monster_class.value),
                ),
            ),
        );

        const MHTriLynian = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('MHTriLynian').setPlaceholder('Select the monster!').addOptions(
                new StringSelectMenuOptionBuilder().setLabel('Felyne').setDescription('アイルー (Airū)').setValue('MHTri Felyne'),
                new StringSelectMenuOptionBuilder().setLabel('Melynx').setDescription('メラルー (Merarū)').setValue('MHTri Melynx'),
            ),
        );

        const MHTriNeopteron = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('MHTriNeopteron').setPlaceholder('Select the monster!').addOptions(
                new StringSelectMenuOptionBuilder().setLabel('Altaroth').setDescription('オルタロス (Orutarosu)').setValue('MHTri Altaroth'),
                new StringSelectMenuOptionBuilder().setLabel('Bnahabra').setDescription('ブナハブラ (Bunahabura)').setValue('MHTri Bnahabra'),
            ),
        );

        const MHTriPiscineWyvern = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('MHTriPiscineWyvern').setPlaceholder('Select the monster!').addOptions(
                new StringSelectMenuOptionBuilder().setLabel('Delex').setDescription('デルクス (Derukusu)').setValue('MHTri Delex'),
            ),
        );

        // First message
        const iconPath = './../../assets/monster-hunter/Monster_Hunter.png';
        const iconFile = new AttachmentBuilder(iconPath);
        const mainEmbed = new EmbedBuilder().setColor(0x000000).setImage('attachment://Monster_Hunter.png');
        const reply = await interaction.reply({ embeds: [mainEmbed], files: [iconFile], components: [mainMenu] });

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            filter: (i) => i.user.id === interaction.user.id,
            time: 60_000,
        });

        collector.on('collect', async (i) => {
            await i.deferUpdate();
            const selectedValues = i.values[0];

            // Main Menu - Select the game!
            if (i.customId === 'mainMenu') {
                selectedGame = selectedValues;

                if (selectedGame === 'mhfu') await interaction.editReply({ components: [MHFU] });
                if (selectedGame === 'mhp3rd') await interaction.editReply({ components: [MHP3rd] });
                if (selectedGame === 'mhtri') await interaction.editReply({ components: [MHTri] });
            }
            // ////////////////////////////////////////////////////////////////////////////////////////////////////
            //                                                                                                   //
            // Monster Hunter Freedom Unite                                                                      //
            //                                                                                                   //
            // ////////////////////////////////////////////////////////////////////////////////////////////////////
            if (i.customId === 'MHFU') {
                selectedClass = selectedValues;

                if (selectedClass === 'lynian') await interaction.editReply({ components: [MHFUlynian] });
                if (selectedClass === 'neopteron') await interaction.editReply({ components: [MHFUneopteron] });
            }

            if (selectedValues === 'MHFU Felyne') {
                monsterInfo = data[selectedGame][selectedClass]['felyne']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/${selectedGame}/monsters/${monsterInfo.icon}`;
            }
            if (selectedValues === 'MHFU Melynx') {
                monsterInfo = data[selectedGame][selectedClass]['melynx']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/${selectedGame}/monsters/${monsterInfo.icon}`;
            }
            if (selectedValues === 'MHFU Shakalaka') {
                monsterInfo = data[selectedGame][selectedClass]['shakalaka']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/${selectedGame}/monsters/${monsterInfo.icon}`;
            }
            if (selectedValues === 'MHFU King Shakalaka') {
                monsterInfo = data[selectedGame][selectedClass]['king_shakalaka']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/${selectedGame}/monsters/${monsterInfo.icon}`;
            }


            if (selectedValues === 'MHFU Vespoid') {
                monsterInfo = data[selectedGame][selectedClass]['vespoid']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/${selectedGame}/monsters/${monsterInfo.icon}`;
            }
            if (selectedValues === 'MHFU Vespoid Queen') {
                monsterInfo = data[selectedGame][selectedClass]['vespoid_queen']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/${selectedGame}/monsters/${monsterInfo.icon}`;
            }
            if (selectedValues === 'MHFU Hornetaur') {
                monsterInfo = data[selectedGame][selectedClass]['hornetaur']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/${selectedGame}/monsters/${monsterInfo.icon}`;
            }
            if (selectedValues === 'MHFU Great Thunderbug') {
                monsterInfo = data[selectedGame][selectedClass]['great_thunderbug']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/${selectedGame}/monsters/${monsterInfo.icon}`;
            }

            // ////////////////////////////////////////////////////////////////////////////////////////////////////
            //                                                                                                   //
            // Monster Hunter 3rd                                                                                //
            //                                                                                                   //
            // ////////////////////////////////////////////////////////////////////////////////////////////////////
            if (i.customId === 'MHP3rd') {
                selectedClass = selectedValues;

                if (selectedClass === 'lynian') await interaction.editReply({ components: [MHP3rdLynian] });
                if (selectedClass === 'neopteron') await interaction.editReply({ components: [MHP3rdNeopteron] });
                if (selectedClass === 'piscine_wyvern') await interaction.editReply({ components: [MHP3rdPiscineWyvern] });
            }

            if (selectedValues === 'MHP3rd Felyne') {
                monsterInfo = data[selectedGame][selectedClass]['felyne']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/mhp3rd/monsters/${monsterInfo.icon}`;
            }
            if (selectedValues === 'MHP3rd Melynx') {
                monsterInfo = data[selectedGame][selectedClass]['melynx']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/mhp3rd/monsters/${monsterInfo.icon}`;
            }


            if (selectedValues === 'MHP3rd Altaroth') {
                monsterInfo = data[selectedGame][selectedClass]['altaroth']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/mhp3rd/monsters/${monsterInfo.icon}`;
            }
            if (selectedValues === 'MHP3rd Bnahabra') {
                monsterInfo = data[selectedGame][selectedClass]['bnahabra']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/mhp3rd/monsters/${monsterInfo.icon}`;
            }


            if (selectedValues === 'MHP3rd Delex') {
                monsterInfo = data[selectedGame][selectedClass]['delex']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/mhp3rd/monsters/${monsterInfo.icon}`;
            }

            // ////////////////////////////////////////////////////////////////////////////////////////////////////
            //                                                                                                   //
            // Monster Hunter Tri                                                                                //
            //                                                                                                   //
            // ////////////////////////////////////////////////////////////////////////////////////////////////////
            if (i.customId === 'MHTri') {
                selectedClass = selectedValues;

                if (selectedClass === 'lynian') await interaction.editReply({ components: [MHTriLynian] });
                if (selectedClass === 'neopteron') await interaction.editReply({ components: [MHTriNeopteron] });
                if (selectedClass === 'piscine_wyvern') await interaction.editReply({ components: [MHTriPiscineWyvern] });
            }

            if (selectedValues === 'MHTri Felyne') {
                monsterInfo = data[selectedGame][selectedClass]['felyne']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/mhtri/monsters/${monsterInfo.icon}`;
            }
            if (selectedValues === 'MHTri Melynx') {
                monsterInfo = data[selectedGame][selectedClass]['melynx']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/mhtri/monsters/${monsterInfo.icon}`;
            }


            if (selectedValues === 'MHTri Altaroth') {
                monsterInfo = data[selectedGame][selectedClass]['altaroth']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/mhtri/monsters/${monsterInfo.icon}`;
            }
            if (selectedValues === 'MHTri Bnahabra') {
                monsterInfo = data[selectedGame][selectedClass]['bnahabra']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/mhtri/monsters/${monsterInfo.icon}`;
            }


            if (selectedValues === 'MHTri Delex') {
                monsterInfo = data[selectedGame][selectedClass]['delex']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/mhtri/monsters/${monsterInfo.icon}`;
            }

            // Output
            if (output === true) {
                thumbnailFile = new AttachmentBuilder(thumbnailPath);
                MHembed = new EmbedBuilder()
                    .setColor(0xFFFFFF)
                    .setTitle(`${monsterInfo.name}`)
                    .setDescription(`${monsterInfo.description}`)
                    .setThumbnail(`attachment://${monsterInfo.icon}`)
                    .addFields(
                        { name: 'Elements:', value: `${monsterInfo.elements}`, inline: true },
                        { name: 'Ailments:', value: `${monsterInfo.ailments}`, inline: true },
                        { name: 'Weakest to:', value: `${monsterInfo.weakness}`, inline: true },
                    );
                await interaction.editReply({ embeds: [MHembed], files: [thumbnailFile], components: [] });
            }
        });
    },
};
