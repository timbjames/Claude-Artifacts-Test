import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { MAX_WEEK_OFFSET, MIN_WEEK_OFFSET, oldestKeptWeekKey, weekKey, weekRange, weekTag } from '../lib/week';
import { eatersOf, picksFor, tally } from '../wishlist/helpers';
import { WISH_MAX } from '../wishlist/types';
import type { Wishlist } from '../wishlist/useWishlist';
import type { Recipe } from '../types';
import { hueStyle, Thumb } from './Dish';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from './icons';

interface Props {
  byId: (id: string) => Recipe | undefined;
  now: Date;
  weekOffset: number;
  setWeekOffset: (n: number) => void;
  wl: Wishlist;
  profileName: string;
  activeK: string;
  setActiveK: (k: string) => void;
  onPick: () => void;
  onOpen: (id: string) => void;
}

export function personNameFor(wl: Pick<Wishlist, 'myId' | 'names'>, profileName: string) {
  return (id: string): string => {
    const known = wl.names[id];
    if (id === wl.myId) return known || profileName.trim() || 'Me';
    return known || 'Someone';
  };
}

export function Week(p: Props) {
  const { wl, now, weekOffset } = p;
  const wk = weekKey(now, weekOffset);
  const nameOf = personNameFor(wl, p.profileName);
  const exists = (id: string) => p.byId(id) !== undefined;
  const ers = eatersOf(nameOf(wl.myId), wl.myDoc);
  const ae = ers.find(e => e.k === p.activeK) ?? ers[0];
  const ids = picksFor(wl.myDoc, wk, ae.k, exists);
  const oldest = oldestKeptWeekKey(now);

  const [newName, setNewName] = useState('');
  const [removeArmed, setRemoveArmed] = useState('');
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => { setRemoveArmed(''); }, [weekOffset, p.activeK]);

  const docs = { ...wl.docs, [wl.myId]: wl.myDoc };
  const { counts, quiet } = tally(docs, wk, nameOf, exists);
  const rows = Object.keys(counts)
    .map(id => p.byId(id))
    .filter((r): r is Recipe => r !== undefined)
    .sort((a, b) => counts[b.id].length - counts[a.id].length || a.name.localeCompare(b.name));

  let note: string;
  let alert = false;
  if (wl.syncError) { note = 'Live updates stopped. Reload the page to reconnect.'; alert = true; }
  else if (wl.writeError) { note = 'Your last change could not be saved. Check your connection and try again.'; alert = true; }
  else if (wl.readOnly) {
    note = (wl.rejected ? 'Your pick was not saved, so nobody else can see it. ' : '') +
      "You can see the family's picks but not add your own. Ask the owner to give you access, then reload.";
    alert = true;
  } else if (wl.mode === 'shared') note = 'Shared live. Everyone in your household sees picks as they are made.';
  else note = 'Saved on this device only. Sign in to plan with the whole family.';

  const addEater = (e: FormEvent) => {
    e.preventDefault();
    const nm = newName.trim().slice(0, 20);
    if (!nm) return;
    const k = 'e' + Date.now().toString(36);
    wl.mutate(d => { d.eaters.push({ k, name: nm }); }, oldest);
    p.setActiveK(k);
    setNewName('');
  };

  const removeActive = () => {
    if (ae.k === 'me') return;
    if (removeArmed !== ae.k) {
      const k = ae.k;
      setRemoveArmed(k);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setRemoveArmed(cur => (cur === k ? '' : cur)), 4000);
      return;
    }
    const k = ae.k;
    setRemoveArmed('');
    p.setActiveK('me');
    wl.mutate(d => {
      d.eaters = d.eaters.filter(e => e.k !== k);
      Object.values(d.picks).forEach(w => { delete w[k]; });
    }, oldest);
  };

  const slots = [];
  for (let i = 0; i < WISH_MAX; i++) {
    const r = ids[i] ? p.byId(ids[i]) : undefined;
    slots.push(r ? (
      <div className="slot filled" style={hueStyle(r.h)} key={r.id}>
        <button type="button" className="slot-open" onClick={() => p.onOpen(r.id)} aria-label={`Open recipe: ${r.name}`}>
          <Thumb recipe={r} />
          <span>{r.name}</span>
        </button>
        {wl.readOnly ? null : (
          <button type="button" className="x" aria-label={`Remove ${r.name} from the wishlist`}
            onClick={() => wl.togglePick(wk, ae.k, r.id, oldest)}>
            <CloseIcon />
          </button>
        )}
      </div>
    ) : (
      <button type="button" className="slot" key={'empty' + i} disabled={wl.readOnly} onClick={p.onPick}>
        <span className="plus" aria-hidden="true">+</span>
        <span>Pick a dish</span>
      </button>
    ));
  }

  return (
    <section className="view" aria-labelledby="weekTitle">
      <div className="vhead">
        <h2 className="vtitle" id="weekTitle">Weekly wishlist</h2>
        <p>Everyone picks up to {WISH_MAX} dishes they would love this week. The most wanted dishes rise to the top.</p>
      </div>
      <div className="weeknav">
        <button type="button" className="btn icon" aria-label="Previous week" disabled={weekOffset <= MIN_WEEK_OFFSET}
          onClick={() => p.setWeekOffset(Math.max(MIN_WEEK_OFFSET, weekOffset - 1))}><ChevronLeftIcon /></button>
        <div className="weeklabel"><b>{weekRange(now, weekOffset)}</b><span>{weekTag(weekOffset)}</span></div>
        <button type="button" className="btn icon" aria-label="Next week" disabled={weekOffset >= MAX_WEEK_OFFSET}
          onClick={() => p.setWeekOffset(Math.min(MAX_WEEK_OFFSET, weekOffset + 1))}><ChevronRightIcon /></button>
      </div>
      <div className={'syncnote' + (alert ? ' alert' : '')}>{note}</div>
      <div className="panel">
        <h3>Who is choosing?</h3>
        <div className="chips wrapped" role="group" aria-label="Who is choosing">
          {ers.map(e => (
            <button type="button" className="chip" key={e.k} aria-pressed={e.k === ae.k} onClick={() => p.setActiveK(e.k)}>
              {e.name} <span className="muted">{picksFor(wl.myDoc, wk, e.k, exists).length}/{WISH_MAX}</span>
            </button>
          ))}
        </div>
        {wl.readOnly ? null : (
          <form className="addrow" onSubmit={addEater}>
            <label className="sr" htmlFor="eaterName">Add a family member</label>
            <input id="eaterName" type="text" maxLength={20} placeholder="Add someone, like Mia" autoComplete="off"
              value={newName} onChange={e => setNewName(e.target.value)} />
            <button className="btn" type="submit">Add</button>
          </form>
        )}
      </div>
      <div className="panel">
        <h3>{ae.k === 'me' ? 'Your wishes' : ae.name + "'s wishes"}</h3>
        <p className="note">{ids.length} of {WISH_MAX} chosen for {weekRange(now, weekOffset)}.</p>
        <div className="slots">{slots}</div>
        <div>
          <button type="button" className="linkbtn" hidden={ae.k === 'me' || wl.readOnly} onClick={removeActive}>
            {removeArmed === ae.k ? `Tap again to remove ${ae.name} and their picks` : `Remove ${ae.name}`}
          </button>
        </div>
      </div>
      <div className="vhead">
        <h3 className="subtitle">Most wanted</h3>
        <p>{quiet.length ? 'Still to choose: ' + quiet.join(', ') : 'Everyone has chosen.'}</p>
      </div>
      <div className="wants">
        {rows.length ? rows.map(r => (
          <button type="button" className="want" key={r.id} style={hueStyle(r.h)} onClick={() => p.onOpen(r.id)}>
            <Thumb recipe={r} />
            <span><b>{r.name}</b><small>{counts[r.id].join(', ')}</small></span>
            <span className="count-chip">{counts[r.id].length} {counts[r.id].length === 1 ? 'wish' : 'wishes'}</span>
          </button>
        )) : (
          <div className="empty"><strong>No wishes yet</strong><span>Pick a dish above and it will show up here for the whole family.</span></div>
        )}
      </div>
    </section>
  );
}
