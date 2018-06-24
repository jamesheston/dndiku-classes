/*
Burning Hands
-------------
(Alteration)
Range: 0
Duration: Instantaneous
Area of Effect: The caster
Components: V, S
Casting Time: 1
Saving Throw: _
When the wizard casts this spell, a jet of searing flame shoots from his fingertips. His
hands must be held so as to send forth a fanlike sheet of flames: The wizard's thumbs
must touch each other and the fingers must be spread. The burning hands send out flame
jets 5 feet long in a horizontal arc of about 120 degrees in front of the wizard. Any
creature in the area of the flames suffers 1d3 points of damage, plus 2 points for each
level of experience of the spellcaster, to a maximum of 1d3+20 points of fire damage.
Those successfully saving vs. spell receive half damage. Flammable materials touched by
the fire burn (for example, cloth, paper, parchment, thin wood, etc.). Such materials can
be extinguished in the next round if no other action is taken.
*/


module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast')
  const Damage = require(srcPath + 'Damage')
  const SkillType = require(srcPath + 'SkillType')
  const dndlib = require('../../dndiku-lib/lib/dndlib')

  const manaCost = 7

  function getDamage(player) {
    let suffix = 2 * player.level
    if( suffix > 20) {
      suffix = 20
    }
    return dndlib.rollDice(`1d3+${suffix}`)
  }

  return {
    name: 'burning hands',
    type: SkillType.SPELL,
    requiresTarget: true,
    initiatesCombat: true,
    resource: {
      attribute: 'mana',
      cost: manaCost,
    },
    // cooldown: 10,

    run: state => function (args, player, target) {
      const damage = new Damage({
        attribute: 'health',
        amount: getDamage(player),
        attacker: player,
        type: 'physical',
        source: this
      });

      Broadcast.sayAt(player, `<magenta>A jet of flames shoots from your hands, burning ${target.name}.</magenta>`)

      if (!target.isNpc) {
        Broadcast.sayAt(target, `<magenta>A jet of flames shoots from ${player.name}'s hands, burning you.</magenta>`)
      }
      Broadcast.sayAtExcept(player.room, `<magenta>A jet of flames shoots from ${player.name}'s hands, burning ${target.name}.</magenta>`, [player, target])
      
      damage.commit(target)
    },

    info: (player) => {
      return `Launch a jet of fire from your hands, burning a given target.`
    }
  };
};
