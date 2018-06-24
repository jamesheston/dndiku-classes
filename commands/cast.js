'use strict';

module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');

  return {
    command : state => (args, player) => {

      /*
      // Player must be standing to cast
      */
      var regenStance = player.getMeta('regenStance')
      if (regenStance && regenStance !== 'stand' ) {
        let failMsg = ''
        
        if( regenStance === 'rest' ) {
          failMsg = 'You must stand up first!'

        } else if (regenStance === 'sleep') {
          failMsg = 'You are fast asleep!'

        }
        return B.sayAt(player, failMsg)
      }


      // match cast "fireball" target
      const match = args.match(/^(['"])([^\1]+)+\1(?:$|\s+(.+)$)/);
      if (!match) {
        return Broadcast.sayAt(player, "Casting spells must be surrounded in quotes e.g., cast 'fireball' target");
      }

      const [ , , spellName, targetArgs] = match;
      const spell = state.SpellManager.find(spellName);

      if (!spell) {
        return Broadcast.sayAt(player, "No such spell.");
      }

      player.queueCommand({
        execute: _ => {
          player.emit('useAbility', spell, targetArgs);
        },
        label: `cast ${args}`,
      }, spell.lag || state.Config.get('skillLag') || 1000);
    }
  };
};
