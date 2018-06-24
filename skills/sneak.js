/*
Sneak should have the following effects:
- other players dont notice movements
- mobs take twice as long to aggie. 
  - also, if u hide before this safety period ends, u can avoid getting aggied by mobs
  - later on, maybe sneak will work just as a call to "hide" skill handler, with lots of penalties to make it weak
- if(! player.metadata.isSneaking = true) { // then player will fail backstab. (this doesnt warn player, they just always fail/get noticed when sneak isnt toggled)  }

*/

module.exports = (srcPath, bundlePath = '../../') => {
  const Broadcast = require(srcPath + 'Broadcast')
  const SkillType = require(srcPath + 'SkillType')  

  warmup = 5

  return {
    name: 'sneak',
    type: SkillType.SKILL,
    requiresTarget: false,

    run: state => function( args, player, target ) {
      if( player.getMeta('isSneaking') ) {
        player.setMeta('isSneaking', false)
        Broadcast.sayAt(player, `You stop trying to conceal your movements.`)        
      } else {
        player.setMeta('isSneaking', true)
        Broadcast.sayAt(player, `You will attempt to move unseen.`)   
        // Broadcast.sayAt(player, `You will now try to move undetected.`)   
      }

    },

    info: (player) => {
      return `sneak info`
    },
    
  }
}