module.exports = (srcPath, bundlePath = '../../') => {
  const Broadcast = require(srcPath + 'Broadcast')
  const B = Broadcast
  const SkillType = require(srcPath + 'SkillType')  

  const Parser = require(srcPath + 'CommandParser').CommandParser;
  const ItemUtil = require(bundlePath + 'ranvier-lib/lib/ItemUtil');

  const warmup = 5

  return {
    name: 'pick lock',
    aliases: ['pick'],
    usage: 'pick <item> / <door direction>',
    type: SkillType.SKILL,
    requiresTarget: false,

    run: state => function( args, player) {

      const action = 'pick'
      let validTarget = false;
      if (!args || !args.length) {
        return B.sayAt(player, `What do you want to ${action}?`)
      }
      if (!player.room) {
        return B.sayAt(player, 'You cannot do that here.')
      }

      const parts = args.split(' ');

      let exitDirection = parts[0];
      if (parts[0] === 'door' && parts.length >= 2) {
        // Exit is in second parameter
        exitDirection = parts[1];
      }

      const directions = {
        north: [0, 1, 0],
        south: [0, -1, 0],
        east: [1, 0, 0],
        west: [-1, 0, 0],
        up: [0, 0, 1],
        down: [0, 0, -1],
      };

      for (const [dir, diff] of Object.entries(directions)) {
        if (dir.indexOf(exitDirection) !== 0) {
          continue;
        }

        exitDirection = dir;
        validTarget = true;
        const exit = state.RoomManager.findExit(player.room, exitDirection);
        let doorRoom = player.room;
        let nextRoom = null;
        let door = null;
        let targetRoom = null;

        if (exit) {
          nextRoom = state.RoomManager.getRoom(exit.roomId);
        } else {
          if (doorRoom.coordinates) {
            const coords = doorRoom.coordinates;
            const area = doorRoom.area;
            nextRoom = area.getRoomAtCoordinates(coords.x + diff[0], coords.y + diff[1], coords.z + diff[2]);
          }
        }

        if (nextRoom) {
          targetRoom = nextRoom;
          door = doorRoom.getDoor(targetRoom);
          if (!door) {
            doorRoom = nextRoom;
            targetRoom = player.room;
            door = doorRoom.getDoor(targetRoom);
          }
        }

        if (door) {
          switch (action) {
            case 'pick': {
              if (! door.closed) {
                return B.sayAt(player, "You need to close the door before you can pick the lock.")
              } 
              if (door.locked) {
                B.sayAt(player, `You begin to pick the lock open...`)
                Broadcast.sayAtExcept(player.room, `${player.name} begins fiddling with the lock on the ${exitDirection} door...`, [player])
                
                B.sayAt(player, `*Click* You disable the lock.`)
                Broadcast.sayAtExcept(player.room, `*Click* ${player.name} has disabled the lock on the ${exitDirection} door...`, [player])
                
                doorRoom.unlockDoor(targetRoom)
                return

              } else if (! door.locked) { // yes, explicit
                B.sayAt(player, `You begin to pick the lock shut...`)
                Broadcast.sayAtExcept(player.room, `${player.name} begins fiddling with the lock on the ${exitDirection} door...`, [player])
                
                B.sayAt(player, `*Click* You enable the lock.`)
                Broadcast.sayAtExcept(player.room, `*Click* ${player.name} has enabled the lock on the ${exitDirection} door...`, [player])
                
                doorRoom.lockDoor(targetRoom)
                return
              }

            }
          }
        }
      }

      // otherwise trying to open an item - this code has not yet been updated for pick
      let item = Parser.parseDot(args, player.inventory);
      item = item || Parser.parseDot(args, player.room.items);

      if (item) {
        validTarget = true;
        if (typeof item.closed == 'undefined' && typeof item.locked == 'undefined') {
          return B.sayAt(player, `${ItemUtil.display(item)} is not a container.`)
        }
        switch (action) {
          case 'open': {
            if (item.locked) {
              if (item.lockedBy) {
                const playerKey = player.hasItem(item.lockedBy);
                if (playerKey) {
                  B.sayAt(player, `*Click* You unlock ${ItemUtil.display(item)} with ${ItemUtil.display(playerKey)} and open it.`);
                  item.unlock();
                  item.open();
                  return;
                }
              }
              return B.sayAt(player, "The item is locked and you don't have the key.");
            }
            if (item.closed) {
              B.sayAt(player, `You open ${ItemUtil.display(item)}.`);
              return item.open();
            }
            return B.sayAt(player, `${ItemUtil.display(item)} isn't closed...`);
          }
          case 'close': {
            if (item.locked || item.closed) {
              return B.sayAt(player, "It's already closed.");
            }
            if (typeof item.closed == 'undefined') {
              return B.sayAt(player, "You can't close that.");
            }
            B.sayAt(player, `You close ${ItemUtil.display(item)}.`);
            return item.close();
          }
          case 'lock': {
            if (item.locked) {
              return B.sayAt(player, "It's already locked.");
            }
            if (!item.lockedBy) {
              return B.sayAt(player, `You can't lock ${ItemUtil.display(item)}.`);
            }
            const keyItem = state.ItemFactory.getDefinition(item.lockedBy);
            if (!keyItem) {
              return B.sayAt(player, `You can't lock ${ItemUtil.display(item)}.`);
            }
            const playerKey = player.hasItem(item.lockedBy);
            if (playerKey) {
              B.sayAt(player, `*click* You lock ${ItemUtil.display(item)} with ${ItemUtil.display(playerKey)}.`);
              return item.lock();
            }
            return B.sayAt(player, "The item is locked and you don't have the key.");
          }
          case 'unlock': {
            if (item.locked) {
              if (item.lockedBy) {
                const playerKey = player.hasItem(item.lockedBy);
                if (playerKey) {
                  B.sayAt(player, `*click* You unlock ${ItemUtil.display(item)} with ${ItemUtil.display(playerKey)}.`);
                  return item.unlock();
                } else {
                  return B.sayAt(player, "The item is locked and you don't have the key.");
                }
              } else {
                B.sayAt(player, `*Click* You unlock ${ItemUtil.display(item)}.`);
                return item.unlock();
              }
            }
            if (!item.closed) {
              return B.sayAt(player, `${ItemUtil.display(item)} isn't closed...`);
            }
            return B.sayAt(player, `${ItemUtil.display(item)} isn't locked...`);
          }
        }
      }

      if (validTarget) {
        return B.sayAt(player, `You can't ${action} this!`);
      } else {
        return B.sayAt(player, `You don't see ${args} here.`);
      }

    },

    info: (player) => {
      return `pick lock info`
    },

  }
}