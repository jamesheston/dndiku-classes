const thieflib = require('../lib/thieflib')

module.exports = srcPath => {
  return {
    name: 'thief',
    description: 'Thieves rely on stealth, dexterity, and guile to achieve their ends.',
    abilityTable: {
      1: { skills: ['picklock', 'sneak', 'backstab'] },
    },
    classXpTable: thieflib.classXpTable,
    // setupPlayer: player => {
    //   this runs every time a character enters the game, *not* during character creation
    // },
  }
}
