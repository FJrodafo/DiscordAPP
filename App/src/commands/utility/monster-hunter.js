const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ComponentType, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const jsonPath = './../../data/monster-hunter.json';
const data = require(jsonPath);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('monster-hunter')
        .setDescription('Monster ecodata!'),
    async execute(interaction) {
        // Variables
        let monsterInfo, thumbnailPath, thumbnailFile, MHembed, output = false;

        // Main Menu
        const mainMenu = new StringSelectMenuBuilder().setCustomId('mainMenu').setPlaceholder('Select the game!').addOptions(
            new StringSelectMenuOptionBuilder().setLabel('Monster Hunter Freedom Unite').setDescription('Flagship Monster: Nargacuga').setValue('MHFU'),
            new StringSelectMenuOptionBuilder().setLabel('Monster Hunter Portable 3rd').setDescription('Flagship Monster: Zinogre').setValue('MHP3rd'),
            new StringSelectMenuOptionBuilder().setLabel('Monster Hunter Tri').setDescription('Flagship Monster: Lagiacrus').setValue('MHTri'),
        );
        const mainMenuRow = new ActionRowBuilder().addComponents(mainMenu);
        // ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                                                                                   //
        // Monster Hunter Freedom Unite                                                                      //
        //                                                                                                   //
        // ////////////////////////////////////////////////////////////////////////////////////////////////////
        const MHFU = new StringSelectMenuBuilder().setCustomId('MHFU').setPlaceholder('Select the monster class!').addOptions(
            new StringSelectMenuOptionBuilder().setLabel('Lynian').setDescription('獣人種 (Jūjinshu)').setValue('MHFU Lynian'),
            new StringSelectMenuOptionBuilder().setLabel('Neopteron').setDescription('甲虫種 (Kōchūshu)').setValue('MHFU Neopteron'),
        );
        const MHFUlynian = new StringSelectMenuBuilder().setCustomId('MHFUlynian').setPlaceholder('Select the monster!').addOptions(
            new StringSelectMenuOptionBuilder().setLabel('Felyne').setDescription('アイルー (Airū)').setValue('MHFU Felyne'),
            new StringSelectMenuOptionBuilder().setLabel('Melynx').setDescription('メラルー (Merarū)').setValue('MHFU Melynx'),
            new StringSelectMenuOptionBuilder().setLabel('Shakalaka').setDescription('チャチャブー (Chachabū)').setValue('MHFU Shakalaka'),
            new StringSelectMenuOptionBuilder().setLabel('King Shakalaka').setDescription('キングチャチャブー (Kingu Chachabū)').setValue('MHFU King Shakalaka'),
        );
        const MHFUneopteron = new StringSelectMenuBuilder().setCustomId('MHFUneopteron').setPlaceholder('Select the monster!').addOptions(
            new StringSelectMenuOptionBuilder().setLabel('Vespoid').setDescription('ランゴスタ (Rangosuta)').setValue('MHFU Vespoid'),
            new StringSelectMenuOptionBuilder().setLabel('Vespoid Queen').setDescription('クイーンランゴスタ (Kuīn Rangosuta)').setValue('MHFU Vespoid Queen'),
            new StringSelectMenuOptionBuilder().setLabel('Hornetaur').setDescription('カンタロス (Kantarosu)').setValue('MHFU Hornetaur'),
            new StringSelectMenuOptionBuilder().setLabel('Great Thunderbug').setDescription('大雷光虫 (Dai Raikō Mushi)').setValue('MHFU Great Thunderbug'),
        );
        const MHFUrow = new ActionRowBuilder().addComponents(MHFU);
        const MHFUlynianRow = new ActionRowBuilder().addComponents(MHFUlynian);
        const MHFUneopteronRow = new ActionRowBuilder().addComponents(MHFUneopteron);
        // ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                                                                                   //
        // Monster Hunter 3rd                                                                                //
        //                                                                                                   //
        // ////////////////////////////////////////////////////////////////////////////////////////////////////
        const MHP3rd = new StringSelectMenuBuilder().setCustomId('MHP3rd').setPlaceholder('Select the monster class!').addOptions(
            new StringSelectMenuOptionBuilder().setLabel('Lynian').setDescription('獣人種 (Jūjinshu)').setValue('MHP3rd Lynian'),
            new StringSelectMenuOptionBuilder().setLabel('Neopteron').setDescription('甲虫種 (Kōchūshu)').setValue('MHP3rd Neopteron'),
            new StringSelectMenuOptionBuilder().setLabel('Piscine Wyvern').setDescription('魚竜種 (Gyoryūshu)').setValue('MHP3rd Piscine Wyvern'),
        );
        const MHP3rdLynian = new StringSelectMenuBuilder().setCustomId('MHP3rdLynian').setPlaceholder('Select the monster!').addOptions(
            new StringSelectMenuOptionBuilder().setLabel('Felyne').setDescription('アイルー (Airū)').setValue('MHP3rd Felyne'),
            new StringSelectMenuOptionBuilder().setLabel('Melynx').setDescription('メラルー (Merarū)').setValue('MHP3rd Melynx'),
        );
        const MHP3rdNeopteron = new StringSelectMenuBuilder().setCustomId('MHP3rdNeopteron').setPlaceholder('Select the monster!').addOptions(
            new StringSelectMenuOptionBuilder().setLabel('Altaroth').setDescription('オルタロス (Orutarosu)').setValue('MHP3rd Altaroth'),
            new StringSelectMenuOptionBuilder().setLabel('Bnahabra').setDescription('ブナハブラ (Bunahabura)').setValue('MHP3rd Bnahabra'),
        );
        const MHP3rdPiscineWyvern = new StringSelectMenuBuilder().setCustomId('MHP3rdPiscineWyvern').setPlaceholder('Select the monster!').addOptions(
            new StringSelectMenuOptionBuilder().setLabel('Delex').setDescription('デルクス (Derukusu)').setValue('MHP3rd Delex'),
        );
        const MHP3rdRow = new ActionRowBuilder().addComponents(MHP3rd);
        const MHP3rdLynianRow = new ActionRowBuilder().addComponents(MHP3rdLynian);
        const MHP3rdNeopteronRow = new ActionRowBuilder().addComponents(MHP3rdNeopteron);
        const MHP3rdPiscineWyvernRow = new ActionRowBuilder().addComponents(MHP3rdPiscineWyvern);
        // ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                                                                                   //
        // Monster Hunter Tri                                                                                //
        //                                                                                                   //
        // ////////////////////////////////////////////////////////////////////////////////////////////////////
        const MHTri = new StringSelectMenuBuilder().setCustomId('MHTri').setPlaceholder('Select the monster class!').addOptions(
            new StringSelectMenuOptionBuilder().setLabel('Lynian').setDescription('獣人種 (Jūjinshu)').setValue('MHTri Lynian'),
            new StringSelectMenuOptionBuilder().setLabel('Neopteron').setDescription('甲虫種 (Kōchūshu)').setValue('MHTri Neopteron'),
            new StringSelectMenuOptionBuilder().setLabel('Piscine Wyvern').setDescription('魚竜種 (Gyoryūshu)').setValue('MHTri Piscine Wyvern'),
        );
        const MHTriLynian = new StringSelectMenuBuilder().setCustomId('MHTriLynian').setPlaceholder('Select the monster!').addOptions(
            new StringSelectMenuOptionBuilder().setLabel('Felyne').setDescription('アイルー (Airū)').setValue('MHTri Felyne'),
            new StringSelectMenuOptionBuilder().setLabel('Melynx').setDescription('メラルー (Merarū)').setValue('MHTri Melynx'),
        );
        const MHTriNeopteron = new StringSelectMenuBuilder().setCustomId('MHTriNeopteron').setPlaceholder('Select the monster!').addOptions(
            new StringSelectMenuOptionBuilder().setLabel('Altaroth').setDescription('オルタロス (Orutarosu)').setValue('MHTri Altaroth'),
            new StringSelectMenuOptionBuilder().setLabel('Bnahabra').setDescription('ブナハブラ (Bunahabura)').setValue('MHTri Bnahabra'),
        );
        const MHTriPiscineWyvern = new StringSelectMenuBuilder().setCustomId('MHTriPiscineWyvern').setPlaceholder('Select the monster!').addOptions(
            new StringSelectMenuOptionBuilder().setLabel('Delex').setDescription('デルクス (Derukusu)').setValue('MHTri Delex'),
        );
        const MHTriRow = new ActionRowBuilder().addComponents(MHTri);
        const MHTriLynianRow = new ActionRowBuilder().addComponents(MHTriLynian);
        const MHTriNeopteronRow = new ActionRowBuilder().addComponents(MHTriNeopteron);
        const MHTriPiscineWyvernRow = new ActionRowBuilder().addComponents(MHTriPiscineWyvern);

        // First message
        const iconPath = './../../assets/monster-hunter/Monster_Hunter.png';
        const iconFile = new AttachmentBuilder(iconPath);
        const mainEmbed = new EmbedBuilder().setColor(0x000000).setImage('attachment://Monster_Hunter.png');
        const reply = await interaction.reply({ embeds: [mainEmbed], files: [iconFile], components: [mainMenuRow] });

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            filter: (i) => i.user.id === interaction.user.id,
            time: 60_000,
        });

        collector.on('collect', async (i) => {
            await i.deferUpdate();
            const selectedValue = i.values[0];

            // Main Menu - Select the game!
            if (selectedValue === 'MHFU') await interaction.editReply({ components: [MHFUrow] });
            if (selectedValue === 'MHP3rd') await interaction.editReply({ components: [MHP3rdRow] });
            if (selectedValue === 'MHTri') await interaction.editReply({ components: [MHTriRow] });
            // ////////////////////////////////////////////////////////////////////////////////////////////////////
            //                                                                                                   //
            // Monster Hunter Freedom Unite                                                                      //
            //                                                                                                   //
            // ////////////////////////////////////////////////////////////////////////////////////////////////////
            if (selectedValue === 'MHFU Lynian') await interaction.editReply({ components: [MHFUlynianRow] });
            if (selectedValue === 'MHFU Felyne') {
                monsterInfo = data['MHFU']['Lynian']['Felyne']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/mhfu/monsters/${monsterInfo.Icon}`;
            }
            if (selectedValue === 'MHFU Melynx') {
                monsterInfo = data['MHFU']['Lynian']['Melynx']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/mhfu/monsters/${monsterInfo.Icon}`;
            }
            if (selectedValue === 'MHFU Shakalaka') {
                monsterInfo = data['MHFU']['Lynian']['Shakalaka']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/mhfu/monsters/${monsterInfo.Icon}`;
            }
            if (selectedValue === 'MHFU King Shakalaka') {
                monsterInfo = data['MHFU']['Lynian']['King Shakalaka']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/mhfu/monsters/${monsterInfo.Icon}`;
            }
            if (selectedValue === 'MHFU Neopteron') await interaction.editReply({ components: [MHFUneopteronRow] });
            if (selectedValue === 'MHFU Vespoid') {
                monsterInfo = data['MHFU']['Neopteron']['Vespoid']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/mhfu/monsters/${monsterInfo.Icon}`;
            }
            if (selectedValue === 'MHFU Vespoid Queen') {
                monsterInfo = data['MHFU']['Neopteron']['Vespoid Queen']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/mhfu/monsters/${monsterInfo.Icon}`;
            }
            if (selectedValue === 'MHFU Hornetaur') {
                monsterInfo = data['MHFU']['Neopteron']['Hornetaur']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/mhfu/monsters/${monsterInfo.Icon}`;
            }
            if (selectedValue === 'MHFU Great Thunderbug') {
                monsterInfo = data['MHFU']['Neopteron']['Great Thunderbug']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/mhfu/monsters/${monsterInfo.Icon}`;
            }
            // ////////////////////////////////////////////////////////////////////////////////////////////////////
            //                                                                                                   //
            // Monster Hunter 3rd                                                                                //
            //                                                                                                   //
            // ////////////////////////////////////////////////////////////////////////////////////////////////////
            if (selectedValue === 'MHP3rd Lynian') await interaction.editReply({ components: [MHP3rdLynianRow] });
            if (selectedValue === 'MHP3rd Felyne') {
                monsterInfo = data['MHP3rd']['Lynian']['Felyne']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/mhp3rd/monsters/${monsterInfo.Icon}`;
            }
            if (selectedValue === 'MHP3rd Melynx') {
                monsterInfo = data['MHP3rd']['Lynian']['Melynx']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/mhp3rd/monsters/${monsterInfo.Icon}`;
            }
            if (selectedValue === 'MHP3rd Neopteron') await interaction.editReply({ components: [MHP3rdNeopteronRow] });
            if (selectedValue === 'MHP3rd Altaroth') {
                monsterInfo = data['MHP3rd']['Neopteron']['Altaroth']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/mhp3rd/monsters/${monsterInfo.Icon}`;
            }
            if (selectedValue === 'MHP3rd Bnahabra') {
                monsterInfo = data['MHP3rd']['Neopteron']['Bnahabra']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/mhp3rd/monsters/${monsterInfo.Icon}`;
            }
            if (selectedValue === 'MHP3rd Piscine Wyvern') await interaction.editReply({ components: [MHP3rdPiscineWyvernRow] });
            if (selectedValue === 'MHP3rd Delex') {
                monsterInfo = data['MHP3rd']['Piscine Wyvern']['Delex']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/mhp3rd/monsters/${monsterInfo.Icon}`;
            }
            // ////////////////////////////////////////////////////////////////////////////////////////////////////
            //                                                                                                   //
            // Monster Hunter Tri                                                                                //
            //                                                                                                   //
            // ////////////////////////////////////////////////////////////////////////////////////////////////////
            if (selectedValue === 'MHTri Lynian') await interaction.editReply({ components: [MHTriLynianRow] });
            if (selectedValue === 'MHTri Felyne') {
                monsterInfo = data['MHTri']['Lynian']['Felyne']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/mhtri/monsters/${monsterInfo.Icon}`;
            }
            if (selectedValue === 'MHTri Melynx') {
                monsterInfo = data['MHTri']['Lynian']['Melynx']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/mhtri/monsters/${monsterInfo.Icon}`;
            }
            if (selectedValue === 'MHTri Neopteron') await interaction.editReply({ components: [MHTriNeopteronRow] });
            if (selectedValue === 'MHTri Altaroth') {
                monsterInfo = data['MHTri']['Neopteron']['Altaroth']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/mhtri/monsters/${monsterInfo.Icon}`;
            }
            if (selectedValue === 'MHTri Bnahabra') {
                monsterInfo = data['MHTri']['Neopteron']['Bnahabra']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/mhtri/monsters/${monsterInfo.Icon}`;
            }
            if (selectedValue === 'MHTri Piscine Wyvern') await interaction.editReply({ components: [MHTriPiscineWyvernRow] });
            if (selectedValue === 'MHTri Delex') {
                monsterInfo = data['MHTri']['Piscine Wyvern']['Delex']; output = true;
                thumbnailPath = `./../../assets/monster-hunter/mhtri/monsters/${monsterInfo.Icon}`;
            }

            // Output
            if (output === true) {
                thumbnailFile = new AttachmentBuilder(thumbnailPath);
                MHembed = new EmbedBuilder().setColor(0xFFFFFF).setTitle(`${monsterInfo.Name}`).setDescription(`${monsterInfo.Description}`).setThumbnail(`attachment://${monsterInfo.Icon}`).addFields(
                    { name: 'Elements:', value: `${monsterInfo.Elements}`, inline: true },
                    { name: 'Ailments:', value: `${monsterInfo.Ailments}`, inline: true },
                    { name: 'Weakest to:', value: `${monsterInfo.Weakness}`, inline: true },
                );
                await interaction.editReply({ embeds: [MHembed], files: [thumbnailFile], components: [] });
            }
        });
    },
};
