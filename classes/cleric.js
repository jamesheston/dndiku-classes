const clericlib = require('../lib/clericlib')

module.exports = srcPath => {
  return {
    name: 'cleric',
    description: `While they excel in defense, a cleric's greatest asset is their ability to bring out the best in their allies.` ,
    abilityTable: {
      // 1: { skills: ['protect', 'rescue', 'first aid'] },
      1: { spells: ['curelightwounds'] },
    },
    classXpTable: clericlib.classXpTable,

    // setupPlayer: player => {
    //   this runs every time a character enters the game, *not* during character creation
    // },

  }
}
