import {expect} from 'chai';
import {RestrictedArea} from '../../../src/server/cards/base/RestrictedArea';
import {Viron} from '../../../src/server/cards/venusNext/Viron';
import {testGame} from '../../TestGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';
import {FocusedOrganization} from '../../../src/server/cards/prelude2/FocusedOrganization';

describe('Viron', () => {
  let card: Viron;
  let player: TestPlayer;

  beforeEach(() => {
    card = new Viron();
    [/* game */, player] = testGame(1);
  });

  it('Should act', () => {
    const action = card.play(player);

    cast(action, undefined);

    player.corporations.push(card);
    const restrictedArea = new RestrictedArea();
    player.playedCards.push(restrictedArea);
    player.actionsThisGeneration.add(restrictedArea.name);

    expect(card.canAct(player)).is.not.true;

    player.megaCredits += 2;

    expect(card.canAct(player)).is.true;

    const selectCard = cast(card.action(player), SelectCard);
    expect(selectCard.cards).deep.eq([restrictedArea]);
  });

  it('Cannot act once Viron is used', () => {
    card.play(player);

    player.corporations.push(card);
    const restrictedArea = new RestrictedArea();
    player.playedCards.push(restrictedArea);
    player.actionsThisGeneration.add(restrictedArea.name);
    player.actionsThisGeneration.add(card.name);
    player.megaCredits += 2;

    expect(card.canAct(player)).is.not.true;
  });

  it('Works with active preludes', () => {
    card.play(player);

    player.corporations.push(card);
    const focusedOrganization = new FocusedOrganization();

    expect(focusedOrganization.canAct(player)).is.false;

    player.cardsInHand.push(new RestrictedArea());
    player.megaCredits = 1;

    expect(focusedOrganization.canAct(player)).is.true;

    player.playedCards.push(focusedOrganization);
    player.actionsThisGeneration.add(focusedOrganization.name);

    expect(card.canAct(player)).is.true;
  });
});
