import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

function Section({ open, emoji, title, children }: { open?: boolean; emoji: string; title: string; children: ReactNode }) {
  return (
    <details className="hsec" open={open}>
      <summary><span className="emo" aria-hidden="true">{emoji}</span>{title}</summary>
      {children}
    </details>
  );
}

export function HelpSheet({ onClose }: { onClose: () => void }) {
  const doneRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { doneRef.current?.focus(); }, []);
  return (
    <>
      <div className="pick-head">
        <div>
          <h2 id="sheet-title">How to use Sprig</h2>
          <small>Tap a heading to open it</small>
        </div>
        <button type="button" className="btn primary" ref={doneRef} onClick={onClose}>Done</button>
      </div>
      <div className="help-body">
        <Section open emoji="🍽️" title="Finding a dish">
          <ol>
            <li>On <b>Home</b>, pick a meal or a mood, or type a dish or ingredient in the search box.</li>
            <li>Tap a dish to see what is inside, who does which jobs and how to make it.</li>
            <li>Not sure? Press <b>Surprise me</b>.</li>
            <li>Tap the heart to keep it in <b>Favourites</b>.</li>
          </ol>
        </Section>
        <Section emoji="📅" title="Choosing dishes for the week">
          <ol>
            <li>Open the <b>Week</b> tab.</li>
            <li>Under <b>Who is choosing?</b>, tap your name. To add a child or someone without a phone, type their name and press <b>Add</b>.</li>
            <li>Tap a <b>+</b> box to pick up to 3 dishes you would love this week.</li>
            <li>You can also open any dish and press <b>Add to wishlist</b>.</li>
            <li><b>Most wanted</b> shows the dishes lots of people picked. Use the arrows at the top to look at other weeks.</li>
          </ol>
        </Section>
        <Section emoji="🥜" title="Foods to avoid">
          <ol>
            <li>Open <b>Account</b> and tap the foods you want to hide.</li>
            <li>Those dishes disappear from Home. In Favourites they stay, with a warning.</li>
          </ol>
          <p>Dishes with no allergen information stay visible, so always check the labels on packets.</p>
        </Section>
        <Section emoji="📱" title="Good to know">
          <ul>
            <li>Your name, colour, avoided foods and picks are saved on this phone only.</li>
            <li>If the note on the Week tab says <i>Saved on this device only</i>, your picks are not being shared with the family.</li>
            <li>The round arrow button appears when you scroll down and takes you back to the top.</li>
          </ul>
        </Section>
      </div>
    </>
  );
}
