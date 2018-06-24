/**
 * Basic heal spell
 */
const dndlib = require('../../dndiku-lib/lib/dndlib')

module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast')
  const Heal = require(srcPath + 'Heal')
  const SkillType = require(srcPath + 'SkillType')

  const manaCost = 10

  return {
    name: 'cure light wounds',
    type: SkillType.SPELL,
    initiatesCombat: false,
    requiresTarget: true,
    targetSelf: true,
    resource: {
      attribute: 'mana',
      cost: manaCost,
    },
    // cooldown,

    run: state => function (args, player, target) {
      const maxHealth = target.getMaxAttribute('health')
      let amount = generateAmount()

      const heal = new Heal({
        attribute: 'health',
        amount,
        attacker: target === player ? null : player,
        source: this
      });

      if (target !== player) {
        Broadcast.sayAt(player, `<magenta>You recite a brief rite of mercy on ${target.name}'s behalf, and they appear a little healthier.</magenta>`)
        Broadcast.sayAtExcept(player.room, `<magenta>${player.name} recites a brief rite of mercy on ${target.name}'s behalf, who now seems a little healthier.</magenta>`, [target, player])
        Broadcast.sayAt(target, `<magenta>${player.name} recites a brief rite of mercy on you, and you feel a little healthier.</magenta>`)
      } else {
        Broadcast.sayAt(player, "<magenta>You recite a brief rite of mercy on your own behalf, and feel a little better. </magenta>")
        Broadcast.sayAtExcept(player.room, `<magenta>${player.name} recites a brief rite of mercy on their own behalf, and now looks a little healthier.</magenta>`, [player, target])
      }

      heal.commit(target);

      function generateAmount() {
        return dndlib.rollDice('1d8')
      }
    },

    info: (player) => {
      return `Restores a small amount of hitpoints on the caster or a specified target.`
    }
  }
}
