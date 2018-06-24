module.exports = (srcPath, bundlePath = '../../') => {
  const Broadcast = require(srcPath + 'Broadcast')
  const SkillType = require(srcPath + 'SkillType')  

  warmup = 5

  return {
    name: 'sneak',
    type: SkillType.SKILL,

    run: state => function( args, player, target ) {
      player.setMeta('isSneaking', true)
      Broadcast.sayAt(player, `You will now try to move undetected.`)
    },

    info: (player) => {
      return `peek info`
    },

  }
}