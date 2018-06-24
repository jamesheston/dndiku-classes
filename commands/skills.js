'use strict';

const sprintf = require('sprintf-js').sprintf;

module.exports = srcPath => {
  const B = require(srcPath + 'Broadcast');
  const Logger = require(srcPath + 'Logger');

  return {
    aliases: ['abilities', 'spells', 'practice'],
    command: state => (args, player) => {
      const say = message => B.sayAt(player, message);
      // say("<b>" + B.center(80, 'Abilities', 'green'));
      // say("<b>" + B.line(80, '=', 'green'));

      for (const [ level, abilities ] of Object.entries(player.playerClass.abilityTable)) {
        abilities.skills = abilities.skills || [];
        abilities.spells = abilities.spells || [];

        if (!abilities.skills.length && !abilities.spells.length) {
          continue;
        }

        // say(`\r\n<bold>Level ${level}</bold>`);
        // say(B.line(50));

        let i = 0;
        if (abilities.skills.length) {
          say('Skills')
          say('------')
        }

        for (let skillId of abilities.skills) {
          let skill = state.SkillManager.get(skillId);

          if (!skill) {
            Logger.error(`Invalid skill in ability table: ${player.playerClass.name}:${level}:${skillId}`);
            continue;
          }

          let name = sprintf( skill.name )
          if (player.level >= level) {
            name = `${name}\n` // can use
          } else { 
            name = `<faint>${name}</faint>\n` // cant use
          }
          B.at(player, name)
          // if (++i % 3 === 0) {
          //   say();
          // }
        }

        if (abilities.spells.length) {
          say(`Mana  Spell`)
          say(`----  -----`)
        }

        for (let spellId of abilities.spells) {
          let spell = state.SpellManager.get(spellId);

          if (!spell) {
            Logger.error(`Invalid spell in ability table: ${player.playerClass.name}:${level}:${spellId}`);
            continue;
          }

          let col1 = '' + spell.resource.cost || '?'
          let line = ''
          const n = 5 - col1.length
          for( i = 0;i < n;i++ ) {
            col1 += ' '
          }

          if (player.level >= level) {
            line = `${col1} ${spell.name}\n` // can use
          } else { 
            line = `${col1} <faint>${spell.name}</faint>\n` // cant use
          }
          B.at(player, line)

          // if (++i % 3 === 0) {
          //   say();
          // }
        }

        // end with a line break
        say()
      }
    }
  };
};
