const fighterlib = require('../lib/fighterlib')

module.exports = srcPath => {
  return {
    name: 'fighter',
    description: 'Fighters are experts in weapons, armors, and close combat.',
    abilityTable: {
      1: { skills: ['bash', 'protect', 'rescue', 'weapon focus', 'first aid'] },
    },
    classXpTable: fighterlib.classXpTable,
    // setupPlayer: player => {
    //   this runs every time a character enters the game, *not* during character creation
    // },

  }
}
