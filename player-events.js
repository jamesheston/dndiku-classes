'use strict';

const Combat = require('../dndiku-combat/lib/Combat');
const CombatErrors = require('../dndiku-combat/lib/CombatErrors');
const humanize = (sec) => { return require('humanize-duration')(sec, { round: true }); };
const fighterlib = require('../dndiku-classes/lib/fighterlib')

module.exports = srcPath => {
  const B = require(srcPath + 'Broadcast');
  const Logger = require(srcPath + 'Logger');
  const SkillErrors = require(srcPath + 'SkillErrors');

  return  {
    listeners: {
      useAbility: state => function (ability, args) {
        if (!this.playerClass.hasAbility(ability.id)) {
          return B.sayAt(this, `You don't know how to do that.` )
        }

        if (!this.playerClass.canUseAbility(this, ability.id)) {
          return B.sayAt(this, `You don't know how to do that.` )
        }

        let target = null;
        if (ability.requiresTarget) {
          if (!args || !args.length) {
            if (ability.targetSelf) {
              target = this;
            } else if (this.isInCombat()) {
              target = [...this.combatants][0];
            } else {
              target = null;
            }
          } else {
            try {
              const targetSearch = args.split(' ').pop();
              target = Combat.findCombatant(this, targetSearch);
            } catch (e) {
              if (
                e instanceof CombatErrors.CombatSelfError ||
                e instanceof CombatErrors.CombatNonPvpError ||
                e instanceof CombatErrors.CombatInvalidTargetError ||
                e instanceof CombatErrors.CombatPacifistError
              ) {
                return B.sayAt(this, e.message);
              }

              Logger.error(e.message);
            }
          }

          if (!target) {
            // return B.sayAt(this, `Use ${ability.name} on whom?`);
            return B.sayAt(this, `Use ${ability.name} on who or what?`)
          }
        }

        try {
          ability.execute(args, this, target);
        } catch (e) {
          if (e instanceof SkillErrors.CooldownError) {
            if (ability.cooldownGroup) {
              return B.sayAt(this, `Cannot use ${ability.name} while ${e.effect.skill.name} is on cooldown.`);
            }
            return B.sayAt(this, `${ability.name.slice(0,1).toUpperCase() + ability.name.slice(1)} is on cooldown. ${humanize(e.effect.remaining)} remaining.`);
          }

          if (e instanceof SkillErrors.PassiveError) {
            return B.sayAt(this, `That skill is passive.`);
          }

          if (e instanceof SkillErrors.NotEnoughResourcesError) {
            return B.sayAt(this, `You do not have enough resources.`);
          }

          Logger.error(e.message);
          B.sayAt(this, 'Huh?');
        }
      },

      /**
       * Handle player leveling up
       */
      level: state => function () {

        fighterlib.gainLevel(this)

        // const abilities = this.playerClass.abilityTable;
        // if (!(this.level in this.playerClass.abilityTable)) {
        //   return;
        // }

        // const newSkills = abilities[this.level].skills || [];
        // for (const abilityId of newSkills) {
        //   const skill = state.SkillManager.get(abilityId);
        //   B.sayAt(this, `<bold><yellow>You can now use skill: ${skill.name}.</yellow></bold>`);
        //   skill.activate(this);
        // }

        // const newSpells = abilities[this.level].spells || [];
        // for (const abilityId of newSpells) {
        //   const spell = state.SpellManager.get(abilityId);
        //   B.sayAt(this, `<bold><yellow>You can now use spell: ${spell.name}.</yellow></bold>`);
        // }
      }
    }
  };
};