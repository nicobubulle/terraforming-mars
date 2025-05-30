import {expect} from 'chai';
import {MassConverter} from '../../../src/server/cards/base/MassConverter';
import {TollStation} from '../../../src/server/cards/base/TollStation';
import {TestPlayer} from '../../TestPlayer';
import {fakeCard} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {testGame} from '../../TestGame';

describe('MassConverter', () => {
  let card: MassConverter;
  let player: TestPlayer;

  beforeEach(() => {
    card = new MassConverter();
    [/* game */, player] = testGame(2);
  });

  it('Can not play', () => {
    player.tagsForTest = {science: 4};
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play', () => {
    player.tagsForTest = {science: 5};
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    card.play(player);

    expect(player.production.energy).to.eq(6);
    expect(card.getCardDiscount(player, card)).to.eq(0);
    expect(card.getCardDiscount(player, new TollStation())).to.eq(2);

    const fake = fakeCard({tags: [Tag.SPACE, Tag.SPACE, Tag.SPACE, Tag.SPACE, Tag.SPACE]});
    expect(card.getCardDiscount(player, fake)).eq(2);
  });
});
