module.exports = (srcPath, bundlePath = '../../') => {
  const Broadcast = require(srcPath + 'Broadcast')
  const SkillType = require(srcPath + 'SkillType')  

  warmup = 5

  return {
    name: 'hide',
    type: SkillType.SKILL,


    run: state => function( args, player, target ) {
      Broadcast.sayAt(player, `You look around for a place to hide...`)
      Broadcast.sayAtExcept(player.room, `${player.name} looks around carefully.`, [player])
    },

    info: (player) => {
      return `hide info`
    },

  }
}