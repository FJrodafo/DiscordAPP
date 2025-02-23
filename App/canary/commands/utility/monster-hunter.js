const {
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    AttachmentBuilder,
    EmbedBuilder,
    ComponentType,
} = require('discord.js');
const path = require('path');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('monster-hunter')
        .setDescription('Monster ecodata!')
        .setDMPermission(false),
    async execute(interaction) {
        const embedJsonPath = './../../database/monster-hunter/embed.json';
        const menuJsonPath = './../../database/monster-hunter/menu.json';
        const embedData = require(embedJsonPath);
        const menuData = require(menuJsonPath);
        // Variables
        let selectedGame, selectedClass, selectedMonster, monsterInfo, thumbnailPath, thumbnailFile, MHembed, output = false;
        // Main Menu
        const mainMenu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('Main Menu').setPlaceholder('Select the game!').addOptions(
                menuData.games.map((game) =>
                    new StringSelectMenuOptionBuilder().setLabel(game.label).setDescription(game.description).setValue(game.value),
                ),
            ),
        );
        // Monster Hunter Freedom Unite
        const MHFU = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('MHFU').setPlaceholder('Select the monster class!').addOptions(
                menuData.mhfu.monster_classes.map((mhfu_monster_class) =>
                    new StringSelectMenuOptionBuilder().setLabel(mhfu_monster_class.label).setDescription(mhfu_monster_class.description).setValue(mhfu_monster_class.value),
                ),
            ),
        );
        const MHFUlynians = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('MHFUlynians').setPlaceholder('Select the monster!').addOptions(
                menuData.mhfu.lynians.map((mhfu_lynian) =>
                    new StringSelectMenuOptionBuilder().setLabel(mhfu_lynian.label).setDescription(mhfu_lynian.description).setValue(mhfu_lynian.value),
                ),
            ),
        );
        const MHFUneopterons = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('MHFUneopterons').setPlaceholder('Select the monster!').addOptions(
                menuData.mhfu.neopterons.map((mhfu_neopteron) =>
                    new StringSelectMenuOptionBuilder().setLabel(mhfu_neopteron.label).setDescription(mhfu_neopteron.description).setValue(mhfu_neopteron.value),
                ),
            ),
        );
        const MHFUpiscineWyverns = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('MHFUpiscineWyverns').setPlaceholder('Select the monster!').addOptions(
                menuData.mhfu.piscine_wyverns.map((mhfu_piscine_wyvern) =>
                    new StringSelectMenuOptionBuilder().setLabel(mhfu_piscine_wyvern.label).setDescription(mhfu_piscine_wyvern.description).setValue(mhfu_piscine_wyvern.value),
                ),
            ),
        );
        // Monster Hunter 3rd
        const MHP3rd = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('MHP3rd').setPlaceholder('Select the monster class!').addOptions(
                menuData.mhp3rd.monster_classes.map((mhp3rd_monster_class) =>
                    new StringSelectMenuOptionBuilder().setLabel(mhp3rd_monster_class.label).setDescription(mhp3rd_monster_class.description).setValue(mhp3rd_monster_class.value),
                ),
            ),
        );
        const MHP3rdLynians = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('MHP3rdLynians').setPlaceholder('Select the monster!').addOptions(
                menuData.mhp3rd.lynians.map((mhp3rd_lynian) =>
                    new StringSelectMenuOptionBuilder().setLabel(mhp3rd_lynian.label).setDescription(mhp3rd_lynian.description).setValue(mhp3rd_lynian.value),
                ),
            ),
        );
        const MHP3rdNeopterons = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('MHP3rdNeopterons').setPlaceholder('Select the monster!').addOptions(
                menuData.mhp3rd.neopterons.map((mhp3rd_neopteron) =>
                    new StringSelectMenuOptionBuilder().setLabel(mhp3rd_neopteron.label).setDescription(mhp3rd_neopteron.description).setValue(mhp3rd_neopteron.value),
                ),
            ),
        );
        const MHP3rdPiscineWyverns = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('MHP3rdPiscineWyverns').setPlaceholder('Select the monster!').addOptions(
                menuData.mhp3rd.piscine_wyverns.map((mhp3rd_piscine_wyvern) =>
                    new StringSelectMenuOptionBuilder().setLabel(mhp3rd_piscine_wyvern.label).setDescription(mhp3rd_piscine_wyvern.description).setValue(mhp3rd_piscine_wyvern.value),
                ),
            ),
        );
        // Monster Hunter Tri
        const MHTri = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('MHTri').setPlaceholder('Select the monster class!').addOptions(
                menuData.mhtri.monster_classes.map((mhtri_monster_class) =>
                    new StringSelectMenuOptionBuilder().setLabel(mhtri_monster_class.label).setDescription(mhtri_monster_class.description).setValue(mhtri_monster_class.value),
                ),
            ),
        );
        const MHTriLynians = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('MHTriLynians').setPlaceholder('Select the monster!').addOptions(
                menuData.mhtri.lynians.map((mhtri_lynian) =>
                    new StringSelectMenuOptionBuilder().setLabel(mhtri_lynian.label).setDescription(mhtri_lynian.description).setValue(mhtri_lynian.value),
                ),
            ),
        );
        const MHTriNeopterons = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('MHTriNeopterons').setPlaceholder('Select the monster!').addOptions(
                menuData.mhtri.neopterons.map((mhtri_neopteron) =>
                    new StringSelectMenuOptionBuilder().setLabel(mhtri_neopteron.label).setDescription(mhtri_neopteron.description).setValue(mhtri_neopteron.value),
                ),
            ),
        );
        const MHTriPiscineWyvern = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('MHTriPiscineWyvern').setPlaceholder('Select the monster!').addOptions(
                menuData.mhtri.piscine_wyverns.map((mhtri_piscine_wyvern) =>
                    new StringSelectMenuOptionBuilder().setLabel(mhtri_piscine_wyvern.label).setDescription(mhtri_piscine_wyvern.description).setValue(mhtri_piscine_wyvern.value),
                ),
            ),
        );
        // First message
        const iconPath = path.resolve(__dirname, './../../assets/monster-hunter/Monster_Hunter.png');
        const iconFile = new AttachmentBuilder(iconPath);
        const mainEmbed = new EmbedBuilder().setColor(0x000000).setImage('attachment://Monster_Hunter.png');
        const reply = await interaction.reply({ embeds: [mainEmbed], files: [iconFile], components: [mainMenu], ephemeral: true });
        // Collector
        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            filter: (i) => i.user.id === interaction.user.id,
            time: 60_000,
        });
        collector.on('collect', async (i) => {
            await i.deferUpdate();
            const selectedValues = i.values[0];
            // Main Menu
            if (i.customId === 'Main Menu') {
                selectedGame = selectedValues;
                if (selectedGame === 'mhfu') await interaction.editReply({ components: [MHFU] });
                if (selectedGame === 'mhp3rd') await interaction.editReply({ components: [MHP3rd] });
                if (selectedGame === 'mhtri') await interaction.editReply({ components: [MHTri] });
            }
            // Monster Hunter Freedom Unite
            if (i.customId === 'MHFU') {
                selectedClass = selectedValues;
                if (selectedClass === 'lynian') await interaction.editReply({ components: [MHFUlynians] });
                if (selectedClass === 'neopteron') await interaction.editReply({ components: [MHFUneopterons] });
                if (selectedClass === 'piscine_wyvern') await interaction.editReply({ components: [MHFUpiscineWyverns] });
            }
            // Monster Hunter 3rd
            if (i.customId === 'MHP3rd') {
                selectedClass = selectedValues;
                if (selectedClass === 'lynian') await interaction.editReply({ components: [MHP3rdLynians] });
                if (selectedClass === 'neopteron') await interaction.editReply({ components: [MHP3rdNeopterons] });
                if (selectedClass === 'piscine_wyvern') await interaction.editReply({ components: [MHP3rdPiscineWyverns] });
            }
            // Monster Hunter Tri
            if (i.customId === 'MHTri') {
                selectedClass = selectedValues;
                if (selectedClass === 'lynian') await interaction.editReply({ components: [MHTriLynians] });
                if (selectedClass === 'neopteron') await interaction.editReply({ components: [MHTriNeopterons] });
                if (selectedClass === 'piscine_wyvern') await interaction.editReply({ components: [MHTriPiscineWyvern] });
            }
            // Output
            if (
                i.customId === 'MHFUlynians' || i.customId === 'MHP3rdLynians' || i.customId === 'MHTriLynians' ||
                i.customId === 'MHFUneopterons' || i.customId === 'MHP3rdNeopterons' || i.customId === 'MHTriNeopterons' ||
                i.customId === 'MHFUpiscineWyverns' || i.customId === 'MHP3rdPiscineWyverns' || i.customId === 'MHTriPiscineWyvern'
            ) {
                selectedMonster = selectedValues;
                monsterInfo = embedData[selectedGame][selectedClass][selectedMonster]; output = true;
                thumbnailPath = path.resolve(__dirname, `./../../assets/monster-hunter/${selectedGame}/monsters/${monsterInfo.icon}`);
            }
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
        collector.on('end', async () => {
            await interaction.editReply({ components: [] });
        });
    },
};
