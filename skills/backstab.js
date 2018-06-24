const Combat = require('../../dndiku-combat/lib/Combat');

/**
 * Basic warrior attack
 */
module.exports = (srcPath, bundlePath = '../../') => {
  const Broadcast = require(srcPath + 'Broadcast');
  const Damage = require(srcPath + 'Damage');
  const SkillType = require(srcPath + 'SkillType');

  const damagePercent = 250;
  const staminaCost = 1;

  // function getDamage(player) {
  //   return Combat.calculateWeaponDamage(player) * (damagePercent / 100);
  // }

  function getDamage(player) {
    return 1
  }

  return {
    name: 'backstab',
    type: SkillType.SKILL,
    requiresTarget: true,
    initiatesCombat: true,

    run: state => function (args, player, target) {
      const damage = new Damage({
        attribute: 'health',
        amount: getDamage(player),
        attacker: player,
        type: 'physical',
        source: this
      });

      Broadcast.sayAt(player, '<red>You shift your feet and let loose a mighty attack!</red>');
      Broadcast.sayAtExcept(player.room, `<red>${player.name} lets loose a lunging attack on ${target.name}!</red>`, [player, target]);
      if (!target.isNpc) {
        Broadcast.sayAt(target, `<red>${player.name} lunges at you with a fierce attack!</red>`);
      }
      damage.commit(target);
    },

    info: (player) => {
      return `While sneaking, a thief can attempt to backstab their target for extra damage.`;
    }
  };
};
