import { useEffect, useRef, useState } from 'react';
import { AVOID_LIST, HUES } from '../lib/recipes';
import type { Profile } from '../types';
import { SprigLogo } from './icons';

interface Props {
  profile: Profile;
  setProfile: (fn: (p: Profile) => Profile) => void;
  hiddenCount: number;
  pickCount: number;
  onClearPicks: () => void;
}

export function Account({ profile, setProfile, hiddenCount, pickCount, onClearPicks }: Props) {
  const nm = profile.name.trim();
  const [armed, setArmed] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const clear = () => {
    if (!armed) {
      setArmed(true);
      timer.current = window.setTimeout(() => setArmed(false), 4000);
      return;
    }
    window.clearTimeout(timer.current);
    setArmed(false);
    onClearPicks();
  };
  const toggleAvoid = (a: string) =>
    setProfile(p => ({ ...p, avoid: p.avoid.includes(a) ? p.avoid.filter(x => x !== a) : [...p.avoid, a] }));

  return (
    <section className="view" aria-labelledby="acctTitle">
      <div className="vhead">
        <h2 className="vtitle" id="acctTitle">Account</h2>
        <p>These settings are saved on this device only. There is no login yet.</p>
      </div>
      <div className="panel profile">
        <div className="avatar" style={{ ['--ah' as string]: profile.hue }}>
          {nm ? nm.charAt(0).toUpperCase() : <SprigLogo />}
        </div>
        <div className="pfields">
          <label htmlFor="name">Your name</label>
          <input id="name" type="text" maxLength={20} placeholder="Chef" autoComplete="off" value={profile.name}
            onChange={e => setProfile(p => ({ ...p, name: e.target.value.slice(0, 20) }))} />
          <div className="swatches" role="group" aria-label="Avatar colour">
            {HUES.map(([h, n]) => (
              <button type="button" className="swatch" key={h} style={{ ['--sw' as string]: h }} aria-pressed={profile.hue === h}
                aria-label={`Avatar colour: ${n}`} onClick={() => setProfile(p => ({ ...p, hue: h }))} />
            ))}
          </div>
        </div>
      </div>
      <div className="panel">
        <h3>Foods to avoid</h3>
        <p className="note">Tap anything to hide it. Recipes that list these stay off Home. Recipes with no allergen information stay visible, so always check the labels.</p>
        <div className="chips wrapped avoid" role="group" aria-label="Foods to avoid">
          {AVOID_LIST.map(a => (
            <button type="button" className="chip" key={a} aria-pressed={profile.avoid.includes(a)} onClick={() => toggleAvoid(a)}>{a}</button>
          ))}
        </div>
        <p className="note">
          {profile.avoid.length ? `${hiddenCount} ${hiddenCount === 1 ? 'recipe is' : 'recipes are'} hidden from Home right now.` : 'Nothing is hidden right now.'}
        </p>
      </div>
      <div className="panel">
        <h3>My picks</h3>
        <p className="note">{pickCount ? `You have ${pickCount} ${pickCount === 1 ? 'pick' : 'picks'} saved.` : 'You have no picks yet.'}</p>
        <div>
          <button type="button" className="btn" disabled={pickCount === 0} data-confirm={armed ? '1' : undefined} onClick={clear}>
            {armed ? 'Tap again to clear all picks' : 'Clear my picks'}
          </button>
        </div>
      </div>
    </section>
  );
}
