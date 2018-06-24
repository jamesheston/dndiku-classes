const Combat = require('../../dndiku-combat/lib/Combat')

module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast')
  const SkillType = require(srcPath + 'SkillType')
  // const Damage = require(srcPath + 'Damage');

  const warmup = 5
  const cooldown = 11 // cooldown in seconds
  const stunTime = 10000 // in ms. roughly 2 rounds? maybe some randomness? 

  return {
    name: 'bash',
    requiresTarget: true,
    initiatesCombat: true,
    cooldown,

    run: state => function (args, player, target) {
      // const damage = new Damage({
      //   attribute: 'health',
      //   amount: 1,
      //   attacker: player,
      //   source: this
      // });

      Broadcast.sayAt(player, `You bash ${target.name}, stunning them momentarily.`)
      Broadcast.sayAtExcept(player.room, `${player.name}'s bashes ${target.name}, stunning them momentarily.`, [target, player])
      Broadcast.sayAt(target, `${player.name}' bashes you, leaving you momentarily stunned.`)
      // 1. deal 1 point of damage
      // damage.commit(target)
      // 2. stun opponent
      target.combatData.lag = stunTime
    },

    info: (player) => {
      return `Attempt to bash your opponent, leaving them stunned momentarily, unable to attack or take most other actions.`
    }
  };
};
